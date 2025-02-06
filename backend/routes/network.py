import json
import os
import shutil
import tempfile
import boto3
import time
import pandas as pd
import ujson

from dateutil import parser
from datetime import datetime
from sqlalchemy.orm import Session

from database.crud import (
    update_params_in_db,
    update_network_in_db,
    add_data_reference,
    get_facility_ids,
    get_all_data_references,
    get_data_references_by_facility,
    get_params_from_db,
    get_networks_metadata_from_db,
    update_node_positions_batch,
    get_network_templates,
    get_template_from_db,
)

from flows_prep.utils import utils as ut
from flows_prep.utils import skeleton as sk
from pype_schema.parse_json import JSONParser

from fastapi import APIRouter, HTTPException, Response, Request
from fastapi.responses import StreamingResponse

from utils import upload_network_s3, upload_params_s3, create_network_for_positioning
from models import NetworkSkeleton, NetworkDataExample, UploadNetwork
from database.crud import (
    create_network_in_db,
    get_network_from_db,
    finalize_in_db,
    delete_network_from_db,
    get_checkpoint_data,
)
from database.session import session_manager
from database.db_models import Network

from logger import logger
from config import AWS_REGION, AWS_CLIENT_ID, AWS_CLIENT_SECRET, BUCKET_STORAGE

router = APIRouter(prefix="/network")

client = boto3.client(
    service_name="s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_CLIENT_ID,
    aws_secret_access_key=AWS_CLIENT_SECRET,
)


def create_network_from_temp(json_content: dict):
    try:
        temp_dir = tempfile.mkdtemp()
        temp_file_path = tempfile.mktemp(suffix=".json", dir=temp_dir)
        with open(temp_file_path, "w") as temp_file:
            json.dump(json_content, temp_file)
        parser = JSONParser(temp_file_path)
        network = parser.initialize_network()
        shutil.rmtree(temp_dir)

    except Exception as e:
        res = {"status": "failed", "addition": str(e)}
        logger.error(f"Network verification failed: {e}")
    else:
        res = {"status": "success", "network": network}
    return res


def create_param_skeleton(
    db: Session, user_id: str, network_id: str, bucket: str
) -> tuple:
    start = time.time()
    logger.info("Creating param skeleton...")

    # Init the client for S3 access
    client = boto3.client(
        service_name="s3",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_CLIENT_ID,
        aws_secret_access_key=AWS_CLIENT_SECRET,
    )

    # Create filename for network and parameters
    network_file_name = f"network_{network_id}.json"
    param_file_name = f"param_{network_id}.json"

    # Init a list to collect the names of downloaded files
    downloaded_files = []

    # Download network from S3
    merged_scada_data = get_all_data_references(
        db, user_id, network_id, "merged_scada_data"
    )[0]
    client.download_file(bucket, merged_scada_data.network.s3_key, network_file_name)
    downloaded_files.append(network_file_name)

    # Initialize the network object
    network = JSONParser(network_file_name).initialize_network()

    # Call SkeletonGenerator using the network object
    skel = sk.Skeleton(network)

    # Get the parameters from the skeleton
    parameters_file = skel.create_params_skeleton()

    # Update network in DB and upload to S3
    updated_network_dict = JSONParser.to_json(skel.network)
    ut.json_dump(updated_network_dict, network_file_name, indent=2)
    update_network_in_db(db, network_id, updated_network_dict)
    client.upload_file(network_file_name, bucket, merged_scada_data.network.s3_key)

    # Finalize parameters file
    facility_ids = [
        fids.facility_id for fids in get_facility_ids(db, user_id, network_id)
    ]
    for facility_id in facility_ids:
        if facility_id == network_id:
            continue
        merged_scada_data = get_data_references_by_facility(
            db, user_id, network_id, facility_id, "merged_scada_data"
        )[0]
        client.download_file(
            bucket, merged_scada_data.s3_key, merged_scada_data.file_name
        )
        downloaded_files.append(merged_scada_data.file_name)
        datetime_col = parameters_file[facility_id][sk.GENERAL_INFO_KEY][
            sk.DATETIME_VARNAME_KEY
        ]
        raw = pd.read_csv(merged_scada_data.file_name, usecols=[datetime_col])

        start_dt = parser.parse(raw[datetime_col].values[0]).strftime("%m-%d-%y")
        end_dt = parser.parse(raw[datetime_col].values[-1]).strftime("%m-%d-%y")

        parameters_file[facility_id][sk.GENERAL_INFO_KEY][sk.AVAIL_DATES_KEY] = [
            start_dt,
            end_dt,
        ]
        parameters_file[facility_id][sk.GENERAL_INFO_KEY][sk.CLEAN_DATES_KEY] = [
            start_dt,
            end_dt,
        ]
        parameters_file[facility_id][sk.GENERAL_INFO_KEY][sk.PATH_KEY] = (
            merged_scada_data.file_name
        )

    # Update parameters file in DB
    ut.json_dump(parameters_file, param_file_name, indent=2)
    downloaded_files.append(param_file_name)
    update_params_in_db(db, network_id, parameters_file)

    # Upload parameters file to S3
    s3_param_path = os.path.join(f"user_{user_id}", "params_data", param_file_name)
    client.upload_file(param_file_name, bucket, s3_param_path)

    # Add file reference to DB only if it does not exist yet
    if not get_all_data_references(db, user_id, network_id, "param_data"):
        param_ref_data = {
            "file_name": param_file_name,
            "data_type": "param_data",
            "s3_key": s3_param_path,
        }
        add_data_reference(db, user_id, network_id, network_id, param_ref_data)

    # Remove downloaded files
    for dlf in downloaded_files:
        os.remove(dlf)

    logger.info(f"Skeleton creation task took {(time.time() - start)} seconds")

    return param_file_name, network_file_name


def finalize_and_upload(db, network_id: str, user_id: str) -> Network:
    not_verified_network = get_network_from_db(db, network_id)
    # TODO: remove after we have a better solution
    for k, v in not_verified_network.items():
        if not isinstance(v, dict):
            continue
        input_c = v.get("input_contents", [])
        output_c = v.get("output_contents", [])
        if output_c and not input_c:
            input_c.append(output_c[0])
        if output_c:
            v["output_contents"] = list(set(output_c))
    res = create_network_from_temp(not_verified_network)
    if res["status"] == "failed":
        raise Exception("Failed to verify network")
    network_file_name = f"network_{network_id}.json"
    s3_network_path = os.path.join(
        f"user_{user_id}", "networks_data", network_file_name
    )
    finalize_in_db(db, network_id, s3_network_path, not_verified_network)
    network = get_network_from_db(db, network_id, True)
    upload_network_s3(network_id, user_id, network.network_data, BUCKET_STORAGE)
    return network


@router.post("/create")
def create_network(
    request: Request, input_data: NetworkDataExample, template_id: str = None
) -> dict:
    """
    Creates a network by generating a unique ID, creating a NetworkSkeleton object, and saving its
    data to a JSON file.

    Returns:
        dict: A dictionary containing the status of the network creation and the generated network ID.

    Raises:
        Exception: If an error occurs during network creation.

    Examples:
        >>> create_network()
        {'status': 'success', 'network_id': 'network_c5a14e20-5511-4e0a-ba42-0e8a3e2a9a1c'}
    """
    try:
        with session_manager() as db:
            data = NetworkDataExample(
                name_by_user=input_data.name_by_user,
                network_data=NetworkSkeleton().dict(),
            ).dict()
            data["user_id"] = request.state.user_id
            if template_id:
                obj = get_template_from_db(db, template_id)
                data["network_data"] = obj.network_data
                data["nodes_position"] = obj.nodes_position
            network_id = create_network_in_db(db, data)
    except Exception as e:
        logger.error(f"Network creation failed: {e}")
        res = {"status": "failure", "addition": str(e)}
    else:
        logger.info(f"Network created successfully")
        res = {"status": "success", "network_id": network_id}
    return res


@router.post("/validate")
async def upload_network(network_file: dict) -> dict:
    res = create_network_from_temp(network_file)
    if res["status"] == "failed":
        error_message = "Failed to verify network"
        raise HTTPException(status_code=400, detail=error_message)
    network_data = create_network_for_positioning(network_file)
    return network_data


@router.post("/upload")
async def add_positions_for_network(request: Request, network: UploadNetwork) -> dict:
    try:
        positions = {
            n["id"]: n["position"] for _, v in network.position_data.items() for n in v
        }
        data = {
            "name_by_user": network.network_name,
            "network_data": network.network,
            "user_id": request.state.user_id,
            "type": "baseline",
            "status": "created",
        }
        with session_manager() as db:
            network_id = create_network_in_db(db, data)
            update_node_positions_batch(db, network_id, positions)
    except Exception as e:
        msg = f"Failed to add positions data for network: {network_id}: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        return {"status": "success", "network_id": network_id}


@router.get("/{network_id}/get")
def get_network(network_id: str) -> dict:
    """
    Retrieves a network's data based on the provided network ID.

    Args:
        network_id (str): The unique ID of the network.
        user_id (str): The unique ID of the user.
        bucket (str): The name of the S3 bucket.

    Returns:
        dict: A dictionary containing the status of the retrieval and the network's data.

    Examples:
        >>> get_network("c5a14e20-5511-4e0a-ba42-0e8a3e2a9a1c")
        {'status': 'success', 'network': {'property1': 'value1', 'property2': 'value2'}}

    Raises:
        Exception: If an error occurs during network data retrieval.

    Note:
        The network data is stored in a JSON file, and the file name corresponds to the network ID.
    """
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id, True)

            res_data = {}
            if network.network_data == {
                "nodes": [],
                "connections": [],
                "virtual_tags": {},
            }:
                res_data = network.network_data
            else:
                for _id, data in network.network_data.items():
                    if _id in network.nodes_position:
                        data["position"] = network.nodes_position.get(_id, {})
                    res_data[_id] = data
    except Exception as e:
        msg = f"Failed to retrieve network data for {network_id}: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        return res_data


@router.delete("/{network_id}/{finalized}/delete")
def delete_network(network_id: str, finalized: bool) -> dict:
    try:
        with session_manager() as db:
            if finalized:
                network_s3_key = delete_network_from_db(db, network_id)
                client.delete_object(Bucket=BUCKET_STORAGE, Key=network_s3_key)
            else:
                delete_network_from_db(db, network_id)
    except Exception as e:
        msg = f"Failed to retrieve network data for {network_id}: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        return {"status": "success", "msg": f"Network: {network_id} has been deleted"}


@router.put("/{network_id}/reset")
def reset_network(network_id: str) -> dict:
    network = {"nodes": [], "connections": [], "virtual_tags": {}}
    position = {}
    try:
        with session_manager() as db:
            update_network_in_db(db, network_id, network, position)
    except Exception as e:
        msg = f"Failed to retrieve network data for {network_id}: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        return {"status": "success", "msg": f"Network: {network_id} has been reset"}


@router.get("/{network_id}/save-checkpoint")
def save_network_checkpoint(request: Request, network_id: str) -> dict:
    try:
        user_id = request.state.user_id
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        checkpoint_name = f"network_{network_id}_{timestamp}.json"
        s3_path = f"user_{user_id}/networks_data/{checkpoint_name}"
        with session_manager() as db:
            network = get_network_from_db(db, network_id, full_object=True)
            client.put_object(
                Body=json.dumps(network.network_data, indent=4),
                Bucket=BUCKET_STORAGE,
                Key=s3_path,
            )
            param_ref_data = {
                "file_name": checkpoint_name,
                "data_type": "network_data",
                "s3_key": s3_path,
                "nodes_position": network.nodes_position,
            }
            add_data_reference(db, user_id, network_id, network_id, param_ref_data)
    except Exception as e:
        msg = f"Failed to retrieve network data for {network_id}: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        return {
            "status": "success",
            "msg": f"Checkpoint saved for network: {network_id}",
        }


@router.get("/{network_id}/list/checkpoints")
def list_network_checkpoints(request: Request, network_id: str) -> dict:
    try:
        user_id = request.state.user_id
        with session_manager() as db:
            checkpoints = get_checkpoint_data(
                db, user_id, network_id, d_type="network_data"
            )
    except Exception as e:
        msg = f"Failed to retrieve network data for {network_id}: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        return {network_id: checkpoints}


@router.get("/{network_id}/{file_id}/restore-checkpoint")
def restore_network_checkpoint(request: Request, network_id: str, file_id: str) -> dict:
    try:
        user_id = request.state.user_id
        with session_manager() as db:
            checkpoint = get_checkpoint_data(
                db, user_id, network_id, "network_data", file_id
            )
            response = client.get_object(
                Bucket=BUCKET_STORAGE, Key=checkpoint.get("s3_key")
            )
            json_content = response["Body"].read().decode("utf-8")
            network_data = json.loads(json_content)
            update_network_in_db(db, network_id, network_data)
            update_node_positions_batch(
                db, network_id, checkpoint.get("nodes_positions")
            )
    except Exception as e:
        msg = f"Failed to retrieve network data for {network_id}: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        return {"status": "success", "msg": f"Network: {network_id} has been restored"}


@router.get("/{network_id}/finalize")
def finalize_network(request: Request, network_id: str) -> dict:
    """
    Verifies the integrity of a network's data based on the provided network ID.

    Args:
        request (Request): The FastAPI Request object.
        network_id (str): The unique ID of the network.

    Returns:
        dict: A dictionary containing the status of the verification, a boolean value indicating if the network is verified,
              and the verified network data.

    Raises:
        Exception: If an error occurs during network verification.

    Note:
        The network data is stored in a JSON file, and the file name corresponds to the network ID.
    """

    try:
        user_id = request.state.user_id
        with session_manager() as db:
            network = finalize_and_upload(db, network_id, user_id)
            if network.type == "baseline":
                _ = create_param_skeleton(db, user_id, network_id, BUCKET_STORAGE)
            else:
                parameters_data = get_params_from_db(db, network_id)
                upload_params_s3(
                    db, user_id, network_id, parameters_data, BUCKET_STORAGE
                )
            data = network.network_data

    except Exception as e:
        logger.error(f"Failed to finalize network: {e}")
        res = {"status": "failure", "verified": False, "addition": str(e)}
    else:
        logger.info("Network finalized successfully")
        res = {"status": "success", "verified": True, "network": data}
    return res


async def generate_json_content(data: list):
    yield ujson.dumps(data)


@router.get("/list/metadata")
def list_networks_metadata(request: Request) -> Response:
    try:
        user_id = request.state.user_id
        with session_manager() as db:
            data = get_networks_metadata_from_db(db, user_id)
    except Exception as e:
        msg = f"Failed to get networks metadata, error: {e.detail if hasattr(e, 'detail') else e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)

    return StreamingResponse(generate_json_content(data), media_type="application/json")


@router.get("/list/templates")
def list_networks_metadata() -> Response:
    try:
        with session_manager() as db:
            data = get_network_templates(db)
    except Exception as e:
        msg = f"Failed to get templates, error: {e.detail if hasattr(e, 'detail') else e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return StreamingResponse(generate_json_content(data), media_type="application/json")
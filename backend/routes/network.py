import json
import os
import shutil
import tempfile
import time
import ujson

from dateutil import parser
from datetime import datetime

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

from pype_schema.parse_json import JSONParser

from fastapi import APIRouter, HTTPException, Response, Request
from fastapi.responses import StreamingResponse

from utils import create_network_for_positioning
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

router = APIRouter(prefix="/network")

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
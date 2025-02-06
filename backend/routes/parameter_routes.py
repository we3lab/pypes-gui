import boto3
import ujson

from datetime import datetime

from fastapi import APIRouter, Request, HTTPException
from logger import logger

from flows_prep.utils import skeleton as sk
from database.crud import (session_manager, get_network_from_db, add_data_reference, get_checkpoint_data,
                           update_params_in_db, get_params_from_db)
from utils import upload_params_s3
from config import AWS_REGION, AWS_CLIENT_ID, AWS_CLIENT_SECRET, BUCKET_STORAGE

router = APIRouter(prefix='/parameters')

client = boto3.client(
    service_name="s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_CLIENT_ID,
    aws_secret_access_key=AWS_CLIENT_SECRET,
)


@router.post("/{network_id}/{facility_id}/save-mass-balances")
def save_mass_balances(request: Request, network_id: str, facility_id: str, mass_balances: dict):
    user_id = request.state.user_id
    try:
        with session_manager() as db:
            params = get_params_from_db(db, network_id)
            params[facility_id][sk.MASS_BALANCE_KEY] = mass_balances
            update_params_in_db(db, network_id, params)
            upload_params_s3(
                db, user_id, network_id, params, BUCKET_STORAGE
            )
        return {"status": "success"}
    except Exception as e:
        msg = f"Failed to save mass-balances for network: {network_id}, e: {e.detail if hasattr(e, 'detail') else e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)


@router.get("/{network_id}/{facility_id}/get-mass-balances")
def get_mass_balances(request: Request, network_id: str, facility_id: str):
    try:
        with session_manager() as db:
            params = get_params_from_db(db, network_id)
            mass_balances = params[facility_id][sk.MASS_BALANCE_KEY]
        return {"mass_balances": mass_balances}
    except Exception as e:
        msg = f"Failed to get mass-balances for network: {network_id}, e: {e.detail if hasattr(e, 'detail') else e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)


@router.post("/{network_id}/upload")
async def upload_params_for_network(request: Request, network_id: str, param_data: dict) -> dict:
    user_id = request.state.user_id
    try:
        with session_manager() as db:
            update_params_in_db(db, network_id, param_data)
            upload_params_s3(
                db, user_id, network_id, param_data, BUCKET_STORAGE
            )
    except Exception as e:
        msg = f"Failed upload param data to network: {network_id}: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        return {"status": "success", "network_id": network_id}


@router.get("/{network_id}/save-checkpoint")
def save_parameter_checkpoint(request: Request, network_id: str) -> dict:
    try:
        user_id = request.state.user_id
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        checkpoint_name = f"params_{network_id}_{timestamp}.json"
        s3_path = f"user_{user_id}/params_data/{checkpoint_name}"
        with session_manager() as db:
            network = get_network_from_db(db, network_id, full_object=True)
            client.put_object(Body=ujson.dumps(network.parameter_data), Bucket=BUCKET_STORAGE, Key=s3_path)
            param_ref_data = {
                "file_name": checkpoint_name,
                "data_type": "param_data_checkpoint",
                "s3_key": s3_path,
            }
            add_data_reference(db, user_id, network_id, network_id, param_ref_data)
    except Exception as e:
        msg = f"Failed to save parameter checkpoint for {network_id}: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        return {"status": "success", "msg": f"Parameter checkpoint saved for network: {network_id}"}


@router.get("/{network_id}/list/checkpoints")
def list_network_checkpoints(request: Request, network_id: str) -> dict:
    try:
        user_id = request.state.user_id
        with session_manager() as db:
            checkpoints = get_checkpoint_data(db, user_id, network_id, d_type="param_data_checkpoint")
    except Exception as e:
        msg = f"Failed to list parameter checkpoints for {network_id}: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        return {network_id: checkpoints}


@router.get("/{network_id}/restore-checkpoint")
def restore_network_checkpoint(request: Request, network_id: str, file_id: str) -> dict:
    try:
        user_id = request.state.user_id
        with session_manager() as db:
            checkpoint = get_checkpoint_data(db, user_id, network_id, "param_data_checkpoint", file_id)
            response = client.get_object(Bucket=BUCKET_STORAGE, Key=checkpoint.get("s3_key"))
            json_content = response['Body'].read().decode('utf-8')
            param_data = ujson.loads(json_content)
            update_params_in_db(db, network_id, param_data)
    except Exception as e:
        msg = f"Failed to restore parameter checkpoint: {file_id} for network: {network_id}: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        return {"status": "success", "msg": f"Parameter data has been restored for network: {network_id}"}
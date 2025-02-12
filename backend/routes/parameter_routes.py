import ujson

from datetime import datetime

from fastapi import APIRouter, Request, HTTPException
from logger import logger

from database.crud import (session_manager, get_network_from_db, add_data_reference, get_checkpoint_data,
                           update_params_in_db, get_params_from_db)

router = APIRouter(prefix='/parameters')


@router.get("/{network_id}/{facility_id}/get-mass-balances")
def get_mass_balances(request: Request, network_id: str, facility_id: str):
    try:
        with session_manager() as db:
            params = get_params_from_db(db, network_id)
            mass_balances = params[facility_id]["MASS_BALANCES"]
        return {"mass_balances": mass_balances}
    except Exception as e:
        msg = f"Failed to get mass-balances for network: {network_id}, e: {e.detail if hasattr(e, 'detail') else e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)


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
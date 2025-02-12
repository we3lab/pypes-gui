import codecs
import csv
import itertools
import ujson
import tempfile
import shutil
import pandas as pd

from fastapi import APIRouter, File, UploadFile, HTTPException, Response, Request
from fastapi.responses import StreamingResponse

from api_interface import FileUploadResponse, BillingData
from database.crud import (
    add_data_reference,
    get_data_reference,
    get_data_reference_path,
    delete_data_reference,
    get_all_data_references,
    get_all_data_references_user,
    get_data_references_by_facility,
    get_facility_ids,
    add_data_source, get_data_source_info, get_all_data_source_info, delete_data_source, add_saca_setup,
)
from database.session import session_manager
from logger import logger

router = APIRouter()


def check_tables_data(csv_files, dfs) -> bool:
    tables = {
        "first": [],
        "sizes": [],
        "diff": []
    }
    for i in range(len(csv_files)):
        tables["first"].append(dfs[i]["DateTime"].iloc[0])
        tables["sizes"].append(dfs[i].shape[0])
        tables["diff"].append(
            pd.to_datetime(dfs[i]["DateTime"].iloc[1]) - pd.to_datetime(dfs[i]["DateTime"].iloc[0]))

    return all(first.endswith('00') for first in tables["first"]) and len(set(tables["sizes"])) == 1 and \
        len(set(tables['diff'])) == 1


def merge_dfs(dfs) -> pd.DataFrame:
    merged_df = pd.merge(*dfs, on='DateTime')
    merged_df['DateTime'] = pd.to_datetime(merged_df['DateTime'])
    sorted_df = merged_df.sort_values(by='DateTime', ascending=True)
    return sorted_df


def check_and_merge_csvs(csv_files, dfs) -> pd.DataFrame:
    if len(csv_files) == 1:
        return dfs[0].sort_values(by='DateTime', ascending=True)

    if check_tables_data(csv_files, dfs):
        sorted_df = merge_dfs(dfs)
        logger.info("CSV files are compatible, merged successfully")
        return sorted_df
    else:
        logger.error("CSV files are not compatible")
        raise Exception("CSV files are not compatible")


def merge(db, user_id: str, network_id: str, facility_id: str, bucket: str) -> dict | None:
    file_objects = get_data_references_by_facility(db, user_id, network_id, facility_id, "scada_data")
    if len(file_objects) == 0:
        return
    file_names = [obj.s3_key.split('/')[-1] for obj in file_objects]
    folder_name = "scada_data"
    csv_files, dfs = get_csvs_s3(network_id, user_id, folder_name, bucket, file_names)
    sorted_df = check_and_merge_csvs(csv_files, dfs)
    merged_csv_data = sorted_df.to_csv(index=False)
    file_name = f"raw_{network_id}_{facility_id}.csv"
    merged_file_key = f"user_{user_id}/scada_data/{file_name}"
    file_ref_data = {
        "file_name": file_name,
        "data_type": "merged_scada_data",
        "s3_key": merged_file_key
    }
    # TODO: what if it is already exists? handle name constraint
    ### In theory a network can only be finalized once, so duplication should never be a problem
    file_id = add_data_reference(db, user_id, network_id, facility_id, file_ref_data)
    file_ref_data["file_id"] = file_id
    return file_ref_data


@router.post("/save/stream")
async def save_stream_to_db(request: Request, stream_info: dict) -> str:
    data_type = stream_info.get("data_type")
    metadata = stream_info.get("metadata")
    try:
        user_id = request.state.user_id
        with session_manager() as db:
            res = add_data_source(db, user_id, metadata, data_type)
            if res is None:
                raise Exception("Failed to save stream metadata")

    except Exception as e:
        msg = f"Failed to save stream metadata: {str(e.detail) if hasattr(e, 'detail') else str(e)}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return res


@router.get("/get/all/stream")
async def get_streams(request: Request) -> list:
    try:
        user_id = request.state.user_id
        with session_manager() as db:
            streams = get_all_data_source_info(db,user_id)
    except Exception as e:
        msg = f"Failed to get streams for user: {user_id}: {e.detail if hasattr(e, 'detail') else e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return streams


@router.delete("/delete/stream/{stream_id}")
async def delete_stream(request: Request, stream_id: str) -> dict:
    try:
        with session_manager() as db:
            stream_info = get_data_source_info(db, stream_id)
            if stream_info is None:
                raise Exception(f"Stream with id: {stream_id} not found")
            delete_data_source(db, stream_id)
    except Exception as e:
        msg = f"Failed to delete stream: {stream_id}: {e.detail if hasattr(e, 'detail') else e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "deleted", "stream_id": stream_id}


@router.post("/save/scada_setup")
async def save_scada_setup(request: Request, setups: list) -> dict:
    try:
        user_id = request.state.user_id
        with session_manager() as db:
            for setup in setups:
                network_id = setup["network_id"]
                facility_id = setup["facility_id"]
                data_source_id = setup["data_source_id"]
                # add_data_reference(db, user_id, network_id, facility_id, data_source_id)
                add_saca_setup(db, network_id, facility_id, data_source_id)
    except Exception as e:
        msg = f"Failed to save scada setup: {e.detail if hasattr(e, 'detail') else e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success"}


@router.get("/list/files/metadata")
def list_files_data(request: Request, network_id: str) -> list:
    try:
        user_id = request.state.user_id
        with session_manager() as db:
            data = get_all_data_references(db, user_id, network_id)
        file_metadata = [{"id": row.file_id, "name": row.file_name, "type": row.data_type} for row in data]
    except Exception as e:
        msg = f"Failed to list files metadata for network: {network_id}: {e.detail if hasattr(e, 'detail') else e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return file_metadata


async def generate_json_content(row_count: int, rows_per_page: int, data: list):
    yield ujson.dumps({
        "total_rows": row_count,
        "rows_per_page": rows_per_page,
        "total_pages": (row_count // rows_per_page) + 1,
        "data": data
    })


@router.post("/merge/scada_data")
async def merge_data(request: Request, network_id: str) -> FileUploadResponse:
    try:
        user_id = request.state.user_id
        with session_manager() as db:
            facility_ids = [fids.facility_id for fids in get_facility_ids(db, user_id, network_id)]
            for facility_id in facility_ids:
                file_ref_data = merge(db, user_id, network_id, facility_id, BUCKET_STORAGE)

    except Exception as e:
        msg = f"Failed to merge scdata data: {e.detail if hasattr(e, 'detail') else e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return FileUploadResponse(**file_ref_data)
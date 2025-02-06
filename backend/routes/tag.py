import boto3

from fastapi import APIRouter, HTTPException
from pype_schema.parse_json import JSONParser

from flows_prep.utils.network_helper import add_vtags_to_network
from routes.network import create_network_from_temp
from models import Tag
from logger import logger
from database.crud import get_network_from_db, update_network_in_db
from database.session import session_manager
from config import AWS_REGION, AWS_CLIENT_ID, AWS_CLIENT_SECRET

client = boto3.client(
    service_name="s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_CLIENT_ID,
    aws_secret_access_key=AWS_CLIENT_SECRET,
)

router = APIRouter(prefix='/network')


@router.post("/{network_id}/tag/add/{resource_id}")
def add_tag(network_id: str, resource_id: str, data: Tag) -> dict:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            data_to_add = {k: v for k, v in data.dict().items() if k != 'id'}
            network[resource_id]["tags"][data.id] = data_to_add
            update_network_in_db(db, network_id, network)
    except Exception as e:
        msg = f"Failed to add tag to network: {network_id}: {resource_id} : {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success"}


@router.post("/{network_id}/tag/edit/{resource_id}")
def edit_tag(network_id: str, resource_id: str, data: Tag) -> dict:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            parsed_data = {
                "units": data.units,
                "type": data.type,
                "source_unit_id": data.source_unit_id,
                "dest_unit_id": data.dest_unit_id,
                "totalized": data.totalized,
                "contents": data.contents
            }
            if resource_id in network:
                network[resource_id]["tags"][data.id] = parsed_data
                update_network_in_db(db, network_id, network)
            else:
                raise Exception(f"Resource (node/connection) \"{resource_id}\" is not in network")

    except Exception as e:
        msg = f"Failed to edit tag to network: {network_id}: {resource_id} : {str(e)}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success", "updated": parsed_data}


@router.get('/{network_id}/tag/get_parent_info/{resource_id}')
def get_parent_info(network_id: str, resource_id: str) -> dict:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            parsed_data = {
                "type": "",
                "data": {}
            }
            if network[resource_id]['type'] == "Wire" or network[resource_id]['type'] == "Pipe":
                parsed_data["type"] = "connection"
                parsed_data["data"] = {
                    "source": network[resource_id]["source"],
                    "destination": network[resource_id]["destination"],
                }
            else:
                parsed_data["type"] = "node"

    except Exception as e:
        msg = f"Failed to get info about tag: {network_id}: {resource_id} : {str(e)}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return parsed_data


@router.get("/{network_id}/tag/get/{tag_id}")
def get_tag(network_id: str, tag_id: str) -> dict:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            excluded = ['nodes', 'connections', 'virtual_tags']
            tags_list = [v.get('tags') for k, v in network.items() if k not in excluded and v.get('tags')]
            tags_dict = {k: v for tags in tags_list for k, v in tags.items()}
            tag_data = tags_dict[tag_id]
    except Exception as e:
        msg = f"Failed to get tag data for id: {tag_id} and network: {network_id}: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return tag_data


@router.get("/{network_id}/{node_id}/tag/get-all")
def get_all_tags_from_node(network_id: str, node_id: str) -> list:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            tag_data = network[node_id]["tags"]
            tag_keys = list(tag_data.keys())
    except Exception as e:
        msg = f"Failed to get tag data for node: {node_id} and network: {network_id}: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return tag_keys


@router.get("/{network_id}/{connection_id}/tag/get-all")
def get_all_tags_from_connection(network_id: str, connection_id: str) -> list:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            tag_data = network[connection_id]["tags"]
            tag_keys = list(tag_data.keys())
    except Exception as e:
        msg = f"Failed to get tag data for connection: {connection_id} and network: {network_id}: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return tag_keys


@router.delete("/{network_id}/tag/remove/{resource_id}/{tag_id}")
def remove_tag(network_id: str, resource_id: str, tag_id: str) -> dict:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            if tag_id not in network[resource_id]["tags"]:
                raise ValueError("No such tag")
            network[resource_id]["tags"] = {k: v for k, v in network[resource_id]["tags"].items() if k != tag_id}
            update_network_in_db(db, network_id, network)
    except Exception as e:
        msg = f"Failed to remove tag from network: {network_id}: {resource_id} : {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    success_msg = f"Removed tag: {tag_id} from network: {network_id}: {resource_id}"
    logger.info(success_msg)
    return {"status": "success", "msg": success_msg}


@router.get("/{network_id}/{node_id}/get_tag_units")
def get_tag_units(network_id: str, node_id: str) -> list:
    try:
        dropdown_list = ["total"]
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            node = network.get(node_id)
            num_units = node.get('num_units')
            if num_units:
                for i in range(1, num_units + 1):
                    dropdown_list.append(i)
    except Exception as e:
        msg = f"Failed to retrieve num_units for {node_id} from network: {network_id} : {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)

    return dropdown_list


@router.get("/{network_id}/get_all_tags")
def get_all_tags(network_id: str) -> list:
    try:
        with session_manager() as db:
            tags = []
            network = get_network_from_db(db, network_id)
            for key, data in network.items():
                if key != "nodes" and key != "connections" and key != "virtual_tags":
                    for tag_id, tag_data in data["tags"].items():
                        default_data = {
                            "type": "",
                            "units": "",
                            "contents": "",
                            "totalized": False,
                            "dest_unit_id": "",
                            "source_unit_id": "",
                        }
                        for k, v in tag_data.items():
                            default_data[k] = v
                        tags.append(
                            {
                                "parent": key,
                                "name": tag_id,
                                "data": default_data
                            }
                        )

    except Exception as e:
        msg = f"Failed to retrieve all tags from network: {network_id} : {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)

    return tags


@router.delete("/{network_id}/remove_all_tags")
def remove_all_tags(network_id: str) -> dict:
    try:
        with session_manager() as db:
            tags = get_all_tags(network_id)
            for tag in tags:
                remove_tag(network_id, tag["parent"], tag["name"])

    except Exception as e:
        msg = f"Failed to remove all tags from network: {network_id} : {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success", "msg": f"Removed all tags from network: {network_id}"}


@router.get("/{network_id}/virtual-tag/generate")
def generate_virtual_tags(network_id: str) -> dict:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            pype_network = create_network_from_temp(network).get("network")
            updated_network = add_vtags_to_network(pype_network)
            updated_net_json = JSONParser.to_json(updated_network)
            update_network_in_db(db, network_id, updated_net_json)
    except Exception as e:
        msg = f"Failed to generate virtual tags to network: {network_id}: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success"}


@router.put("/{network_id}/virtual-tag/update")
def update_virtual_tags(network_id: str, virtual_tag_data: dict) -> dict:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            for _id, virtual_tag in virtual_tag_data.items():
                if len(virtual_tag.keys()) > 0:
                    vt_tag_key = list(virtual_tag.keys())[0]
                    data = {k: v for k, v in virtual_tag[vt_tag_key].items()}
                    contents = data.get("contents")
                    tag_type = data.get("type")
                    network[_id]["virtual_tags"] = {f"{_id}_{contents}_{tag_type}": data}
                else:
                    network[_id]["virtual_tags"] = virtual_tag
            update_network_in_db(db, network_id, network)
    except Exception as e:
        msg = f"Failed to add virtual tags to network: {network_id}, data: {virtual_tag_data} : {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success"}
import os
import boto3
import json

from fastapi import APIRouter, HTTPException

from database.crud import (
    get_network_from_db,
    update_network_in_db,
    remove_node_positions,
)
from database.session import session_manager

from models import Node, Position
from logger import logger

from utils import data_to_network
from utility.node_utils import find_connection, remove_child_node, handle_tags
from routes.connection import remove_connection
from config import AWS_REGION, AWS_CLIENT_ID, AWS_CLIENT_SECRET


router = APIRouter(prefix="/network")
client = boto3.client(
    service_name="s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_CLIENT_ID,
    aws_secret_access_key=AWS_CLIENT_SECRET,
)


def add_parent_node_network(network: dict, obj: Node) -> dict:
    if obj.id in network:
        msg = f"{obj.id} is already present in the network"
        raise ValueError(msg)
    network["nodes"].append(obj.id)
    network = data_to_network(obj, network)
    return network


def add_child_node_network(network: dict, obj: Node, parent_id: str) -> dict:
    if obj.id in network:
        msg = f"{obj.id} is already present in the network"
        raise ValueError(msg)
    parent_node = network[parent_id]["nodes"]
    parent_node.append(obj.id)
    network = data_to_network(obj, network)
    return network


def del_conn(network_id: str, network: dict, node_id: str, parent_id: str) -> dict:
    conn = find_connection(network, node_id)
    for key in conn:
        rem = remove_connection(network_id, key)
        network = rem["network"]
    return network


def get_node_position(network_id: str, node_id: str):
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id, True)
            node_data = network.nodes_position.get(node_id)
            if node_data is None:
                raise ValueError()
    except Exception as e:
        msg = f"Failed to get node data for network: {network_id} and node: {node_id}: {str(e)}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return node_data


@router.post("/{network_id}/node/{node_id}/position/add")
def add_node_position(network_id: str, node_id: str, position: dict):
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            pos_data = (node_id, position)
            update_network_in_db(db, network_id, network, pos_data)
    except Exception as e:
        msg = f"Failed to add node position: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        return {"status": "success"}


def remove_node_network(
    network_id: str, network: dict, node_id: str, parent_id: str
) -> dict:
    if network[node_id]["type"] == "Facility" or network[node_id]["type"] == "Network":
        # delete child nodes
        for n in network[node_id]["nodes"]:
            logger.info("n:", n)
            removed = remove_child_node(network, n, node_id)
            network = removed["network"]
        # delete connections
        network = del_conn(network_id, network, node_id, parent_id)
        # remove node
        network = {k: v for k, v in network.items() if k != node_id}
        # remove from network nodes
        network["nodes"] = [n for n in network["nodes"] if n != node_id]
    elif (
        parent_id == "ParentNetwork"
        and network[node_id]["type"] != "Facility"
        and network[node_id]["type"] != "Network"
    ):
        checked = handle_tags(network, node_id)
        network = checked["network"]
        network = {k: v for k, v in network.items() if k != node_id}
        conn = find_connection(network, node_id)
        for key in conn:
            network = {k: v for k, v in network.items() if k != key}
            network["connections"] = [
                conn for conn in network["connections"] if conn != key
            ]
        network["nodes"] = [n for n in network["nodes"] if n != node_id]
    else:
        removed = remove_child_node(network, node_id, parent_id)
        network = removed["network"]

    return network


@router.get("/{network_id}/node/get/{node_id}")
def get_node_data(network_id: str, node_id: str) -> dict:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            node_data = network.get(node_id)
            if node_data is None:
                raise ValueError()
    except Exception as e:
        msg = f"Failed to get node data for network: {network_id} and node: {node_id}: {str(e)}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return node_data


@router.put("/{network_id}/node/{node_id}/position")
def update_node_position(network_id: str, node_id: str, position: Position) -> dict:
    try:
        with session_manager() as db:
            network_data = get_network_from_db(db, network_id)
            position_data = (node_id, position.dict())
            update_network_in_db(db, network_id, network_data, position_data)

    except Exception as e:
        msg = f"Failed to update node position: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success"}


@router.post("/{network_id}/node/flex/{parent_id}/add")
def add_flex_node(network_id: str, data: dict, parent_id: str = None) -> dict:
    try:
        if parent_id == "ParentNetwork":
            add_parent_node(network_id, data)
        else:
            add_child_node(network_id, parent_id, data)
    except Exception as e:
        msg = f"Failed to add node to {network_id}, error: {str(e)}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success"}


@router.post("/{network_id}/node/add")
def add_parent_node(network_id: str, data: dict) -> dict:
    """
    Adds a parent node (Facility) to a network based on the provided network ID and node data.

    Args:
        network_id (str): The unique ID of the network.
        data (dict): The data of the parent node to be added.
        user_id (str, optional): The unique ID of the user. Defaults to None (local).
        bucket (str, optional): The name of the bucket. Defaults to BUCKET_STORAGE.

    Returns:
        dict: A dictionary containing the status of the addition and the added node data.

    Examples:
        >>> add_parent_node("c5a14e20-5511-4e0a-ba42-0e8a3e2a9a1c", {"type": "Facility", "property1": "value1"})
        {'status': 'success', 'addition': {'property1': 'value1'}}

    Raises:
        Exception: If an error occurs during the addition of the parent node.

    """
    try:
        with session_manager() as db:
            node_type = data["type"]

            node_subclass = Node.get_subclass(node_type)
            obj = node_subclass(**data)

            position_data = (obj.id, data["position"])
            network = get_network_from_db(db, network_id)
            network = add_parent_node_network(network, obj)
            update_network_in_db(db, network_id, network, position_data)

    except Exception as e:
        msg = f"Failed to add parent node to {network_id}, error: {str(e)}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success"}


@router.delete("/{network_id}/node/remove/{parent_id}/{node_id}")
def remove_node(network_id: str, parent_id: str, node_id: str) -> dict:
    """
    Removes a node from a network based on the provided network ID, node ID, and parent node ID.

    Args:
        network_id (str): The unique ID of the network.
        node_id (str): The ID of the node to be removed.
        parent_id (str): The ID of the parent node (Facility). Only needed for child node removal. If it's a parent
        node, add a dummy string like "None".

    Returns:
        dict: A dictionary containing the status of the removal and the updated network data.

    Examples:
        >>> remove_node("c5a14e20-5511-4e0a-ba42-0e8a3e2a9a1c", "node_id_1", "parent_id_1")
        {'status': 'success', 'addition': {'nodes': [...], 'connections': {...}, ...}}

    Raises:
        Exception: If an error occurs during the removal of the node.

    """
    try:
        with session_manager() as db:
            network_data = get_network_from_db(db, network_id)
            if parent_id == "ParentNetwork":
                childnodes = network_data[node_id].get("nodes", [])
                pos_nodes_remove = []
                for node in childnodes:
                    pos_nodes_remove.append(node)
                pos_nodes_remove.append(node_id)

            network = remove_node_network(network_id, network_data, node_id, parent_id)
            update_network_in_db(db, network_id, network)
            if parent_id == "ParentNetwork":
                remove_node_positions(db, network_id, pos_nodes_remove)
            else:
                remove_node_positions(db, network_id, [node_id])
    except Exception as e:
        msg = f"Failed to remove node: {node_id} from network: {network_id}: {str(e)}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        return network


@router.post("/{network_id}/node/{parent_id}/child/add")
def add_child_node(network_id: str, parent_id: str, data: dict) -> dict:
    """
    Adds a child node to a parent node in a network based on the provided network ID, parent node ID, and child node
    data.

    Args:
        network_id (str): The unique ID of the network.
        parent_id (str): The ID of the parent node (Facility).
        data (dict): The data of the child node to be added.
        user_id (str, optional): The unique ID of the user. Defaults to None (local).
        bucket (str, optional): The name of the bucket. Defaults to BUCKET_STORAGE.
        copy (bool, optional): Whether use the network copy or not. Defaults to False.


    Returns:
        dict: A dictionary containing the status of the addition and the network data.

    Examples:
        >>> add_child_node("c5a14e20-5511-4e0a-ba42-0e8a3e2a9a1c", "parent_id_1", {"type": "ChildNode", "property1": "value1"})
        {'status': 'success', 'network': {'property1': 'value1'}}

    Raises:
        Exception: If an error occurs during the addition of the child node.

    """
    try:
        with session_manager() as db:
            node_type = data["type"]
            node_subclass = Node.get_subclass(node_type)
            obj = node_subclass(**data)

            position_data = (obj.id, data["position"])
            network = get_network_from_db(db, network_id)
            network = add_child_node_network(network, obj, parent_id)
            update_network_in_db(db, network_id, network, position_data)

    except Exception as e:
        msg = f"Failed to add child node to {network_id}, error: {str(e)}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        res = {"status": "success", "network": network}
    return res


@router.put("/{network_id}/{parent_id}/node/{node_id}/update")
def update_node(network_id: str, node_id: str, parent_id: str, data: dict) -> dict:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)

            data_to_add = {
                k: v for k, v in data.items() if k not in ["id", "position", "tags"]
            }
            if "volume" in data_to_add:
                data_to_add["volume (cubic meters)"] = data_to_add.pop("volume")
            for k, v in data_to_add.items():
                network[node_id][k] = v

            string_network = json.dumps(network)
            string_network_original = string_network
            string_network = string_network.replace(
                '"' + str(node_id) + '"', '"' + str(data["id"]) + '"'
            )
            if '"type": "' + str(data["id"]) + '"' not in string_network_original:
                string_network = string_network.replace(
                    '"type": "' + str(data["id"]) + '"',
                    '"type": "' + str(node_id) + '"',
                )
            replaced_network = json.loads(string_network)
            update_network_in_db(db, network_id, replaced_network)

            remove_node_positions(db, network_id, [node_id])
            add_node_position(network_id, data["id"], data["position"])

    except Exception as e:
        msg = f"Failed to update parent node: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        res = {"status": "success", "addition": data}
    return res


@router.put("/{network_id}/parent/node/{node_id}/update")
def update_parent_node(
    network_id: str, node_id: str, parent_id: str, data: Node
) -> dict:
    """
    Updates a parent node in a network based on the provided network ID, node ID, and updated data. Update means it
    removes the existing node (including connections) and adds a new node with the updated data. Data should be in a
    compatible form with the node type (models.py models).

    Args:
        network_id (str): The unique ID of the network.
        node_id (str): The ID of the parent node to be updated (Facility).
        parent_id (str): The ID of the parent node (Facility).
        data (dict): The updated data for the parent node.
        user_id (str, optional): The unique ID of the user. Defaults to None (local).
        bucket (str, optional): The name of the bucket. Defaults to BUCKET_STORAGE.

    Returns:
        dict: A dictionary containing the status of the update and the updated node data.

    Raises:
        Exception: If an error occurs during the update of the parent node.

    """
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            network = remove_node_network(network_id, network, node_id, parent_id)
            network = add_parent_node_network(network, data)
            update_network_in_db(db, network_id, network)

    except Exception as e:
        logger.error(f"Failed to update parent node: {e}")
        res = {"status": "failure", "addition": str(e)}
    else:
        res = {"status": "success", "addition": data}
    return res


@router.put("/{network_id}/node/{parent_id}/child/{node_id}/update")
def update_child_node(
    network_id: str, node_id: str, parent_id: str, data: dict
) -> dict:
    """
    Updates a child node in a network based on the provided network ID, parent node ID, child node ID, and updated
    data. Update means it removes the existing node (including connections) and adds a new node with the
    updated data. Data should be in a compatible form with the node type (models.py models).

    Args:
        network_id (str): The unique ID of the network.
        node_id (str): The ID of the child node to be updated.
        parent_id (str): The ID of the parent node (Facility).
        data (dict): The updated data for the child node.
        user_id (str, optional): The unique ID of the user. Defaults to None (local).
        bucket (str, optional): The name of the bucket. Defaults to BUCKET_STORAGE.


    Returns:
        dict: A dictionary containing the status of the update and the updated node data.

    Raises:
        Exception: If an error occurs during the update of the child node.

    """
    try:
        remove_node(network_id, node_id, parent_id)
        add_child_node(network_id, parent_id, data)
    except Exception as e:
        logger.error(f"Failed to update child node: {e}")
        res = {"status": "failure", "addition": str(e)}
    else:
        res = {"status": "success", "addition": data}
    return res


@router.get("/{network_id}/node/parent/{parent_id}/get")
def get_nodes_by_parent(network_id: str, parent_id: str) -> dict:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id, True)
            res_data = {}
            node_ids = network.network_data[parent_id]["nodes"]
            conn_ids = network.network_data[parent_id]["connections"]
            nodes = {node_id: network.network_data[node_id] for node_id in node_ids}
            for _id, data in nodes.items():
                if _id in network.nodes_position:
                    data["position"] = network.nodes_position.get(_id, {})
                res_data[_id] = data
            connections = {
                conn_id: network.network_data[conn_id] for conn_id in conn_ids
            }
    except Exception as e:
        msg = f"Failed to get nodes by parent: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        return {"nodes": res_data, "connections": connections}


@router.get("/{network_id}/node/all_nodes and_connections/get")
def get_all_nodes_and_connections(network_id: str) -> []:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            res_data = []
            for key, data in network.items():
                if key != "nodes" and key != "connections" and key != "virtual_tags":
                    res_data.append(key)

    except Exception as e:
        msg = f"Failed to get all nodes and connections: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)

    return res_data
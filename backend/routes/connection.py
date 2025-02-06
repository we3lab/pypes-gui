import json
import boto3

from fastapi import APIRouter, HTTPException

from database.crud import get_network_from_db, update_network_in_db
from database.session import session_manager
from models import Connection
from logger import logger
from utils import data_to_network
from utility.node_utils import handle_tags
from config import AWS_REGION, AWS_CLIENT_ID, AWS_CLIENT_SECRET

router = APIRouter(prefix='/network')
client = boto3.client(
    service_name="s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_CLIENT_ID,
    aws_secret_access_key=AWS_CLIENT_SECRET,
)


def add_conn_to_network(network: dict, obj: Connection) -> dict:
    network["connections"].append(obj.id)
    network = data_to_network(obj, network)
    return network


def add_child_conn_to_network(network: dict, obj: Connection, parent_id: str) -> dict:
    network[parent_id]["connections"].append(obj.id)
    network = data_to_network(obj, network)
    return network


def get_conn_parent_id(network: dict, source: str) -> str:
    if source in network["nodes"]:
        return "ParentNetwork"
    else:
        for parent in network["nodes"]:
            if "nodes" in network[parent]:
                if source in network[parent]["nodes"]:
                    return parent


def handle_contents(network: dict, conn_data: dict) -> dict:
    source_node = network[conn_data["source"]]
    destination_node = network[conn_data["destination"]]
    content = conn_data["contents"]

    entry_point = network.get(conn_data.get("entry_point"))
    exit_point = network.get(conn_data.get("exit_point"))

    if entry_point and exit_point:
        entry_point.setdefault("input_contents", []).append(content)
        exit_point.setdefault("output_contents", []).append(content)

    elif entry_point and not exit_point:
        source_node.setdefault("output_contents", []).append(content)
        entry_point.setdefault("input_contents", []).append(content)

    elif not entry_point and exit_point:
        destination_node.setdefault("input_contents", []).append(content)
        exit_point.setdefault("output_contents", []).append(content)

    else:
        destination_node.setdefault("input_contents", []).append(content)
        source_node.setdefault("output_contents", []).append(content)
    return network


def remove_conn_from_network(network: dict, connection_id: str) -> dict:
    source = network[connection_id]["source"]
    parent = get_conn_parent_id(network, source)
    if network[connection_id]["source"] in network["nodes"]:
        network["connections"] = [conn for conn in network["connections"] if conn != connection_id]
        checked = handle_tags(network, connection_id)
        network = checked["network"]

        network = {k: v for k, v in network.items() if k != connection_id}
    else:
        network = {k: v for k, v in network.items() if k != connection_id}
        network[parent]["connections"] = [conn for conn in network[parent]["connections"] if
                                          conn != connection_id]
    return network


@router.post("/{network_id}/connection/add")
def add_connection(network_id: str, data: dict) -> dict:
    try:

        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            if data["id"] in network:
                msg = f"{data['id']} is already present in the network"
                raise ValueError(msg)
            source = data["source"]
            parent = get_conn_parent_id(network, source)

            conn_data = {k: v for k, v in data.items() if k not in ["entry_point", "exit_point"]}
            obj = Connection(**conn_data)
            network = get_network_from_db(db, network_id)

            if parent == "ParentNetwork":
                network = add_conn_to_network(network, obj)
            else:
                network = add_child_conn_to_network(network, obj, parent)

            entry_point = data.get("entry_point")
            exit_point = data.get("exit_point")

            if (entry_point is not None) and (entry_point != ""):
                network[data['id']]["entry_point"] = data["entry_point"]
            if (exit_point is not None) and (exit_point != ""):
                network[data['id']]["exit_point"] = data["exit_point"]

            network = handle_contents(network, data)
            update_network_in_db(db, network_id, network)

    except Exception as e:
        msg = f"Failed create a connection between parent nodes: {str(e)}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        logger.info(f"Successfully created a connection between parent nodes")
        res = {"status": "success", "network": network}
    return res


@router.get("/{network_id}/connection/get/{connection_id}")
def get_connection_data(network_id: str, connection_id: str) -> dict:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            node_data = network.get(connection_id)
            if node_data is None:
                raise ValueError()
    except Exception as e:
        msg = f"Failed to get connection data for network: {network_id} and node: {connection_id}: {e}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return node_data


@router.post("/{network_id}/connection/{parent_id}/child/add")
def add_child_connection(network_id: str, parent_id: str, data: dict) -> dict:
    """
        Adds a child connection between child nodes of a parent node (facility).

        Args:
            network_id (str): The ID of the network.
            parent_id (str): The ID of the parent node.
            data (dict): The data for the child connection.


        Returns:
            dict: A dictionary containing the status of the operation and the network if successful.
                  The dictionary has the following structure:
                  {
                      "status": "success" or "failure",
                      "network": {...} (if status is "success", otherwise None)
                  }
        """
    try:
        with session_manager() as db:
            obj = Connection(**data)
            network = get_network_from_db(db, network_id)
            network = add_child_conn_to_network(network, obj, parent_id)
            update_network_in_db(db, network_id, network)

    except Exception as e:
        msg = f"Failed create a connection between child nodes: {str(e)}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        logger.info(f"Successfully created a connection between child nodes")
        res = {"status": "success", "network": network}
    return res


@router.delete("/{network_id}/connection/{connection_id}/remove")
def remove_connection(network_id: str, connection_id: str) -> dict:
    """
     Remove a connection from a network.

     Parameters:
     - network_id (str): Identifier of the network.
     - connection_id (str): Identifier of the connection to be removed.
     - parent_id (str): Identifier of the parent entity (facility) that contains the connection. Only needed for
        child node removal. If it's a parent node, add a dummy string like "None".

     Returns:
     - Dictionary: Response indicating the status of the removal process, and the network.
        {"status": "success", "removed": connection_id, "network": network}

     """
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            network = remove_conn_from_network(network, connection_id)
            update_network_in_db(db, network_id, network)

    except Exception as e:
        msg = f"Failed to remove connection: {str(e)}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        logger.info(f"Successfully removed connection: {connection_id}")
        res = {"status": "success", "removed": connection_id, "network": network}

    return res


@router.put("/{network_id}/connection/{connection_id}/update")
def update_connection(network_id: str, connection_id: str, data: dict) -> dict:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            data_to_add = {k: v for k, v in data.items() if k not in ['id', 'position', 'tags']}
            for k, v in data_to_add.items():
                network[connection_id][k] = v

            string_network = json.dumps(network)
            string_network = string_network.replace("\"" + str(connection_id) + "\"", "\"" + str(data['id']) + "\"")
            replaced_network = json.loads(string_network)
            update_network_in_db(db, network_id, replaced_network)

    except Exception as e:
        msg = f"Failed to update connection: {str(e)}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    else:
        logger.info(f"Successfully updated connection: {data['id']}")
        res = {"status": "success"}
    return res


@router.get("/{network_id}/connection/{connection_id}/get_similar")
def get_similar_connections(network_id: str, connection_id: str) -> []:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            connection = network[connection_id]
            source = connection["source"]
            destination = connection["destination"]
            similar_connections = []
            for conn_id, conn_data in network.items():
                if conn_id != "nodes" and conn_id != "connections" and conn_id != "virtual_tags":
                    if conn_data["type"] and conn_data.get("type") in ["Wire", "Pipe"]:
                        if conn_data["source"] == source and conn_data["destination"] == destination:
                            similar_connections.append(conn_id)
                        if conn_data["source"] == destination and conn_data["destination"] == source:
                            similar_connections.append(conn_id)
    except Exception as e:
        msg = f"Failed to get similar connections: {str(e)}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return similar_connections


@router.get("/{network_id}/connection/get_all_similar")
def get_all_similar_connections(network_id: str) -> []:
    try:
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            similar_connections = []
            for conn_id, conn_data in network.items():
                if conn_id != "nodes" and conn_id != "connections" and conn_id != "virtual_tags":
                    if conn_data["type"] and conn_data.get("type") in ["Wire", "Pipe"]:
                        simConns = get_similar_connections(network_id, conn_id)
                        if len(simConns) > 1:
                            for item in simConns:
                                similar_connections.append(item)
    except Exception as e:
        msg = f"Failed to get similar connections: {str(e)}"
        logger.error(msg)
        raise HTTPException(status_code=400, detail=msg)
    return list(set(similar_connections))
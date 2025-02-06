import pickle
import json

def read_json_file(file_path: str) -> dict:
    with open(file_path, 'r') as json_file:
        json_data = json.load(json_file)
    return json_data


def data_to_network(obj, network: dict) -> dict:
    """
     Converts data from an object and adds it to the provided network dictionary.

     Parameters:
         obj: The object containing the data to be added to the network.
         network (dict): The dictionary representing the network.

     Returns:
         dict: The updated network dictionary with the added data.
     """

    obj_dict = obj.dict(exclude_none=True)
    data_to_add = {k: v for k, v in obj_dict.items() if k not in ['id', 'position']}
    # TODO: check if other if/else statements are needed for new attributes
    if "volume" in data_to_add:
        data_to_add["volume (cubic meters)"] = data_to_add.pop("volume")

    network[obj.id] = data_to_add
    return network


def pickle_dump(object_, path):
    """Pickles an object (e.g. fitted model)

    Parameters
    ----------
    object_
        object to compress

    path : str
        path where the pickled object is saved
    """
    with open(path, "wb") as f:
        pickle.dump(object_, f)


def create_network_for_positioning(network: dict) -> dict:
    sub_nets = {k: v for k, v in network.items() if isinstance(v, dict) and v.get('type') in ['Facility', 'Network']}
    sub_nets["root"] = {
        "nodes": network["nodes"],
        "connections": network["connections"]
    }
    transformed_network = {
        k: {
            "initialNodes": [{
                "id": node_name,
                "type": network[node_name]['type'],
                "data": network[node_name]['tags'],
                "position": {'x': 0, 'y': 0}
            } for node_name in v['nodes']],
            "initialEdges": [{
                "id": conn_name,
                "type": network[conn_name]['type'],
                "source": network[conn_name]['source'],
                "target": network[conn_name]['destination']
            } for conn_name in v['connections']]
        } for k, v in sub_nets.items() if len(v.get('nodes', [])) > 0
    }
    return transformed_network
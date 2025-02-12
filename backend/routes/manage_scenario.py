import models
import time

from fastapi import APIRouter, Request

from database.crud import (copy_network_in_db, delete_scenario_in_db, get_network_from_db, get_params_from_db,
                           update_params_in_db)

from database.session import session_manager
from logger import logger
from routes.connection import remove_connection, add_child_connection, add_connection
from routes.node import add_child_node

router = APIRouter(prefix='/network')


def add_data(network: dict, node_subclass: models, node_id: str, data: dict) -> dict:
    obj = node_subclass(**data)
    data_to_add = {k: v for k, v in obj.__dict__.items() if k != 'id'}
    for key in data_to_add:
        network[node_id][key] = data_to_add[key]
    return network


def typecheck_add(network: dict, node_id: str, data: dict = {}) -> dict:

    wastewater_types = ["UntreatedSewage", "PrimaryEffluent", "SecondaryEffluent", "TertiaryEffluent"]
    biosolid_types = ["FatOilGrease", "FoodWaste", "TWAS", "TPS", "ThickenedSludgeBlend"]
    gas_types = ["Biogas", "NaturalGas"]
    storage_types = ["Tank", "Battery"]
    all_storage_node_types = wastewater_types + biosolid_types + gas_types + storage_types

    mapper = dict()
    mapper["starting_state"] = "starting state"
    mapper["hard_outflow_range"] = "hard outflow range"
    mapper["soft_outflow_range"] = "soft outflow range"
    mapper["soft_outflow_range_penalties"] = "soft outflow range penalties"
    mapper["wastewater_storage_penalty"] = "wastewater storage penalty"
    mapper["max_storage_HRT"] = "max storage HRT (hours)"
    mapper["HRT_constraint_window_increment"] = "HRT constraint window increment (hours)"
    mapper["flow_equalization_penalty"] = "flow equalization penalty"
    mapper["net_flow_variability_penalty"] = "net flow variability penalty"

    try:
        node_type = network[node_id]["type"]

        if node_type not in all_storage_node_types:
            return {"status": "success", "type": "not_storage", "data": dict()}
        elif not data:
            return {"status": "success", "type": "storage", "data": dict()}

        input_contents = network[node_id]['input_contents'][0]
        output_contents = network[node_id]['output_contents'][0]

        if node_type == "Battery":
            node_subclass = models.OptimizationBattery
            obj = node_subclass(**data)
            data_to_add = {mapper[k]: v
                           for k, v in obj.dict(exclude_none=True).items()
                           if (k != 'id') & (v is not None)}

        elif node_type == "Tank":
            if (input_contents in wastewater_types or output_contents
                    in wastewater_types):
                node_subclass = models.WasteWaterTank
                obj = node_subclass(**data)
                data_to_add = {mapper[k]: v
                               for k, v in obj.dict(exclude_none=True).items()
                               if (k != 'id') & (v is not None)}

            elif (input_contents in biosolid_types or output_contents
                  in biosolid_types):
                node_subclass = models.BioSolidsTank
                obj = node_subclass(**data)
                data_to_add = {mapper[k]: v
                               for k, v in obj.dict(exclude_none=True).items()
                               if (k != 'id') & (v is not None)}

            elif input_contents in gas_types or output_contents in gas_types:
                node_subclass = models.GasTank
                obj = node_subclass(**data)
                data_to_add = {mapper[k]: v
                               for k, v in obj.dict(exclude_none=True).items()
                               if (k != 'id') & (v is not None)}

        elif network[node_id]['type'] == "Cogeneration" or network[node_id]["type"] == "Reservoir":
            obj = {}
            data_to_add = {mapper[k]: v
                           for k, v in obj.dict(exclude_none=True).items()
                           if (k != 'id') & (v is not None)}

        else:
            raise Exception("Invalid Node type")

    except Exception as e:
        return {"status": "failure", "error": str(e)}
    else:
        return {"status": "success", "type": "storage", "data": data_to_add}


def get_connection_id(connection: dict) -> str:

    variable_type = "Flow"
    source_unit_id = "total"
    dest_unit_id = "total"

    source_unit_id = (
        ""
        if source_unit_id == "total" or source_unit_id is None
        else "_" + str(source_unit_id)
    )
    dest_unit_id = (
        ""
        if dest_unit_id == "total" or dest_unit_id is None
        else "_" + str(dest_unit_id)
    )

    contents_type = connection["contents"]
    contents_type = "_" + contents_type
    source_id = connection["source"]
    dest_id = connection["destination"]
    entry_point = "" if "entry_point" not in connection else connection["entry_point"]
    entry_point = "_" + entry_point if entry_point else ""
    exit_point = "" if "exit_point" not in connection else connection["exit_point"]
    exit_point = "_" + exit_point if exit_point else ""
    varname = "{}{}{}_{}{}{}{}_{}".format(
        source_id,
        exit_point,
        source_unit_id,
        dest_id,
        entry_point,
        dest_unit_id,
        contents_type,
        variable_type,
    )

    return varname


def manipulate_add_2_connection(network: dict, connection_id: str, new_node: dict) -> tuple:

    old_conn = network[connection_id]

    new_connection_1 = old_conn.copy()
    new_connection_1['tags'] = {}
    new_connection_2 = old_conn.copy()

    if ("entry_point" not in old_conn) & ("exit_point" not in old_conn):
        new_connection_1["destination"] = new_node["id"]
        new_connection_2["source"] = new_node["id"]
    elif "entry_point" in old_conn:
        new_connection_1["entry_point"] = new_node["id"]
        new_connection_2["source"] = new_node["id"]
        new_connection_2["destination"] = new_connection_2["entry_point"]
        del new_connection_2["entry_point"]
    else:
        new_connection_1["source"] = new_connection_1["exit_point"]
        new_connection_1["destination"] = new_node["id"]
        del new_connection_1["exit_point"]
        new_connection_2["exit_point"] = new_node["id"]

    new_connection_1["id"] = get_connection_id(new_connection_1)
    new_connection_2["id"] = get_connection_id(new_connection_2)

    return new_connection_1, new_connection_2


def add_connection_to_parameters(parameters: dict, connection_id: str, new_conn: dict, replace: bool):
    parameters["DESIGN_SIMULATION"]["NETWORK_MUTATIONS"][connection_id] = {
        "new_id": new_conn["id"],
        "replace": replace,
    }
    return parameters


def manipulate_params(network_id: str, parent_id: str, parameters: dict, connection_id: str, new_connection_2: dict,
                      manipulation: str) -> dict:
    if manipulation == 'series':
        remove_connection(network_id, connection_id, parent_id)
        parameters = add_connection_to_parameters(parameters, connection_id, new_connection_2, replace=True)

    elif manipulation == 'parallel':
        parameters = add_connection_to_parameters(parameters, connection_id, new_connection_2, replace=False)

    else:
        raise ValueError('Manipulation must be one of: series, parallel')
    return parameters


@router.post("/{network_id}/node/{parent_id}/{connection_id}/manipulate")
def apply_manipulation(request: Request, network_id: str, connection_id: str, parent_id, data: dict) -> dict:
    try:
        user_id = request.state.user_id
        storage_types = ['Battery', 'Tank']
        manipulation = data['manipulation']
        new_node = data['node']
        if new_node['type'] not in storage_types:
            raise ValueError('Node type must be one of: ' + str(storage_types))
        with session_manager() as db:
            network = get_network_from_db(db, network_id)
            params = get_params_from_db(db, network_id)

            add_child_node(network_id, parent_id, new_node)
            new_conn_1, new_conn_2 = manipulate_add_2_connection(network, connection_id, new_node)
            if "entry_point" in new_conn_1:
                add_connection(network_id, new_conn_1)
            else:
                add_child_connection(network_id, parent_id, new_conn_1)

            if "exit_point" in new_conn_2:
                res = add_connection(network_id, new_conn_2)
            else:
                res = add_child_connection(network_id, parent_id, new_conn_2)

            network = res["network"]
            params = manipulate_params(network_id, parent_id, params, connection_id, new_conn_2, manipulation)

            update_params_in_db(db, network_id, params)

    except Exception as e:
        logger.error(f"Failed to add scenario: {e}")
        res = {"status": "failure", "addition": str(e)}
    else:
        logger.info(f"Successfully added scenario")
        res = {"status": "success", "addition": data}
    return res


@router.get("/{network_id}/scenario/create")
def create_scenario(request: Request, network_id: str, scenario_name: str) -> dict:

    start = time.time()
    logger.info("Creating scenario...")

    try:
        user_id = request.state.user_id
        with session_manager() as db:
            scenario_network_id = copy_network_in_db(db, user_id, network_id, scenario_name)
    except Exception as e:
        logger.error(f"Failed to create scenario: {e}")
        res = {"status": "failure", "addition": str(e)}
    else:
        logger.info(f"Scenario created successfully, took {(time.time() - start)} seconds")
        res = {"status": "success", "scenario_network_id": scenario_network_id}
    return res

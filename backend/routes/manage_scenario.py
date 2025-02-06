import boto3
import models
import time

from fastapi import APIRouter, Request

from database.crud import (copy_network_in_db, delete_scenario_in_db, get_network_from_db, get_params_from_db,
                           update_params_in_db)

from database.session import session_manager
from utils import get_s3_path, upload_network_s3
from logger import logger
from routes.connection import remove_connection, add_child_connection, add_connection
from routes.node import add_child_node
from config import AWS_REGION, AWS_CLIENT_ID, AWS_CLIENT_SECRET, BUCKET_STORAGE

from flows_prep.utils import var_names as vn

router = APIRouter(prefix='/network')

client = boto3.client(
    service_name="s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_CLIENT_ID,
    aws_secret_access_key=AWS_CLIENT_SECRET,
)


def add_data(network: dict, node_subclass: models, node_id: str, data: dict) -> dict:
    obj = node_subclass(**data)
    data_to_add = {k: v for k, v in obj.__dict__.items() if k != 'id'}
    for key in data_to_add:
        network[node_id][key] = data_to_add[key]
    return network


# def typecheck_add(network: dict, data: dict, node_id: str) -> dict:
#     wastewater_types = ["UntreatedSewage", "PrimaryEffluent", "SecondaryEffluent", "TertiaryEffluent"]
#     biosolid_types = ["FatOilGrease", "FoodWaste", "TWAS", "TPS", "ThickenedSludgeBlend"]
#     gas_types = ["Biogas", "NaturalGas"]
#
#     if data["type"] == "Battery":
#         node_subclass = models.OptimizationBattery
#         network = add_data(network, node_subclass, node_id, data)
#
#     elif data["type"] == "Tank":
#         if data['input_contents'] in wastewater_types or data['output_contents'] in wastewater_types:
#             node_subclass = models.WasteWaterTank
#             network = add_data(network, node_subclass, node_id, data)
#
#         elif data['input_contents'] in biosolid_types or data['output_contents'] in biosolid_types:
#             node_subclass = models.BioSolidsTank
#             network = add_data(network, node_subclass, node_id, data)
#
#         elif data['input_contents'] in gas_types or data['output_contents'] in gas_types:
#             node_subclass = models.GasTank
#             network = add_data(network, node_subclass, node_id, data)
#
#     else:
#         raise ValueError("Invalid source type.")
#     return network


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


def modify_parameters(parameters_file: dict, node_id: str,
                      optimization_parameters_data: dict, node_type: str, design_parameters_data: dict = None) -> dict:

    # parameters['DESIGN_SIMULATION']['OPTIMIZED'][node_id] = network[node_id]
    if (node_type != 'storage') | bool(optimization_parameters_data):
        parameters_file[vn.DESIGN_SIM_VARS_KEY][vn.OPTIMIZED_KEY][node_id] = optimization_parameters_data

    if design_parameters_data:
        parameters_file[vn.DESIGN_SIM_VARS_KEY][vn.DESIGN_KEY][node_id] = design_parameters_data
    # else:
    #     parameters_file[vn.DESIGN_SIM_VARS_KEY][vn.DESIGN_KEY][node_id] = {
    #         "lifetime": 15,
    #         "capital cost": {
    #             "kwargs": {
    #                 "fixed_cost": 100000,
    #                 "volume": {
    #                     "units": "m**3",
    #                     "magnitude": 325
    #                 }
    #             },
    #             "method": "linear_cost_function"
    #         },
    #         "o&m cost": {
    #             "args": [
    #                 0.025
    #             ],
    #             "method": "fractional_o_m_cost_function"
    #         }
    #     }
    return parameters_file


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
    parameters[vn.DESIGN_SIM_VARS_KEY][vn.NETWORK_MUT_KEY][connection_id] = {
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


@router.post("/{network_id}/node/{node_id}/optimize")
def optimize_node(network_id: str, node_id: str, optimization_parameters: dict, design_parameters: dict = None) -> dict:

    start = time.time()
    logger.info("Applying optimization...")

    try:
        with session_manager() as db:

            # Get network and parameters data from DB entry
            network = get_network_from_db(db, network_id)
            parameters_file = get_params_from_db(db, network_id)

            # TODO: do we have to make this check? If frontend already sends the right parameters,
            #  maybe it is enough to just update with whatever we get
            # Check which node type we got and create the dict to add into parameters file
            res = typecheck_add(network, node_id, optimization_parameters)
            optimization_parameters_data = res["data"]
            node_type = res["type"]

            # Modify the OPTIMIZE and DESIGN sections in the parameters data
            parameters_file = modify_parameters(parameters_file, node_id,
                                                optimization_parameters_data, node_type, design_parameters)

            # Apply optimization does not modify network, so network data update is not necessary
            # update_network_in_db(db, network_id, network)

            # Update parameters data in DB
            update_params_in_db(db, network_id, parameters_file)

            # Parameters file is not in S3 yet, so no need to update it

    except Exception as e:
        logger.error(f"Failed to apply optimization: {e}")
        res = {"status": "failure", "addition": str(e)}
    else:
        logger.info(f"Successfully applied optimization, took {(time.time() - start)} seconds")
        res = {"status": "success", "addition": optimization_parameters_data}
    return res


@router.post("/{network_id}/node/{parent_id}/{connection_id}/manipulate")
def apply_manipulation(request: Request, network_id: str, connection_id: str, parent_id, data: dict) -> dict:

    # data = {
    #             "manipulation": "series",
    #             "node": {
    #                 "id": "RawTankToFacility",
    #                 "type": "Tank",
    #                 "elevation": 100,
    #                 "volume": 271.16,
    #                 "input_contents": 'UntreatedSewage',
    #                 "output_contents": 'UntreatedSewage',
    #                 "tags": {}
    #             }
    #         }

    try:
        user_id = request.state.user_id
        storage_types = ['Battery', 'Tank']
        manipulation = data['manipulation']
        new_node = data['node']
        if new_node['type'] not in storage_types:
            raise ValueError('Node type must be one of: ' + str(storage_types))
        # if ENV == "dev" and user_id is None:
        #     file_path = os.path.join(DATA_FOLDER, f"{network_id}.json")
        #     network = read_json_file(file_path)
        #     params_file_path = os.path.join(DATA_FOLDER, f"{params_id}.json")
        #     params = read_json_file(params_file_path)
        #     add_child_node(network_id, parent_id, new_node)
        #     new_conn_1, new_conn_2 = manipulate_add_2_connection(network, connection_id, new_node)
        #     add_child_connection(network_id, parent_id, new_conn_1)
        #     add_child_connection(network_id, parent_id, new_conn_2)
        #     params = manipulate_params(network_id, parent_id, params, connection_id,
        #                                new_conn_2, manipulation, bucket, user_id)
        #     write_json_file(params, params_file_path)
        #
        # elif ENV != 'dev' and user_id is not None:
        #     # params = get_params_s3(network_id, user_id, bucket, copy=True)
        #     # add_child_node(network_id, parent_id, new_node, user_id, bucket, copy)
        #     # network = get_network_s3(network_id, user_id, bucket, copy)
        #     # new_conn_1, new_conn_2 = manipulate_add_2_connection(network, connection_id, new_node)
        #     # add_child_connection(network_id, parent_id, new_conn_1, bucket, user_id, copy)
        #     # add_child_connection(network_id, parent_id, new_conn_2, bucket, user_id, copy)
        #     # params = manipulate_params(network_id, parent_id, params, connection_id, new_conn_2,
        #     #                            manipulation, bucket, user_id, copy)
        #     # upload_params_s3(network_id, user_id, params, bucket, copy)

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
            upload_network_s3(network_id, user_id, network, BUCKET_STORAGE)

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

            # Copy network in DB to create a new scenario network
            scenario_network_id = copy_network_in_db(db, user_id, network_id, scenario_name)

            # TODO: put all this into a finalize scenario (or the existing finalize network) endpoint
            # # Init the client for S3 access
            # client = boto3.client(
            #     service_name="s3",
            #     region_name=AWS_REGION,
            #     aws_access_key_id=AWS_CLIENT_ID,
            #     aws_secret_access_key=AWS_CLIENT_SECRET,
            # )
            #
            # # Init a list to collect the names of downloaded files
            # downloaded_files = []
            #
            # # Create filename for scenario network and parameters + get data reference for original parameters
            # scenario_network_file_name = f"network_{scenario_network_id}.json"
            # scenario_parameters_file_name = f"param_{scenario_network_id}.json"
            # param_data = get_all_data_references(db, user_id, network_id, "param_data")[0]
            #
            # # Download network and parameters from S3
            # client.download_file(BUCKET_STORAGE, param_data.network.s3_key, scenario_network_file_name) # TODO: change to get from db instead of S3
            # client.download_file(BUCKET_STORAGE, param_data.s3_key, scenario_parameters_file_name) # TODO: change to get from db instead of S3
            # downloaded_files.append(scenario_network_file_name)
            # downloaded_files.append(scenario_parameters_file_name)
            #
            # # Upload the scenario network file to S3
            # s3_scenario_network_path = os.path.join(f"user_{user_id}", "networks_data", scenario_network_file_name)
            # client.upload_file(scenario_network_file_name, BUCKET_STORAGE, s3_scenario_network_path)
            #
            # # Upload the scenario parameters file to S3
            # s3_scenario_parameters_path = os.path.join(f"user_{user_id}", "params_data", scenario_parameters_file_name)
            # client.upload_file(scenario_parameters_file_name, BUCKET_STORAGE, s3_scenario_parameters_path)
            #
            # # Add file reference for scenario parameters file
            # scenario_param_ref_data = {
            #     "file_name": scenario_parameters_file_name,
            #     "data_type": "param_data",
            #     "s3_key": s3_scenario_parameters_path
            # }
            # add_data_reference(db, user_id, scenario_network_id, scenario_network_id, scenario_param_ref_data)
            #
            # # Remove downloaded files
            # for dlf in downloaded_files:
            #     os.remove(dlf)

    except Exception as e:
        logger.error(f"Failed to create scenario: {e}")
        res = {"status": "failure", "addition": str(e)}
    else:
        logger.info(f"Scenario created successfully, took {(time.time() - start)} seconds")
        res = {"status": "success", "scenario_network_id": scenario_network_id}
    return res


# TODO: use finalize network instead of this
# @router.get("/{network_id}/scenario/{scenario_id}/save}")
# def save_scenario(network_id: str, scenario_id: str, user_id: str = None, bucket: str = "energy-inflows-data") -> dict:
#     try:
#         if ENV == "dev" and user_id is None:
#             network_path = os.path.join(DATA_FOLDER, f"network_copy_{network_id}.json")
#             network = read_json_file(network_path)
#             write_json_file(network, network_path.replace("network", f"{scenario_id}_{network_id}.json"))
#
#         elif ENV != 'dev' and user_id is not None:
#             # network_copy_path = get_s3_path(user_id, "networks_data", f"network_copy_{network_id}.json")
#             # scenario_path = get_s3_path(user_id, "networks_data", f"{scenario_id}_{network_id}.json")
#             # client.copy_object(Bucket=bucket, CopySource=bucket + "/" + network_copy_path, Key=scenario_path)
#             # client.delete_object(Bucket=bucket, Key=network_copy_path)
#
#             network = save_scenario_in_db(network_id)
#             upload_network_s3(network_id, user_id, network, bucket, copy=False)
#
#         else:
#             raise Exception("Invalid environment or user_id.")
#     except Exception as e:
#         logger.error(f"Failed to save scenario: {e}")
#         res = {"status": "failure", "addition": str(e)}
#     else:
#         res = {"status": "success"}
#     return res


@router.delete("/{network_id}/scenario/delete")
def delete_scenario(request: Request, network_id: str, bucket: str = "energy-inflows-data") -> dict:
    try:
        # if ENV == "dev" and user_id is None:
        #     network_path = os.path.join(DATA_FOLDER, f"network_copy_{network_id}.json")
        #     os.remove(network_path)
        #
        # elif ENV != 'dev' and user_id is not None:
        #     # network_copy_path = get_s3_path(user_id, "networks_data", f"network_copy_{network_id}.json")
        #     # client.delete_object(Bucket=bucket, Key=network_copy_path)
        with session_manager() as db:
            user_id = request.state.user_id
            # TODO: change the network:path generator to db call
            network_path = get_s3_path(user_id, "networks_data", f"network_{network_id}.json")
            delete_scenario_in_db(db, network_id)
            client.delete_object(Bucket=bucket, Key=network_path)

    except Exception as e:
        logger.error(f"Failed to delete network: {e}")
        res = {"status": "failure", "addition": str(e)}
    else:
        res = {"status": "success"}
    return res

#
# @router.get("/{network_id}/scenario/{scenario_id}/{action}")
# def scenario_action(network_id: str, scenario_id: str, action: str, user_id: str = None,
#                     bucket: str = "energy-inflows-data") -> dict:
#     try:
#         if ENV == "dev" and user_id is None and action == "continue":
#             select_network(network_id)
#         elif ENV != 'dev' and user_id is not None and action == "continue":
#             select_network(network_id, user_id, bucket)
#         elif action == "back":
#             pass
#         else:
#             raise Exception("Invalid environment or user_id.")
#
#     except Exception as e:
#         logger.error(f"{action} failed to complete: {e}")
#         res = {"status": "failure", "addition": str(e)}
#     else:
#         res = {"status": "success", "addition": network_id}
#     return res

# @router.get("/{network_id}/scenario/{scenario_id}/{action}")
# def scenario_action(network_id: str, scenario_id: str, action: str, user_id: str = None,
#                     bucket: str = "energy-inflows-data") -> dict:
#     try:
#         if ENV == "dev" and user_id is None and action == "continue":
#             select_network(network_id)
#         elif ENV != 'dev' and user_id is not None and action == "continue":
#             select_network(network_id, user_id, bucket)
#         elif action == "back":
#             pass
#         else:
#             raise Exception("Invalid environment or user_id.")
#
#     except Exception as e:
#         logger.error(f"{action} failed to complete: {e}")
#         res = {"status": "failure", "addition": str(e)}
#     else:
#         res = {"status": "success", "addition": network_id}
#     return res
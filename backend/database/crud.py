import json
import os
import uuid

import datetime

from sqlalchemy import and_, desc
from sqlalchemy.orm import Session

from database.session import session_manager
from database.db_models import (User, Network, FlowStatus, FileReferences, NetworkTemplates, ScadaDataSources,
                                DataStreamType, ScadaReferences, ScadaStreamStatus, NetworkScadaSetup)

from logger import logger


def is_email_in_db(db, email):
    existing_user = db.query(User).filter_by(email=email).first()
    return existing_user is not None


def create_user_in_db(email: str, password: str, status: str = "created") -> dict:
    new_user_id = uuid.uuid4()
    s3_key = f"user_{new_user_id}"
    with session_manager() as db:
        try:
            if is_email_in_db(db, email):
                return {"status": "failed", "message": "Email already exists"}
            new_user = User(id=new_user_id, email=email, password=password, status=status, s3_key=s3_key)
            db.add(new_user)
            db.commit()
        except Exception as e:
            db.rollback()
            logger.exception(f"Failed to create user: {e}")
            raise
        else:
            return {"status": "success", "message": str(new_user.id)}


def find_user_by_email(email: str) -> User:
    with session_manager() as db:
        try:
            user = db.query(User).filter(User.email == email).first()
        except Exception as e:
            db.rollback()
            logger.exception(f"Failed to find user: {str(e)}")
            raise
        else:
            return user


def create_network_in_db(db: Session, network_data: dict) -> str:
    try:
        network = Network(**network_data)
        db.add(network)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to create network: {e}")
        raise
    else:
        return network.id


def copy_network_in_db(db: Session, user_id: str, network_id: str, scenario_name: str) -> str:
    try:
        existing_network = db.query(Network).filter(Network.id == network_id,
                                                    Network.user_id == user_id).first()
        if not existing_network:
            raise ValueError("Existing network not found")

        # Create a copy of the existing network with desired changes
        new_id = uuid.uuid4()
        new_network = Network(
            id=new_id,
            user_id=existing_network.user_id,
            baseline_id=existing_network.id if existing_network.baseline_id is None else existing_network.baseline_id,
            name_by_user=scenario_name,
            network_data=existing_network.network_data,
            parameter_data=existing_network.parameter_data,
            type="scenario",
            status="created"
        )
        db.add(new_network)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to copy network: {e}")
        raise
    else:
        return new_network.id


def save_scenario_in_db(copied_network_id: str) -> dict:
    with session_manager() as db:
        try:
            copied_network = db.query(Network).filter(Network.id == copied_network_id).first()
            if not copied_network:
                raise ValueError("Copied network not found")

            copied_network.created = "finalized"
            copied_network.last_modification = datetime.datetime.now()
            db.commit()

            if isinstance(copied_network.network_data, str):
                network = json.loads(copied_network.network_data)
            elif isinstance(copied_network.network_data, dict):
                network = copied_network.network_data
            else:
                raise ValueError("Network data is not a string or dict")
        except Exception as e:
            db.rollback()
            logger.exception(f"Failed to save scenario: {e}")
            raise
        else:
            return network


def delete_scenario_in_db(db: Session, network_id: str) -> None:
    try:
        network = db.query(Network).filter(Network.id == network_id).first()
        if not network:
            raise ValueError("Network not found")

        network.status = "deleted"
        network.last_modification = datetime.datetime.now()
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to delete scenario: {e}")
        raise


def get_network_from_db(db: Session, network_id: str, full_object: bool = False):
    try:
        network = db.query(Network).filter(Network.id == network_id).first()
        if full_object:
            return network
        else:
            network_data = network.network_data
            return network_data
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to create network: {e}")
        raise


def get_template_from_db(db: Session, template_id: str):
    try:
        template = db.query(NetworkTemplates).filter(NetworkTemplates.id == template_id).first()
        return template
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to get template with id: {template_id}, error: {e}")
        raise


def delete_network_from_db(db: Session, network_id: str) -> str:
    try:
        network = db.query(Network).filter(Network.id == network_id).first()
        # Because of cascade="all, delete-orphan" in the schemas, this will delete from flow states and
        # file references too --> we have to do that because we use the network_id as a foreign key there
        s3_path = network.s3_key
        db.delete(network)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to delete network with id: {network_id}: {e}")
        raise
    else:
        return s3_path


def get_networks_metadata_from_db(db: Session, user_id: str):
    try:
        rows = db.query(Network.id, Network.name_by_user, Network.type, Network.status, Network.creation,
                        Network.last_modification).filter(Network.user_id == user_id).all()
        data = [
            {
                "id": str(row.id),  # Convert UUID to string
                "name": row.name_by_user,
                "type": row.type,
                "status": row.status,
                "creation_time": row.creation.strftime("%Y-%m-%d %H:%M:%S"),  # Convert to string
                "last_modification_time": row.last_modification.strftime("%Y-%m-%d %H:%M:%S"),  # Convert to string
            }
            for row in rows
        ]
        return data
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to create network: {e}")
        raise


def get_params_from_db(db: Session, network_id: str) -> dict:
    try:
        params = db.query(Network.parameter_data).filter(Network.id == network_id).first()
        return params[0]
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to create network: {e}")
        raise


def update_network_in_db(db: Session, network_id: str, network_data: dict, position_data: tuple = None) -> None:
    try:
        network = db.query(Network).filter(Network.id == network_id).first()
        if not network:
            raise ValueError("Network not found")

        network.network_data = network_data
        if position_data:
            node_id, position = position_data
            db_positions = network.nodes_position if network.nodes_position else {}
            updated_dict = {_id: position if _id == node_id else pos for _id, pos in db_positions.items()}
            # if node_id not in db_positions:
            updated_dict[node_id] = position
            network.nodes_position = updated_dict
        network.last_modification = datetime.datetime.now()
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to update network: {e}")
        raise


def remove_node_positions(db: Session, network_id: str, node_ids: list):
    try:
        network = db.query(Network).filter(Network.id == network_id).first()
        db_positions = network.nodes_position if network.nodes_position else {}
        updated_positions = {k: v for k, v in db_positions.items() if k not in node_ids}
        network.nodes_position = updated_positions
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to update node positions for network: {network_id}: {e}")
        raise


def update_node_positions_batch(db: Session, network_id: str, batch_position: dict):
    try:
        network = db.query(Network).filter(Network.id == network_id).first()
        network.nodes_position = batch_position
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to update node positions in batch for network: {network_id}: {e}")
        raise


def update_params_in_db(db: Session, network_id: str, params_data: dict) -> None:
    try:
        network = db.query(Network).filter(Network.id == network_id).first()
        if not network:
            raise ValueError("Network not found")

        network.parameter_data = params_data
        network.last_modification = datetime.datetime.now()
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to update network: {e}")
        raise


def finalize_in_db(db: Session, network_id: str, s3_network_path: str, updated_data: dict) -> None:
    try:
        network = db.query(Network).filter(Network.id == network_id).first()
        if not network:
            raise ValueError("Network not found")

        network.network_data = updated_data
        network.status = "finalized"
        network.last_modification = datetime.datetime.now()
        network.s3_key = s3_network_path
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to finalize network: {e}")
        raise


def add_data_reference(db: Session, user_id: str, network_id: str, facility_id: str, row_data: dict) -> str:
    try:
        new_file_ref = FileReferences(user_id=user_id, network_id=network_id, facility_id=facility_id, **row_data)
        db.add(new_file_ref)
        db.commit()
    except Exception as e:
        db.rollback()
        msg = f"Failed add data reference: {row_data.get('s3_key')} ---> error: {e}"
        logger.exception(msg)
        raise Exception(msg)
    else:
        return str(new_file_ref.file_id)


def get_data_reference(db: Session, user_id: str, network_id: str, facility_id: str, file_name: str) -> dict | None:
    try:
        row = db.query(FileReferences).filter(FileReferences.user_id == user_id,
                                              FileReferences.network_id == network_id,
                                              FileReferences.facility_id == facility_id,
                                              FileReferences.file_name == file_name).first()
        ref_data = {c.name: getattr(row, c.name) for c in row.__table__.columns}
    except Exception as e:
        db.rollback()
        # msg = f"Failed to get data reference for: {file_name} ---> error: {e}"
        # logger.error(msg)
        ref_data = None
    return ref_data


def get_data_reference_path(db: Session, file_id: str) -> str | None:
    try:
        row = db.query(FileReferences).filter(FileReferences.file_id == file_id).first()
        path = row.s3_key
    except Exception as e:
        db.rollback()
        path = None
    return path


def delete_data_reference(db: Session, file_id: str):
    try:
        row = db.query(FileReferences).filter(FileReferences.file_id == file_id).first()
        db.delete(row)
        db.commit()
    except Exception as e:
        logger.error(f"Failed to delete file: {file_id}, error: {e}")
        db.rollback()
        raise
    return


def get_data_references_by_facility(db: Session, user_id: str, network_id: str, facility_id: str,
                                    data_type: str | None = None) -> list:
    try:
        query = db.query(FileReferences).filter(FileReferences.user_id == user_id,
                                                FileReferences.network_id == network_id,
                                                FileReferences.facility_id == facility_id)
        if data_type is not None:
            query = query.filter(FileReferences.data_type == data_type)

        all_rows = query.all()
    except Exception as e:
        db.rollback()
        logger.error(
            f"Failed to get data references for network: {network_id}, facility: {facility_id}, type: {data_type} ---> error: {e}")
        all_rows = []
    return all_rows


def get_checkpoint_data(db: Session, user_id: str, network_id: str, d_type: str, file_id: str = None) -> list | dict:
    try:
        if file_id:
            q = (FileReferences.file_id == file_id)
        else:
            q = and_(FileReferences.user_id == user_id, FileReferences.network_id == network_id,
                     FileReferences.data_type == d_type)
        all_rows = db.query(FileReferences).filter(q).all()
        data = []
        for row in all_rows:
            row_data = {
                "file_id": row.file_id,
                "file_name": row.file_name,
                "last_modification": row.last_modification,
                "s3_key": row.s3_key,
            }
            if d_type == "network_data":
                row_data["nodes_positions"] = row.nodes_position
            data.append(row_data)
        fin_data = data[0] if file_id else data
    except Exception as e:
        db.rollback()
        msg = f"Failed to get checkpoints metadata for network: {network_id}, {e}"
        logger.error(msg)
        raise ValueError(msg)
    else:
        return fin_data


def get_all_data_references(db: Session, user_id: str, network_id: str, data_type: str = None) -> list:
    try:
        all_rows = db.query(FileReferences).filter(
            FileReferences.user_id == user_id,
            FileReferences.network_id == network_id,
        )
        if data_type:
            all_rows = all_rows.filter(FileReferences.data_type == data_type)
        data = all_rows.all()
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to get data references for network: {network_id}, type: {data_type} ---> error: {e}")
        data = []
    return data


def get_all_data_references_user(db: Session, user_id: str, data_type: str = None) -> list:
    try:
        all_rows = db.query(FileReferences).filter(
            FileReferences.user_id == user_id,
        )
        if data_type:
            all_rows = all_rows.filter(FileReferences.data_type == data_type)
        data = all_rows.all()
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to get data references for user: {user_id}, type: {data_type} ---> error: {e}")
        data = []
    return data


def get_user_id_from_db(network_id: str):
    with session_manager() as db:
        try:
            row = db.query(Network).filter(Network.id == network_id).first()
            user_id = row.user_id
        except Exception as e:
            db.rollback()
            msg = f"Failed to get user_id ---> error: {e}"
            logger.exception(msg)
            raise Exception(msg)
        else:
            return user_id


def add_flow_run_state(db: Session, user_id: str, flow_run_id: str, flow_name: str,
                       state: str, facility_id: str = None, network_id: str = None) -> None:
    try:
        new_flow_run = FlowStatus(user_id=user_id, flow_name=flow_name, network_id=network_id, flow_run_id=flow_run_id,
                                  status=state, facility_id=facility_id)
        db.add(new_flow_run)
        db.commit()
    except Exception as e:
        db.rollback()
        msg = f"Failed add flow_run to database ---> error: {e}"
        logger.exception(msg)
        raise Exception(msg)
    return


def update_flow_run_state(db: Session, user_id: str, network_id: str | None, flow_run_id: str, flow_name: str,
                          state: str, facility_id: str = None) -> None:
    try:
        row = db.query(FlowStatus).filter(FlowStatus.flow_run_id == flow_run_id).first()
        if row is None:
            add_flow_run_state(db, user_id, flow_run_id, flow_name, state, facility_id, network_id)
        else:
            row.status = state
            db.commit()
    except Exception as e:
        db.rollback()
        msg = f"Failed update flow_run in database ---> error: {e}"
        logger.exception(msg)
        raise Exception(msg)
    return


def list_flow_run_states(db: Session, user_id: str, network_id: str) -> list:
    try:
        rows = db.query(FlowStatus).filter(FlowStatus.user_id == user_id,
                                           FlowStatus.network_id == network_id).all()
        data = [{"flow_name": str(row.flow_name), "status": row.status, "date": row.last_modification} for row in rows]
    except Exception as e:
        db.rollback()
        msg = f"Failed get flow_run states from database ---> error: {e}"
        logger.exception(msg)
        raise Exception(msg)
    else:
        return data


def get_flow_run_ids_by_name(db: Session, network_id: str, facility_id: str, flow_name: str) -> list:
    flow_run_ids = []
    try:
        rows = (db.query(FlowStatus)
                .filter(FlowStatus.network_id == network_id,
                        FlowStatus.facility_id == facility_id,
                        FlowStatus.flow_name == flow_name)
                .order_by(desc(FlowStatus.creation))
                .all())
        for row in rows:
            flow_run_ids.append(str(row.flow_run_id))
    except Exception as e:
        db.rollback()
        msg = f"Failed get flow_run_id for flow: {flow_name} network: {network_id}, facility: {facility_id}. Error {e}"
        logger.exception(msg)
    else:
        return flow_run_ids


def get_network_templates(db: Session) -> list:
    raw_templates = db.query(NetworkTemplates.id, NetworkTemplates.template_name).all()
    return [{"id": str(t.id), "name": t.template_name} for t in raw_templates]


def get_facility_ids(db: Session, user_id: str, network_id: str) -> list:
    try:
        facility_ids = db.query(FileReferences.facility_id).filter(FileReferences.user_id == user_id,
                                                                   FileReferences.network_id == network_id).distinct()
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to get facility IDs network: {network_id} ---> error: {e}")
        facility_ids = []
    return facility_ids


def get_valid_facilities(db: Session, network_id: str) -> list:
    try:
        rows = db.query(FileReferences).filter(FileReferences.network_id == network_id,
                                               FileReferences.data_type == "scada_data").all()
        pre_filtered = list({r.facility_id for r in rows})
        facility_ids = [_id for _id in pre_filtered if _id != network_id]
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to get facility IDs network: {network_id} ---> error: {e}")
        facility_ids = []
    return facility_ids


def get_analytics_flow_run_state(db: Session, user_id: str, network_id: str, facility_id: str) -> str:
    try:
        status_mapping = {
            "Failed": "failed_run",
            "Completed": "completed_run",
            "Running": "ongoing_run"
        }
        row = db.query(FlowStatus).filter(FlowStatus.user_id == user_id,
                                          FlowStatus.network_id == network_id,
                                          FlowStatus.facility_id == facility_id,
                                          FlowStatus.flow_name == "analytics_complete_flow",
                                          ).order_by(desc(FlowStatus.creation)).first()
        if row is None:
            return "no_run"
        status = status_mapping[row.status]
        if status == "completed_run":
            all_files = get_data_references_by_facility(db, user_id, network_id, facility_id)
            file_types = {file.data_type for file in all_files}
            if not {"cards_file_data", "cost_chart_data", "usage_profile_data"}.issubset(file_types):
                # TODO: add this once trendplot flow is fixed
                # if not {"cards_file_data", "cost_chart_data", "usage_profile_data", "trend_plot_data"}.issubset(file_types):
                raise ValueError()
    except Exception as e:
        logger.error(
            f"Failed to get valid state for analytics, state set to failed run, network_id: {network_id}, facility_id: {facility_id}")
        db.rollback()
        status = "failed_run"
    return status


def add_data_source(db: Session, user_id: str, metadata: dict, type: DataStreamType = DataStreamType.GMAIL) -> str:
    # TODO: reconsider these pathes later, add server path later
    new_source_id = uuid.uuid4()
    s3_path = os.path.join(f"user_{user_id}", "scada_sources", f"data_stream_{new_source_id}")
    server_path = ""
    try:
        new_source = ScadaDataSources(
            id=new_source_id,
            user_id=user_id,
            type=type,
            source_metadata=metadata,
            s3_key=s3_path,
            server_path=server_path
        )
        db.add(new_source)
        db.commit()
        return str(new_source.id)
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create new data_stream, error: {e}")
        raise


def get_data_source_info(db: Session, source_id: str, type: DataStreamType = DataStreamType.GMAIL) -> dict:
    try:
        row = db.query(ScadaDataSources).filter(ScadaDataSources.id == source_id,
                                                ScadaDataSources.type == type).one()
        return {
            "id": str(row.id),
            "s3_key": row.s3_key,
            "server_path": row.server_path,
            "metadata": row.source_metadata
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to get error: {e}")
        raise


def get_all_data_source_info(db: Session, user_id: str) -> dict:
    try:
        all_rows = []
        rows = db.query(ScadaDataSources).filter(ScadaDataSources.user_id == user_id).all()
        for row in rows:
            all_rows.append({
                "id": str(row.id),
                "s3_key": row.s3_key,
                "server_path": row.server_path,
                "metadata": row.source_metadata
            })
        return all_rows
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to get error: {e}")
        raise


def delete_data_source(db: Session, source_id: str) -> None:
    try:
        row = db.query(ScadaDataSources).filter(ScadaDataSources.id == source_id).first()
        db.delete(row)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to delete data source: {source_id}, error: {e}")
        raise


def add_saca_setup( db: Session, network_id: str, facility_id: str, data_source_id: str) -> None:
    try:
        new_setup = NetworkScadaSetup(network_id=network_id, facility_id=facility_id, data_source_id=data_source_id)
        db.add(new_setup)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to add scada setup: {e}")
        raise


def add_scada_reference(db: Session, source_id: str, row_data: dict) -> str:
    try:
        new_scada_ref = ScadaReferences(data_source_id=source_id, **row_data)
        db.add(new_scada_ref)
        db.commit()
    except Exception as e:
        db.rollback()
        msg = f"Failed add scada reference: {row_data.get('s3_key')} ---> error: {e}"
        logger.exception(msg)
        raise Exception(msg)
    else:
        return str(new_scada_ref.id)


def get_scada_references_by_type(db: Session, status_filter: ScadaStreamStatus = ScadaStreamStatus.RAW) -> list:
    try:
        raw_rows = db.query(ScadaReferences).filter(ScadaReferences.status == status_filter).all()
        return [{"id": str(row.id), "s3_key": row.s3_key, "file_name": row.file_name} for row in raw_rows]
    except Exception as e:
        db.rollback()
        msg = f"Failed to get all scada references, error: {e}"
        logger.exception(msg)
        raise Exception(msg)
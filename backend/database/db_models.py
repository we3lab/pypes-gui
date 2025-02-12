import datetime
import uuid

from enum import Enum
from sqlalchemy import (Column, MetaData, String, UniqueConstraint, DateTime, ForeignKey, CheckConstraint,
                        Enum as SQLEnum)

from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

metadata = MetaData(naming_convention=convention)
Base = declarative_base(metadata=metadata)


class DataStreamType(Enum):
    GMAIL = "gmail"


class ScadaStreamStatus(Enum):
    FAILURE = "failure"
    RAW = "raw"
    PROCESSED = "processed"
    CLEANED = "cleaned"


class ScadaSourceType(Enum):
    STREAM = "stream"
    HISTORICAL = "historical"


def get_default_data_ref() -> dict:
    return {"file_ids": []}


class User(Base):
    __tablename__ = "user"
    id = Column(UUID(as_uuid=True), primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    creation = Column(DateTime, default=datetime.datetime.now)
    status = Column(String)
    s3_key = Column(String)

    networks = relationship("Network", back_populates="user")


class Network(Base):
    __tablename__ = "network"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id'), nullable=False)
    baseline_id = Column(UUID(as_uuid=True), ForeignKey('network.id'), nullable=True, default=None)
    creation = Column(DateTime, default=datetime.datetime.now)
    last_modification = Column(DateTime, default=datetime.datetime.now)
    name_by_user = Column(String, nullable=False)
    network_data = Column(JSONB)
    nodes_position = Column(JSONB)
    parameter_data = Column(JSONB, nullable=True)
    type = Column(String)
    status = Column(String)
    s3_key = Column(String, nullable=True)

    user = relationship("User", back_populates="networks")
    file_references = relationship("FileReferences", backref="network", cascade="all, delete-orphan")
    flow_states = relationship("FlowStatus", backref="network", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint('user_id', 'name_by_user', name='name_constraint'),
        CheckConstraint(
            "(type != 'baseline' OR baseline_id IS NULL)",
            name="chk_baseline_id_null_for_type_baseline"
        ),
    )


class FileReferences(Base):
    __tablename__ = "file_references"

    file_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id'), nullable=False)
    network_id = Column(UUID(as_uuid=True), ForeignKey('network.id'), nullable=True, default=None)
    facility_id = Column(String)
    file_name = Column(String)
    data_type = Column(String)
    s3_key = Column(String)
    last_modification = Column(DateTime, default=datetime.datetime.now)
    nodes_position = Column(JSONB, nullable=True)

    __table_args__ = (
        UniqueConstraint('user_id', 'network_id', 'facility_id', 'file_name', name='file_name_constraint'),
    )


class FlowStatus(Base):
    __tablename__ = "flow_states"

    flow_run_id = Column(UUID(as_uuid=True), primary_key=True)
    flow_name = Column(String, nullable=True, default=None)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id'), nullable=False)
    network_id = Column(UUID(as_uuid=True), ForeignKey('network.id'), nullable=True, default=None)
    facility_id = Column(String)
    creation = Column(DateTime, default=datetime.datetime.now)
    last_modification = Column(DateTime, default=datetime.datetime.now)
    status = Column(String)
    data_references = Column(JSONB, default=get_default_data_ref(), nullable=True)


class NetworkTemplates(Base):
    __tablename__ = "network_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    template_name = Column(String)
    network_data = Column(JSONB)
    nodes_position = Column(JSONB)

    creation = Column(DateTime, default=datetime.datetime.now)
    last_modification = Column(DateTime, default=datetime.datetime.now)

    __table_args__ = (
        UniqueConstraint('template_name', name='template_name_constraint'),
    )


class ScadaDataSources(Base):
    __tablename__ = "scada_data_source"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id'), nullable=True, default=None)
    type = Column(SQLEnum(DataStreamType), nullable=False)
    source_metadata = Column(JSONB)
    creation = Column(DateTime, default=datetime.datetime.now)
    s3_key = Column(String)
    server_path = Column(String)


class ScadaReferences(Base):
    __tablename__ = "scada_references"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    data_source_id = Column(UUID(as_uuid=True), ForeignKey('scada_data_source.id'))
    type = Column(SQLEnum(ScadaSourceType))
    status = Column(SQLEnum(ScadaStreamStatus))
    received_at = Column(DateTime, default=datetime.datetime.now)
    processed_at = Column(DateTime, default=datetime.datetime.now)
    file_name = Column(String)
    s3_key = Column(String)
    gmail_msg_id = Column(String)


class NetworkScadaSetup(Base):
    __tablename__ = "network_scada_setup"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    network_id = Column(UUID(as_uuid=True), ForeignKey('network.id'), nullable=True, default=None)
    facility_id = Column(String)
    data_source_id = Column(String)
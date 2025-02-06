from pydantic import BaseModel
from typing import Dict, List, Literal, Optional

# TODO: update these types to match PyPES v0.0.6
DIGESTER_TYPES = Literal["Aerobic", "Anaerobic"]

PUMP_TYPES = Literal["Constant", "VFD"]

CONTENTS_TYPES = Literal[
    "UntreatedSewage",
    "PrimaryEffluent",
    "SecondaryEffluent",
    "TertiaryEffluent",
    "TreatedSewage",
    "DrinkingWater",
    "PotableReuse",
    "NonpotableReuse",
    "Biogas",
    "NaturalGas",
    "GasBlend",
    "FatOilGrease",
    "PrimarySludge",
    "TPS",
    "WasteActivatedSludge",
    "TWAS",
    "Scum",
    "FoodWaste",
    "SludgeBlend",
    "ThickenedSludgeBlend",
    "Electricity",
    "Brine",
    "Seawater",
    "SurfaceWater",
    "Groundwater",
    "Stormwater",
    "Other"
]

NODE_TYPES = Literal[
    "Network",
    "Facility",
    "Pump",
    "Tank",
    "Reservoir",
    "Battery",
    "Digestion",
    "Cogeneration",
    "Clarification",
    "Filtration",
    "Screening",
    "Conditioning",
    "Thickening",
    "Aeration",
    "Chlorination",
    "Flaring"
]

TAG_TYPES = Literal[
    "Flow",
    "Volume",
    "Level",
    "Pressure",
    "Temperature",
    "RunTime",
    "RunStatus",
    "VSS",
    "TSS",
    "TDS",
    "COD",
    "BOD",
    "pH",
    "Conductivity",
    "Turbidity",
    "Rotation",
    "Efficiency",
    "StateOfCharge",
    "InFlow ",
    "OutFlow",
    "NetFlow",
    "Speed",
    "Frequency",
    "Concentration",
]


class Tag(BaseModel):
    id: str
    units: str = "meter^3 / day"  # TODO: ge the valid units later
    type: TAG_TYPES
    source_unit_id: int | str | None
    dest_unit_id: int | str | None
    totalized: bool = False
    contents: CONTENTS_TYPES

    class Config:
        schema_extra = {
            "example": {
                "id": "A5DigestorsgasflowtoCogen",
                "units": "foot ** 3 / minute",
                "type": "Flow",
                "source_unit_id": "total",
                "dest_unit_id": "total",
                "totalized": False,
                "contents": "Biogas"
            }
        }


class VirtualTag(BaseModel):
    id: str
    tags: List[str]
    operations: List[str]  # TODO: make it more obvious later.
    tag_type: TAG_TYPES
    contents: CONTENTS_TYPES

    class Config:
        schema_extra = {
            "example": {
                "id": "Conditioner_Biogas_OutFlow",
                "tags": [
                    "A5DigestorsgasflowtoCogen",
                    "A5WasteGasFlow"
                ],
                "operations": ["+"],
                "tag_type": "Flow",
                "contents": "Biogas"
            }
        }


class NetworkSkeleton(BaseModel):
    nodes: List[str] = []
    connections: List[str] = []
    virtual_tags: Dict = {}


class Flowrate(BaseModel):
    min: Optional[float]
    max: Optional[float]
    avg: float
    units: Optional[str]


class Position(BaseModel):
    x: int
    y: int


class Node(BaseModel):
    id: str
    type: NODE_TYPES
    position: Position
    input_contents: Optional[List[CONTENTS_TYPES]]
    output_contents: Optional[List[CONTENTS_TYPES]]
    tags: Dict

    def __init__(self, contents: Optional[CONTENTS_TYPES] = None, **data):
        super().__init__(**data)
        if contents is not None:
            self.input_contents = contents
            self.output_contents = contents

    @classmethod
    def get_subclass(cls, node_type: str):
        subclasses = cls.__subclasses__()
        for subclass in subclasses:
            if subclass.__name__ == node_type:
                return subclass
        return cls


class Network(Node):
    nodes: List[str] | List = []
    connections: List[str] | List = []


class Facility(Node):
    elevation: int = 0
    flowrate: Flowrate
    nodes: List[str] | List = []
    connections: List[str] | List = []


class Pump(Node):
    elevation: Optional[int]
    horsepower: int
    num_units: int = 1
    flowrate: Optional[Flowrate]
    pump_type: PUMP_TYPES = "VFD"


class Tank(Node):
    elevation: Optional[int] = 0
    volume: float


class Reservoir(Node):
    elevation: Optional[int] = 0
    volume: float


class Battery(Node):  # TODO: check energy-inflows readme: OPTIMIZED section
    capacity: int
    discharge_rate: int


class Digestion(Node):
    flowrate: Flowrate
    num_units: int
    volume: float
    digester_type: DIGESTER_TYPES = "Anaerobic"


class GenerationCapacity(BaseModel):
    min: Optional[float]
    max: Optional[float]
    avg: float
    units: Optional[str]


class Cogeneration(Node):
    generation_capacity: GenerationCapacity
    num_units: int


class Clarification(Node):
    flowrate: Flowrate
    num_units: int
    volume: float


class Filtration(Node):
    flowrate: Flowrate
    num_units: int
    volume: float


class Screening(Node):
    flowrate: Flowrate
    num_units: int


class Conditioning(Node):
    flowrate: Flowrate
    num_units: int


class Thickening(Node):
    flowrate: Flowrate
    num_units: int
    volume: float


class Aeration(Node):
    flowrate: Flowrate
    num_units: int
    volume: float


class Chlorination(Node):
    flowrate: Optional[Flowrate]
    num_units: int
    volume: float


class Flaring(Node):
    num_units: int
    flowrate: Optional[Flowrate]


class Connection(BaseModel):
    id: str
    type: str
    source: str
    destination: str
    contents: CONTENTS_TYPES
    tags: dict
    bidirectional: bool = False
    exit_point: str | None = None
    entry_point: str | None = None


class WasteWaterTank(BaseModel):
    starting_state: float
    hard_outflow_range: List[float]
    soft_outflow_range: List[float]
    soft_outflow_range_penalties: List[float]
    wastewater_storage_penalty: float
    max_storage_HRT: float
    HRT_constraint_window_increment: float
    flow_equalization_penalty: float
    net_flow_variability_penalty: float


class BioSolidsTank(BaseModel):
    starting_state: float
    max_storage_HRT: Optional[float]
    HRT_constraint_window_increment: Optional[float]


class GasTank(BaseModel):
    starting_state: float
    leakage: float


class OptimizationBattery(Battery):
    starting_state: float
    leakage: Optional[float]
    SOC_range: Optional[List[float]]
    RTE: Optional[float]
    SOH: Optional[float]


class UploadNetwork(BaseModel):
    position_data: dict
    network: dict
    network_name: str


class NetworkDataExample(BaseModel):
    # user_id: str
    name_by_user: str
    network_data: NetworkSkeleton = None
    type: str = "baseline"
    status: str = "created"

    class Config:
        schema_extra = {
            "example": {
                # "user_id": "8dbfd4d4-a494-43df-abeb-630e0b0a35e9",
                "name_by_user": "ElEstero",
                "type": "baseline",
                "status": "created"
            }
        }


class CreateUserInput(BaseModel):
    email: str
    password: str

    class Config:
        schema_extra = {
            "example": {
                "email": "test@test.test",
                "password": "test",
            }
        }
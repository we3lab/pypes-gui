"""Helper functions for PyPES UI"""
from pype_schema import utils
from pype_schema.units import u

def parse_unit_input(value_str, unit_str):
    """Parse user input with units"""
    try:
        if value_str and unit_str:
            value = float(value_str)
            return value * u(unit_str)
        elif value_str:
            return float(value_str)
        return None
    except:
        return None

def get_contents_enum():
    """Get all available ContentsType values"""
    return [member.name for member in utils.ContentsType]

def get_node_types():
    """Get all available node types"""
    return [
        "Junction", "Tank", "Reservoir", "Pump", "Treatment",
        "Disinfection", "Aeration", "Clarification", "Thickening",
        "Screening", "Conditioning", "Reactor", "Digestion",
        "Filtration", "ROMembrane", "Cogeneration", "Boiler",
        "Separator", "PRV"
    ]

def get_connection_types():
    """Get all available connection types"""
    return ["Pipe", "Wire"]
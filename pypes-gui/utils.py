"""Helper functions for PyPES UI"""
from pype_schema.units import u
from pype_schema import utils, tag


def remove_keys(original: dict, keys_to_remove: dict):
    "Remove the keys of one dictionary from another dictionary"
    keys_to_keep = set(original.keys()) - set(keys_to_remove.keys())
    return {k: original[k] for k in keys_to_keep}


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
        "Network", "Facility", "Junction", "Valve", "Tank", 
        "Reservoir", "Pump", "Aeration", "Clarification", "Thickening",
        "Screening", "Conditioning", "Reactor", "Digestion",
        "Filtration", "ROMembrane", "Cogeneration", "Boiler",
        "Separator", "PRV", "ModularUnit", "StaticMixer", "Battery",
        "Disinfection", "Chlorination", "UVSystem", "Flaring", 
    ]


def get_connection_types():
    """Get all available connection types"""
    return ["Pipe", "Wire", "Wireless", "Delivery"]


def get_tag_types():
    """Get all available TagType values"""
    return [member.name for member in tag.TagType]

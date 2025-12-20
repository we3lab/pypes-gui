"""Helper functions for PyPES UI"""
from pype_schema.units import u
from pype_schema import utils, tag


def quantity_to_unit_str(q):
    """Return a Pint unit string for a Quantity-like object, else None."""
    try:
        if q is None:
            return None
        # pint Quantity has `.units`
        return str(q.units)
    except Exception:
        return None


def get_unit_index(existing_quantity, allowed_units, fallback=0):
    """
    Pick the best default index for a unit selectbox, based on an existing pint Quantity.

    Preference order:
      1) exact string match to one of allowed_units
      2) dimensionality match (e.g., m**3/day vs MGD are both volume/time)
      3) fallback index
    """
    if not allowed_units:
        return 0

    unit_str = quantity_to_unit_str(existing_quantity)
    if not unit_str:
        return fallback

    # 1) exact match
    if unit_str in allowed_units:
        return allowed_units.index(unit_str)

    # 2) dimensionality match
    try:
        target_dim = u(unit_str).dimensionality
        for i, cand in enumerate(allowed_units):
            try:
                if u(cand).dimensionality == target_dim:
                    return i
            except Exception:
                continue
    except Exception:
        pass

    return fallback


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

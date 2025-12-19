"""Nodes tab for PyPES UI"""
# external dependencies
import streamlit as st

# pypes imports
from pype_schema.units import u
from pype_schema import node, tag
from pype_schema.utils import ContentsType, DigesterType, PumpType

# local imports
from utils import get_node_types, parse_unit_input, get_contents_enum, remove_keys


def render_nodes_tab(session_state):
    """Main function to render the nodes tab"""
    st.header("Node Management")
    col1, col2 = st.columns([1, 1])
    with col1:
        render_node_list(session_state)
    with col2:
        render_node_form(session_state)


def render_tag_selector(session_state, existing_tags=None, key_prefix=""):
    """Render tag selection interface (without creation - that's outside the form)
    
    Parameters
    ----------
    session_state : object
        Session state containing network
    existing_tags : dict, optional
        Currently attached tags
    key_prefix : str
        Prefix for widget keys to ensure uniqueness
    
    Returns
    -------
    dict
        Selected tags
    """
    st.write("**Tags**")
    
    # Get all available tags from network
    available_tags = {}
    if hasattr(session_state.network, 'tags'):
        available_tags = session_state.network.tags
    
    selected_tags = {}
    
    if existing_tags:
        st.caption(f"Currently attached: {len(existing_tags)} tag(s)")
    
    # Option to select existing tags
    if available_tags:
        tag_options = list(available_tags.keys())
        selected_tag_ids = st.multiselect(
            "Select Existing Tags",
            tag_options,
            default=list(existing_tags.keys()) if existing_tags else [],
            key=f"{key_prefix}_tag_select",
            help="Select tags to attach to this node. Create new tags in the Tags tab."
        )
        
        for tag_id in selected_tag_ids:
            selected_tags[tag_id] = available_tags[tag_id]
    else:
        st.info("No tags available. Create tags in the Tags tab first.")
    
    return selected_tags


def render_nested_nodes_selector(session_state, existing_nodes=None, key_prefix=""):
    """Render interface for selecting nodes to nest within a container node
    
    Parameters
    ----------
    session_state : object
        Session state containing network
    existing_nodes : dict, optional
        Currently nested nodes
    key_prefix : str
        Prefix for widget keys
    
    Returns
    -------
    dict
        Selected nodes
    """
    st.write("**Nested Nodes**")
    
    # Get all available nodes from network (excluding current node being edited)
    available_nodes = {}
    if hasattr(session_state.network, 'nodes'):
        available_nodes = {
            node.id: node for node in session_state.network.get_all_nodes(recurse=True)
            if node.id != session_state.selected_node  # Don't allow selecting self
        }
    
    selected_nodes = {}
 
    if available_nodes:
        node_options = list(available_nodes.keys())
        selected_node_ids = st.multiselect(
            "Select Nodes to Nest",
            node_options,
            default=list(existing_nodes.keys()) if existing_nodes else [],
            key=f"{key_prefix}_node_select",
            help="Select nodes that should be contained within this node"
        )
        
        for node_id in selected_node_ids:
            selected_nodes[node_id] = available_nodes[node_id]
    else:
        st.info("No available nodes to nest. Create nodes first.")
    
    return selected_nodes


def render_nested_connections_selector(session_state, existing_connections=None, key_prefix=""):
    """Render interface for selecting connections to nest within a container node
    
    Parameters
    ----------
    session_state : object
        Session state containing network
    existing_connections : dict, optional
        Currently nested connections
    key_prefix : str
        Prefix for widget keys
    
    Returns
    -------
    dict
        Selected connections
    """
    st.write("**Nested Connections**")
    
    # Get all available connections from network
    available_connections = {}
    if hasattr(session_state.network, 'connections'):
        available_connections = {conn.id: conn for conn in session_state.network.get_all_connections(recurse=True)}
    
    selected_connections = {}

    if available_connections:
        conn_options = list(available_connections.keys())
        selected_conn_ids = st.multiselect(
            "Select Connections to Nest",
            conn_options,
            default=list(existing_connections.keys()) if existing_connections else [],
            key=f"{key_prefix}_conn_select",
            help="Select connections that should be contained within this node"
        )
        
        for conn_id in selected_conn_ids:
            selected_connections[conn_id] = available_connections[conn_id]
    else:
        st.info("No available connections to nest. Create connections first.")
    
    return selected_connections


def render_node_list(session_state):
    """Render list of existing nodes"""
    search = st.text_input("Search nodes", "")
    st.subheader("Top Level Nodes")
    if session_state.network.nodes:
        filtered_nodes = {
            k: v for k, v in session_state.network.nodes.items()
            if search.lower() in k.lower() or search.lower() in type(v).__name__.lower()
        }
        
        for node_id, node_obj in filtered_nodes.items():
            node_type = type(node_obj).__name__
            
            with st.expander(f"**{node_id}** ({node_type})"):
                st.write(f"**Type:** {node_type}")
                
                # Display common attributes
                if hasattr(node_obj, 'input_contents'):
                    st.write(f"**Input:** {[c.name for c in node_obj.input_contents]}")
                if hasattr(node_obj, 'output_contents'):
                    st.write(f"**Output:** {[c.name for c in node_obj.output_contents]}")
                
                if hasattr(node_obj, 'elevation') and node_obj.elevation:
                    st.write(f"**Elevation:** {node_obj.elevation}")
                if hasattr(node_obj, 'volume') and node_obj.volume:
                    st.write(f"**Volume:** {node_obj.volume}")
                if hasattr(node_obj, 'num_units'):
                    st.write(f"**Units:** {node_obj.num_units}")
                if hasattr(node_obj, 'min_flow') and node_obj.min_flow:
                    st.write(f"**Min Flow:** {node_obj.min_flow}")
                if hasattr(node_obj, 'max_flow') and node_obj.max_flow:
                    st.write(f"**Max Flow:** {node_obj.max_flow}")
                if hasattr(node_obj, 'design_flow') and node_obj.design_flow:
                    st.write(f"**Design Flow:** {node_obj.design_flow}")
                
                # Pump-specific
                if hasattr(node_obj, 'pump_type') and node_obj.pump_type:
                    st.write(f"**Pump Type:** {node_obj.pump_type.name}")
                if hasattr(node_obj, 'power_rating') and node_obj.power_rating:
                    st.write(f"**Power Rating:** {node_obj.power_rating}")
                
                # Digester-specific
                if hasattr(node_obj, 'digester_type') and node_obj.digester_type:
                    st.write(f"**Digester Type:** {node_obj.digester_type.name}")
                
                # Generator/Cogeneration-specific
                if hasattr(node_obj, 'min_gen') and node_obj.min_gen:
                    st.write(f"**Min Generation Capacity:** {node_obj.min_gen}")
                if hasattr(node_obj, 'max_gen') and node_obj.max_gen_val:
                    st.write(f"**Max Generation Capacity:** {node_obj.max_gen}")
                if hasattr(node_obj, 'design_gen') and node_obj.design_gen:
                    st.write(f"**Design Generation Capacity:** {node_obj.design_gen}")
                if hasattr(node_obj, 'thermal_efficiency') and node_obj.thermal_efficiency:
                    st.write(f"**Thermal Efficiency:** {node_obj.thermal_efficiency}")
                if hasattr(node_obj, 'electrical_efficiency') and node_obj.electrical_efficiency:
                    st.write(f"**Electrical Efficiency:** {node_obj.electrical_efficiency}")
                
                # UV System-specific
                if hasattr(node_obj, 'intensity') and node_obj.intensity:
                    st.write(f"**Intensity:** {node_obj.intensity}")
                if hasattr(node_obj, 'area') and node_obj.area:
                    st.write(f"**Area:** {node_obj.area}")
                
                # Clarification/Thickening/RO-specific
                if hasattr(node_obj, 'settling_time') and node_obj.settling_time:
                    st.write(f"**Settling Time:** {node_obj.settling_time}")
                if hasattr(node_obj, 'selectivity') and node_obj.selectivity:
                    st.write(f"**Selectivity:** {node_obj.selectivity}")
                if hasattr(node_obj, 'permeability') and node_obj.permeability:
                    st.write(f"**Permeability:** {node_obj.permeability}")
                
                # Disinfection/Chlorination-specific
                if hasattr(node_obj, 'residence_time') and node_obj.residence_time:
                    st.write(f"**Residence Time:** {node_obj.residence_time}")
                if hasattr(node_obj, 'dosing_rate') and node_obj.dosing_rate:
                    st.write(f"**Dosing Rate:** {node_obj.dosing_rate}")
                
                # Reactor-specific
                if hasattr(node_obj, 'pH') and node_obj.pH:
                    st.write(f"**pH:** {node_obj.pH}")
                
                # Battery-specific
                if hasattr(node_obj, 'energy_capacity') and node_obj.energy_capacity:
                    st.write(f"**Energy Capacity:** {node_obj.energy_capacity}")
                if hasattr(node_obj, 'rte') and node_obj.rte:
                    st.write(f"**Round Trip Efficiency:** {node_obj.rte}")
                if hasattr(node_obj, 'leakage') and node_obj.leakage:
                    st.write(f"**Leakage:** {node_obj.leakage}")
                if hasattr(node_obj, 'charge_rate') and node_obj.charge_rate:
                    st.write(f"**Charge Rate:** {node_obj.charge_rate}")
                if hasattr(node_obj, 'discharge_rate') and node_obj.discharge_rate:
                    st.write(f"**Discharge Rate:** {node_obj.discharge_rate}")
                
                # Valve/PRV-specific
                if hasattr(node_obj, 'diameter') and node_obj.diameter:
                    st.write(f"**Diameter:** {node_obj.diameter}")
                if hasattr(node_obj, 'pressure_setting') and node_obj.pressure_setting:
                    st.write(f"**Pressure Setting:** {node_obj.pressure_setting}")

                # Display tags if present
                if hasattr(node_obj, 'tags') and node_obj.tags:
                    st.write(f"**Tags:** {', '.join(node_obj.tags.keys())}")
                
                # Display nested nodes for containers
                if hasattr(node_obj, 'nodes') and node_obj.nodes:
                    st.write(f"**Nested Nodes ({len(node_obj.nodes)}):** {', '.join(node_obj.nodes.keys())}")
                
                # Display nested connections for containers
                if hasattr(node_obj, 'connections') and node_obj.connections:
                    st.write(f"**Nested Connections ({len(node_obj.connections)}):** {', '.join(node_obj.connections.keys())}")
                
                btn_col1, btn_col2 = st.columns(2)
                with btn_col1:
                    if st.button(f"Edit", key=f"edit_{node_id}"):
                        session_state.selected_node = node_id
                        st.rerun()
                with btn_col2:
                    if st.button(f"Delete", key=f"del_{node_id}"):
                        del session_state.network.nodes[node_id]
                        st.success(f"Deleted: {node_id}")
                        st.rerun()
    else:
        st.info("No nodes yet. Add one to get started!")
    
    all_nodes = {
        node.id: node for node in session_state.network.get_all_nodes(recurse=True)
        if search.lower() in node.id.lower() or search.lower() in type(node).__name__.lower()
    }
    nested_nodes = remove_keys(all_nodes, filtered_nodes)
    st.subheader("Nested Nodes")
    if nested_nodes:
        for node_id, node_obj in nested_nodes.items():
            node_type = type(node_obj).__name__
            
            with st.expander(f"**{node_id}** ({node_type})"):
                st.write(f"**Type:** {node_type}")
                
                # Display common attributes
                if hasattr(node_obj, 'input_contents'):
                    st.write(f"**Input:** {[c.name for c in node_obj.input_contents]}")
                if hasattr(node_obj, 'output_contents') and not isinstance(node_obj.output_contents, type(NotImplemented)):
                    st.write(f"**Output:** {[c.name for c in node_obj.output_contents]}")
                
                if hasattr(node_obj, 'elevation') and node_obj.elevation:
                    st.write(f"**Elevation:** {node_obj.elevation}")
                if hasattr(node_obj, 'volume') and node_obj.volume:
                    st.write(f"**Volume:** {node_obj.volume}")
                if hasattr(node_obj, 'num_units'):
                    st.write(f"**Units:** {node_obj.num_units}")
                if hasattr(node_obj, 'min_flow') and node_obj.min_flow:
                    st.write(f"**Min Flow:** {node_obj.min_flow}")
                if hasattr(node_obj, 'max_flow') and node_obj.max_flow:
                    st.write(f"**Max Flow:** {node_obj.max_flow}")
                if hasattr(node_obj, 'design_flow') and node_obj.design_flow:
                    st.write(f"**Design Flow:** {node_obj.design_flow}")
                
                # Pump-specific
                if hasattr(node_obj, 'pump_type') and node_obj.pump_type:
                    st.write(f"**Pump Type:** {node_obj.pump_type.name}")
                if hasattr(node_obj, 'power_rating') and node_obj.power_rating:
                    st.write(f"**Power Rating:** {node_obj.power_rating}")
                
                # Digester-specific
                if hasattr(node_obj, 'digester_type') and node_obj.digester_type:
                    st.write(f"**Digester Type:** {node_obj.digester_type.name}")
                
                # Generator/Cogeneration-specific
                if hasattr(node_obj, 'min_gen') and node_obj.min_gen:
                    st.write(f"**Min Generation Capacity:** {node_obj.min_gen}")
                if hasattr(node_obj, 'max_gen') and node_obj.max_gen:
                    st.write(f"**Max Generation Capacity:** {node_obj.max_gen}")
                if hasattr(node_obj, 'design_gen') and node_obj.design_gen:
                    st.write(f"**Design Generation Capacity:** {node_obj.design_gen}")
                if hasattr(node_obj, 'thermal_efficiency') and node_obj.thermal_efficiency:
                    st.write(f"**Thermal Efficiency:** {node_obj.thermal_efficiency}")
                if hasattr(node_obj, 'electrical_efficiency') and node_obj.electrical_efficiency:
                    st.write(f"**Electrical Efficiency:** {node_obj.electrical_efficiency}")
                
                # UV System-specific
                if hasattr(node_obj, 'intensity') and node_obj.intensity:
                    st.write(f"**Intensity:** {node_obj.intensity}")
                if hasattr(node_obj, 'area') and node_obj.area:
                    st.write(f"**Area:** {node_obj.area}")
                
                # Clarification/Thickening/RO-specific
                if hasattr(node_obj, 'settling_time') and node_obj.settling_time:
                    st.write(f"**Settling Time:** {node_obj.settling_time}")
                if hasattr(node_obj, 'selectivity') and node_obj.selectivity:
                    st.write(f"**Selectivity:** {node_obj.selectivity}")
                if hasattr(node_obj, 'permeability') and node_obj.permeability:
                    st.write(f"**Permeability:** {node_obj.permeability}")
                
                # Disinfection/Chlorination-specific
                if hasattr(node_obj, 'residence_time') and node_obj.residence_time:
                    st.write(f"**Residence Time:** {node_obj.residence_time}")
                if hasattr(node_obj, 'dosing_rate') and node_obj.dosing_rate:
                    st.write(f"**Dosing Rate:** {node_obj.dosing_rate}")
                
                # Reactor-specific
                if hasattr(node_obj, 'pH') and node_obj.pH:
                    st.write(f"**pH:** {node_obj.pH}")
                
                # Battery-specific
                if hasattr(node_obj, 'energy_capacity') and node_obj.energy_capacity:
                    st.write(f"**Energy Capacity:** {node_obj.energy_capacity}")
                if hasattr(node_obj, 'rte') and node_obj.rte:
                    st.write(f"**Round Trip Efficiency:** {node_obj.rte}")
                if hasattr(node_obj, 'leakage') and node_obj.leakage:
                    st.write(f"**Leakage:** {node_obj.leakage}")
                if hasattr(node_obj, 'charge_rate') and node_obj.charge_rate:
                    st.write(f"**Charge Rate:** {node_obj.charge_rate}")
                if hasattr(node_obj, 'discharge_rate') and node_obj.discharge_rate:
                    st.write(f"**Discharge Rate:** {node_obj.discharge_rate}")
                
                # Valve/PRV-specific
                if hasattr(node_obj, 'diameter') and node_obj.diameter:
                    st.write(f"**Diameter:** {node_obj.diameter}")
                if hasattr(node_obj, 'pressure_setting') and node_obj.pressure_setting:
                    st.write(f"**Pressure Setting:** {node_obj.pressure_setting}")
                
                # Display tags if present
                if hasattr(node_obj, 'tags') and node_obj.tags:
                    st.write(f"**Tags:** {', '.join(node_obj.tags.keys())}")
                
                # Display nested nodes for containers
                if hasattr(node_obj, 'nodes') and node_obj.nodes:
                    st.write(f"**Nested Nodes ({len(node_obj.nodes)}):** {', '.join(node_obj.nodes.keys())}")
                
                # Display nested connections for containers
                if hasattr(node_obj, 'connections') and node_obj.connections:
                    st.write(f"**Nested Connections ({len(node_obj.connections)}):** {', '.join(node_obj.connections.keys())}")
                
                btn_col1, btn_col2 = st.columns(2)
                with btn_col1:
                    if st.button(f"Edit", key=f"edit_{node_id}"):
                        session_state.selected_node = node_id
                        st.rerun()
                with btn_col2:
                    if st.button(f"Delete", key=f"del_{node_id}"):
                        del session_state.network.nodes[node_id]
                        st.success(f"Deleted: {node_id}")
                        st.rerun()
    else:
        st.info("No nested nodes yet. Add one to get started!")


def render_node_form(session_state):
    """Render form for adding/editing nodes"""
    if session_state.selected_node:
        st.subheader(f"Edit: {session_state.selected_node}")
        if st.button("Cancel"):
            session_state.selected_node = None
            st.rerun()
    else:
        st.subheader("Add New Node")

    # TODO: decide whether to include the below functionality
    # Tag must be created outside the form
    # to avoid error when button is embedded in form
    # with st.expander("Create New Tag"):
    #     tcol1, tcol2, tcol3 = st.columns(3)
    #     with tcol1:
    #         new_tag_id = st.text_input("Tag ID", key="quick_tag_id")
    #         new_tag_type = st.selectbox("Tag Type", ["DataTag", "VirtualTag"], key="quick_tag_type")
    #     with tcol2:
    #         contents_options = get_contents_enum()
    #         new_tag_contents = st.selectbox("Contents Type", contents_options, key="quick_tag_contents")
    #         new_tag_value = st.text_input("Value (optional)", key="quick_tag_value")
    #     with tcol3:
    #         new_tag_unit = st.text_input("Unit (e.g., m**3/day)", key="quick_tag_unit")
    #         st.write("")  # spacing
    #         if st.button("Create Tag", key="create_quick_tag"):
    #             if new_tag_id:
    #                 try:
    #                     contents_enum = ContentsType[new_tag_contents]
    #                     value = parse_unit_input(new_tag_value, new_tag_unit) if new_tag_value else None
                        
    #                     if new_tag_type == "DataTag":
    #                         new_tag = tag.DataTag(new_tag_id, contents_enum, value=value)
    #                     else:
    #                         new_tag = tag.VirtualTag(new_tag_id, contents_enum, value=value)
                        
    #                     if not hasattr(session_state.network, 'tags'):
    #                         session_state.network.tags = {}
    #                     session_state.network.tags[new_tag_id] = new_tag
    #                     st.success(f"Created tag: {new_tag_id}")
    #                     st.rerun()
    #                 except Exception as e:
    #                     st.error(f"Error creating tag: {str(e)}")
    #             else:
    #                 st.error("Tag ID is required!")
    
    existing_node = None
    if session_state.selected_node:
        all_nodes = {node.id: node for node in session_state.network.get_all_nodes(recurse=True)}
        existing_node = all_nodes[session_state.selected_node]
    
    # Node ID and Type
    node_types = get_node_types()
    
    if existing_node:
        node_id = st.text_input("Node ID*", value=session_state.selected_node, disabled=True)
        node_type = st.selectbox(
            "Type*", 
            node_types, 
            index=node_types.index(type(existing_node).__name__) if type(existing_node).__name__ in node_types else 0, 
        )
    else:
        node_id = st.text_input("Node ID*", "")
        node_type = st.selectbox("Type*", node_types)

    
    # Contents
    st.write("**Contents**")
    contents_options = get_contents_enum()
    
    default_input = []
    default_output = []
    if existing_node:
        if hasattr(existing_node, "input_contents"):
            default_input = [c.name for c in existing_node.input_contents]
        if hasattr(existing_node, "output_contents"):
            default_output = [c.name for c in existing_node.output_contents]
    
    input_contents = st.multiselect("Input Contents", contents_options, default=default_input)
    output_contents = st.multiselect("Output Contents", contents_options, default=default_output)
    
    # Tags - available for all node types
    existing_tags = existing_node.tags if existing_node and hasattr(existing_node, 'tags') else None
    selected_tags = render_tag_selector(session_state, existing_tags, key_prefix=f"node_{node_id}")
    
    # Initialize variables
    min_flow = max_flow = design_flow = None
    volume = elevation = None
    num_units = 1
    power_rating = None
    pump_type = PumpType.Constant
    digester_type = None
    min_gen = max_gen = design_gen = None
    thermal_efficiency = electrical_efficiency = None
    intensity = area = None
    settling_time = None
    selectivity = permeability = None
    residence_time = dosing_rate = None
    pH = None
    energy_capacity = rte = leakage = None
    charge_rate = discharge_rate = None
    diameter = pressure_setting = None
    nested_nodes = None
    nested_connections = None

    # Type-specific parameters
    if node_type == "Pump":
        # TODO: add pump curve input
        st.write("**Flow Parameters**")
        fcol1, fcol2 = st.columns(2)
        with fcol1:
            min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and hasattr(existing_node, "min_flow") else "")
            max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and hasattr(existing_node, "max_flow") else "")
            design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and hasattr(existing_node, "design_flow") else "")
            power_val = st.text_input("Power Rating (W)", value=str(existing_node.power_rating.magnitude) if existing_node and hasattr(existing_node, "power_rating") else "")
        with fcol2:
            # TODO: default units should be displayed as well
            flow_unit = st.selectbox(
                "Flow Unit", 
                ["m**3/day", "MGD", "GPM", "L/s"],
            )
        
        min_flow = parse_unit_input(min_flow_val, flow_unit)
        max_flow = parse_unit_input(max_flow_val, flow_unit)
        design_flow = parse_unit_input(design_flow_val, flow_unit)
        power_rating = parse_unit_input(power_val, "W")
        
        st.write("**Elevation**")
        ecol1, ecol2 = st.columns(2)
        with ecol1:
            elevation_val = st.text_input("Elevation", value=str(existing_node.elevation.magnitude) if existing_node and hasattr(existing_node, "elevation") else "")
        with ecol2:
            elevation_unit = st.selectbox("Elevation Unit", ["m", "ft"])
        elevation = parse_unit_input(elevation_val, elevation_unit)
        
        num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node else 1)
        pump_type_str = st.selectbox("Pump Type", ["Constant", "VFD", "ERD"],
                                    index=["Constant", "VFD", "ERD"].index(existing_node.pump_type.name) if existing_node and hasattr(existing_node, "pump_type") else 0)
        pump_type = PumpType[pump_type_str]
    
    elif node_type in ["Tank", "Reservoir"]:
        st.write("**Volume**")
        vcol1, vcol2 = st.columns(2)
        with vcol1:
            volume_val = st.text_input("Volume", value=str(existing_node.volume.magnitude) if existing_node and hasattr(existing_node, "volume") else "")
        with vcol2:
            volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
        volume = parse_unit_input(volume_val, volume_unit)
        
        st.write("**Elevation**")
        ecol1, ecol2 = st.columns(2)
        with ecol1:
            elevation_val = st.text_input("Elevation", value=str(existing_node.elevation.magnitude) if existing_node and hasattr(existing_node, "elevation") else "")
        with ecol2:
            elevation_unit = st.selectbox("Elevation Unit", ["m", "ft"])
        elevation = parse_unit_input(elevation_val, elevation_unit)
        
        if node_type == "Tank":
            num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node and hasattr(existing_node, "num_units") else 1)
    
    elif node_type in ["Cogeneration", "Boiler"]:
        st.write("**Generation Capacity**")
        gcol1, gcol2 = st.columns(2)
        with gcol1:
            min_gen_val = st.text_input("Min Capacity", value=str(existing_node.min_gen.magnitude) if existing_node and hasattr(existing_node, "min_gen") else "")
            max_gen_val = st.text_input("Max Capacity", value=str(existing_node.max_gen.magnitude) if existing_node and hasattr(existing_node, "max_gen") else "")
            design_gen_val = st.text_input("Design Capacity", value=str(existing_node.design_gen.magnitude) if existing_node and hasattr(existing_node, "design_gen") else "")
        with gcol2:
            gen_unit = st.selectbox("Capacity Unit", ["kW", "MW", "W"])
        
        min_gen = parse_unit_input(min_gen_val, gen_unit)
        max_gen = parse_unit_input(max_gen_val, gen_unit)
        design_gen = parse_unit_input(design_gen_val, gen_unit)
        
        st.write("**Efficiency**")
        thermal_efficiency = st.number_input("Thermal Efficiency (0-1)", min_value=0.0, max_value=1.0, 
                                            value=float(existing_node.thermal_efficiency) if existing_node and hasattr(existing_node, "thermal_efficiency") else 0.0, step=0.01)
        electrical_efficiency = st.number_input("Electrical Efficiency (0-1)", min_value=0.0, max_value=1.0,
                                                value=float(existing_node.electrical_efficiency) if existing_node and hasattr(existing_node, "electrical_efficiency") else 0.0, step=0.01)
        
        num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node and hasattr(existing_node, "num_units") else 1)
    
    elif node_type == "Digestion":
        st.write("**Flow Parameters**")
        fcol1, fcol2 = st.columns(2)
        with fcol1:
            min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and hasattr(existing_node, "min_flow") else "")
            max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and hasattr(existing_node, "max_flow") else "")
            design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and hasattr(existing_node, "design_flow") else "")
        with fcol2:
            flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
        
        min_flow = parse_unit_input(min_flow_val, flow_unit)
        max_flow = parse_unit_input(max_flow_val, flow_unit)
        design_flow = parse_unit_input(design_flow_val, flow_unit)
        
        st.write("**Volume**")
        vcol1, vcol2 = st.columns(2)
        with vcol1:
            volume_val = st.text_input("Volume", value=str(existing_node.volume.magnitude) if existing_node and hasattr(existing_node, "volume") else "")
        with vcol2:
            volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
        volume = parse_unit_input(volume_val, volume_unit)
        
        num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node and hasattr(existing_node, "num_units") else 1)
        
        digester_type_str = st.selectbox("Digester Type", ["Mesophilic", "Thermophilic"],
                                        index=["Mesophilic", "Thermophilic"].index(existing_node.digester_type.name) if existing_node and hasattr(existing_node, "digester_type") else 0)
        digester_type = DigesterType[digester_type_str]
    
    elif node_type in ["Disinfection", "Chlorination", "UVSystem"]:
        st.write("**Flow Parameters**")
        fcol1, fcol2 = st.columns(2)
        with fcol1:
            min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and hasattr(existing_node, "min_flow") else "")
            max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and hasattr(existing_node, "max_flow") else "")
            design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and hasattr(existing_node, "design_flow") else "")
        with fcol2:
            flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
        
        min_flow = parse_unit_input(min_flow_val, flow_unit)
        max_flow = parse_unit_input(max_flow_val, flow_unit)
        design_flow = parse_unit_input(design_flow_val, flow_unit)
        
        st.write("**Volume**")
        vcol1, vcol2 = st.columns(2)
        with vcol1:
            volume_val = st.text_input("Volume", value=str(existing_node.volume.magnitude) if existing_node and hasattr(existing_node, "volume") else "")
        with vcol2:
            volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
        volume = parse_unit_input(volume_val, volume_unit)
        
        num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node and hasattr(existing_node, "num_units") else 1)
        
        if node_type == "UVSystem":
            st.write("**UV-Specific Parameters**")
            ucol1, ucol2 = st.columns(2)
            with ucol1:
                intensity_val = st.text_input("Intensity", value=str(existing_node.intensity.magnitude) if existing_node and hasattr(existing_node, "intensity") else "")
                area_val = st.text_input("Area", value=str(existing_node.area.magnitude) if existing_node and hasattr(existing_node, "area") else "")
            with ucol2:
                intensity_unit = st.selectbox("Intensity Unit", ["mW/cm**2", "W/m**2"])
                area_unit = st.selectbox("Area Unit", ["m**2", "ft**2"])
            
            intensity = parse_unit_input(intensity_val, intensity_unit)
            area = parse_unit_input(area_val, area_unit)
        else:
            # For Disinfection and Chlorination
            st.write("**Dosing & Residence Time**")
            rcol1, rcol2 = st.columns(2)
            with rcol1:
                residence_time_val = st.text_input("Residence Time", value=str(existing_node.residence_time.magnitude) if existing_node and hasattr(existing_node, "residence_time") else "")
            with rcol2:
                residence_unit = st.selectbox("Residence Time Unit", ["minute", "hour", "day"])
            
            residence_time = parse_unit_input(residence_time_val, residence_unit)
    
    elif node_type in ["Filtration", "ROMembrane"]:
        st.write("**Flow Parameters**")
        fcol1, fcol2 = st.columns(2)
        with fcol1:
            min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and hasattr(existing_node, "min_flow") else "")
            max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and hasattr(existing_node, "max_flow") else "")
            design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and hasattr(existing_node, "design_flow") else "")
        with fcol2:
            flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
        
        min_flow = parse_unit_input(min_flow_val, flow_unit)
        max_flow = parse_unit_input(max_flow_val, flow_unit)
        design_flow = parse_unit_input(design_flow_val, flow_unit)
        
        st.write("**Volume**")
        vcol1, vcol2 = st.columns(2)
        with vcol1:
            volume_val = st.text_input("Volume", value=str(existing_node.volume.magnitude) if existing_node and hasattr(existing_node, "volume") else "")
        with vcol2:
            volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
        volume = parse_unit_input(volume_val, volume_unit)
        
        num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node and hasattr(existing_node, "num_units") else 1)
        
        if node_type == "ROMembrane":
            st.write("**Membrane-Specific Parameters**")
            selectivity = st.number_input("Selectivity (0-1)", min_value=0.0, max_value=1.0,
                                            value=float(existing_node.selectivity) if existing_node and existing_node.selectivity else 0.0, step=0.01)
            
            pcol1, pcol2 = st.columns(2)
            with pcol1:
                permeability_val = st.text_input("Permeability", value=str(existing_node.permeability.magnitude) if existing_node and hasattr(existing_node, "permeability") else "")
            with pcol2:
                permeability_unit = st.selectbox("Permeability Unit", ["L/m**2/hour/bar", "gal/ft**2/day/psi"])
            
            permeability = parse_unit_input(permeability_val, permeability_unit)
    elif node_type in ["Reactor", "StaticMixer"]:
        st.write("**Flow Parameters**")
        fcol1, fcol2 = st.columns(2)
        with fcol1:
            min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and hasattr(existing_node, "min_flow") else "")
            max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and hasattr(existing_node, "max_flow") else "")
            design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and hasattr(existing_node, "design_flow") else "")
        with fcol2:
            flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
        
        min_flow = parse_unit_input(min_flow_val, flow_unit)
        max_flow = parse_unit_input(max_flow_val, flow_unit)
        design_flow = parse_unit_input(design_flow_val, flow_unit)
        
        st.write("**Volume**")
        vcol1, vcol2 = st.columns(2)
        with vcol1:
            volume_val = st.text_input("Volume", value=str(existing_node.volume.magnitude) if existing_node and hasattr(existing_node, "volume") else "")
        with vcol2:
            volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
        volume = parse_unit_input(volume_val, volume_unit)
        
        num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node and hasattr(existing_node, "num_units") else 1)
        
        if node_type == "Reactor":
            pH = st.number_input("pH", min_value=0.0, max_value=14.0,
                                value=float(existing_node.pH) if existing_node and existing_node.pH else 7.0, step=0.1)
    
    elif node_type in ["Thickening", "Aeration", "Clarification"]:
        st.write("**Flow Parameters**")
        fcol1, fcol2 = st.columns(2)
        with fcol1:
            min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and hasattr(existing_node, "min_flow") else "")
            max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and hasattr(existing_node, "max_flow") else "")
            design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and hasattr(existing_node, "design_flow") else "")
        with fcol2:
            flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
        
        min_flow = parse_unit_input(min_flow_val, flow_unit)
        max_flow = parse_unit_input(max_flow_val, flow_unit)
        design_flow = parse_unit_input(design_flow_val, flow_unit)
        
        st.write("**Volume**")
        vcol1, vcol2 = st.columns(2)
        with vcol1:
            volume_val = st.text_input("Volume", value=str(existing_node.volume.magnitude) if existing_node and hasattr(existing_node, "volume") else "")
        with vcol2:
            volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
        volume = parse_unit_input(volume_val, volume_unit)
        
        num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node and hasattr(existing_node, "num_units") else 1)
        
        if node_type in ["Thickening", "Clarification"]:
            st.write("**Settling Time**")
            scol1, scol2 = st.columns(2)
            with scol1:
                settling_time_val = st.text_input("Settling Time", value=str(existing_node.settling_time.magnitude) if existing_node and hasattr(existing_node, "settling_time") else "")
            with scol2:
                settling_unit = st.selectbox("Settling Time Unit", ["minute", "hour", "day"])
            
            settling_time = parse_unit_input(settling_time_val, settling_unit)
    
    elif node_type in ["Screening", "Conditioning", "Flaring"]:
        st.write("**Flow Parameters**")
        fcol1, fcol2 = st.columns(2)
        with fcol1:
            min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and hasattr(existing_node, "min_flow") else "")
            max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and hasattr(existing_node, "max_flow") else "")
            design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and hasattr(existing_node, "design_flow") else "")
        with fcol2:
            flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
        
        min_flow = parse_unit_input(min_flow_val, flow_unit)
        max_flow = parse_unit_input(max_flow_val, flow_unit)
        design_flow = parse_unit_input(design_flow_val, flow_unit)
        
        st.write("**Volume**")
        vcol1, vcol2 = st.columns(2)
        with vcol1:
            volume_val = st.text_input("Volume", value=str(existing_node.volume.magnitude) if existing_node and hasattr(existing_node, "volume") else "")
        with vcol2:
            volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
        volume = parse_unit_input(volume_val, volume_unit)
        
        num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node and hasattr(existing_node, "num_units") else 1)
    
    elif node_type == "Separator":
        st.write("**Flow Parameters**")
        fcol1, fcol2 = st.columns(2)
        with fcol1:
            min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and hasattr(existing_node, "min_flow") else "")
            max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and hasattr(existing_node, "max_flow") else "")
            design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and hasattr(existing_node, "design_flow") else "")
        with fcol2:
            flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
        
        min_flow = parse_unit_input(min_flow_val, flow_unit)
        max_flow = parse_unit_input(max_flow_val, flow_unit)
        design_flow = parse_unit_input(design_flow_val, flow_unit)
        
        st.write("**Volume**")
        vcol1, vcol2 = st.columns(2)
        with vcol1:
            volume_val = st.text_input("Volume", value=str(existing_node.volume.magnitude) if existing_node and hasattr(existing_node, "volume") else "")
        with vcol2:
            volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
        volume = parse_unit_input(volume_val, volume_unit)
        
        num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node and hasattr(existing_node, "num_units") else 1)
    
    elif node_type == "Battery":
        st.write("**Energy Storage Parameters**")
        ecol1, ecol2 = st.columns(2)
        with ecol1:
            energy_capacity_val = st.text_input("Energy Capacity", value=str(existing_node.energy_capacity.magnitude) if existing_node and hasattr(existing_node, "energy_capacity") else "")
            charge_rate_val = st.text_input("Charge Rate", value=str(existing_node.charge_rate.magnitude) if existing_node and hasattr(existing_node, "charge_rate") else "")
            discharge_rate_val = st.text_input("Discharge Rate", value=str(existing_node.discharge_rate.magnitude) if existing_node and hasattr(existing_node, "discharge_rate") else "")
        with ecol2:
            energy_unit = st.selectbox("Energy Unit", ["kWh", "MWh", "Wh"])
            rate_unit = st.selectbox("Rate Unit", ["kW", "MW", "W"])
        
        energy_capacity = parse_unit_input(energy_capacity_val, energy_unit)
        charge_rate = parse_unit_input(charge_rate_val, rate_unit)
        discharge_rate = parse_unit_input(discharge_rate_val, rate_unit)
        
        st.write("**Efficiency & Leakage**")
        rte = st.number_input("Round Trip Efficiency (0-1)", min_value=0.0, max_value=1.0,
                                value=float(existing_node.rte) if existing_node and hasattr(existing_node, "rte") else 0.9, step=0.01)
        leakage = st.number_input("Leakage Rate (0-1)", min_value=0.0, max_value=1.0,
                                    value=float(existing_node.leakage) if existing_node and hasattr(existing_node, "leakage") else 0.0, step=0.01)
    
    elif node_type in ["Network", "Facility", "ModularUnit"]:
        if node_type == "Facility":
            st.write("**Elevation**")
            ecol1, ecol2 = st.columns(2)
            with ecol1:
                elevation_val = st.text_input("Elevation", value=str(existing_node.elevation.magnitude) if existing_node and hasattr(existing_node, "elevation") else "")
            with ecol2:
                elevation_unit = st.selectbox("Elevation Unit", ["m", "ft"])
            elevation = parse_unit_input(elevation_val, elevation_unit)
        
        elif node_type == "ModularUnit":
            st.write("**Flow Parameters**")
            fcol1, fcol2 = st.columns(2)
            with fcol1:
                min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and hasattr(existing_node, "min_flow") else "")
                max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and hasattr(existing_node, "max_flow") else "")
                design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and hasattr(existing_node, "design_flow") else "")
            with fcol2:
                flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
            
            min_flow = parse_unit_input(min_flow_val, flow_unit)
            max_flow = parse_unit_input(max_flow_val, flow_unit)
            design_flow = parse_unit_input(design_flow_val, flow_unit)
            
            num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node and hasattr(existing_node, "num_units") else 1)
    
        # Container nodes - can contain other nodes and connections
        st.info(f"{node_type} is a container. Configure nested nodes and connections below.")
        
        # Get existing nested objects if editing
        existing_nodes = existing_node.nodes if existing_node and hasattr(existing_node, 'nodes') else None
        existing_conns = existing_node.connections if existing_node and hasattr(existing_node, 'connections') else None
        
        # Render selectors for nested objects
        nested_nodes = render_nested_nodes_selector(session_state, existing_nodes, key_prefix=f"node_{node_id}")
        nested_connections = render_nested_connections_selector(session_state, existing_conns, key_prefix=f"node_{node_id}")

    elif node_type in ["Valve", "Junction", "PRV"]:
        st.write("**Diameter**")
        dcol1, dcol2 = st.columns(2)
        with dcol1:
            diameter_val = st.text_input("Diameter", value=str(existing_node.diameter.magnitude) if (existing_node and hasattr(existing_node, "diameter")) else "")
        with dcol2:
            diameter_unit = st.selectbox("Diameter Unit", ["mm", "inch", "m"])
        
        diameter = parse_unit_input(diameter_val, diameter_unit)
        
        if node_type == "PRV":
            st.write("**Pressure Setting**")
            pcol1, pcol2 = st.columns(2)
            with pcol1:
                pressure_val = st.text_input(
                    "Pressure Setting", 
                    value=(
                        str(existing_node.pressure_setting.magnitude) 
                        if (existing_node and hasattr(existing_node, "pressure_setting")) 
                        else ""
                    )
                )
            with pcol2:
                pressure_unit = st.selectbox("Pressure Unit", ["bar", "psi", "Pa"])
            
            pressure_setting = parse_unit_input(pressure_val, pressure_unit)
    
    # Submit button
    submit_label = "Save Node" if existing_node else "Add Node"
    if st.button(submit_label):
        if not node_id:
            st.error("Node ID is required!")
            return
        
        if not input_contents or not output_contents:
            st.error("Both input and output contents are required!")
            return
        
        try:
            # Convert contents to enum
            input_enum = [ContentsType[c] for c in input_contents]
            output_enum = [ContentsType[c] for c in output_contents]
            
            # Create appropriate node type
            new_node = None
            
            if node_type == "Junction":
                new_node = node.Junction(node_id, input_enum, output_enum, diameter=diameter, tags=selected_tags)
            elif node_type == "Tank":
                new_node = node.Tank(
                    node_id, input_enum, output_enum,
                    elevation=elevation,
                    volume=volume,
                    num_units=num_units,
                    tags=selected_tags
                )
            elif node_type == "Reservoir":
                new_node = node.Reservoir(
                    node_id, input_enum, output_enum,
                    elevation=elevation,
                    volume=volume,
                    tags=selected_tags
                )
            elif node_type == "Pump":
                new_node = node.Pump(
                    node_id, input_enum, output_enum,
                    elevation=elevation,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    power_rating=power_rating,
                    num_units=num_units,
                    pump_type=pump_type,
                    tags=selected_tags
                )
            elif node_type == "Cogeneration":
                new_node = node.Cogeneration(
                    node_id, input_enum, output_enum,
                    min_gen=min_gen,
                    max_gen=max_gen,
                    design_gen=design_gen,
                    thermal_efficiency=thermal_efficiency,
                    electrical_efficiency=electrical_efficiency,
                    num_units=num_units,
                    tags=selected_tags
                )
            elif node_type == "Boiler":
                new_node = node.Boiler(
                    node_id, input_enum, output_enum,
                    min_gen=min_gen,
                    max_gen=max_gen,
                    design_gen=design_gen,
                    thermal_efficiency=thermal_efficiency,
                    num_units=num_units,
                    tags=selected_tags
                )
            elif node_type == "Digestion":
                new_node = node.Digestion(
                    node_id, input_enum, output_enum,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    volume=volume,
                    num_units=num_units,
                    digester_type=digester_type,
                    tags=selected_tags
                )
            elif node_type == "Disinfection":
                new_node = node.Disinfection(
                    node_id, input_enum, output_enum,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    volume=volume,
                    num_units=num_units,
                    residence_time=residence_time,
                    dosing_rate=dosing_rate,
                    tags=selected_tags
                )
            elif node_type == "Chlorination":
                new_node = node.Chlorination(
                    node_id, input_enum, output_enum,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    volume=volume,
                    num_units=num_units,
                    residence_time=residence_time,
                    dosing_rate=dosing_rate,
                    tags=selected_tags
                )
            elif node_type == "UVSystem":
                new_node = node.UVSystem(
                    node_id, input_enum, output_enum,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    volume=volume,
                    num_units=num_units,
                    intensity=intensity,
                    area=area,
                    tags=selected_tags
                )
            elif node_type == "Filtration":
                new_node = node.Filtration(
                    node_id, input_enum, output_enum,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    volume=volume,
                    num_units=num_units,
                    tags=selected_tags
                )
            elif node_type == "ROMembrane":
                new_node = node.ROMembrane(
                    node_id, input_enum, output_enum,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    volume=volume,
                    num_units=num_units,
                    selectivity=selectivity,
                    permeability=permeability,
                    tags=selected_tags
                )
            elif node_type == "Reactor":
                new_node = node.Reactor(
                    node_id, input_enum, output_enum,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    volume=volume,
                    num_units=num_units,
                    pH=pH,
                    tags=selected_tags
                )
            elif node_type == "StaticMixer":
                new_node = node.StaticMixer(
                    node_id, input_enum, output_enum,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    volume=volume,
                    num_units=num_units,
                    tags=selected_tags
                )
            elif node_type == "Thickening":
                new_node = node.Thickening(
                    node_id, input_enum, output_enum,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    volume=volume,
                    num_units=num_units,
                    settling_time=settling_time,
                    tags=selected_tags
                )
            elif node_type == "Aeration":
                new_node = node.Aeration(
                    node_id, input_enum, output_enum,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    volume=volume,
                    num_units=num_units,
                    tags=selected_tags
                )
            elif node_type == "Clarification":
                new_node = node.Clarification(
                    node_id, input_enum, output_enum,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    volume=volume,
                    num_units=num_units,
                    settling_time=settling_time,
                    tags=selected_tags
                )
            elif node_type == "Screening":
                new_node = node.Screening(
                    node_id, input_enum, output_enum,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    volume=volume,
                    num_units=num_units,
                    tags=selected_tags
                )
            elif node_type == "Conditioning":
                new_node = node.Conditioning(
                    node_id, input_enum, output_enum,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    volume=volume,
                    num_units=num_units,
                    tags=selected_tags
                )
            elif node_type == "Flaring":
                new_node = node.Flaring(
                    node_id, input_enum, output_enum,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    volume=volume,
                    num_units=num_units,
                    tags=selected_tags
                )
            elif node_type == "Separator":
                new_node = node.Separator(
                    node_id, input_enum, output_enum,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    volume=volume,
                    num_units=num_units,
                    tags=selected_tags
                )
            elif node_type == "Battery":
                new_node = node.Battery(
                    node_id, input_enum, output_enum,
                    energy_capacity=energy_capacity,
                    rte=rte,
                    leakage=leakage,
                    charge_rate=charge_rate,
                    discharge_rate=discharge_rate,
                    tags=selected_tags
                )
            elif node_type == "Network":
                new_node = node.Network(
                    node_id, input_enum, output_enum,
                    nodes=nested_nodes,
                    connections=nested_connections,
                    tags=selected_tags
                )
            elif node_type == "Facility":
                new_node = node.Facility(
                    node_id, input_enum, output_enum,
                    elevation=elevation,
                    nodes=nested_nodes,
                    connections=nested_connections,
                    tags=selected_tags
                )
            elif node_type == "ModularUnit":
                new_node = node.ModularUnit(
                    node_id, input_enum, output_enum,
                    min_flow=min_flow,
                    max_flow=max_flow,
                    design_flow=design_flow,
                    num_units=num_units,
                    nodes=nested_nodes,
                    connections=nested_connections,
                    tags=selected_tags
                )
            elif node_type == "Valve":
                new_node = node.Valve(
                    node_id, input_enum, output_enum,
                    diameter=diameter,
                    tags=selected_tags
                )
            elif node_type == "PRV":
                new_node = node.PRV(
                    node_id, input_enum, output_enum,
                    diameter=diameter,
                    pressure_setting=pressure_setting,
                    tags=selected_tags
                )
            if new_node:
                session_state.network.nodes[node_id] = new_node
                if existing_node:
                    st.success(f"Updated node: {node_id}")
                else:
                    st.success(f"Added node: {node_id}")
                session_state.selected_node = None
                st.rerun()
            else:
                st.error(f"Failed to create node of type: {node_type}")
        except Exception as e:
            st.error(f"Error creating node: {str(e)}")
            import traceback
            st.error(traceback.format_exc())
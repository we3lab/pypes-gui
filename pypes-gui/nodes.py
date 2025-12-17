"""Nodes tab for PyPES UI"""
import streamlit as st
from pype_schema import node, utils
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

def render_nodes_tab(session_state):
    """Main function to render the nodes tab"""
    st.header("Node Management")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        render_node_list(session_state)
    
    with col2:
        render_node_form(session_state)

def render_node_list(session_state):
    """Render list of existing nodes"""
    st.subheader("Existing Nodes")
    
    if session_state.network.nodes:
        search = st.text_input("🔍 Search nodes", "")
        
        filtered_nodes = {
            k: v for k, v in session_state.network.nodes.items()
            if search.lower() in k.lower() or search.lower() in type(v).__name__.lower()
        }
        
        for node_id, node_obj in filtered_nodes.items():
            node_type = type(node_obj).__name__
            
            with st.expander(f"**{node_id}** ({node_type})"):
                st.write(f"**Type:** {node_type}")
                
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
                
                btn_col1, btn_col2 = st.columns(2)
                with btn_col1:
                    if st.button(f"✏️ Edit", key=f"edit_{node_id}"):
                        session_state.selected_node = node_id
                        st.rerun()
                with btn_col2:
                    if st.button(f"🗑️ Delete", key=f"del_{node_id}"):
                        del session_state.network.nodes[node_id]
                        st.success(f"Deleted: {node_id}")
                        st.rerun()
    else:
        st.info("No nodes yet. Add one to get started!")

def render_node_form(session_state):
    """Render form for adding/editing nodes"""
    if session_state.selected_node:
        st.subheader(f"Edit: {session_state.selected_node}")
        if st.button("Cancel"):
            session_state.selected_node = None
            st.rerun()
    else:
        st.subheader("Add New Node")
    
    with st.form("node_form"):
        existing_node = None
        if session_state.selected_node:
            existing_node = session_state.network.nodes[session_state.selected_node]
        
        # Node ID and Type
        node_types = ["Junction", "Tank", "Reservoir", "Pump"]
        
        if existing_node:
            node_id = st.text_input("Node ID*", value=session_state.selected_node, disabled=True)
            node_type = st.selectbox("Type*", node_types, 
                                   index=node_types.index(type(existing_node).__name__) if type(existing_node).__name__ in node_types else 0)
        else:
            node_id = st.text_input("Node ID*", "")
            node_type = st.selectbox("Type*", node_types)
        
        # Contents
        st.write("**Contents**")
        contents_options = get_contents_enum()
        
        default_input = []
        default_output = []
        if existing_node:
            if hasattr(existing_node, 'input_contents'):
                default_input = [c.name for c in existing_node.input_contents]
            if hasattr(existing_node, 'output_contents'):
                default_output = [c.name for c in existing_node.output_contents]
        
        input_contents = st.multiselect("Input Contents", contents_options, default=default_input)
        output_contents = st.multiselect("Output Contents", contents_options, default=default_output)
        
        # Initialize variables
        min_flow = max_flow = design_flow = None
        volume = elevation = None
        num_units = 1
        power_rating = None
        pump_type = utils.PumpType.Constant
        
        # Type-specific parameters
        if node_type == "Pump":
            st.write("**Flow Parameters**")
            fcol1, fcol2 = st.columns(2)
            with fcol1:
                min_flow_val = st.text_input("Min Flow", "")
                max_flow_val = st.text_input("Max Flow", "")
                design_flow_val = st.text_input("Design Flow", "")
                power_val = st.text_input("Power Rating (W)", "")
            with fcol2:
                flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
            
            min_flow = parse_unit_input(min_flow_val, flow_unit)
            max_flow = parse_unit_input(max_flow_val, flow_unit)
            design_flow = parse_unit_input(design_flow_val, flow_unit)
            power_rating = parse_unit_input(power_val, "W")
            
            st.write("**Elevation**")
            ecol1, ecol2 = st.columns(2)
            with ecol1:
                elevation_val = st.text_input("Elevation", "")
            with ecol2:
                elevation_unit = st.selectbox("Elevation Unit", ["m", "ft"])
            elevation = parse_unit_input(elevation_val, elevation_unit)
            
            num_units = st.number_input("Number of Units", min_value=1, value=1)
            pump_type_str = st.selectbox("Pump Type", ["Constant", "VFD", "ERD"])
            pump_type = utils.PumpType[pump_type_str]
        
        elif node_type in ["Tank", "Reservoir"]:
            st.write("**Volume**")
            vcol1, vcol2 = st.columns(2)
            with vcol1:
                volume_val = st.text_input("Volume", "")
            with vcol2:
                volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
            volume = parse_unit_input(volume_val, volume_unit)
            
            st.write("**Elevation**")
            ecol1, ecol2 = st.columns(2)
            with ecol1:
                elevation_val = st.text_input("Elevation", "")
            with ecol2:
                elevation_unit = st.selectbox("Elevation Unit", ["m", "ft"])
            elevation = parse_unit_input(elevation_val, elevation_unit)
            
            if node_type == "Tank":
                num_units = st.number_input("Number of Units", min_value=1, value=1)
        
        # Submit button
        submit_label = "Save Node" if existing_node else "➕ Add Node"
        if st.form_submit_button(submit_label):
            if not node_id:
                st.error("Node ID is required!")
                return
            
            if not input_contents or not output_contents:
                st.error("Both input and output contents are required!")
                return
            
            try:
                # Convert contents to enum
                input_enum = [utils.ContentsType[c] for c in input_contents]
                output_enum = [utils.ContentsType[c] for c in output_contents]
                
                # Create appropriate node type
                new_node = None
                
                if node_type == "Junction":
                    new_node = node.Junction(node_id, input_enum, output_enum)
                
                elif node_type == "Tank":
                    new_node = node.Tank(
                        node_id, input_enum, output_enum,
                        elevation=elevation,
                        volume=volume,
                        num_units=num_units
                    )
                
                elif node_type == "Reservoir":
                    new_node = node.Reservoir(
                        node_id, input_enum, output_enum,
                        elevation=elevation,
                        volume=volume
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
                        pump_type=pump_type
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
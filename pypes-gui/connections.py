"""Connections tab for PyPES UI"""
# external dependencies
import streamlit as st

# pypes imports
from pype_schema.units import u
from pype_schema import connection
from pype_schema.utils import ContentsType

# local imports
from utils import get_connection_types, parse_unit_input, get_contents_enum


def render_connections_tab(session_state):
    """Main function to render the connections tab"""
    st.header("Connection Management")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        render_connection_list(session_state)
    
    with col2:
        render_connection_form(session_state)

def render_connection_list(session_state):
    """Render list of existing connections"""
    st.subheader("Existing Connections")
    
    if session_state.network.connections:
        search = st.text_input("Search connections", "")
        
        filtered_conns = {
            k: v for k, v in session_state.network.connections.items()
            if search.lower() in k.lower() or 
               search.lower() in type(v).__name__.lower() or
               (hasattr(v, 'source') and v.source and search.lower() in v.source.id.lower()) or
               (hasattr(v, 'destination') and v.destination and search.lower() in v.destination.id.lower())
        }
        
        for conn_id, conn_obj in filtered_conns.items():
            conn_type = type(conn_obj).__name__
            
            with st.expander(f"**{conn_id}** ({conn_type})"):
                st.write(f"**Type:** {conn_type}")
                
                if hasattr(conn_obj, 'source') and conn_obj.source:
                    st.write(f"**Source:** {conn_obj.source.id}")
                if hasattr(conn_obj, 'destination') and conn_obj.destination:
                    st.write(f"**Destination:** {conn_obj.destination.id}")
                if hasattr(conn_obj, 'contents'):
                    if isinstance(conn_obj.contents, list):
                        st.write(f"**Contents:** {[c.name for c in conn_obj.contents]}")
                    else:
                        st.write(f"**Contents:** {conn_obj.contents.name}")
                if hasattr(conn_obj, 'bidirectional'):
                    st.write(f"**Bidirectional:** {conn_obj.bidirectional}")
                if hasattr(conn_obj, 'diameter') and conn_obj.diameter:
                    st.write(f"**Diameter:** {conn_obj.diameter}")
                if hasattr(conn_obj, 'min_flow') and conn_obj.min_flow:
                    st.write(f"**Min Flow:** {conn_obj.min_flow}")
                if hasattr(conn_obj, 'max_flow') and conn_obj.max_flow:
                    st.write(f"**Max Flow:** {conn_obj.max_flow}")
                if hasattr(conn_obj, 'friction') and conn_obj.friction:
                    st.write(f"**Friction:** {conn_obj.friction}")
                
                btn_col1, btn_col2 = st.columns(2)
                with btn_col1:
                    if st.button(f"✏️ Edit", key=f"edit_conn_{conn_id}"):
                        session_state.selected_connection = conn_id
                        st.rerun()
                with btn_col2:
                    if st.button(f"🗑️ Delete", key=f"del_conn_{conn_id}"):
                        del session_state.network.connections[conn_id]
                        st.success(f"Deleted: {conn_id}")
                        st.rerun()
    else:
        st.info("No connections yet. Add one to get started!")

def render_connection_form(session_state):
    """Render form for adding/editing connections"""
    if session_state.selected_connection:
        st.subheader(f"Edit: {session_state.selected_connection}")
        if st.button("Cancel"):
            session_state.selected_connection = None
            st.rerun()
    else:
        st.subheader("Add New Connection")
    
    with st.form("connection_form"):
        existing_conn = None
        if session_state.selected_connection:
            existing_conn = session_state.network.connections[session_state.selected_connection]
        
        # Connection ID and Type
        conn_types = get_connection_types()
        
        if existing_conn:
            conn_id = st.text_input("Connection ID*", value=session_state.selected_connection, disabled=True)
            conn_type = st.selectbox("Type*", conn_types, 
                                   index=conn_types.index(type(existing_conn).__name__) if type(existing_conn).__name__ in conn_types else 0)
        else:
            conn_id = st.text_input("Connection ID*", "")
            conn_type = st.selectbox("Type*", conn_types)
        
        # Source and Destination
        st.write("**Nodes**")
        node_ids = [""] + list(session_state.network.nodes.keys())
        
        default_source = ""
        default_dest = ""
        default_exit = ""
        default_entry = ""
        if existing_conn:
            if hasattr(existing_conn, 'source') and existing_conn.source:
                default_source = existing_conn.source.id
            if hasattr(existing_conn, 'destination') and existing_conn.destination:
                default_dest = existing_conn.destination.id
            if hasattr(existing_conn, 'exit_point') and existing_conn.exit_point:
                default_exit = existing_conn.exit_point.id
            if hasattr(existing_conn, 'entry_point') and existing_conn.entry_point:
                default_entry = existing_conn.entry_point.id
        
        # TODO: add entry_point and exit_point to UI
        exit_point = entry_point = None

        ncol1, ncol2 = st.columns(2)
        with ncol1:
            source_id = st.selectbox("Source Node*", node_ids, 
                                    index=node_ids.index(default_source) if default_source in node_ids else 0)
            exit_point = st.selectbox("Exit Point Node", node_ids, 
                                    index=node_ids.index(default_entry) if default_entry in node_ids else 0)
        with ncol2:
            dest_id = st.selectbox("Destination Node*", node_ids,
                                  index=node_ids.index(default_dest) if default_dest in node_ids else 0)
            entry_point = st.selectbox("Entry Point Node", node_ids, 
                                    index=node_ids.index(default_exit) if default_exit in node_ids else 0)

        # Contents
        st.write("**Contents**")
        contents_options = get_contents_enum()
        
        default_contents = []
        if existing_conn and hasattr(existing_conn, 'contents'):
            if isinstance(existing_conn.contents, list):
                default_contents = [c.name for c in existing_conn.contents]
            else:
                default_contents = [existing_conn.contents.name]
        
        if conn_type == "Wire":
            contents_selected = "Electricity"
        else:  # Pipe, Wireless, or Delivery
            contents_selected = st.selectbox(
                "Contents*", contents_options,
                index=contents_options.index(default_contents[0]) if default_contents else 0
            )
        
        # Bidirectional
        default_bidir = False
        if existing_conn and hasattr(existing_conn, 'bidirectional'):
            default_bidir = existing_conn.bidirectional
        bidirectional = st.checkbox("Bidirectional", value=default_bidir)
        
        # Initialize variables
        diameter = min_flow = max_flow = design_flow = None
        min_pres = max_pres = design_pres = None
        lower_heating_value = higher_heating_value = None
        friction = None
        
        # Type-specific parameters
        if conn_type == "Pipe":
            st.write("**Pipe Parameters**")
            
            # Diameter
            dcol1, dcol2 = st.columns(2)
            with dcol1:
                diameter_val = st.text_input("Diameter", "")
            with dcol2:
                diameter_unit = st.selectbox("Diameter Unit", ["m", "inch", "mm"])
            diameter = parse_unit_input(diameter_val, diameter_unit)
            
            # Flow
            st.write("**Flow Parameters**")
            fcol1, fcol2 = st.columns(2)
            with fcol1:
                min_flow_val = st.text_input("Min Flow", "")
                max_flow_val = st.text_input("Max Flow", "")
                design_flow_val = st.text_input("Design Flow", "")
            with fcol2:
                flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
            
            min_flow = parse_unit_input(min_flow_val, flow_unit)
            max_flow = parse_unit_input(max_flow_val, flow_unit)
            design_flow = parse_unit_input(design_flow_val, flow_unit)
            
            # Pressure
            st.write("**Pressure Parameters**")
            pcol1, pcol2 = st.columns(2)
            with pcol1:
                min_pres_val = st.text_input("Min Pressure", "")
                max_pres_val = st.text_input("Max Pressure", "")
                design_pres_val = st.text_input("Design Pressure", "")
            with pcol2:
                pres_unit = st.selectbox("Pressure Unit", ["Pa", "psi", "bar"])
            
            min_pres = parse_unit_input(min_pres_val, pres_unit)
            max_pres = parse_unit_input(max_pres_val, pres_unit)
            design_pres = parse_unit_input(design_pres_val, pres_unit)

            # Friction
            friction_val = st.text_input("Friction Coefficient", "")
            if friction_val:
                friction = float(friction_val)

            # Heating values
            st.write("**Heating Value (for Gas)**")
            hcol1, hcol2 = st.columns(2)
            with hcol1:
                low_heat_val = st.text_input("Lower Heating Value", "")
                high_heat_val = st.text_input("Higher Heating Value", "")
            with hcol2:
                hval_unit = st.selectbox("Heating Value Unit", ["BTU/scf", "megajoule/m**3"])
            
            lower_heating_value = parse_unit_input(low_heat_val, hval_unit)
            higher_heating_value = parse_unit_input(high_heat_val, hval_unit)
        
        else:  # Wire, Wireless, and Delivery do not currently require additional params
            pass

        # Submit button
        submit_label = "Save Connection" if existing_conn else "Add Connection"
        if st.form_submit_button(submit_label):
            if not conn_id:
                st.error("Connection ID is required!")
                return
            
            if not source_id or not dest_id:
                st.error("Both source and destination nodes are required!")
                return
            
            try:
                # Get node objects
                source_node = session_state.network.nodes.get(source_id)
                dest_node = session_state.network.nodes.get(dest_id)
                if entry_point is not None:
                    entry_point = session_state.network.nodes.get(entry_point)
                if exit_point is not None:
                    exit_point = session_state.network.nodes.get(exit_point)
                
                if not source_node or not dest_node:
                    st.error("Invalid source or destination node!")
                    return
                
                # Convert contents to enum
                contents_enum = ContentsType[contents_selected]
                
                # Create appropriate connection type
                new_conn = None
                
                if conn_type == "Pipe":
                    # TODO: add tag list to UI
                    new_conn = connection.Pipe(
                        conn_id,
                        contents_enum,
                        source_node,
                        dest_node,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        diameter=diameter,
                        friction=friction,
                        lower_heating_value=lower_heating_value,
                        higher_heating_value=higher_heating_value,
                        min_pres=min_pres,
                        max_pres=max_pres,
                        design_pres=design_pres,
                        bidirectional=bidirectional,
                        exit_point=exit_point,
                        entry_point=entry_point,
                    )
                elif conn_type == "Wire":
                    new_conn = connection.Wire(
                        conn_id,
                        contents_enum,
                        source_node,
                        dest_node,
                        bidirectional=bidirectional,
                        exit_point=exit_point,
                        entry_point=entry_point,
                    )
                elif conn_type == "Wireless":
                    new_conn = connection.Wireless(
                        conn_id,
                        contents_enum,
                        source_node,
                        dest_node,
                        bidirectional=bidirectional,
                        exit_point=exit_point,
                        entry_point=entry_point,
                    )
                elif conn_type == "Delivery":
                    new_conn = connection.Delivery(
                        conn_id,
                        contents_enum,
                        source_node,
                        dest_node,
                        voltage=voltage,
                        current=current,
                        bidirectional=bidirectional,
                        exit_point=exit_point,
                        entry_point=entry_point,
                    )
                
                if new_conn:
                    session_state.network.connections[conn_id] = new_conn
                    if existing_conn:
                        st.success(f"Updated connection: {conn_id}")
                    else:
                        st.success(f"Added connection: {conn_id}")
                    session_state.selected_connection = None
                    st.rerun()
                else:
                    st.error(f"Failed to create connection of type: {conn_type}")
                    
            except Exception as e:
                st.error(f"Error creating connection: {str(e)}")
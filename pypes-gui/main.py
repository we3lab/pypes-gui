# import external dependencies
import os
import json
import tempfile
import pandas as pd
import streamlit as st
from datetime import datetime

# pypes imports
from pype_schema.units import u
from pype_schema import parse_json, visualize, node, connection, utils

# local imports
from tags import render_tags_tab
from nodes import render_nodes_tab
from export import render_export_tab
from visualize import render_visualize_tab
from connections import render_connections_tab
from constants import DEFAULT_NETWORK_INPUT_CONTENTS, DEFAULT_NETWORK_OUTPUT_CONTENTS 

st.set_page_config(page_title="PyPES Network Editor", layout="wide")

# Custom CSS
st.markdown("""
    <style>
    .stAlert {padding: 10px; margin: 10px 0;}
    .node-card {padding: 15px; border-radius: 5px; border: 1px solid #ddd; margin: 10px 0;}
    </style>
""", unsafe_allow_html=True)

st.title("PyPES Network Editor")

# Initialize session state
if 'network' not in st.session_state:
    st.session_state.network = None
if 'selected_node' not in st.session_state:
    st.session_state.selected_node = None
if 'selected_connection' not in st.session_state:
    st.session_state.selected_connection = None

# Sidebar
with st.sidebar:
    st.header("File Operations")
    
    uploaded_file = st.file_uploader("Upload PyPES JSON", type=['json'])
    if uploaded_file:
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.json', mode='w') as tmp:
                json_content = json.loads(uploaded_file.getvalue())
                json.dump(json_content, tmp)
                tmp_path = tmp.name
            
            parser = parse_json.JSONParser(tmp_path)
            st.session_state.network = parser.initialize_network()
            os.unlink(tmp_path)
            st.success(f"Loaded: {st.session_state.network.id}")
        except Exception as e:
            st.error(f"Error: {str(e)}")
    
    st.subheader("Create New Network")
    with st.form("new_network_form"):
        network_id = st.text_input("Network ID", "new_network")
        if st.form_submit_button("Create Network"):
            st.session_state.network = node.Network(
                network_id, 
                DEFAULT_NETWORK_INPUT_CONTENTS, 
                DEFAULT_NETWORK_OUTPUT_CONTENTS
            )
            st.success(f"Created: {network_id}")
            st.rerun()
    
    st.divider()
    
    if st.session_state.network:
        st.header("Network Info")
        st.metric("Network ID", st.session_state.network.id)
        st.metric("Nodes", len(st.session_state.network.nodes))
        st.metric("Connections", len(st.session_state.network.connections))

        tag_count = 0
        for node_obj in st.session_state.network.nodes.values():
            if hasattr(node_obj, 'tags'):
                tag_count += len(node_obj.tags)
        for conn_obj in st.session_state.network.connections.values():
            if hasattr(conn_obj, 'tags'):
                tag_count += len(conn_obj.tags)
        
        st.metric("Tags", tag_count)
        
        if st.button("Clear Network"):
            st.session_state.network = None
            st.session_state.selected_node = None
            st.session_state.selected_connection = None
            st.rerun()

# Main tabs
if st.session_state.network:
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "Visualize", "Nodes", "Connections", "Tags", "Export"
    ])
    
    # VISUALIZATION TAB
    with tab1:
        render_visualize_tab(st.session_state)
    
    # NODES TAB
    with tab2:
        render_nodes_tab(st.session_state)
    
    # CONNECTIONS TAB
    with tab3:
        render_connections_tab(st.session_state)
    
    # TAGS TAB
    with tab4:
        render_tags_tab(st.session_state)
    
    # EXPORT TAB
    with tab5:
        render_export_tab(st.session_state)

else:
    st.info("Please upload a network JSON file or create a new network to begin.")
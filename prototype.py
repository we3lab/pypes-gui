import streamlit as st
import json
from pype_schema import parse_json, visualize, node
import tempfile
import os

st.set_page_config(page_title="PyPES Network Editor", layout="wide")

st.title("PyPES Network Editor")

# Initialize session state
if 'network' not in st.session_state:
    st.session_state.network = None

# Sidebar for file operations
with st.sidebar:
    st.header("File Operations")
    
    # Upload JSON
    uploaded_file = st.file_uploader("Upload PyPES JSON", type=['json'])
    if uploaded_file:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.json') as tmp:
            tmp.write(uploaded_file.getvalue())
            tmp_path = tmp.name
        
        parser = parse_json.JSONParser(tmp_path)
        st.session_state.network = parser.initialize_network()
        os.unlink(tmp_path)
        st.success(f"Loaded network: {st.session_state.network.id}")
    
    # Create new network
    if st.button("Create New Network"):
        network_id = st.text_input("Network ID", "new_network")
        if network_id:
            st.session_state.network = node.Network(network_id)
            st.success("Created new network")

# Main content area
if st.session_state.network:
    tab1, tab2, tab3, tab4 = st.tabs(["Visualize", "Nodes", "Connections", "Export"])
    
    with tab1:
        st.header("Network Visualization")
        if st.button("Generate Visualization"):
            with tempfile.NamedTemporaryFile(delete=False, suffix='.html') as tmp:
                visualize.draw_graph(st.session_state.network, pyvis=True, output_file=tmp.name)
                with open(tmp.name, 'r') as f:
                    html_content = f.read()
                st.components.v1.html(html_content, height=600, scrolling=True)
                os.unlink(tmp.name)
    
    with tab2:
        st.header("Nodes")
        
        # List existing nodes
        if st.session_state.network.nodes:
            st.subheader("Existing Nodes")
            for node_id, node_obj in st.session_state.network.nodes.items():
                with st.expander(f"{node_id} ({type(node_obj).__name__})"):
                    st.write(node_obj)
        
        # Add new node
        st.subheader("Add New Node")
        node_type = st.selectbox("Node Type", 
            ["Junction", "Tank", "Reservoir", "Pump", "Treatment", "Disinfection"])
        # Add form for node creation based on type
        
    with tab3:
        st.header("Connections")
        
        # List existing connections
        if st.session_state.network.connections:
            st.subheader("Existing Connections")
            for conn_id, conn_obj in st.session_state.network.connections.items():
                with st.expander(f"{conn_id} ({type(conn_obj).__name__})"):
                    st.write(conn_obj)
        
        # Add new connection
        st.subheader("Add New Connection")
        # Add form for connection creation
    
    with tab4:
        st.header("Export Network")
        if st.button("Export to JSON"):
            parser = parse_json.JSONParser("")
            parser.network_obj = st.session_state.network
            json_data = parser.write()
            st.download_button(
                "Download JSON",
                data=json.dumps(json_data, indent=2),
                file_name=f"{st.session_state.network.id}.json",
                mime="application/json"
            )
else:
    st.info("Please upload a network JSON file or create a new network to begin.")
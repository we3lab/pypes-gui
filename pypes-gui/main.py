import streamlit as st
import json
from pype_schema import parse_json, visualize, node, connection, utils
from pype_schema.units import u
import tempfile
import os
import pandas as pd
from datetime import datetime

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

# Helper Functions
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
        "Filtration", "ROMembrane", "Cogeneration", "Boiler"
    ]

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
            st.session_state.network = node.Network(network_id)
            st.success(f"Created: {network_id}")
            st.rerun()
    
    st.divider()
    
    if st.session_state.network:
        st.header("Network Info")
        st.metric("Network ID", st.session_state.network.id)
        st.metric("Nodes", len(st.session_state.network.nodes))
        st.metric("Connections", len(st.session_state.network.connections))
        
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
        st.header("Network Visualization")
        
        col1, col2 = st.columns([3, 1])
        
        with col2:
            viz_type = st.radio("Type", ["Interactive (PyVis)", "Static (NetworkX)"])
            
            if st.button("🎨 Generate", type="primary"):
                try:
                    with tempfile.NamedTemporaryFile(
                        delete=False, 
                        suffix='.html' if viz_type.startswith("Interactive") else '.png'
                    ) as tmp:
                        if viz_type.startswith("Interactive"):
                            visualize.draw_graph(st.session_state.network, pyvis=True, output_file=tmp.name)
                            with open(tmp.name, 'r') as f:
                                html_content = f.read()
                            with col1:
                                st.components.v1.html(html_content, height=700, scrolling=True)
                        else:
                            visualize.draw_graph(st.session_state.network, pyvis=False, output_file=tmp.name)
                            with col1:
                                st.image(tmp.name)
                        os.unlink(tmp.name)
                except Exception as e:
                    st.error(f"Error: {str(e)}")
        
        st.subheader("Network Statistics")
        if st.session_state.network.nodes:
            node_types = {}
            for n in st.session_state.network.nodes.values():
                node_type = type(n).__name__
                node_types[node_type] = node_types.get(node_type, 0) + 1
            
            stats_df = pd.DataFrame({
                'Node Type': list(node_types.keys()),
                'Count': list(node_types.values())
            })
            st.dataframe(stats_df, use_container_width=True)
    
    # NODES TAB - I'll provide this in the next part
    with tab2:
        from pypes_ui_nodes import render_nodes_tab
        render_nodes_tab(st.session_state)
    
    # CONNECTIONS TAB
    with tab3:
        from pypes_ui_connections import render_connections_tab
        render_connections_tab(st.session_state)
    
    # TAGS TAB
    with tab4:
        from pypes_ui_tags import render_tags_tab
        render_tags_tab(st.session_state)
    
    # EXPORT TAB
    with tab5:
        st.header("Export Network")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Export to JSON")
            if st.button("Generate JSON", type="primary"):
                try:
                    # Create a temporary file to export
                    with tempfile.NamedTemporaryFile(delete=False, suffix='.json', mode='w') as tmp:
                        tmp_path = tmp.name
                    
                    parser = parse_json.JSONParser(tmp_path)
                    parser.network_obj = st.session_state.network
                    json_data = parser.write()
                    
                    st.download_button(
                        "Download JSON",
                        data=json.dumps(json_data, indent=2),
                        file_name=f"{st.session_state.network.id}.json",
                        mime="application/json"
                    )
                    
                    os.unlink(tmp_path)
                except Exception as e:
                    st.error(f"Export error: {str(e)}")
        
        with col2:
            st.subheader("Export Network Summary")
            if st.button("Generate Summary CSV"):
                # Create summary dataframe
                summary_data = []
                for node_id, node_obj in st.session_state.network.nodes.items():
                    summary_data.append({
                        'ID': node_id,
                        'Type': type(node_obj).__name__,
                        'Input': str([c.name for c in node_obj.input_contents]) if hasattr(node_obj, 'input_contents') else '',
                        'Output': str([c.name for c in node_obj.output_contents]) if hasattr(node_obj, 'output_contents') else ''
                    })
                
                df = pd.DataFrame(summary_data)
                csv = df.to_csv(index=False)
                
                st.download_button(
                    "Download Summary CSV",
                    data=csv,
                    file_name=f"{st.session_state.network.id}_summary.csv",
                    mime="text/csv"
                )

else:
    st.info("Please upload a network JSON file or create a new network to begin.")
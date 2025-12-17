"""Export tab for PyPES UI"""
import streamlit as st
from pype_schema import parse_json
import json
import pandas as pd
import tempfile
import os

def render_export_tab(session_state):
    """Main function to render the export tab"""
    st.header("Export Network")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Export to JSON")
        if st.button("Generate JSON", type="primary"):
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix='.json', mode='w') as tmp:
                    tmp_path = tmp.name
                
                parser = parse_json.JSONParser(tmp_path)
                parser.network_obj = session_state.network
                json_data = parser.write()
                
                st.download_button(
                    "Download JSON",
                    data=json.dumps(json_data, indent=2),
                    file_name=f"{session_state.network.id}.json",
                    mime="application/json"
                )
                
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)
            except Exception as e:
                st.error(f"Export error: {str(e)}")
        
        st.divider()
        
        st.subheader("View JSON Preview")
        if st.button("Show JSON Preview"):
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix='.json', mode='w') as tmp:
                    tmp_path = tmp.name
                
                parser = parse_json.JSONParser(tmp_path)
                parser.network_obj = session_state.network
                json_data = parser.write()
                
                st.json(json_data)
                
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)
            except Exception as e:
                st.error(f"Preview error: {str(e)}")
    
    with col2:
        st.subheader("Export Network Summary")
        if st.button("Generate Summary CSV"):
            summary_data = []
            
            for node_id, node_obj in session_state.network.nodes.items():
                row = {
                    'Type': 'Node',
                    'ID': node_id,
                    'Class': type(node_obj).__name__,
                    'Input': '',
                    'Output': ''
                }
                
                if hasattr(node_obj, 'input_contents'):
                    row['Input'] = ', '.join([c.name for c in node_obj.input_contents])
                if hasattr(node_obj, 'output_contents'):
                    row['Output'] = ', '.join([c.name for c in node_obj.output_contents])
                
                summary_data.append(row)
            
            for conn_id, conn_obj in session_state.network.connections.items():
                row = {
                    'Type': 'Connection',
                    'ID': conn_id,
                    'Class': type(conn_obj).__name__,
                    'Input': '',
                    'Output': ''
                }
                
                if hasattr(conn_obj, 'source') and conn_obj.source:
                    row['Input'] = conn_obj.source.id
                if hasattr(conn_obj, 'destination') and conn_obj.destination:
                    row['Output'] = conn_obj.destination.id
                
                summary_data.append(row)
            
            df = pd.DataFrame(summary_data)
            csv = df.to_csv(index=False)
            
            st.download_button(
                "Download Summary CSV",
                data=csv,
                file_name=f"{session_state.network.id}_summary.csv",
                mime="text/csv"
            )
        
        st.divider()
        
        st.subheader("Network Statistics")
        
        node_count = len(session_state.network.nodes)
        conn_count = len(session_state.network.connections)
        
        tag_count = 0
        for node_obj in session_state.network.nodes.values():
            if hasattr(node_obj, 'tags'):
                tag_count += len(node_obj.tags)
        for conn_obj in session_state.network.connections.values():
            if hasattr(conn_obj, 'tags'):
                tag_count += len(conn_obj.tags)
        
        st.metric("Total Nodes", node_count)
        st.metric("Total Connections", conn_count)
        st.metric("Total Tags", tag_count)
        
        node_types = {}
        for node_obj in session_state.network.nodes.values():
            node_type = type(node_obj).__name__
            node_types[node_type] = node_types.get(node_type, 0) + 1
        
        if node_types:
            st.write("**Node Distribution:**")
            for node_type, count in node_types.items():
                st.write(f"- {node_type}: {count}")
        
        conn_types = {}
        for conn_obj in session_state.network.connections.values():
            conn_type = type(conn_obj).__name__
            conn_types[conn_type] = conn_types.get(conn_type, 0) + 1
        
        if conn_types:
            st.write("**Connection Distribution:**")
            for conn_type, count in conn_types.items():
                st.write(f"- {conn_type}: {count}")
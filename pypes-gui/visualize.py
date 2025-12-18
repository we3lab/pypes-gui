"""Visualization tab for PyPES UI"""
import os
import tempfile
import pandas as pd
import streamlit as st
from pype_schema import visualize


def render_visualize_tab(session_state):
    st.header("Network Visualization")
    
    col1, col2 = st.columns([3, 1])
    
    with col2:
        viz_type = st.radio("Visualization Type", 
                           ["Interactive (PyVis)", "Static (NetworkX)"])
        
        if st.button("🎨 Generate Visualization", type="primary"):
            try:
                ext = '.html' if viz_type.startswith("Interactive") else '.png'
                with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
                    if viz_type.startswith("Interactive"):
                        visualize.draw_graph(
                            session_state.network, 
                            pyvis=True, 
                            output_file=tmp.name
                        )
                        with open(tmp.name, 'r') as f:
                            html_content = f.read()
                        with col1:
                            st.components.v1.html(html_content, height=700, scrolling=True)
                    else:
                        visualize.draw_graph(
                            session_state.network, 
                            pyvis=False, 
                            output_file=tmp.name
                        )
                        with col1:
                            st.image(tmp.name)
                    os.unlink(tmp.name)
            except Exception as e:
                st.error(f"Visualization error: {str(e)}")
    
    # Network statistics
    st.subheader("Network Statistics")
    if session_state.network.nodes:
        node_types = {}
        for n in session_state.network.nodes.values():
            node_type = type(n).__name__
            node_types[node_type] = node_types.get(node_type, 0) + 1
        
        stats_df = pd.DataFrame({
            'Node Type': list(node_types.keys()),
            'Count': list(node_types.values())
        })
        st.dataframe(stats_df, width="stretch")

    if session_state.network.connections:
        conn_types = {}
        for c in session_state.network.connections.values():
            conn_type = type(c).__name__
            conn_types[conn_type] = conn_types.get(conn_type, 0) + 1
        
        conn_df = pd.DataFrame({
            'Connection Type': list(conn_types.keys()),
            'Count': list(conn_types.values())
        })
        st.dataframe(conn_df, width="stretch")

    # TODO: recursion is not currently considered,
    # but it will have to be handled eventually
    network_tags = session_state.network.get_all_tags()
    if network_tags:
        tag_types = {}
        for t in network_tags:
            tag_type = t.tag_type.name
            tag_types[tag_type] = tag_types.get(tag_type, 0) + 1
        
        tag_df = pd.DataFrame({
            'Tag Type': list(tag_types.keys()),
            'Count': list(tag_types.values())
        })
        st.dataframe(tag_df, width="stretch")

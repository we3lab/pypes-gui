"""Visualization tab for PyPES UI"""
import os
import plotly
import requests
import tempfile
import pandas as pd
import streamlit as st
from pype_schema import visualize, node, connection
from pype_schema.utils import ContentsType
from utils import get_node_types, get_connection_types, get_contents_enum

import plotly.graph_objects as go
from streamlit_plotly_events import plotly_events

# Icon mapping for node types
ICON_MAP = {
    "Network": "network.svg",
    "Facility": "facility.svg",
    "Junction": "junction.svg",
    "Valve": "valve.svg",
    "Tank": "tank.svg",
    "Reservoir": "reservoir.svg",
    "Pump": "pump.svg",
    "Aeration": "aeration.svg",
    "Clarification": "clarifier.svg",
    "Thickening": "thickener.svg",
    "Screening": "screen.svg",
    "Conditioning": "conditioning.svg",
    "Reactor": "reactor.svg",
    "Digestion": "digester.svg",
    "Filtration": "filter.svg",
    "ROMembrane": "ro-membrane.svg",
    "Cogeneration": "cogeneration.svg",
    "Boiler": "boiler.svg",
    "Separator": "separator.svg",
    "PRV": "prv.svg",
    "ModularUnit": "modular-unit.svg",
    "StaticMixer": "static-mixer.svg",
    "Battery": "battery.svg",
    "Disinfection": "disinfection.svg",
    "Chlorination": "chlorination.svg",
    "UVSystem": "uv-system.svg",
    "Flaring": "flaring.svg",
}

# GitHub raw content base URL
ICON_BASE_URL = "https://raw.githubusercontent.com/we3lab/pypes-gui/main/frontend/public/"

def load_svg_icon(icon_name):
    """Load SVG icon from GitHub"""
    try:
        url = f"{ICON_BASE_URL}{icon_name}"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return response.text
        return None
    except Exception as e:
        st.error(f"Failed to load icon {icon_name}: {e}")
        return None



def render_grid_editor(session_state):
    """Render the grid-based editor using Plotly"""
    
    # Initialize grid positions if not exists
    if 'node_positions' not in st.session_state:
        st.session_state.node_positions = {}
    
    if 'grid_connections' not in st.session_state:
        st.session_state.grid_connections = []

    col_sidebar, col_grid = st.columns([1, 4])
    
    with col_sidebar:
        st.subheader("Node Palette")
        
        # Filter by node type
        filter_type = st.selectbox("Filter", ["All"] + get_node_types())
        
        node_types = get_node_types()
        if filter_type != "All":
            node_types = [filter_type]
        
        # Display icons in sidebar
        for node_type in node_types:
            if st.button(node_type, key=f"add_{node_type}", use_container_width=True):
                st.session_state.selected_node_type = node_type
                st.session_state.placement_mode = True
        
        st.divider()
        
        # Connection tools
        st.subheader("Connections")
        
        if st.button("Create Connection", use_container_width=True):
            st.session_state.connection_mode = True
            st.session_state.connection_start = None
        
        conn_type = st.selectbox("Connection Type", get_connection_types())
        contents_type = st.selectbox("Contents", get_contents_enum())
        
        st.divider()
        
        # Grid controls
        st.subheader("Controls")
        if st.button("Clear Grid", use_container_width=True):
            st.session_state.node_positions = {}
            st.session_state.grid_connections = []
            st.rerun()
        
        if st.button("Export to Network", type="primary", use_container_width=True):
            export_grid_to_network(session_state)
    
    with col_grid:
        st.subheader("Grid Editor")
        
        fig = go.Figure()

        # Add grid cells using a heatmap
        grid_size = 20
        z = [[0 for _ in range(grid_size)] for _ in range(grid_size)]
        fig.add_trace(go.Heatmap(
            z=z,
            colorscale=[[0, 'white'], [1, 'white']],
            showscale=False,
            hoverinfo='none',
        ))

        # Add nodes
        for node_id, pos in st.session_state.node_positions.items():
            fig.add_trace(go.Scatter(
                x=[pos['col']],
                y=[pos['row']],
                mode='markers+text',
                marker=dict(symbol='circle', size=30, color='lightblue'),
                text=pos['type'],
                textposition="middle center",
                name=node_id,
            ))
            
        # Add connections
        for conn in st.session_state.grid_connections:
            start_pos = st.session_state.node_positions.get(conn['start'])
            end_pos = st.session_state.node_positions.get(conn['end'])
            if start_pos and end_pos:
                fig.add_trace(go.Scatter(
                    x=[start_pos['col'], end_pos['col']],
                    y=[start_pos['row'], end_pos['row']],
                    mode='lines',
                    line=dict(width=2, color='blue'),
                ))

        fig.update_layout(
            showlegend=False,
            xaxis=dict(range=[-0.5, grid_size - 0.5], showgrid=True, zeroline=False, visible=False),
            yaxis=dict(range=[-0.5, grid_size - 0.5], showgrid=True, zeroline=False, visible=False, scaleanchor="x", scaleratio=1),
            plot_bgcolor='white',
            margin=dict(l=0, r=0, t=0, b=0),
            height=800,
        )

        selected_points = plotly_events(fig, click_event=True)

        st.write("Selected points:", selected_points)

        # Handle events
        if session_state.get('placement_mode') and selected_points:
            point = selected_points[0]
            row, col = point['y'], point['x']
            
            # Find a unique id
            new_id = f"{st.session_state.selected_node_type}_{len(st.session_state.node_positions)}"
            
            st.session_state.node_positions[new_id] = {
                "type": st.session_state.selected_node_type,
                "row": row,
                "col": col,
            }
            st.session_state.placement_mode = False
            st.rerun()

def export_grid_to_network(session_state):
    """Export grid layout to PyPES network"""
    try:
        # Create nodes from grid positions
        for node_id, pos in st.session_state.node_positions.items():
            node_type = pos['type']
            
            # Create node if it doesn't exist
            if node_id not in session_state.network.nodes:
                # Get the node class
                node_class = getattr(node, node_type)
                new_node = node_class(node_id, [], [])
                session_state.network.nodes[node_id] = new_node
        
        # Create connections from grid
        for conn in st.session_state.grid_connections:
            conn_id = f"{conn['start']}_to_{conn['end']}"
            
            if conn_id not in session_state.network.connections:
                source = session_state.network.nodes[conn['start']]
                dest = session_state.network.nodes[conn['end']]
                
                # Create appropriate connection type
                conn_class = getattr(connection, conn['type'])
                contents = ContentsType[conn['contents']]
                
                new_conn = conn_class(conn_id, source, dest, contents)
                session_state.network.connections[conn_id] = new_conn
        
        st.success("Grid exported to network!")
        st.rerun()
        
    except Exception as e:
        st.error(f"Export failed: {str(e)}")
        import traceback
        st.error(traceback.format_exc())

def render_visualize_tab(session_state):
    """Main visualization tab with mode selection"""
    st.header("Network Visualization")
    
    viz_mode = st.radio(
        "Visualization Mode",
        ["Grid Editor", "Network Viewer"],
        horizontal=True
    )
    
    if viz_mode == "Grid Editor":
        render_grid_editor(session_state)
    else:
        render_network_viewer(session_state)

def render_network_viewer(session_state):
    """Original network visualization"""
    col1, col2 = st.columns([3, 1])
    
    with col2:
        viz_type = st.radio("Visualization Type", 
                           ["Interactive (PyVis)", "Static (NetworkX)"])
        
        if st.button("Generate Visualization", type="primary"):
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
        st.dataframe(stats_df, use_container_width=True)
    
    if session_state.network.connections:
        conn_types = {}
        for c in session_state.network.connections.values():
            conn_type = type(c).__name__
            conn_types[conn_type] = conn_types.get(conn_type, 0) + 1
        
        conn_df = pd.DataFrame({
            'Connection Type': list(conn_types.keys()),
            'Count': list(conn_types.values())
        })
        st.dataframe(conn_df, use_container_width=True)

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
        st.dataframe(tag_df, use_container_width=True)

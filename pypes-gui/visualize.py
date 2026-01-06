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
    """Render the grid-based editor with drag and drop"""
    
    # Initialize grid positions if not exists
    if 'node_positions' not in st.session_state:
        st.session_state.node_positions = {}
    
    if 'grid_connections' not in st.session_state:
        st.session_state.grid_connections = []
    
    # CSS for grid and drag-drop
    st.markdown("""
    <style>
    .grid-container {
        display: grid;
        grid-template-columns: repeat(20, 50px);
        grid-template-rows: repeat(20, 50px);
        gap: 1px;
        background-color: #f0f0f0;
        padding: 10px;
        border: 2px solid #ccc;
        position: relative;
        overflow: auto;
        max-height: 800px;
    }
    .grid-cell {
        background-color: white;
        border: 1px solid #ddd;
        position: relative;
    }
    .node-icon {
        width: 45px;
        height: 45px;
        cursor: move;
        position: absolute;
    }
    .sidebar-icon {
        width: 40px;
        height: 40px;
        margin: 5px;
        cursor: pointer;
        border: 2px solid #ddd;
        padding: 5px;
        border-radius: 5px;
        background: white;
    }
    .sidebar-icon:hover {
        border-color: #1f77b4;
        background: #e3f2fd;
    }
    .connection-line {
        position: absolute;
        background-color: #1f77b4;
        height: 3px;
        transform-origin: 0 0;
        pointer-events: none;
        z-index: 1;
    }
    .node-label {
        font-size: 10px;
        text-align: center;
        margin-top: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    </style>
    """, unsafe_allow_html=True)
    
    col_sidebar, col_grid = st.columns([1, 4])
    
    with col_sidebar:
        st.subheader("🎨 Node Palette")
        
        # Filter by node type
        filter_type = st.selectbox("Filter", ["All"] + get_node_types())
        
        node_types = get_node_types()
        if filter_type != "All":
            node_types = [filter_type]
        
        # Display icons in sidebar
        for node_type in node_types:
            icon_name = ICON_MAP.get(node_type, "network.svg")
            svg_content = load_svg_icon(icon_name)
            
            col1, col2 = st.columns([1, 3])
            with col1:
                if svg_content:
                    st.markdown(f'<div class="sidebar-icon">{svg_content}</div>', unsafe_allow_html=True)
                else:
                    st.write("📦")
            with col2:
                if st.button(node_type, key=f"add_{node_type}", use_container_width=True):
                    st.session_state.selected_node_type = node_type
                    st.session_state.placement_mode = True
        
        st.divider()
        
        # Connection tools
        st.subheader("🔗 Connections")
        
        if st.button("Create Connection", use_container_width=True):
            st.session_state.connection_mode = True
            st.session_state.connection_start = None
        
        conn_type = st.selectbox("Connection Type", get_connection_types())
        contents_type = st.selectbox("Contents", get_contents_enum())
        
        st.divider()
        
        # Grid controls
        st.subheader("⚙️ Controls")
        if st.button("Clear Grid", use_container_width=True):
            st.session_state.node_positions = {}
            st.session_state.grid_connections = []
            st.rerun()
        
        if st.button("Export to Network", type="primary", use_container_width=True):
            export_grid_to_network(session_state)
    
    with col_grid:
        st.subheader("Grid Editor")
        
        # Display instructions
        if st.session_state.get('placement_mode'):
            st.info(f"Click on grid to place: {st.session_state.selected_node_type}")
        elif st.session_state.get('connection_mode'):
            st.info("Click on two nodes to create a connection")
        
        # Render the grid
        component_value = render_interactive_grid(session_state, conn_type, contents_type)

        if component_value and 'drop' in component_value:
            node_id = component_value['drop']['nodeId']
            new_row = int(component_value['drop']['row'])
            new_col = int(component_value['drop']['col'])

            if node_id in st.session_state.node_positions:
                st.session_state.node_positions[node_id]['row'] = new_row
                st.session_state.node_positions[node_id]['col'] = new_col
                st.rerun()

def render_interactive_grid(session_state, conn_type, contents_type):
    """Render interactive grid with HTML/JS"""
    
    grid_size = 20
    
    # Build HTML for grid
    grid_html = '<div class="grid-container" id="grid">'
    
    # Add grid cells
    for row in range(grid_size):
        for col in range(grid_size):
            grid_html += f'<div class="grid-cell" data-row="{row}" data-col="{col}"></div>'
    
    # Add nodes
    for node_id, pos in st.session_state.node_positions.items():
        row, col, node_type = pos['row'], pos['col'], pos['type']
        icon_name = ICON_MAP.get(node_type, "network.svg")
        svg_content = load_svg_icon(icon_name)
        
        if svg_content:
            left = col * 51 + 10  # 50px cell + 1px gap
            top = row * 51 + 10
            grid_html += f'''
            <div class="node-icon" style="left:{left}px; top:{top}px;" 
                 data-node-id="{node_id}" data-row="{row}" data-col="{col}" draggable="true">
                {svg_content}
                <div class="node-label">{node_id}</div>
            </div>
            '''
    
    # Add connection lines
    for conn in st.session_state.grid_connections:
        start_pos = st.session_state.node_positions.get(conn['start'])
        end_pos = st.session_state.node_positions.get(conn['end'])
        
        if start_pos and end_pos:
            x1 = start_pos['col'] * 51 + 25 + 10
            y1 = start_pos['row'] * 51 + 25 + 10
            x2 = end_pos['col'] * 51 + 25 + 10
            y2 = end_pos['row'] * 51 + 25 + 10
            
            length = ((x2-x1)**2 + (y2-y1)**2)**0.5
            angle = 0
            if length > 0:
                import math
                angle = math.atan2(y2-y1, x2-x1) * 180 / math.pi
            
            grid_html += f'''
            <div class="connection-line" 
                 style="left:{x1}px; top:{y1}px; width:{length}px; 
                        transform:rotate({angle}deg);"></div>
            '''
    
    grid_html += '</div>'
    
    # JavaScript for interactivity
    grid_js = """
    <script>
    const grid = document.getElementById('grid');
    const cells = grid.querySelectorAll('.grid-cell');
    
    cells.forEach(cell => {
        cell.addEventListener('click', function() {
            const row = this.getAttribute('data-row');
            const col = this.getAttribute('data-col');
            
            // Send to Streamlit
            window.parent.postMessage({
                type: 'streamlit:setComponentValue',
                value: {row: row, col: col}
            }, '*');
        });

        cell.addEventListener('dragover', function(e) {
            e.preventDefault();
        });

        cell.addEventListener('drop', function(e) {
            e.preventDefault();
            const nodeId = e.dataTransfer.getData('text/plain');
            const row = this.getAttribute('data-row');
            const col = this.getAttribute('data-col');

            window.parent.postMessage({
                type: 'streamlit:setComponentValue',
                value: { drop: { nodeId: nodeId, row: row, col: col } }
            }, '*');
        });
    });
    
    // Node click handlers
    const nodes = grid.querySelectorAll('.node-icon');
    nodes.forEach(node => {
        node.addEventListener('click', function(e) {
            e.stopPropagation();
            const nodeId = this.getAttribute('data-node-id');
            
            window.parent.postMessage({
                type: 'streamlit:setComponentValue',
                value: {nodeClick: nodeId}
            }, '*');
        });

        node.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.getAttribute('data-node-id'));
        });
    });
    </script>
    """
    
    # Display grid
    component_value = st.components.v1.html(grid_html + grid_js, height=850, scrolling=True)
    return component_value
    
    # Handle grid clicks (simplified for now - you'd need proper component communication)
    st.write("**Nodes on Grid:**")
    for node_id, pos in st.session_state.node_positions.items():
        col1, col2, col3 = st.columns([2, 1, 1])
        with col1:
            st.write(f"{node_id} ({pos['type']})")
        with col2:
            st.write(f"Pos: ({pos['row']}, {pos['col']})")
        with col3:
            if st.button("❌", key=f"del_{node_id}"):
                del st.session_state.node_positions[node_id]
                # Remove connections involving this node
                st.session_state.grid_connections = [
                    c for c in st.session_state.grid_connections 
                    if c['start'] != node_id and c['end'] != node_id
                ]
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
                            output_file=.name
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
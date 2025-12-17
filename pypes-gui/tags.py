"""Tags tab for PyPES UI"""
import streamlit as st
from pype_schema import tag, utils
from pype_schema.units import u

def get_tag_types():
    """Get all available TagType values"""
    return [member.name for member in utils.TagType]

def get_contents_enum():
    """Get all available ContentsType values"""
    return [member.name for member in utils.ContentsType]

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

def render_tags_tab(session_state):
    """Main function to render the tags tab"""
    st.header("Tag Management")
    
    all_tags = {}
    
    for node_id, node_obj in session_state.network.nodes.items():
        if hasattr(node_obj, 'tags'):
            for tag_id, tag_obj in node_obj.tags.items():
                all_tags[tag_id] = {
                    'tag': tag_obj,
                    'parent': node_obj,
                    'parent_id': node_id,
                    'parent_type': 'Node'
                }
    
    for conn_id, conn_obj in session_state.network.connections.items():
        if hasattr(conn_obj, 'tags'):
            for tag_id, tag_obj in conn_obj.tags.items():
                all_tags[tag_id] = {
                    'tag': tag_obj,
                    'parent': conn_obj,
                    'parent_id': conn_id,
                    'parent_type': 'Connection'
                }
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        render_tag_list(all_tags, session_state)
    
    with col2:
        render_tag_form(session_state)

def render_tag_list(all_tags, session_state):
    """Render list of existing tags"""
    st.subheader("📋 Existing Tags")
    
    if all_tags:
        search = st.text_input("🔍 Search tags", "")
        
        filtered_tags = {
            k: v for k, v in all_tags.items()
            if search.lower() in k.lower() or search.lower() in v['parent_id'].lower()
        }
        
        for tag_id, tag_info in filtered_tags.items():
            tag_obj = tag_info['tag']
            tag_class = type(tag_obj).__name__
            
            with st.expander(f"**{tag_id}** ({tag_class})"):
                st.write(f"**Type:** {tag_class}")
                st.write(f"**Parent:** {tag_info['parent_id']} ({tag_info['parent_type']})")
                
                if hasattr(tag_obj, 'tag_type'):
                    st.write(f"**Tag Type:** {tag_obj.tag_type.name}")
                if hasattr(tag_obj, 'units') and tag_obj.units:
                    st.write(f"**Units:** {tag_obj.units}")
                if hasattr(tag_obj, 'contents') and tag_obj.contents:
                    st.write(f"**Contents:** {tag_obj.contents.name}")
                if hasattr(tag_obj, 'totalized'):
                    st.write(f"**Totalized:** {tag_obj.totalized}")
                if hasattr(tag_obj, 'source_unit_id') and tag_obj.source_unit_id:
                    st.write(f"**Source Unit ID:** {tag_obj.source_unit_id}")
                if hasattr(tag_obj, 'dest_unit_id') and tag_obj.dest_unit_id:
                    st.write(f"**Dest Unit ID:** {tag_obj.dest_unit_id}")
                
                if st.button(f"🗑️ Delete", key=f"del_tag_{tag_id}"):
                    parent_obj = tag_info['parent']
                    if hasattr(parent_obj, 'tags') and tag_id in parent_obj.tags:
                        del parent_obj.tags[tag_id]
                        st.success(f"Deleted tag: {tag_id}")
                        st.rerun()
    else:
        st.info("No tags yet. Add one to get started!")

def render_tag_form(session_state):
    """Render form for adding tags"""
    st.subheader("Add New Tag")
    
    with st.form("tag_form"):
        tag_id = st.text_input("Tag ID*", "")
        
        parent_type = st.radio("Parent Type", ["Node", "Connection"])
        
        if parent_type == "Node":
            parent_ids = [""] + list(session_state.network.nodes.keys())
        else:
            parent_ids = [""] + list(session_state.network.connections.keys())
        
        parent_id = st.selectbox("Parent*", parent_ids)
        
        tag_types = get_tag_types()
        tag_type_str = st.selectbox("Tag Type*", tag_types)
        
        contents_options = get_contents_enum()
        contents_str = st.selectbox("Contents*", contents_options)
        
        ucol1, ucol2 = st.columns(2)
        with ucol1:
            unit_val = st.text_input("Unit Value", "1.0")
        with ucol2:
            unit_str = st.text_input("Unit (e.g., m**3/day, kW)", "")
        
        totalized = st.checkbox("Totalized", value=False)
        
        source_unit_id = st.text_input("Source Unit ID (optional)", "")
        dest_unit_id = st.text_input("Destination Unit ID (optional)", "")
        
        manufacturer = st.text_input("Manufacturer (optional)", "")
        
        if st.form_submit_button("Add Tag"):
            if not tag_id or not parent_id:
                st.error("Tag ID and Parent are required!")
                return
            
            try:
                tag_type_enum = utils.TagType[tag_type_str]
                contents_enum = utils.ContentsType[contents_str]
                
                units = parse_unit_input(unit_val, unit_str) if unit_str else None
                
                source_unit = int(source_unit_id) if source_unit_id.isdigit() else (source_unit_id if source_unit_id else None)
                dest_unit = int(dest_unit_id) if dest_unit_id.isdigit() else (dest_unit_id if dest_unit_id else None)
                
                new_tag = tag.Tag(
                    tag_id,
                    tag_type=tag_type_enum,
                    contents=contents_enum,
                    units=units,
                    totalized=totalized,
                    source_unit_id=source_unit,
                    dest_unit_id=dest_unit,
                    parent_id=parent_id,
                    manufacturer=manufacturer if manufacturer else None
                )
                
                if parent_type == "Node":
                    parent_obj = session_state.network.nodes.get(parent_id)
                else:
                    parent_obj = session_state.network.connections.get(parent_id)
                
                if parent_obj:
                    if not hasattr(parent_obj, 'tags'):
                        parent_obj.tags = {}
                    parent_obj.tags[tag_id] = new_tag
                    st.success(f"Added tag: {tag_id}")
                    st.rerun()
                else:
                    st.error("Parent object not found!")
                    
            except Exception as e:
                st.error(f"Error creating tag: {str(e)}")
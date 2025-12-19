"""Tags tab for PyPES UI"""
# external dependencies
import streamlit as st

# pypes imports
from pype_schema.units import u
from pype_schema import tag, utils

# local imports
from utils import get_tag_types, parse_unit_input, get_contents_enum, remove_keys


def render_tags_tab(session_state):
    """Main function to render the tags tab"""
    st.header("Tag Management")

    # Initialize selected_tag in session state if not exists
    if 'selected_tag' not in st.session_state:
        st.session_state.selected_tag = None
    
    all_tags = {tag.id: tag for tag in session_state.network.get_all_tags(recurse=True)}
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        render_tag_list(all_tags, session_state)
    
    with col2:
        # Show appropriate form based on selection
        if st.session_state.selected_tag:
            tag_obj = all_tags.get(st.session_state.selected_tag)
            if isinstance(tag_obj, tag.VirtualTag):
                render_virtual_tag_form(session_state, all_tags)
            else:
                render_tag_form(session_state, all_tags)
        else:
            # Show tabs for creating new tags
            tag_tab1, tag_tab2 = st.tabs(["Standard Tag", "Virtual Tag"])
            with tag_tab1:
                render_tag_form(session_state, all_tags)
            with tag_tab2:
                render_virtual_tag_form(session_state, all_tags)

def render_tag_list(all_tags, session_state):
    """Render list of existing tags"""
    st.subheader("Existing Tags")
    
    if all_tags:
        search = st.text_input("Search tags", "", key="search_tags")
        
        filtered_tags = {
            k: v for k, v in all_tags.items()
            if search.lower() in k.lower() or search.lower() in v.parent_id.lower()
        }
        
        for tag_id, tag_obj in filtered_tags.items():
            tag_class = type(tag_obj).__name__
            
            with st.expander(f"**{tag_id}** ({tag_class})"):
                st.write(f"**Type:** {tag_class}")
                st.write(f"**Parent:** {tag_obj.parent_id}")
                
                if hasattr(tag_obj, "tag_type"):
                    st.write(f"**Tag Type:** {tag_obj.tag_type.name}")
                if hasattr(tag_obj, "units") and tag_obj.units:
                    st.write(f"**Units:** {tag_obj.units}")
                if hasattr(tag_obj, "contents") and tag_obj.contents:
                    st.write(f"**Contents:** {tag_obj.contents.name}")
                if hasattr(tag_obj, "totalized"):
                    st.write(f"**Totalized:** {tag_obj.totalized}")
                if hasattr(tag_obj, "source_unit_id") and tag_obj.source_unit_id:
                    st.write(f"**Source Unit ID:** {tag_obj.source_unit_id}")
                if hasattr(tag_obj, "dest_unit_id") and tag_obj.dest_unit_id:
                    st.write(f"**Dest Unit ID:** {tag_obj.dest_unit_id}")
                
                # Virtual tag specific fields 
                if isinstance(tag_obj, tag.VirtualTag):
                    if hasattr(tag_obj, "expression") and tag_obj.expression:
                        st.write(f"**Expression:** {tag_obj.expression}")
                    if hasattr(tag_obj, "operands") and tag_obj.operands:
                        st.write(f"**Operands:** {', '.join(tag_obj.operands)}")
                
                btn_col1, btn_col2 = st.columns(2)
                with btn_col1:
                    if st.button(f"✏️ Edit", key=f"edit_tag_{tag_id}"):
                        st.session_state.selected_tag = tag_id
                        st.rerun()
                with btn_col2:
                    if st.button(f"Delete", key=f"del_tag_{tag_id}"):
                        parent_obj = session_state.network.get_parent_from_tag(tag_obj)
                        if hasattr(parent_obj, "tags") and tag_id in parent_obj.tags:
                            del parent_obj.tags[tag_id]
                            st.success(f"Deleted tag: {tag_id}")
                            st.rerun()
    else:
        st.info("No tags yet. Add one to get started!")

def render_tag_form(session_state, all_tags=None):
    """Render form for adding tags"""
    existing_tag_obj = None
    if st.session_state.selected_tag and all_tags:
        existing_tag_obj = all_tags.get(st.session_state.selected_tag)
    
    if existing_tag_obj:
        st.subheader(f"Edit Tag: {st.session_state.selected_tag}")
        if st.button("Cancel", key="cancel_edit_tag"):
            st.session_state.selected_tag = None
            st.rerun()
    else:
        st.subheader("Add New Tag")
    
    with st.form("tag_form"):
        if existing_tag_obj:
            tag_id = st.text_input("Tag ID*", value=st.session_state.selected_tag, disabled=True)
        else:
            tag_id = st.text_input("Tag ID*", "")  
        
        # TODO: parent_type should be read in as a default
        # Parent node or connection
        parent_type = st.radio("Parent Type", ["Node", "Connection"])
    
        if parent_type == "Node":
            parent_ids = [""] + [node.id for node in session_state.network.get_all_nodes(recurse=True)]
        else:
            parent_ids = [""] + [conn.id for conn in session_state.network.get_all_connections(recurse=True)]
        
        parent_id = st.selectbox("Parent*", parent_ids)
        
        # Tag type
        tag_types = get_tag_types()
        default_tag_type = tag.TagType.Flow
        if existing_tag_obj and hasattr(existing_tag_obj, "tag_type"):
            default_tag_type = existing_tag_obj.tag_type.name
        tag_type_str = st.selectbox(
            "Tag Type*", 
            tag_types,
            index=tag_types.index(default_tag_type) if default_tag_type in tag_types else 0,
        )
        
        # Contents type
        contents_options = get_contents_enum()
        default_contents = contents_options[0]
        if existing_tag_obj and hasattr(existing_tag_obj, "contents"):
            default_contents = existing_tag_obj.contents.name 
        contents_str = st.selectbox(
            "Contents*", 
            contents_options,
            index=contents_options.index(default_contents) if default_contents in contents_options else 0,
        )
        
        # Units
        ucol1, ucol2 = st.columns(2)
        with ucol1:
            default_unit_val = "1.0"
            if existing_tag_obj and hasattr(existing_tag_obj, "units") and existing_tag_obj.units:
                default_unit_val = str(existing_tag_obj.units.magnitude)
            unit_val = st.text_input("Unit Value", default_unit_val, key="tag_unit_val")
        with ucol2:
            default_unit_str = ""
            if existing_tag_obj and hasattr(existing_tag_obj, "units") and existing_tag_obj.units:
                default_unit_str = str(existing_tag_obj.units.units)
            unit_str = st.text_input("Unit (e.g., m**3/day, kW)", default_unit_str, key="tag_unit_str")

        # Totalized
        default_totalized = False
        if existing_tag_obj and hasattr(existing_tag_obj, "totalized"):
            default_totalized = existing_tag_obj.totalized
        totalized = st.checkbox("Totalized", value=default_totalized, key="tag_totalized")
        
        # Source and destination
        default_source = ""
        default_dest = ""
        if existing_tag_obj:
            if hasattr(existing_tag_obj, "source_unit_id") and existing_tag_obj.source_unit_id:
                default_source = str(existing_tag_obj.source_unit_id)
            if hasattr(existing_tag_obj, "dest_unit_id") and existing_tag_obj.dest_unit_id:
                default_dest = str(existing_tag_obj.dest_unit_id)
        
        source_unit_id = st.text_input("Source Unit ID (optional)", default_source)
        dest_unit_id = st.text_input("Destination Unit ID (optional)", default_dest)
        
        # Manufacturer
        default_manufacturer = ""
        if existing_tag_obj and hasattr(existing_tag_obj, "manufacturer"):
            default_manufacturer = existing_tag_obj.manufacturer or ""
        manufacturer = st.text_input("Manufacturer (optional)", default_manufacturer, key="tag_manufacturer")  
        
        # Submit button
        submit_label = "Update Tag" if existing_tag_obj else "Add Tag"
        if st.form_submit_button(submit_label):
            if not tag_id or not parent_id:
                st.error("Tag ID and Parent are required!")
                return
            
            try:
                tag_type_enum = tag.TagType[tag_type_str]
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
                    all_nodes = {node.id: node for node in session_state.network.get_all_nodes(recurse=True)}
                    parent_obj = all_nodes.get(parent_id)
                else:
                    all_conns = {conn.id: conn for conn in session_state.network.get_all_connections(recurse=True)}
                    parent_obj = all_conns.get(parent_id)
                
                if parent_obj:
                    if not hasattr(parent_obj, "tags"):
                        parent_obj.tags = {}
                    parent_obj.tags[tag_id] = new_tag
                    
                    if existing_tag_obj:
                        st.success(f"Updated tag: {tag_id}")
                        st.session_state.selected_tag = None
                    else:
                        st.success(f"Added tag: {tag_id}")
                    st.rerun()
                else:
                    st.error("Parent object not found!")
                    
            except Exception as e:
                st.error(f"Error creating tag: {str(e)}")

# TODO: Add algebraic vs lambda function execution mode
def render_virtual_tag_form(session_state, all_tags=None):
    """Render form for adding/editing virtual tags"""
    
    # Check if editing
    existing_tag_obj = None
    if st.session_state.selected_tag and all_tags:
        existing_tag_obj = all_tags.get(st.session_state.selected_tag)
    
    if existing_tag_obj:
        st.subheader(f"Edit Virtual Tag: {st.session_state.selected_tag}")
        if st.button("Cancel", key="cancel_edit_virtual_tag"):
            st.session_state.selected_tag = None
            st.rerun()
    else:
        st.subheader("Add New Virtual Tag")
    
    with st.form("virtual_tag_form"):
        # Tag ID
        if existing_tag_obj:
            tag_id = st.text_input("Tag ID*", value=st.session_state.selected_tag, disabled=True)
        else:
            tag_id = st.text_input("Tag ID*", "")
        
        # Parent selection
        parent_type = st.radio(
            "Parent Type", 
            ["Node", "Connection"],
            key="vtag_parent_type"
        )
        
        if parent_type == "Node":
            parent_ids = [""] + list(session_state.network.nodes.keys())
        else:
            parent_ids = [""] + list(session_state.network.connections.keys())
        
        default_parent = ""
        if existing_tag_obj:
            default_parent = existing_tag_obj.parent_id
        
        parent_id = st.selectbox(
            "Parent*", 
            parent_ids,
            index=parent_ids.index(default_parent) if default_parent in parent_ids else 0,
            key="vtag_parent_id"
        )
        
        # Tag type
        tag_types = get_tag_types()
        default_tag_type = "DataTag"
        if existing_tag_obj and hasattr(existing_tag_obj, "tag_type"):
            default_tag_type = existing_tag_obj.tag_type.name
        
        tag_type_str = st.selectbox(
            "Tag Type*", 
            tag_types,
            index=tag_types.index(default_tag_type) if default_tag_type in tag_types else 0,
            key="vtag_type"
        )

        # TODO: add submission logic
        # Submit button
        submit_label = "Update Tag" if existing_tag_obj else "Add Tag"
        if st.form_submit_button(submit_label):
            pass
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
                    if st.button(f"Edit", key=f"edit_tag_{tag_id}"):
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
        
        # TODO: support contentless tags
        # Contents type
        contents_options = get_contents_enum()
        default_contents = ""
        if existing_tag_obj and hasattr(existing_tag_obj, "contents") and existing_tag_obj.contents:
            default_contents = existing_tag_obj.contents.name 
        contents_str = st.selectbox(
            "Contents*", 
            contents_options,
            index=contents_options.index(default_contents) if default_contents in contents_options else 0,
        )
        
        # Units
        default_unit_str = ""
        if existing_tag_obj and hasattr(existing_tag_obj, "units") and existing_tag_obj.units:
            default_unit_str = str(existing_tag_obj.units)
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


def render_virtual_tag_form(session_state, all_tags=None):
    """Render form for adding/editing virtual tags"""
    # Check if editing existing tag
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
            key="vtag_tag_type"
        )
        
        # TODO: support contentless tags
        # Contents
        contents_options = get_contents_enum()
        default_contents = ""
        if existing_tag_obj and hasattr(existing_tag_obj, "contents") and existing_tag_obj.contents:
            default_contents = existing_tag_obj.contents.name
        
        contents_str = st.selectbox(
            "Contents*", 
            contents_options,
            index=contents_options.index(default_contents) if default_contents in contents_options else 0,
            key="vtag_contents"
        )
        
        # Units
        st.write("**Units**")
        default_unit_str = ""
        if existing_tag_obj and hasattr(existing_tag_obj, "units") and existing_tag_obj.units:
            default_unit_str = str(existing_tag_obj.units)
        unit_str = st.text_input("Unit (e.g., m**3/day, kW)", default_unit_str, key="vtag_unit_str")
        
        # Totalized
        default_totalized = False
        if existing_tag_obj and hasattr(existing_tag_obj, "totalized"):
            default_totalized = existing_tag_obj.totalized
        totalized = st.checkbox("Totalized", value=default_totalized, key="vtag_totalized")
        
        st.divider()
        
        # Operation Mode
        st.write("**Virtual Tag Configuration**")
        mode_options = ["Algebraic", "Custom"]
        default_mode = "Algebraic"
        if existing_tag_obj and hasattr(existing_tag_obj, "mode"):
            default_mode = existing_tag_obj.mode.name
        
        operation_mode = st.selectbox(
            "Operation Mode",
            mode_options,
            index=mode_options.index(default_mode) if default_mode in mode_options else 0,
            key="vtag_mode",
            help="Algebraic: Apply unary then binary operations. Custom: Use lambda function."
        )
        
        # Get all available tags for selection
        all_available_tags = {}
        for node_obj in session_state.network.get_all_nodes(recurse=True):
            if hasattr(node_obj, "tags"):
                all_available_tags.update(node_obj.tags)
        for conn_obj in session_state.network.get_all_connections(recurse=True):
            if hasattr(conn_obj, "tags"):
                all_available_tags.update(conn_obj.tags)
        
        # Remove current tag from available tags if editing
        if existing_tag_obj:
            all_available_tags = {k: v for k, v in all_available_tags.items() if k != st.session_state.selected_tag}
        
        tag_options = list(all_available_tags.keys())
        
        # Select constituent tags
        default_selected_tags = []
        if existing_tag_obj and hasattr(existing_tag_obj, "tags"):
            default_selected_tags = [t.id for t in existing_tag_obj.tags]
        
        selected_tag_ids = st.multiselect(
            "Constituent Tags*",
            tag_options,
            default=default_selected_tags,
            key="vtag_constituent_tags",
            help="Select the tags to combine in this virtual tag"
        )
        
        if operation_mode == "Algebraic":
            st.write("**Algebraic Operations**")
            
            # Unary operations
            st.caption("Unary Operations (applied to each tag)")
            unary_ops_options = ["noop", "delta", "<<", ">>", "~", "-"]
            
            default_unary = []
            if existing_tag_obj and hasattr(existing_tag_obj, "unary_operations"):
                if isinstance(existing_tag_obj.unary_operations, list):
                    default_unary = existing_tag_obj.unary_operations
                else:
                    default_unary = [existing_tag_obj.unary_operations] * len(selected_tag_ids)
            
            unary_operations = []
            for i, tag_id in enumerate(selected_tag_ids):
                default_unary_op = default_unary[i] if i < len(default_unary) else "noop"
                unary_op = st.selectbox(
                    f"Unary operation for {tag_id}",
                    unary_ops_options,
                    index=unary_ops_options.index(default_unary_op) if default_unary_op in unary_ops_options else 0,
                    key=f"vtag_unary_{i}",
                    help="noop=no operation, delta=difference, <<=shift left, >>=shift right, ~=boolean not, -=negate"
                )
                unary_operations.append(unary_op)
            
            # Binary operations
            if len(selected_tag_ids) > 1:
                st.caption("Binary Operations (combine tags sequentially)")
                binary_ops_options = ["+", "-", "*", "/"]
                
                default_binary = []
                if existing_tag_obj and hasattr(existing_tag_obj, "binary_operations"):
                    if isinstance(existing_tag_obj.binary_operations, list):
                        default_binary = existing_tag_obj.binary_operations
                    else:
                        default_binary = [existing_tag_obj.binary_operations] * (len(selected_tag_ids) - 1)
                
                binary_operations = []
                for i in range(len(selected_tag_ids) - 1):
                    default_binary_op = default_binary[i] if i < len(default_binary) else "+"
                    binary_op = st.selectbox(
                        f"Operation between tags {i} and {i+1}",
                        binary_ops_options,
                        index=binary_ops_options.index(default_binary_op) if default_binary_op in binary_ops_options else 0,
                        key=f"vtag_binary_{i}",
                        help="Operation to combine consecutive tags"
                    )
                    binary_operations.append(binary_op)
            else:
                binary_operations = None
            
            custom_operations = None
            
        else:  # Custom mode
            st.write("**Custom Lambda Function**")
            
            default_custom = ""
            if existing_tag_obj and hasattr(existing_tag_obj, "custom_operations"):
                default_custom = existing_tag_obj.custom_operations or ""
            
            custom_operations = st.text_area(
                "Lambda Function*",
                value=default_custom,
                key="vtag_custom_ops",
                help=f"Lambda function with {len(selected_tag_ids)} argument(s). Example: lambda x, y: x + y"
            )
            
            if custom_operations:
                st.caption(f"Ensure your lambda has {len(selected_tag_ids)} argument(s)")
            
            unary_operations = None
            binary_operations = None
        
        # Submit button
        submit_label = "Update Virtual Tag" if existing_tag_obj else "Add Virtual Tag"
        if st.form_submit_button(submit_label):
            if not tag_id or not parent_id:
                st.error("Tag ID and Parent are required!")
                return
            
            if not selected_tag_ids:
                st.error("At least one constituent tag is required!")
                return
            
            if operation_mode == "Custom" and not custom_operations:
                st.error("Lambda function is required in Custom mode!")
                return
            
            try:
                # Get tag objects from IDs
                constituent_tags = [all_available_tags[tid] for tid in selected_tag_ids]
                
                # Convert enums
                tag_type_enum = tag.TagType[tag_type_str]
                contents_enum = utils.ContentsType[contents_str]
                units = parse_unit_input(unit_val, unit_str) if unit_str else None
                
                # Convert mode
                from pype_schema.tag import OperationMode
                mode_enum = OperationMode.Algebraic if operation_mode == "Algebraic" else OperationMode.Custom
                
                # Create virtual tag
                new_vtag = tag.VirtualTag(
                    tag_id,
                    tags=constituent_tags,
                    unary_operations=unary_operations,
                    binary_operations=binary_operations,
                    custom_operations=custom_operations,
                    mode=mode_enum,
                    tag_type=tag_type_enum,
                    parent_id=parent_id,
                    contents=contents_enum,
                    units=units,
                    totalized=totalized
                )
                
                # Add to parent
                if parent_type == "Node":
                    all_nodes = {node.id: node for node in session_state.network.get_all_nodes(recurse=True)}
                    parent_obj = all_nodes.get(parent_id)
                else:
                    all_conns = {conn.id: conn for conn in session_state.network.get_all_connections(recurse=True)}
                    parent_obj = all_conns.get(parent_id)
                
                if parent_obj:
                    if not hasattr(parent_obj, "tags"):
                        parent_obj.tags = {}
                    parent_obj.tags[tag_id] = new_vtag
                    
                    if existing_tag_obj:
                        st.success(f"Updated virtual tag: {tag_id}")
                        st.session_state.selected_tag = None
                    else:
                        st.success(f"Added virtual tag: {tag_id}")
                    st.rerun()
                else:
                    st.error("Parent object not found!")
                    
            except Exception as e:
                st.error(f"Error creating virtual tag: {str(e)}")
                import traceback
                st.error(traceback.format_exc())
"""Nodes tab for PyPES UI"""
# external dependencies
import streamlit as st

# pypes imports
from pype_schema.units import u
from pype_schema import utils, node

# local imports
from utils import get_node_types, parse_unit_input, get_contents_enum


def render_nodes_tab(session_state):
    """Main function to render the nodes tab"""
    st.header("Node Management")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        render_node_list(session_state)
    
    with col2:
        render_node_form(session_state)

def render_node_list(session_state):
    """Render list of existing nodes"""
    st.subheader("Existing Nodes")
    
    if session_state.network.nodes:
        search = st.text_input("🔍 Search nodes", "")
        
        filtered_nodes = {
            k: v for k, v in session_state.network.nodes.items()
            if search.lower() in k.lower() or search.lower() in type(v).__name__.lower()
        }
        
        for node_id, node_obj in filtered_nodes.items():
            node_type = type(node_obj).__name__
            
            with st.expander(f"**{node_id}** ({node_type})"):
                st.write(f"**Type:** {node_type}")
                
                # Display common attributes
                if hasattr(node_obj, 'input_contents'):
                    st.write(f"**Input:** {[c.name for c in node_obj.input_contents]}")
                if hasattr(node_obj, 'output_contents'):
                    st.write(f"**Output:** {[c.name for c in node_obj.output_contents]}")
                if hasattr(node_obj, 'elevation') and node_obj.elevation:
                    st.write(f"**Elevation:** {node_obj.elevation}")
                if hasattr(node_obj, 'volume') and node_obj.volume:
                    st.write(f"**Volume:** {node_obj.volume}")
                if hasattr(node_obj, 'num_units'):
                    st.write(f"**Units:** {node_obj.num_units}")
                if hasattr(node_obj, 'min_flow') and node_obj.min_flow:
                    st.write(f"**Min Flow:** {node_obj.min_flow}")
                if hasattr(node_obj, 'max_flow') and node_obj.max_flow:
                    st.write(f"**Max Flow:** {node_obj.max_flow}")
                if hasattr(node_obj, 'design_flow') and node_obj.design_flow:
                    st.write(f"**Design Flow:** {node_obj.design_flow}")
                
                # Pump-specific
                if hasattr(node_obj, 'pump_type') and node_obj.pump_type:
                    st.write(f"**Pump Type:** {node_obj.pump_type.name}")
                if hasattr(node_obj, 'power_rating') and node_obj.power_rating:
                    st.write(f"**Power Rating:** {node_obj.power_rating}")
                
                # Digester-specific
                if hasattr(node_obj, 'digester_type') and node_obj.digester_type:
                    st.write(f"**Digester Type:** {node_obj.digester_type.name}")
                
                # Generator/Cogeneration-specific
                if hasattr(node_obj, 'min_gen_capacity') and node_obj.min_gen_capacity:
                    st.write(f"**Min Gen Capacity:** {node_obj.min_gen_capacity}")
                if hasattr(node_obj, 'max_gen_capacity') and node_obj.max_gen_capacity:
                    st.write(f"**Max Gen Capacity:** {node_obj.max_gen_capacity}")
                if hasattr(node_obj, 'design_gen_capacity') and node_obj.design_gen_capacity:
                    st.write(f"**Design Gen Capacity:** {node_obj.design_gen_capacity}")
                if hasattr(node_obj, 'thermal_efficiency') and node_obj.thermal_efficiency:
                    st.write(f"**Thermal Efficiency:** {node_obj.thermal_efficiency}")
                if hasattr(node_obj, 'electrical_efficiency') and node_obj.electrical_efficiency:
                    st.write(f"**Electrical Efficiency:** {node_obj.electrical_efficiency}")
                
                # UV System-specific
                if hasattr(node_obj, 'intensity') and node_obj.intensity:
                    st.write(f"**Intensity:** {node_obj.intensity}")
                if hasattr(node_obj, 'area') and node_obj.area:
                    st.write(f"**Area:** {node_obj.area}")
                
                # Clarification/Thickening/RO-specific
                if hasattr(node_obj, 'settling_time') and node_obj.settling_time:
                    st.write(f"**Settling Time:** {node_obj.settling_time}")
                if hasattr(node_obj, 'selectivity') and node_obj.selectivity:
                    st.write(f"**Selectivity:** {node_obj.selectivity}")
                if hasattr(node_obj, 'permeability') and node_obj.permeability:
                    st.write(f"**Permeability:** {node_obj.permeability}")
                
                # Disinfection/Chlorination-specific
                if hasattr(node_obj, 'residence_time') and node_obj.residence_time:
                    st.write(f"**Residence Time:** {node_obj.residence_time}")
                if hasattr(node_obj, 'dosing_rate') and node_obj.dosing_rate:
                    st.write(f"**Dosing Rate:** {node_obj.dosing_rate}")
                
                # Reactor-specific
                if hasattr(node_obj, 'pH') and node_obj.pH:
                    st.write(f"**pH:** {node_obj.pH}")
                
                # Battery-specific
                if hasattr(node_obj, 'energy_capacity') and node_obj.energy_capacity:
                    st.write(f"**Energy Capacity:** {node_obj.energy_capacity}")
                if hasattr(node_obj, 'rte') and node_obj.rte:
                    st.write(f"**Round Trip Efficiency:** {node_obj.rte}")
                if hasattr(node_obj, 'leakage') and node_obj.leakage:
                    st.write(f"**Leakage:** {node_obj.leakage}")
                if hasattr(node_obj, 'charge_rate') and node_obj.charge_rate:
                    st.write(f"**Charge Rate:** {node_obj.charge_rate}")
                if hasattr(node_obj, 'discharge_rate') and node_obj.discharge_rate:
                    st.write(f"**Discharge Rate:** {node_obj.discharge_rate}")
                
                # Valve/PRV-specific
                if hasattr(node_obj, 'diameter') and node_obj.diameter:
                    st.write(f"**Diameter:** {node_obj.diameter}")
                if hasattr(node_obj, 'pressure_setting') and node_obj.pressure_setting:
                    st.write(f"**Pressure Setting:** {node_obj.pressure_setting}")
                
                btn_col1, btn_col2 = st.columns(2)
                with btn_col1:
                    if st.button(f"Edit", key=f"edit_{node_id}"):
                        session_state.selected_node = node_id
                        st.rerun()
                with btn_col2:
                    if st.button(f"Delete", key=f"del_{node_id}"):
                        del session_state.network.nodes[node_id]
                        st.success(f"Deleted: {node_id}")
                        st.rerun()
    else:
        st.info("No nodes yet. Add one to get started!")

def render_node_form(session_state):
    """Render form for adding/editing nodes"""
    if session_state.selected_node:
        st.subheader(f"Edit: {session_state.selected_node}")
        if st.button("Cancel"):
            session_state.selected_node = None
            st.rerun()
    else:
        st.subheader("Add New Node")
    
    with st.form("node_form"):
        existing_node = None
        if session_state.selected_node:
            existing_node = session_state.network.nodes[session_state.selected_node]
        
        # Node ID and Type
        node_types = get_node_types
        
        if existing_node:
            node_id = st.text_input("Node ID*", value=session_state.selected_node, disabled=True)
            node_type = st.selectbox("Type*", node_types, 
                                   index=node_types.index(type(existing_node).__name__) if type(existing_node).__name__ in node_types else 0)
        else:
            node_id = st.text_input("Node ID*", "")
            node_type = st.selectbox("Type*", node_types)
        
        # Contents
        st.write("**Contents**")
        contents_options = get_contents_enum()
        
        default_input = []
        default_output = []
        if existing_node:
            if hasattr(existing_node, 'input_contents'):
                default_input = [c.name for c in existing_node.input_contents]
            if hasattr(existing_node, 'output_contents'):
                default_output = [c.name for c in existing_node.output_contents]
        
        input_contents = st.multiselect("Input Contents", contents_options, default=default_input)
        output_contents = st.multiselect("Output Contents", contents_options, default=default_output)
        
        # Initialize variables
        min_flow = max_flow = design_flow = None
        volume = elevation = None
        num_units = 1
        power_rating = None
        pump_type = utils.PumpType.Constant
        digester_type = None
        min_gen_capacity = max_gen_capacity = design_gen_capacity = None
        thermal_efficiency = electrical_efficiency = None
        intensity = area = None
        settling_time = None
        selectivity = permeability = None
        residence_time = dosing_rate = None
        pH = None
        energy_capacity = rte = leakage = None
        charge_rate = discharge_rate = None
        diameter = pressure_setting = None
        
        # Type-specific parameters
        if node_type == "Pump":
            st.write("**Flow Parameters**")
            fcol1, fcol2 = st.columns(2)
            with fcol1:
                min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and existing_node.min_flow else "")
                max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and existing_node.max_flow else "")
                design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and existing_node.design_flow else "")
                power_val = st.text_input("Power Rating (W)", value=str(existing_node.power_rating.magnitude) if existing_node and existing_node.power_rating else "")
            with fcol2:
                flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
            
            min_flow = parse_unit_input(min_flow_val, flow_unit)
            max_flow = parse_unit_input(max_flow_val, flow_unit)
            design_flow = parse_unit_input(design_flow_val, flow_unit)
            power_rating = parse_unit_input(power_val, "W")
            
            st.write("**Elevation**")
            ecol1, ecol2 = st.columns(2)
            with ecol1:
                elevation_val = st.text_input("Elevation", value=str(existing_node.elevation.magnitude) if existing_node and existing_node.elevation else "")
            with ecol2:
                elevation_unit = st.selectbox("Elevation Unit", ["m", "ft"])
            elevation = parse_unit_input(elevation_val, elevation_unit)
            
            num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node else 1)
            pump_type_str = st.selectbox("Pump Type", ["Constant", "VFD", "ERD"],
                                        index=["Constant", "VFD", "ERD"].index(existing_node.pump_type.name) if existing_node and existing_node.pump_type else 0)
            pump_type = utils.PumpType[pump_type_str]
        
        elif node_type in ["Tank", "Reservoir"]:
            st.write("**Volume**")
            vcol1, vcol2 = st.columns(2)
            with vcol1:
                volume_val = st.text_input("Volume", value=str(existing_node.volume.magnitude) if existing_node and existing_node.volume else "")
            with vcol2:
                volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
            volume = parse_unit_input(volume_val, volume_unit)
            
            st.write("**Elevation**")
            ecol1, ecol2 = st.columns(2)
            with ecol1:
                elevation_val = st.text_input("Elevation", value=str(existing_node.elevation.magnitude) if existing_node and existing_node.elevation else "")
            with ecol2:
                elevation_unit = st.selectbox("Elevation Unit", ["m", "ft"])
            elevation = parse_unit_input(elevation_val, elevation_unit)
            
            if node_type == "Tank":
                num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node else 1)
        
        elif node_type in ["Cogeneration", "Boiler"]:
            st.write("**Generation Capacity**")
            gcol1, gcol2 = st.columns(2)
            with gcol1:
                min_gen_val = st.text_input("Min Capacity", value=str(existing_node.min_gen_capacity.magnitude) if existing_node and existing_node.min_gen_capacity else "")
                max_gen_val = st.text_input("Max Capacity", value=str(existing_node.max_gen_capacity.magnitude) if existing_node and existing_node.max_gen_capacity else "")
                design_gen_val = st.text_input("Design Capacity", value=str(existing_node.design_gen_capacity.magnitude) if existing_node and existing_node.design_gen_capacity else "")
            with gcol2:
                gen_unit = st.selectbox("Capacity Unit", ["kW", "MW", "W"])
            
            min_gen_capacity = parse_unit_input(min_gen_val, gen_unit)
            max_gen_capacity = parse_unit_input(max_gen_val, gen_unit)
            design_gen_capacity = parse_unit_input(design_gen_val, gen_unit)
            
            st.write("**Efficiency**")
            thermal_efficiency = st.number_input("Thermal Efficiency (0-1)", min_value=0.0, max_value=1.0, 
                                                value=float(existing_node.thermal_efficiency) if existing_node and existing_node.thermal_efficiency else 0.0, step=0.01)
            electrical_efficiency = st.number_input("Electrical Efficiency (0-1)", min_value=0.0, max_value=1.0,
                                                   value=float(existing_node.electrical_efficiency) if existing_node and existing_node.electrical_efficiency else 0.0, step=0.01)
            
            num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node else 1)
        
        elif node_type == "Digestion":
            st.write("**Flow Parameters**")
            fcol1, fcol2 = st.columns(2)
            with fcol1:
                min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and existing_node.min_flow else "")
                max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and existing_node.max_flow else "")
                design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and existing_node.design_flow else "")
            with fcol2:
                flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
            
            min_flow = parse_unit_input(min_flow_val, flow_unit)
            max_flow = parse_unit_input(max_flow_val, flow_unit)
            design_flow = parse_unit_input(design_flow_val, flow_unit)
            
            st.write("**Volume**")
            vcol1, vcol2 = st.columns(2)
            with vcol1:
                volume_val = st.text_input("Volume", value=str(existing_node.volume.magnitude) if existing_node and existing_node.volume else "")
            with vcol2:
                volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
            volume = parse_unit_input(volume_val, volume_unit)
            
            num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node else 1)
            
            digester_type_str = st.selectbox("Digester Type", ["Mesophilic", "Thermophilic"],
                                            index=["Mesophilic", "Thermophilic"].index(existing_node.digester_type.name) if existing_node and existing_node.digester_type else 0)
            digester_type = utils.DigesterType[digester_type_str]
        
        elif node_type in ["Disinfection", "Chlorination", "UVSystem"]:
            st.write("**Flow Parameters**")
            fcol1, fcol2 = st.columns(2)
            with fcol1:
                min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and existing_node.min_flow else "")
                max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and existing_node.max_flow else "")
                design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and existing_node.design_flow else "")
            with fcol2:
                flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
            
            min_flow = parse_unit_input(min_flow_val, flow_unit)
            max_flow = parse_unit_input(max_flow_val, flow_unit)
            design_flow = parse_unit_input(design_flow_val, flow_unit)
            
            st.write("**Volume**")
            vcol1, vcol2 = st.columns(2)
            with vcol1:
                volume_val = st.text_input("Volume", value=str(existing_node.volume.magnitude) if existing_node and existing_node.volume else "")
            with vcol2:
                volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
            volume = parse_unit_input(volume_val, volume_unit)
            
            num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node else 1)
            
            if node_type == "UVSystem":
                st.write("**UV-Specific Parameters**")
                ucol1, ucol2 = st.columns(2)
                with ucol1:
                    intensity_val = st.text_input("Intensity", value=str(existing_node.intensity.magnitude) if existing_node and existing_node.intensity else "")
                    area_val = st.text_input("Area", value=str(existing_node.area.magnitude) if existing_node and existing_node.area else "")
                with ucol2:
                    intensity_unit = st.selectbox("Intensity Unit", ["mW/cm**2", "W/m**2"])
                    area_unit = st.selectbox("Area Unit", ["m**2", "ft**2"])
                
                intensity = parse_unit_input(intensity_val, intensity_unit)
                area = parse_unit_input(area_val, area_unit)
            else:
                # For Disinfection and Chlorination
                st.write("**Dosing & Residence Time**")
                rcol1, rcol2 = st.columns(2)
                with rcol1:
                    residence_time_val = st.text_input("Residence Time", value=str(existing_node.residence_time.magnitude) if existing_node and existing_node.residence_time else "")
                with rcol2:
                    residence_unit = st.selectbox("Residence Time Unit", ["minute", "hour", "day"])
                
                residence_time = parse_unit_input(residence_time_val, residence_unit)
                
                # Dosing rate - this is a dictionary in the schema
                st.write("**Dosing Rate** (optional)")
                st.caption("Note: Dosing rate is a dictionary mapping contents to rates")
elif node_type in ["Filtration", "ROMembrane"]:
            st.write("**Flow Parameters**")
            fcol1, fcol2 = st.columns(2)
            with fcol1:
                min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and existing_node.min_flow else "")
                max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and existing_node.max_flow else "")
                design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and existing_node.design_flow else "")
            with fcol2:
                flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
            
            min_flow = parse_unit_input(min_flow_val, flow_unit)
            max_flow = parse_unit_input(max_flow_val, flow_unit)
            design_flow = parse_unit_input(design_flow_val, flow_unit)
            
            st.write("**Volume**")
            vcol1, vcol2 = st.columns(2)
            with vcol1:
                volume_val = st.text_input("Volume", value=str(existing_node.volume.magnitude) if existing_node and existing_node.volume else "")
            with vcol2:
                volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
            volume = parse_unit_input(volume_val, volume_unit)
            
            num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node else 1)
            
            if node_type == "ROMembrane":
                st.write("**Membrane-Specific Parameters**")
                selectivity = st.number_input("Selectivity (0-1)", min_value=0.0, max_value=1.0,
                                             value=float(existing_node.selectivity) if existing_node and existing_node.selectivity else 0.0, step=0.01)
                
                pcol1, pcol2 = st.columns(2)
                with pcol1:
                    permeability_val = st.text_input("Permeability", value=str(existing_node.permeability.magnitude) if existing_node and existing_node.permeability else "")
                with pcol2:
                    permeability_unit = st.selectbox("Permeability Unit", ["L/m**2/hour/bar", "gal/ft**2/day/psi"])
                
                permeability = parse_unit_input(permeability_val, permeability_unit)
        
        elif node_type in ["Reactor", "StaticMixer"]:
            st.write("**Flow Parameters**")
            fcol1, fcol2 = st.columns(2)
            with fcol1:
                min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and existing_node.min_flow else "")
                max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and existing_node.max_flow else "")
                design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and existing_node.design_flow else "")
            with fcol2:
                flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
            
            min_flow = parse_unit_input(min_flow_val, flow_unit)
            max_flow = parse_unit_input(max_flow_val, flow_unit)
            design_flow = parse_unit_input(design_flow_val, flow_unit)
            
            st.write("**Volume**")
            vcol1, vcol2 = st.columns(2)
            with vcol1:
                volume_val = st.text_input("Volume", value=str(existing_node.volume.magnitude) if existing_node and existing_node.volume else "")
            with vcol2:
                volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
            volume = parse_unit_input(volume_val, volume_unit)
            
            num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node else 1)
            
            if node_type == "Reactor":
                pH = st.number_input("pH", min_value=0.0, max_value=14.0,
                                    value=float(existing_node.pH) if existing_node and existing_node.pH else 7.0, step=0.1)
        
        elif node_type in ["Thickening", "Aeration", "Clarification"]:
            st.write("**Flow Parameters**")
            fcol1, fcol2 = st.columns(2)
            with fcol1:
                min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and existing_node.min_flow else "")
                max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and existing_node.max_flow else "")
                design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and existing_node.design_flow else "")
            with fcol2:
                flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
            
            min_flow = parse_unit_input(min_flow_val, flow_unit)
            max_flow = parse_unit_input(max_flow_val, flow_unit)
            design_flow = parse_unit_input(design_flow_val, flow_unit)
            
            st.write("**Volume**")
            vcol1, vcol2 = st.columns(2)
            with vcol1:
                volume_val = st.text_input("Volume", value=str(existing_node.volume.magnitude) if existing_node and existing_node.volume else "")
            with vcol2:
                volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
            volume = parse_unit_input(volume_val, volume_unit)
            
            num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node else 1)
            
            if node_type in ["Thickening", "Clarification"]:
                st.write("**Settling Time**")
                scol1, scol2 = st.columns(2)
                with scol1:
                    settling_time_val = st.text_input("Settling Time", value=str(existing_node.settling_time.magnitude) if existing_node and existing_node.settling_time else "")
                with scol2:
                    settling_unit = st.selectbox("Settling Time Unit", ["minute", "hour", "day"])
                
                settling_time = parse_unit_input(settling_time_val, settling_unit)
        
        elif node_type in ["Screening", "Conditioning", "Flaring"]:
            st.write("**Flow Parameters**")
            fcol1, fcol2 = st.columns(2)
            with fcol1:
                min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and existing_node.min_flow else "")
                max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and existing_node.max_flow else "")
                design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and existing_node.design_flow else "")
            with fcol2:
                flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
            
            min_flow = parse_unit_input(min_flow_val, flow_unit)
            max_flow = parse_unit_input(max_flow_val, flow_unit)
            design_flow = parse_unit_input(design_flow_val, flow_unit)
            
            st.write("**Volume**")
            vcol1, vcol2 = st.columns(2)
            with vcol1:
                volume_val = st.text_input("Volume", value=str(existing_node.volume.magnitude) if existing_node and existing_node.volume else "")
            with vcol2:
                volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
            volume = parse_unit_input(volume_val, volume_unit)
            
            num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node else 1)
        
        elif node_type == "Separator":
            st.write("**Flow Parameters**")
            fcol1, fcol2 = st.columns(2)
            with fcol1:
                min_flow_val = st.text_input("Min Flow", value=str(existing_node.min_flow.magnitude) if existing_node and existing_node.min_flow else "")
                max_flow_val = st.text_input("Max Flow", value=str(existing_node.max_flow.magnitude) if existing_node and existing_node.max_flow else "")
                design_flow_val = st.text_input("Design Flow", value=str(existing_node.design_flow.magnitude) if existing_node and existing_node.design_flow else "")
            with fcol2:
                flow_unit = st.selectbox("Flow Unit", ["m**3/day", "MGD", "GPM", "L/s"])
            
            min_flow = parse_unit_input(min_flow_val, flow_unit)
            max_flow = parse_unit_input(max_flow_val, flow_unit)
            design_flow = parse_unit_input(design_flow_val, flow_unit)
            
            st.write("**Volume**")
            vcol1, vcol2 = st.columns(2)
            with vcol1:
                volume_val = st.text_input("Volume", value=str(existing_node.volume.magnitude) if existing_node and existing_node.volume else "")
            with vcol2:
                volume_unit = st.selectbox("Volume Unit", ["m**3", "gallon", "L"])
            volume = parse_unit_input(volume_val, volume_unit)
            
            num_units = st.number_input("Number of Units", min_value=1, value=existing_node.num_units if existing_node else 1)
        
        elif node_type == "Battery":
            st.write("**Energy Storage Parameters**")
            ecol1, ecol2 = st.columns(2)
            with ecol1:
                energy_capacity_val = st.text_input("Energy Capacity", value=str(existing_node.energy_capacity.magnitude) if existing_node and existing_node.energy_capacity else "")
                charge_rate_val = st.text_input("Charge Rate", value=str(existing_node.charge_rate.magnitude) if existing_node and existing_node.charge_rate else "")
                discharge_rate_val = st.text_input("Discharge Rate", value=str(existing_node.discharge_rate.magnitude) if existing_node and existing_node.discharge_rate else "")
            with ecol2:
                energy_unit = st.selectbox("Energy Unit", ["kWh", "MWh", "Wh"])
                rate_unit = st.selectbox("Rate Unit", ["kW", "MW", "W"])
            
            energy_capacity = parse_unit_input(energy_capacity_val, energy_unit)
            charge_rate = parse_unit_input(charge_rate_val, rate_unit)
            discharge_rate = parse_unit_input(discharge_rate_val, rate_unit)
            
            st.write("**Efficiency & Leakage**")
            rte = st.number_input("Round Trip Efficiency (0-1)", min_value=0.0, max_value=1.0,
                                 value=float(existing_node.rte) if existing_node and existing_node.rte else 0.9, step=0.01)
            leakage = st.number_input("Leakage Rate (0-1)", min_value=0.0, max_value=1.0,
                                     value=float(existing_node.leakage) if existing_node and existing_node.leakage else 0.0, step=0.01)
        
        elif node_type in ["Network", "Facility"]:
            st.info("Networks and Facilities are containers for other nodes. Configure them separately.")
            
            if node_type == "Facility":
                st.write("**Elevation**")
                ecol1, ecol2 = st.columns(2)
                with ecol1:
                    elevation_val = st.text_input("Elevation", value=str(existing_node.elevation.magnitude) if existing_node and existing_node.elevation else "")
                with ecol2:
                    elevation_unit = st.selectbox("Elevation Unit", ["m", "ft"])
                elevation = parse_unit_input(elevation_val, elevation_unit)
        
        elif node_type in ["Valve", "Junction", "PRV"]:
            st.write("**Diameter**")
            dcol1, dcol2 = st.columns(2)
            with dcol1:
                diameter_val = st.text_input("Diameter", value=str(existing_node.diameter.magnitude) if existing_node and existing_node.diameter else "")
            with dcol2:
                diameter_unit = st.selectbox("Diameter Unit", ["mm", "inch", "m"])
            
            diameter = parse_unit_input(diameter_val, diameter_unit)
            
            if node_type == "PRV":
                st.write("**Pressure Setting**")
                pcol1, pcol2 = st.columns(2)
                with pcol1:
                    pressure_val = st.text_input("Pressure Setting", value=str(existing_node.pressure_setting.magnitude) if existing_node and existing_node.pressure_setting else "")
                with pcol2:
                    pressure_unit = st.selectbox("Pressure Unit", ["bar", "psi", "Pa"])
                
                pressure_setting = parse_unit_input(pressure_val, pressure_unit)
        
        # Submit button
        submit_label = "Save Node" if existing_node else "Add Node"
        if st.form_submit_button(submit_label):
            if not node_id:
                st.error("Node ID is required!")
                return
            
            if not input_contents or not output_contents:
                st.error("Both input and output contents are required!")
                return
            
            try:
                # Convert contents to enum
                input_enum = [utils.ContentsType[c] for c in input_contents]
                output_enum = [utils.ContentsType[c] for c in output_contents]
                
                # Create appropriate node type
                new_node = None
                
                if node_type == "Junction":
                    new_node = node.Junction(node_id, input_enum, output_enum, diameter=diameter)
                
                elif node_type == "Tank":
                    new_node = node.Tank(
                        node_id, input_enum, output_enum,
                        elevation=elevation,
                        volume=volume,
                        num_units=num_units
                    )

                elif node_type == "Reservoir":
                    new_node = node.Reservoir(
                        node_id, input_enum, output_enum,
                        elevation=elevation,
                        volume=volume
                    )
                
                elif node_type == "Pump":
                    new_node = node.Pump(
                        node_id, input_enum, output_enum,
                        elevation=elevation,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        power_rating=power_rating,
                        num_units=num_units,
                        pump_type=pump_type
                    )
                
                elif node_type == "Cogeneration":
                    new_node = node.Cogeneration(
                        node_id, input_enum, output_enum,
                        min_gen_capacity=min_gen_capacity,
                        max_gen_capacity=max_gen_capacity,
                        design_gen_capacity=design_gen_capacity,
                        thermal_efficiency=thermal_efficiency,
                        electrical_efficiency=electrical_efficiency,
                        num_units=num_units
                    )
                
                elif node_type == "Boiler":
                    new_node = node.Boiler(
                        node_id, input_enum, output_enum,
                        min_gen_capacity=min_gen_capacity,
                        max_gen_capacity=max_gen_capacity,
                        design_gen_capacity=design_gen_capacity,
                        thermal_efficiency=thermal_efficiency,
                        num_units=num_units
                    )
                
                elif node_type == "Digestion":
                    new_node = node.Digestion(
                        node_id, input_enum, output_enum,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        volume=volume,
                        num_units=num_units,
                        digester_type=digester_type
                    )
                
                elif node_type == "Disinfection":
                    new_node = node.Disinfection(
                        node_id, input_enum, output_enum,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        volume=volume,
                        num_units=num_units,
                        residence_time=residence_time,
                        dosing_rate=dosing_rate
                    )
                
                elif node_type == "Chlorination":
                    new_node = node.Chlorination(
                        node_id, input_enum, output_enum,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        volume=volume,
                        num_units=num_units,
                        residence_time=residence_time,
                        dosing_rate=dosing_rate
                    )
                
                elif node_type == "UVSystem":
                    new_node = node.UVSystem(
                        node_id, input_enum, output_enum,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        volume=volume,
                        num_units=num_units,
                        intensity=intensity,
                        area=area
                    )
                
                elif node_type == "Filtration":
                    new_node = node.Filtration(
                        node_id, input_enum, output_enum,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        volume=volume,
                        num_units=num_units
                    )
                
                elif node_type == "ROMembrane":
                    new_node = node.ROMembrane(
                        node_id, input_enum, output_enum,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        volume=volume,
                        num_units=num_units,
                        selectivity=selectivity,
                        permeability=permeability
                    )
                
                elif node_type == "Reactor":
                    new_node = node.Reactor(
                        node_id, input_enum, output_enum,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        volume=volume,
                        num_units=num_units,
                        pH=pH
                    )
                
                elif node_type == "StaticMixer":
                    new_node = node.StaticMixer(
                        node_id, input_enum, output_enum,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        volume=volume,
                        num_units=num_units
                    )
                elif node_type == "Thickening":
                    new_node = node.Thickening(
                        node_id, input_enum, output_enum,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        volume=volume,
                        num_units=num_units,
                        settling_time=settling_time
                    )
                elif node_type == "Aeration":
                    new_node = node.Aeration(
                        node_id, input_enum, output_enum,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        volume=volume,
                        num_units=num_units
                    )
                elif node_type == "Clarification":
                    new_node = node.Clarification(
                        node_id, input_enum, output_enum,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        volume=volume,
                        num_units=num_units,
                        settling_time=settling_time
                    )
                
                elif node_type == "Screening":
                    new_node = node.Screening(
                        node_id, input_enum, output_enum,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        volume=volume,
                        num_units=num_units
                    )
                
                elif node_type == "Conditioning":
                    new_node = node.Conditioning(
                        node_id, input_enum, output_enum,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        volume=volume,
                        num_units=num_units
                    )
                
                elif node_type == "Flaring":
                    new_node = node.Flaring(
                        node_id, input_enum, output_enum,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        volume=volume,
                        num_units=num_units
                    )
                
                elif node_type == "Separator":
                    new_node = node.Separator(
                        node_id, input_enum, output_enum,
                        min_flow=min_flow,
                        max_flow=max_flow,
                        design_flow=design_flow,
                        volume=volume,
                        num_units=num_units
                    )
                
                elif node_type == "Battery":
                    new_node = node.Battery(
                        node_id, input_enum, output_enum,
                        energy_capacity=energy_capacity,
                        rte=rte,
                        leakage=leakage,
                        charge_rate=charge_rate,
                        discharge_rate=discharge_rate
                    )
                
                elif node_type == "Network":
                    new_node = node.Network(node_id, input_enum, output_enum)
                
                elif node_type == "Facility":
                    new_node = node.Facility(
                        node_id, input_enum, output_enum,
                        elevation=elevation
                    )
                
                elif node_type == "Valve":
                    new_node = node.Valve(node_id, input_enum, output_enum, diameter=diameter)
                
                elif node_type == "PRV":
                    new_node = node.PRV(
                        node_id, input_enum, output_enum,
                        diameter=diameter,
                        pressure_setting=pressure_setting
                    )
                
                if new_node:
                    session_state.network.nodes[node_id] = new_node
                    if existing_node:
                        st.success(f"Updated node: {node_id}")
                    else:
                        st.success(f"Added node: {node_id}")
                    session_state.selected_node = None
                    st.rerun()
                else:
                    st.error(f"Failed to create node of type: {node_type}")
                    
            except Exception as e:
                st.error(f"Error creating node: {str(e)}")

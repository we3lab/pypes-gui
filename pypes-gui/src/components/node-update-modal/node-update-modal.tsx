import { Box, MenuItem, Modal } from "@mui/material";
import {
  TankParams,
  StaticMixingParams,
  FiltrationParams,
  ROMembraneParams,
  UVSystemParams,
  AerationParams,
  ReservoirParams,
  BatteryParams,
  FacilityParams,
  ChlorinationParams,
  NetworkParams,
  ModularUnitParams,
  JunctionParams,
  PumpParams,
  DigestionParams,
  CogenerationParams,
  BoilerParams,
  ClarificationParams,
  ValveParams,
  PRVParams,
  ScreeningParams,
  ConditioningParams,
  ThickeningParams,
  FlaringParams,
  SeparationParams,
} from "../../interfaces";
import { useCallback, useEffect, useState } from "react";
import useMainStore from "@/store/store";
import SectionTitle from "../global/section-title";
import {
  modal_box_css,
  modal_left_subsection_wrapper_css,
  modal_section_horizontal_css,
  modal_main_section_wrapper_css,
  modal_right_subsection_wrapper_css,
  modal_textfield_css,
  modal_section_vertical_css,
  modal_top_subsection_wrapper_css,
} from "../global/flows-style";
import FlowsTextField from "../global/flows-text-field";
import FlowsButtonLight from "../global/flows-button-light";
import FlowsButtonDark from "../global/flows-button-dark";
import { FaTimes } from "react-icons/fa";
import FlowsSelect from "../global/flows-select";

interface NodeUpdateModalProps {
  open: boolean;
  onClose: () => void;
}

const NodeUpdateModal: React.FC<NodeUpdateModalProps> = ({ open, onClose }) => {
  const { nodeType, onUpdate, selectedNodeId, nodes } = useMainStore();

  const [currentNode, setCurrentNode] = useState<any>({});

  const handleNumericInput = (val: string) => {
    if (val === "") return null;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed;
  };

  const valuedUnit = useCallback((
    input: any,
    fallbackUnits: string,
    legacyValue?: any
  ) => {
    if (input && typeof input === "object" && "value" in input) {
      return {
        value: input.value ?? null,
        units: input.units ?? fallbackUnits,
      };
    }

    return {
      value: input ?? legacyValue ?? null,
      units: fallbackUnits,
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Strictly get data from the store (memory)
      const allNodes = Object.values(nodes).flat();
      const storeNode = allNodes.find((n) => n.id === selectedNodeId);

      if (storeNode && storeNode.data && storeNode.data.additionalData) {
        setCurrentNode({
          ...storeNode.data.additionalData,
          type: storeNode.node.type,
          id: storeNode.id,
        });
      } else if (storeNode) {
        // Handle case where additionalData might be missing but node exists
        setCurrentNode({
          type: storeNode.node.type,
          id: storeNode.id,
        });
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, selectedNodeId, nodes]);

  const [tankParams, setTankParams] = useState<TankParams>({
    name: "",
    elevation: { value: null, units: "meters" },
    volume: { value: null, units: "cubic meters" },
    num_units: null,
  });

  const [staticMixingParams, setStaticMixingParams] =
    useState<StaticMixingParams>({
      name: "",
      volume: { value: null, units: "cubic meters" },
      flowrate: {
        design: null,
        max: null,
        min: null,
        units: "MGD",
      },
      dosing_rate: {},
      residence_time: { value: null, units: "hours" },
      pH: null,
      num_units: null,
    });

  const [reservoirParams, setReservoirParams] = useState<ReservoirParams>({
    name: "",
    elevation: { value: null, units: "meters" },
    volume: { value: null, units: "cubic meters" },
  });

  const [aerationParams, setAerationParams] = useState<AerationParams>({
    name: "",
    flowrate: {
      design: null,
      max: null,
      min: null,
      units: "MGD",
    },
    num_units: null,
    volume: { value: null, units: "cubic meters" },
  });

  const [filtrationParams, setFiltrationParams] = useState<FiltrationParams>({
    name: "",
    flowrate: {
      design: null,
      max: null,
      min: null,
      units: "MGD",
    },
    num_units: null,
    volume: { value: null, units: "cubic meters" },
    dosing_rate: {},
    settling_time: { value: null, units: "minutes" },
  });

  const [roMembraneParams, setROMembraneParams] = useState<ROMembraneParams>({
    name: "",
    flowrate: {
      design: null,
      max: null,
      min: null,
      units: "MGD",
    },
    num_units: null,
    volume: { value: null, units: "cubic meters" },
    dosing_rate: {},
    settling_time: { value: null, units: "minutes" },
    area: { value: null, units: "square meters" },
    permeability: { value: null, units: "LMH / bar" },
    selectivity: { value: null, units: "m / s" },
  });

  const [uvSystemParams, setUVSystemParams] = useState<UVSystemParams>({
    name: "",
    flowrate: {
      design: null,
      max: null,
      min: null,
      units: "MGD",
    },
    num_units: null,
    volume: { value: null, units: "cubic meters" },
    dosing_rate: {
      UVLight: {
        chemical: "UVLight",
        value: null,
        units: "W / square meter",
        mode: "rate",
      },
    },
    dosing_area: {
      UVLight: {
        chemical: "UVLight",
        value: null,
        units: "square meters",
        mode: "area",
      },
    },
    residence_time: { value: null, units: "hours" },
  });

  const [batteryParams, setBatteryParams] = useState<BatteryParams>({
    name: "",
    capacity: null,
    capacity_units: "kWh",
    charge_rate: null,
    charge_rate_units: "kW",
    discharge_rate: null,
    discharge_rate_units: "kW",
  });

  const [facilityParams, setFacilityParams] = useState<FacilityParams>({
    name: "",
    elevation: { value: null, units: "meters" },
    flowrate: {
      design: null,
      max: null,
      min: null,
      units: "MGD",
    },
    nodes: [],
    connections: [],
  });

  const [chlorinationParams, setChlorinationParams] =
    useState<ChlorinationParams>({
      name: "",
      flowrate: {
        design: null,
        max: null,
        min: null,
        units: "MGD",
      },
      num_units: null,
      volume: { value: null, units: "cubic meters" },
      dosing_rate: {},
      residence_time: { value: null, units: "hours" },
    });

  const [networkParams, setNetworkParams] = useState<NetworkParams>({
    name: "",
    nodes: [],
    connections: [],
    num_units: null,
  });

  const [modularUnitParams, setModularUnitParams] = useState<ModularUnitParams>({
    name: "",
    nodes: [],
    connections: [],
    num_units: null,
  });

  const [junctionParams, setJunctionParams] = useState<JunctionParams>({
    name: "",
    diameter: { value: null, units: "meters" },
  });

  const [valveParams, setValveParams] = useState<ValveParams>({
    name: "",
    diameter: { value: null, units: "meters" },
  });

  const [prvParams, setPRVParams] = useState<PRVParams>({
    name: "",
    diameter: { value: null, units: "meters" },
    pressure_setting: { value: null, units: "psi" },
  });

  const [pumpParams, setPumpParams] = useState<PumpParams>({
    name: "",
    elevation: { value: null, units: "meters" },
    power_rating: null,
    num_units: null,
    flowrate: {
      design: null,
      max: null,
      min: null,
      units: "MGD",
    },
    pump_type: "VFD",
    efficiency: null,
  });

  const [digestionParams, setDigestionParams] = useState<DigestionParams>({
    name: "",
    flowrate: {
      design: null,
      max: null,
      min: null,
      units: "MGD",
    },
    num_units: null,
    volume: { value: null, units: "cubic meters" },
    digester_type: "Anaerobic",
  });

  const [cogenerationParams, setCogenerationParams] =
    useState<CogenerationParams>({
      name: "",
      generation_capacity: {
        design: null,
        max: null,
        min: null,
        units: "MGD",
      },
      thermal_efficiency: null,
      electrical_efficiency: null,
      num_units: null,
    });

  const [boilerParams, setBoilerParams] =
    useState<BoilerParams>({
      name: "",
      generation_capacity: {
        design: null,
        max: null,
        min: null,
        units: "MGD",
      },
      thermal_efficiency: null,
      num_units: null,
    });

  const [clarificationParams, setClarificationParams] =
    useState<ClarificationParams>({
      name: "",
      flowrate: {
        design: null,
        max: null,
        min: null,
        units: "MGD",
      },
      num_units: null,
      volume: { value: null, units: "cubic meters" },
    });

  const [screeningParams, setScreeningParams] = useState<ScreeningParams>({
    name: "",
    flowrate: {
      design: null,
      max: null,
      min: null,
      units: "MGD",
    },
    num_units: null,
  });

  const [conditioningParams, setConditioningParams] =
    useState<ConditioningParams>({
      name: "",
      flowrate: {
        design: null,
        max: null,
        min: null,
        units: "MGD",
      },
      num_units: null,
    });

  const [thickeningParams, setThickeningParams] = useState<ThickeningParams>({
    name: "",
    flowrate: {
      design: null,
      max: null,
      min: null,
      units: "MGD",
    },
    num_units: null,
    volume: { value: null, units: "cubic meters" },
  });

  const [flaringParams, setFlaringParams] = useState<FlaringParams>({
    name: "",
    flowrate: {
      design: null,
      max: null,
      min: null,
      units: "MGD",
    },
    num_units: null,
  });

  const [separationParams, setSeparationParams] = useState<SeparationParams>({
    name: "",
    elevation: { value: null, units: "meters" },
    power_rating: { value: null, units: "hp" },
    num_units: null,
    flowrate: {
      design: null,
      max: null,
      min: null,
      units: "MGD",
    },
    volume: { value: null, units: "cubic meters" },
  });

  const addDefaultValueFromDB = useCallback((currentNode: any, id: string) => {
    if (!currentNode || !currentNode.type) return;

    switch (currentNode["type"]) {
      case "Tank":
        setTankParams({
          name: id,
          elevation: valuedUnit(currentNode["elevation"], "meters"),
          volume: valuedUnit(
            currentNode["volume"],
            "cubic meters",
            currentNode["volume (cubic meters)"]
          ),
          num_units: currentNode["num_units"] ?? null,
        });
        break;
      case "StaticMixing":
      case "Reactor":
        setStaticMixingParams({
          name: id,
          flowrate: {
            design: currentNode.flowrate?.design ?? null,
            max: currentNode.flowrate?.max ?? null,
            min: currentNode.flowrate?.min ?? null,
            units: currentNode.flowrate?.units ?? "MGD",
          },
          num_units: currentNode["num_units"] ?? null,
          volume: valuedUnit(
            currentNode["volume"],
            "cubic meters",
            currentNode["volume (cubic meters)"]
          ),
          dosing_rate: currentNode["dosing_rate"] ?? {},
          residence_time: valuedUnit(currentNode["residence_time"], "hours"),
          pH: currentNode["pH"] ?? null,
        });
        break;
      case "Reservoir":
        setReservoirParams({
          name: id,
          elevation: valuedUnit(currentNode["elevation"], "meters"),
          volume: valuedUnit(
            currentNode["volume"],
            "cubic meters",
            currentNode["volume (cubic meters)"]
          ),
        });
        break;
      case "Aeration":
        setAerationParams({
          name: id,
          flowrate: {
            design: currentNode.flowrate?.design ?? null,
            max: currentNode.flowrate?.max ?? null,
            min: currentNode.flowrate?.min ?? null,
            units: currentNode.flowrate?.units ?? "MGD",
          },
          num_units: currentNode["num_units"] ?? null,
          volume: valuedUnit(
            currentNode["volume"],
            "cubic meters",
            currentNode["volume (cubic meters)"]
          ),
        });
        break;
      case "Filtration":
        setFiltrationParams({
          name: id,
          flowrate: {
            design: currentNode.flowrate?.design ?? null,
            max: currentNode.flowrate?.max ?? null,
            min: currentNode.flowrate?.min ?? null,
            units: currentNode.flowrate?.units ?? "MGD",
          },
          num_units: currentNode["num_units"] ?? null,
          volume: valuedUnit(
            currentNode["volume"],
            "cubic meters",
            currentNode["volume (cubic meters)"]
          ),
          dosing_rate: currentNode["dosing_rate"] ?? {},
          settling_time: valuedUnit(currentNode["settling_time"], "minutes"),
        });
        break;
      case "ROMembrane":
        setROMembraneParams({
          name: id,
          flowrate: {
            design: currentNode.flowrate?.design ?? null,
            max: currentNode.flowrate?.max ?? null,
            min: currentNode.flowrate?.min ?? null,
            units: currentNode.flowrate?.units ?? "MGD",
          },
          num_units: currentNode["num_units"] ?? null,
          volume: valuedUnit(
            currentNode["volume"],
            "cubic meters",
            currentNode["volume (cubic meters)"]
          ),
          dosing_rate: currentNode["dosing_rate"] ?? {},
          settling_time: valuedUnit(currentNode["settling_time"], "minutes"),
          area: valuedUnit(currentNode["area"], "square meters"),
          permeability: valuedUnit(currentNode["permeability"], "LMH / bar"),
          selectivity: valuedUnit(currentNode["selectivity"], "m / s"),
        });
        break;
      case "UVSystem":
        setUVSystemParams({
          name: id,
          flowrate: {
            design: currentNode.flowrate?.design ?? null,
            max: currentNode.flowrate?.max ?? null,
            min: currentNode.flowrate?.min ?? null,
            units: currentNode.flowrate?.units ?? "MGD",
          },
          num_units: currentNode["num_units"] ?? null,
          volume: valuedUnit(
            currentNode["volume"],
            "cubic meters",
            currentNode["volume (cubic meters)"]
          ),
          residence_time: valuedUnit(currentNode["residence_time"], "hours"),
          dosing_rate: currentNode["dosing_rate"] ?? {
            UVLight: {
              chemical: "UVLight",
              value: null,
              units: "W / square meter",
              mode: "rate",
            },
          },
          dosing_area: currentNode["dosing_area"] ?? {
            UVLight: {
              chemical: "UVLight",
              value: null,
              units: "square meters",
              mode: "area",
            },
          },
        });
        break;
      case "Battery":
        setBatteryParams({
          name: id,
          capacity:
            currentNode["capacity"]?.value ??
            currentNode["capacity"] ??
            currentNode["capacity (kWh)"] ??
            currentNode["energy_capacity"]?.value ??
            currentNode["energy_capacity"] ??
            currentNode["energy_capacity (kWh)"] ??
            null,
          capacity_units:
            currentNode["capacity"]?.units ??
            currentNode["energy_capacity"]?.units ??
            "kWh",
          charge_rate:
            currentNode["charge_rate"]?.value ??
            currentNode["charge_rate"] ??
            currentNode["charge_rate (kW)"] ??
            null,
          charge_rate_units:
            currentNode["charge_rate"]?.units ??
            "kW",
          discharge_rate:
            currentNode["discharge_rate"]?.value ??
            currentNode["discharge_rate"] ??
            currentNode["discharge_rate (kW)"] ??
            null,
          discharge_rate_units:
            currentNode["discharge_rate"]?.units ??
            "kW",
        });
        break;
      case "Facility":
        setFacilityParams({
          name: id,
          elevation: currentNode["elevation"] ?? null,
          flowrate: {
            design: currentNode.flowrate?.design ?? null,
            max: currentNode.flowrate?.max ?? null,
            min: currentNode.flowrate?.min ?? null,
            units: currentNode.flowrate?.units ?? "MGD",
          },
          nodes: currentNode["nodes"] ?? [],
          connections: currentNode["connections"] ?? [],
        });
        break;
      case "Chlorination":
      case "Disinfection":
        setChlorinationParams({
          name: id,
          flowrate: {
            design: currentNode.flowrate?.design ?? null,
            max: currentNode.flowrate?.max ?? null,
            min: currentNode.flowrate?.min ?? null,
            units: currentNode.flowrate?.units ?? "MGD",
          },
          num_units: currentNode["num_units"] ?? null,
          volume: valuedUnit(
            currentNode["volume"],
            "cubic meters",
            currentNode["volume (cubic meters)"]
          ),
          dosing_rate: currentNode["dosing_rate"] ?? {},
          residence_time: valuedUnit(currentNode["residence_time"], "hours"),
        });
        break;
      case "Network":
        setNetworkParams({
          name: id,
          nodes: currentNode["nodes"] ?? [],
          connections: currentNode["connections"] ?? [],
          num_units: currentNode["num_units"] ?? null,
        });
        break;
      case "ModularUnit":
          setModularUnitParams({
            name: id,
            nodes: currentNode["nodes"] ?? [],
            connections: currentNode["connections"] ?? [],
            num_units: currentNode["num_units"] ?? null,
          });
          break;
      case "Junction":
        setJunctionParams({
          name: id,
          diameter: valuedUnit(currentNode["diameter"], "meters"),
        });
        break;
      case "Valve":
        setValveParams({
          name: id,
          diameter: valuedUnit(currentNode["diameter"], "meters"),
        });
        break;
      case "PRV":
        setPRVParams({
          name: id,
          diameter: valuedUnit(currentNode["diameter"], "meters"),
          pressure_setting: valuedUnit(currentNode["pressure_setting"], "psi"),
        });
        break;
      case "Pump":
        setPumpParams({
          name: id,
          elevation: valuedUnit(currentNode["elevation"], "meters"),
          power_rating: valuedUnit(currentNode["power_rating"], "hp"),
          num_units: currentNode["num_units"] ?? null,
          flowrate: {
            design: currentNode.flowrate?.design ?? null,
            max: currentNode.flowrate?.max ?? null,
            min: currentNode.flowrate?.min ?? null,
            units: currentNode.flowrate?.units ?? "MGD",
          },
          pump_type: currentNode["pump_type"] ?? "VFD",
          efficiency: currentNode["efficiency"] ?? null,
        });
        break;
      case "Digestion":
        setDigestionParams({
          name: id,
          flowrate: {
            design: currentNode.flowrate?.design ?? null,
            max: currentNode.flowrate?.max ?? null,
            min: currentNode.flowrate?.min ?? null,
            units: currentNode.flowrate?.units ?? "MGD",
          },
          num_units: currentNode["num_units"] ?? null,
          volume: valuedUnit(
            currentNode["volume"],
            "cubic meters",
            currentNode["volume (cubic meters)"]
          ),
          digester_type: currentNode["digester_type"] ?? "Anaerobic",
        });
        break;
      case "Cogeneration":
        setCogenerationParams({
          name: id,
          generation_capacity: {
            design: currentNode.generation_capacity?.design ?? currentNode["design_gen"] ?? null,
            max: currentNode.generation_capacity?.max ?? currentNode["max_gen"] ?? null,
            min: currentNode.generation_capacity?.min ?? currentNode["min_gen"] ?? null,
            units: currentNode.generation_capacity?.units ?? "MGD",
          },
          thermal_efficiency: currentNode["thermal_efficiency"] ?? null,
          electrical_efficiency: currentNode["electrical_efficiency"] ?? null,
          num_units: currentNode["num_units"] ?? null,
        });
        break;
      case "Boiler":
        setBoilerParams({
          name: id,
          generation_capacity: {
            design: currentNode.generation_capacity?.design ?? currentNode["design_gen"] ?? null,
            max: currentNode.generation_capacity?.max ?? currentNode["max_gen"] ?? null,
            min: currentNode.generation_capacity?.min ?? currentNode["min_gen"] ?? null,
            units: currentNode.generation_capacity?.units ?? "MGD",
          },
          thermal_efficiency: currentNode["thermal_efficiency"] ?? null,
          num_units: currentNode["num_units"] ?? null,
        });
        break;
      case "Clarification":
        setClarificationParams({
          name: id,
          flowrate: {
            design: currentNode.flowrate?.design ?? null,
            max: currentNode.flowrate?.max ?? null,
            min: currentNode.flowrate?.min ?? null,
            units: currentNode.flowrate?.units ?? "MGD",
          },
          num_units: currentNode["num_units"] ?? null,
          volume: valuedUnit(
            currentNode["volume"],
            "cubic meters",
            currentNode["volume (cubic meters)"]
          ),
        });
        break;
      case "Separation":
        setSeparationParams({
          name: id,
          elevation: valuedUnit(currentNode["elevation"], "meters"),
          power_rating: valuedUnit(currentNode["power_rating"], "hp"),
          num_units: currentNode["num_units"] ?? null,
          flowrate: {
            design: currentNode.flowrate?.design ?? null,
            max: currentNode.flowrate?.max ?? null,
            min: currentNode.flowrate?.min ?? null,
            units: currentNode.flowrate?.units ?? "MGD",
          },
          volume: valuedUnit(
            currentNode["volume"],
            "cubic meters",
            currentNode["volume (cubic meters)"]
          ),
        });
        break;
      case "Screening":
        setScreeningParams({
          name: id,
          flowrate: {
            design: currentNode.flowrate?.design ?? null,
            max: currentNode.flowrate?.max ?? null,
            min: currentNode.flowrate?.min ?? null,
            units: currentNode.flowrate?.units ?? "MGD",
          },
          num_units: currentNode["num_units"] ?? null,
        });
        break;
      case "Conditioning":
        setConditioningParams({
          name: id,
          flowrate: {
            design: currentNode.flowrate?.design ?? null,
            max: currentNode.flowrate?.max ?? null,
            min: currentNode.flowrate?.min ?? null,
            units: currentNode.flowrate?.units ?? "MGD",
          },
          num_units: currentNode["num_units"] ?? null,
        });
        break;
      case "Thickening":
        setThickeningParams({
          name: id,
          flowrate: {
            design: currentNode.flowrate?.design ?? null,
            max: currentNode.flowrate?.max ?? null,
            min: currentNode.flowrate?.min ?? null,
            units: currentNode.flowrate?.units ?? "MGD",
          },
          num_units: currentNode["num_units"] ?? null,
          volume: valuedUnit(
            currentNode["volume"],
            "cubic meters",
            currentNode["volume (cubic meters)"]
          ),
        });
        break;
      case "Flaring":
        setFlaringParams({
          name: id,
          flowrate: {
            design: currentNode.flowrate?.design ?? null,
            max: currentNode.flowrate?.max ?? null,
            min: currentNode.flowrate?.min ?? null,
            units: currentNode.flowrate?.units ?? "MGD",
          },
          num_units: currentNode["num_units"] ?? null,
        });
        break;
      default:
        break;
    }
  }, [valuedUnit]);

  useEffect(() => {
    addDefaultValueFromDB(currentNode, selectedNodeId);
  }, [addDefaultValueFromDB, currentNode, selectedNodeId]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modal_box_css }}>
        <button
          onClick={onClose} // Add this to close the modal when the button is clicked
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <FaTimes className="text-2xl" />
        </button>
        {nodeType === "Battery" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="BATTERY PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={batteryParams.name}
                  onChange={(e: any) =>
                    setBatteryParams({
                      capacity: batteryParams.capacity,
                      capacity_units: batteryParams.capacity_units,
                      charge_rate: batteryParams.charge_rate,
                      charge_rate_units: batteryParams.charge_rate_units,
                      discharge_rate: batteryParams.discharge_rate,
                      discharge_rate_units: batteryParams.discharge_rate_units,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Capacity"
                    type="number"
                    value={batteryParams.capacity}
                    onChange={(e: any) =>
                      setBatteryParams({
                        capacity: handleNumericInput(e.target.value),
                        capacity_units: batteryParams.capacity_units,
                        charge_rate: batteryParams.charge_rate,
                        charge_rate_units: batteryParams.charge_rate_units,
                        discharge_rate: batteryParams.discharge_rate,
                        discharge_rate_units: batteryParams.discharge_rate_units,
                        name: batteryParams.name,
                      })
                    }
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Capacity units"
                    type="text"
                    value={batteryParams.capacity_units}
                    onChange={(e: any) =>
                      setBatteryParams({
                        capacity: batteryParams.capacity,
                        capacity_units: e.target.value,
                        charge_rate: batteryParams.charge_rate,
                        charge_rate_units: batteryParams.charge_rate_units,
                        discharge_rate: batteryParams.discharge_rate,
                        discharge_rate_units: batteryParams.discharge_rate_units,
                        name: batteryParams.name,
                      })
                    }
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Charge rate"
                    type="number"
                    value={batteryParams.charge_rate}
                    onChange={(e: any) =>
                      setBatteryParams({
                        capacity: batteryParams.capacity,
                        capacity_units: batteryParams.capacity_units,
                        charge_rate: handleNumericInput(e.target.value),
                        charge_rate_units: batteryParams.charge_rate_units,
                        discharge_rate: batteryParams.discharge_rate,
                        discharge_rate_units: batteryParams.discharge_rate_units,
                        name: batteryParams.name,
                      })
                    }
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Charge rate units"
                    type="text"
                    value={batteryParams.charge_rate_units}
                    onChange={(e: any) =>
                      setBatteryParams({
                        capacity: batteryParams.capacity,
                        capacity_units: batteryParams.capacity_units,
                        charge_rate: batteryParams.charge_rate,
                        charge_rate_units: e.target.value,
                        discharge_rate: batteryParams.discharge_rate,
                        discharge_rate_units: batteryParams.discharge_rate_units,
                        name: batteryParams.name,
                      })
                    }
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Discharge rate"
                    type="number"
                    value={batteryParams.discharge_rate}
                    onChange={(e: any) =>
                      setBatteryParams({
                        capacity: batteryParams.capacity,
                        capacity_units: batteryParams.capacity_units,
                        charge_rate: batteryParams.charge_rate,
                        charge_rate_units: batteryParams.charge_rate_units,
                        discharge_rate: handleNumericInput(e.target.value),
                        discharge_rate_units: batteryParams.discharge_rate_units,
                        name: batteryParams.name,
                      })
                    }
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Discharge rate units"
                    type="text"
                    value={batteryParams.discharge_rate_units}
                    onChange={(e: any) =>
                      setBatteryParams({
                        capacity: batteryParams.capacity,
                        capacity_units: batteryParams.capacity_units,
                        charge_rate: batteryParams.charge_rate,
                        charge_rate_units: batteryParams.charge_rate_units,
                        discharge_rate: batteryParams.discharge_rate,
                        discharge_rate_units: e.target.value,
                        name: batteryParams.name,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "Tank" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="TANK PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={tankParams.name}
                  onChange={(e: any) =>
                    setTankParams({
                      elevation: tankParams.elevation,
                      volume: tankParams.volume,
                      num_units: tankParams.num_units,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Elevation"
                    type="number"
                    value={tankParams.elevation?.value}
                    onChange={(e: any) =>
                      setTankParams({
                        elevation: {
                          value: handleNumericInput(e.target.value),
                          units: tankParams.elevation?.units || "meters",
                        },
                        volume: tankParams.volume,
                        num_units: tankParams.num_units,
                        name: tankParams.name,
                      })
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Elevation units"
                    value={tankParams.elevation?.units || "meters"}
                    onChange={(e: any)=> {
                      setTankParams((prevState) => ({
                        ...prevState,
                        elevation: {
                          value: prevState.elevation?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="meters">meters</MenuItem>
                    <MenuItem value="feet">feet</MenuItem>
                    <MenuItem value="inches">inches</MenuItem>
                  </FlowsSelect>
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={tankParams.num_units}
                    onChange={(e: any) =>
                      setTankParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }))
                    }
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Volume"
                    type="number"
                    value={tankParams.volume?.value}
                    onChange={(e: any) =>
                      setTankParams({
                        ...tankParams,
                        volume: {
                          value: handleNumericInput(e.target.value),
                          units: tankParams.volume?.units || "cubic meters",
                        },
                      })
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Volume units"
                    value={tankParams.volume?.units || "cubic meters"}
                    onChange={(e: any) =>
                      setTankParams({
                        ...tankParams,
                        volume: {
                          value: tankParams.volume?.value ?? null,
                          units: e.target.value,
                        },
                      })
                    }
                  >
                    <MenuItem value="cubic meters">cubic meters</MenuItem>
                    <MenuItem value="L">liters</MenuItem>
                    <MenuItem value="gallons">gallons</MenuItem>
                  </FlowsSelect>
                </div>
              </div>
            </div>
          </div>
        )}

        {(nodeType === "StaticMixing" || nodeType === "Reactor") && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title={`${nodeType === "Reactor" ? "REACTOR" : "STATIC MIXING"} PARAMETERS`} />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={staticMixingParams.name}
                  onChange={(e: any) =>
                    setStaticMixingParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  {(["min", "max", "design"] as const).map((key) => (
                    <FlowsTextField
                      key={key}
                      className={modal_textfield_css}
                      label={`Flowrate - ${key}`}
                      type="number"
                      value={staticMixingParams.flowrate[key]}
                      onChange={(e: any) =>
                        setStaticMixingParams((prevState) => ({
                          ...prevState,
                          flowrate: {
                            ...prevState.flowrate,
                            [key]: handleNumericInput(e.target.value),
                          },
                        }))
                      }
                    />
                  ))}
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - units"
                    type="text"
                    value={staticMixingParams.flowrate.units}
                    onChange={(e: any) =>
                      setStaticMixingParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          units: e.target.value,
                        },
                      }))
                    }
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Residence time"
                    type="number"
                    value={staticMixingParams.residence_time?.value}
                    onChange={(e: any) =>
                      setStaticMixingParams((prevState) => ({
                        ...prevState,
                        residence_time: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.residence_time?.units || "hours",
                        },
                      }))
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Residence time units"
                    value={staticMixingParams.residence_time?.units || "hours"}
                    onChange={(e: any) =>
                      setStaticMixingParams((prevState) => ({
                        ...prevState,
                        residence_time: {
                          value: prevState.residence_time?.value ?? null,
                          units: e.target.value,
                        },
                      }))
                    }
                  >
                    <MenuItem value="seconds">seconds</MenuItem>
                    <MenuItem value="minutes">minutes</MenuItem>
                    <MenuItem value="hours">hours</MenuItem>
                    <MenuItem value="days">days</MenuItem>
                    <MenuItem value="weeks">weeks</MenuItem>
                    <MenuItem value="months">months</MenuItem>
                    <MenuItem value="years">years</MenuItem>
                  </FlowsSelect>
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={staticMixingParams.num_units}
                    onChange={(e: any) =>
                      setStaticMixingParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }))
                    }
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Volume"
                    type="number"
                    value={staticMixingParams.volume?.value}
                    onChange={(e: any) =>
                      setStaticMixingParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.volume?.units || "cubic meters",
                        },
                      }))
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Volume units"
                    value={staticMixingParams.volume?.units || "cubic meters"}
                    onChange={(e: any) =>
                      setStaticMixingParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: prevState.volume?.value ?? null,
                          units: e.target.value,
                        },
                      }))
                    }
                  >
                    <MenuItem value="cubic meters">cubic meters</MenuItem>
                    <MenuItem value="L">liters</MenuItem>
                    <MenuItem value="gallons">gallons</MenuItem>
                  </FlowsSelect>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="pH"
                    type="number"
                    value={staticMixingParams.pH}
                    onChange={(e: any) =>
                      setStaticMixingParams((prevState) => ({
                        ...prevState,
                        pH: handleNumericInput(e.target.value),
                      }))
                    }
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Chemical dosed"
                    type="text"
                    value={Object.keys(staticMixingParams.dosing_rate || {})[0] || ""}
                    onChange={(e: any) =>
                      setStaticMixingParams((prevState) => ({
                        ...prevState,
                        dosing_rate: {
                          [e.target.value]: {
                            chemical: e.target.value,
                            value:
                              Object.values(prevState.dosing_rate || {})[0]?.value ??
                              null,
                            units:
                              Object.values(prevState.dosing_rate || {})[0]?.units ??
                              "mg / L",
                            mode: "rate",
                          },
                        },
                      }))
                    }
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Dosing rate"
                    type="number"
                    value={Object.values(staticMixingParams.dosing_rate || {})[0]?.value || null}
                    onChange={(e: any) =>
                      setStaticMixingParams((prevState) => {
                        const chemical =
                          Object.keys(prevState.dosing_rate || {})[0] || "Chemical";

                        return {
                          ...prevState,
                          dosing_rate: {
                            [chemical]: {
                              chemical,
                              value: handleNumericInput(e.target.value),
                              units:
                                prevState.dosing_rate[chemical]?.units ?? "mg / L",
                              mode: "rate",
                            },
                          },
                        };
                      })
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Dosing rate units"
                    value={Object.values(staticMixingParams.dosing_rate || {})[0]?.units || "mg / L"}
                    onChange={(e: any) => {                      
                      setStaticMixingParams((prevState) => {
                        const dosingRate = prevState.dosing_rate || {};
                        const chemicalKeys = Object.keys(dosingRate);
                        
                        if (chemicalKeys.length === 0) {
                          // If no chemicals are set up yet, we can't update the rate meaningfully here.
                          return prevState;
                        }

                        // Use the first available chemical key to update the rate
                        const chemicalKey = chemicalKeys[0];

                        return {
                          ...prevState,
                          dosing_rate: {
                            ...dosingRate,
                            [chemicalKey]: {
                              chemical: chemicalKey,
                              value: dosingRate[chemicalKey]?.value ?? null,
                              units: e.target.value,
                              mode: "rate",
                            },
                          },
                        };
                      });
                    }}
                  >
                    <MenuItem value="mg / L">mg / L</MenuItem>
                  </FlowsSelect>
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "Network" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="NETWORK PARAMETERS" />
            <div className={modal_section_horizontal_css}>
              <div className={modal_left_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="string"
                  value={networkParams.name}
                  onChange={(e: any) =>
                    setNetworkParams({
                      name: e.target.value,
                      nodes: networkParams.nodes,
                      connections: networkParams.connections,
                      num_units: networkParams.num_units
                    })
                  }
                />
              </div>
              <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={networkParams.num_units}
                    onChange={(e: any) => {
                      setNetworkParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />
                </div>
            </div>
          </div>
        )}

      {(nodeType === "ModularUnit") && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="MODULAR UNIT PARAMETERS" />
            <div className={modal_section_horizontal_css}>
              <div className={modal_left_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="string"
                  value={modularUnitParams.name}
                  onChange={(e: any) =>
                    setModularUnitParams({
                      ...modularUnitParams,
                      name: e.target.value,
                    })
                  }
                />
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Number of units"
                  type="number"
                  value={modularUnitParams.num_units}
                  onChange={(e: any) =>
                    setModularUnitParams({
                      ...modularUnitParams,
                      num_units: handleNumericInput(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {nodeType === "Junction" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="JUNCTION PARAMETERS" />
            <div className={modal_section_horizontal_css}>
              <div className={modal_left_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="string"
                  value={junctionParams.name}
                  onChange={(e: any) =>
                    setJunctionParams({
                      ...junctionParams,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Diameter"
                    type="number"
                    value={junctionParams.diameter?.value}
                    onChange={(e: any) =>
                      setJunctionParams({
                        ...junctionParams,
                        diameter: {
                          value: handleNumericInput(e.target.value),
                          units: junctionParams.diameter?.units || "meters",
                        },
                      })
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Diameter units"
                    value={junctionParams.diameter?.units || "meters"}
                    onChange={(e: any) =>
                      setJunctionParams({
                        ...junctionParams,
                        diameter: {
                          value: junctionParams.diameter?.value ?? null,
                          units: e.target.value,
                        },
                      })
                    }
                  >
                    <MenuItem value="meters">meters</MenuItem>
                    <MenuItem value="feet">feet</MenuItem>
                    <MenuItem value="centimeters">centimeters</MenuItem>
                    <MenuItem value="inches">inches</MenuItem>
                  </FlowsSelect>
                </div>
            </div>
          </div>
        )}

        {(nodeType === "Valve" || nodeType === "PRV") && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title={`${nodeType === "PRV" ? "PRV" : "VALVE"} PARAMETERS`} />
            <div className={modal_section_horizontal_css}>
              <div className={modal_left_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="string"
                  value={nodeType === "PRV" ? prvParams.name : valveParams.name}
                  onChange={(e: any) => {
                    if (nodeType === "PRV") {
                      setPRVParams((prevState) => ({
                        ...prevState,
                        name: e.target.value,
                      }));
                    } else {
                      setValveParams((prevState) => ({
                        ...prevState,
                        name: e.target.value,
                      }));
                    }
                  }}
                />
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Diameter"
                  type="number"
                  value={nodeType === "PRV" ? prvParams.diameter?.value : valveParams.diameter?.value}
                  onChange={(e: any) => {
                    if (nodeType === "PRV") {
                      setPRVParams((prevState) => ({
                        ...prevState,
                        diameter: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.diameter?.units || "meters",
                        },
                      }));
                    } else {
                      setValveParams((prevState) => ({
                        ...prevState,
                        diameter: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.diameter?.units || "meters",
                        },
                      }));
                    }
                  }}
                />
                <FlowsSelect
                  className={modal_textfield_css}
                  label="Diameter units"
                  value={nodeType === "PRV" ? prvParams.diameter?.units || "meters" : valveParams.diameter?.units || "meters"}
                  onChange={(e: any) => {
                    if (nodeType === "PRV") {
                      setPRVParams((prevState) => ({
                        ...prevState,
                        diameter: {
                          value: prevState.diameter?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    } else {
                      setValveParams((prevState) => ({
                        ...prevState,
                        diameter: {
                          value: prevState.diameter?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }
                  }}
                >
                  <MenuItem value="meters">meters</MenuItem>
                  <MenuItem value="feet">feet</MenuItem>
                  <MenuItem value="centimeters">centimeters</MenuItem>
                  <MenuItem value="inches">inches</MenuItem>
                </FlowsSelect>
              </div>
              {nodeType === "PRV" && (
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Pressure setting"
                    type="number"
                    value={prvParams.pressure_setting?.value}
                    onChange={(e: any) =>
                      setPRVParams((prevState) => ({
                        ...prevState,
                        pressure_setting: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.pressure_setting?.units || "psi",
                        },
                      }))
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Pressure setting units"
                    value={prvParams.pressure_setting?.units || "psi"}
                    onChange={(e: any) =>
                      setPRVParams((prevState) => ({
                        ...prevState,
                        pressure_setting: {
                          value: prevState.pressure_setting?.value ?? null,
                          units: e.target.value,
                        },
                      }))
                    }
                  >
                    <MenuItem value="psi">psi</MenuItem>
                    <MenuItem value="bar">bar</MenuItem>
                    <MenuItem value="kPa">kPa</MenuItem>
                  </FlowsSelect>
                </div>
              )}
            </div>
          </div>
        )}

        {nodeType === "Reservoir" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="RESERVOIR PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={reservoirParams.name}
                  onChange={(e: any) =>
                    setReservoirParams({
                      elevation: reservoirParams.elevation,
                      volume: reservoirParams.volume,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Elevation"
                    type="number"
                    value={reservoirParams.elevation?.value}
                    onChange={(e: any) => {
                      setReservoirParams((prevState) => ({
                        ...prevState,
                        elevation: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.elevation?.units || "meters",
                        },
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Elevation units"
                    value={reservoirParams.elevation?.units || "meters"}
                    onChange={(e: any)=> {
                      setReservoirParams((prevState) => ({
                        ...prevState,
                        elevation: {
                          value: prevState.elevation?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="meters">meters</MenuItem>
                    <MenuItem value="feet">feet</MenuItem>
                    <MenuItem value="inches">inches</MenuItem>
                  </FlowsSelect>
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Volume"
                    type="number"
                    value={reservoirParams.volume?.value}
                    onChange={(e: any)=> {
                      setReservoirParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: handleNumericInput(e.target.value),
                          units: reservoirParams.volume?.units || "cubic meters",
                        },
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Volume units"
                    value={reservoirParams.volume?.units || "meters"}
                    onChange={(e: any)=> {
                      setReservoirParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: prevState.volume?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="cubic meters">cubic meters</MenuItem>
                    <MenuItem value="L">liters</MenuItem>
                    <MenuItem value="gallons">gallons</MenuItem>
                  </FlowsSelect>
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "Aeration" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="AERATION PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={aerationParams.name}
                  onChange={(e: any) => {
                    setAerationParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                      flowrate: {
                        ...prevState.flowrate,
                      },
                    }));
                  }}
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - min"
                    type="number"
                    value={aerationParams.flowrate.min}
                    onChange={(e: any) => {
                      setAerationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          min: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - max"
                    type="number"
                    value={aerationParams.flowrate.max}
                    onChange={(e: any) => {
                      setAerationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          max: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - design"
                    type="number"
                    value={aerationParams.flowrate.design}
                    onChange={(e: any) => {
                      setAerationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          design: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - units"
                    type="text"
                    value={aerationParams.flowrate.units}
                    onChange={(e: any) => {
                      setAerationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          units: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={aerationParams.num_units}
                    onChange={(e: any) => {
                      setAerationParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Volume"
                    type="number"
                    value={aerationParams.volume?.value}
                    onChange={(e: any) => {
                      setAerationParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.volume?.units || "cubic meters",
                        },
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Volume units"
                    value={aerationParams.volume?.units || "cubic meters"}
                    onChange={(e: any)=> {
                      setAerationParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: prevState.volume?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="cubic meters">cubic meters</MenuItem>
                    <MenuItem value="L">liters</MenuItem>
                    <MenuItem value="gallons">gallons</MenuItem>
                  </FlowsSelect>
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "ROMembrane" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="REVERSE OSMOSIS MEMBRANE PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={roMembraneParams.name}
                  onChange={(e: any) =>
                    setROMembraneParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  {(["min", "max", "design"] as const).map((key) => (
                    <FlowsTextField
                      key={key}
                      className={modal_textfield_css}
                      label={`Flowrate - ${key}`}
                      type="number"
                      value={roMembraneParams.flowrate[key]}
                      onChange={(e: any) =>
                        setROMembraneParams((prevState) => ({
                          ...prevState,
                          flowrate: {
                            ...prevState.flowrate,
                            [key]: handleNumericInput(e.target.value),
                          },
                        }))
                      }
                    />
                  ))}
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - units"
                    type="text"
                    value={roMembraneParams.flowrate.units}
                    onChange={(e: any) =>
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          units: e.target.value,
                        },
                      }))
                    }
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Settling time"
                    type="number"
                    value={roMembraneParams.settling_time?.value}
                    onChange={(e: any) =>
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        settling_time: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.settling_time?.units || "minutes",
                        },
                      }))
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Settling time units"
                    value={roMembraneParams.settling_time?.units || "minutes"}
                    onChange={(e: any) => {
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        settling_time: {
                          value: prevState.settling_time?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="seconds">seconds</MenuItem>
                    <MenuItem value="minutes">minutes</MenuItem>
                    <MenuItem value="hours">hours</MenuItem>
                  </FlowsSelect>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Area"
                    type="number"
                    value={roMembraneParams.area?.value}
                    onChange={(e: any) =>
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        area: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.area?.units || "square meters",
                        },
                      }))
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Area units"
                    value={roMembraneParams.area?.units || "square meters"}
                    onChange={(e: any)=> {
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        area: {
                          value: prevState.area?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="square meters">square meters</MenuItem>
                    <MenuItem value="sq ft">square feet</MenuItem>
                    <MenuItem value="sq in">square inches</MenuItem>
                  </FlowsSelect>
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={roMembraneParams.num_units}
                    onChange={(e: any) =>
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }))
                    }
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Volume"
                    type="number"
                    value={roMembraneParams.volume?.value}
                    onChange={(e: any) =>
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.volume?.units || "cubic meters",
                        },
                      }))
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Volume units"
                    value={roMembraneParams.volume?.units || "cubic meters"}
                    onChange={(e: any)=> {
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: prevState.volume?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="cubic meters">cubic meters</MenuItem>
                    <MenuItem value="L">liters</MenuItem>
                    <MenuItem value="gallons">gallons</MenuItem>
                  </FlowsSelect>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Permeability"
                    type="number"
                    value={roMembraneParams.permeability?.value}
                    onChange={(e: any) =>
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        permeability: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.permeability?.units || "LMH / bar",
                        },
                      }))
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Permeability units"
                    value={roMembraneParams.permeability?.units || "LMH / bar"}
                    onChange={(e: any) => {
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        permeability: {
                          value: prevState.permeability?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="LMH / bar">LMH / bar</MenuItem>
                  </FlowsSelect>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Selectivity"
                    type="number"
                    value={roMembraneParams.selectivity?.value}
                    onChange={(e: any) =>
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        selectivity: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.selectivity?.units || "m / s",
                        },
                      }))
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Selectivity units"
                    value={roMembraneParams.selectivity?.units || "m / s"}
                    onChange={(e: any) => {
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        selectivity: {
                          value: prevState.selectivity?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="m / s">m / s</MenuItem>
                    <MenuItem value="">%</MenuItem>
                  </FlowsSelect>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Chemical dosed"
                    type="text"
                    value={Object.keys(roMembraneParams.dosing_rate || {})[0] || ""}
                    onChange={(e: any) =>
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        dosing_rate: {
                          [e.target.value]: {
                            chemical: e.target.value,
                            value:
                              Object.values(prevState.dosing_rate || {})[0]?.value ??
                              null,
                            units:
                              Object.values(prevState.dosing_rate || {})[0]?.units ??
                              "mg / L",
                            mode: "rate",
                          },
                        },
                      }))
                    }
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Dosing rate"
                    type="number"
                    value={Object.values(roMembraneParams.dosing_rate || {})[0]?.value || null}
                    onChange={(e: any) =>
                      setROMembraneParams((prevState) => {
                        const chemical =
                          Object.keys(prevState.dosing_rate || {})[0] || "Chemical";

                        return {
                          ...prevState,
                          dosing_rate: {
                            [chemical]: {
                              chemical,
                              value: handleNumericInput(e.target.value),
                              units:
                                prevState.dosing_rate[chemical]?.units ?? "mg / L",
                              mode: "rate",
                            },
                          },
                        };
                      })
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Dosing rate units"
                    value={Object.values(roMembraneParams.dosing_rate || {})[0]?.units || "mg / L"}
                    onChange={(e: any) => {                      
                      setROMembraneParams((prevState) => {
                        const dosingRate = prevState.dosing_rate || {};
                        const chemicalKeys = Object.keys(dosingRate);
                        
                        if (chemicalKeys.length === 0) {
                          // If no chemicals are set up yet, we can't update the rate meaningfully here.
                          return prevState;
                        }

                        // Use the first available chemical key to update the rate
                        const chemicalKey = chemicalKeys[0];

                        return {
                          ...prevState,
                          dosing_rate: {
                            ...dosingRate,
                            [chemicalKey]: {
                              chemical: chemicalKey,
                              value: dosingRate[chemicalKey]?.value ?? null,
                              units: e.target.value,
                              mode: "rate",
                            },
                          },
                        };
                      });
                    }}
                  >
                    <MenuItem value="mg / L">mg / L</MenuItem>
                  </FlowsSelect>
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "UVSystem" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="ULTRAVIOLET SYSTEM PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={uvSystemParams.name}
                  onChange={(e: any) =>
                    setUVSystemParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  {(["min", "max", "design"] as const).map((key) => (
                    <FlowsTextField
                      key={key}
                      className={modal_textfield_css}
                      label={`Flowrate - ${key}`}
                      type="number"
                      value={uvSystemParams.flowrate[key]}
                      onChange={(e: any) =>
                        setUVSystemParams((prevState) => ({
                          ...prevState,
                          flowrate: {
                            ...prevState.flowrate,
                            [key]: handleNumericInput(e.target.value),
                          },
                        }))
                      }
                    />
                  ))}
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - units"
                    type="text"
                    value={uvSystemParams.flowrate.units}
                    onChange={(e: any) =>
                      setUVSystemParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          units: e.target.value,
                        },
                      }))
                    }
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Residence time"
                    type="number"
                    value={uvSystemParams.residence_time?.value}
                    onChange={(e: any) =>
                      setUVSystemParams((prevState) => ({
                        ...prevState,
                        residence_time: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.residence_time?.units || "hours",
                        },
                      }))
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Residence time units"
                    value={uvSystemParams.residence_time?.units || "hours"}
                    onChange={(e: any) =>
                      setUVSystemParams((prevState) => ({
                        ...prevState,
                        residence_time: {
                          value: prevState.residence_time?.value ?? null,
                          units: e.target.value,
                        },
                      }))
                    }
                  >
                    <MenuItem value="seconds">seconds</MenuItem>
                    <MenuItem value="minutes">minutes</MenuItem>
                    <MenuItem value="hours">hours</MenuItem>
                    <MenuItem value="days">days</MenuItem>
                    <MenuItem value="weeks">weeks</MenuItem>
                    <MenuItem value="months">months</MenuItem>
                    <MenuItem value="years">years</MenuItem>
                  </FlowsSelect>
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={uvSystemParams.num_units}
                    onChange={(e: any) =>
                      setUVSystemParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }))
                    }
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Volume"
                    type="number"
                    value={uvSystemParams.volume?.value}
                    onChange={(e: any) =>
                      setUVSystemParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.volume?.units || "cubic meters",
                        },
                      }))
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Volume units"
                    value={uvSystemParams.volume?.units || "cubic meters"}
                    onChange={(e: any) =>
                      setUVSystemParams({
                        ...uvSystemParams,
                        volume: {
                          value: uvSystemParams.volume?.value ?? null,
                          units: e.target.value,
                        },
                      })
                    }
                  >
                    <MenuItem value="cubic meters">cubic meters</MenuItem>
                    <MenuItem value="L">liters</MenuItem>
                    <MenuItem value="gallons">gallons</MenuItem>
                  </FlowsSelect>

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Dosing intensity"
                    type="number"
                    value={uvSystemParams.dosing_rate.UVLight?.value || null}
                    onChange={(e: any) =>
                      setUVSystemParams((prevState) => ({
                        ...prevState,
                        dosing_rate: {
                          UVLight: {
                            chemical: "UVLight",
                            value: handleNumericInput(e.target.value),
                            units:
                              prevState.dosing_rate.UVLight?.units ??
                              "W / square meter",
                            mode: "rate",
                          },
                        },
                      }))
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Intensity units"
                    value={uvSystemParams.dosing_rate["UVLight"]?.units || "W / square meter"}
                    onChange={(e: any) => {                      
                      setUVSystemParams((prevState) => {
                        const dosingRate = prevState.dosing_rate || {};
                        const chemicalKeys = Object.keys(dosingRate);
                        
                        if (chemicalKeys.length === 0) {
                          // If no chemicals are set up yet, we can't update the rate meaningfully here.
                          return prevState;
                        }

                        // Use the first available chemical key to update the rate
                        const chemicalKey = chemicalKeys[0];

                        return {
                          ...prevState,
                          dosing_rate: {
                            ...dosingRate,
                            [chemicalKey]: {
                              chemical: chemicalKey,
                              value: dosingRate[chemicalKey]?.value ?? null,
                              units: e.target.value,
                              mode: "rate",
                            },
                          },
                        };
                      });
                    }}
                  >
                    <MenuItem value="W / square meter">W / square meter</MenuItem>
                  </FlowsSelect>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Dosing area"
                    type="number"
                    value={uvSystemParams.dosing_area.UVLight?.value || null}
                    onChange={(e: any) =>
                      setUVSystemParams((prevState) => ({
                        ...prevState,
                        dosing_area: {
                          UVLight: {
                            chemical: "UVLight",
                            value: handleNumericInput(e.target.value),
                            units:
                              prevState.dosing_area.UVLight?.units ??
                              "square meters",
                            mode: "area",
                          },
                        },
                      }))
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Area units"
                    value={uvSystemParams.dosing_area["UVLight"]?.units || "square meters"}
                    onChange={(e: any) => {                      
                      setUVSystemParams((prevState) => {
                        const dosingArea = prevState.dosing_area || {};
                        const chemicalKeys = Object.keys(dosingArea);
                        
                        if (chemicalKeys.length === 0) {
                          // If no chemicals are set up yet, we can't update the rate meaningfully here.
                          return prevState;
                        }

                        // Use the first available chemical key to update the rate
                        const chemicalKey = chemicalKeys[0];

                        return {
                          ...prevState,
                          dosing_area: {
                            ...dosingArea,
                            [chemicalKey]: {
                              chemical: chemicalKey,
                              value: dosingArea[chemicalKey]?.value ?? null,
                              units: e.target.value,
                              mode: "area",
                            },
                          },
                        };
                      });
                    }}
                  >
                    <MenuItem value="square meters">square meters</MenuItem>
                  </FlowsSelect>
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "Filtration" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="FILTRATION PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={filtrationParams.name}
                  onChange={(e: any) => {
                    setFiltrationParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                      flowrate: {
                        ...prevState.flowrate,
                      },
                    }));
                  }}
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - min"
                    type="number"
                    value={filtrationParams.flowrate.min}
                    onChange={(e: any) => {
                      setFiltrationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          min: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - max"
                    type="number"
                    value={filtrationParams.flowrate.max}
                    onChange={(e: any) => {
                      setFiltrationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          max: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - design"
                    type="number"
                    value={filtrationParams.flowrate.design}
                    onChange={(e: any) => {
                      setFiltrationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          design: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - units"
                    type="text"
                    value={filtrationParams.flowrate.units}
                    onChange={(e: any) => {
                      setFiltrationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          units: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={filtrationParams.num_units}
                    onChange={(e: any) => {
                      setFiltrationParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Volume"
                    type="number"
                    value={filtrationParams.volume?.value}
                    onChange={(e: any) => {
                      setFiltrationParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.volume?.units || "cubic meters",
                        },
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Volume units"
                    value={filtrationParams.volume?.units || "cubic meters"}
                    onChange={(e: any)=> {
                      setFiltrationParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: prevState.volume?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="cubic meters">cubic meters</MenuItem>
                    <MenuItem value="L">liters</MenuItem>
                    <MenuItem value="gallons">gallons</MenuItem>
                  </FlowsSelect>

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Settling time"
                    type="number"
                    value={filtrationParams.settling_time?.value}
                    onChange={(e: any) =>
                      setFiltrationParams((prevState) => ({
                        ...prevState,
                        settling_time: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.settling_time?.units || "minutes",
                        },
                      }))
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Settling time units"
                    value={filtrationParams.settling_time?.units || "minutes"}
                    onChange={(e: any) => {
                      setFiltrationParams((prevState) => ({
                        ...prevState,
                        settling_time: {
                          value: prevState.settling_time?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="seconds">seconds</MenuItem>
                    <MenuItem value="minutes">minutes</MenuItem>
                    <MenuItem value="hours">hours</MenuItem>
                  </FlowsSelect>

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Dosing rate"
                    type="number"
                    value={Object.values(filtrationParams.dosing_rate || {})[0]?.value || null}
                    onChange={(e: any) => {                      
                      setFiltrationParams((prevState) => {
                        const dosingRate = prevState.dosing_rate || {};
                        const chemicalKeys = Object.keys(dosingRate);
                        
                        if (chemicalKeys.length === 0) {
                          // If no chemicals are set up yet, we can't update the rate meaningfully here.
                          return prevState;
                        }

                        // Use the first available chemical key to update the rate
                        const chemicalKey = chemicalKeys[0];

                        return {
                          ...prevState,
                          dosing_rate: {
                            ...dosingRate,
                            [chemicalKey]: {
                              chemical: chemicalKey,
                              value: handleNumericInput(e.target.value),
                              units: dosingRate[chemicalKey]?.units ?? "mg / L",
                              mode: "rate",
                            },
                          },
                        };
                      });
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Dosing rate units"
                    value={Object.values(filtrationParams.dosing_rate || {})[0]?.units || "mg / L"}
                    onChange={(e: any) => {                      
                      setFiltrationParams((prevState) => {
                        const dosingRate = prevState.dosing_rate || {};
                        const chemicalKeys = Object.keys(dosingRate);
                        
                        if (chemicalKeys.length === 0) {
                          // If no chemicals are set up yet, we can't update the rate meaningfully here.
                          return prevState;
                        }

                        // Use the first available chemical key to update the rate
                        const chemicalKey = chemicalKeys[0];

                        return {
                          ...prevState,
                          dosing_rate: {
                            ...dosingRate,
                            [chemicalKey]: {
                              chemical: chemicalKey,
                              value: dosingRate[chemicalKey]?.value ?? null,
                              units: e.target.value,
                              mode: "rate",
                            },
                          },
                        };
                      });
                    }}
                  >
                    <MenuItem value="mg / L">mg / L</MenuItem>
                  </FlowsSelect>
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "Clarification" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="CLARIFICATION PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={clarificationParams.name}
                  onChange={(e: any) => {
                    setClarificationParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                      flowrate: {
                        ...prevState.flowrate,
                      },
                    }));
                  }}
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - min"
                    type="number"
                    value={clarificationParams.flowrate.min}
                    onChange={(e: any) => {
                      setClarificationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          min: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - max"
                    type="number"
                    value={clarificationParams.flowrate.max}
                    onChange={(e: any) => {
                      setClarificationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          max: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - design"
                    type="number"
                    value={clarificationParams.flowrate.design}
                    onChange={(e: any) => {
                      setClarificationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          design: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - units"
                    type="text"
                    value={clarificationParams.flowrate.units}
                    onChange={(e: any) => {
                      setClarificationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          units: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={clarificationParams.num_units}
                    onChange={(e: any) => {
                      setClarificationParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Volume"
                    type="number"
                    value={clarificationParams.volume?.value}
                    onChange={(e: any) => {
                      setClarificationParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.volume?.units || "cubic meters",
                        },
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Volume units"
                    value={clarificationParams.volume?.units || "cubic meters"}
                    onChange={(e: any)=> {
                      setClarificationParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: prevState.volume?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="cubic meters">cubic meters</MenuItem>
                    <MenuItem value="L">liters</MenuItem>
                    <MenuItem value="gallons">gallons</MenuItem>
                  </FlowsSelect>
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "Separation" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="SEPARATION PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={separationParams.name}
                  onChange={(e: any) => {
                    setSeparationParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - min"
                    type="number"
                    value={separationParams.flowrate.min}
                    onChange={(e: any) => {
                      setSeparationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          min: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - max"
                    type="number"
                    value={separationParams.flowrate.max}
                    onChange={(e: any) => {
                      setSeparationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          max: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - design"
                    type="number"
                    value={separationParams.flowrate.design}
                    onChange={(e: any) => {
                      setSeparationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          design: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - units"
                    type="text"
                    value={separationParams.flowrate.units}
                    onChange={(e: any) => {
                      setSeparationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          units: e.target.value,
                        },
                      }));
                    }}
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={separationParams.num_units}
                    onChange={(e: any) => {
                      setSeparationParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Volume"
                    type="number"
                    value={separationParams.volume?.value}
                    onChange={(e: any) => {
                      setSeparationParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.volume?.units || "cubic meters",
                        },
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Volume units"
                    value={separationParams.volume?.units || "cubic meters"}
                    onChange={(e: any)=> {
                      setSeparationParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: prevState.volume?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="cubic meters">cubic meters</MenuItem>
                    <MenuItem value="L">liters</MenuItem>
                    <MenuItem value="gallons">gallons</MenuItem>
                  </FlowsSelect>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Elevation"
                    type="number"
                    value={separationParams.elevation?.value}
                    onChange={(e: any) => {
                      setSeparationParams((prevState) => ({
                        ...prevState,
                        elevation: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.elevation?.units || "meters",
                        },
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Elevation units"
                    value={separationParams.elevation?.units || "meters"}
                    onChange={(e: any) => {
                      setSeparationParams((prevState) => ({
                        ...prevState,
                        elevation: {
                          value: prevState.elevation?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="meters">meters</MenuItem>
                    <MenuItem value="feet">feet</MenuItem>
                    <MenuItem value="inches">inches</MenuItem>
                  </FlowsSelect>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Power rating"
                    type="number"
                    value={separationParams.power_rating?.value}
                    onChange={(e: any) => {
                      setSeparationParams((prevState) => ({
                        ...prevState,
                        power_rating: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.power_rating?.units || "hp",
                        },
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Power rating units"
                    value={separationParams.power_rating?.units || "hp"}
                    onChange={(e: any) => {
                      setSeparationParams((prevState) => ({
                        ...prevState,
                        power_rating: {
                          value: prevState.power_rating?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="hp">hp</MenuItem>
                    <MenuItem value="kW">kW</MenuItem>
                  </FlowsSelect>
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "Thickening" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="THICKENING PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={thickeningParams.name}
                  onChange={(e: any) => {
                    setThickeningParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                      flowrate: {
                        ...prevState.flowrate,
                      },
                    }));
                  }}
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - min"
                    type="number"
                    value={thickeningParams.flowrate.min}
                    onChange={(e: any) => {
                      setThickeningParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          min: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - max"
                    type="number"
                    value={thickeningParams.flowrate.max}
                    onChange={(e: any) => {
                      setThickeningParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          max: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - design"
                    type="number"
                    value={thickeningParams.flowrate.design}
                    onChange={(e: any) => {
                      setThickeningParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          design: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - units"
                    type="text"
                    value={thickeningParams.flowrate.units}
                    onChange={(e: any) => {
                      setThickeningParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          units: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={thickeningParams.num_units}
                    onChange={(e: any) => {
                      setThickeningParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Volume"
                    type="number"
                    value={thickeningParams.volume?.value}
                    onChange={(e: any) => {
                      setThickeningParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.volume?.units || "cubic meters",
                        },
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Volume units"
                    value={thickeningParams.volume?.units || "cubic meters"}
                    onChange={(e: any)=> {
                      setThickeningParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: prevState.volume?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="cubic meters">cubic meters</MenuItem>
                    <MenuItem value="L">liters</MenuItem>
                    <MenuItem value="gallons">gallons</MenuItem>
                  </FlowsSelect>
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "Facility" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="FACILITY PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={facilityParams.name}
                  onChange={(e: any) => {
                    setFacilityParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                      flowrate: {
                        ...prevState.flowrate,
                      },
                    }));
                  }}
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - min"
                    type="number"
                    value={facilityParams.flowrate.min}
                    onChange={(e: any) => {
                      setFacilityParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          min: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - max"
                    type="number"
                    value={facilityParams.flowrate.max}
                    onChange={(e: any) => {
                      setFacilityParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          max: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - design"
                    type="number"
                    value={facilityParams.flowrate.design}
                    onChange={(e: any) => {
                      setFacilityParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          design: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - units"
                    type="text"
                    value={facilityParams.flowrate.units}
                    onChange={(e: any) => {
                      setFacilityParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          units: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Elevation"
                    type="number"
                    value={facilityParams.elevation?.value}
                    onChange={(e: any) => {
                      setFacilityParams((prevState) => ({
                        ...prevState,
                        elevation: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.elevation?.units || "meters",
                        },
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Elevation units"
                    value={facilityParams.elevation?.units || "meters"}
                    onChange={(e: any)=> {
                      setFacilityParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: prevState.elevation?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="meters">meters</MenuItem>
                    <MenuItem value="feet">feet</MenuItem>
                    <MenuItem value="inches">inches</MenuItem>
                  </FlowsSelect>
                </div>
              </div>
            </div>
          </div>
        )}

        {(nodeType === "Chlorination" || nodeType === "Disinfection") && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title={`${nodeType === "Disinfection" ? "DISINFECTION" : "CHLORINATION"} PARAMETERS`} />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={chlorinationParams.name}
                  onChange={(e: any) => {
                    setChlorinationParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                      flowrate: {
                        ...prevState.flowrate,
                      },
                    }));
                  }}
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - min"
                    type="number"
                    value={chlorinationParams.flowrate.min}
                    onChange={(e: any) => {
                      setChlorinationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          min: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - max"
                    type="number"
                    value={chlorinationParams.flowrate.max}
                    onChange={(e: any) => {
                      setChlorinationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          max: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - design"
                    type="number"
                    value={chlorinationParams.flowrate.design}
                    onChange={(e: any) => {
                      setChlorinationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          design: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - units"
                    type="text"
                    value={chlorinationParams.flowrate.units}
                    onChange={(e: any) => {
                      setChlorinationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          units: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={chlorinationParams.num_units}
                    onChange={(e: any) => {
                      setChlorinationParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Residence time"
                    type="number"
                    value={chlorinationParams.residence_time?.value}
                    onChange={(e: any) => {
                      setChlorinationParams((prevState) => ({
                        ...prevState,
                        residence_time: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.residence_time?.units || "hours",
                        },
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Residence time units"
                    value={chlorinationParams.residence_time?.units || "hours"}
                    onChange={(e: any) =>
                      setChlorinationParams((prevState) => ({
                        ...prevState,
                        residence_time: {
                          value: prevState.residence_time?.value ?? null,
                          units: e.target.value,
                        },
                      }))
                    }
                  >
                    <MenuItem value="seconds">seconds</MenuItem>
                    <MenuItem value="minutes">minutes</MenuItem>
                    <MenuItem value="hours">hours</MenuItem>
                    <MenuItem value="days">days</MenuItem>
                    <MenuItem value="weeks">weeks</MenuItem>
                  </FlowsSelect>

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Volume"
                    type="number"
                    value={chlorinationParams.volume?.value}
                    onChange={(e: any) => {
                      setChlorinationParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.volume?.units || "cubic meters",
                        },
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Volume units"
                    value={chlorinationParams.volume?.units || "cubic meters"}
                    onChange={(e: any) =>
                      setChlorinationParams({
                        ...chlorinationParams,
                        volume: {
                          value: chlorinationParams.volume?.value ?? null,
                          units: e.target.value,
                        },
                      })
                    }
                  >
                    <MenuItem value="cubic meters">cubic meters</MenuItem>
                    <MenuItem value="L">liters</MenuItem>
                    <MenuItem value="gallons">gallons</MenuItem>
                  </FlowsSelect>

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Dosing rate"
                    type="number"
                    value={Object.values(chlorinationParams.dosing_rate || {})[0]?.value || null}
                    onChange={(e: any) => {                      
                      setChlorinationParams((prevState) => {
                        const dosingRate = prevState.dosing_rate || {};
                        const chemicalKeys = Object.keys(dosingRate);
                        
                        if (chemicalKeys.length === 0) {
                          // If no chemicals are set up yet, we can't update the rate meaningfully here.
                          return prevState;
                        }

                        // Use the first available chemical key to update the rate
                        const chemicalKey = chemicalKeys[0];

                        return {
                          ...prevState,
                          dosing_rate: {
                            ...dosingRate,
                            [chemicalKey]: {
                              chemical: chemicalKey,
                              value: handleNumericInput(e.target.value),
                              units: dosingRate[chemicalKey]?.units ?? "mg / L",
                              mode: "rate",
                            },
                          },
                        };
                      });
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Dosing rate units"
                    value={Object.values(chlorinationParams.dosing_rate || {})[0]?.units || "mg / L"}
                    onChange={(e: any) => {                      
                      setChlorinationParams((prevState) => {
                        const dosingRate = prevState.dosing_rate || {};
                        const chemicalKeys = Object.keys(dosingRate);
                        
                        if (chemicalKeys.length === 0) {
                          // If no chemicals are set up yet, we can't update the rate meaningfully here.
                          return prevState;
                        }

                        // Use the first available chemical key to update the rate
                        const chemicalKey = chemicalKeys[0];

                        return {
                          ...prevState,
                          dosing_rate: {
                            ...dosingRate,
                            [chemicalKey]: {
                              chemical: chemicalKey,
                              value: dosingRate[chemicalKey]?.value ?? null,
                              units: e.target.value,
                              mode: "rate",
                            },
                          },
                        };
                      });
                    }}
                  >
                    <MenuItem value="mg / L">mg / L</MenuItem>
                  </FlowsSelect>
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "Flaring" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="FLARING PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={flaringParams.name}
                  onChange={(e: any) => {
                    setFlaringParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                      flowrate: {
                        ...prevState.flowrate,
                      },
                    }));
                  }}
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - min"
                    type="number"
                    value={flaringParams.flowrate.min}
                    onChange={(e: any) => {
                      setFlaringParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          min: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - max"
                    type="number"
                    value={flaringParams.flowrate.max}
                    onChange={(e: any) => {
                      setFlaringParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          max: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - design"
                    type="number"
                    value={flaringParams.flowrate.design}
                    onChange={(e: any) => {
                      setFlaringParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          design: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - units"
                    type="text"
                    value={flaringParams.flowrate.units}
                    onChange={(e: any) => {
                      setFlaringParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          units: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={flaringParams.num_units}
                    onChange={(e: any) => {
                      setFlaringParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "Conditioning" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="CONDITIONING PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={conditioningParams.name}
                  onChange={(e: any) => {
                    setConditioningParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                      flowrate: {
                        ...prevState.flowrate,
                      },
                    }));
                  }}
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - min"
                    type="number"
                    value={conditioningParams.flowrate.min}
                    onChange={(e: any) => {
                      setConditioningParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          min: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - max"
                    type="number"
                    value={conditioningParams.flowrate.max}
                    onChange={(e: any) => {
                      setConditioningParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          max: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - design"
                    type="number"
                    value={conditioningParams.flowrate.design}
                    onChange={(e: any) => {
                      setConditioningParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          design: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - units"
                    type="text"
                    value={conditioningParams.flowrate.units}
                    onChange={(e: any) => {
                      setConditioningParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          units: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={conditioningParams.num_units}
                    onChange={(e: any) => {
                      setConditioningParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "Screening" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="SCREENING PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={screeningParams.name}
                  onChange={(e: any) => {
                    setScreeningParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                      flowrate: {
                        ...prevState.flowrate,
                      },
                    }));
                  }}
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - min"
                    type="number"
                    value={screeningParams.flowrate.min}
                    onChange={(e: any) => {
                      setScreeningParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          min: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - max"
                    type="number"
                    value={screeningParams.flowrate.max}
                    onChange={(e: any) => {
                      setScreeningParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          max: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - design"
                    type="number"
                    value={screeningParams.flowrate.design}
                    onChange={(e: any) => {
                      setScreeningParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          design: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - units"
                    type="text"
                    value={screeningParams.flowrate.units}
                    onChange={(e: any) => {
                      setScreeningParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          units: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={screeningParams.num_units}
                    onChange={(e: any) => {
                      setScreeningParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "Pump" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="PUMP PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={pumpParams.name}
                  onChange={(e: any) => {
                    setPumpParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                      flowrate: {
                        ...prevState.flowrate,
                      },
                    }));
                  }}
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - min"
                    type="number"
                    value={pumpParams.flowrate.min}
                    onChange={(e: any) => {
                      setPumpParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          min: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - max"
                    type="number"
                    value={pumpParams.flowrate.max}
                    onChange={(e: any) => {
                      setPumpParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          max: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - design"
                    type="number"
                    value={pumpParams.flowrate.design}
                    onChange={(e: any) => {
                      setPumpParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          design: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - units"
                    type="text"
                    value={pumpParams.flowrate.units}
                    onChange={(e: any) => {
                      setPumpParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          units: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={pumpParams.num_units}
                    onChange={(e: any) => {
                      setPumpParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Elevation"
                    type="number"
                    value={pumpParams.elevation?.value}
                    onChange={(e: any) => {
                      setPumpParams((prevState) => ({
                        ...prevState,
                        elevation: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.elevation?.units || "meters",
                        },
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Elevation units"
                    value={pumpParams.elevation?.units || "meters"}
                    onChange={(e: any)=> {
                      setPumpParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: prevState.elevation?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="meters">meters</MenuItem>
                    <MenuItem value="feet">feet</MenuItem>
                    <MenuItem value="inches">inches</MenuItem>
                  </FlowsSelect>

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Power rating"
                    type="number"
                    value={pumpParams.power_rating?.value ?? null}
                    onChange={(e: any) => {
                      setPumpParams((prevState) => ({
                        ...prevState,
                        power_rating: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.power_rating?.units || "hp",
                        }
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Power rating units"
                    value={pumpParams.power_rating?.units || "hp"}
                    onChange={(e: any) => {
                      setPumpParams((prevState) => ({
                        ...prevState,
                        power_rating: {
                          value: prevState.power_rating?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
                  >
                    <MenuItem value="hp">horsepower</MenuItem>
                    <MenuItem value="W">watts</MenuItem>
                  </FlowsSelect>


                  <FlowsSelect
                    className="m-5 w-2/3"
                    label="Pump type"
                    value={pumpParams.pump_type}
                    onChange={(e: any) => {
                      setPumpParams((prevState) => ({
                        ...prevState,
                        pump_type: e.target.value,
                      }));
                    }}
                  >
                    <MenuItem value="Constant">Constant</MenuItem>
                    <MenuItem value="VFD">VFD</MenuItem>
                  </FlowsSelect>
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "Digestion" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="DIGESTION PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={digestionParams.name}
                  onChange={(e: any) => {
                    setDigestionParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                      flowrate: {
                        ...prevState.flowrate,
                      },
                    }));
                  }}
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - min"
                    type="number"
                    value={digestionParams.flowrate.min}
                    onChange={(e: any) => {
                      setDigestionParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          min: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - max"
                    type="number"
                    value={digestionParams.flowrate.max}
                    onChange={(e: any) => {
                      setDigestionParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          max: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - design"
                    type="number"
                    value={digestionParams.flowrate.design}
                    onChange={(e: any) => {
                      setDigestionParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          design: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - units"
                    type="text"
                    value={digestionParams.flowrate.units}
                    onChange={(e: any) => {
                      setDigestionParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          units: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className="m-5"
                    label="Number of units"
                    type="number"
                    value={digestionParams.num_units}
                    onChange={(e: any) => {
                      setDigestionParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Volume"
                    type="number"
                    value={digestionParams.volume?.value}
                    onChange={(e: any) => {
                      setDigestionParams((prevState) => ({
                        ...prevState,
                        volume: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.volume?.units || "cubic meters",
                        },
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Volume units"
                    value={digestionParams.volume?.units || "cubic meters"}
                    onChange={(e: any) =>
                      setDigestionParams({
                        ...digestionParams,
                        volume: {
                          value: digestionParams.volume?.value ?? null,
                          units: e.target.value,
                        },
                      })
                    }
                  >
                    <MenuItem value="cubic meters">cubic meters</MenuItem>
                    <MenuItem value="L">liters</MenuItem>
                    <MenuItem value="gallons">gallons</MenuItem>
                  </FlowsSelect>

                  <FlowsSelect
                    className="m-5 w-2/3"
                    label="Digester type"
                    value={digestionParams.digester_type}
                    onChange={(e: any) => {
                      setDigestionParams((prevState) => ({
                        ...prevState,
                        digester_type: e.target.value,
                      }));
                    }}
                  >
                    <MenuItem value="Aerobic">Aerobic</MenuItem>
                    <MenuItem value="Anaerobic">Anaerobic</MenuItem>
                  </FlowsSelect>
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "Cogeneration" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="COGENERATION PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={cogenerationParams.name}
                  onChange={(e: any) => {
                    setCogenerationParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                      generation_capacity: {
                        ...prevState.generation_capacity,
                      },
                    }));
                  }}
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Generation capacity - min"
                    type="number"
                    value={cogenerationParams.generation_capacity.min}
                    onChange={(e: any) => {
                      setCogenerationParams((prevState) => ({
                        ...prevState,
                        generation_capacity: {
                          ...prevState.generation_capacity,
                          min: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Generation capacity - max"
                    type="number"
                    value={cogenerationParams.generation_capacity.max}
                    onChange={(e: any) => {
                      setCogenerationParams((prevState) => ({
                        ...prevState,
                        generation_capacity: {
                          ...prevState.generation_capacity,
                          max: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Generation capacity - design"
                    type="number"
                    value={cogenerationParams.generation_capacity.design}
                    onChange={(e: any) => {
                      setCogenerationParams((prevState) => ({
                        ...prevState,
                        generation_capacity: {
                          ...prevState.generation_capacity,
                          design: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Generation capacity - units"
                    type="text"
                    value={cogenerationParams.generation_capacity.units}
                    onChange={(e: any) => {
                      setCogenerationParams((prevState) => ({
                        ...prevState,
                        generation_capacity: {
                          ...prevState.generation_capacity,
                          units: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={cogenerationParams.num_units}
                    onChange={(e: any) => {
                      setCogenerationParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Electrical efficiency"
                    type="number"
                    value={cogenerationParams.electrical_efficiency}
                    onChange={(e: any) => {
                      setCogenerationParams((prevState) => ({
                        ...prevState,
                        electrical_efficiency: handleNumericInput(e.target.value),
                      }));
                    }}
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Thermal efficiency"
                    type="number"
                    value={cogenerationParams.thermal_efficiency}
                    onChange={(e: any) => {
                      setCogenerationParams((prevState) => ({
                        ...prevState,
                        thermal_efficiency: handleNumericInput(e.target.value),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {nodeType === "Boiler" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="BOILER PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={boilerParams.name}
                  onChange={(e: any) => {
                    setBoilerParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                      generation_capacity: {
                        ...prevState.generation_capacity,
                      },
                    }));
                  }}
                />
              </div>
              <div className={modal_section_horizontal_css}>
                <div className={modal_left_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Generation capacity - min"
                    type="number"
                    value={boilerParams.generation_capacity.min}
                    onChange={(e: any) => {
                      setBoilerParams((prevState) => ({
                        ...prevState,
                        generation_capacity: {
                          ...prevState.generation_capacity,
                          min: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Generation capacity - max"
                    type="number"
                    value={boilerParams.generation_capacity.max}
                    onChange={(e: any) => {
                      setBoilerParams((prevState) => ({
                        ...prevState,
                        generation_capacity: {
                          ...prevState.generation_capacity,
                          max: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Generation capacity - design"
                    type="number"
                    value={boilerParams.generation_capacity.design}
                    onChange={(e: any) => {
                      setBoilerParams((prevState) => ({
                        ...prevState,
                        generation_capacity: {
                          ...prevState.generation_capacity,
                          design: handleNumericInput(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Generation capacity - units"
                    type="text"
                    value={boilerParams.generation_capacity.units}
                    onChange={(e: any) => {
                      setBoilerParams((prevState) => ({
                        ...prevState,
                        generation_capacity: {
                          ...prevState.generation_capacity,
                          units: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={boilerParams.num_units}
                    onChange={(e: any) => {
                      setBoilerParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Thermal efficiency"
                    type="number"
                    value={boilerParams.thermal_efficiency}
                    onChange={(e: any) => {
                      setBoilerParams((prevState) => ({
                        ...prevState,
                        thermal_efficiency: handleNumericInput(e.target.value),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <FlowsButtonLight
            className="w-1/5 capitalize font-normal  p-2"
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </FlowsButtonLight>
          <FlowsButtonDark
            className="w-1/5 ml-5 capitalize font-normal  p-2"
            onClick={() => {
              switch (nodeType) {
                case "Tank":
                  //closeNodeDetailsModal();
                  onUpdate(tankParams);
                  break;
                case "StaticMixing":
                case "Reactor":
                  //closeNodeDetailsModal();
                  onUpdate(staticMixingParams);
                  break;
                case "Aeration":
                  //closeNodeDetailsModal();
                  onUpdate(aerationParams);
                  break;
                case "Filtration":
                  //closeNodeDetailsModal();
                  onUpdate(filtrationParams);
                  break;
                case "ROMembrane":
                  //closeNodeDetailsModal();
                  onUpdate(roMembraneParams);
                  break;
                case "UVSystem":
                  //closeNodeDetailsModal();
                  onUpdate(uvSystemParams);
                  break;
                case "Reservoir":
                  //closeNodeDetailsModal();
                  onUpdate(reservoirParams);
                  break;
                case "Battery":
                  //closeNodeDetailsModal();
                  onUpdate(batteryParams);
                  break;
                case "Facility":
                  //closeNodeDetailsModal();
                  onUpdate(facilityParams);
                  break;
                case "Chlorination":
                case "Disinfection":
                  //closeNodeDetailsModal();
                  onUpdate(chlorinationParams);
                  break;
                case "Clarification":
                  //closeNodeDetailsModal();
                  onUpdate(clarificationParams);
                  break;
                case "Separation":
                  //closeNodeDetailsModal();
                  onUpdate(separationParams);
                  break;
                case "Thickening":
                  //closeNodeDetailsModal();
                  onUpdate(thickeningParams);
                  break;
                case "Screening":
                  //closeNodeDetailsModal();
                  onUpdate(screeningParams);
                  break;
                case "Conditioning":
                  //closeNodeDetailsModal();
                  onUpdate(conditioningParams);
                  break;
                case "Flaring":
                  //closeNodeDetailsModal();
                  onUpdate(flaringParams);
                  break;
                case "Network":
                  //closeNodeDetailsModal();
                  onUpdate(networkParams);
                  break;
                case "Junction":
                  //closeNodeDetailsModal();
                  onUpdate(junctionParams);
                  break;
                case "Valve":
                  //closeNodeDetailsModal();
                  onUpdate(valveParams);
                  break;
                case "PRV":
                  //closeNodeDetailsModal();
                  onUpdate(prvParams);
                  break;
                case "ModularUnit":
                  //closeNodeDetailsModal();
                  onUpdate(modularUnitParams);
                  break;
                case "Pump":
                  //closeNodeDetailsModal();
                  onUpdate(pumpParams);
                  break;
                case "Digestion":
                  //closeNodeDetailsModal();
                  onUpdate(digestionParams);
                  break;
                case "Cogeneration":
                  //closeNodeDetailsModal();
                  onUpdate(cogenerationParams);
                  break;
                case "Boiler":
                  //closeNodeDetailsModal();
                  onUpdate(boilerParams);
                  break;
              }
            }}
          >
            Update
          </FlowsButtonDark>
        </div>
      </Box>
    </Modal>
  );
};

export default NodeUpdateModal;

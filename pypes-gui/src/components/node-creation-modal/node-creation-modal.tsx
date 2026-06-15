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
  ScreeningParams,
  ConditioningParams,
  ThickeningParams,
  FlaringParams,
} from "../../interfaces";
import { useEffect, useState } from "react";
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
import ROMembraneNode from "../network/nodes/ro-membrane-node";

interface NodeCreationModalProps {
  open: boolean;
  onClose: () => void;
}

const NodeCreationModal: React.FC<NodeCreationModalProps> = ({
  open,
  onClose,
}) => {
  const { nodeType, onCreate } = useMainStore();

  const handleNumericInput = (val: string) => {
    if (val === "") return null;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed;
  };

  const [name, setName] = useState<string>("");

  const [tankParams, setTankParams] = useState<TankParams>({
    name: "",
    elevation: { value: null, units: "meters" },
    volume: { value: null, units: "cubic meters" },
    num_units: null,
  });

  const [staticMixingParams, setStaticMixingParams] = useState<StaticMixingParams>({
    name: "",
    volume: { value: null, units: "cubic meters" },
    flowrate: {
      design: null,
      max: null,
      min: null,
      units: "MGD",
    },
    dosing_rate: {},
    residence_time: {value: null, units: "hours"},
    pH: null,
    num_units: null,
  });

  const [reservoirParamas, setReservoirParams] = useState<ReservoirParams>({
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
    dosing_rate: { UVLight: {chemical: "UVLight", value: null, units: "W / square meter", mode: "rate"} },
    dosing_area: { UVLight: {chemical: "UVLight", value: null, units: "square meters", mode: "area"} },
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
    leakage: null,
    rte: null,
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
    diameter: null,
  });

  const [pumpParams, setPumpParams] = useState<PumpParams>({
    name: "",
    elevation: { value: null, units: "meters" },
    power_rating: { value: null, units: "horsepower" },
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
      num_units: null,
      electrical_efficiency: null,
      thermal_efficiency: null,
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
        num_units: null,
        thermal_efficiency: null,
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

  useEffect(() => {
    switch (nodeType) {
      case "Tank":
        setName(tankParams.name);
      case "StaticMixing":
        setName(staticMixingParams.name);
        break;
      case "Reservoir":
        setName(reservoirParamas.name);
        break;
      case "Aeration":
        setName(aerationParams.name);
        break;
      case "Filtration":
        setName(filtrationParams.name);
      case "ROMembrane":
        setName(roMembraneParams.name)
      case "UVSystem":
        setName(uvSystemParams.name);
        break;
      case "Battery":
        setName(batteryParams.name);
        break;
      case "Facility":
        setName(facilityParams.name);
        break;
      case "Chlorination":
        setName(chlorinationParams.name);
        break;
      case "Network":
        setName(networkParams.name);
      case "Junction":
        setName(junctionParams.name);
      case "ModularUnit":
        setName(modularUnitParams.name);
        break;
      case "Pump":
        setName(pumpParams.name);
        break;
      case "Digestion":
        setName(digestionParams.name);
        break;
      case "Cogeneration":
        setName(cogenerationParams.name);
        break;
      case "Boiler":
        setName(boilerParams.name);
        break;
      case "Clarification":
        setName(clarificationParams.name);
        break;
      case "Screening":
        setName(screeningParams.name);
        break;
      case "Conditioning":
        setName(conditioningParams.name);
        break;
      case "Thickening":
        setName(thickeningParams.name);
        break;
      case "Flaring":
        setName(flaringParams.name);
        break;
      default:
        setName("");
        break;
    }
  }, [
    tankParams.name,
    staticMixingParams.name,
    reservoirParamas.name,
    aerationParams.name,
    filtrationParams.name,
    roMembraneParams.name,
    uvSystemParams.name,
    batteryParams.name,
    facilityParams.name,
    chlorinationParams.name,
    networkParams.name,
    junctionParams.name,
    modularUnitParams.name,
    pumpParams.name,
    digestionParams.name,
    cogenerationParams.name,
    boilerParams.name,
    clarificationParams.name,
    screeningParams.name,
    conditioningParams.name,
    thickeningParams.name,
    flaringParams.name,
  ]);

  useEffect(() => {
    console.log("name", name);
  }, [name, setName]);

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
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Leakage"
                    type="number"
                    value={batteryParams.leakage}
                    onChange={(e: any) =>
                      setBatteryParams({
                        ...batteryParams,
                        leakage: handleNumericInput(e.target.value),
                      })
                    }
                  />
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="RTE"
                    type="number"
                    value={batteryParams.rte}
                    onChange={(e: any) =>
                      setBatteryParams({
                        ...batteryParams,
                        rte: handleNumericInput(e.target.value),
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
                        ...batteryParams,
                        discharge_rate_units: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {(nodeType === "Tank") && (
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
                      ...tankParams,
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
                        ...tankParams,
                        elevation: {
                          value: handleNumericInput(e.target.value),
                          units: tankParams.elevation?.units || "meters",
                        },
                      })
                    }
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Elevation units"
                    value={tankParams.elevation?.units || "meters"}
                    onChange={(e: any) =>
                      setTankParams({
                        ...tankParams,
                        elevation: {
                          value: tankParams.elevation?.value ?? null,
                          units: e.target.value,
                        },
                      })
                    }
                  >
                    <MenuItem value="meters">meters</MenuItem>
                    <MenuItem value="feet">feet</MenuItem>
                    <MenuItem value="inches">inches</MenuItem>
                  </FlowsSelect>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={tankParams.num_units}
                    onChange={(e: any) =>
                      setTankParams({
                        ...tankParams,
                        num_units: handleNumericInput(e.target.value),
                      })
                    }
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
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

        {(nodeType === "StaticMixing") && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="STATIC MIXING PARAMETERS" />
            <div className={modal_section_vertical_css}>
              <div className={modal_top_subsection_wrapper_css}>
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Name"
                  placeholder="Start typing..."
                  type="text"
                  value={staticMixingParams.name}
                  onChange={(e: any) => {
                    setStaticMixingParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                      flowrate: {
                        ...prevState.flowrate,
                      },
                      dosing_rate: {
                        ...prevState.dosing_rate,
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
                    value={staticMixingParams.flowrate.min}
                    onChange={(e: any) => {
                      setStaticMixingParams((prevState) => ({
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
                    value={staticMixingParams.flowrate.max}
                    onChange={(e: any) => {
                      setStaticMixingParams((prevState) => ({
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
                    value={staticMixingParams.flowrate.design}
                    onChange={(e: any) => {
                      setStaticMixingParams((prevState) => ({
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
                    value={staticMixingParams.flowrate.units}
                    onChange={(e: any) => {
                      setStaticMixingParams((prevState) => ({
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
                    value={staticMixingParams.num_units}
                    onChange={(e: any) => {
                      setStaticMixingParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Residence time"
                    type="number"
                    value={staticMixingParams.residence_time?.value}
                    onChange={(e: any) => {
                      setStaticMixingParams((prevState) => ({
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
                    value={staticMixingParams.residence_time?.units || "hours"}
                    onChange={(e: any) => {
                      setStaticMixingParams((prevState) => ({
                        ...prevState,
                        residence_time: {
                          value: prevState.volume?.value ?? null,
                          units: e.target.value,
                        },
                      }));
                    }}
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
                    label="Volume"
                    type="number"
                    value={staticMixingParams.volume?.value}
                    onChange={(e: any) =>
                      setStaticMixingParams({
                        ...staticMixingParams,
                        volume: {
                          value: handleNumericInput(e.target.value),
                          units: staticMixingParams.volume?.units || "cubic meters",
                        },
                      })
                    }
                  />

                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Volume units"
                    value={staticMixingParams.volume?.units || "cubic meters"}
                    onChange={(e: any) =>
                      setStaticMixingParams({
                        ...staticMixingParams,
                        volume: {
                          value: staticMixingParams.volume?.value ?? null,
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
                    label="pH"
                    type="number"
                    value={staticMixingParams.pH}
                    onChange={(e: any) =>
                      setStaticMixingParams({
                        ...staticMixingParams,
                        pH: handleNumericInput(e.target.value)
                      })
                    }
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Chemical dosed"
                    type="string"
                    value={Object.keys(staticMixingParams.dosing_rate || {})[0] || ""}
                    onChange={(e: any) => {
                      setStaticMixingParams((prevState) => ({
                        ...prevState,
                        dosing_rate: {
                          ...prevState.dosing_rate,
                          [e.target.value]: {
                            chemical: e.target.value,
                            value: prevState.dosing_rate[e.target.value]?.value ?? null,
                            units: prevState.dosing_rate[e.target.value]?.units ?? "mg / L",
                            mode: "rate",
                          },
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Dosing rate"
                    type="number"
                    value={Object.values(staticMixingParams.dosing_rate || {})[0]?.value || null}
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

        {(nodeType === "Junction") && (
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

        {(nodeType === "Network") && (
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
                      ...networkParams,
                      name: e.target.value,
                    })
                  }
                />
                <FlowsTextField
                  className={modal_textfield_css}
                  label="Number of units"
                  type="number"
                  value={networkParams.num_units}
                  onChange={(e: any) =>
                    setNetworkParams({
                      ...networkParams,
                      num_units: handleNumericInput(e.target.value),
                    })
                  }
                />
                <p className="m-5">
                  Add nodes and connections later!
                </p>
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
                <p className="m-5">
                  Add nodes and connections later!
                </p>
              </div>
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
                  value={reservoirParamas.name}
                  onChange={(e: any) =>
                    setReservoirParams({
                      ...reservoirParamas,
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
                    value={reservoirParamas.elevation?.value}
                    onChange={(e: any) =>
                      setReservoirParams({
                        ...reservoirParamas,
                        elevation: {
                          value: handleNumericInput(e.target.value),
                          units: reservoirParamas.elevation?.units || "meters",
                        },
                      })
                    }
                  />

                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Elevation units"
                    value={reservoirParamas.elevation?.units || "meters"}
                    onChange={(e: any) =>
                      setReservoirParams({
                        ...reservoirParamas,
                        elevation: {
                          value: reservoirParamas.elevation?.value ?? null,
                          units: e.target.value,
                        },
                      })
                    }
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
                    value={reservoirParamas.volume?.value}
                    onChange={(e: any) =>
                      setReservoirParams({
                        ...reservoirParamas,
                        volume: {
                          value: handleNumericInput(e.target.value),
                          units: reservoirParamas.volume?.units || "cubic meters",
                        },
                      })
                    }
                  />

                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Volume units"
                    value={reservoirParamas.volume?.units || "cubic meters"}
                    onChange={(e: any) =>
                      setReservoirParams({
                        ...reservoirParamas,
                        volume: {
                          value: reservoirParamas.volume?.value ?? null,
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
                    onChange={(e: any) => {
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

        {(nodeType === "ROMembrane") && (
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
                  onChange={(e: any) => {
                    setROMembraneParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                      flowrate: {
                        ...prevState.flowrate,
                      },
                      dosing_rate: {
                        ...prevState.dosing_rate,
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
                    value={roMembraneParams.flowrate.min}
                    onChange={(e: any) => {
                      setROMembraneParams((prevState) => ({
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
                    value={roMembraneParams.flowrate.max}
                    onChange={(e: any) => {
                      setROMembraneParams((prevState) => ({
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
                    value={roMembraneParams.flowrate.design}
                    onChange={(e: any) => {
                      setROMembraneParams((prevState) => ({
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
                    value={roMembraneParams.flowrate.units}
                    onChange={(e: any) => {
                      setROMembraneParams((prevState) => ({
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
                    label="Settling time"
                    type="number"
                    value={roMembraneParams.settling_time?.value}
                    onChange={(e: any) => {
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        settling_time: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.settling_time?.units || "minutes",
                        },
                      }));
                    }}
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
                    label="Permeability"
                    type="number"
                    value={roMembraneParams.permeability?.value}
                    onChange={(e: any) => {
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        permeability: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.permeability?.units || "LMH / bar",
                        },
                      }));
                    }}
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
                    onChange={(e: any) => {
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        selectivity: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.selectivity?.units || "m / s",
                        },
                      }));
                    }}
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
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Number of units"
                    type="number"
                    value={roMembraneParams.num_units}
                    onChange={(e: any) => {
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Volume"
                    type="number"
                    value={roMembraneParams.volume?.value}
                    onChange={(e: any) => {
                      setROMembraneParams((prevState) => ({
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
                    value={roMembraneParams.volume?.units || "cubic meters"}
                    onChange={(e: any) => {
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
                    label="Chemical dosed"
                    type="string"
                    value={Object.keys(roMembraneParams.dosing_rate || {})[0] || ""}
                    onChange={(e: any) => {
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        dosing_rate: {
                          ...prevState.dosing_rate,
                          [e.target.value]: {
                            chemical: e.target.value,
                            value: prevState.dosing_rate[e.target.value]?.value ?? null,
                            units: prevState.dosing_rate[e.target.value]?.units ?? "mg / L",
                            mode: "rate",
                          },
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Dosing rate"
                    type="number"
                    value={Object.values(roMembraneParams.dosing_rate || {})[0]?.value || null}
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

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Area"
                    type="number"
                    value={roMembraneParams.area?.value}
                    onChange={(e: any) => {
                      setROMembraneParams((prevState) => ({
                        ...prevState,
                        area: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.area?.units || "square meters",
                        },
                      }));
                    }}
                  />

                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Area units"
                    value={roMembraneParams.area?.units || "square meters"}
                    onChange={(e: any) => {
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
              </div>
            </div>
          </div>
        )}

        {(nodeType === "UVSystem") && (
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
                  onChange={(e: any) => {
                    setUVSystemParams((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                      flowrate: {
                        ...prevState.flowrate,
                      },
                      dosing_rate: {
                        ...prevState.dosing_rate,
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
                    value={uvSystemParams.flowrate.min}
                    onChange={(e: any) => {
                      setUVSystemParams((prevState) => ({
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
                    value={uvSystemParams.flowrate.max}
                    onChange={(e: any) => {
                      setUVSystemParams((prevState) => ({
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
                    value={uvSystemParams.flowrate.design}
                    onChange={(e: any) => {
                      setUVSystemParams((prevState) => ({
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
                    value={uvSystemParams.flowrate.units}
                    onChange={(e: any) => {
                      setUVSystemParams((prevState) => ({
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
                    label="Residence time"
                    type="number"
                    value={uvSystemParams.residence_time?.value}
                    onChange={(e: any) => {
                      setUVSystemParams((prevState) => ({
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
                    value={uvSystemParams.residence_time?.units || "hours"}
                    onChange={(e: any) => {
                      setUVSystemParams((prevState) => ({
                          ...prevState,
                          residence_time: {
                            value: prevState.residence_time?.value ?? null,
                            units: e.target.value,
                          },
                        }));
                    }}
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
                    onChange={(e: any) => {
                      setUVSystemParams((prevState) => ({
                        ...prevState,
                        num_units: handleNumericInput(e.target.value),
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Volume"
                    type="number"
                    value={uvSystemParams.volume?.value}
                    onChange={(e: any) => {
                      setUVSystemParams((prevState) => ({
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
                    value={uvSystemParams.volume?.units || "cubic meters"}
                    onChange={(e: any) => {
                      setUVSystemParams((prevState) => ({
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
                    label="Dosing intensity"
                    type="number"
                    value={uvSystemParams.dosing_rate["UVLight"]?.value || null}
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
                              value: handleNumericInput(e.target.value),
                              units: dosingRate[chemicalKey]?.units ?? "W / square meter",
                              mode: "rate",
                            },
                          },
                        };
                      });
                    }}
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
                    value={uvSystemParams.dosing_area["UVLight"]?.value || null}
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
                              value: handleNumericInput(e.target.value),
                              units: dosingArea[chemicalKey]?.units ?? "square meters",
                              mode: "area",
                            },
                          },
                        };
                      });
                    }}
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

        {(nodeType === "Filtration") && (
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
                      dosing_rate: {
                        ...prevState.dosing_rate,
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
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Settling time"
                    type="number"
                    value={filtrationParams.settling_time?.value}
                    onChange={(e: any) => {
                      setFiltrationParams((prevState) => ({
                        ...prevState,
                        settling_time: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.settling_time?.units || "minutes",
                        },
                      }));
                    }}
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
                    onChange={(e: any) => {
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
                    label="Chemical dosed"
                    type="string"
                    value={Object.keys(filtrationParams.dosing_rate || {})[0] || ""}
                    onChange={(e: any) => {
                      setFiltrationParams((prevState) => ({
                        ...prevState,
                        dosing_rate: {
                          ...prevState.dosing_rate,
                          [e.target.value]: {
                            chemical: e.target.value,
                            value: prevState.dosing_rate[e.target.value]?.value ?? null,
                            units: prevState.dosing_rate[e.target.value]?.units ?? "mg / L",
                            mode: "rate",
                          },
                        },
                      }));
                    }}
                  />

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
                    onChange={(e: any) => {
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
                    onChange={(e: any) => {
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
                    onChange={(e: any) => {
                      setFacilityParams((prevState) => ({
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
              </div>
            </div>
          </div>
        )}

        {nodeType === "Chlorination" && (
          <div className={modal_main_section_wrapper_css}>
            <SectionTitle title="CHLORINATION PARAMETERS" />
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
                      dosing_rate: {
                        ...prevState.dosing_rate,
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
                    onChange={(e: any) => {
                        setChlorinationParams((prevState) => ({
                          ...prevState,
                          residence_time: {
                            value: prevState.residence_time?.value ?? null,
                            units: e.target.value,
                          },
                        }));
                    }}
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
                    onChange={(e: any) => {
                      setChlorinationParams((prevState) => ({
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
                    label="Chemical dosed"
                    type="string"
                    value={Object.keys(chlorinationParams.dosing_rate || {})[0] || ""}
                    onChange={(e: any) => {
                      setChlorinationParams((prevState) => ({
                        ...prevState,
                        dosing_rate: {
                          ...prevState.dosing_rate,
                          [e.target.value]: {
                            chemical: e.target.value,
                            value: prevState.dosing_rate[e.target.value]?.value ?? null,
                            units: prevState.dosing_rate[e.target.value]?.units ?? "mg / L",
                            mode: "rate",
                          },
                        },
                      }));
                    }}
                  />

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
                        volume: {
                          value: handleNumericInput(e.target.value),
                          units: prevState.elevation?.units || "cubic meters",
                        },
                      }));
                    }}
                  />

                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Elevation units"
                    value={pumpParams.elevation?.units || "cubic meters"}
                    onChange={(e: any) => {
                      setPumpParams((prevState) => ({
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
                    <MenuItem value="inches">feet</MenuItem>
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
                          units: prevState.power_rating?.units || "horsepower",
                        }
                      }));
                    }}
                  />
                  <FlowsSelect
                    className={modal_textfield_css}
                    label="Power rating units"
                    value={pumpParams.power_rating?.units || "horsepower"}
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
                    onChange={(e: any) =>
                      setDigestionParams({
                        ...digestionParams,
                        volume: {
                          value: handleNumericInput(e.target.value),
                          units: digestionParams.volume?.units || "cubic meters",
                        },
                      })
                    }
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
                      flowrate: {
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
                      flowrate: {
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
              setName("");
            }}
          >
            Cancel
          </FlowsButtonLight>
          <FlowsButtonDark
            className="w-1/5 capitalize font-normal ml-5 p-2"
            disabled={name == ""}
            onClick={() => {
              switch (nodeType) {
                case "Tank":
                  onCreate(tankParams);
                  setTankParams({ name: "", elevation: null, volume: null, num_units: null });
                  break;
                case "StaticMixing":
                  onCreate(staticMixingParams);
                  setStaticMixingParams({ 
                    name: "", 
                    flowrate: {
                      design: null,
                      max: null,
                      min: null,
                      units: "MGD",
                    },
                    num_units: null,
                    volume: null, 
                    dosing_rate: {},
                    pH: null,
                    residence_time: null, 
                  });
                  break;
                case "Aeration":
                  onCreate(aerationParams);
                  setAerationParams({
                    name: "",
                    flowrate: {
                      design: null,
                      max: null,
                      min: null,
                      units: "MGD",
                    },
                    num_units: null,
                    volume: null,
                  });
                  break;
                case "Filtration":
                  onCreate(filtrationParams);
                  setFiltrationParams({
                    name: "",
                    flowrate: {
                      design: null,
                      max: null,
                      min: null,
                      units: "MGD",
                    },
                    num_units: null,
                    volume: null,
                    dosing_rate: {},
                    settling_time: null,
                  });
                case "ROMembrane":
                  onCreate(roMembraneParams);
                  setROMembraneParams({
                    name: "",
                    flowrate: {
                      design: null,
                      max: null,
                      min: null,
                      units: "MGD",
                    },
                    num_units: null,
                    volume: null,
                    dosing_rate: {},
                    area: null,
                    selectivity: null,
                    permeability: null,
                  });
                case "UVSystem":
                  onCreate(uvSystemParams);
                  setUVSystemParams({
                    name: "",
                    flowrate: {
                      design: null,
                      max: null,
                      min: null,
                      units: "MGD",
                    },
                    num_units: null,
                    volume: null,
                    residence_time: null,
                    dosing_rate: { UVLight: {chemical: "UVLight", value: null, units: "W / square meter", mode: "rate"} },
                    dosing_area: { UVLight: {chemical: "UVLight", value: null, units: "square meters", mode: "area"} }
                  });
                  break;
                case "Reservoir":
                  onCreate(reservoirParamas);
                  setReservoirParams({
                    name: "",
                    elevation: null,
                    volume: null,
                  });
                  break;
                case "Battery":
                  onCreate(batteryParams);
                  setBatteryParams({
                    name: "",
                    capacity: null,
                    capacity_units: "kWh",
                    charge_rate: null,
                    charge_rate_units: "kW",
                    discharge_rate: null,
                    discharge_rate_units: "kW",
                  });
                  break;
                case "Facility":
                  onCreate(facilityParams);
                  setFacilityParams({
                    name: "",
                    elevation: null,
                    flowrate: {
                      design: null,
                      max: null,
                      min: null,
                      units: "MGD",
                    },
                    nodes: [],
                    connections: [],
                  });
                  break;
                case "Chlorination":
                  onCreate(chlorinationParams);
                  setChlorinationParams({
                    name: "",
                    flowrate: {
                      design: null,
                      max: null,
                      min: null,
                      units: "MGD",
                    },
                    num_units: null,
                    volume: null,
                    dosing_rate: {},
                  });
                  break;
                case "Clarification":
                  onCreate(clarificationParams);
                  setClarificationParams({
                    name: "",
                    flowrate: {
                      design: null,
                      max: null,
                      min: null,
                      units: "MGD",
                    },
                    num_units: null,
                    volume: null,
                  });
                  break;
                case "Thickening":
                  onCreate(thickeningParams);
                  setThickeningParams({
                    name: "",
                    flowrate: {
                      design: null,
                      max: null,
                      min: null,
                      units: "MGD",
                    },
                    num_units: null,
                    volume: null,
                  });
                  break;
                case "Screening":
                  onCreate(screeningParams);
                  setScreeningParams({
                    name: "",
                    flowrate: {
                      design: null,
                      max: null,
                      min: null,
                      units: "MGD",
                    },
                    num_units: null,
                  });
                  break;
                case "Conditioning":
                  onCreate(conditioningParams);
                  setConditioningParams({
                    name: "",
                    flowrate: {
                      design: null,
                      max: null,
                      min: null,
                      units: "MGD",
                    },
                    num_units: null,
                  });
                  break;
                case "Flaring":
                  onCreate(flaringParams);
                  setFlaringParams({
                    name: "",
                    flowrate: {
                      design: null,
                      max: null,
                      min: null,
                      units: "MGD",
                    },
                    num_units: null,
                  });
                  break;
                case "Network":
                  onCreate(networkParams);
                  setNetworkParams({
                    name: "",
                    nodes: [],
                    connections: [],
                    num_units: null,
                  });
                  break;
                case "Junction":
                  onCreate(junctionParams);
                  setJunctionParams({
                    name: "",
                    diameter: null,
                  });
                  break;
                case "ModularUnit":
                  onCreate(modularUnitParams);
                  setModularUnitParams({
                    name: "",
                    nodes: [],
                    connections: [],
                    num_units: null,
                  });
                  break;
                case "Pump":
                  onCreate(pumpParams);
                  setPumpParams({
                    name: "",
                    elevation: null,
                    power_rating: null,
                    num_units: null,
                    flowrate: {
                      design: null,
                      max: null,
                      min: null,
                      units: "MGD",
                    },
                    pump_type: "VFD",
                  });
                  break;
                case "Digestion":
                  onCreate(digestionParams);
                  setDigestionParams({
                    name: "",
                    flowrate: {
                      design: null,
                      max: null,
                      min: null,
                      units: "MGD",
                    },
                    num_units: null,
                    volume: null,
                    digester_type: "Anaerobic",
                  });
                  break;
                case "Cogeneration":
                  onCreate(cogenerationParams);
                  setCogenerationParams({
                    name: "",
                    generation_capacity: {
                      design: null,
                      max: null,
                      min: null,
                      units: "MGD",
                    },
                    num_units: null,
                  });
                  break;
              }
            }}
          >
            Create
          </FlowsButtonDark>
        </div>
      </Box>
    </Modal>
  );
};

export default NodeCreationModal;

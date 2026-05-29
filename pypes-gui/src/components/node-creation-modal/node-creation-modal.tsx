import { Box, Button, MenuItem, Modal } from "@mui/material";
import {
  TankParams,
  FiltrationParams,
  Flowrate,
  AerationParams,
  ReservoirParams,
  BatteryParams,
  FacilityParams,
  ChlorinationParams,
  NetworkParams,
  PumpParams,
  DigestionParams,
  CogenerationParams,
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
  modal_first_button_css,
  modal_left_subsection_wrapper_css,
  modal_section_horizontal_css,
  modal_main_section_wrapper_css,
  modal_other_button_css,
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
    elevation: null,
    volume: null,
  });

  const [reservoirParamas, setReservoirParams] = useState<ReservoirParams>({
    name: "",
    elevation: null,
    volume: null,
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
    volume: null,
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
    volume: null,
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
      volume: null,
    });

  const [networkParams, setNetworkParams] = useState<NetworkParams>({
    name: "",
    nodes: [],
    connections: [],
  });

  const [pumpParams, setPumpParams] = useState<PumpParams>({
    name: "",
    elevation: null,
    horsepower: null,
    num_units: null,
    flowrate: {
      design: null,
      max: null,
      min: null,
      units: "MGD",
    },
    pump_type: "VFD",
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
    volume: null,
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
      volume: null,
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
    volume: null,
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
      case "StaticMixer":
        setName(tankParams.name);
        break;
      case "Reservoir":
        setName(reservoirParamas.name);
        break;
      case "Aeration":
        setName(aerationParams.name);
        break;
      case "Filtration":
      case "ROMembrane":
      case "UVSystem":
        setName(filtrationParams.name);
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
      case "Junction":
      case "ModularUnit":
        setName(networkParams.name);
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
    reservoirParamas.name,
    aerationParams.name,
    filtrationParams.name,
    batteryParams.name,
    facilityParams.name,
    chlorinationParams.name,
    networkParams.name,
    pumpParams.name,
    digestionParams.name,
    cogenerationParams.name,
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

        {(nodeType === "Tank" || nodeType === "StaticMixer") && (
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
                    value={tankParams.elevation}
                    onChange={(e: any) =>
                      setTankParams({
                        elevation: handleNumericInput(e.target.value),
                        volume: tankParams.volume,
                        name: tankParams.name,
                      })
                    }
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Volume"
                    type="number"
                    value={tankParams.volume}
                    onChange={(e: any) =>
                      setTankParams({
                        elevation: tankParams.elevation,
                        volume: handleNumericInput(e.target.value),
                        name: tankParams.name,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {(nodeType === "Network" ||
          nodeType === "Junction" ||
          nodeType === "ModularUnit") && (
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
                    })
                  }
                />
                <p className="m-5">
                  Network does not require parameters.<br></br>Add nodes and
                  conenctions later!
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
                      elevation: reservoirParamas.elevation,
                      volume: reservoirParamas.volume,
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
                    value={reservoirParamas.elevation}
                    onChange={(e: any) =>
                      setReservoirParams({
                        elevation: handleNumericInput(e.target.value),
                        volume: reservoirParamas.volume,
                        name: reservoirParamas.name,
                      })
                    }
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Volume"
                    type="number"
                    value={reservoirParamas.volume}
                    onChange={(e: any) =>
                      setReservoirParams({
                        elevation: reservoirParamas.elevation,
                        volume: handleNumericInput(e.target.value),
                        name: reservoirParamas.name,
                      })
                    }
                  />
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
                    value={aerationParams.volume}
                    onChange={(e: any) => {
                      setAerationParams((prevState) => ({
                        ...prevState,
                        volume: handleNumericInput(e.target.value),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {(nodeType === "Filtration" ||
          nodeType === "ROMembrane" ||
          nodeType === "UVSystem") && (
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
                    value={filtrationParams.volume}
                    onChange={(e: any) => {
                      setFiltrationParams((prevState) => ({
                        ...prevState,
                        volume: handleNumericInput(e.target.value),
                      }));
                    }}
                  />
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
                    value={clarificationParams.volume}
                    onChange={(e: any) => {
                      setClarificationParams((prevState) => ({
                        ...prevState,
                        volume: handleNumericInput(e.target.value),
                      }));
                    }}
                  />
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
                    value={thickeningParams.volume}
                    onChange={(e: any) => {
                      setThickeningParams((prevState) => ({
                        ...prevState,
                        volume: handleNumericInput(e.target.value),
                      }));
                    }}
                  />
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
                    value={facilityParams.elevation}
                    onChange={(e: any) => {
                      setFacilityParams((prevState) => ({
                        ...prevState,
                        elevation: handleNumericInput(e.target.value),
                      }));
                    }}
                  />
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
                    label="Volume"
                    type="number"
                    value={chlorinationParams.volume}
                    onChange={(e: any) => {
                      setChlorinationParams((prevState) => ({
                        ...prevState,
                        volume: handleNumericInput(e.target.value),
                      }));
                    }}
                  />
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
                    value={pumpParams.elevation}
                    onChange={(e: any) => {
                      setPumpParams((prevState) => ({
                        ...prevState,
                        elevation: handleNumericInput(e.target.value),
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Power rating"
                    type="number"
                    value={pumpParams.power_rating}
                    onChange={(e: any) => {
                      setPumpParams((prevState) => ({
                        ...prevState,
                        power_rating: handleNumericInput(e.target.value),
                      }));
                    }}
                  />

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
                    value={digestionParams.volume}
                    onChange={(e: any) => {
                      setDigestionParams((prevState) => ({
                        ...prevState,
                        volume: handleNumericInput(e.target.value),
                      }));
                    }}
                  />

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
                case "StaticMixer":
                  onCreate(tankParams);
                  setTankParams({ name: "", elevation: 0, volume: 0 });
                  break;
                case "Aeration":
                  onCreate(aerationParams);
                  setAerationParams({
                    name: "",
                    flowrate: {
                      design: 0,
                      max: 0,
                      min: 0,
                      units: "MGD",
                    },
                    num_units: 0,
                    volume: 0,
                  });
                  break;
                case "Filtration":
                case "ROMembrane":
                case "UVSystem":
                  onCreate(filtrationParams);
                  setFiltrationParams({
                    name: "",
                    flowrate: {
                      design: 0,
                      max: 0,
                      min: 0,
                      units: "MGD",
                    },

                    num_units: 0,
                    volume: 0,
                  });
                  break;
                case "Reservoir":
                  onCreate(reservoirParamas);
                  setReservoirParams({
                    name: "",
                    elevation: 0,
                    volume: 0,
                  });
                  break;
                case "Battery":
                  onCreate(batteryParams);
                  setBatteryParams({
                    name: "",
                    capacity: 0,
                    capacity_units: "kWh",
                    charge_rate: 0,
                    charge_rate_units: "kW",
                    discharge_rate: 0,
                    discharge_rate_units: "kW",
                  });
                  break;
                case "Facility":
                  onCreate(facilityParams);
                  setFacilityParams({
                    name: "",
                    elevation: 0,
                    flowrate: {
                      design: 0,
                      max: 0,
                      min: 0,
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
                      design: 0,
                      max: 0,
                      min: 0,
                      units: "MGD",
                    },
                    num_units: 0,
                    volume: 0,
                  });
                  break;
                case "Clarification":
                  onCreate(clarificationParams);
                  setClarificationParams({
                    name: "",
                    flowrate: {
                      design: 0,
                      max: 0,
                      min: 0,
                      units: "MGD",
                    },
                    num_units: 0,
                    volume: 0,
                  });
                  break;
                case "Thickening":
                  onCreate(thickeningParams);
                  setThickeningParams({
                    name: "",
                    flowrate: {
                      design: 0,
                      max: 0,
                      min: 0,
                      units: "MGD",
                    },
                    num_units: 0,
                    volume: 0,
                  });
                  break;
                case "Screening":
                  onCreate(screeningParams);
                  setScreeningParams({
                    name: "",
                    flowrate: {
                      design: 0,
                      max: 0,
                      min: 0,
                      units: "MGD",
                    },
                    num_units: 0,
                  });
                  break;
                case "Conditioning":
                  onCreate(conditioningParams);
                  setConditioningParams({
                    name: "",
                    flowrate: {
                      design: 0,
                      max: 0,
                      min: 0,
                      units: "MGD",
                    },
                    num_units: 0,
                  });
                  break;
                case "Flaring":
                  onCreate(flaringParams);
                  setFlaringParams({
                    name: "",
                    flowrate: {
                      design: 0,
                      max: 0,
                      min: 0,
                      units: "MGD",
                    },
                    num_units: 0,
                  });
                  break;
                case "Network":
                case "Junction":
                case "ModularUnit":
                  onCreate(networkParams);
                  setNetworkParams({
                    name: "",
                    nodes: [],
                    connections: [],
                  });
                  break;
                case "Pump":
                  onCreate(pumpParams);
                  setPumpParams({
                    name: "",
                    elevation: 0,
                    horsepower: 0,
                    num_units: 0,
                    flowrate: {
                      design: 0,
                      max: 0,
                      min: 0,
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
                      design: 0,
                      max: 0,
                      min: 0,
                      units: "MGD",
                    },
                    num_units: 0,
                    volume: 0,
                    digester_type: "Anaerobic",
                  });
                  break;
                case "Cogeneration":
                  onCreate(cogenerationParams);
                  setCogenerationParams({
                    name: "",
                    generation_capacity: {
                      design: 0,
                      max: 0,
                      min: 0,
                      units: "MGD",
                    },
                    num_units: 0,
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

import { NodeWithData } from "@/store/store";
import { Box, Button, MenuItem, Modal } from "@mui/material";
import TextField from "@mui/material/TextField";
import { trpc } from "@/utils/trpc";
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
import { useCallback, useEffect, useState } from "react";
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

interface NodeUpdateModalProps {
  open: boolean;
  onClose: () => void;
}

const NodeUpdateModal: React.FC<NodeUpdateModalProps> = ({ open, onClose }) => {
  const {
    nodeType,
    onUpdate,
    closeNodeDetailsModal,
    networkIdDataIngestionPage,
    selectedNodeId,
  } = useMainStore();
  const { data: node, refetch: nodeRefetch } =
    trpc.nodeRouter.nodedata.useQuery(
      { network_id: networkIdDataIngestionPage, node_id: selectedNodeId },
      { enabled: false }
    );
  const [currentNode, setCurrentNode] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        await nodeRefetch();
        if (node) {
          const parsedNode = JSON.parse(node.data);
          await setCurrentNode(parsedNode);
        } else {
          console.log("Node is null");
        }
      } catch (error) {
        console.error("Error fetching node data:", error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, node, nodeRefetch]);

  const [tankParams, setTankParams] = useState<TankParams>({
    name: "",
    elevation: 0,
    volume: 0,
  });

  const [reservoirParamas, setReservoirParams] = useState<ReservoirParams>({
    name: "",
    elevation: 10,
    volume: 0,
  });

  const [aerationParams, setAerationParams] = useState<AerationParams>({
    name: "",
    flowrate: {
      avg: 0,
      max: 0,
      min: 0,
      units: "MGD",
    },
    num_units: 0,
    volume: 0,
  });

  const [filtrationParams, setFiltrationParams] = useState<FiltrationParams>({
    name: "",
    flowrate: {
      avg: 0,
      max: 0,
      min: 0,
      units: "MGD",
    },

    num_units: 0,
    volume: 0,
  });

  const [batteryParams, setBatteryParams] = useState<BatteryParams>({
    name: "",
    capacity: 0,
    discharge_rate: 0,
  });

  const [facilityParams, setFacilityParams] = useState<FacilityParams>({
    name: "",
    elevation: 0,
    flowrate: {
      avg: 0,
      max: 0,
      min: 0,
      units: "MGD",
    },
    nodes: [],
    connections: [],
  });

  const [chlorinationParams, setChlorinationParams] =
    useState<ChlorinationParams>({
      name: "",
      flowrate: {
        avg: 0,
        max: 0,
        min: 0,
        units: "MGD",
      },
      num_units: 0,
      volume: 0,
    });

  const [networkParams, setNetworkParams] = useState<NetworkParams>({
    name: "",
    nodes: [],
    connections: [],
  });

  const [pumpParams, setPumpParams] = useState<PumpParams>({
    name: "",
    elevation: 0,
    horsepower: 0,
    num_units: 0,
    flowrate: {
      avg: 0,
      max: 0,
      min: 0,
      units: "MGD",
    },
    pump_type: "VFD",
  });

  const [digestionParams, setDigestionParams] = useState<DigestionParams>({
    name: "",
    flowrate: {
      avg: 0,
      max: 0,
      min: 0,
      units: "MGD",
    },
    num_units: 0,
    volume: 0,
    digester_type: "Anaerobic",
  });

  const [cogenerationParams, setCogenerationParams] =
    useState<CogenerationParams>({
      name: "",
      generation_capacity: {
        avg: 0,
        max: 0,
        min: 0,
        units: "MGD",
      },
      num_units: 0,
    });

  const [clarificationParams, setClarificationParams] =
    useState<ClarificationParams>({
      name: "",
      flowrate: {
        avg: 0,
        max: 0,
        min: 0,
        units: "MGD",
      },
      num_units: 0,
      volume: 0,
    });

  const [screeningParams, setScreeningParams] = useState<ScreeningParams>({
    name: "",
    flowrate: {
      avg: 0,
      max: 0,
      min: 0,
      units: "MGD",
    },
    num_units: 0,
  });

  const [conditioningParams, setConditioningParams] =
    useState<ConditioningParams>({
      name: "",
      flowrate: {
        avg: 0,
        max: 0,
        min: 0,
        units: "MGD",
      },
      num_units: 0,
    });

  const [thickeningParams, setThickeningParams] = useState<ThickeningParams>({
    name: "",
    flowrate: {
      avg: 0,
      max: 0,
      min: 0,
      units: "MGD",
    },
    num_units: 0,
    volume: 0,
  });

  const [flaringParams, setFlaringParams] = useState<FlaringParams>({
    name: "",
    flowrate: {
      avg: 0,
      max: 0,
      min: 0,
      units: "MGD",
    },
    num_units: 0,
  });

  const addDefaultValueFromDB = useCallback((currentNode: any, id: string) => {
    switch (currentNode["type"]) {
      case "Tank":
        setTankParams({
          name: id,
          elevation: currentNode["elevation"],
          volume: currentNode["volume (cubic meters)"],
        });
        break;
      case "Reservoir":
        setReservoirParams({
          name: id,
          elevation: currentNode.elevation,
          volume: currentNode["volume (cubic meters)"],
        });
        break;
      case "Aeration":
        setAerationParams({
          name: id,
          flowrate: {
            avg: currentNode.flowrate.avg,
            max: currentNode.flowrate.max,
            min: currentNode.flowrate.min,
            units: currentNode.flowrate.units,
          },
          num_units: currentNode["num_units"],
          volume: currentNode["volume (cubic meters)"],
        });
        break;
      case "Filtration":
        setFiltrationParams({
          name: id,
          flowrate: {
            avg: currentNode.flowrate.avg,
            max: currentNode.flowrate.max,
            min: currentNode.flowrate.min,
            units: currentNode.flowrate.units,
          },
          num_units: currentNode["num_units"],
          volume: currentNode["volume (cubic meters)"],
        });
        break;
      case "Battery":
        setBatteryParams({
          name: id,
          capacity: currentNode.capacity,
          discharge_rate: currentNode["discharge_rate"],
        });
        break;
      case "Facility":
        console.log("currentNode", currentNode);
        setFacilityParams({
          name: id,
          elevation: currentNode.elevation,
          flowrate: {
            avg: currentNode.flowrate.avg,
            max: currentNode.flowrate.max,
            min: currentNode.flowrate.min,
            units: currentNode.flowrate.units,
          },
          nodes: currentNode.nodes,
          connections: currentNode.connections,
        });
        break;
      case "Chlorination":
        setChlorinationParams({
          name: id,
          flowrate: {
            avg: currentNode.flowrate.avg,
            max: currentNode.flowrate.max,
            min: currentNode.flowrate.min,
            units: currentNode.flowrate.units,
          },
          num_units: currentNode["num_units"],
          volume: currentNode["volume (cubic meters)"],
        });
        break;
      case "Network":
        setNetworkParams({
          name: id,
          nodes: currentNode.nodes,
          connections: currentNode.connections,
        });
        break;
      case "Pump":
        setPumpParams({
          name: id,
          elevation: currentNode.elevation,
          horsepower: currentNode.horsepower,
          num_units: currentNode["num_units"],
          flowrate: {
            avg: currentNode.flowrate.avg,
            max: currentNode.flowrate.max,
            min: currentNode.flowrate.min,
            units: currentNode.flowrate.units,
          },
          pump_type: currentNode["pump_type"],
        });
        break;
      case "Digestion":
        setDigestionParams({
          name: id,
          flowrate: {
            avg: currentNode.flowrate.avg,
            max: currentNode.flowrate.max,
            min: currentNode.flowrate.min,
            units: currentNode.flowrate.units,
          },
          num_units: currentNode["num_units"],
          volume: currentNode["volume (cubic meters)"],
          digester_type: currentNode["digester_type"],
        });
        break;
      case "Cogeneration":
        setCogenerationParams({
          name: id,
          generation_capacity: {
            avg: currentNode.generation_capacity.avg,
            max: currentNode.generation_capacity.max,
            min: currentNode.generation_capacity.min,
            units: currentNode.generation_capacity.units,
          },
          num_units: currentNode["num_units"],
        });
        break;
      case "Clarification":
        setClarificationParams({
          name: id,
          flowrate: {
            avg: currentNode.flowrate.avg,
            max: currentNode.flowrate.max,
            min: currentNode.flowrate.min,
            units: currentNode.flowrate.units,
          },
          num_units: currentNode["num_units"],
          volume: currentNode["volume (cubic meters)"],
        });
        break;
      case "Screening":
        setScreeningParams({
          name: id,
          flowrate: {
            avg: currentNode.flowrate.avg,
            max: currentNode.flowrate.max,
            min: currentNode.flowrate.min,
            units: currentNode.flowrate.units,
          },
          num_units: currentNode["num_units"],
        });
        break;
      case "Conditioning":
        setConditioningParams({
          name: id,
          flowrate: {
            avg: currentNode.flowrate.avg,
            max: currentNode.flowrate.max,
            min: currentNode.flowrate.min,
            units: currentNode.flowrate.units,
          },
          num_units: currentNode["num_units"],
        });
        break;
      case "Thickening":
        setThickeningParams({
          name: id,
          flowrate: {
            avg: currentNode.flowrate.avg,
            max: currentNode.flowrate.max,
            min: currentNode.flowrate.min,
            units: currentNode.flowrate.units,
          },
          num_units: currentNode["num_units"],
          volume: currentNode["volume (cubic meters)"],
        });
        break;
      case "Flaring":
        setFlaringParams({
          name: id,
          flowrate: {
            avg: currentNode.flowrate.avg,
            max: currentNode.flowrate.max,
            min: currentNode.flowrate.min,
            units: currentNode.flowrate.units,
          },
          num_units: currentNode["num_units"],
        });
        break;
      default:
        break;
    }
  }, []);

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
                      discharge_rate: batteryParams.discharge_rate,
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
                        capacity: parseFloat(e.target.value),
                        discharge_rate: batteryParams.discharge_rate,
                        name: batteryParams.name,
                      })
                    }
                  />
                </div>
                <div className={modal_right_subsection_wrapper_css}>
                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Discharge rate"
                    type="number"
                    value={batteryParams.discharge_rate}
                    onChange={(e: any) =>
                      setBatteryParams({
                        capacity: batteryParams.capacity,
                        discharge_rate: parseFloat(e.target.value),
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
                        elevation: parseFloat(e.target.value),
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
                        volume: parseFloat(e.target.value),
                        name: tankParams.name,
                      })
                    }
                  />
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
                    })
                  }
                />
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
                        elevation: parseFloat(e.target.value),
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
                        volume: parseFloat(e.target.value),
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
                          min: parseFloat(e.target.value),
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
                          max: parseFloat(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - avg"
                    type="number"
                    value={aerationParams.flowrate.avg}
                    onChange={(e: any) => {
                      setAerationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          avg: parseFloat(e.target.value),
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
                        num_units: parseFloat(e.target.value),
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
                        volume: parseFloat(e.target.value),
                      }));
                    }}
                  />
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
                          min: parseFloat(e.target.value),
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
                          max: parseFloat(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - avg"
                    type="number"
                    value={filtrationParams.flowrate.avg}
                    onChange={(e: any) => {
                      setFiltrationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          avg: parseFloat(e.target.value),
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
                        num_units: parseFloat(e.target.value),
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
                        volume: parseFloat(e.target.value),
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
                          min: parseFloat(e.target.value),
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
                          max: parseFloat(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - avg"
                    type="number"
                    value={clarificationParams.flowrate.avg}
                    onChange={(e: any) => {
                      setClarificationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          avg: parseFloat(e.target.value),
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
                        num_units: parseFloat(e.target.value),
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
                        volume: parseFloat(e.target.value),
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
                          min: parseFloat(e.target.value),
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
                          max: parseFloat(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - avg"
                    type="number"
                    value={thickeningParams.flowrate.avg}
                    onChange={(e: any) => {
                      setThickeningParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          avg: parseFloat(e.target.value),
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
                        num_units: parseFloat(e.target.value),
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
                        volume: parseFloat(e.target.value),
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
                          min: parseFloat(e.target.value),
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
                          max: parseFloat(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - avg"
                    type="number"
                    value={facilityParams.flowrate.avg}
                    onChange={(e: any) => {
                      setFacilityParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          avg: parseFloat(e.target.value),
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
                        elevation: parseFloat(e.target.value),
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
                          min: parseFloat(e.target.value),
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
                          max: parseFloat(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - avg"
                    type="number"
                    value={chlorinationParams.flowrate.avg}
                    onChange={(e: any) => {
                      setChlorinationParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          avg: parseFloat(e.target.value),
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
                        num_units: parseFloat(e.target.value),
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
                        volume: parseFloat(e.target.value),
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
                          min: parseFloat(e.target.value),
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
                          max: parseFloat(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - avg"
                    type="number"
                    value={flaringParams.flowrate.avg}
                    onChange={(e: any) => {
                      setFlaringParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          avg: parseFloat(e.target.value),
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
                        num_units: parseFloat(e.target.value),
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
                          min: parseFloat(e.target.value),
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
                          max: parseFloat(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - avg"
                    type="number"
                    value={conditioningParams.flowrate.avg}
                    onChange={(e: any) => {
                      setConditioningParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          avg: parseFloat(e.target.value),
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
                        num_units: parseFloat(e.target.value),
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
                          min: parseFloat(e.target.value),
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
                          max: parseFloat(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - avg"
                    type="number"
                    value={screeningParams.flowrate.avg}
                    onChange={(e: any) => {
                      setScreeningParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          avg: parseFloat(e.target.value),
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
                        num_units: parseFloat(e.target.value),
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
                          min: parseFloat(e.target.value),
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
                          max: parseFloat(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - avg"
                    type="number"
                    value={pumpParams.flowrate.avg}
                    onChange={(e: any) => {
                      setPumpParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          avg: parseFloat(e.target.value),
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
                        num_units: parseFloat(e.target.value),
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
                        elevation: parseFloat(e.target.value),
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Horsepower"
                    type="number"
                    value={pumpParams.horsepower}
                    onChange={(e: any) => {
                      setPumpParams((prevState) => ({
                        ...prevState,
                        horsepower: parseFloat(e.target.value),
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
                          min: parseFloat(e.target.value),
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
                          max: parseFloat(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Flowrate - avg"
                    type="number"
                    value={digestionParams.flowrate.avg}
                    onChange={(e: any) => {
                      setDigestionParams((prevState) => ({
                        ...prevState,
                        flowrate: {
                          ...prevState.flowrate,
                          avg: parseFloat(e.target.value),
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
                        num_units: parseFloat(e.target.value),
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
                        volume: parseFloat(e.target.value),
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
                          min: parseFloat(e.target.value),
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
                          max: parseFloat(e.target.value),
                        },
                      }));
                    }}
                  />

                  <FlowsTextField
                    className={modal_textfield_css}
                    label="Generation capacity - avg"
                    type="number"
                    value={cogenerationParams.generation_capacity.avg}
                    onChange={(e: any) => {
                      setCogenerationParams((prevState) => ({
                        ...prevState,
                        generation_capacity: {
                          ...prevState.generation_capacity,
                          avg: parseFloat(e.target.value),
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
                        num_units: parseFloat(e.target.value),
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
                case "Aeration":
                  //closeNodeDetailsModal();
                  onUpdate(aerationParams);
                  break;
                case "Filtration":
                  //closeNodeDetailsModal();
                  onUpdate(filtrationParams);
                  break;
                case "Reservoir":
                  //closeNodeDetailsModal();
                  onUpdate(reservoirParamas);
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
                  //closeNodeDetailsModal();
                  onUpdate(chlorinationParams);
                  break;
                case "Clarification":
                  //closeNodeDetailsModal();
                  onUpdate(clarificationParams);
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

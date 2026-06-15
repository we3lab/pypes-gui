import { NodeWithData } from "@/store/store";
import { Box, Button, Modal, Slider } from "@mui/material";
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
  OptimizationBatteryParams,
  WasteWaterTankparams,
  BioSolidsTankParams,
  GasTankParams,
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

interface NodeoptimizeModalProps {
  open: boolean;
  onClose: () => void
}

const NodeOptimizeModal: React.FC<NodeoptimizeModalProps> = ({ open, onClose }) => {
  const {
    nodeType,
    onUpdate,
    closeNodeOptimizeModal,
    nodeOptimizeModalOpen,
    networkIdSimulateScenario,
    selectedNodeId,
  } = useMainStore();

  const handleNumericInput = (val: string) => {
    if (val === "") return null;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed;
  };

  const { data: node, refetch: nodeRefetch, isFetched: nodeFetched, isFetching: nodeFetching } =
    trpc.nodeRouter.nodedata.useQuery(
      { network_id: networkIdSimulateScenario, node_id: selectedNodeId },
      { enabled: false }
    );

  const {mutateAsync: optimizeNodeTrpc} = trpc.nodeRouter.optimize.useMutation();
  const [currentNode, setCurrentNode] = useState<any>({});
  const [modalType, setModalType] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await nodeRefetch();
        if (node) {
          const parsedNode = JSON.parse(node.data);
          setCurrentNode(parsedNode);
          if(parsedNode.type === "Battery") {
            setModalType("OptimizationBattery");
            return
          } else if(parsedNode.type === "Tank"){
            parsedNode["input_contents"].forEach((element: string) => {
              if(wastewater_types.includes(element)) {
                setModalType("WasteWaterTank");
              } else if(biosolid_types.includes(element)) {
                setModalType("BioSolidsTank");
                
              } else if(gas_types.includes(element)) {
                setModalType("GasTank");
                
              }
            });
            parsedNode["output_contents"].forEach((element: string) => {
              if(wastewater_types.includes(element)) {
                setModalType("WasteWaterTank");
                
              } else if(biosolid_types.includes(element)) {
                setModalType("BioSolidsTank");
                
              } else if(gas_types.includes(element)) {
                setModalType("GasTank");
                
              }
            });
          
          } else if(parsedNode.type === "Cogeneration" || parsedNode.type === "Reservoir") {
            setModalType("Other");
          } else {
            setModalType("Other");
          }
          
          
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

  useEffect(() => {
    if (!nodeOptimizeModalOpen) {
      setCurrentNode({});
      // nodeFetched = false;
    }
  }, [nodeOptimizeModalOpen]);

  const [optimizationBattery, setOptimizationBattery] = useState<OptimizationBatteryParams>({
    starting_state: null,
    leakage: null,
    SOC_range: [null, null],
    RTE: null,
    SOH: null,
  });

  const [wasteWaterTank, setWasteWaterTank] = useState<WasteWaterTankparams>({
    starting_state: null,
    hard_outflow_range: [null, null],
    soft_outflow_range: [null, null],
    soft_outflow_range_penalties: [null, null],
    wastewater_storage_penalty: null,
    max_storage_HRT: null,
    HRT_constraint_window_increment: null,
    flow_equalization_penalty: null,
    net_flow_variability_penalty: null,
  });

  const [bioSolidsTank, setBioSolidsTank] = useState<BioSolidsTankParams>({
    starting_state: null,
    max_storage_HRT: null,
    HRT_constraint_window_increment: null,
  });

  const [gasTank, setGasTank] = useState<GasTankParams>({
    starting_state: null,
    leakage: null,
  });  

  const wastewater_types = ["UntreatedSewage", "PrimaryEffluent", "SecondaryEffluent", "TertiaryEffluent"]
  const biosolid_types = ["FatOilGrease", "FoodWaste", "TWAS", "TPS", "ThickenedSludgeBlend"]
  const gas_types = ["Biogas", "NaturalGas"]
  const storage_types = ["Tank", "Battery"]

  const onOptimize = async () => {
    var optimization_params = {};
    switch (modalType) {
      case 'OptimizationBattery':
        optimization_params = optimizationBattery;
        break;
      case 'WasteWaterTank':
        optimization_params = wasteWaterTank;
        break;
      case 'BioSolidsTank':
        optimization_params = bioSolidsTank;
        break;
      case 'GasTank':
        optimization_params = gasTank;
        break;
      case 'Other':
        optimization_params = {};
      default:
        break;
    }

    console.log("opt_params",optimization_params);
    const resPromise = optimizeNodeTrpc({
      network_id: networkIdSimulateScenario,
      node_id: selectedNodeId,
      optimization_parameters: optimization_params,
      
    });

    resPromise.then((res) => {
      console.log(res);

    }
    );


  }


  const optimizeBatteryParams = () => {
    return (
          <div className={modal_top_subsection_wrapper_css}>
            <FlowsTextField
              className={modal_textfield_css}
              label="Starting State"
              type="number"
              value={optimizationBattery.starting_state}
              onChange={(e: any) =>
                setOptimizationBattery({
                  starting_state: handleNumericInput(e.target.value),
                  leakage: optimizationBattery.leakage,
                  SOC_range: optimizationBattery.SOC_range,
                  RTE: optimizationBattery.RTE,
                  SOH: optimizationBattery.SOH,
                })
              }
            />
            <FlowsTextField
              className={modal_textfield_css}
              label="Leakage"
              type="number"
              value={optimizationBattery.leakage}
              onChange={(e: any) =>
                setOptimizationBattery({
                  starting_state: optimizationBattery.starting_state,
                  leakage: handleNumericInput(e.target.value),
                  SOC_range: optimizationBattery.SOC_range,
                  RTE: optimizationBattery.RTE,
                  SOH: optimizationBattery.SOH,
                })
              }
            />
            {optimizationBattery.SOC_range && <FlowsTextField
              className={modal_textfield_css}
              label="SOC Range Start"
              type="number"
              value={optimizationBattery.SOC_range[0]}
              onChange={(e: any) =>
                setOptimizationBattery({
                  starting_state: optimizationBattery.starting_state,
                  leakage: optimizationBattery.leakage,
                  SOC_range: [handleNumericInput(e.target.value), optimizationBattery.SOC_range![1]],
                  RTE: optimizationBattery.RTE,
                  SOH: optimizationBattery.SOH,
                })
              }
            />}
            {optimizationBattery.SOC_range && <FlowsTextField
              className={modal_textfield_css}
              label="SOC Range End"
              type="number"
              value={optimizationBattery.SOC_range[1]}
              onChange={(e: any) =>
                setOptimizationBattery({
                  starting_state: optimizationBattery.starting_state,
                  leakage: optimizationBattery.leakage,
                  SOC_range: [optimizationBattery.SOC_range![0], handleNumericInput(e.target.value)],
                  RTE: optimizationBattery.RTE,
                  SOH: optimizationBattery.SOH,
                })
              }
            />}
            <FlowsTextField
              className={modal_textfield_css}
              label="RTE"
              type="number"
              value={optimizationBattery.RTE}
              onChange={(e: any) =>
                setOptimizationBattery({
                  starting_state: optimizationBattery.starting_state,
                  leakage: optimizationBattery.leakage,
                  SOC_range: optimizationBattery.SOC_range,
                  RTE: handleNumericInput(e.target.value),
                  SOH: optimizationBattery.SOH,
                })
              }
            />
            <FlowsTextField
              className={modal_textfield_css}
              label="SOH"
              type="number"
              value={optimizationBattery.SOH}
              onChange={(e: any) =>
                setOptimizationBattery({
                  starting_state: optimizationBattery.starting_state,
                  leakage: optimizationBattery.leakage,
                  SOC_range: optimizationBattery.SOC_range,
                  RTE: optimizationBattery.RTE,
                  SOH: handleNumericInput(e.target.value),
                })
              }
            />
          </div>
    );
  };

  const bioSolidsTankParams = () => {
    return (
      <div className={modal_top_subsection_wrapper_css}>
        <FlowsTextField
          className={modal_textfield_css}
          label="Starting State"
          type="number"
          value={bioSolidsTank.starting_state}
          onChange={(e: any) =>
            setBioSolidsTank({
              starting_state: handleNumericInput(e.target.value),
              max_storage_HRT: bioSolidsTank.max_storage_HRT,
              HRT_constraint_window_increment: bioSolidsTank.HRT_constraint_window_increment,
            })
          }
        />
        <FlowsTextField
          className={modal_textfield_css}
          label="Max storage HRT"
          type="number"
          value={bioSolidsTank.max_storage_HRT}
          onChange={(e: any) =>
            setBioSolidsTank({
              starting_state: bioSolidsTank.starting_state,
              max_storage_HRT: handleNumericInput(e.target.value),
              HRT_constraint_window_increment: bioSolidsTank.HRT_constraint_window_increment,
            })
          }
        />
        <FlowsTextField
          className={modal_textfield_css}
          label="HRT constraint window increment"
          type="number"
          value={bioSolidsTank.HRT_constraint_window_increment}
          onChange={(e: any) =>
            setBioSolidsTank({
              starting_state: bioSolidsTank.starting_state,
              max_storage_HRT: bioSolidsTank.max_storage_HRT,
              HRT_constraint_window_increment: handleNumericInput(e.target.value),
            })
          }
        />
      </div>
    );
  };

  const gasTankParams = () => {
    return (
      <div className={modal_top_subsection_wrapper_css}>
        <FlowsTextField
          className={modal_textfield_css}
          label="Starting State"
          type="number"
          value={gasTank.starting_state}
          onChange={(e: any) =>
            setGasTank({
              starting_state: handleNumericInput(e.target.value),
              leakage: gasTank.leakage,
            })
          }
        />
        <FlowsTextField
          className={modal_textfield_css}
          label="Leakage"
          type="number"
          value={gasTank.leakage}
          onChange={(e: any) =>
            setGasTank({
              starting_state: gasTank.starting_state,
              leakage: handleNumericInput(e.target.value),
            })
          }
        />
        
      </div>
    );
  };

  const wasteWaterTankParams = () => {
    return (
      <div className={modal_top_subsection_wrapper_css}>
        <FlowsTextField
          className={modal_textfield_css}
          label="Starting State"
          type="number"
          value={wasteWaterTank.starting_state}
          onChange={(e: any) =>
            setWasteWaterTank({
              starting_state: handleNumericInput(e.target.value),
              hard_outflow_range: wasteWaterTank.hard_outflow_range,
              soft_outflow_range: wasteWaterTank.soft_outflow_range,
              soft_outflow_range_penalties: wasteWaterTank.soft_outflow_range_penalties,
              wastewater_storage_penalty: wasteWaterTank.wastewater_storage_penalty,
              max_storage_HRT: wasteWaterTank.max_storage_HRT,
              HRT_constraint_window_increment: wasteWaterTank.HRT_constraint_window_increment,
              flow_equalization_penalty: wasteWaterTank.flow_equalization_penalty,
              net_flow_variability_penalty: wasteWaterTank.net_flow_variability_penalty,
            })
          }
        />
        <FlowsTextField
          className={modal_textfield_css}
          label="HRT constraint window increment"
          type="number"
          value={wasteWaterTank.HRT_constraint_window_increment}
          onChange={(e: any) =>
            setWasteWaterTank({
              starting_state: wasteWaterTank.starting_state,
              hard_outflow_range: wasteWaterTank.hard_outflow_range,
              soft_outflow_range: wasteWaterTank.soft_outflow_range,
              soft_outflow_range_penalties: wasteWaterTank.soft_outflow_range_penalties,
              wastewater_storage_penalty: wasteWaterTank.wastewater_storage_penalty,
              max_storage_HRT: wasteWaterTank.max_storage_HRT,
              HRT_constraint_window_increment: handleNumericInput(e.target.value),
              flow_equalization_penalty: wasteWaterTank.flow_equalization_penalty,
              net_flow_variability_penalty: wasteWaterTank.net_flow_variability_penalty,
            })
          }
        />
        <div>
          <FlowsTextField
          className={modal_textfield_css}
          label="Hard outflow range min"
          type="number"
          value={wasteWaterTank.hard_outflow_range[0]}
          onChange={(e: any) =>
            setWasteWaterTank({
              starting_state: wasteWaterTank.starting_state,
              hard_outflow_range: [handleNumericInput(e.target.value), wasteWaterTank.hard_outflow_range![1]],
              soft_outflow_range: wasteWaterTank.soft_outflow_range,
              soft_outflow_range_penalties: wasteWaterTank.soft_outflow_range_penalties,
              wastewater_storage_penalty: wasteWaterTank.wastewater_storage_penalty,
              max_storage_HRT: wasteWaterTank.max_storage_HRT,
              HRT_constraint_window_increment: wasteWaterTank.HRT_constraint_window_increment,
              flow_equalization_penalty: wasteWaterTank.flow_equalization_penalty,
              net_flow_variability_penalty: wasteWaterTank.net_flow_variability_penalty,
            })
          }
          />
          <FlowsTextField
            className={modal_textfield_css}
            label="Hard outflow range max"
            type="number"
            value={wasteWaterTank.hard_outflow_range[1]}
            onChange={(e: any) =>
              setWasteWaterTank({
                starting_state: wasteWaterTank.starting_state,
                hard_outflow_range: [wasteWaterTank.hard_outflow_range![0], handleNumericInput(e.target.value)],
                soft_outflow_range: wasteWaterTank.soft_outflow_range,
                soft_outflow_range_penalties: wasteWaterTank.soft_outflow_range_penalties,
                wastewater_storage_penalty: wasteWaterTank.wastewater_storage_penalty,
                max_storage_HRT: wasteWaterTank.max_storage_HRT,
                HRT_constraint_window_increment: wasteWaterTank.HRT_constraint_window_increment,
                flow_equalization_penalty: wasteWaterTank.flow_equalization_penalty,
                net_flow_variability_penalty: wasteWaterTank.net_flow_variability_penalty,
              })
            }
          />
        </div>
        <div>
          <FlowsTextField
          className={modal_textfield_css}
          label="Soft outflow range min"
          type="number"
          value={wasteWaterTank.soft_outflow_range[0]}
          onChange={(e: any) =>
            setWasteWaterTank({
              starting_state: wasteWaterTank.starting_state,
              hard_outflow_range: wasteWaterTank.hard_outflow_range,
              soft_outflow_range: [handleNumericInput(e.target.value), wasteWaterTank.soft_outflow_range![1]],
              soft_outflow_range_penalties: wasteWaterTank.soft_outflow_range_penalties,
              wastewater_storage_penalty: wasteWaterTank.wastewater_storage_penalty,
              max_storage_HRT: wasteWaterTank.max_storage_HRT,
              HRT_constraint_window_increment: wasteWaterTank.HRT_constraint_window_increment,
              flow_equalization_penalty: wasteWaterTank.flow_equalization_penalty,
              net_flow_variability_penalty: wasteWaterTank.net_flow_variability_penalty,
            })
          }
          />
          <FlowsTextField
            className={modal_textfield_css}
            label="Soft outflow range max"
            type="number"
            value={wasteWaterTank.soft_outflow_range[1]}
            onChange={(e: any) =>
              setWasteWaterTank({
                starting_state: wasteWaterTank.starting_state,
                hard_outflow_range: wasteWaterTank.hard_outflow_range,
                soft_outflow_range: [wasteWaterTank.soft_outflow_range![0], handleNumericInput(e.target.value)],
                soft_outflow_range_penalties: wasteWaterTank.soft_outflow_range_penalties,
                wastewater_storage_penalty: wasteWaterTank.wastewater_storage_penalty,
                max_storage_HRT: wasteWaterTank.max_storage_HRT,
                HRT_constraint_window_increment: wasteWaterTank.HRT_constraint_window_increment,
                flow_equalization_penalty: wasteWaterTank.flow_equalization_penalty,
                net_flow_variability_penalty: wasteWaterTank.net_flow_variability_penalty,
              })
            }
          />
        </div>
        <div>
          <FlowsTextField
          className={modal_textfield_css}
          label="Soft outflow range penalties min"
          type="number"
          value={wasteWaterTank.soft_outflow_range_penalties[0]}
          onChange={(e: any) =>
            setWasteWaterTank({
              starting_state: wasteWaterTank.starting_state,
              hard_outflow_range: wasteWaterTank.hard_outflow_range,
              soft_outflow_range: wasteWaterTank.soft_outflow_range,
              soft_outflow_range_penalties: [handleNumericInput(e.target.value), wasteWaterTank.soft_outflow_range_penalties![1]],
              wastewater_storage_penalty: wasteWaterTank.wastewater_storage_penalty,
              max_storage_HRT: wasteWaterTank.max_storage_HRT,
              HRT_constraint_window_increment: wasteWaterTank.HRT_constraint_window_increment,
              flow_equalization_penalty: wasteWaterTank.flow_equalization_penalty,
              net_flow_variability_penalty: wasteWaterTank.net_flow_variability_penalty,
            })
          }
          />
          <FlowsTextField
            className={modal_textfield_css}
            label="Soft outflow range penalties max"
            type="number"
            value={wasteWaterTank.soft_outflow_range_penalties[1]}
            onChange={(e: any) =>
              setWasteWaterTank({
                starting_state: wasteWaterTank.starting_state,
                hard_outflow_range: wasteWaterTank.hard_outflow_range,
                soft_outflow_range: wasteWaterTank.soft_outflow_range,
                soft_outflow_range_penalties: [wasteWaterTank.soft_outflow_range_penalties![0], handleNumericInput(e.target.value)],
                wastewater_storage_penalty: wasteWaterTank.wastewater_storage_penalty,
                max_storage_HRT: wasteWaterTank.max_storage_HRT,
                HRT_constraint_window_increment: wasteWaterTank.HRT_constraint_window_increment,
                flow_equalization_penalty: wasteWaterTank.flow_equalization_penalty,
                net_flow_variability_penalty: wasteWaterTank.net_flow_variability_penalty,
              })
            }
          />
        </div>
        <div>
          <FlowsTextField
          className={modal_textfield_css}
          label="Wastewater storage penalty"
          type="number"
          value={wasteWaterTank.wastewater_storage_penalty}
          onChange={(e: any) =>
            setWasteWaterTank({
              starting_state: wasteWaterTank.starting_state,
              hard_outflow_range: wasteWaterTank.hard_outflow_range,
              soft_outflow_range: wasteWaterTank.soft_outflow_range,
              soft_outflow_range_penalties: wasteWaterTank.soft_outflow_range_penalties,
              wastewater_storage_penalty: handleNumericInput(e.target.value),
              max_storage_HRT: wasteWaterTank.max_storage_HRT,
              HRT_constraint_window_increment: wasteWaterTank.HRT_constraint_window_increment,
              flow_equalization_penalty: wasteWaterTank.flow_equalization_penalty,
              net_flow_variability_penalty: wasteWaterTank.net_flow_variability_penalty,
            })
          }
          />
          <FlowsTextField
            className={modal_textfield_css}
            label="Max storage HRT"
            type="number"
            value={wasteWaterTank.max_storage_HRT}
            onChange={(e: any) =>
              setWasteWaterTank({
                starting_state: wasteWaterTank.starting_state,
                hard_outflow_range: wasteWaterTank.hard_outflow_range,
                soft_outflow_range: wasteWaterTank.soft_outflow_range,
                soft_outflow_range_penalties: wasteWaterTank.soft_outflow_range_penalties,
                wastewater_storage_penalty: wasteWaterTank.wastewater_storage_penalty,
                max_storage_HRT: handleNumericInput(e.target.value),
                HRT_constraint_window_increment: wasteWaterTank.HRT_constraint_window_increment,
                flow_equalization_penalty: wasteWaterTank.flow_equalization_penalty,
                net_flow_variability_penalty: wasteWaterTank.net_flow_variability_penalty,
              })
            }
            
          />
        </div>
        <FlowsTextField
          className={modal_textfield_css}
          label="Flow equalization penalty"
          type="number"
          value={wasteWaterTank.flow_equalization_penalty}
          onChange={(e: any) =>
            setWasteWaterTank({
              starting_state: wasteWaterTank.starting_state,
              hard_outflow_range: wasteWaterTank.hard_outflow_range,
              soft_outflow_range: wasteWaterTank.soft_outflow_range,
              soft_outflow_range_penalties: wasteWaterTank.soft_outflow_range_penalties,
              wastewater_storage_penalty: wasteWaterTank.wastewater_storage_penalty,
              max_storage_HRT: wasteWaterTank.max_storage_HRT,
              HRT_constraint_window_increment: wasteWaterTank.HRT_constraint_window_increment,
              flow_equalization_penalty: handleNumericInput(e.target.value),
              net_flow_variability_penalty: wasteWaterTank.net_flow_variability_penalty,
            })
          }
        />
        <FlowsTextField
          className={modal_textfield_css}
          label="Net flow variability penalty"
          type="number"
          value={wasteWaterTank.net_flow_variability_penalty}
          onChange={(e: any) =>
            setWasteWaterTank({
              starting_state: wasteWaterTank.starting_state,
              hard_outflow_range: wasteWaterTank.hard_outflow_range,
              soft_outflow_range: wasteWaterTank.soft_outflow_range,
              soft_outflow_range_penalties: wasteWaterTank.soft_outflow_range_penalties,
              wastewater_storage_penalty: wasteWaterTank.wastewater_storage_penalty,
              max_storage_HRT: wasteWaterTank.max_storage_HRT,
              HRT_constraint_window_increment: wasteWaterTank.HRT_constraint_window_increment,
              flow_equalization_penalty: wasteWaterTank.flow_equalization_penalty,
              net_flow_variability_penalty: handleNumericInput(e.target.value),
            })
          }
        />
      </div>
      
    )
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modal_box_css }}>
        {nodeFetching && modalType=="" ? (
          <div className="w-[100px] m-auto">
            <img
              src="/loading.gif"
              alt="loading"
              width={100}
              height={100}
            />
          </div>
        ) : modalType && nodeFetched && (
        <div>
        {
            <div className={modal_main_section_wrapper_css}>
              <SectionTitle title="BATTERY OPTIMIZE PARAMETERS" />
              <div className={modal_section_vertical_css}>
              {(() => {
                switch (modalType) {
                  case 'OptimizationBattery':
                    return optimizeBatteryParams();
                  case 'WasteWaterTank':
                    return wasteWaterTankParams();
                  case 'BioSolidsTank':
                    return bioSolidsTankParams();
                  case 'GasTank':
                    return gasTankParams();
                  case 'Other':
                    return <p>No parameters can be set for this type of node</p>;
                  default:
                    return <div></div>;
                }
              })()}
              </div>
            </div>
        }
        </div>
        )}
          <div className="flex justify-end">
            <Button
              className={modal_first_button_css}
              onClick={() => {
                onClose(), closeNodeOptimizeModal(), setModalType("");
              }}
            >
              Cancel
            </Button>
            <Button
              className={modal_other_button_css}
              onClick={() => {
                onOptimize();
              }}
            >
              Optimize
            </Button>
          </div>
          
      </Box>
    </Modal>
  );
};

export default NodeOptimizeModal;

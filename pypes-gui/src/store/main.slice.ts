import { StateCreator } from "zustand";
import { EdgeWithData, MainState, ModifyEdgeDTO } from "./store";

export interface MainSlice {
  openNodeCreationModal: (
    type: string,
    onCreate: (payload: any) => void
  ) => void;
  openTagCreationModal: (onCreateTag: (payload: any) => void) => void;
  openTagEditModal: (onEditTag: (payload: any) => void) => void;
  openEdgeCreationModal: (
    type: string,
    onCreateConnection: (payload: any) => void
  ) => void;
  openNodeUpdateModal: (type: string, onUpdate: (payload: any) => void) => void;
  openEdgeUpdateModal: (
    type: string,
    onUpdateConnection: (payload: any) => void
  ) => void;
  openNodeOptimizeModal: () => void;
  openEdgeDetailsModal: () => void;
  openNodeDetailsModal: () => void;
  openVersionHistoryModal: () => void;
  closeNodeCreationModal: () => void;
  closeTagCreationModal: () => void;
  closeTagEditModal: () => void;
  closeEdgeCreationModal: () => void;
  closeEdgeUpdateModal: () => void;
  closeNodeOptimizeModal: () => void;
  closeNodeUpdateModal: () => void;
  closeEdgeDetailsModal: () => void;
  closeNodeDetailsModal: () => void;
  closeVersionHistoryModal: () => void;

  nodeCreationModalOpen: boolean;
  tagCreationModalOpen: boolean;
  tagEditModalOpen: boolean;
  nodeUpdateModalOpen: boolean;
  nodeOptimizeModalOpen: boolean;
  nodeDetailsModalOpen: boolean;
  edgeCreationModalOpen: boolean;
  edgeUpdateModalOpen: boolean;
  edgeDetailsModalOpen: boolean;
  versionHistoryModalOpen: boolean;
  nodeType: string;
  connectionType: string;
  onCreate: (payload: any) => void;
  onUpdate: (payload: any) => void;
  onCreateConnection: (payload: any) => void;
  onCreateTag: (payload: any) => void;
  onEditTag: (payload: any) => void;
  onUpdateConnection: (payload: any) => void;
  setNetworkIdDataIngestionPage: (id: string) => void;
  setNetworkNameDataIngestionPage: (id: string) => void;
  setNetworkIdDataCleaningInterface: (id: string) => void;
  setNetworkNameDataCleaningInterface: (id: string) => void;
  setNetworkIdAnalyticsPortal: (id: string) => void;
  setNetworkIdSimulateScenario: (id: string) => void;
  setSelectedNodeId: (id: string) => void;
  selectedNodeId: string;
  setSelectedEdgeId: (id: string) => void;
  selectedEdgeId: string;
  networkIdDataIngestionPage: string;
  networkNameDataIngestionPage: string;
  networkIdDataCleaningInterface: string;
  networkNameDataCleaningInterface: string;
  networkIdAnalyticsPortal: string;
  networkIdSimulateScenario: string;
  parentId: string;
  setParentId: (id: string) => void;
  globalTagList: any[];
  addTagToGlobalTagList: (newTag: any) => void;
  setPreprocessingModalOpen: (status: boolean) => void;
  preprocessingModalOpen: boolean;
  setCleaningModalOpen: (status: boolean) => void;
  cleaningModalOpen: boolean;
  setImputationModalOpen: (status: boolean) => void;
  imputationModalOpen: boolean;
  setActivePage: (page_number: string) => void;
  activePage: string;
  setSimulationParametersModalOpen: (status: boolean) => void;
  simulationParametersModalOpen: boolean;
  setModelParameterModalOpen: (status: boolean) => void;
  modelParametersModalOpen: boolean;
  facilityIdDataCleaningPage: string;
  setFacilityIdDataCleaningPage: (id: string) => void;
  setFinalizeCleaningModalOpen: (status: boolean) => void;
  finalizeCleaningModalOpen: boolean;
  setMassBalancesModalOpen: (status: boolean) => void;
  massBalancesModalOpen: boolean;
}

const createMainSlice: StateCreator<MainSlice> = (set) => {
  return {
    nodeCreationModalOpen: false,
    tagCreationModalOpen: false,
    tagEditModalOpen: false,
    edgeCreationModalOpen: false,
    nodeUpdateModalOpen: false,
    nodeOptimizeModalOpen: false,
    edgeUpdateModalOpen: false,
    edgeDetailsModalOpen: false,
    nodeDetailsModalOpen: false,
    versionHistoryModalOpen: false,
    nodeType: "",
    connectionType: "",
    networkIdDataIngestionPage: "",
    networkNameDataIngestionPage: "",
    networkNameDataCleaningInterface:"",
    networkIdDataCleaningInterface: "",
    networkIdAnalyticsPortal: "",
    networkIdSimulateScenario: "",
    parentId: "world",
    globalTagList: [],
    selectedNodeId: "",
    selectedEdgeId: "",
    onCreate: (payload) => {},
    onUpdate: (payload) => {},
    onCreateConnection: (payload) => {},
    onUpdateConnection: (payload) => {},
    onCreateTag: (payload) => {},
    onEditTag: (payload) => {},
    preprocessingModalOpen: false,
    cleaningModalOpen: false,
    imputationModalOpen: false,
    activePage: "0",
    simulationParametersModalOpen: false,
    modelParametersModalOpen: false,
    facilityIdDataCleaningPage: "",
    finalizeCleaningModalOpen: false,
    massBalancesModalOpen: false,

    openNodeCreationModal: (type: string, onCreate: (payload: any) => void) => {
      set((state) => {
        return {
          nodeCreationModalOpen: true,
          nodeType: type,
          onCreate,
        };
      });
    },
    openTagCreationModal: (onCreateTag: (payload: any) => void) => {
      set((state) => {
        return {
          tagCreationModalOpen: true,
          onCreateTag,
        };
      });
    },
    openTagEditModal: (onEditTag: (payload: any) => void) => {
      set((state) => {
        return {
          tagEditModalOpen: true,
          onEditTag,
        };
      });
    },
    openEdgeCreationModal: (
      type: string,
      onCreateConnection: (payload: any) => void
    ) => {
      set((state) => {
        return {
          edgeCreationModalOpen: true,
          connectionType: type,
          onCreateConnection,
        };
      });
    },
    openNodeUpdateModal: (type: string, onUpdate: (payload: any) => void) => {
      set((state) => {
        return {
          nodeUpdateModalOpen: true,
          nodeType: type,
          onUpdate,
        };
      });
    },
    openNodeOptimizeModal: () => {
      set((state) => {
        return {
          nodeOptimizeModalOpen: true,
        };
      });
    },
    openEdgeUpdateModal: (
      type: string,
      onUpdateConnection: (payload: any) => void
    ) => {
      set((state) => {
        return {
          edgeUpdateModalOpen: true,
          connectionType: type,
          onUpdateConnection,
        };
      });
    },
    openEdgeDetailsModal: () => {
      set((state) => {
        return {
          edgeDetailsModalOpen: true,
        };
      });
    },
    openNodeDetailsModal: () => {
      set((state) => {
        return {
          nodeDetailsModalOpen: true,
        };
      });
    },
    openVersionHistoryModal: () => {
      set((state) => {
        return {
          versionHistoryModalOpen: true,
        };
      });
    },
    closeNodeCreationModal: () => {
      set((state) => {
        return {
          nodeCreationModalOpen: false,
        };
      });
    },
    closeTagCreationModal: () => {
      set((state) => {
        return {
          tagCreationModalOpen: false,
        };
      });
    },
    closeTagEditModal: () => {
      set((state) => {
        return {
          tagEditModalOpen: false,
        };
      });
    },
    closeEdgeCreationModal: () => {
      set((state) => {
        return {
          edgeCreationModalOpen: false,
        };
      });
    },
    closeNodeUpdateModal: () => {
      set((state) => {
        return {
          nodeUpdateModalOpen: false,
        };
      });
    },
    closeNodeOptimizeModal: () => {
      set((state) => {
        return {
          nodeOptimizeModalOpen: false,
        };
      });
    },
    closeEdgeUpdateModal: () => {
      set((state) => {
        return {
          edgeUpdateModalOpen: false,
        };
      });
    },
    closeEdgeDetailsModal: () => {
      set((state) => {
        return {
          edgeDetailsModalOpen: false,
        };
      });
    },
    closeNodeDetailsModal: () => {
      set((state) => {
        return {
          nodeDetailsModalOpen: false,
        };
      });
    },
    closeVersionHistoryModal: () => {
      set((state) => {
        return {
          versionHistoryModalOpen: false,
        };
      });
    },
    setNetworkIdDataIngestionPage: (id: string) => {
      set((state) => {
        return {
          networkIdDataIngestionPage: id,
        };
      });
    },

    setNetworkNameDataIngestionPage: (name: string) => {
      set((state) => {
        return {
          networkNameDataIngestionPage: name,
        };
      });
    },

    setNetworkNameDataCleaningInterface: (name: string) => {
      set((state) => {
        return {
          networkNameDataCleaningInterface: name,
        };
      });
    },

    setNetworkIdDataCleaningInterface: (id: string) => {
      set((state) => {
        return {
          networkIdDataCleaningInterface: id,
        };
      });
    },

    setNetworkIdAnalyticsPortal: (id: string) => {
      set((state) => {
        return {
          networkIdAnalyticsPortal: id,
        };
      });
    },

    setNetworkIdSimulateScenario: (id: string) => {
      set((state) => {
        return {
          networkIdSimulateScenario: id,
        };
      });
    },

    setParentId: (id: string) => {
      set((state) => {
        return {
          parentId: id,
        };
      });
    },

    setSelectedNodeId: (id: string) => {
      set((state) => {
        return {
          selectedNodeId: id,
        };
      });
    },

    setSelectedEdgeId: (id: string) => {
      set((state) => {
        return {
          selectedEdgeId: id,
        };
      });
    },

    addTagToGlobalTagList: (newTag: any) => {
      set((state) => {
        return {
          globalTagList: [...state.globalTagList, newTag],
        };
      });
    },

    setPreprocessingModalOpen: (status: boolean) => {
      set((state) => {
        return {
          preprocessingModalOpen: status,
        };
      });
    },

    setMassBalancesModalOpen: (status: boolean) => {
      set((state) => {
        return {
          massBalancesModalOpen: status,
        };
      });
    },

    setCleaningModalOpen: (status: boolean) => {
      set((state) => {
        return {
          cleaningModalOpen: status,
        };
      });
    },

    setImputationModalOpen: (status: boolean) => {
      set((state) => {
        return { imputationModalOpen: status };
      });
    },

    setActivePage: (page_number: string) => {
      set((state) => {
        return {
          activePage: page_number,
        };
      });
    },

    setSimulationParametersModalOpen: (status: boolean) => {
      set((state) => {
        return { simulationParametersModalOpen: status };
      });
    },

    setModelParameterModalOpen: (status: boolean) => {
      set((state) => {
        return { modelParametersModalOpen: status };
      });
    },

    setFacilityIdDataCleaningPage: (id: string) => {
      set((state) => {
        return { facilityIdDataCleaningPage: id };
      });
    },

    setFinalizeCleaningModalOpen: (status: boolean) => {
      set((state) => {
        return { finalizeCleaningModalOpen: status }
      });
    },
  };
};

export default createMainSlice;

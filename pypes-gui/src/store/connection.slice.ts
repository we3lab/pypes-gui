import { StateCreator } from "zustand";
import { EdgeWithData, MainState, ModifyEdgeDTO } from "./store";

export interface ConnectionSlice {
  edges: EdgeWithData[];
  setSelectedEdge: (id: string) => void;
  selectedEdge: EdgeWithData | null;
  setEdges: (edges: EdgeWithData[]) => void;
  modifyEdge: (payload: ModifyEdgeDTO) => void;
  deleteEdge: (id: string) => void;
} 

const createConnectionSlice: StateCreator<ConnectionSlice> = (set) => {
  return {
    edges: [],
    selectedEdge: null,
    setEdges: (edges) => {
      set((state: any) => {
        state.pushToHistory();
        return {
          edges,
        };
      });
    },
    modifyEdge: (payload) => {
      set((state: any) => {
        state.pushToHistory();
        const { id } = payload;
        const edges = state.edges;
        const edge = edges.find((edge) => edge.id === id || edge.edge.id === id);
        if (!edge) {
          return state;
        }
        const newEdge = {
          ...edge,
          data: {
            ...edge.data,
            ...payload.data,
          },
        };
        const newEdges = edges.map((edge) => {
          if (edge.id === id || edge.edge.id === id) {
            return newEdge;
          }
          return edge;
        });
        return {
          selectedEdge: state.selectedEdge ? {
            ...state.selectedEdge,
            data: {
              ...state.selectedEdge.data,
              ...payload.data,
            },
          } : null,
          edges: newEdges,
        };
      });
    },
    deleteEdge: (payload) => {
      set((state: any) => {
        state.pushToHistory();
        const edges = state.edges;
        const newEdges = edges.filter(
          (edge) => edge.id !== payload && edge.edge.id !== payload
        );
        return {
          edges: newEdges,
          selectedEdge: null,
        };
      });
    },
    setSelectedEdge: (id) => {
      set((state) => {
        return {
          selectedEdge:
            state.edges.find((edge) => edge.id === id || edge.edge.id === id) ??
            null,
          selectedNode: null,
        };
      });
    },
  };
};

export default createConnectionSlice;

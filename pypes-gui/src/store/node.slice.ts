import { StateCreator } from "zustand";
import { ModifyNodeDTO, NodeWithData } from "./store";

export interface NodeSlice {
  nodes: {
    [key: string]: NodeWithData[];
  }
  selectedNode: NodeWithData | null;
  setSelectedNode: (id: string | null) => void;
  addNode: (payload: NodeWithData) => void;
  addWorld: (payload: string) => void;
  deleteNode: (payload: NodeWithData) => void;
  modifyNode: (payload: ModifyNodeDTO) => void;
  resetNetwork: () => void;
} 

const createNodeSlice: StateCreator<any, [], [], NodeSlice> = (set) => {
  return {
    addWorld: (payload) => {
      set((state: any) => {
        return {
          nodes: {
            ...state.nodes,
            [payload]: [],
          },
        };
      });
    },
    setSelectedNode: (id) => {
      set((state: any) => {
        if (id === null) {
          return {
            selectedNode: null,
            selectedEdge: null,
          };
        }
        const nodes = state.nodes as Record<string, NodeWithData[]>;
        const node = Object.values(nodes)
          .flat()
          .find((node: NodeWithData) => node.id === id);
        return {
          selectedNode: node ?? null,
          selectedEdge: null,
        };
      });
    },
    addNode: (payload) => {
      set((state: any) => {
        const { parent } = payload.data;
        const nodes = state.nodes[parent] ?? [];
        const newNodes = [...nodes, payload];
        return {
          nodes: {
            ...state.nodes,
            [parent]: newNodes,
          },
        };
      });
    },
    modifyNode: (payload) => {
      set((state: any) => {
        const { id, parent } = payload;
        const nodes = state.nodes[parent] ?? [];
        
        const newNodes = nodes.map((node: NodeWithData) => {
          if (node.id === id) {
            return {
              ...node,
              node: payload.node ?? node.node,
              data: {
                ...node.data,
                tags: payload.data?.tags ?? node.data.tags,
              },
            };
          }
          return node;
        });
        return {
          selectedNode: state.selectedNode ? {
            ...state.selectedNode,
            node: payload.node ?? state.selectedNode.node,
            data: {
              ...state.selectedNode.data,
              tags: payload.data?.tags ?? state.selectedNode.data.tags,
            }
          } : null,
          nodes: {
            ...state.nodes,
            [parent]: newNodes,
          },
        };
      });
    },
    deleteNode: (payload) => {
      set((state: any) => {
        const { id } = payload;
        const { parent } = payload.data;
        const nodes = state.nodes[parent] ?? [];
        const newNodes = nodes.filter((node: NodeWithData) => node.id !== id);
        const edges = state.edges.filter(
          (edge: any) => edge.edge.source !== id && edge.edge.target !== id
        );
        return {
          selectedNode: null,
          selectedEdge: null,
          nodes: {
            ...state.nodes,
            [parent]: newNodes,
          },
          edges,
        };
      });
    },
    nodes: {
      world: [],
    },
    selectedNode: null,
    resetNetwork: () => {
      set(() => {
        return {
          selectedNode: null,
          nodes: {
            world: [],
          },
          edges: [],
        };
      });
    },
  };
};

export default createNodeSlice;

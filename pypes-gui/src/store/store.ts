import { Edge, Node } from "reactflow";
import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware';
import createConnectionSlice from "./connection.slice";
import createNodeSlice from "./node.slice";
import createMainSlice from "./main.slice";

export interface NodeData {
  tags: Record<string, any>;
  parent: string;
  additionalData?: Record<string, any>;
}

export interface NodeWithData {
  node: Node;
  id: string;
  data: NodeData;
}

export interface StateNode {
  id: string,
  type: string,
  data: object,
  position: {x: number, y: number},
}

export interface EdgeWithData {
  id: string;
  edge: Edge;
  type: string;
  data: {
    tags: Record<string, any>;
    parent?: string;
    additionalData?: Record<string, any>;
  }
}

export interface ModifyNodeDTO {
  id: string;
  parent: string;
  node?: Node;
  data?: {
    tags: Record<string, any>;
  };
}

export interface ModifyEdgeDTO {
  id: string;
  data: {
    tags: Record<string, any>;
  }
}

export type MainState = ReturnType<typeof createConnectionSlice> & ReturnType<typeof createNodeSlice> & ReturnType<typeof createMainSlice> & {
  history: { nodes: Record<string, NodeWithData[]>, edges: EdgeWithData[] }[];
  pushToHistory: () => void;
  undo: () => void;
};

const useStore = create<MainState>()(
  devtools(
    persist(
      (set, get, ...a) => ({
        ...createConnectionSlice(set, get, ...a),
        ...createNodeSlice(set, get, ...a),
        ...createMainSlice(set, get, ...a),
        history: [],
        pushToHistory: () => {
          const { nodes, edges } = get();
          const currentHistory = get().history;
          // Limit history to 50 steps
          const newHistory = [...currentHistory, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }].slice(-50);
          set({ history: newHistory });
        },
        undo: () => {
          const currentHistory = get().history;
          if (currentHistory.length === 0) return;
          
          const previousState = currentHistory[currentHistory.length - 1];
          const newHistory = currentHistory.slice(0, -1);
          
          set({
            nodes: previousState.nodes,
            edges: previousState.edges,
            history: newHistory,
            // Clear selections to avoid stale references
            selectedNode: null,
            selectedEdge: null,
          });
        },
      }),

      {
        name: 'main-storage',
        // Don't persist the history stack itself to keep localStorage clean
        partialize: (state) => {
          const { history, ...rest } = state;
          return rest;
        },
      }
    )
  )
)

export default useStore;

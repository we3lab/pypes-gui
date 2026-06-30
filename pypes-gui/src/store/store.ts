import { Edge, Node } from "reactflow";
import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware';
import createConnectionSlice from "./connection.slice";
import createNodeSlice from "./node.slice";
import createMainSlice from "./main.slice";

export interface NodeData {
  tags: Record<string, any>;
  virtual_tags?: Record<string, any>;
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
    virtual_tags?: Record<string, any>;
    parent?: string;
    additionalData?: Record<string, any>;
  }
}

export interface NetworkSnapshot {
  nodes: Record<string, NodeWithData[]>;
  edges: EdgeWithData[];
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
  history: NetworkSnapshot[];
  future: NetworkSnapshot[];
  pushToHistory: () => void;
  undo: () => void;
  redo: () => void;
};

const cloneNetworkSnapshot = (
  nodes: Record<string, NodeWithData[]>,
  edges: EdgeWithData[],
): NetworkSnapshot => JSON.parse(JSON.stringify({ nodes, edges }));

const useStore = create<MainState>()(
  devtools(
    persist(
      (set, get, ...a) => ({
        ...createConnectionSlice(set, get, ...a),
        ...createNodeSlice(set, get, ...a),
        ...createMainSlice(set, get, ...a),
        history: [],
        future: [],
        pushToHistory: () => {
          const { nodes, edges } = get();
          const currentHistory = get().history;
          // Limit history to 50 steps
          const newHistory = [...currentHistory, cloneNetworkSnapshot(nodes, edges)].slice(-50);
          set({ history: newHistory, future: [] });
        },
        undo: () => {
          const { nodes, edges, future } = get();
          const currentHistory = get().history;
          if (currentHistory.length === 0) return;
          
          const previousState = currentHistory[currentHistory.length - 1];
          const newHistory = currentHistory.slice(0, -1);
          const newFuture = [...future, cloneNetworkSnapshot(nodes, edges)].slice(-50);
          
          set({
            nodes: previousState.nodes,
            edges: previousState.edges,
            history: newHistory,
            future: newFuture,
            // Clear selections to avoid stale references
            selectedNode: null,
            selectedEdge: null,
          });
        },
        redo: () => {
          const { nodes, edges, history } = get();
          const currentFuture = get().future;
          if (currentFuture.length === 0) return;

          const nextState = currentFuture[currentFuture.length - 1];
          const newFuture = currentFuture.slice(0, -1);
          const newHistory = [...history, cloneNetworkSnapshot(nodes, edges)].slice(-50);

          set({
            nodes: nextState.nodes,
            edges: nextState.edges,
            history: newHistory,
            future: newFuture,
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
          const { history, future, ...rest } = state;
          return rest;
        },
      }
    )
  )
)

export default useStore;

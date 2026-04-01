import { Edge, Node } from "reactflow";
import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware';
import createConnectionSlice from "./connection.slice";
import createNodeSlice from "./node.slice";
import createMainSlice from "./main.slice";

export interface NodeData {
  tags: object;
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
    tags: object;
  }
}

export interface ModifyNodeDTO {
  id: string;
  parent: string;
  node?: Node;
  data?: {
    tags: object;
  };
}

export interface ModifyEdgeDTO {
  id: string;
  data: {
    tags: object;
  }
}

export type MainState = ReturnType<typeof createConnectionSlice> & ReturnType<typeof createNodeSlice> & ReturnType<typeof createMainSlice>;

const useStore = create<MainState>()(
  devtools(
    persist(
      (...a) => ({
        ...createConnectionSlice(...a),
        ...createNodeSlice(...a),
        ...createMainSlice(...a),
      }),

      {
        name: 'main-storage',
      }
    )
  )
)

export default useStore;

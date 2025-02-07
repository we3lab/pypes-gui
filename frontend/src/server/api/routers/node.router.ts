import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import addNodeHandler, {
  addNodeInputZ,
  addNodeOutputZ,
} from "../handlers/node/addNodeHandler";
import removeNodeHandler, {
  removeNodeInputZ,
  removeNodeOutputZ,
} from "../handlers/node/removeNodeHandler";
import updatePositionHandler, {
  updatePositionInputZ,
  updatePositionOutputZ,
} from "../handlers/node/updatePositionHandler";
import getNodeDataHandler, { getDataInputZ, getDataOutputZ} from "../handlers/node/getNodeDataHandler";
import updateNodeHandler, { updateNodeInputZ, updateNodeOutputZ } from "../handlers/node/updateNodeHandler";
import getNodesByParentHandler, { getNodesByParentInputZ, getNodesByParentOutputZ } from "../handlers/node/getNodesByParentHandler";
import optimizeNodeHandler, {optimizeNodeInputZ, optimizeNodeOutputZ} from "../handlers/node/optimizeNodeHandler";
import { get } from "http";
import GetAllNodesAndConnectionsHandler, { getAllNodesAndConnectionsInputZ, getAllNodesAndConnectionsOutputZ } from "../handlers/network/getAllNodesAndConnectionsHandler";

export const nodeRouter = router({
  add: publicProcedure
    .input(addNodeInputZ)
    .output(addNodeOutputZ)
    .mutation(({ input, ctx }) => {
      return addNodeHandler(input, ctx);
    }),

  remove: publicProcedure
    .input(removeNodeInputZ)
    .output(removeNodeOutputZ)
    .mutation(({ input, ctx }) => {
      return removeNodeHandler(input, ctx);
    }),
  
  nodedata: publicProcedure
    .input(getDataInputZ)
    .output(getDataOutputZ)
    .query(({ input, ctx }) => {
      return getNodeDataHandler(input, ctx);
    }),

  update: publicProcedure
    .input(updateNodeInputZ)
    .output(updateNodeOutputZ)
    .mutation(({ input, ctx }) => {
      return updateNodeHandler(input, ctx);
    }),
  
  updatepos: publicProcedure
    .input(updatePositionInputZ)
    .output(updatePositionOutputZ)
    .mutation(({ input, ctx }) => {
      return updatePositionHandler(input, ctx);
    }),
  
  getbyparent: publicProcedure
    .input(getNodesByParentInputZ)
    .output(getNodesByParentOutputZ)
    .query(({ input, ctx }) => {
      return getNodesByParentHandler(input, ctx);
    }),
  
  optimize: publicProcedure
    .input(optimizeNodeInputZ)
    .output(optimizeNodeOutputZ)
    .mutation(({ input, ctx }) => {
      return optimizeNodeHandler(input, ctx);
    }),
  
  getAllNodesAndConnections: publicProcedure
    .input(getAllNodesAndConnectionsInputZ)
    .output(getAllNodesAndConnectionsOutputZ)
    .query(({ input, ctx }) => {
      return GetAllNodesAndConnectionsHandler(input, ctx);
    }),

});

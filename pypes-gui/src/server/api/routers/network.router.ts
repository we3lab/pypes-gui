import createNetworkHandler, {
  createNetworksInputZ,
  createNetworksOutputZ,
} from "../handlers/network/createNetworkHandler";
import finalizeNetworkHandler, {
  finalizeNetworkInputZ,
  finalizeNetworkOutputZ,
} from "../handlers/network/finalizeNetworkHandler";
import listNetworksHandler, {
  listNetworksInputZ,
  listNetworksOutputZ,
} from "../handlers/network/listNetworksHandler";
import getNetworkHandler, {
  getNetworkInputZ,
  getNetworkOutputZ,
} from "../handlers/network/getNetworkHandler";
import getTemplatesHandler, {
  getTemplatesOutputZ,
} from "../handlers/network/getNetworkTemplates";
import resetNetworkHandler, {
  resetNetworkInputZ,
  resetNetworkOutputZ,
} from "../handlers/network/resetNetworkHandler";
import deleteNetworkHandler, {
  deleteNetworkInputZ,
  deleteNetworkOutputZ,
} from "../handlers/network/deleteNetworkHandler";
import saveCheckpointHandler, {
  saveCheckpointInputZ,
  saveCheckpointOutputZ,
} from "../handlers/network/saveCheckpointHandler";
import getVersionHistoryHandler, {
  getVersionHistoryInputZ,
  getVersionHistoryOutputZ,
} from "../handlers/network/getVersionHistory";
import restoreNetworkHandler, {
  restoreNetworkInputZ,
  restoreNetworkOutputZ,
} from "../handlers/network/restoreNetworkhandler";
import uploadNetworkHandler, {
  uploadNetworksInputZ,
  uploadNetworksOutputZ,
} from "../handlers/network/uploadNetworkHandler";
import { publicProcedure, router } from "../trpc";

export const networkRouter = router({
  list: publicProcedure
    .input(listNetworksInputZ)
    .output(listNetworksOutputZ)
    .query(({ input, ctx }) => {
      return listNetworksHandler(input, ctx);
    }),

  create: publicProcedure
    .input(createNetworksInputZ)
    .output(createNetworksOutputZ)
    .mutation(({ input, ctx }) => {
      return createNetworkHandler(input, ctx);
    }),

  finalize: publicProcedure
    .input(finalizeNetworkInputZ)
    .output(finalizeNetworkOutputZ)
    .mutation(({ input, ctx }) => {
      return finalizeNetworkHandler(input, ctx);
    }),

  get: publicProcedure
    .input(getNetworkInputZ)
    .output(getNetworkOutputZ)
    .query(({ input, ctx }) => {
      return getNetworkHandler(input, ctx);
    }),

  upload: publicProcedure
  .input(uploadNetworksInputZ)
  .output(uploadNetworksOutputZ)
  .mutation(({ input, ctx }) => {
    return uploadNetworkHandler(input, ctx);
  }),

  getTemplates: publicProcedure.output(getTemplatesOutputZ).query(({ ctx }) => {
    return getTemplatesHandler(ctx);
  }),

  reset: publicProcedure
    .input(resetNetworkInputZ)
    .output(resetNetworkOutputZ)
    .mutation(({ input, ctx }) => {
      return resetNetworkHandler(input, ctx);
    }),

  delete: publicProcedure
    .input(deleteNetworkInputZ)
    .output(deleteNetworkOutputZ)
    .mutation(({ input, ctx }) => {
      return deleteNetworkHandler(input, ctx);
    }),

  saveCheckpoint: publicProcedure
    .input(saveCheckpointInputZ)
    .output(saveCheckpointOutputZ)
    .query(({ input, ctx }) => {
      return saveCheckpointHandler(input, ctx);
    }),

  getVersionHistory: publicProcedure
    .input(getVersionHistoryInputZ)
    .output(getVersionHistoryOutputZ)
    .query(({ input, ctx }) => {
      return getVersionHistoryHandler(input, ctx);
    }),

  restore: publicProcedure
    .input(restoreNetworkInputZ)
    .output(restoreNetworkOutputZ)
    .query(({ input, ctx }) => {
      return restoreNetworkHandler(input, ctx);
    }),
});

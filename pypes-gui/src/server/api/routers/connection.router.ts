import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import addConnectionHandler, {
  addConnectionInputZ,
  addConnectionOutputZ,
} from "../handlers/connection/addConnectionHandler";
import removeConnectionHandler, { removeConnectionInputZ, removeConnectionOutputZ } from "../handlers/connection/removeConnectionHandler";
import updateConnectionHandler, {
  updateConnectionInputZ,
  updateConnectionOutputZ,
} from "../handlers/connection/updateConnectionHandler";
import getConnectionHandler, { getConnInputZ, getConnOutputZ } from "../handlers/connection/getConnectionHandler";
import getSimilarConnectionHandler, { getSimilarInputZ, getSimilarOutputZ } from "../handlers/connection/getSimilarConns";
import getAllSimilarConnHandler, { getAllSimilarInputZ, getAllSimilarOutputZ } from "../handlers/connection/getAllSimilarConnsHandler";

export const connectionRouter = router({
  add: publicProcedure
    .input(addConnectionInputZ)
    .output(addConnectionOutputZ)
    .mutation(({ input, ctx }) => {
      return addConnectionHandler(input, ctx);
    }),

  remove: publicProcedure
    .input(removeConnectionInputZ)
    .output(removeConnectionOutputZ)
    .mutation(({input, ctx}) => {
      return removeConnectionHandler(input, ctx);
    }),

  update: publicProcedure
    .input(updateConnectionInputZ)
    .output(updateConnectionOutputZ)
    .mutation(({ input, ctx }) => {
      return updateConnectionHandler(input, ctx);
    }),

  get: publicProcedure
    .input(getConnInputZ)
    .output(getConnOutputZ)
    .query(({ input, ctx }) => {
      return getConnectionHandler(input, ctx);
    }),
  
  getSimilar: publicProcedure
    .input(getSimilarInputZ)
    .output(getSimilarOutputZ)
    .query(({ input, ctx }) => {
      return getSimilarConnectionHandler(input, ctx);
    }),

  getAllSimilar: publicProcedure
    .input(getAllSimilarInputZ)
    .output(getAllSimilarOutputZ)
    .query(({ input, ctx }) => {
      return getAllSimilarConnHandler(input, ctx);
    }),
   
});

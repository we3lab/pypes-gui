import listFilesHandler, {
  listFilesInputZ,
  listFilesOutputZ,
} from "../handlers/file/listFilesHandler";
import previewFileHandler, {
  previewFileInputZ,
  previewFileOutputZ,
} from "../handlers/file/previewFileHandler";
import removeFileHandler, {
  removeFileInputZ,
  removeFileOutputZ,
} from "../handlers/file/removeFileHandler";
import uploadFilesHandler, {
  uploadFilesInputZ,
  uploadFilesOutputZ,
} from "../handlers/file/uploadFilesHandler";
import uploadRateScheduleHandler, {
  uploadRateScheduleInputZ,
  uploadRateScheduleOutputZ,
} from "../handlers/file/uploadRateSchedule";
import getFileLinkHandler, {
  getFileLinkInputZ,
  getFileLinkOutputZ,
} from "../handlers/file/getFileLinkHandler";
import { publicProcedure, router } from "../trpc";


import getBillingDatesHandler, {getBillingDatesInputZ, getBillingDatesOutputZ} from "../handlers/file/getBillingDatesHandler";
import getSCADATemplateHeadersHandler, { getSCADATemplateHeadersInputZ, getSCADATemplateHeadersOutputZ } from "../handlers/file/getSCADATemplateHeadersHandler";
import getRateSchedulesHandler, { getRateSchedulesInputZ, getRateSchedulesOutputZ } from "../handlers/file/getRateSchedulesHandler";
import getRateScheduleHandler, { getRateScheduleInputZ, getRateScheduleOutputZ } from "../handlers/file/getRateScheduleHandler";
import saveDataStreamHandler, { saveDataStreamInputZ, saveDataStreamOutputZ } from "../handlers/file/saveDataStreamHandler";
import getAllStreamsHandler, { getAllStreamsInputZ, getAllStreamsOutputZ } from "../handlers/file/getAllStreamsHandler";
import removeDataStreamHandler, { removeDataStreamInputZ, removeDataStreamOutputZ } from "../handlers/file/removeDataStream";
import saveSCADASetupHandler, { saveSCADASetupInputZ, saveSCADASetupOutputZ } from "../handlers/file/saveSCADASetupHandler";
import importEpanetHandler, { importEpanetInputZ, importEpanetOutputZ } from "../handlers/file/importEpanetHandler";

export const filesRouter = router({
  list: publicProcedure
    .input(listFilesInputZ)
    .output(listFilesOutputZ)
    .query(({ input, ctx }) => {
      return listFilesHandler(input, ctx);
    }),

  upload: publicProcedure
    .input(uploadFilesInputZ)
    .output(uploadFilesOutputZ)
    .mutation(({ input, ctx }) => {
      return uploadFilesHandler(input, ctx);
    }),

  importEpanet: publicProcedure
    .input(importEpanetInputZ)
    .output(importEpanetOutputZ)
    .mutation(({ input, ctx }) => {
      return importEpanetHandler(input, ctx);
    }),

  uploadRateSchedule: publicProcedure
    .input(uploadRateScheduleInputZ)
    .output(uploadRateScheduleOutputZ)
    .mutation(({ input, ctx }) => {
      return uploadRateScheduleHandler(input, ctx);
    }),

  preview: publicProcedure
    .input(previewFileInputZ)
    .output(previewFileOutputZ)
    .query(({ input, ctx }) => {
      return previewFileHandler(input, ctx);
    }),

  remove: publicProcedure
    .input(removeFileInputZ)
    .output(removeFileOutputZ)
    .mutation(({ input, ctx }) => {
      return removeFileHandler(input, ctx);
    }),
  
  getRateSchedules: publicProcedure
    .input(getRateSchedulesInputZ)
    .output(getRateSchedulesOutputZ)
    .query(({ input, ctx }) => {
      return getRateSchedulesHandler(input, ctx);
    }),
  

    getRateSchedule: publicProcedure
    .input(getRateScheduleInputZ)
    .output(getRateScheduleOutputZ)
    .query(({ input, ctx }) => {
      return getRateScheduleHandler(input, ctx);
    }),
  
  getBillingDates: publicProcedure
    .input(getBillingDatesInputZ)
    .output(getBillingDatesOutputZ)
    .query(({ input, ctx }) => {
      return getBillingDatesHandler(input, ctx);
    }),

  getSCADATemplateHeaders: publicProcedure
    .input(getSCADATemplateHeadersInputZ)
    .output(getSCADATemplateHeadersOutputZ)
    .query(({ input, ctx }) => {
      return getSCADATemplateHeadersHandler(input, ctx);
    }),

  saveDataStream: publicProcedure
    .input(saveDataStreamInputZ)
    .output(saveDataStreamOutputZ)
    .mutation(({ input, ctx }) => {
      return saveDataStreamHandler(input, ctx);
    }),

  getAllStreams: publicProcedure
    .input(getAllStreamsInputZ)
    .output(getAllStreamsOutputZ)
    .query(({ input, ctx }) => {
      return getAllStreamsHandler(input, ctx);
    }),
  
  removeDataStream: publicProcedure
    .input(removeDataStreamInputZ)
    .output(removeDataStreamOutputZ)
    .mutation(({ input, ctx }) => {
      return removeDataStreamHandler(input, ctx);
    }),

  saveSCADASetup: publicProcedure
    .input(saveSCADASetupInputZ)
    .output(saveSCADASetupOutputZ)
    .mutation(({ input, ctx }) => {
      return saveSCADASetupHandler(input, ctx);
    }),

  getFileLink: publicProcedure
    .input(getFileLinkInputZ)
    .output(getFileLinkOutputZ)
    .query(({ input, ctx }) => {
      return getFileLinkHandler(input, ctx);
    }),
  
});

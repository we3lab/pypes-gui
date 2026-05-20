import { publicProcedure, router } from "../trpc";
import addTagHandler, {
  addTagInputZ,
  addTagOutputZ,
} from "../handlers/tag/addTagHandler";
import removeTagHandler, {
  removeTagInputZ,
  removeTagOutputZ,
} from "../handlers/tag/removeTagHandler";
import getAllTagsFromNodeHandler, {
  getAllTagsFromNodeInputZ,
  getAllTagsFromNodeOutputZ,
} from "../handlers/tag/getAllTagsFromNodeHandler";
import getAllTagsFromConnHandler, {
  getAllTagsFromConnInputZ,
  getAllTagsFromConnOutputZ,
} from "../handlers/tag/getAllTagsFromConnHandler";
import getTagUnitsHandler, {
  getTagUnitsInputZ,
  getTagUnitsOutputZ,
} from "../handlers/tag/getTagUnitshandler";
import getAllNetworkTagsHandler, {
  getAllNetworkTagsInputZ,
  getAllNetworkTagsOutputZ,
} from "../handlers/tag/getAllNetworkTagsHandler";
import editTagHandler, {
  editTagInputZ,
  editTagOutputZ,
} from "../handlers/tag/editTagHandler";
import getTagParentInfoHandler, {
  getTagParentInfoInputZ,
  getTagParentInfoOutputZ,
} from "../handlers/tag/getTagParentInfoHandler";
import removeAllTagsHandler, {
  removeAllTagsInputZ,
  removeAllTagsOutputZ,
} from "../handlers/tag/removeAllTagshandler";
import updateVirtualTagHandler, {
  updateVirtualTagInputZ,
  updateVirtualTagOutputZ,
} from "../handlers/tag/updateVirtualTagsHandler";
import generateVirtualTagHandler, {
  generateVirtualTagInputZ,
  generateVirtualTagOutputZ,
} from "../handlers/tag/generateVirtualTagsHandler";
import getTagInfoHandler, { getTagInfoInputZ, getTagInfoOutputZ } from "../handlers/tag/getTagInfoHandler";

export const tagRouter = router({
  generateVirtualTags: publicProcedure
    .input(generateVirtualTagInputZ)
    .output(generateVirtualTagOutputZ)
    .query(({ input, ctx }) => {
      return generateVirtualTagHandler(input, ctx);
    }),
  updateVirtualTags: publicProcedure
    .input(updateVirtualTagInputZ)
    .output(updateVirtualTagOutputZ)
    .mutation(({ input, ctx }) => {
      return updateVirtualTagHandler(input, ctx);
    }),

  add: publicProcedure
    .input(addTagInputZ)
    .output(addTagOutputZ)
    .mutation(({ input, ctx }) => {
      return addTagHandler(input, ctx);
    }),

  get: publicProcedure
    .input(getTagInfoInputZ)
    .output(getTagInfoOutputZ)
    .query(({ input, ctx }) => {
      return getTagInfoHandler(input, ctx);
    }),

  remove: publicProcedure
    .input(removeTagInputZ)
    .output(removeTagOutputZ)
    .mutation(({ input, ctx }) => {
      return removeTagHandler(input, ctx);
    }),

  getAllFromNode: publicProcedure
    .input(getAllTagsFromNodeInputZ)
    .output(getAllTagsFromNodeOutputZ)
    .query(({ input, ctx }) => {
      return getAllTagsFromNodeHandler(input, ctx);
    }),

  getAllFromConn: publicProcedure
    .input(getAllTagsFromConnInputZ)
    .output(getAllTagsFromConnOutputZ)
    .query(({ input, ctx }) => {
      return getAllTagsFromConnHandler(input, ctx);
    }),

  gettagUits: publicProcedure
    .input(getTagUnitsInputZ)
    .output(getTagUnitsOutputZ)
    .query(({ input, ctx }) => {
      return getTagUnitsHandler(input, ctx);
    }),

  getAllFromNetwork: publicProcedure
    .input(getAllNetworkTagsInputZ)
    .output(getAllNetworkTagsOutputZ)
    .query(({ input, ctx }) => {
      return getAllNetworkTagsHandler(input, ctx);
    }),

  editTag: publicProcedure
    .input(editTagInputZ)
    .output(editTagOutputZ)
    .mutation(({ input, ctx }) => {
      return editTagHandler(input, ctx);
    }),

  getTagParentInfo: publicProcedure
    .input(getTagParentInfoInputZ)
    .output(getTagParentInfoOutputZ)
    .query(({ input, ctx }) => {
      return getTagParentInfoHandler(input, ctx);
    }),

  removeAll: publicProcedure
    .input(removeAllTagsInputZ)
    .output(removeAllTagsOutputZ)
    .mutation(({ input, ctx }) => {
      return removeAllTagsHandler(input, ctx);
    }),
});

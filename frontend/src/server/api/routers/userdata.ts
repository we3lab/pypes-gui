import { protectedProcedure, publicProcedure, router } from '../trpc';
import { emailinputZ,logininputZ,useroutputZ, loginoutputZ, outputZ, getUserDataHandler, addUserDataHandler, addemailoutputZ } from '../handlers/getDataHandlers';

export const userDataRouter = router({
    getUserData: publicProcedure
    .input(emailinputZ)
    .output(useroutputZ)
    .query(({ input }) => {
      return getUserDataHandler(input);
    }),

    addUserData: publicProcedure
    .input(logininputZ)
    .output(addemailoutputZ)
    .mutation(({ input }) => {
        return addUserDataHandler(input);
    }),
});
import { nodeRouter } from "./routers/node.router";
import { router } from "./trpc";
import { connectionRouter } from "./routers/connection.router";
import { filesRouter } from "./routers/files.router";
import { networkRouter } from "./routers/network.router";
import { tagRouter } from "./routers/tag.router";

export const appRouter = router({
  nodeRouter: nodeRouter,
  connectionRouter: connectionRouter,
  filesRouter: filesRouter,
  networkRouter: networkRouter,
  tagRouter: tagRouter,
});

export type AppRouter = typeof appRouter;

import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { scrapingRouter } from "./scraping";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  scraping: scrapingRouter,
});

// export type definition of API, never importing the server code on the client
export type AppRouter = typeof appRouter;

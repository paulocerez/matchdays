import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import scrapeMatchdayData from "~/server/scraping/barcelonaScraper";

export const scrapingRouter = createTRPCRouter({
  getMatchdays: publicProcedure.query(() => scrapeMatchdayData()),
  sayHello: publicProcedure.query(() => "Hello"),
});

// create a route that routes a request to the trpc instance

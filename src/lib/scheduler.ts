/**
 * File to schedule scraping process using croner library.
 */

import { upsertMatch } from "@/db/queries/match";
import { scrapeMatchdayData } from "@/utils/scraping/barcelonaScraper";
import { Cron } from "croner";

/** pattern: second (0-59), minute (0-59), hour (0-23), day of month (1-31), month (1-12, JAN-DEC), day of week (0-6, SUN-Mon)
 * Here: weekly pattern: 0 0 * * 0
 **/

export const scheduleScraping = () => {
  return Cron(
    "0 0 * * 0",
    {
      timezone: "Europe/Berlin",
    },
    async function () {
      const matches = await scrapeMatchdayData();
      for (const match of matches) {
        await upsertMatch(match);
      }
      console.log(
        "Matches have been scraped at and upserted at: " + new Date()
      );
    }
  );
};

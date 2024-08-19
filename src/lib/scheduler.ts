/**
 * File to schedule scraping process using croner library.
 */
import { upsertMatchday } from "@/db/queries/matches";
import scrapeMatchdayData from "@/utils/scraping/barcelonaScraper";
import { Cron } from "croner";
import { datetime } from "drizzle-orm/mysql-core";

/** pattern: second (0-59), minute (0-59), hour (0-23), day of month (1-31), month (1-12, JAN-DEC), day of week (0-6, SUN-Mon)
 * Here: weekly pattern: 0 0 * * 0
 **/

const timedScraper = Cron(
  "0 0 * * 0",
  {
    startAt: "2024-08-25T00:00:00",
    stopAt: "2025-12-01T00:00:00",
    timezone: "Europe/Berlin",
  },
  async function () {
    const matches = await scrapeMatchdayData();
    for (let i = 0; i < matches.length - 1; i++) {
      const matchData = {
        datetime: new Date(`${matches[i].date} ${matches[i].time}`),
        match: matches[i].teams,
        competition: matches[i].competition,
      };
      await upsertMatchday(matchData);
    }
    console.log("Matches have been scraped at and upserted at: " + new Date());
  }
);

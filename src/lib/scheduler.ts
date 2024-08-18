/**
 * File to schedule scraping process using croner library.
 */
import { Cron } from "croner";

const currentDatetime = new Date();

/** pattern: second (0-59), minute (0-59), hour (0-23), day of month (1-31), month (1-12, JAN-DEC), day of week (0-6, SUN-Mon)
 * Here: weekly pattern: 0 0 * * 0
 **/
Cron("0 0 * * 0", () => {
  console.log("Matches have been scraped at: " + currentDatetime);
});

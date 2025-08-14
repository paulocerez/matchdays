/**
 * File to schedule scraping process using croner library.
 */

import { upsertMatch, findMatchByIdentifier } from "@/db/queries";
import { generateMatchIdentifier } from "@/db/schema";
import scrapeMatchdayData from "@/utils/scraping/barcelonaScraper";
import { Cron } from "croner";

/** 
 * Cron pattern: second (0-59), minute (0-59), hour (0-23), day of month (1-31), month (1-12, JAN-DEC), day of week (0-6, SUN-Mon)
 */

export const scheduleScraping = () => {
  return Cron(
    "0 0 */7 * *", // Run every 7 days at midnight  
    {
      timezone: "Europe/Berlin",
    },
    async function () {
      console.log("Starting scheduled match scraping at:", new Date().toISOString());
      
      try {
        const matches = await scrapeMatchdayData();
        console.log(`Found ${matches.length} matches to process`);
        
        let inserted = 0;
        let updated = 0;
        
        for (const match of matches) {
          try {
            const result = await upsertMatch(match);
            if (result.id) {
              // Check if this was an insert or update by looking at the match identifier
              const existingMatch = await findMatchByIdentifier(
                generateMatchIdentifier(match.match, match.datetime)
              );
              
              if (existingMatch && existingMatch.id === result.id) {
                updated++;
              } else {
                inserted++;
              }
            }
          } catch (error) {
            console.error("Error processing match:", match, error);
          }
        }
        
        console.log(`Scraping completed: ${inserted} new matches inserted, ${updated} matches updated`);
      } catch (error) {
        console.error("Error during scheduled scraping:", error);
      }
    }
  );
};

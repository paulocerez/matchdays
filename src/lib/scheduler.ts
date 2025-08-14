/**
 * File to schedule scraping process using croner library.
 */

import { upsertMatch, findMatchByIdentifier } from "@/db/queries";
import { generateMatchIdentifier } from "@/db/schema";
import scrapeMatchdayData from "@/utils/scraping/barcelonaScraper";
import { Cron } from "croner";

/** 
 * Cron pattern: second (0-59), minute (0-59), hour (0-23), day of month (1-31), month (1-12, JAN-DEC), day of week (0-6, SUN-Mon)
 * 
 * Options:
 * "0 0 * * 0"     - Every Sunday at midnight (weekly)
 * "0 0 7 * *"   - Every 7 days at midnight
 * "0 0 1 * *"     - First day of every month at midnight
 * "0 0 * * 1"     - Every Monday at midnight
 */

export const scheduleScraping = () => {
  // Run every Sunday at midnight (weekly)
  const cronPattern = "0 0 * * 0";
  
  console.log(`Setting up scraper cron job with pattern: ${cronPattern}`);
  console.log(`Next run: ${Cron(cronPattern).nextRun()}`);
  
  return Cron(
    cronPattern,
    {
      timezone: "Europe/Berlin",
      name: "weekly-match-scraping", // Give it a name for easier management
    },
    async function () {
      const startTime = new Date();
      console.log("🚀 Starting scheduled match scraping at:", startTime.toISOString());
      
      try {
        // Scrape the matches
        const matches = await scrapeMatchdayData();
        console.log(`📊 Found ${matches.length} matches to process`);
        
        if (matches.length === 0) {
          console.log("⚠️  No matches found to process");
          return;
        }
        
        let inserted = 0;
        let updated = 0;
        let errors = 0;
        
        // Process each match
        for (const match of matches) {
          try {
            const result = await upsertMatch(match);
            if (result.id) {
              // Check if this was an insert or update
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
            console.error("❌ Error processing match:", match, error);
            errors++;
          }
        }
        
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        
        console.log(`✅ Scraping completed in ${duration}ms:`);
        console.log(`   📥 New matches inserted: ${inserted}`);
        console.log(`   🔄 Matches updated: ${updated}`);
        console.log(`   ❌ Errors: ${errors}`);
        console.log(`   📅 Next scheduled run: ${Cron(cronPattern).nextRun()}`);
        
      } catch (error) {
        console.error("💥 Critical error during scheduled scraping:", error);
        
        // Log error details for debugging
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
      }
    }
  );
};

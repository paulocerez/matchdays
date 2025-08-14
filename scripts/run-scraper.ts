#!/usr/bin/env tsx

import { upsertMatch, findMatchByIdentifier } from '../src/db/queries';
import { generateMatchIdentifier } from '../src/db/schema';
import scrapeMatchdayData from '../src/utils/scraping/barcelonaScraper';

async function runScraper() {
  console.log('🚀 Running Barcelona scraper manually...\n');
  
  try {
    const startTime = new Date();
    
    // Scrape matches
    const matches = await scrapeMatchdayData();
    console.log(`📊 Found ${matches.length} matches to process\n`);
    
    if (matches.length === 0) {
      console.log('⚠️  No matches found to process');
      return;
    }
    
    let inserted = 0;
    let updated = 0;
    let errors = 0;
    
    // Process each match
    for (const match of matches) {
      try {
        console.log(`Processing: ${match.match} on ${match.datetime.toLocaleDateString()}`);
        
        const result = await upsertMatch(match);
        
        if (result.id) {
          // Check if this was an insert or update
          const existingMatch = await findMatchByIdentifier(
            generateMatchIdentifier(match.match, match.datetime)
          );
          
          if (existingMatch && existingMatch.id === result.id) {
            console.log(`  ✅ Updated existing match (ID: ${result.id})`);
            updated++;
          } else {
            console.log(`  ✅ Inserted new match (ID: ${result.id})`);
            inserted++;
          }
        }
      } catch (error) {
        console.error(`  ❌ Error processing match:`, error);
        errors++;
      }
    }
    
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    
    console.log(`\n🎉 Scraping completed in ${duration}ms:`);
    console.log(`   📥 New matches inserted: ${inserted}`);
    console.log(`   🔄 Matches updated: ${updated}`);
    console.log(`   ❌ Errors: ${errors}`);
    
  } catch (error) {
    console.error('💥 Critical error during scraping:', error);
    process.exit(1);
  }
}

// Run the scraper
runScraper(); 
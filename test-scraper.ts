#!/usr/bin/env tsx

import scrapeMatchdayData from './src/utils/scraping/barcelonaScraper';
import { generateMatchIdentifier } from './src/db/schema';

async function testScraper() {
  console.log('🚀 Testing Barcelona Scraper...\n');
  
  try {
    // Test the scraper
    const matches = await scrapeMatchdayData();
    
    console.log(`✅ Successfully scraped ${matches.length} matches!\n`);
    
    // Display the matches
    matches.forEach((match, index) => {
      console.log(`Match ${index + 1}:`);
      console.log(`  Date & Time: ${match.datetime.toLocaleString()}`);
      console.log(`  Teams: ${match.match}`);
      console.log(`  Competition: ${match.competition}`);
      console.log(`  Identifier: ${match.matchIdentifier}`);
      console.log('');
    });
    
    // Test the match identifier generation
    console.log('🔍 Testing match identifier generation...');
    const testMatch = matches[0];
    if (testMatch) {
      const expectedIdentifier = generateMatchIdentifier(testMatch.match, testMatch.datetime);
      const isCorrect = testMatch.matchIdentifier === expectedIdentifier;
      console.log(`  Expected: ${expectedIdentifier}`);
      console.log(`  Actual:   ${testMatch.matchIdentifier}`);
      console.log(`  ✅ Match: ${isCorrect ? 'YES' : 'NO'}`);
    }
    
    // Check for unique identifiers
    const identifiers = matches.map(match => match.matchIdentifier);
    const uniqueIdentifiers = new Set(identifiers);
    console.log(`\n🔑 Unique identifiers: ${uniqueIdentifiers.size}/${matches.length}`);
    
    if (uniqueIdentifiers.size === matches.length) {
      console.log('✅ All identifiers are unique!');
    } else {
      console.log('❌ Some identifiers are duplicated!');
    }
    
    // Check date validity
    console.log('\n📅 Checking date validity...');
    const now = new Date();
    const validDates = matches.filter(match => !isNaN(match.datetime.getTime()));
    const futureMatches = matches.filter(match => match.datetime > now);
    
    console.log(`  Valid dates: ${validDates.length}/${matches.length}`);
    console.log(`  Future matches: ${futureMatches.length}/${matches.length}`);
    
    console.log('\n🎉 Scraper test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing scraper:', error);
    process.exit(1);
  }
}

// Run the test
testScraper(); 
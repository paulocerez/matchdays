import { NextResponse } from 'next/server';
import { upsertMatch } from '@/db/queries';
import scrapeMatchdayData from '@/utils/scraping/barcelonaScraper';

// Vercel Cron will call this endpoint weekly
export async function GET() {
  try {
    console.log('🚀 Vercel Cron: Starting weekly match scraping...');
    
    // Scrape matches
    const matches = await scrapeMatchdayData();
    console.log(`📊 Found ${matches.length} matches to process`);
    
    let inserted = 0;
    let updated = 0;
    
    // Process each match
    for (const match of matches) {
      try {
        await upsertMatch(match);
        inserted++;
      } catch (error) {
        console.error('Error processing match:', error);
      }
    }
    
    console.log(`✅ Scraping completed: ${inserted} matches processed`);
    
    return NextResponse.json({ 
      success: true,
      message: `Processed ${inserted} matches`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Error during scraping:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Scraping failed'
    }, { status: 500 });
  }
} 
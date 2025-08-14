import { NextRequest, NextResponse } from 'next/server';
import { upsertMatch } from '@/db/queries';
import scrapeMatchdayData from '@/utils/scraping/barcelonaScraper';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log('❌ Unauthorized cron request attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🚀 Vercel Cron: Starting weekly match scraping...');
    const matches = await scrapeMatchdayData();
    console.log(`📊 Found ${matches.length} matches to process`);
    
    let inserted = 0;
    let updated = 0;
    
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
import scrapeMatchdayData from "@/utils/scraping/barcelonaScraper";
import { NextRequest, NextResponse } from "next/server";

/**
 * Manual call to scrape matches from Onefootball
 * @param req
 * @returns
 */

export async function GET(request: NextRequest): Promise<NextResponse> {
  const result = await scrapeMatchdayData();
  console.log(result);
  return NextResponse.json({ data: result }, { status: 200 });
}

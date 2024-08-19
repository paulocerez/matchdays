import scrapeMatchdayData from "@/utils/scraping/barcelonaScraper";
import { NextRequest, NextResponse } from "next/server";

/**
 * Manual call to scrape matches from Onefootball
 * @param req
 * @returns
 */

export async function GET(req: NextRequest): Promise<NextResponse> {
  const result = await scrapeMatchdayData();
  console.log(result);
  return new NextResponse(JSON.stringify({ data: result }), { status: 200 });
}

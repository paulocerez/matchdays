import { upsertMatch } from "@/db/queries/match";
import scrapeMatchdayData from "@/utils/scraping/barcelonaScraper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const matches = await scrapeMatchdayData();
    const upsertedMatches = await Promise.all(matches.map(upsertMatch));
    return NextResponse.json(upsertedMatches, { status: 201 });
  } catch (error) {
    console.error("Error scraping and inserting matches:", error);
    return NextResponse.json(
      { error: "Error scraping and inserting matches" },
      { status: 500 }
    );
  }
}

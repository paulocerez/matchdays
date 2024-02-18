import scrapeMatchdayData from "@/server/scraping/barcelonaScraper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const matchdays = await scrapeMatchdayData();
    return NextResponse.json(matchdays, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/matchdays", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

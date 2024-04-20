import scrapeMatchdayData from "@/server/scraping/barcelonaScraper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // call the function to scrape the matchdays
    const matchdays = await scrapeMatchdayData();

    // insert matchdays into database
    // ...

    // call the function to insert events in calendar
    // ...

    console.log(matchdays);
    return NextResponse.json(matchdays, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/matchdays", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

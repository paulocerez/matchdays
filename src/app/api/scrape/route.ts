import scrapeMatchdayData from "@/utils/scraping/barcelonaScraper";
import { NextRequest, NextResponse } from "next/server";
import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

/**
 * Manual call to scrape matches from Onefootball
 * @param req
 * @returns
 */

export async function GET(req: NextRequest) {
  try {
    //
    const matchdays = await scrapeMatchdayData();

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
function dizzle(client: any, arg1: { schema: typeof schema }) {
  throw new Error("Function not implemented.");
}

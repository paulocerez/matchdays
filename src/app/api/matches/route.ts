import { getAllMatches, getFutureMatches } from "@/db/queries/match";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const matches = await getFutureMatches();
    return NextResponse.json(matches, { status: 200 });
  } catch (error) {
    console.error("Error retrieving matches:", error);
    return NextResponse.json(
      { error: "Error retrieving matches" },
      { status: 500 }
    );
  }
}

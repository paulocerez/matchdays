import { getAllMatches } from "@/db/queries/match";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const matches = await getAllMatches();
    return NextResponse.json(matches, { status: 200 });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

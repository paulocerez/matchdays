import { getFinishedMatches } from "@/db/queries";
import { computeAnalytics } from "@/lib/analytics";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const finished = await getFinishedMatches();
    return NextResponse.json(computeAnalytics(finished), { status: 200 });
  } catch (error) {
    console.error("Error computing stats:", error);
    return NextResponse.json(
      { error: "Error computing stats" },
      { status: 500 }
    );
  }
}

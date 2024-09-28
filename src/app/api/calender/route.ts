import { getFutureMatches } from "@/db/queries/matches";
import { createCalendarEvents } from "@/lib/createCalendarEvents";
import withErrorHandling from "@/utils/withErrorHandling";
import { NextRequest, NextResponse } from "next/server";

// route to insert array of events into GCAL
export async function insertInCalendarHandler(
  req: NextRequest
): Promise<NextResponse> {
  const matchdays = await getFutureMatches();
  const result = await createCalendarEvents(matchdays);
  return NextResponse.json(result, { status: 200 });
}

export const POST = withErrorHandling(insertInCalendarHandler);

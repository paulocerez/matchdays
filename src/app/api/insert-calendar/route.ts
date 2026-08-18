import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { syncMatchesToCalendar } from "@/lib/calendarSync";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth();

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const summary = await syncMatchesToCalendar(session.accessToken);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error syncing events to Google Calendar:", error);
    return NextResponse.json(
      { error: "Error syncing events to Google Calendar" },
      { status: 500 }
    );
  }
}

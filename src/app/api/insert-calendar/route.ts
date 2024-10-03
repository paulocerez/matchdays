import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { auth } from "../../../../auth";
import { getFutureMatches } from "@/db/queries/match";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth();

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const matches = await getFutureMatches();
    console.log(matches);

    const insertPromises = matches.map(async (match) => {
      const event = {
        summary: match.match,
        description: `Competition: ${match.competition}`,
        start: {
          dateTime: match.datetime.toISOString(),
          timeZone: "UTC",
        },
        end: {
          dateTime: new Date(
            match.datetime.getTime() + 2 * 60 * 60 * 1000
          ).toISOString(), // Assume 2 hours duration
          timeZone: "UTC",
        },
      };

      try {
        await calendar.events.insert({
          calendarId: "primary",
          requestBody: event,
        });
        return { success: true, match: match.match };
      } catch (error) {
        console.error(`Error inserting event for match ${match.match}:`, error);
        return { success: false, match: match.match, error };
      }
    });

    const results = await Promise.all(insertPromises);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error inserting events into Google Calendar:", error);
    return NextResponse.json(
      { error: "Error inserting events into Google Calendar" },
      { status: 500 }
    );
  }
}

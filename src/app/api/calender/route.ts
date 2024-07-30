import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

// route to insert array of events into GCAL
export async function POST(req: NextRequest) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });
    const calendar = google.calendar({ version: "v3", auth });
    const eventData = req.body;
    // const event = calendar.events.insert({
    //   auth: auth,
    //   calendarId: "primary",
    //   resource: eventData,
    // });
    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("The Calendar events could not be created");
    return NextResponse.json(
      {
        error:
          "The Calendar events could not be created due to an internal server error",
      },
      { status: 500 }
    );
  }
}

// https://developers.google.com/workspace/explore?filter=&discoveryUrl=https%3A%2F%2Fcalendar-json.googleapis.com%2F%24discovery%2Frest%3Fversion%3Dv3&discoveryRef=resources.events.methods.insert&operationId=calendar.events.insert

// Insert event in calendar

const event = 





const insertCalenderEvent = () => {
  calendar.events.insert({
    auth: auth,
    calendarId: "primary",
    resource: event,
  });
};

export default insertCalenderEvent;


// pages/api/add-event.ts

import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getSession } from "next-auth/react";

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    //

    const auth = new google.auth.OAuth2();
    // auth.setCredentials({ access_token: session.accessToken });

    const calendar = google.calendar({ version: "v3", auth });

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding event to Google Calendar", error);
    return new Response(
      JSON.stringify({
        message: "Error adding event to Google Calendar",
        error,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

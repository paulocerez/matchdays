// pages/api/add-event.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { google } from "googleapis";

const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret });
  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const accessToken = token.accessToken as string;

  //   calendar.events.insert({
  // 	auth: auth,
  // 	calendarId: 'primary',
  // 	resource: event,
  //   }, function(err, event) {
  // 	if (err) {
  // 	  console.log('There was an error contacting the Calendar service: ' + err);
  // 	  return;
  // 	}
  // 	console.log('Event created: %s', event.htmlLink);
  //   });

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const requestBody = await req.json();
  const event = requestBody.event;

  try {
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

import { google, calendar_v3 } from "googleapis";
import {
  getFutureMatches,
  setMatchCalendarSync,
  deleteMatch,
} from "@/db/queries";
import { generateMatchDayKey, SelectMatch } from "@/db/schema";

const MATCH_DURATION_MS = 2 * 60 * 60 * 1000; // assume 2 hours

export interface SyncSummary {
  inserted: number;
  updated: number;
  deleted: number;
  skipped: number;
  errors: { match: string; error: string }[];
}

function calendarClient(accessToken: string): calendar_v3.Calendar {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.calendar({ version: "v3", auth: oauth2Client });
}

function eventBody(match: SelectMatch): calendar_v3.Schema$Event {
  return {
    summary: match.match,
    description: `Competition: ${match.competition}`,
    start: { dateTime: match.datetime.toISOString(), timeZone: "UTC" },
    end: {
      dateTime: new Date(
        match.datetime.getTime() + MATCH_DURATION_MS
      ).toISOString(),
      timeZone: "UTC",
    },
  };
}

/**
 * Idempotently reconciles the stored future matches with the user's primary
 * Google Calendar:
 *  - no event yet          -> insert, store the event id + synced datetime
 *  - kickoff time changed  -> patch the existing event
 *  - unchanged             -> skip
 */
export async function syncMatchesToCalendar(
  accessToken: string
): Promise<SyncSummary> {
  const calendar = calendarClient(accessToken);
  const matches = await getFutureMatches();

  const summary: SyncSummary = {
    inserted: 0,
    updated: 0,
    deleted: 0,
    skipped: 0,
    errors: [],
  };

  for (const match of matches) {
    try {
      if (!match.googleEventId) {
        const res = await calendar.events.insert({
          calendarId: "primary",
          requestBody: eventBody(match),
        });
        if (res.data.id) {
          await setMatchCalendarSync(match.id, res.data.id, match.datetime);
          summary.inserted++;
        }
      } else if (
        !match.syncedDatetime ||
        match.syncedDatetime.getTime() !== match.datetime.getTime()
      ) {
        await calendar.events.patch({
          calendarId: "primary",
          eventId: match.googleEventId,
          requestBody: eventBody(match),
        });
        await setMatchCalendarSync(
          match.id,
          match.googleEventId,
          match.datetime
        );
        summary.updated++;
      } else {
        summary.skipped++;
      }
    } catch (error) {
      summary.errors.push({
        match: match.match,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return summary;
}

/**
 * Deletes calendar events (and their DB rows) for future matches that are no
 * longer present in the freshly scraped schedule, i.e. cancelled fixtures.
 * `scrapedDayKeys` is the set of `generateMatchDayKey` values from the scrape.
 */
export async function removeCancelledMatches(
  accessToken: string,
  scrapedDayKeys: Set<string>
): Promise<{ deleted: number; errors: { match: string; error: string }[] }> {
  const calendar = calendarClient(accessToken);
  const futureMatches = await getFutureMatches();

  let deleted = 0;
  const errors: { match: string; error: string }[] = [];

  for (const match of futureMatches) {
    const key = generateMatchDayKey(match.match, match.datetime);
    if (scrapedDayKeys.has(key)) continue;

    try {
      if (match.googleEventId) {
        await calendar.events.delete({
          calendarId: "primary",
          eventId: match.googleEventId,
        });
      }
      await deleteMatch(match.id);
      deleted++;
    } catch (error) {
      errors.push({
        match: match.match,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { deleted, errors };
}

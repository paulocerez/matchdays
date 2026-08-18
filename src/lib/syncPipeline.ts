import { upsertMatch } from "@/db/queries";
import { generateMatchDayKey } from "@/db/schema";
import scrapeMatchdayData from "@/utils/scraping/barcelonaScraper";
import { getValidGoogleAccessToken } from "@/lib/google";
import {
  removeCancelledMatches,
  syncMatchesToCalendar,
} from "@/lib/calendarSync";
import { mapWithConcurrency } from "@/lib/concurrency";

export interface PipelineResult {
  scraped: number;
  processed: number;
  calendar:
    | {
        inserted: number;
        updated: number;
        deleted: number;
        skipped: number;
        errors: { match: string; error: string }[];
      }
    | { error: string };
}

/**
 * The full weekly reconciliation shared by the Vercel cron and the manual
 * "sync now" trigger: fetch the schedule, upsert to the DB, then reconcile the
 * connected Google Calendar (insert new, update changed, delete cancelled).
 */
export async function runMatchSync(): Promise<PipelineResult> {
  // 1. Fetch the current schedule.
  const scraped = await scrapeMatchdayData();

  // 2. Persist: compare against stored matches and upsert.
  const scrapedDayKeys = new Set<string>();
  for (const match of scraped) {
    scrapedDayKeys.add(generateMatchDayKey(match.match, match.datetime));
  }

  const upsertResults = await mapWithConcurrency(scraped, 10, async (match) => {
    try {
      await upsertMatch(match);
      return true;
    } catch (error) {
      console.error("Error upserting match:", error);
      return false;
    }
  });
  const processed = upsertResults.filter(Boolean).length;

  // 3. Reconcile Google Calendar (single connected account).
  let calendar: PipelineResult["calendar"];
  try {
    const accessToken = await getValidGoogleAccessToken();

    // Remove cancelled fixtures first so they don't linger on the calendar.
    const removal = await removeCancelledMatches(accessToken, scrapedDayKeys);
    const sync = await syncMatchesToCalendar(accessToken);

    calendar = {
      inserted: sync.inserted,
      updated: sync.updated,
      deleted: removal.deleted,
      skipped: sync.skipped,
      errors: [...removal.errors, ...sync.errors],
    };
    console.log(
      `📅 Calendar sync: +${sync.inserted} ~${sync.updated} -${removal.deleted} (skipped ${sync.skipped})`
    );
  } catch (error) {
    // Calendar failures shouldn't fail the whole scrape — the DB is updated.
    console.error("⚠️ Calendar sync skipped:", error);
    calendar = { error: error instanceof Error ? error.message : String(error) };
  }

  return { scraped: scraped.length, processed, calendar };
}

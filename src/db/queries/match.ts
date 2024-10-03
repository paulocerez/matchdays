import { eq, and, sql, gt } from "drizzle-orm";
import { db } from "../db";
import handleDatabaseOperation from "../operations/handleDatabaseOperation";
import { InsertMatch, matches, SelectMatch } from "../schema/teams";

/**
 *
 * @returns an array of all matches in the matches table.
 */
export async function getAllMatches(): Promise<SelectMatch[]> {
  return handleDatabaseOperation(async () => {
    const result = await db.select().from(matches);
    console.log(result);
    return result as SelectMatch[];
  }, "Error fetching all matches");
}

/**
 * Fetches all matches that have a datetime ahead of the current datetime.
 * @returns an array of future matches.
 */

export async function getFutureMatches(): Promise<SelectMatch[]> {
  return handleDatabaseOperation(async () => {
    const currentDatetime = new Date();
    const result = await db
      .select()
      .from(matches)
      .where(gt(matches.datetime, currentDatetime))
      .orderBy(matches.datetime);
    return result as SelectMatch[];
  }, "Error fetching future matches");
}

export async function findMatch(
  datetime: Date,
  match: string
): Promise<SelectMatch | null> {
  const result = await db
    .select()
    .from(matches)
    .where(and(eq(matches.datetime, datetime), eq(matches.match, match)))
    .execute();

  return result.length > 0 ? result[0] : null;
}

export async function insertMatch(match: InsertMatch): Promise<SelectMatch> {
  return handleDatabaseOperation(async () => {
    const result = await db.insert(matches).values(match).returning();
    return result[0];
  }, "Error inserting match");
}

export async function updateMatch(
  id: number,
  match: InsertMatch
): Promise<SelectMatch> {
  return handleDatabaseOperation(async () => {
    await db.update(matches).set(match).where(eq(matches.id, id)).execute();
    return { id, ...match };
  }, "Error updating match");
}

export async function upsertMatch(match: InsertMatch): Promise<SelectMatch> {
  return handleDatabaseOperation(async () => {
    const existingMatch = await findMatch(match.datetime, match.match);
    if (existingMatch) {
      return await updateMatch(existingMatch.id, match);
    } else {
      return await insertMatch(match);
    }
  }, "Error upserting match");
}

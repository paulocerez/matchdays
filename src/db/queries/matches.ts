import { eq, and, sql, gt } from "drizzle-orm";
import { db } from "..";
import { InsertMatch, matchesTable, SelectMatch } from "../schema";
import handleDatabaseOperation from "../operations/handleDatabaseOperations";

/**
 *
 * @returns an array of all matches in the matches table.
 */
export async function getAllMatches(): Promise<SelectMatch[]> {
  return handleDatabaseOperation(async () => {
    const result = await db.select().from(matchesTable);
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
      .from(matchesTable)
      .where(gt(matchesTable.datetime, currentDatetime));
    return result as SelectMatch[];
  }, "Error fetching future matches");
}

export async function findMatchInDatabase(
  datetime: Date,
  match: string
): Promise<SelectMatch | null> {
  const result = await db
    .select()
    .from(matchesTable)
    .where(
      and(eq(matchesTable.datetime, datetime), eq(matchesTable.match, match))
    )
    .execute();

  return result.length > 0 ? result[0] : null;
}

export async function insertMatchInDatabase(
  match: InsertMatch
): Promise<SelectMatch> {
  return handleDatabaseOperation(async () => {
    const result = await db.insert(matchesTable).values(match).returning();
    return result[0];
  }, "Error inserting match");
}

export async function updateMatchInDatabase(
  id: number,
  match: InsertMatch
): Promise<SelectMatch> {
  return handleDatabaseOperation(async () => {
    await db
      .update(matchesTable)
      .set(match)
      .where(eq(matchesTable.id, id))
      .execute();
    return { id, ...match };
  }, "Error updating match");
}

export async function upsertMatchday(match: InsertMatch): Promise<SelectMatch> {
  return handleDatabaseOperation(async () => {
    const existingMatch = await findMatchInDatabase(
      match.datetime,
      match.match
    );
    if (existingMatch) {
      return await updateMatchInDatabase(existingMatch.id, match);
    } else {
      return await insertMatchInDatabase(match);
    }
  }, "Error upserting match");
}

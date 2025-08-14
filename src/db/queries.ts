import { db } from "./db";
import { and, eq, gt, lt } from "drizzle-orm";
import {
  accounts,
  InsertMatch,
  InsertUser,
  matches,
  SelectMatch,
  users,
  generateMatchIdentifier,
} from "./schema";
import handleDatabaseOperation from "./handleDatabaseOperation";

export async function createUser(data: InsertUser) {
  await db.insert(users).values(data);
}

export async function getUserById(userId: string) {
  await db.select().from(users).where(eq(users.id, userId));
}

export async function getUserNameAndImageByUserId(userId: string) {
  return await db
    .select({ id: users.id, name: users.name, image: users.image })
    .from(users)
    .where(eq(users.id, userId))
    .then((res) => res[0]);
}

export async function getAccountByUserId(userId: string) {
  const [account] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId));
  return account || null;
}

/**
 *
 * @returns an array of all matches in the matches table.
 */
export async function getAllMatches(): Promise<SelectMatch[]> {
  return handleDatabaseOperation(async () => {
    const result = await db.select().from(matches);
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

export async function findMatchByIdentifier(
  matchIdentifier: string
): Promise<SelectMatch | null> {
  const result = await db
    .select()
    .from(matches)
    .where(eq(matches.matchIdentifier, matchIdentifier))
    .execute();

  return result.length > 0 ? result[0] : null;
}

export async function findMatchByTeamsAndDate(
  match: string,
  date: Date
): Promise<SelectMatch | null> {
  // Find matches with the same teams on the same date (ignoring time)
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);
  
  const result = await db
    .select()
    .from(matches)
    .where(
      and(
        eq(matches.match, match),
        gt(matches.datetime, startOfDay),
        lt(matches.datetime, endOfDay)
      )
    )
    .execute();

  return result.length > 0 ? result[0] : null;
}

export async function insertMatch(match: InsertMatch): Promise<SelectMatch> {
  return handleDatabaseOperation(async () => {
    // Generate the match identifier
    const matchWithIdentifier = {
      ...match,
      matchIdentifier: generateMatchIdentifier(match.match, match.datetime),
    };
    
    const result = await db.insert(matches).values(matchWithIdentifier).returning();
    return result[0];
  }, "Error inserting match");
}

export async function updateMatch(
  id: number,
  match: InsertMatch
): Promise<SelectMatch> {
  return handleDatabaseOperation(async () => {
    // Generate the match identifier for the update
    const matchWithIdentifier = {
      ...match,
      matchIdentifier: generateMatchIdentifier(match.match, match.datetime),
    };
    
    await db.update(matches).set(matchWithIdentifier).where(eq(matches.id, id)).execute();
    return { id, ...matchWithIdentifier };
  }, "Error updating match");
}

export async function upsertMatch(match: InsertMatch): Promise<SelectMatch> {
  return handleDatabaseOperation(async () => {
    // First, try to find a match with the same teams on the same date (ignoring time)
    const existingMatch = await findMatchByTeamsAndDate(match.match, match.datetime);
    
    if (existingMatch) {
      // Match exists for the same teams on the same date, update it
      // This handles time changes, competition updates, etc.
      return await updateMatch(existingMatch.id, match);
    } else {
      // New match, insert it
      return await insertMatch(match);
    }
  }, "Error upserting match");
}

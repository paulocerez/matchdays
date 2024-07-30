import { db } from "@/db/index";
import { eq } from "drizzle-orm";
import { InsertMatch, SelectMatch, matchesTable } from "../schema";

export async function createMatch(data: InsertMatch) {
  await db.insert(matchesTable).values(data);
}

export async function getAllMatches() {
  return db.select().from(matchesTable);
}

export async function getMatchesById(
  id: SelectMatch["id"]
): Promise<
  Array<{ id: number; datetime: Date; match: string; competition: string }>
> {
  try {
    return db.select().from(matchesTable).where(eq(matchesTable.id, id));
  } catch (error) {
    console.error("Error fetching matches: ", error);
    throw new Error("Error fetching matches");
  }
}

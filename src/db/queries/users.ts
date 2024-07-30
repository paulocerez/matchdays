import { db } from "@/db/index";
import { InsertUser, SelectUser, usersTable } from "../schema";
import { eq } from "drizzle-orm";

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function getUserById(
  id: SelectUser["id"]
): Promise<Array<{ id: number; name: string; email: string }>> {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function deleteUser(id: SelectUser["id"]) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}

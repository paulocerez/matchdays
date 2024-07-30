import { db } from "@/db/index";
import { eq } from "drizzle-orm";
import { InsertUser, SelectUser, usersTable } from "../schema";

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function getUserById(
  id: SelectUser["id"]
): Promise<Array<{ id: number; name: string; email: string }>> {
  try {
    return db.select().from(usersTable).where(eq(usersTable.id, id));
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw new Error("Error fetching user data");
  }
}

export async function deleteUser(id: SelectUser["id"]) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}

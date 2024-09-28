import { db } from "../db";
import { InsertUser, users } from "../schema/users";
import { eq } from "drizzle-orm";

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

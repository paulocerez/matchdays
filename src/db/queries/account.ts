import { eq } from "drizzle-orm";
import { accounts } from "../schema/users";
import { db } from "../db";

export async function getAccountByUserId(userId: string) {
  const [account] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId));
  return account || null;
}

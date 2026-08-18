import { and, eq } from "drizzle-orm";
import { db } from "@/db/db";
import { accounts, SelectAccount } from "@/db/schema";

// A cron job has no NextAuth session, so it must obtain a Google access token
// straight from the stored OAuth account, refreshing it when expired. This is a
// server-side counterpart to the refresh logic in the auth.ts session callback.

async function refreshAccessToken(account: SelectAccount): Promise<string> {
  if (!account.refresh_token) {
    throw new Error("Google account has no refresh_token; re-authentication required");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: account.refresh_token,
    }),
  });

  const tokens = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to refresh Google token: ${JSON.stringify(tokens)}`);
  }

  const { access_token, expires_in, refresh_token } = tokens as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
  };

  await db
    .update(accounts)
    .set({
      access_token,
      expires_at: Math.floor(Date.now() / 1000 + expires_in),
      refresh_token: refresh_token ?? account.refresh_token,
    })
    .where(
      and(
        eq(accounts.provider, "google"),
        eq(accounts.providerAccountId, account.providerAccountId)
      )
    );

  return access_token;
}

// Single-account app: returns a valid access token for the one connected Google
// account, refreshing it first if it has expired (or is about to).
export async function getValidGoogleAccessToken(): Promise<string> {
  const [account] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.provider, "google"));

  if (!account) {
    throw new Error("No Google account connected; sign in with Google first");
  }

  const expiresAtMs = (account.expires_at ?? 0) * 1000;
  const expiresSoon = expiresAtMs < Date.now() + 60_000; // 60s safety margin

  if (expiresSoon || !account.access_token) {
    return refreshAccessToken(account);
  }

  return account.access_token;
}

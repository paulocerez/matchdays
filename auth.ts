import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/db";
import { accounts, users, sessions, verificationTokens } from "@/db/schema";
import { and, eq } from "drizzle-orm";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar",
        },
      },
    }),
  ],
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback - URL:", url, "Base URL:", baseUrl);
      
      // If this is the OAuth callback, redirect to matches
      if (url.includes('/api/auth/callback')) {
        return `${baseUrl}/matches`;
      }
      
      // If this is the sign-in page, redirect to matches
      if (url.includes('/api/auth/signin')) {
        return `${baseUrl}/matches`;
      }
      
      // If it's a relative URL, prepend the base URL
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Default: redirect to matches
      return `${baseUrl}/matches`;
    },
    async session({ session, user }) {
      console.log("Session callback - User:", user?.id, "Session user:", session.user);
      console.log("Full session object:", session);
      console.log("Full user object:", user);
      
      if (user.id) {
        session.user.id = user.id;
        console.log("Set session user ID to:", user.id);
      } else {
        console.log("No user ID found in user object");
      }

      // Check if we need to refresh the access token
      if (user.id) {
        try {
          const [googleAccount] = await db
            .select()
            .from(accounts)
            .where(
              and(eq(accounts.userId, user.id), eq(accounts.provider, "google"))
            );

          if (googleAccount && googleAccount.expires_at && googleAccount.refresh_token) {
            if (googleAccount.expires_at * 1000 < Date.now()) {
              try {
                const response = await fetch(
                  "https://oauth2.googleapis.com/token",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                      client_id: process.env.GOOGLE_CLIENT_ID!,
                      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                      grant_type: "refresh_token",
                      refresh_token: googleAccount.refresh_token,
                    }),
                  }
                );

                const tokensOrError = await response.json();

                if (!response.ok) throw tokensOrError;

                const newTokens = tokensOrError as {
                  access_token: string;
                  expires_in: number;
                  refresh_token?: string;
                };

                await db
                  .update(accounts)
                  .set({
                    access_token: newTokens.access_token,
                    expires_at: Math.floor(
                      Date.now() / 1000 + newTokens.expires_in
                    ),
                    refresh_token:
                      newTokens.refresh_token ?? googleAccount.refresh_token,
                  })
                  .where(
                    and(
                      eq(accounts.provider, "google"),
                      eq(accounts.userId, user.id)
                    )
                  );

                session.accessToken = newTokens.access_token;
              } catch (error) {
                console.error("Error refreshing access token", error);
                session.error = "RefreshTokenError";
              }
            } else if (googleAccount.access_token) {
              session.accessToken = googleAccount.access_token;
            }
          }
        } catch (error) {
          console.error("Error checking account status", error);
        }
      }

      return session;
    },
  },
});

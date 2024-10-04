import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/db";
import { getAccountByUserId } from "@/db/queries/account";
import { accounts } from "@/db/schema/users";
import { and, eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
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
  // functions acting similar to middleware
  callbacks: {
    // called when user logs in > access to session and user object from the db
    async session({ session, user }) {
      const [googleAccount] = await db
        .select()
        .from(accounts)
        .where(
          and(eq(accounts.userId, user.id), eq(accounts.provider, "google"))
        );

      if (
        googleAccount &&
        googleAccount.expires_at &&
        googleAccount.refresh_token
      ) {
        if (googleAccount.expires_at * 1000 < Date.now()) {
          // refresh the token once access_token expires

          try {
            const response = await fetch(
              "https://oauth2.googleapis.com/token",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                  client_id: process.env.AUTH_GOOGLE_ID!,
                  client_secret: process.env.AUTH_GOOGLE_SECRET!,
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
                  eq(
                    accounts.providerAccountId,
                    googleAccount.providerAccountId
                  )
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

      session.user.id = user.id;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const paths = ["/home"];
      const isProtected = paths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL("api/auth/signin", nextUrl.origin);
        redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
        return Response.redirect(redirectUrl);
      }

      return true;
    },
  },
});

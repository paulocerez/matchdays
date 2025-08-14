import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { db } from "@/db/db";
import { accounts } from "@/db/schema";
import { and, eq } from "drizzle-orm";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    providerAccountId?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
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
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token as string;
        token.refreshToken = account.refresh_token as string;
        token.user = user;
        if (account?.expires_at) {
          token.accessTokenExpires = account.expires_at * 1000;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Get user ID from token
      if (token.sub) {
        session.user.id = token.sub;
      }

      // Check if we need to refresh the token
      if (token.accessTokenExpires && typeof token.accessTokenExpires === 'number' && Date.now() > token.accessTokenExpires) {
        try {
          const [googleAccount] = await db
            .select()
            .from(accounts)
            .where(
              and(eq(accounts.provider, "google"), eq(accounts.providerAccountId, token.providerAccountId as string))
            );

          if (googleAccount && googleAccount.refresh_token) {
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
          }
        } catch (error) {
          console.error("Error refreshing access token", error);
          session.error = "RefreshTokenError";
        }
      } else if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }

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

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: DrizzleAdapter(db),
  callbacks: {
    // functions acting similar to middleware

    // async jwt({ token, account }) {
    //   if (account) {
    //     token = {
    //       ...token,
    //       access_token: account.access_token,
    //       refresh_token: account.refresh_token,
    //       expires_at: account.expires_at,
    //     };
    //   }
    //   return token;
    // },
    // called when user logs in > access to session and user object from the db
    async session({ session, user, token }) {
      // assign id from session object to be userId

      session = {
        ...session,
        // access_token: token.access_token as string,
        user: {
          ...session.user,
          id: user.id,
        },
      };
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

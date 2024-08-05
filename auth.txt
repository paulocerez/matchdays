import NextAuth, { User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
  }
}

const handler = NextAuth({
  // Configure one or more authentication providers
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          // consent screen on every sign-in
          prompt: "consent",
          //   Google can send the refresh_token on every sign-in now without requesting it again, otherwise only on first sign-in
          access_type: "offline",
          //   code to call callback url
          response_type: "code",
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
        },
      },
    }),
    // ...add more providers here
  ],
  session: {
    // sessions will be accordingly managed through JWT's, not via db entries
    strategy: "jwt",
  },
  callbacks: {
    // callback being invoked when jwt is created or updated > manages creation and renewal of JWT's
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token as string;
        token.refreshToken = account.refresh_token as string;
        token.user = user;
        if (account?.expires_at) {
          token.accessTokenExpires = account.expires_at * 1000;
        } else {
          console.error("Expiration time on the access token is missing");
        }
      }
      return token;
    },
    // invoked whenever a session is checked > read data from JWT, expose the token to the client side
    async session({ session, token }) {
      // attaching user info to the session
      session.user = ((token as JWT).user as User) || session.user;
      session.accessToken = (token as JWT).accessToken as string;
      session.error = (token as JWT).error as string | undefined;

      //   return session that is exposed to the client
      return session;
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },
});

export { handler as GET, handler as POST };

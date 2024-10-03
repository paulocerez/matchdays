import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: "RefreshTokenError";
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

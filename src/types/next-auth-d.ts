import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    access_token?: string;
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

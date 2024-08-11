import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// session is by default saved in a cookie using encrypted JWT

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  //   callbacks: {
  //     authorized: async ({ auth }) => {
  //       return !!auth;
  //     },
  //   },
});

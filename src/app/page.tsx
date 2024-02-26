"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

// import { CreatePost } from "~/app/_components/create-post";
// import { api } from "~/trpc/server";
// import { getServerAuthSession } from "~/server/auth";
import { LogIn } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  // session is used to get data when the user signs in through a particular provider -> checking for user being logged in through session
  if (session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#4877c7] to-[#0661e8] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-medium tracking-tight sm:text-[5rem]">
            Matchdays.
          </h1>
          <button onClick={() => signOut()}>Sign out</button>
          <div className="flex flex-col items-center gap-8">
            <p className="max-w-lg text-center text-xl leading-8 text-white">
              Click below to check out the overview of upcoming matches.
            </p>
            <div className="flex flex-col items-center justify-center gap-4">
              <button
                onClick={() => signIn("google")}
                className="flex flex-row gap-2 rounded-lg bg-white/10 px-6 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                Overview
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  //   page if user is not logged in, hence session === false
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#4877c7] to-[#0661e8] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-medium tracking-tight sm:text-[5rem]">
          Matchdays.
        </h1>
        <div className="flex flex-col items-center gap-8">
          <p className="max-w-lg text-center text-xl leading-8 text-white">
            The Google Calendar integration for your favorite football clubs.
            Never miss a game again. ⚽️
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <button
              onClick={() => signIn("google")}
              className="flex flex-row gap-2 rounded-lg bg-white/10 px-6 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

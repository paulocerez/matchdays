"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Overview from "@/components/MatchdayOverview";
import Header from "@/components/Header";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Matchday } from "@/types/matchdays";
import { createCalendarEvents } from "@/lib/createCalendarEvents";

export default function Home() {
  const { data: session } = useSession();
  const [matchdays, setMatchdays] = useState<Matchday[]>([]);

  if (session) {
    return (
      <main className="flex min-h-screen flex-col gap-16 text-black py-12 px-24 lg:px-64">
        <Header />
        <div className="space-y-16">
          <div className="flex flex-col items-center space-y-6  md:flex-row md:justify-between md:items-center">
            <div className="flex flex-col space-y-2 ">
              <h1 className="text-4xl">
                Welcome, {session.user?.name || "my friend"}. 👋🏼
              </h1>
              <h2 className="text-xl">These are your upcoming matches.</h2>
            </div>
            <div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => createCalendarEvents(matchdays, session)}
                className="flex flex-row items-center p-4 rounded-lg"
              >
                <Image
                  src="/google_calendar.png"
                  width={20}
                  height={20}
                  alt="GCal Logo"
                  className="mr-2"
                />
                Add to calendar
              </Button>
            </div>
          </div>
          <div>
            <Overview />
          </div>
        </div>
      </main>
    );
  }

  //   page if user is not logged in, hence session === false
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0b3ceb] to-[#669ae8] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
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
              Sign in using Google
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

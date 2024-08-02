"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Overview from "@/components/MatchdayOverview";
import Header from "@/components/Header";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Matchday } from "@/types/matchdays";
import { createCalendarEvents } from "@/lib/createCalendarEvents";

export default function Home() {
  const { data: session, status } = useSession();
  const [matchdays, setMatchdays] = useState<Matchday[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(undefined, { callbackUrl: "/login" });
    }
  }, [status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <main className="flex min-h-screen flex-col gap-16 text-black py-12 px-8 lg:px-64">
        <Header />
        <div className="space-y-16">
          <div className="flex flex-col items-center space-y-6  md:flex-row md:justify-between md:items-center">
            <div className="flex flex-col space-y-2 ">
              <h1 className="text-2xl lg:text-4xl">
                Welcome, {session.user?.name || "my friend"}. 👋🏼
              </h1>
              <h2 className="text-lg lg:text-xl">
                These are your upcoming matches.
              </h2>
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

  return null;
}

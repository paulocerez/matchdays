"use client";
import React, { useState, useEffect } from "react";
import MatchdayCard from "@/components/MatchdayCard";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

// Define the Matchday type
interface Matchday {
  id: number;
  date: string;
  time: string;
  teams: string;
  competition: string;
}

export default function Overview() {
  // State consists of array of Matchdays
  const [matchdays, setMatchdays] = useState<Matchday[]>([]);
  const { data: session } = useSession();

  const createCalendarEvents = async () => {
    try {
      const fetchPromises = matchdays.map((matchday) => {
        const event = {
          summary: matchday.teams,
          description: matchday.teams + matchday.competition + matchday.date,
          start: {
            dateTime: new Date(
              `${matchday.date}T${matchday.time}`
            ).toISOString(),
            timezone: "Etc/UTC",
          },
          end: {
            dateTime: new Date(
              `${matchday.date}T${matchday.time}`
            ).toISOString(),
            timezone: "Etc/UTC",
          },
        };

        return fetch("/api/add-event", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + session, // Google Access Token
          },
          body: JSON.stringify({ event }),
        });
      });

      //   create fetch promise for each matchday object
      const responses = await Promise.all(fetchPromises);
      //   for each HTTP request we check for successful completion
      const results = await Promise.all(
        responses.map((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
      );

      console.log(results);
      alert("Matchdays added to Google Calendar!");
    } catch (error) {
      console.error("Couldn't create an event due to: ", error);
      alert("Failed to add matchdays to Google Calendar.");
    }
  };

  useEffect(() => {
    // api call to api/matchday
    fetch("/api/matchdays")
      // parsing response object as JSON, returns a promise
      .then((response) => response.json())
      // takes parsed json, updates state
      .then((data) => setMatchdays(data));
  }, []);

  return (
    <main className="flex min-h-screen justify-center bg-gradient-to-b from-[#c4cedd] to-[#e0e7f2] text-white">
      <div className="m-24 flex flex-col justify-center space-y-8">
        <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between space-y-8 lg:space-y-0">
          <h1 className="text-5xl font-medium text-center">
            Matchday Overview
          </h1>
          <div className="flex flex-row space-x-4">
            <button
              onClick={() => createCalendarEvents()}
              className="flex flex-row items-center bg-blue-500 p-4 rounded-lg"
            >
              <Image
                src="/google_calendar.png"
                width={20}
                height={20}
                alt="GCal Logo"
                className="mr-2"
              />
              Add to calendar
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:grid lg:grid-cols-3 items-center gap-8">
          {matchdays.map((matchday) => (
            <MatchdayCard key={matchday.id} matchday={matchday} />
          ))}
        </div>
      </div>
    </main>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import MatchdayCard from "@/components/MatchdayCard";

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
      <div className="m-10 flex flex-col justify-center space-y-8">
        <h1 className="text-5xl font-medium">Matchday Overview</h1>
      </div>
      <div>
        {matchdays.map((matchday) => (
          <MatchdayCard key={matchday.id} matchday={matchday} />
        ))}
      </div>
    </main>
  );
}

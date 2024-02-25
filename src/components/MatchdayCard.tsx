"use client";
import React from "react";

interface Matchday {
  id: number;
  date: string;
  time: string;
  teams: string;
  competition: string;
}

interface MatchdayCardProps {
  matchday: Matchday;
}

export default function MatchdayCard({ matchday }: MatchdayCardProps) {
  return (
    <div className="border-4 rounded-lg shadow-xl p-4 text-black bg-slate-100 w-full">
      <p>Date: {matchday.date}</p>
      <p>Time: {matchday.time}</p>
      <p>Teams: {matchday.teams}</p>
      <p>Competition: {matchday.competition}</p>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";

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
    <div>
      <p>Date: {matchday.date}</p>
      <p>Time: {matchday.time}</p>
      <p>Teams: {matchday.teams}</p>
      <p>Competition: {matchday.competition}</p>
    </div>
  );
}

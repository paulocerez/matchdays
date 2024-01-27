import React from "react";
import MatchdayCard from "@/components/MatchdayCard";

export default function Overview() {
  return (
    <main className="flex min-h-screen justify-center bg-gradient-to-b from-[#c4cedd] to-[#e0e7f2] text-white">
      <div className="m-10 flex flex-col justify-center space-y-8">
        <h1 className="text-5xl font-medium">Matchday Overview</h1>
      </div>
      <div>
        <MatchdayCard />
      </div>
    </main>
  );
}

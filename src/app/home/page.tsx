"use client";
import Header from "@/components/Header";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MatchesTable from "@/components/MatchesTable";
import { useEffect, useState } from "react";
import { SelectMatch } from "@/db/schema/teams";

export default function Home() {
  const [matches, setMatches] = useState<SelectMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/matches");
      if (!response.ok) throw new Error("Failed to fetch matches");
      const data = await response.json();
      setMatches(data);
    } catch (err) {
      setError("Error fetching matches");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/scrape-matches", { method: "POST" });
      if (!response.ok) throw new Error("Failed to scrape matches");
      await fetchMatches();
    } catch (err) {
      setError("Error scraping matches");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCalendar = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/insert-calendar", { method: "POST" });
      if (!response.ok) throw new Error("Failed to add matches to calendar");
      const results = await response.json();
      console.log("Calendar insertion results:", results);
    } catch (err) {
      setError("Error adding matches to calendar");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col gap-8 text-black p-4 lg:px-64">
      <Header />
      <div className="space-y-16">
        <div className="flex flex-col items-center space-y-6  md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col space-y-2">
            <h1 className="text-lg lg:text-2xl">
              These are your upcoming matches.
            </h1>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <Button
              type="button"
              variant="secondary"
              className="flex flex-row items-center p-4 rounded-lg"
              onClick={handleAddToCalendar}
              disabled={isLoading}
            >
              <Image
                src="/google_calendar.png"
                width={20}
                height={20}
                alt="GCal Logo"
                className="mr-2"
              />
              {isLoading ? "Adding..." : "Add to calendar"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex flex-row items-center p-4 rounded-lg"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? "Scraping..." : "Scrape matches"}
            </Button>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <MatchesTable matches={matches} />
        </div>
      </div>
    </main>
  );
}

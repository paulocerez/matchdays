"use client";
import Header from "@/components/Header";
import MatchesTable from "@/components/MatchesTable";
import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { SelectMatch } from "@/db/schema";

export default function Matches() {
  const [matches, setMatches] = useState<SelectMatch[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchMatches = useCallback(async () => {
    const response = await fetch("/api/matches");
    if (!response.ok) throw new Error("Failed to fetch matches");
    setMatches(await response.json());
  }, []);

  useEffect(() => {
    fetchMatches()
      .catch(() => toast.error("Couldn't load matches"))
      .finally(() => setInitialLoading(false));
  }, [fetchMatches]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch("/api/sync", { method: "POST" });
      if (!response.ok) throw new Error("sync failed");
      const result = await response.json();
      await fetchMatches();

      const c = result.calendar;
      if (c && !("error" in c)) {
        const parts = [
          c.inserted && `${c.inserted} added`,
          c.updated && `${c.updated} updated`,
          c.deleted && `${c.deleted} removed`,
        ].filter(Boolean);
        toast.success(
          parts.length ? `Calendar ${parts.join(", ")}` : "Calendar up to date"
        );
      } else {
        toast.success(`${result.processed} fixtures synced`);
      }
    } catch {
      toast.error("Sync failed. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-12">
        <Header />

        <div className="mt-10 flex items-end justify-between gap-3 sm:mt-12">
          <div className="min-w-0">
            <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight sm:text-3xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://crests.football-data.org/81.png"
                alt="FC Barcelona"
                width={32}
                height={32}
                className="h-7 w-7 shrink-0 object-contain sm:h-8 sm:w-8"
              />
              Fixtures
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {initialLoading
                ? "Loading…"
                : `${matches.length} upcoming ${
                    matches.length === 1 ? "match" : "matches"
                  }`}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSync}
            disabled={syncing || initialLoading}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#004D98] px-3.5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 sm:py-2"
          >
            <RefreshCw
              className={`h-4 w-4 sm:h-3.5 sm:w-3.5 ${
                syncing ? "animate-spin" : ""
              }`}
            />
            {syncing ? "Syncing…" : "Sync"}
          </button>
        </div>

        <div className="mt-8">
          {initialLoading ? (
            <MatchesSkeleton />
          ) : (
            <MatchesTable matches={matches} />
          )}
        </div>
      </div>
    </div>
  );
}

function MatchesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card/50 px-4 py-3.5"
        >
          <div className="h-8 w-10 animate-pulse rounded-md bg-secondary" />
          <div className="h-8 w-px bg-border" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-40 animate-pulse rounded bg-secondary" />
            <div className="h-2.5 w-16 animate-pulse rounded bg-secondary" />
          </div>
          <div className="h-5 w-20 animate-pulse rounded-full bg-secondary" />
        </div>
      ))}
    </div>
  );
}

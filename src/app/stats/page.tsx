"use client";
import Header from "@/components/Header";
import StatsDashboard from "@/components/StatsDashboard";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Analytics } from "@/lib/analytics";

export default function Stats() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((json: Analytics) => setData(json))
      .catch(() => toast.error("Couldn't load stats"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-12">
        <Header />

        <div className="mt-10 sm:mt-12">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Season stats
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading
              ? "Loading…"
              : data
                ? `${data.overall.played} matches played`
                : "No data yet"}
          </p>
        </div>

        <div className="mt-8">
          {loading ? (
            <StatsSkeleton />
          ) : data && data.overall.played > 0 ? (
            <StatsDashboard data={data} />
          ) : (
            <EmptyStats />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyStats() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
      <p className="text-sm font-medium">No results yet</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Hit Sync on Fixtures to pull the latest results.
      </p>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl border border-border bg-card/50"
          />
        ))}
      </div>
      <div className="h-40 animate-pulse rounded-2xl border border-border bg-card/50" />
    </div>
  );
}

"use client";
import { CalendarX2 } from "lucide-react";
import { SelectMatch } from "@/db/schema";

const BARCA = /bar[çc]a|barcelona/i;

const weekdayFmt = new Intl.DateTimeFormat(undefined, { weekday: "short" });
const dayFmt = new Intl.DateTimeFormat(undefined, { day: "2-digit" });
const monthFmt = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});
const timeFmt = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
});

function teams(match: string): [string, string] {
  const [home, away] = match.split(" : ");
  return [home ?? match, away ?? ""];
}

function Crest({ src, alt }: { src: string | null; alt: string }) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={16}
      height={16}
      loading="lazy"
      className="h-4 w-4 shrink-0 object-contain"
    />
  );
}

function TeamName({ name, crest }: { name: string; crest: string | null }) {
  const isBarca = BARCA.test(name);
  return (
    <span className="inline-flex items-center gap-1.5">
      <Crest src={crest} alt={name} />
      <span
        className={
          isBarca ? "font-semibold text-foreground" : "text-foreground/80"
        }
      >
        {name}
      </span>
    </span>
  );
}

export default function MatchesTable({ matches }: { matches: SelectMatch[] }) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
        <CalendarX2 className="h-6 w-6 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium">No upcoming matches</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Hit Sync to pull the latest fixtures.
        </p>
      </div>
    );
  }

  // Group matches by month while preserving chronological order.
  const groups: { label: string; items: SelectMatch[] }[] = [];
  for (const match of matches) {
    const label = monthFmt.format(new Date(match.datetime));
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(match);
    else groups.push({ label, items: [match] });
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.label}>
          <h2 className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {group.label}
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card/50">
            {group.items.map((match, i) => {
              const date = new Date(match.datetime);
              const [home, away] = teams(match.match);
              return (
                <div
                  key={match.id}
                  className={`group flex items-center gap-3 px-3 py-3 transition-colors hover:bg-foreground/[0.03] sm:gap-4 sm:px-4 sm:py-3.5 ${
                    i > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <div className="flex w-10 shrink-0 flex-col items-center">
                    <span className="text-[10px] font-medium uppercase text-muted-foreground">
                      {weekdayFmt.format(date)}
                    </span>
                    <span className="text-lg font-semibold leading-none tabular-nums">
                      {dayFmt.format(date)}
                    </span>
                  </div>

                  <div className="h-8 w-px bg-border" />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                      <TeamName name={home} crest={match.homeCrest} />
                      <span className="text-xs text-muted-foreground">vs</span>
                      <TeamName name={away} crest={match.awayCrest} />
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
                      <span>{timeFmt.format(date)}</span>
                      <span className="flex items-center gap-1.5 sm:hidden">
                        <span>·</span>
                        <Crest
                          src={match.competitionEmblem}
                          alt={match.competition}
                        />
                        <span>{match.competition}</span>
                      </span>
                    </div>
                  </div>

                  <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground sm:inline-flex">
                    <Crest src={match.competitionEmblem} alt={match.competition} />
                    {match.competition}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

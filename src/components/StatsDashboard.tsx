"use client";
import type { Analytics, Metrics, Result, MatchOutcome } from "@/lib/analytics";

const dateFmt = new Intl.DateTimeFormat(undefined, {
  day: "2-digit",
  month: "short",
});

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/50 px-4 py-3.5">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
      {sub && (
        <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>
      )}
    </div>
  );
}

function ResultBadge({ result }: { result: Result }) {
  const styles: Record<Result, string> = {
    W: "bg-emerald-500/15 text-emerald-400",
    D: "bg-zinc-500/15 text-zinc-400",
    L: "bg-rose-500/15 text-rose-400",
  };
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold ${styles[result]}`}
    >
      {result}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function CompetitionRow({
  competition,
  metrics,
}: {
  competition: string;
  metrics: Metrics;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{competition}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {metrics.played} played · {metrics.goalsFor}-{metrics.goalsAgainst} GF/GA
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-sm font-semibold tabular-nums">
          {metrics.wins}-{metrics.draws}-{metrics.losses}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {Math.round(metrics.winRate * 100)}% win
        </div>
      </div>
    </div>
  );
}

function SplitCard({ label, metrics }: { label: string; metrics: Metrics }) {
  return (
    <div className="rounded-2xl border border-border bg-card/50 px-4 py-3.5">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold tabular-nums">
        {metrics.wins}-{metrics.draws}-{metrics.losses}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">
        {metrics.goalsFor}-{metrics.goalsAgainst} · {metrics.played} games
      </div>
    </div>
  );
}

function ResultItem({ outcome }: { outcome: MatchOutcome }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <ResultBadge result={outcome.result} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm">
          <span className="text-muted-foreground">
            {outcome.isHome ? "vs" : "@"}
          </span>{" "}
          <span className="font-medium">{outcome.opponent}</span>
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {dateFmt.format(new Date(outcome.datetime))} · {outcome.competition}
        </div>
      </div>
      <div className="shrink-0 text-sm font-semibold tabular-nums">
        {outcome.goalsFor}–{outcome.goalsAgainst}
      </div>
    </div>
  );
}

export default function StatsDashboard({ data }: { data: Analytics }) {
  const { overall, byCompetition, home, away, form, outcomes } = data;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Record"
          value={`${overall.wins}-${overall.draws}-${overall.losses}`}
          sub={`${Math.round(overall.winRate * 100)}% win rate`}
        />
        <StatCard
          label="Goals"
          value={`${overall.goalsFor}`}
          sub={`${overall.avgGoalsFor.toFixed(2)} per game`}
        />
        <StatCard
          label="Conceded"
          value={`${overall.goalsAgainst}`}
          sub={`${overall.avgGoalsAgainst.toFixed(2)} per game`}
        />
        <StatCard
          label="Goal diff"
          value={`${overall.goalDifference > 0 ? "+" : ""}${overall.goalDifference}`}
          sub={`${overall.cleanSheets} clean sheets`}
        />
      </div>

      {form.length > 0 && (
        <Section title="Form (last 5)">
          <div className="flex items-center gap-1.5 px-1">
            {form.map((r, i) => (
              <ResultBadge key={i} result={r} />
            ))}
          </div>
        </Section>
      )}

      {byCompetition.length > 0 && (
        <Section title="By competition">
          <div className="overflow-hidden rounded-2xl border border-border bg-card/50 divide-y divide-border">
            {byCompetition.map((c) => (
              <CompetitionRow
                key={c.competition}
                competition={c.competition}
                metrics={c.metrics}
              />
            ))}
          </div>
        </Section>
      )}

      <Section title="Home vs away">
        <div className="grid grid-cols-2 gap-3">
          <SplitCard label="Home" metrics={home} />
          <SplitCard label="Away" metrics={away} />
        </div>
      </Section>

      {outcomes.length > 0 && (
        <Section title="Results">
          <div className="overflow-hidden rounded-2xl border border-border bg-card/50 divide-y divide-border">
            {outcomes.map((o) => (
              <ResultItem key={o.id} outcome={o} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

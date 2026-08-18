import { SelectMatch } from "@/db/schema";

export const BARCA = /bar[çc]a|barcelona/i;

export type Result = "W" | "D" | "L";

export interface MatchOutcome {
  id: number;
  datetime: Date;
  competition: string;
  opponent: string;
  isHome: boolean;
  goalsFor: number;
  goalsAgainst: number;
  result: Result;
}

export interface Metrics {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: number; // 0..1
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  avgGoalsFor: number;
  avgGoalsAgainst: number;
  cleanSheets: number;
  failedToScore: number;
}

export interface Analytics {
  overall: Metrics;
  byCompetition: { competition: string; metrics: Metrics }[];
  home: Metrics;
  away: Metrics;
  form: Result[]; // most recent first, up to 5
  outcomes: MatchOutcome[]; // most recent first
}

function teams(match: string): [string, string] {
  const [home, away] = match.split(" : ");
  return [home ?? match, away ?? ""];
}

/**
 * Normalizes a finished match into Barça's perspective. Returns null when the
 * row lacks a final score or isn't recognizably a Barça fixture.
 */
export function toOutcome(match: SelectMatch): MatchOutcome | null {
  if (match.homeScore == null || match.awayScore == null) return null;

  const [home, away] = teams(match.match);
  const barcaHome = BARCA.test(home);
  const barcaAway = BARCA.test(away);
  if (!barcaHome && !barcaAway) return null;

  const isHome = barcaHome;
  const goalsFor = isHome ? match.homeScore : match.awayScore;
  const goalsAgainst = isHome ? match.awayScore : match.homeScore;
  const opponent = isHome ? away : home;

  const result: Result =
    goalsFor > goalsAgainst ? "W" : goalsFor < goalsAgainst ? "L" : "D";

  return {
    id: match.id,
    datetime: match.datetime,
    competition: match.competition,
    opponent,
    isHome,
    goalsFor,
    goalsAgainst,
    result,
  };
}

function computeMetrics(outcomes: MatchOutcome[]): Metrics {
  const played = outcomes.length;
  let wins = 0,
    draws = 0,
    losses = 0,
    goalsFor = 0,
    goalsAgainst = 0,
    cleanSheets = 0,
    failedToScore = 0;

  for (const o of outcomes) {
    if (o.result === "W") wins++;
    else if (o.result === "D") draws++;
    else losses++;
    goalsFor += o.goalsFor;
    goalsAgainst += o.goalsAgainst;
    if (o.goalsAgainst === 0) cleanSheets++;
    if (o.goalsFor === 0) failedToScore++;
  }

  return {
    played,
    wins,
    draws,
    losses,
    winRate: played ? wins / played : 0,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    avgGoalsFor: played ? goalsFor / played : 0,
    avgGoalsAgainst: played ? goalsAgainst / played : 0,
    cleanSheets,
    failedToScore,
  };
}

/**
 * Computes season analytics from finished matches. Expects rows already sorted
 * most-recent first (as returned by getFinishedMatches).
 */
export function computeAnalytics(finished: SelectMatch[]): Analytics {
  const outcomes = finished
    .map(toOutcome)
    .filter((o): o is MatchOutcome => o !== null);

  const byCompMap = new Map<string, MatchOutcome[]>();
  for (const o of outcomes) {
    const list = byCompMap.get(o.competition) ?? [];
    list.push(o);
    byCompMap.set(o.competition, list);
  }

  const byCompetition = [...byCompMap.entries()]
    .map(([competition, list]) => ({
      competition,
      metrics: computeMetrics(list),
    }))
    .sort((a, b) => b.metrics.played - a.metrics.played);

  return {
    overall: computeMetrics(outcomes),
    byCompetition,
    home: computeMetrics(outcomes.filter((o) => o.isHome)),
    away: computeMetrics(outcomes.filter((o) => !o.isHome)),
    form: outcomes.slice(0, 5).map((o) => o.result),
    outcomes,
  };
}

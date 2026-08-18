import { generateMatchIdentifier, InsertMatch } from "@/db/schema";

// FC Barcelona's team id on football-data.org.
const BARCELONA_TEAM_ID = 81;
const API_BASE = "https://api.football-data.org/v4";

// Competitions to pull for Barça. PD (La Liga) and CL (Champions League) are on
// the free tier. CDR (Copa del Rey) requires a paid plan — until then the API
// silently ignores it, so it activates automatically once the plan is upgraded.
const COMPETITIONS = "PD,CL,CDR";

// Window for the request. Covers the current season's results plus upcoming
// fixtures, kept within the API's 750-day range limit.
const LOOKBACK_DAYS = 400;
const LOOKAHEAD_DAYS = 300;

interface FootballDataTeam {
  name: string;
  shortName: string | null;
  crest: string | null;
}

interface FootballDataMatch {
  utcDate: string;
  status: string;
  competition: { name: string; emblem: string | null };
  homeTeam: FootballDataTeam;
  awayTeam: FootballDataTeam;
  score: {
    fullTime: { home: number | null; away: number | null };
  };
}

function teamLabel(team: FootballDataTeam): string {
  return team.shortName ?? team.name;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Fetches FC Barcelona's fixtures and results (La Liga + Champions League) from
 * football-data.org and maps them onto the InsertMatch shape used by the sync
 * pipeline. Includes finished matches with final scores so the analytics layer
 * can compute season metrics. Only future SCHEDULED matches reach the calendar,
 * because the calendar sync filters on datetime > now.
 */
export default async function scrapeMatchdayData(): Promise<InsertMatch[]> {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;
  if (!token) {
    throw new Error("FOOTBALL_DATA_API_TOKEN is not set");
  }

  const now = new Date();
  const dateFrom = new Date(now.getTime() - LOOKBACK_DAYS * 86400000);
  const dateTo = new Date(now.getTime() + LOOKAHEAD_DAYS * 86400000);

  const url =
    `${API_BASE}/teams/${BARCELONA_TEAM_ID}/matches` +
    `?competitions=${COMPETITIONS}` +
    `&dateFrom=${isoDate(dateFrom)}&dateTo=${isoDate(dateTo)}`;

  const response = await fetch(url, { headers: { "X-Auth-Token": token } });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `football-data.org request failed (${response.status}): ${body}`
    );
  }

  const data = (await response.json()) as { matches: FootballDataMatch[] };

  const matches: InsertMatch[] = [];
  for (const m of data.matches ?? []) {
    const datetime = new Date(m.utcDate);
    if (isNaN(datetime.getTime())) {
      console.warn("Invalid utcDate for match:", m.utcDate);
      continue;
    }

    const teams = `${teamLabel(m.homeTeam)} : ${teamLabel(m.awayTeam)}`;
    matches.push({
      datetime,
      match: teams,
      competition: m.competition.name,
      matchIdentifier: generateMatchIdentifier(teams, datetime),
      status: m.status,
      homeScore: m.score?.fullTime?.home ?? null,
      awayScore: m.score?.fullTime?.away ?? null,
      homeCrest: m.homeTeam.crest ?? null,
      awayCrest: m.awayTeam.crest ?? null,
      competitionEmblem: m.competition.emblem ?? null,
    });
  }

  return matches;
}

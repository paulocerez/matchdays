import { generateMatchIdentifier, InsertMatch } from "@/db/schema";

// FC Barcelona's team id on football-data.org.
const BARCELONA_TEAM_ID = 81;
const API_BASE = "https://api.football-data.org/v4";

interface FootballDataTeam {
  name: string;
  shortName: string | null;
}

interface FootballDataMatch {
  utcDate: string;
  status: string;
  competition: { name: string };
  homeTeam: FootballDataTeam;
  awayTeam: FootballDataTeam;
}

function teamLabel(team: FootballDataTeam): string {
  return team.shortName ?? team.name;
}

/**
 * Fetches FC Barcelona's upcoming fixtures from football-data.org and maps them
 * onto the InsertMatch shape used by the sync pipeline. Replaces the old
 * OneFootball HTML scraper, which broke once fixtures moved to client-side
 * rendering.
 */
export default async function scrapeMatchdayData(): Promise<InsertMatch[]> {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;
  if (!token) {
    throw new Error("FOOTBALL_DATA_API_TOKEN is not set");
  }

  const response = await fetch(
    `${API_BASE}/teams/${BARCELONA_TEAM_ID}/matches?status=SCHEDULED`,
    { headers: { "X-Auth-Token": token } }
  );

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
    });
  }

  return matches;
}

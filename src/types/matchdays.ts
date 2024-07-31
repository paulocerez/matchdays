export interface Matchday {
  id: number;
  date: string;
  time: string;
  teams: string;
  competition: string;
}

export interface Session {
  accessToken?: string;
}

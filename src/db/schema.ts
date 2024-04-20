import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import {
  integer,
  pgTable,
  serial,
  varchar,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql);

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  league: varchar("name").notNull(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  datetime: timestamp("match_datetime", { precision: 6, withTimezone: true }),
  competition: varchar("competition").notNull(),
  hostId: integer("host_id")
    .references(() => teams.id)
    .notNull(),
  guestId: integer("host_id")
    .references(() => teams.id)
    .notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
});

export const userToTeams = pgTable(
  "user_to_teams",
  {
    userId: integer("user_id"),
    teamId: integer("team_id"),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.teamId] }),
    };
  }
);
// create a composite primary key using multiple fields, which ensures that the combination of these fields is unique for every record in the table

import {
  integer,
  pgTable,
  serial,
  varchar,
  timestamp,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";

export const matchesTable = pgTable("matches_table", {
  id: serial("id").primaryKey(),
  datetime: timestamp("match_datetime", {
    precision: 6,
    withTimezone: true,
  }).notNull(),
  match: text("match").notNull(),
  competition: varchar("competition").notNull(),
});

export const teamsTable = pgTable("teams_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const userTeamsTable = pgTable(
  "userteams_table",
  {
    userId: integer("user_id")
      .references(() => usersTable.id)
      .notNull(),
    teamId: integer("team_id")
      .references(() => teamsTable.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.teamId] }),
    };
  }
);

export type InsertTeam = typeof teamsTable.$inferInsert;
export type SelectTeam = typeof teamsTable.$inferSelect;

export type InsertMatch = typeof matchesTable.$inferInsert;
export type SelectMatch = typeof matchesTable.$inferSelect;

export type InsertUserTeam = typeof userTeamsTable.$inferInsert;
export type SelectUserTeam = typeof userTeamsTable.$inferSelect;

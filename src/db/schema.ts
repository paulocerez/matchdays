import {
  integer,
  pgTable,
  serial,
  varchar,
  timestamp,
  primaryKey,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const matches = pgTable("match", {
  id: serial("id").primaryKey(),
  datetime: timestamp("datetime").notNull(),
  match: text("match").notNull(),
  competition: varchar("competition").notNull(),
  matchIdentifier: text("match_identifier").notNull(),
  googleEventId: text("google_event_id"),
  syncedDatetime: timestamp("synced_datetime"),
  status: varchar("status").notNull().default("SCHEDULED"),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  homeCrest: text("home_crest"),
  awayCrest: text("away_crest"),
  competitionEmblem: text("competition_emblem"),
}, (table) => ({
  matchIdentifierIdx: uniqueIndex("match_identifier_idx").on(table.matchIdentifier),
}));

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertAccount = typeof accounts.$inferInsert;
export type SelectAccount = typeof accounts.$inferSelect;

export type InsertSession = typeof sessions.$inferInsert;
export type SelectSession = typeof sessions.$inferSelect;

export type SelectMatch = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

// Utility functions for match identification
export function generateMatchIdentifier(match: string, date: Date): string {
  const dateTimeString = date.toISOString().replace(/[:.]/g, '-'); // YYYY-MM-DDTHH-MM-SS format
  return `${match}_${dateTimeString}`;
}

export function normalizeDate(date: Date): Date {
  // Return a new Date object with only year, month, and day (time set to 00:00:00)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Stable key used to match a scraped fixture against a stored row, mirroring the
// upsert dedup logic (same teams on the same calendar day, ignoring kickoff time).
export function generateMatchDayKey(match: string, date: Date): string {
  const day = date.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  return `${match}_${day}`;
}

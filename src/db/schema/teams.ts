import {
  integer,
  pgTable,
  serial,
  varchar,
  timestamp,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";

export const matchesTable = pgTable("match", {
  id: serial("id").primaryKey(),
  datetime: timestamp("match_datetime", {
    precision: 6,
    withTimezone: true,
  }).notNull(),
  match: text("match").notNull(),
  competition: varchar("competition").notNull(),
});

export type InsertMatch = typeof matchesTable.$inferInsert;
export type SelectMatch = typeof matchesTable.$inferSelect;

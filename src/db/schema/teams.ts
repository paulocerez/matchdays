import {
  integer,
  pgTable,
  serial,
  varchar,
  timestamp,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";

export const matches = pgTable("match", {
  id: serial("id").primaryKey(),
  datetime: timestamp("datetime").notNull(),
  match: text("match").notNull(),
  competition: varchar("competition").notNull(),
});

export type SelectMatch = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

ALTER TABLE "match" ADD COLUMN "status" varchar DEFAULT 'SCHEDULED' NOT NULL;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "home_score" integer;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "away_score" integer;
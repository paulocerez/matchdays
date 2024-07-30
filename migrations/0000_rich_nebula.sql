CREATE TABLE IF NOT EXISTS "matches_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_datetime" timestamp (6) with time zone,
	"match" text NOT NULL,
	"competition" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userteams_table" (
	"user_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	CONSTRAINT "userteams_table_user_id_team_id_pk" PRIMARY KEY("user_id","team_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userteams_table" ADD CONSTRAINT "userteams_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userteams_table" ADD CONSTRAINT "userteams_table_team_id_teams_table_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

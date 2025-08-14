CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DROP TABLE "teams_table";--> statement-breakpoint
DROP TABLE "userteams_table";--> statement-breakpoint
ALTER TABLE "matches_table" RENAME TO "match";--> statement-breakpoint
ALTER TABLE "users_table" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "match" RENAME COLUMN "match_datetime" TO "datetime";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "users_table_email_unique";--> statement-breakpoint
ALTER TABLE "match" ALTER COLUMN "datetime" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "match" ALTER COLUMN "datetime" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "match_identifier" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "emailVerified" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "image" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "match_identifier_idx" ON "match" USING btree ("match_identifier");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");
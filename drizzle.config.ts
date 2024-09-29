// Config for Drizzle
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/*",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://default:yiAu8KWVSm0P@ep-aged-haze-a2bwcsn0-pooler.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require",
  },
});

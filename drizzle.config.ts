import { defineConfig } from "drizzle-kit";

export default defineConfig({
  verbose: true,
  dialect: "postgresql",
  schema: "./src/api/db/schema/index.ts",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

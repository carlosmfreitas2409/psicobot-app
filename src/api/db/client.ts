import { drizzle } from "drizzle-orm/node-postgres";
// import { neon } from "@neondatabase/serverless";

import { env } from "@/env";

import * as schema from "./schema";

// const sql = postgres();

export const db = drizzle(env.DATABASE_URL, {
  casing: "snake_case",
  schema,
});

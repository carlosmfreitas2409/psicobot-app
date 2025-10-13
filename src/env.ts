import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    OPENROUTER_API_KEY: z.string().min(1),
    TINYBIRD_TOKEN: z.string().min(1),
    TINYBIRD_URL: z.url().default("https://api.us-east.aws.tinybird.co"),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    TINYBIRD_TOKEN: process.env.TINYBIRD_TOKEN,
    TINYBIRD_URL: process.env.TINYBIRD_URL,
  },
});

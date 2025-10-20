import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    OPENROUTER_API_KEY: z.string().min(1),
    TINYBIRD_TOKEN: z.string().min(1),
    TINYBIRD_URL: z.url().default("https://api.us-east.aws.tinybird.co"),
    REDIS_URL: z.url().default("redis://localhost:6379"),
    RESEND_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.url().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    TINYBIRD_TOKEN: process.env.TINYBIRD_TOKEN,
    TINYBIRD_URL: process.env.TINYBIRD_URL,
    REDIS_URL: process.env.REDIS_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});

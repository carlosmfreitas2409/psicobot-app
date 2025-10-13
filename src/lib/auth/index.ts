import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "../../api/db/client";

import { enterprise } from "./enterprise";

export const auth = betterAuth({
  plugins: [nextCookies(), enterprise()],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
});

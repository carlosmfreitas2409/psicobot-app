import { createAuthClient } from "better-auth/react";

import { env } from "@/env";

import { enterpriseClient } from "./enterprise-client";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [enterpriseClient()],
});

export const { signIn, signUp, signOut, useSession, enterprise } = authClient;

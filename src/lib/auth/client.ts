import { createAuthClient } from "better-auth/react";

import { enterpriseClient } from "./enterprise-client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [enterpriseClient()],
});

export const { signIn, signUp, signOut, useSession, enterprise } = authClient;

import "server-only";

import { headers } from "next/headers";
import { createRouterClient } from "@orpc/server";

import { router } from "@/api/routers";

globalThis.$client = createRouterClient(router, {
  context: async () => ({
    headers: await headers(),
  }),
});

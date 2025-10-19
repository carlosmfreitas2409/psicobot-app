import type { BetterAuthClientPlugin } from "better-auth";

import type { enterprise } from "./enterprise";

export const enterpriseClient = () => {
  return {
    id: "enterprise-client",
    $InferServerPlugin: {} as ReturnType<typeof enterprise>,
  } satisfies BetterAuthClientPlugin;
};

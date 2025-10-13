import type { RouterClient } from "@orpc/server";
import { BatchLinkPlugin } from "@orpc/client/plugins";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
// import { createRouterUtils } from "@orpc/tanstack-query";

import type { router } from "@/api/routers";

declare global {
  var $client: RouterClient<typeof router> | undefined;
}

const link = new RPCLink({
  url: `${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/rpc`,
  plugins: [
    new BatchLinkPlugin({
      exclude: ({ path }) => path[0] === "sse",
      groups: [
        {
          condition: () => true,
          context: {},
        },
      ],
    }),
  ],
});

export const orpc: RouterClient<typeof router> =
  globalThis.$client ?? createORPCClient(link);

// export const orpc = createRouterUtils(client);

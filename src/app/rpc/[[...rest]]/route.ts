import { onError } from "@orpc/server";
import { BatchHandlerPlugin } from "@orpc/server/plugins";
import { RPCHandler } from "@orpc/server/fetch";

import { router } from "@/api/routers";

const rpcHandler = new RPCHandler(router, {
  plugins: [new BatchHandlerPlugin()],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

async function handleRequest(request: Request) {
  const { response } = await rpcHandler.handle(request, {
    prefix: "/rpc",
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;

import { os } from "@orpc/server";

import { db } from "@/api/db/client";

export const dbProviderMiddleware = os
  .$context<{ db?: typeof db }>()
  .middleware(async ({ context, next }) => {
    return next({
      context: {
        db: context.db ?? db,
      },
    });
  });

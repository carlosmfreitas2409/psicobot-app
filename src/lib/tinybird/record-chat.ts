import z from "zod";

import { tb } from "./client";

export const recordChat = tb.buildIngestEndpoint({
  datasource: "chat_events",
  event: z.object({
    timestamp: z.iso.datetime(),
    chat_id: z.string(),
    duration: z.number().int().nonnegative(),
  }),
});

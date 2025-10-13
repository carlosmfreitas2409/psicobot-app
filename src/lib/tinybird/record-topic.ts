import z from "zod";

import { tb } from "./client";

export const recordTopic = tb.buildIngestEndpoint({
  datasource: "topic_events",
  event: z.object({
    timestamp: z.iso.datetime(),
    chat_id: z.string(),
    topic: z.string(),
    sentiment: z.enum(["positive", "warning", "negative"]),
  }),
});

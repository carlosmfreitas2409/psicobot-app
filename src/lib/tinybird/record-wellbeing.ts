import z from "zod";

import { tb } from "./client";

export const recordWellbeing = tb.buildIngestEndpoint({
  datasource: "wellbeing_events",
  event: z.object({
    timestamp: z.iso.datetime(),
    chat_id: z.string(),
    level: z.enum(["healthy", "attention", "alert", "critical"]),
    score: z.number().min(0).max(10),
  }),
});

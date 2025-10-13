import z from "zod";

import { tb } from "./client";

export const recordRisk = tb.buildIngestEndpoint({
  datasource: "risk_events",
  event: z.object({
    timestamp: z.iso.datetime(),
    chat_id: z.string(),
    risk_level: z.enum(["critical", "high", "medium", "low"]),
  }),
});

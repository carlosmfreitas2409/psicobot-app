import z from "zod";

import { tb } from "./client";

export const recordEmotion = tb.buildIngestEndpoint({
  datasource: "emotion_events",
  event: z.object({
    timestamp: z.iso.datetime(),
    chat_id: z.string(),
    seq: z.number().int().nonnegative(),
    emotion: z.string(),
  }),
});



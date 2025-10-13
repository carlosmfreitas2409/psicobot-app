import z from "zod";

export const analyticsResponse = {
  totals: z.object({
    chats: z.number(),
    chatsLastMonth: z.number(),
    averageDuration: z
      .number()
      .nullable()
      .transform((v) => v ?? 0),
    averageDurationLastMonth: z
      .number()
      .nullable()
      .transform((v) => v ?? 0),
    // engagementRate: z.number(),
    // engagementRateLastMonth: z.number(),
    // wellbeingScore: z.number(),
  }),
  wellbeing_totals: z.object({
    healthy: z.number(),
    attention: z.number(),
    alert: z.number(),
    critical: z.number(),
  }),
  wellbeing_timeseries: z.object({
    start: z.string(),
    healthy: z.number(),
    attention: z.number(),
    alert: z.number(),
    critical: z.number(),
  }),
  chat_timeseries: z.object({
    start: z.string(),
    chats: z.number(),
  }),
  chat_totals: z.object({
    chats: z.number(),
  }),
  top_topics: z.object({
    name: z.string(),
    type: z.enum(["positive", "warning", "negative"]),
    amount: z.number(),
  }),
  risk_totals: z.object({
    critical: z.number(),
    high: z.number(),
    medium: z.number(),
    low: z.number(),
  }),
};

import { z } from "zod";

import { getAnalytics } from "@/lib/analytics/get-analytics";
import { analyticsResponse } from "@/lib/analytics/analytics-response";

import { pub } from "../orpc";

type AnalyticsOutput<T extends keyof typeof analyticsOutput> = z.infer<
  (typeof analyticsOutput)[T]
>;

const analyticsOutput = {
  totals: analyticsResponse.totals,
  emotions_distribution: z.array(analyticsResponse.emotions_distribution),
  chat_trajectory: analyticsResponse.chat_trajectory,
  wellbeing_totals: analyticsResponse.wellbeing_totals,
  risk_totals: analyticsResponse.risk_totals,
  wellbeing_timeseries: z.array(analyticsResponse.wellbeing_timeseries),
  chat_timeseries: z.array(analyticsResponse.chat_timeseries),
  chat_totals: analyticsResponse.chat_totals,
  top_topics: z.array(analyticsResponse.top_topics),
};

export const getAnalyticsRoute = <T extends keyof typeof analyticsResponse>(
  groupBy: T,
) =>
  pub
    .route({
      method: "GET",
      path: `/analytics/${groupBy}`,
      summary: "Get analytics",
      tags: ["Analytics"],
    })
    .input(
      z.object({
        dateFrom: z.iso.date().optional(),
        dateTo: z.iso.date().optional(),
        interval: z.string().optional(),
        timezone: z.string().optional().default("UTC"),
      }),
    )
    .handler(async ({ input }) => {
      const response = await getAnalytics({
        ...input,
        groupBy,
      });

      return response as AnalyticsOutput<T>;
    });

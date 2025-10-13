import { z } from "zod";

import { getAnalytics } from "@/lib/analytics/get-analytics";
import { analyticsResponse } from "@/lib/analytics/analytics-response";

import { pub } from "../orpc";

type AnalyticsOutput<T extends keyof typeof analyticsOutput> = z.infer<
  (typeof analyticsOutput)[T]
>;

const analyticsOutput = {
  totals: analyticsResponse.totals,
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

      // const t = totals.data[0] ?? {
      //   chats: 0,
      //   chatsLastMonth: 0,
      //   averageDuration: 0,
      //   averageDurationLastMonth: 0,
      //   engagementRate: 0,
      //   engagementRateLastMonth: 0,
      //   wellbeingScore: 0,
      //   wellbeingScoreLastMonth: 0,
      // };

      // // Compute engagement rate with employee count fallback if pipe not provided
      // let engagementRate = t.engagementRate;
      // if (!Number.isFinite(engagementRate) || engagementRate === 0) {
      //   const employees = COMPANY_EMPLOYEES;
      //   if (employees && employees > 0) {
      //     // Approximate: unique chats over window / employees
      //     engagementRate = Math.min(
      //       100,
      //       Math.round(((t.chats ?? 0) / employees) * 100),
      //     );
      //   }
      // }

      // // Well-being score (0-100) with weighting:
      // // base from wb mix; penalize risks; penalize negative topics; add trend and engagement bonuses
      // const wb = wbTotals.data[0] ?? {
      //   healthy: 0,
      //   attention: 0,
      //   alert: 0,
      //   critical: 0,
      // };
      // const totalWB = Math.max(
      //   1,
      //   wb.healthy + wb.attention + wb.alert + wb.critical,
      // );
      // const posRatio = wb.healthy / totalWB;
      // const attRatio = wb.attention / totalWB;
      // const alertRatio = wb.alert / totalWB;
      // const critRatio = wb.critical / totalWB;

      // // Risk penalties
      // const r = risks.data[0] ?? { critical: 0, high: 0, medium: 0, low: 0 };
      // const riskPenalty = Math.min(
      //   1,
      //   (r.critical * 3 + r.high * 2 + r.medium * 1) /
      //     Math.max(1, r.critical + r.high + r.medium + r.low),
      // );

      // // Topic sentiment penalty (negative dominates)
      // const topicCounts = topics.data.reduce(
      //   (acc, t) => {
      //     acc[t.type] = (acc[t.type] ?? 0) + t.amount;
      //     return acc;
      //   },
      //   {} as Record<string, number>,
      // );
      // const topicTotal =
      //   Object.values(topicCounts).reduce((a, b) => a + b, 0) || 1;
      // const negativeTopicRatio = (topicCounts["negative"] ?? 0) / topicTotal;

      // // Trend from wellbeing series (delta last vs first healthy ratio)
      // let trendBoost = 0;
      // if (wbSeries.data.length > 2) {
      //   const first = wbSeries.data[0];
      //   const last = wbSeries.data[wbSeries.data.length - 1];
      //   const firstTotal =
      //     (first.healthy ?? 0) +
      //     (first.attention ?? 0) +
      //     (first.alert ?? 0) +
      //     (first.critical ?? 0);
      //   const lastTotal =
      //     (last.healthy ?? 0) +
      //     (last.attention ?? 0) +
      //     (last.alert ?? 0) +
      //     (last.critical ?? 0);
      //   const firstHealthy = firstTotal ? (first.healthy ?? 0) / firstTotal : 0;
      //   const lastHealthy = lastTotal ? (last.healthy ?? 0) / lastTotal : 0;
      //   trendBoost = Math.max(-0.1, Math.min(0.1, lastHealthy - firstHealthy)); // -10%..+10%
      // }

      // const baseFromWB =
      //   posRatio * 0.7 +
      //   (1 - (attRatio * 0.2 + alertRatio * 0.6 + critRatio * 1.0)) * 0.3;

      // let wellbeingScore = baseFromWB;
      // wellbeingScore *= 1 - riskPenalty * 0.4; // up to -40%
      // wellbeingScore *= 1 - negativeTopicRatio * 0.3; // up to -30%
      // wellbeingScore *= 1 + (Math.max(0, engagementRate) / 100) * 0.1; // up to +10% bonus with engagement
      // wellbeingScore *= 1 + trendBoost; // +/-10%
      // wellbeingScore = Math.round(Math.max(0, Math.min(1, wellbeingScore)) * 100);

      // return {
      //   totals: {
      //     chats: t.chats ?? 0,
      //     averageDuration: Math.round(t.averageDuration ?? 0),
      //     engagementRate: Math.round(engagementRate),
      //     wellbeingScore,
      //   },
      //   wellbeing: {
      //     totals: {
      //       healthy: wb.healthy ?? 0,
      //       attention: wb.attention ?? 0,
      //       alert: wb.alert ?? 0,
      //       critical: wb.critical ?? 0,
      //     },
      //     timeseries: wbSeries.data.map((row) => ({
      //       period: row.start,
      //       healthy: row.healthy ?? 0,
      //       attention: row.attention ?? 0,
      //       alert: row.alert ?? 0,
      //       critical: row.critical ?? 0,
      //     })),
      //   },
      //   chats: {
      //     total: t.chats ?? 0,
      //     timeseries: chatsSeries.data.map((row) => ({
      //       period: row.start,
      //       chats: row.chats ?? 0,
      //     })),
      //   },
      //   wordClouds: topics.data.map((t) => ({
      //     name: t.name,
      //     type: t.type,
      //     amount: t.amount,
      //   })),
      //   risks: {
      //     critical: r.critical ?? 0,
      //     high: r.high ?? 0,
      //     medium: r.medium ?? 0,
      //     low: r.low ?? 0,
      //   },
      // };
    });

import { headers } from "next/headers";

import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { ORPCError } from "@orpc/client";

import { getAnalytics } from "@/lib/analytics/get-analytics";
import { resend } from "@/lib/resend";
import { auth } from "@/lib/auth";

import { AnalyticsReportEmail } from "@/components/emails/analytics-report";

import { db } from "../db/client";

import { pub } from "../orpc";
import { retry } from "../middlewares/retry";

export const sendAnalyticsReport = pub
  .route({
    method: "POST",
    path: "/reports/send",
    summary: "Send analytics report via email",
    tags: ["Reports"],
  })
  .use(retry({ times: 3 }))
  .input(
    z.object({
      recipientEmail: z.email(),
      dateFrom: z.iso.date().optional(),
      dateTo: z.iso.date().optional(),
      interval: z.string().optional(),
      timezone: z.string().optional().default("UTC"),
    }),
  )
  .output(
    z.object({
      success: z.boolean(),
    }),
  )
  .handler(async ({ input }) => {
    const { recipientEmail, dateFrom, dateTo, interval, timezone } = input;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Unauthorized",
      });
    }

    const organization = await db.query.organization.findFirst({
      where: (fields, { eq }) => eq(fields.id, session.user.organizationId),
    });

    if (!organization) {
      throw new ORPCError("NOT_FOUND", {
        message: "Organization not found",
      });
    }

    try {
      const analyticsParams = {
        dateFrom,
        dateTo,
        interval,
        timezone,
      };

      const [totalsData, wellbeingTotalsData, riskTotalsData, topTopicsData] =
        await Promise.all([
          getAnalytics({ ...analyticsParams, groupBy: "totals" }),
          getAnalytics({ ...analyticsParams, groupBy: "wellbeing_totals" }),
          getAnalytics({ ...analyticsParams, groupBy: "risk_totals" }),
          getAnalytics({ ...analyticsParams, groupBy: "top_topics" }),
        ]);

      const totals = totalsData as {
        chats: number;
        chatsLastMonth: number;
        averageDuration: number;
        averageDurationLastMonth: number;
        wellbeingScore: number;
        wellbeingScoreLastMonth: number;
      };

      const wellbeingTotals = wellbeingTotalsData as {
        healthy: number;
        healthyLastMonth: number;
      };

      const riskTotals = riskTotalsData as {
        critical: number;
        high: number;
        medium: number;
        low: number;
      };

      const topics = topTopicsData as Array<{
        name: string;
        amount: number;
        type: "positive" | "negative" | "warning";
      }>;

      const chatsLastMonthPercentage =
        totals.chats > 0
          ? totals.chatsLastMonth === 0
            ? 100
            : Math.round((totals.chatsLastMonth / totals.chats) * 100)
          : 0;

      const durationInMinutes = Math.round(totals.averageDuration / 60);
      const durationLastMonthInMinutes = Math.round(
        totals.averageDurationLastMonth / 60,
      );
      const durationChange = durationInMinutes - durationLastMonthInMinutes;

      const wellbeingScoreChange = (
        totals.wellbeingScore - totals.wellbeingScoreLastMonth
      ).toFixed(1);

      const healthyPercentage = wellbeingTotals.healthy;
      const healthyPercentageLastMonth = wellbeingTotals.healthyLastMonth;
      const healthyChange = (
        healthyPercentage - healthyPercentageLastMonth
      ).toFixed(1);

      const now = new Date();
      let periodStart: string;
      let periodEnd: string;

      if (dateFrom && dateTo) {
        periodStart = format(new Date(dateFrom), "dd/MM/yyyy", {
          locale: ptBR,
        });
        periodEnd = format(new Date(dateTo), "dd/MM/yyyy", { locale: ptBR });
      } else if (interval === "7d") {
        periodStart = format(
          new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          "dd/MM/yyyy",
          { locale: ptBR },
        );
        periodEnd = format(now, "dd/MM/yyyy", { locale: ptBR });
      } else if (interval === "90d") {
        periodStart = format(
          new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
          "dd/MM/yyyy",
          { locale: ptBR },
        );
        periodEnd = format(now, "dd/MM/yyyy", { locale: ptBR });
      } else {
        periodStart = format(
          new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          "dd/MM/yyyy",
          { locale: ptBR },
        );
        periodEnd = format(now, "dd/MM/yyyy", { locale: ptBR });
      }

      const emailData = {
        organizationName: organization.name,
        periodStart,
        periodEnd,
        metrics: {
          totalChats: totals.chats,
          totalChatsChange: `${chatsLastMonthPercentage >= 0 ? "+" : ""}${chatsLastMonthPercentage}%`,
          healthyPercentage: Math.round(healthyPercentage),
          healthyChange:
            healthyChange === "0.0"
              ? "0"
              : `${Number(healthyChange) >= 0 ? "+" : ""}${healthyChange}`,
          averageDuration: durationInMinutes,
          durationChange: `${durationChange >= 0 ? "+" : ""}${durationChange}`,
          wellbeingScore: Number(totals.wellbeingScore.toFixed(1)),
          wellbeingScoreChange:
            wellbeingScoreChange === "0.0"
              ? "0"
              : `${Number(wellbeingScoreChange) >= 0 ? "+" : ""}${wellbeingScoreChange}`,
        },
        riskLevels: {
          critical: riskTotals.critical,
          high: riskTotals.high,
          medium: riskTotals.medium,
          low: riskTotals.low,
        },
        topTopics: topics.slice(0, 5),
        recommendations: [],
        wellbeingDistribution: {
          wellbeing: 33,
          neutral: 24,
          concern: 22,
          suffering: 21,
        },
      };

      const result = await resend.emails.send({
        from: "Risko <risko@carlosmeduardo.dev>",
        to: recipientEmail,
        subject: `Relatório de Bem-Estar - ${periodStart} a ${periodEnd}`,
        react: AnalyticsReportEmail(emailData),
      });

      if (result.error) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: `Erro ao enviar email: ${result.error.message}`,
        });
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error sending analytics report:", error);

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: `Erro ao enviar relatório: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      });
    }
  });

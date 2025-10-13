import z from "zod";
import { generateObject, type CoreMessage, type LanguageModel } from "ai";

import { pub } from "../orpc";
import { env } from "@/env";
import { db } from "@/api/db/client";
import { chatReport, conversation } from "@/api/db/schema";
import { count } from "drizzle-orm";
import { randomUUID } from "node:crypto";

const ReportSchema = z.object({
  totals: z.object({
    totalInteractions: z.number().int().nonnegative(),
    engagementRate: z.number().min(0).max(100),
    avgDurationMinutes: z.number().min(0),
    wellbeingScore: z.number().min(0).max(10),
    changes: z.object({
      totalInteractionsDeltaPct: z.number(),
      engagementRateDeltaPct: z.number(),
      avgDurationDeltaMinutes: z.number(),
      wellbeingScoreDelta: z.number(),
    }),
    trends: z.object({
      totalInteractions: z.enum(["up", "down"]),
      engagementRate: z.enum(["up", "down"]),
      avgDurationMinutes: z.enum(["up", "down"]),
      wellbeingScore: z.enum(["up", "down"]),
    }),
  }),
  sentiment: z.object({
    breakdown: z.object({
      positivePct: z.number().min(0).max(100),
      neutralPct: z.number().min(0).max(100),
      anxiousPct: z.number().min(0).max(100),
      negativePct: z.number().min(0).max(100),
    }),
    timeseries: z.array(
      z.object({
        period: z.string(),
        positive: z.number(),
        neutral: z.number(),
      }),
    ),
  }),
  engagement: z.object({
    windowLabel: z.string(),
    total: z.number().int().nonnegative(),
    timeseries: z.array(z.object({ period: z.string(), chats: z.number() })),
  }),
  topicsCloud: z.array(
    z.object({
      name: z.string(),
      size: z.enum(["small", "medium", "large"]),
      sentiment: z.enum(["positive", "neutral", "negative", "warning"]),
    }),
  ),
  risks: z.object({
    critical: z.number().int().nonnegative(),
    high: z.number().int().nonnegative(),
    medium: z.number().int().nonnegative(),
    low: z.number().int().nonnegative(),
    summary: z.string(),
  }),
});

type Report = z.infer<typeof ReportSchema>;

function buildPromptFromMessages(
  messages: Array<{ role: "user" | "assistant"; text: string }>,
): CoreMessage[] {
  const conversation = messages
    .map((m) => `${m.role === "assistant" ? "Q" : "A"}: ${m.text}`)
    .join("\n");

  return [
    {
      role: "system",
      content:
        "Você é um analista de bem-estar organizacional. A partir de perguntas do assistente e respostas curtas (sim/não), gere um relatório estruturado para KPIs e gráficos do dashboard. Respeite rigorosamente o schema fornecido, mantendo coerência com o contexto e evitando inventar dados impossíveis.",
    },
    {
      role: "user",
      content: `Conversa (Q=assistente, A=usuário):\n${conversation}\n\nInstruções:\n- Converta os sinais binários (sim/não) em indicadores agregados.\n- Identifique temas (tópicos) recorrentes e seu tom (positivo/neutral/warning/negative).\n- Estime níveis de risco (critical/high/medium/low) quando houver padrões preocupantes (múltiplos "sim" para itens sensíveis).\n- Gere timeseries curtas coerentes (rótulo genérico como Dia 1..Dia N).\n- Percentuais devem somar ~100%.\n- Não inclua texto fora do JSON.`,
    },
  ];
}

function fallbackReport(
  messages: Array<{ role: "user" | "assistant"; text: string }>,
): Report {
  const total = messages.filter((m) => m.role === "user").length;
  const yes = messages.filter(
    (m) => m.role === "user" && /\b(sim|yes)\b/i.test(m.text),
  ).length;
  const no = messages.filter(
    (m) => m.role === "user" && /\b(não|nao|no)\b/i.test(m.text),
  ).length;

  const positivePct = Math.max(
    0,
    Math.min(100, Math.round((yes / Math.max(1, total)) * 60 + 20)),
  );
  const neutralPct = Math.max(0, Math.min(100, 100 - positivePct - 15));
  const anxiousPct = 10;
  const negativePct = Math.max(0, 100 - positivePct - neutralPct - anxiousPct);

  const points = Array.from(
    { length: Math.max(6, Math.min(12, total || 6)) },
    (_, i) => `Dia ${i + 1}`,
  );
  const engagementSeries = points.map((p, i) => ({
    period: p,
    chats: Math.max(1, Math.round((total || 10) * (0.6 + Math.sin(i) * 0.2))),
  }));
  const sentimentSeries = points.map((p, i) => ({
    period: p,
    positive: Math.max(5, Math.round(positivePct * 0.5 + i)),
    neutral: Math.max(5, Math.round(neutralPct * 0.3 + (points.length - i))),
  }));

  const yesBias = yes > no;

  return {
    totals: {
      totalInteractions: total,
      engagementRate: Math.round((yes / Math.max(1, total)) * 100),
      avgDurationMinutes: 7.5,
      wellbeingScore: Math.round((yesBias ? 7.2 : 6.5) * 10) / 10,
      changes: {
        totalInteractionsDeltaPct: 12.5,
        engagementRateDeltaPct: yesBias ? 5.2 : -3.1,
        avgDurationDeltaMinutes: -0.8,
        wellbeingScoreDelta: yesBias ? 0.3 : -0.2,
      },
      trends: {
        totalInteractions: "up",
        engagementRate: yesBias ? "up" : "down",
        avgDurationMinutes: "down",
        wellbeingScore: yesBias ? "up" : "down",
      },
    },
    sentiment: {
      breakdown: { positivePct, neutralPct, anxiousPct, negativePct },
      timeseries: sentimentSeries,
    },
    engagement: {
      windowLabel: "esta semana",
      total: total,
      timeseries: engagementSeries,
    },
    topicsCloud: [
      {
        name: "Carga de trabalho",
        size: "large",
        sentiment: no > yes ? "negative" : "neutral",
      },
      {
        name: "Ambiente",
        size: "large",
        sentiment: yesBias ? "positive" : "neutral",
      },
      { name: "Liderança", size: "medium", sentiment: "neutral" },
      { name: "Saúde mental", size: "medium", sentiment: "warning" },
      { name: "Comunicação", size: "small", sentiment: "neutral" },
    ],
    risks: {
      critical: Math.max(0, Math.round(total * 0.02)),
      high: Math.max(0, Math.round(total * 0.08)),
      medium: Math.max(0, Math.round(total * 0.2)),
      low: Math.max(0, Math.round(total * 0.3)),
      summary:
        no > yes
          ? "Atenção a sinais de sobrecarga e clima."
          : "Risco controlado no período.",
    },
  };
}

export const createChatReport = pub
  .route({
    method: "POST",
    path: "/chats/reports",
    summary: "Generate a new chat report",
    tags: ["Reports"],
  })
  .input(
    z.object({
      messages: z.array(
        z.object({
          role: z.enum(["user", "assistant"]),
          text: z.string(),
        }),
      ),
    }),
  )
  .output(ReportSchema)
  .handler(async ({ input }) => {
    const { messages } = input;

    const useAI = Boolean(env.OPENAI_API_KEY);

    let report: Report;
    if (useAI) {
      try {
        const { createOpenAI } = (await import("@ai-sdk/openai")) as {
          createOpenAI: (config?: {
            apiKey?: string;
          }) => (model: string) => LanguageModel;
        };
        const openai = createOpenAI({ apiKey: env.OPENAI_API_KEY });
        const { object } = await generateObject({
          model: openai("gpt-4o-mini"),
          messages: buildPromptFromMessages(messages),
          schema: ReportSchema,
          temperature: 0.2,
        });
        report = object as Report;
      } catch {
        report = fallbackReport(messages);
      }
    } else {
      report = fallbackReport(messages);
    }

    const totalMessages = messages.filter((m) => m.role === "user").length;
    const yesCount = messages.filter(
      (m) => m.role === "user" && /\b(sim|yes)\b/i.test(m.text),
    ).length;
    const noCount = messages.filter(
      (m) => m.role === "user" && /\b(não|nao|no)\b/i.test(m.text),
    ).length;

    const conversationId = randomUUID();
    await db.insert(conversation).values({
      id: conversationId,
      messagesCount: totalMessages,
      yesCount,
      noCount,
    });

    const reportId = randomUUID();
    await db.insert(chatReport).values({
      id: reportId,
      conversationId,
      reportJson: report as unknown as object,
      engagementRate: Math.round(report.totals.engagementRate),
      wellbeingScore: report.totals.wellbeingScore,
      riskCritical: report.risks.critical,
      riskHigh: report.risks.high,
      riskMedium: report.risks.medium,
      riskLow: report.risks.low,
    });

    const [{ value: totalConversations }] = await db
      .select({ value: count() })
      .from(conversation);

    return {
      ...report,
      totals: {
        ...report.totals,
        totalInteractions: totalConversations,
      },
    };
  });

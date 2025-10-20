import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import { z } from "zod";

import { env } from "@/env";

import { getAnalytics } from "@/lib/analytics/get-analytics";

import { pub } from "../orpc";
import { getRedisClient } from "../redis";

const RECOMMENDATIONS_KEY = "recommendations";
const RECOMMENDATIONS_TTL = 60 * 60 * 24; // 24 hours

const recommendation = z.object({
  title: z.string().min(3),
  description: z.string().min(8),
  priority: z.enum(["high", "medium", "low"]),
  tag: z.enum(["risks", "wellbeing", "engagement", "topics"]).optional(),
});

export const generateRecommendations = pub
  .route({
    method: "POST",
    path: "/recommendations",
    summary: "Generate AI-powered recommendations",
    tags: ["Recommendations"],
  })
  .input(
    z.object({
      dateFrom: z.iso.date().optional(),
      dateTo: z.iso.date().optional(),
      interval: z.string().optional(),
      timezone: z.string().optional().default("UTC"),
    }),
  )
  .output(z.array(recommendation))
  .handler(async ({ input }) => {
    const redis = getRedisClient();

    const recommendations = await redis.get(RECOMMENDATIONS_KEY);
    const ttl = await redis.ttl(RECOMMENDATIONS_KEY);

    if (recommendations && ttl > 0) {
      return JSON.parse(recommendations);
    }

    const [totals, wellbeingTotals, riskTotals, topTopics] = await Promise.all([
      getAnalytics({ ...input, groupBy: "totals" }),
      getAnalytics({ ...input, groupBy: "wellbeing_totals" }),
      getAnalytics({ ...input, groupBy: "risk_totals" }),
      getAnalytics({ ...input, groupBy: "top_topics" }),
    ]);

    const summary = {
      totals,
      wellbeing: wellbeingTotals,
      risks: riskTotals,
      topTopics: (
        topTopics as Array<{ name: string; type: string; amount: number }>
      ).slice(0, 10),
    };

    const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY });

    const { object } = await generateObject({
      model: openrouter("google/gemini-2.5-flash"),
      schema: z.object({
        recommendations: z.array(recommendation).min(3).max(6),
      }),
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Você é consultor de bem-estar organizacional. Gere recomendações curtas, acionáveis e éticas. Evite PII. Máximo de 3 recomendações. Descrição máxima de 150 caracteres.",
        },
        {
          role: "user",
          content: `Dados agregados:\n${JSON.stringify(summary)}\n\nInstrua: produza 3 a 6 recomendações com (title, description, priority: high|medium|low, tag: risks|wellbeing|engagement|topics). Seja específico (ex.: revisar metas, ciclo de 1:1, campanha anti-assédio, reforço de pausas).`,
        },
      ],
    });

    const recos = (object as { recommendations: Array<unknown> })
      .recommendations;

    const parsed = z.array(recommendation).parse(recos);

    await redis.setex(
      RECOMMENDATIONS_KEY,
      RECOMMENDATIONS_TTL,
      JSON.stringify(parsed),
    );

    return parsed;
  });

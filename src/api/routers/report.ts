import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createId } from "@paralleldrive/cuid2";
import { ORPCError } from "@orpc/client";
import { z } from "zod";

import { env } from "@/env";

import { recordChat } from "@/lib/tinybird/record-chat";
import { recordWellbeing } from "@/lib/tinybird/record-wellbeing";
import { recordRisk } from "@/lib/tinybird/record-risk";
import { recordTopic } from "@/lib/tinybird/record-topic";
import { recordEmotion } from "@/lib/tinybird/record-emotion";

import { pub } from "../orpc";

const aiSchema = z.object({
  wellbeing: z.object({
    level: z.enum(["healthy", "attention", "alert", "critical"]),
    score: z.number().min(0).max(10),
  }),
  risk: z.object({
    level: z.enum(["critical", "high", "medium", "low"]),
  }),
  topics: z
    .array(
      z.object({
        topic: z.string(),
        polarity: z.enum(["risk", "protective"]),
        status: z.enum(["present", "absent"]),
      }),
    )
    .max(20)
    .default([]),
});

export const createChatReport = pub
  .route({
    method: "POST",
    path: "/chats/reports",
    summary: "Generate a new chat report",
    tags: ["Chat"],
  })
  .input(
    z.object({
      duration: z.number(),
      messages: z.array(
        z.object({
          role: z.enum(["user", "assistant"]),
          text: z.string(),
          emotion: z.string().nullish(),
        }),
      ),
    }),
  )
  .handler(async ({ input }) => {
    const { messages, duration } = input;

    const timestamp = new Date().toISOString();
    const chatId = createId();

    const transcript = messages
      .map((m) => `${m.role === "assistant" ? "Q" : "A"}: ${m.text}`)
      .join("\n");

    let signals: z.infer<typeof aiSchema>;

    try {
      const openrouter = createOpenRouter({
        apiKey: env.OPENROUTER_API_KEY,
      });

      const { object } = await generateObject({
        model: openrouter("google/gemini-2.5-flash"),
        schema: aiSchema,
        messages: [
          {
            role: "system",
            content:
              "Você é um analista. Com base em perguntas (Q) e respostas curtas (ex: A = sim/não), gere indicadores agregados. Para tópicos, NÃO use uma lista fixa: extraia temas dinamicamente e, para cada tema, informe: polarity = risk|protective (se o tema for um risco ou um fator de proteção) e status = present|absent (se o tema está presente ou foi negado). Não retorne texto livre.",
          },
          {
            role: "user",
            content: `Conversa (Q/A):\n${transcript}\n\nRetorne JSON com: wellbeing.level, wellbeing.score (0-10), risk.level, topics[{topic, polarity, status}]`,
          },
        ],
        temperature: 0.2,
      });

      signals = aiSchema.parse(object);
    } catch {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to generate signals",
      });
    }

    function mapTopic(t: {
      topic: string;
      polarity: "risk" | "protective";
      status: "present" | "absent";
    }) {
      if (t.polarity === "risk" && t.status === "present") {
        return { name: t.topic, type: "negative" as const };
      }

      if (t.polarity === "risk" && t.status === "absent") {
        return {
          name: `Sem ${t.topic.toLowerCase()}`.trim(),
          type: "positive" as const,
        };
      }

      if (t.polarity === "protective" && t.status === "present") {
        return { name: t.topic, type: "positive" as const };
      }

      return {
        name: `Falta ${t.topic.toLowerCase()}`.trim(),
        type: "warning" as const,
      };
    }

    const userEmotionEvents = messages
      .map((m, idx) => ({ ...m, idx }))
      .filter(
        (m) =>
          m.role === "user" &&
          typeof m.emotion === "string" &&
          m.emotion.length > 0,
      )
      .map((m, seqIndex) => ({
        timestamp,
        chat_id: chatId,
        seq: seqIndex,
        emotion: (m.emotion as string).toLowerCase(),
      }));

    await Promise.all([
      recordChat({
        timestamp,
        chat_id: chatId,
        duration: Math.round(duration),
      }),
      recordWellbeing({
        timestamp,
        chat_id: chatId,
        level: signals.wellbeing.level,
        score: signals.wellbeing.score,
      }),
      recordRisk({
        timestamp,
        chat_id: chatId,
        risk_level: signals.risk.level,
      }),
      signals.topics.length > 0 &&
        recordTopic(
          signals.topics.map((t) => {
            const mapped = mapTopic(t);
            return {
              timestamp,
              chat_id: chatId,
              topic: mapped.name,
              sentiment: mapped.type,
            };
          }),
        ),
      userEmotionEvents.length > 0 && recordEmotion(userEmotionEvents),
    ]);

    return { chatId };
  })
  .callable({
    context: {},
  });

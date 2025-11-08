import {
  convertToModelMessages,
  generateObject,
  streamText,
  type ModelMessage,
  type UIMessage,
} from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";

import { call, streamToEventIterator } from "@orpc/server";

import { env } from "@/env";

import { pub } from "../orpc";

import { createChatReport } from "./report";
import { listQuestions, type Question } from "./questions";

const TEMPERATURE = 0.2;
const MIN_QUESTIONS = 6;
const MAX_QUESTIONS = 20;

const INITIAL_THEMES = [
  "carga e ritmo de trabalho (demandas, prazos, horas extras)",
  "autonomia e controle sobre tarefas e prioridades",
  "suporte da equipe e da liderança",
  "comunicação, clima e segurança psicológica",
  "reconhecimento e justiça",
  "limites trabalho-vida e pausas/recuperação",
  "ambiente físico e ergonomia",
  "clareza de papéis e metas",
  "conflitos e interações difíceis",
] as const;

const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY });

let lastInitialTheme: (typeof INITIAL_THEMES)[number] | null = null;

function getModel() {
  return openrouter("google/gemini-2.5-flash");
}

function pickInitialTheme() {
  const pool = INITIAL_THEMES.filter((theme) => theme !== lastInitialTheme);
  const choice =
    pool[Math.floor(Math.random() * pool.length)] ?? INITIAL_THEMES[0];

  lastInitialTheme = choice;

  return choice;
}

function maybePickCustomQuestion(customQuestions: Question[]) {
  if (!customQuestions.length) {
    return null;
  }

  const weighted = customQuestions
    .map((question) => ({
      question,
      probability:
        question.frequency === "frequent"
          ? 0.3
          : question.frequency === "occasional"
            ? 0.15
            : 0.05,
    }))
    .filter((entry) => Math.random() < entry.probability);

  if (!weighted.length) {
    return null;
  }

  const [top] = weighted;

  return top?.question ?? null;
}

function getSystemPrompt() {
  return [
    "Você é um assistente neutro que conduz uma conversa anônima e segura.",
    "Objetivo: mapear fatores psicossociais de BEM-ESTAR NO TRABALHO por meio de perguntas curtas, claras e objetivas.",
    "Não assuma sofrimento. Não use linguagem clínica. Não ofereça diagnósticos, pareceres terapêuticos ou conselhos médicos.",
    "Evite PII; foque em como aspectos do trabalho (carga, controle, suporte, comunicação, reconhecimento, pausas, ambiente, conflitos) afetam o bem-estar.",
    "Se houver sinais de crise/risco imediato, forneça orientação de segurança e canais de ajuda, sem se posicionar como profissional.",
    "Respostas: 1-3 frases, linguagem simples, tom respeitoso e objetivo.",
    "A conversa PODE transitar por diferentes temas relacionados ao trabalho; avance para novos focos naturalmente conforme as respostas (não fique preso a um único tema).",
    "Cada pergunta deve buscar EFEITO no bem-estar (ex.: estresse, cansaço, motivação, humor, sono), junto de contexto e, quando possível, frequência/impacto.",
    "Evite perguntas de inventário (ex.: 'quais ferramentas você usa?'). Se mencionar ferramentas/recursos, conecte ao bem-estar (se ajudam ou geram atrito/estresse).",
  ].join("\n");
}

function buildControlPrompt() {
  return [
    "Nunca peça PII, mantenha 1-3 frases, e evite conselhos médicos.",
    "Regra de turnos: responda com no máximo 1 frase breve e termine com exatamente 1 pergunta objetiva (apenas 1), contendo '?'.",
    "Varie o foco ao longo da conversa quando fizer sentido (rotina, carga, comunicação, ambiente, recursos, metas, pausas/bem-estar). Evite repetir o mesmo tema/pergunta se já coletou informação suficiente.",
    "Evite perguntas de inventário neutras (ex.: 'Quais ferramentas você usa?'). Em vez disso, conecte ao bem-estar: pergunte se facilitam/atrapalham, se geram atrito/estresse ou aliviam carga.",
  ].join("\n");
}

function getInitialQuestionPrompt(customQuestions: Question[]) {
  const theme = pickInitialTheme();
  const customQuestion = maybePickCustomQuestion(customQuestions);

  const lines = [
    "Saudação neutra curta (3-5 palavras).",
    `Em seguida, faça exatamente 1 pergunta aberta, clara e objetiva sobre o tema: ${theme}, PEDINDO o efeito no bem-estar (ex.: estresse/cansaço/motivação) e, quando possível, frequência/impacto.`,
    "Varie a formulação (não repita perguntas anteriores nem clichês); evite usar a frase 'Como tem sido sua rotina de trabalho recentemente?'.",
    "Evite perguntas de inventário (ex.: 'quais ferramentas você usa?'). Se mencionar recursos/ferramentas, conecte ao bem-estar (se ajudam ou geram atrito/estresse).",
    "Após a primeira pergunta, você pode mudar de tema naturalmente conforme as respostas (a conversa não precisa ficar num único assunto).",
    "Não mencione explicitamente o tema; apenas pergunte. Sem PII, sem linguagem clínica, seguindo CONTROLE.",
  ];

  if (customQuestion?.question?.trim()) {
    lines.push(
      `Se possível, REFORMULE e incorpore a IDEIA desta pergunta cadastrada (corrigindo ortografia/clareza e mantendo foco em bem-estar), sem dizer que foi cadastrada: "${customQuestion.question}".`,
    );
  }

  return lines.join("\n");
}

function getClosingPrompt() {
  return [
    "Finalize a conversa agora com uma mensagem neutra e breve (1-2 frases), sem perguntas. Resuma de forma objetiva o que foi compartilhado e indique próximos passos/apoio sem PII e sem linguagem clínica.",
  ].join("\n");
}

function getMessageText(message: ModelMessage) {
  const { content } = message;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) =>
        "text" in part && typeof part.text === "string" ? part.text : "",
      )
      .filter(Boolean)
      .join("\n");
  }

  return "";
}

function isQuestion(text: string) {
  const normalized = text.normalize("NFKC").toLowerCase();

  return /\?\s*$|\b(como|quando|onde|por que|porquê|qual|quais|você poderia|você sabe|você pode)\b/.test(
    normalized,
  );
}

async function isSufficientToClose(
  model: ReturnType<typeof getModel>,
  transcript: string,
  questionsAsked: number,
) {
  if (!transcript.trim()) {
    return false;
  }

  const { object } = await generateObject({
    model,
    schema: z.object({
      sufficient: z.boolean().default(false),
      reasons: z.array(z.string()).max(5).default([]),
    }),
    temperature: 0,
    messages: [
      {
        role: "system",
        content: [
          "Avalie se já há informação suficiente para indicadores organizacionais (temas, contexto, frequência/impacto, sinais de risco/bem-estar) sem PII.",
          `Perguntas do assistente: ${questionsAsked} (min=${MIN_QUESTIONS}).`,
          "Responda JSON com { sufficient: boolean, reasons: string[] } sem texto adicional.",
        ].join("\n"),
      },
      {
        role: "user",
        content: `Transcrição (Q=pergunta do assistente; A=resposta do usuário):\n${transcript}`,
      },
    ],
  });

  return object.sufficient;
}

function extractTimestamp(metadata: unknown): number | null {
  if (!metadata || typeof metadata !== "object" || !("createdAt" in metadata)) {
    return null;
  }

  if (typeof metadata.createdAt === "number") {
    return metadata.createdAt;
  }

  if (metadata.createdAt instanceof Date) {
    return metadata.createdAt.getTime();
  }

  return null;
}

function getEarliestTimestamp(messages: UIMessage[]) {
  const timestamps = messages
    .map((message) => extractTimestamp(message.metadata))
    .filter((timestamp): timestamp is number => timestamp !== null);

  if (!timestamps.length) {
    return null;
  }

  return Math.min(...timestamps);
}

function isStartIntent(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") {
    return false;
  }

  return ((metadata as { intent?: string }).intent ?? null) === START_INTENT;
}

function buildReportMessages(messages: UIMessage[]) {
  return messages
    .filter(
      (message): message is UIMessage & { role: "user" | "assistant" } =>
        (message.role === "assistant" || message.role === "user") &&
        !isStartIntent(message.metadata ?? null),
    )
    .map((message) => ({
      role: message.role,
      text: message.parts
        .map((part) =>
          part?.type === "text" && typeof part.text === "string"
            ? part.text
            : "",
        )
        .filter(Boolean)
        .join("\n")
        .trim(),
    }))
    .filter((message) => message.text.trim().length > 0);
}

const START_INTENT = "start";

export const createChat = pub
  .route({
    method: "POST",
    path: "/chat",
    summary: "Create a chat",
    tags: ["Chat"],
  })
  .input(
    z.object({
      id: z.string().optional(),
      trigger: z.any().optional(),
      messages: z.array(
        z.object({
          id: z.string(),
          role: z.enum(["system", "user", "assistant"]),
          parts: z.any(),
          metadata: z.any().optional(),
        }),
      ),
    }),
  )
  .handler(async ({ input }) => {
    const model = getModel();

    const sanitizedMessages = (input.messages ?? []).filter(
      (message) => !isStartIntent(message.metadata),
    );

    const requestMessages = convertToModelMessages(sanitizedMessages);

    const conversation = requestMessages.filter(
      (message) => message.role === "assistant" || message.role === "user",
    );

    const assistantMessages = conversation.filter(
      (message) => message.role === "assistant",
    );
    const userMessages = conversation.filter(
      (message) => message.role === "user",
    );

    if (assistantMessages.length === 0 && userMessages.length === 0) {
      const questions = await listQuestions({ slug: "default" });
      const initialPrompt = getInitialQuestionPrompt(
        questions.filter((question) => question.status === "approved"),
      );

      const result = streamText({
        model,
        temperature: TEMPERATURE,
        messages: [
          { role: "system", content: getSystemPrompt() },
          { role: "system", content: buildControlPrompt() },
          { role: "user", content: initialPrompt },
        ],
      });

      return streamToEventIterator(
        result.toUIMessageStream({
          messageMetadata: ({ part }) => {
            if (part.type === "start") {
              return {
                createdAt: Date.now(),
              };
            }
          },
        }),
      );
    }

    const transcript = conversation
      .map((message) => {
        const text = getMessageText(message);

        if (!text.trim()) {
          return "";
        }

        const prefix = message.role === "assistant" ? "Q" : "A";
        return `${prefix}: ${text}`;
      })
      .filter(Boolean)
      .join("\n");

    const lastUserMessage = [...conversation]
      .reverse()
      .find((message) => message.role === "user");
    const lastUserText = lastUserMessage ? getMessageText(lastUserMessage) : "";

    const questionsAsked = assistantMessages.length;
    const maxLimitReached = questionsAsked >= MAX_QUESTIONS;
    const minLimitReached = questionsAsked >= MIN_QUESTIONS;

    let sufficientToCloseFlag = false;
    if (minLimitReached && transcript) {
      sufficientToCloseFlag = await isSufficientToClose(
        model,
        transcript,
        questionsAsked,
      );
    }

    const shouldClose =
      (minLimitReached && sufficientToCloseFlag) ||
      (maxLimitReached && !isQuestion(lastUserText));

    if (shouldClose) {
      const startedAt = getEarliestTimestamp(sanitizedMessages) ?? Date.now();

      const result = streamText({
        model,
        temperature: TEMPERATURE,
        messages: [
          { role: "system", content: getSystemPrompt() },
          { role: "system", content: buildControlPrompt() },
          { role: "user", content: getClosingPrompt() },
        ],
      });

      const stream = result.toUIMessageStream({
        messageMetadata: ({ part }) => {
          if (part.type === "start") {
            return {
              createdAt: Date.now(),
            };
          }
        },
        onFinish: async ({ messages: streamedMessages }) => {
          try {
            const completedMessages = buildReportMessages(streamedMessages);

            if (!completedMessages.length) {
              return;
            }

            const earliestTimestamp =
              getEarliestTimestamp(streamedMessages) ?? startedAt;

            const durationInSeconds = Math.max(
              0,
              Math.round((Date.now() - earliestTimestamp) / 1000),
            );

            await createChatReport({
              duration: durationInSeconds,
              messages: completedMessages.map((message) => ({
                role: message.role,
                text: message.text,
              })),
            });
          } catch (error) {
            console.error("Failed to create chat report:", error);
          }
        },
      });

      return streamToEventIterator(stream);
    }

    const result = streamText({
      model,
      temperature: TEMPERATURE,
      messages: [
        { role: "system", content: getSystemPrompt() },
        ...conversation,
        { role: "system", content: buildControlPrompt() },
      ],
    });

    return streamToEventIterator(
      result.toUIMessageStream({
        messageMetadata: ({ part }) => {
          if (part.type === "start") {
            return {
              createdAt: Date.now(),
            };
          }
        },
      }),
    );
  });

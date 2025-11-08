import { headers } from "next/headers";

import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { ORPCError } from "@orpc/client";
import { count, eq } from "drizzle-orm";
import { z } from "zod";

import { env } from "@/env";

import { auth } from "@/lib/auth";

import { db } from "../db/client";
import { question } from "../db/schema";

import { pub } from "../orpc";

export type Question = typeof question.$inferSelect;

const VALIDATION_PROMPT = `Você é um validador de perguntas para um sistema de escuta psicossocial corporativa.
Sua função é analisar perguntas customizadas criadas por empresas e determinar se são
seguras, éticas e respeitam o anonimato dos colaboradores.

CONTEXTO DO SISTEMA:
- Um robô animatrônico conversa anonimamente com colaboradores sobre bem-estar emocional
- As conversas são completamente anônimas e confidenciais
- O objetivo é mapear saúde mental organizacional, não investigar indivíduos
- Empresas podem criar perguntas customizadas, mas precisam ser validadas

CRITÉRIOS DE VALIDAÇÃO:

✅ APROVAR se a pergunta:
1. É neutra e não tendenciosa
2. Não identifica pessoas ou grupos pequenos (<10 pessoas)
3. Não é invasiva sobre vida pessoal
4. Está relacionada ao ambiente de trabalho
5. Não contém viés discriminatório
6. Permite respostas honestas sem medo de retaliação
7. É clara e objetiva

❌ REJEITAR se a pergunta:
1. Menciona nomes de pessoas específicas
2. Identifica grupos muito pequenos (ex: "quem viajou para X")
3. É tendenciosa ou induz resposta
4. Invade privacidade pessoal não relacionada ao trabalho
5. Contém discriminação (raça, gênero, religião, etc.)
6. Pode ser usada para rastrear indivíduos
7. É vaga ou confusa

EXEMPLOS DE CATEGORIAS PERMITIDAS:
- Processos e ferramentas de trabalho
- Ambiente e cultura organizacional
- Benefícios e políticas da empresa
- Comunicação interna
- Desenvolvimento profissional
- Carga de trabalho e equilíbrio
- Liderança (de forma genérica)

EXEMPLOS DE CATEGORIAS BLOQUEADAS:
- Perguntas sobre pessoas específicas
- Vida pessoal não relacionada ao trabalho
- Questões que identifiquem grupos pequenos
- Características protegidas por lei
- Investigações direcionadas

RESPONDA NO SEGUINTE FORMATO:
- approved: true/false
- reason: Quando rejeito, explique clara e concisa o motivo da rejeição (máximo de 100 caracteres)`;

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

async function validateQuestionInBackground(
  questionId: string,
  questionText: string,
): Promise<void> {
  try {
    const result = await generateObject({
      model: openrouter("google/gemini-2.5-flash"),
      schema: z.object({
        approved: z.boolean(),
        reason: z.string().optional(),
      }),
      system: VALIDATION_PROMPT,
      prompt: [
        "Analise a seguinte pergunta e determine se deve ser aprovada ou rejeitada:",
        `Pergunta: "${questionText}"`,
        "Retorne sua análise em formato estruturado.",
      ].join("\n"),
    });

    const validation = result.object;

    await db
      .update(question)
      .set({
        status: validation.approved ? "approved" : "rejected",
        rejectionReason: validation.approved ? null : validation.reason,
      })
      .where(eq(question.id, questionId));
  } catch (error) {
    console.error(`Failed to validate question ${questionId}:`, error);
  }
}

export const getTotals = pub
  .route({
    method: "GET",
    path: "/questions/totals",
    summary: "Get totals",
    tags: ["Questions"],
  })
  .output(
    z.object({
      approved: z.number(),
      rejected: z.number(),
      pending: z.number(),
    }),
  )
  .handler(async () => {
    const [approved, rejected, pending] = await Promise.all([
      db
        .select({ count: count() })
        .from(question)
        .where(eq(question.status, "approved")),
      db
        .select({ count: count() })
        .from(question)
        .where(eq(question.status, "rejected")),
      db
        .select({ count: count() })
        .from(question)
        .where(eq(question.status, "pending")),
    ]);

    return {
      approved: approved[0].count,
      rejected: rejected[0].count,
      pending: pending[0].count,
    };
  });

export const listQuestions = pub
  .route({
    method: "GET",
    path: "/questions",
    summary: "List questions",
    tags: ["Questions"],
  })
  .input(
    z.object({
      slug: z.string(),
    }),
  )
  .output(
    z.array(
      z.object({
        id: z.string(),
        question: z.string(),
        frequency: z.enum(["rare", "occasional", "frequent"]),
        status: z.enum(["approved", "rejected", "pending"]),
        rejectionReason: z.string().nullable(),
        organizationId: z.string(),
        authorId: z.string(),
        author: z.object({
          id: z.string(),
          name: z.string(),
        }),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    ),
  )
  .handler(async () => {
    // const organization = await db.query.organization.findFirst({
    //   where: (fields, { eq }) => eq(fields.slug, input.slug),
    // });

    // if (!organization) {
    //   throw new ORPCError("NOT_FOUND", {
    //     message: "Organization not found",
    //   });
    // }

    const questions = await db.query.question.findMany({
      // where: (fields, { eq }) => eq(fields.organizationId, organization.id),
      with: {
        author: true,
      },
    });

    return questions;
  })
  .callable({
    context: {},
  });

export const createQuestion = pub
  .route({
    method: "POST",
    path: "/questions",
    summary: "Create question",
    tags: ["Questions"],
  })
  .input(
    z.object({
      question: z.string(),
      frequency: z.enum(["rare", "occasional", "frequent"]),
    }),
  )
  .output(
    z.object({
      id: z.string(),
      status: z.enum(["pending"]),
    }),
  )
  .handler(async ({ input }) => {
    const organization = await db.query.organization.findFirst();

    if (!organization) {
      throw new ORPCError("NOT_FOUND", {
        message: "Organization not found",
      });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (
      !session ||
      !session.user ||
      typeof (session.user as { id?: string }).id !== "string"
    ) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Unauthorized",
      });
    }

    const [newQuestion] = await db
      .insert(question)
      .values({
        organizationId: organization.id,
        question: input.question,
        frequency: input.frequency,
        status: "pending",
        authorId: (session.user as { id: string }).id,
      })
      .returning({ id: question.id });

    validateQuestionInBackground(newQuestion.id, input.question).catch(
      (error) => {
        console.error("Background validation failed:", error);
      },
    );

    return { id: newQuestion.id, status: "pending" };
  });

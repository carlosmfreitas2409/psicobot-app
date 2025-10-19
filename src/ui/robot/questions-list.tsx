import { Clock, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

import { orpc } from "@/lib/orpc";

import {
  Card,
  CardAction,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

import { QuestionIcon } from "./question-icon";
import { AddQuestionDialog } from "./add-question-dialog";

const frequencyToLabel = {
  rare: "Raro",
  occasional: "Ocasional",
  frequent: "Frequente",
} as const;

const statusToLabel = {
  approved: "Aprovado",
  pending: "Pendente",
  rejected: "Rejeitado",
} as const;

export async function QuestionsList() {
  const questions = await orpc.questions.list({ slug: "example" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perguntas</CardTitle>
        <CardDescription className="mt-1">
          Adicione perguntas para o robô avaliar a satisfação dos membros da
          equipe.
        </CardDescription>

        <CardAction>
          <AddQuestionDialog />
        </CardAction>
      </CardHeader>

      <CardContent>
        {questions.length === 0 && (
          <Empty className="md:p-4 gap-1">
            <EmptyTitle>Nenhuma pergunta encontrada</EmptyTitle>
            <EmptyDescription>
              Adicione perguntas para o robô avaliar a satisfação dos membros da
              equipe.
            </EmptyDescription>
          </Empty>
        )}

        {questions.length > 0 && (
          <div className="space-y-3">
            {questions.map((question) => (
              <Card
                key={question.id}
                className="relative overflow-hidden px-6 py-4"
              >
                <div
                  className={cn(
                    "absolute top-0 left-0 bottom-0 w-2 rounded-xl",
                    question.status === "approved" && "bg-green-500",
                    question.status === "pending" && "bg-yellow-500",
                    question.status === "rejected" && "bg-red-500",
                  )}
                />

                <div className="flex items-start gap-3">
                  <QuestionIcon status={question.status} />

                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {frequencyToLabel[question.frequency]}
                      </Badge>

                      <Badge className="text-xs border-0">
                        {statusToLabel[question.status]}
                      </Badge>
                    </div>

                    <p className="text-base font-medium text-foreground">
                      {question.question}
                    </p>

                    {question.status === "approved" && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Criada por {question.author.name}</span>
                        <span>•</span>
                        <span>
                          {new Date(question.createdAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                      </div>
                    )}

                    {question.status === "pending" && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Aguardando validação automática</span>
                      </div>
                    )}

                    {question.status === "rejected" && (
                      <div className="flex items-start gap-2 rounded-lg bg-red-100 p-3">
                        <AlertCircle className="size-4 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-critical">
                            Motivo da Rejeição
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {question.rejectionReason ?? "Motivo não informado"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

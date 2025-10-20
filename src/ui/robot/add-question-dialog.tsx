"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Plus } from "lucide-react";

import { orpc } from "@/lib/orpc";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Frequency = "rare" | "occasional" | "frequent";

export function AddQuestionDialog() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [question, setQuestion] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("rare");

  async function handleSave() {
    setIsLoading(true);

    await orpc.questions.create({ question, frequency });

    setIsLoading(false);

    setOpen(false);
    setQuestion("");
    setFrequency("rare");

    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Nova pergunta
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova pergunta customizada</DialogTitle>
          <DialogDescription>
            Crie uma pergunta específica para o contexto da sua organização. A
            IA validará se ela é apropriada.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Pergunta</Label>
            <Textarea
              id="question"
              placeholder="Ex: Como você avalia os treinamentos oferecidos pela empresa?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Evite mencionar pessoas específicas ou grupos pequenos
            </p>
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="frequency">Frequência</Label>
            <Select
              value={frequency}
              onValueChange={(value) => setFrequency(value as Frequency)}
            >
              <SelectTrigger id="frequency" className="w-full">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rare">Rara (5% das conversas)</SelectItem>
                <SelectItem value="occasional">
                  Ocasional (15% das conversas)
                </SelectItem>
                <SelectItem value="frequent">
                  Frequente (30% das conversas)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 flex items-start gap-2">
            <AlertCircle className="size-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Diretrizes de Segurança
              </p>
              <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                <li>• Não mencione nomes de pessoas ou gestores específicos</li>
                <li>• Evite perguntas que identifiquem grupos</li>
                <li>• Mantenha perguntas neutras, sem induzir respostas</li>
                <li>• Foque em temas relacionados ao ambiente de trabalho</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button className="flex-1" isLoading={isLoading} onClick={handleSave}>
            Salvar Pergunta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";

export default function ChatPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex-1 px-4 lg:px-6">
          <h1 className="text-base font-medium">Conversar</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center font-semibold mt-8">
          <p className="text-2xl mt-4">Converse com o Risko</p>
        </div>
      </div>

      <div className="border-t p-4">
        <Suggestions className="w-full justify-center">
          <Suggestion
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            suggestion="Pedir para o Risko começar"
          />
          <Suggestion suggestion="Não estou me sentindo bem hoje" />
          <Suggestion suggestion="A escala de trabalho está muito pesada" />
        </Suggestions>

        <div className="flex gap-2 mt-4">
          <PromptInput
            onSubmit={() => {}}
            className="w-full max-w-2xl mx-auto relative"
          >
            <PromptInputTextarea
              className="pr-12 min-h-[80px]"
              placeholder="Escreva sua mensagem aqui..."
            />
            <PromptInputSubmit
              className="absolute bottom-1 right-1"
              status="ready"
            />
          </PromptInput>
        </div>
      </div>
    </div>
  );
}

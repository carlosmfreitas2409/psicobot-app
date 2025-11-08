"use client";

import type { User } from "better-auth";

import { Book, Check, Lightbulb, MessageSquareText } from "lucide-react";

interface WelcomeProps {
  user: User;
  onStart?: () => void;
}

const CARDS = [
  {
    title: "Iniciar conversa",
    description: "Comece um novo papo com a Risko.",
    icon: MessageSquareText,
  },
  {
    title: "Dica do dia",
    description: "Pequenos cuidados pra manter o bem-estar.",
    icon: Lightbulb,
  },
  {
    title: "Perguntas frequentes",
    description: "Entenda como a Risko funciona e o que ela faz.",
    icon: Book,
  },
];

export function Welcome({ user, onStart }: WelcomeProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="space-y-6">
        <div>
          <p className="text-2xl font-medium">
            Bem-vindo de volta, {user.name.split(" ")[0]}!
          </p>
          <span className="text-2xl font-medium text-foreground/60">
            Seu espaço seguro para conversar.
          </span>
        </div>

        <div className="grid grid-cols-3 grid-rows-2 gap-2 max-w-2xl">
          {CARDS.map((card, index) => (
            <button
              type="button"
              key={`card-${index + 1}`}
              className="bg-muted w-52 relative cursor-pointer overflow-hidden rounded-xl flex flex-col p-4 border border-transparent hover:border-foreground/30 transition-all duration-300"
              onClick={index === 0 ? onStart : undefined}
            >
              <div
                className="absolute inset-1"
                style={{
                  backgroundSize: "10px 10px",
                  backgroundPositionX: "50%",
                  backgroundImage:
                    "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0)",
                }}
              >
                <div className="w-full h-full from-transparent to-95%% to-muted bg-gradient-to-b"></div>
              </div>

              <div className="z-10">
                <div className="flex-1 relative space-y-0.5">
                  <div className="absolute bg-neutral-600 top-1/2 left-1/2 -translate-1/2 text-white rounded-xl px-3 py-1.5">
                    <card.icon className="size-5" />
                  </div>
                  <div className="w-full h-10 p-3 border bg-white rounded-md flex items-center">
                    <div className="size-5 bg-muted rounded-full border flex items-center justify-center">
                      <Check className="size-3 text-muted-foreground" />
                    </div>

                    <div className="flex-1 h-2 bg-muted rounded-xl ml-3" />
                  </div>
                  <div className="w-full h-10 p-3 border bg-white rounded-md flex items-center">
                    <div className="size-5 bg-muted rounded-full border flex items-center justify-center">
                      <Check className="size-3 text-muted-foreground" />
                    </div>

                    <div className="flex-1 h-2 bg-muted rounded-xl ml-3" />
                  </div>
                  <div className="w-full h-10 p-3 border bg-white rounded-md flex items-center">
                    <div className="size-5 bg-muted rounded-full border flex items-center justify-center">
                      <Check className="size-3 text-muted-foreground" />
                    </div>

                    <div className="flex-1 h-2 bg-muted rounded-xl ml-3" />
                  </div>
                </div>

                <div className="text-left space-y-0.5 mt-3">
                  <p className="text-sm font-medium">{card.title}</p>
                  <p className="text-xs text-foreground/60">
                    {card.description}
                  </p>
                </div>
              </div>
            </button>
          ))}

          <div className="row-span-2" />
        </div>
      </div>
    </div>
  );
}

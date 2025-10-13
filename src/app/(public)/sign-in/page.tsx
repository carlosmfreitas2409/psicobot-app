import { ChevronRight } from "lucide-react";

import Link from "next/link";

import { GlobResMark } from "@/components/logos/globres-mark";

import { Button } from "@/components/ui/button";

import { SignInForm } from "./form";

export default function SignInPage() {
  return (
    <div className="mx-auto container relative flex min-h-screen flex-col py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GlobResMark />
          <h2 className="font-bold text-lg">PsicoBot</h2>
        </div>

        <Button variant="outline" size="sm" asChild>
          <Link href="/pricing">
            <span>Planos</span>
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-6 p-4">
          <div className="space-y-1">
            <h1 className="font-bold text-2xl">Bem-vindo ao PsicoBot</h1>
            <p className="text-default-500 text-sm">
              Faça login em sua conta para acessar todos os seus serviços.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2">
            <SignInForm />
          </div>

          <div className="w-full">
            <span className="font-medium text-default-500 text-xs">
              Não tem uma conta?{" "}
              <Link href="/pricing" className="text-primary underline">
                Ver planos
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

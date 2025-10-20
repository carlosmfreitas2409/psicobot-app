import { ChevronRight } from "lucide-react";

import Link from "next/link";

import { RiskoMark } from "@/components/assets/risko-mark";
import { Grid } from "@/components/assets/grid";

import { Button } from "@/components/ui/button";

import { SignInForm } from "./form";

export default function SignInPage() {
  return (
    <>
      <div className="absolute inset-0 isolate overflow-hidden bg-white">
        <div className="absolute inset-y-0 left-1/2 w-[1200px] -translate-x-1/2 [mask-composite:intersect] [mask-image:linear-gradient(black,transparent_320px),linear-gradient(90deg,transparent,black_5%,black_95%,transparent)]">
          <Grid className="pointer-events-none absolute inset-0 text-neutral-300" />
        </div>
        <div className="absolute left-1/2 top-6 size-[80px] -translate-x-1/2 -translate-y-1/2 scale-x-[1.6] mix-blend-overlay">
          <div className="absolute -inset-16 mix-blend-overlay blur-[50px] saturate-[2] bg-[conic-gradient(from_90deg,#F00_5deg,#EAB308_63deg,#5CFF80_115deg,#1E00FF_170deg,#855AFC_220deg,#3A8BFD_286deg,#F00_360deg)]"></div>
          <div className="absolute -inset-16 mix-blend-overlay blur-[50px] saturate-[2] bg-[conic-gradient(from_90deg,#F00_5deg,#EAB308_63deg,#5CFF80_115deg,#1E00FF_170deg,#855AFC_220deg,#3A8BFD_286deg,#F00_360deg)]"></div>
        </div>
        <div className="absolute left-1/2 top-6 size-[80px] -translate-x-1/2 -translate-y-1/2 scale-x-[1.6] opacity-10">
          <div className="absolute -inset-16 mix-blend-overlay blur-[50px] saturate-[2] bg-[conic-gradient(from_90deg,#F00_5deg,#EAB308_63deg,#5CFF80_115deg,#1E00FF_170deg,#855AFC_220deg,#3A8BFD_286deg,#F00_360deg)]"></div>
        </div>
      </div>

      <div className="mx-auto container relative flex min-h-screen flex-col py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RiskoMark className="size-8" />
            <h2 className="font-bold text-lg">Risko</h2>
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
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-2xl">Bem-vindo ao</h1>
                <RiskoMark className="size-10" />
                <h2 className="font-bold text-2xl">Risko</h2>
              </div>
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
    </>
  );
}

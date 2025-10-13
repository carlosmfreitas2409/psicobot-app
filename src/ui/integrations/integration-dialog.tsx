"use client";

import Image, { type StaticImageData } from "next/image";

import { CheckCircle2, ExternalLink, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IntegrationDialogProps {
  name: string;
  description: string;
  logo: StaticImageData;
  features: string[];
}

export function IntegrationDialog({
  name,
  description,
  logo,
  features,
}: IntegrationDialogProps) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader className="flex-row items-center gap-4">
        <Image
          src={logo}
          alt={name}
          className="rounded-lg object-contain"
          width={64}
          height={64}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-2xl">{name}</DialogTitle>
          </div>
          <DialogDescription className="mt-1">{description}</DialogDescription>
        </div>
      </DialogHeader>

      <div>
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Settings className="h-4 w-4" />
          Recursos Principais
        </h4>

        <ul className="mt-2 space-y-2">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold text-foreground">Como funciona</h4>
        <p className="mt-1 text-sm text-muted-foreground">
          Esta integração permite que o sistema de escuta psicossocial se
          conecte com {name} para ampliar suas funcionalidades e automatizar
          processos. Os dados são sincronizados de forma segura, respeitando a
          privacidade e anonimato dos colaboradores.
        </p>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" className="flex-1 bg-transparent">
            Cancelar
          </Button>
        </DialogClose>

        <Button className="flex-1">
          <ExternalLink className="mr-2 h-4 w-4" />
          Conectar Agora
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

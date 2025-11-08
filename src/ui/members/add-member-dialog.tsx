"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import z from "zod";

import { Mail, Send, UserPlus } from "lucide-react";

import { toast } from "sonner";

import { enterprise } from "@/lib/auth/client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const ROLES = {
  employee: {
    label: "Funcionário",
    description: "Pode apenas conversar com a Risko",
  },
  member: {
    label: "Membro",
    description: "Pode visualizar dados e relatórios",
  },
  admin: {
    label: "Administrador",
    description: "Pode gerenciar dados, membros e configurações",
  },
};

export function AddMemberDialog() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<keyof typeof ROLES>("member");

  async function handleSave() {
    setIsLoading(true);

    const isValidEmail = z.email().safeParse(email);

    if (!isValidEmail.success) {
      toast.error("Email inválido");
      return;
    }

    await enterprise.invitations.create({ email, role });

    setIsLoading(false);

    setEmail("");
    setRole("member");

    setOpen(false);

    toast.success("Convite enviado com sucesso");

    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Convidar Membro
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Convidar novo membro</DialogTitle>
          <DialogDescription>
            Envie um convite por email para adicionar um novo membro à sua
            organização
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="nome@empresa.com"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Cargo</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as keyof typeof ROLES)}
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue>{ROLES[role].label}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ROLES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{value.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {value.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              Um email será enviado para{" "}
              <strong className="text-foreground">o endereço informado</strong>{" "}
              com um link de convite válido por 7 dias.
            </p>
          </div>

          <div className="flex gap-3">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1 bg-transparent">
                Cancelar
              </Button>
            </DialogClose>

            <Button
              className="flex-1"
              disabled={!email}
              isLoading={isLoading}
              onClick={handleSave}
            >
              <Send className="mr-2 h-4 w-4" />
              Enviar Convite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

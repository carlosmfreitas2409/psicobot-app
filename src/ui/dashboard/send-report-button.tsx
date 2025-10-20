"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { orpc } from "@/lib/orpc";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SendReportButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [interval, setInterval] = useState("30d");

  const handleSend = async () => {
    if (!email) {
      toast.error("Por favor, informe o email do destinatário");
      return;
    }

    setLoading(true);

    try {
      await orpc.reports.send({
        recipientEmail: email,
        interval,
      });

      toast.success(`Relatório enviado com sucesso para ${email}`);

      setOpen(false);
    } catch {
      toast.error("Erro ao enviar relatório. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Mail className="h-4 w-4" />
          Enviar Relatório
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enviar relatório por email</DialogTitle>
          <DialogDescription>
            Envie um relatório completo para o email especificado.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="gestor@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="interval">Período do relatório</Label>
            <Select value={interval} onValueChange={setInterval}>
              <SelectTrigger
                id="interval"
                disabled={loading}
                className="w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="mtd">Este mês</SelectItem>
                <SelectItem value="ytd">Este ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button onClick={handleSend} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

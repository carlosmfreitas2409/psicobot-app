import { CheckCircle2, Clock, XCircle, Activity } from "lucide-react";

import { orpc } from "@/lib/orpc";

import { Card } from "@/components/ui/card";

export async function TotalsCards() {
  const totals = await orpc.questions.totals({});

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              Online
            </p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-lg bg-green-100 text-green-500">
            <Activity className="size-6" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Perguntas Aprovadas</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {totals.approved}
            </p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-lg bg-green-100 text-green-500">
            <CheckCircle2 className="size-6" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Perguntas pendentes</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {totals.pending}
            </p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-500">
            <Clock className="size-6" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Perguntas rejeitadas
            </p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {totals.rejected}
            </p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <XCircle className="size-6" />
          </div>
        </div>
      </Card>
    </div>
  );
}

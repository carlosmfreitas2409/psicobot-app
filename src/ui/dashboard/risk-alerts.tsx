import { AlertTriangle } from "lucide-react";

import { orpc } from "@/lib/orpc";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function RiskAlerts() {
  const data = await orpc.analytics.riskTotals({});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Níveis de Risco</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-destructive" />
              <span className="text-sm font-medium text-foreground">
                Crítico
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-destructive">
                {data.critical}
              </span>
              <span className="text-xs text-muted-foreground">
                {data.critical === 1 ? "caso" : "casos"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-orange-500" />
              <span className="text-sm font-medium text-foreground">Alto</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-orange-500">
                {data.high}
              </span>
              <span className="text-xs text-muted-foreground">
                {data.high === 1 ? "caso" : "casos"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="text-sm font-medium text-foreground">Médio</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-yellow-500">
                {data.medium}
              </span>
              <span className="text-xs text-muted-foreground">
                {data.medium === 1 ? "caso" : "casos"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-foreground">Baixo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-green-500">
                {data.low}
              </span>
              <span className="text-xs text-muted-foreground">
                {data.low === 1 ? "caso" : "casos"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      {data.critical > 0 && (
        <CardFooter>
          <div className="w-full rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  {data.critical} casos críticos
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Requerem atenção imediata da equipe de RH
                </p>
              </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

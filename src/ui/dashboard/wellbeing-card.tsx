import { orpc } from "@/lib/orpc";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { WellbeingTimeseries } from "./wellbeing-timeseries";

import type { AnalyticsFilters } from "./get-analytics-filters";

interface WellbeingCardProps {
  filters: AnalyticsFilters;
}

export async function WellbeingCard({ filters }: WellbeingCardProps) {
  const totals = await orpc.analytics.wellbeingTotals(filters);

  const timseries = await orpc.analytics.wellbeingTimeseries(filters);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bem-Estar</CardTitle>
        <CardDescription>
          Distribuição de níveis de bem-estar ao longo do tempo.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-chart-2" />
            <span className="text-xs text-muted-foreground">Saudável</span>
            <span className="text-sm font-semibold text-foreground">
              {totals.healthy}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-chart-3" />
            <span className="text-xs text-muted-foreground">Atenção</span>
            <span className="text-sm font-semibold text-foreground">
              {totals.attention}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-chart-4" />
            <span className="text-xs text-muted-foreground">Alerta</span>
            <span className="text-sm font-semibold text-foreground">
              {totals.alert}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-chart-1" />
            <span className="text-xs text-muted-foreground">Crítico</span>
            <span className="text-sm font-semibold text-foreground">
              {totals.critical}%
            </span>
          </div>
        </div>

        <WellbeingTimeseries data={timseries} />
      </CardContent>
    </Card>
  );
}

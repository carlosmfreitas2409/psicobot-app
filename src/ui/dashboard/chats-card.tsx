import { orpc } from "@/lib/orpc";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChatTimeseries } from "./chat-timeseries";

import type { AnalyticsFilters } from "./get-analytics-filters";

interface ChatsCardProps {
  filters: AnalyticsFilters;
}

export async function ChatsCard({ filters }: ChatsCardProps) {
  const totals = await orpc.analytics.chatTotals(filters);

  const timeseries = await orpc.analytics.chatTimeseries(filters);

  return (
    <Card className="justify-between">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>Conversas</CardTitle>
          <CardDescription>Conversas ao longo do tempo.</CardDescription>
        </div>

        <div className="flex items-center">
          <span className="text-2xl font-semibold text-foreground">
            {totals.chats}
          </span>
          <span className="ml-2 text-sm text-muted-foreground">
            {totals.chats === 1 ? "conversa" : "conversas"} esta semana
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <ChatTimeseries data={timeseries} />
      </CardContent>
    </Card>
  );
}

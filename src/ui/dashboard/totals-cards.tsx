import { orpc } from "@/lib/orpc/index";

import { StatsCard } from "./stats-card";

export async function TotalsCards() {
  const data = await orpc.analytics.totals({});

  const chatsLastMonthPercentage = (data.chatsLastMonth / data.chats) * 100;

  const durationInMinutes = data.averageDuration / 60;
  const durationLastMonthPercentage =
    (data.averageDurationLastMonth / durationInMinutes) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total de Interações"
        value={data.chats.toString()}
        change={`${chatsLastMonthPercentage}%`}
        trend={chatsLastMonthPercentage > 0 ? "up" : "down"}
      />

      <StatsCard
        title="Taxa de Engajamento"
        value="68.3%"
        change="+5.2%"
        trend="up"
      />

      <StatsCard
        title="Duração Média"
        value={`${durationInMinutes} min`}
        change={`${durationLastMonthPercentage}%`}
        trend={durationLastMonthPercentage > 0 ? "up" : "down"}
      />

      <StatsCard
        title="Score de Bem-Estar"
        value="7.2/10"
        change="+0.3"
        trend="up"
      />
    </div>
  );
}

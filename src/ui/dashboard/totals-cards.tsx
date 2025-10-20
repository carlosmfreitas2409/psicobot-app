import { orpc } from "@/lib/orpc/index";

import { StatsCard } from "./stats-card";

export async function TotalsCards() {
  const data = await orpc.analytics.totals({});
  const wellbeingData = await orpc.analytics.wellbeingTotals({});

  const chatsLastMonthPercentage =
    data.chats > 0
      ? data.chatsLastMonth === 0
        ? 100
        : Math.round((data.chatsLastMonth / data.chats) * 100)
      : 0;

  const durationInMinutes = Math.round(data.averageDuration / 60);
  const durationLastMonthInMinutes = Math.round(
    data.averageDurationLastMonth / 60,
  );
  const durationChange = durationInMinutes - durationLastMonthInMinutes;

  const wellbeingScoreChange = (
    data.wellbeingScore - data.wellbeingScoreLastMonth
  ).toFixed(1);

  const healthyPercentage = wellbeingData.healthy;
  const healthyPercentageLastMonth = wellbeingData.healthyLastMonth;
  const healthyChange = (
    healthyPercentage - healthyPercentageLastMonth
  ).toFixed(1);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total de conversas"
        value={data.chats.toString()}
        change={`${chatsLastMonthPercentage}%`}
        trend={chatsLastMonthPercentage >= 0 ? "up" : "down"}
      />

      <StatsCard
        title="Bem-estar saudável"
        value={`${healthyPercentage.toFixed(0)}%`}
        change={`${healthyChange > "0" ? "+" : ""}${healthyChange}%`}
        trend={Number(healthyChange) >= 0 ? "up" : "down"}
      />

      <StatsCard
        title="Duração média"
        value={`${durationInMinutes} min`}
        change={`${durationChange > 0 ? "+" : ""}${durationChange} min`}
        trend={durationChange >= 0 ? "up" : "down"}
      />

      <StatsCard
        title="Score de bem-estar"
        value={`${data.wellbeingScore.toFixed(1)}/10`}
        change={`${wellbeingScoreChange > "0" ? "+" : ""}${wellbeingScoreChange}`}
        trend={Number(wellbeingScoreChange) >= 0 ? "up" : "down"}
      />
    </div>
  );
}

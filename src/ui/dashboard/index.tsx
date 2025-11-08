import { orpc } from "@/lib/orpc";

import { getAnalyticsFilters } from "./get-analytics-filters";

import { Page } from "../layout/page";

import { Header } from "./header";

import { RiskAlerts } from "./risk-alerts";
import { WellbeingCard } from "./wellbeing-card";
import { TopicsCloud } from "./topics-cloud";
import { ChatsCard } from "./chats-card";
import { TotalsCards } from "./totals-cards";
import { Recommendations } from "./recommendations";
import { EmotionsPieCard } from "./emotions-pie-card";
import { ChatTrajectoryCard } from "./chat-trajectory-card";

type DashboardProps = {
  searchParams: Record<string, string | undefined>;
};

export async function Dashboard({ searchParams }: DashboardProps) {
  const filters = await getAnalyticsFilters(searchParams);

  const emotionsDistribution =
    await orpc.analytics.emotionsDistribution(filters);

  return (
    <div>
      <Header filters={filters} />

      <Page>
        <div className="grid gap-4 grid-col">
          <TotalsCards />

          <div className="grid gap-4 lg:grid-cols-2">
            <WellbeingCard filters={filters} />
            <ChatsCard filters={filters} />
          </div>

          <div className="grid gap-4 lg:grid-cols-5 items-start">
            <div className="lg:col-span-3 grid gap-4">
              <TopicsCloud />

              <div className="grid gap-4 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <Recommendations />
                </div>

                <div className="lg:col-span-2">
                  <EmotionsPieCard data={emotionsDistribution} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 grid gap-4">
              <RiskAlerts />
              <ChatTrajectoryCard />
            </div>
          </div>
        </div>
      </Page>
    </div>
  );
}

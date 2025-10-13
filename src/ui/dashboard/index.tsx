import { getAnalyticsFilters } from "./get-analytics-filters";

import { Page } from "../layout/page";

import { Header } from "./header";

import { RiskAlerts } from "./risk-alerts";
import { WellbeingCard } from "./wellbeing-card";
import { TopicsCloud } from "./topics-cloud";
import { ChatsCard } from "./chats-card";
import { TotalsCards } from "./totals-cards";
import { Recommendations } from "./recommendations";

type DashboardProps = {
  searchParams: Record<string, string | undefined>;
};

export async function Dashboard({ searchParams }: DashboardProps) {
  const filters = await getAnalyticsFilters(searchParams);

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

          <div className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <TopicsCloud />
            </div>
            <div className="lg:col-span-2">
              <RiskAlerts />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Recommendations />
          </div>
        </div>
      </Page>
    </div>
  );
}

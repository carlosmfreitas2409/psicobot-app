import { Page } from "@/ui/layout/page";

import { QuestionsList } from "@/ui/robot/questions-list";
import { TotalsCards } from "@/ui/robot/totals-cards";

export default async function RobotPage() {
  return (
    <div>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex-1 px-4 lg:px-6">
          <h1 className="text-base font-medium">Robô</h1>
        </div>
      </header>

      <Page>
        <TotalsCards />

        <div className="mt-2">
          <QuestionsList />
        </div>
      </Page>
    </div>
  );
}

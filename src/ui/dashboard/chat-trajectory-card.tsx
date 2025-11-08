import { orpc } from "@/lib/orpc";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function ChatTrajectoryCard() {
  const t = await orpc.analytics.chatTrajectory({});

  const improved = Math.round(t.improved);
  const maintained = Math.round(t.maintained);
  const worsened = Math.round(t.worsened);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trajetória das Conversas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex justify-between">
              <span className="text-sm font-medium text-green-600">
                Melhoraram
              </span>
              <span className="text-lg font-bold text-green-600">
                {improved}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-green-100">
              <div
                className="h-2 rounded-full bg-green-600"
                style={{ width: `${improved}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between">
              <span className="text-sm font-medium text-neutral-600">
                Mantiveram
              </span>
              <span className="text-lg font-bold text-neutral-600">
                {maintained}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-neutral-200">
              <div
                className="h-2 rounded-full bg-neutral-500"
                style={{ width: `${maintained}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between">
              <span className="text-sm font-medium text-orange-600">
                Pioraram
              </span>
              <span className="text-lg font-bold text-orange-600">
                {worsened}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-orange-100">
              <div
                className="h-2 rounded-full bg-orange-600"
                style={{ width: `${worsened}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

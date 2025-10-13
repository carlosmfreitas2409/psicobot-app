import { AlertCircle, TrendingUp, Users } from "lucide-react";

import { orpc } from "@/lib/orpc";

import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const priorityToIcon = {
  high: AlertCircle,
  medium: TrendingUp,
  low: Users,
} as const;

export async function Recommendations() {
  const data = await orpc.recommendations.generate({});

  const items = data.map((r) => ({
    icon: priorityToIcon[r.priority],
    title: r.title,
    description: r.description,
    priority: r.priority,
  }));

  if (!items.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recomendações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={`${item.title}-${idx}`}
              className="flex gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  item.priority === "high" &&
                    "bg-destructive/10 text-destructive",
                  item.priority === "medium" && "bg-yellow-100 text-yellow-500",
                  item.priority === "low" && "bg-green-100 text-green-500",
                )}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h4>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

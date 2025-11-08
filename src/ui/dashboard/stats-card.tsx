import { ArrowDown, ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
}

export function StatsCard({ title, value, change, trend }: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-card-foreground">
            {value}
          </p>
        </div>

        {change && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              trend === "up" && "bg-green-100 text-green-500",
              trend === "down" && "bg-red-100 text-red-500",
            )}
          >
            {trend === "up" && <ArrowUp className="h-3 w-3" />}
            {trend === "down" && <ArrowDown className="h-3 w-3" />}
            {change}
          </div>
        )}
      </div>
    </div>
  );
}

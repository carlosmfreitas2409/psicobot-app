"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = [
  { sentiment: "wellbeing", employees: 275, fill: "var(--color-wellbeing)" },
  { sentiment: "neutral", employees: 200, fill: "var(--color-neutral)" },
  { sentiment: "concern", employees: 187, fill: "var(--color-concern)" },
  { sentiment: "suffering", employees: 173, fill: "var(--color-suffering)" },
];

const chartConfig = {
  employees: {
    label: "Funcionários",
  },
  wellbeing: {
    label: "Bem-Estar",
    color: "var(--chart-1)",
  },
  neutral: {
    label: "Neutro",
    color: "var(--chart-2)",
  },
  concern: {
    label: "Preocupação",
    color: "var(--chart-3)",
  },
  suffering: {
    label: "Suffering",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function WellbeingDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição Emocional</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="employees"
              nameKey="sentiment"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>

        <div className="space-y-1">
          {chartData.map((item) => {
            const config =
              chartConfig[item.sentiment as keyof typeof chartConfig];

            if (!config) {
              return null;
            }

            return (
              <div
                key={item.sentiment}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-xs"
                    style={
                      "color" in config ? { backgroundColor: config.color } : {}
                    }
                  />
                  <span>{config.label}</span>
                </div>

                <span className="text-muted-foreground">{item.employees}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

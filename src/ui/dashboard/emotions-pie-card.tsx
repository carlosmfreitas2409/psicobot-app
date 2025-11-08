"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

const baseConfig = {
  neutral: { label: "Neutro", color: "var(--chart-1)" },
  happy: { label: "Feliz", color: "var(--chart-2)" },
  sad: { label: "Triste", color: "var(--chart-3)" },
  angry: { label: "Bravo", color: "var(--chart-4)" },
} satisfies ChartConfig;

function emotionKey(emotion: string): keyof typeof baseConfig | "other" {
  const key = emotion.toLowerCase();
  if (key in baseConfig) return key as keyof typeof baseConfig;
  return "other";
}

export function EmotionsPieCard({
  data,
}: {
  data: { emotion: string; percentage: number }[];
}) {
  const dynamicConfig: ChartConfig = {
    ...baseConfig,
    other: { label: "Outros", color: "var(--chart-5)" },
  };

  const chartData =
    data?.map((d) => {
      const key = emotionKey(d.emotion);
      const fillKey = key === "other" ? "other" : key;
      return {
        emotion: d.emotion,
        value: d.percentage,
        fill: `var(--color-${fillKey})`,
      };
    }) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Emoções</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer
            config={dynamicConfig}
            className="mx-auto aspect-square h-full max-h-[325px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={chartData} dataKey="value" nameKey="emotion" />
              <ChartLegend
                content={<ChartLegendContent nameKey="emotion" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="w-full h-full min-h-[325px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma distribuição de emoções encontrada
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

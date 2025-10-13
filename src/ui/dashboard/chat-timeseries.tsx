"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { formatDateTooltip } from "@/utils/format-date-tooltip";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useAnalyticsFilter } from "./hooks/use-analytics-filter";

const chartConfig = {
  chats: {
    label: "Conversas",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

interface ChatTimeseriesProps {
  data: {
    start: string;
    chats: number;
  }[];
}

export function ChatTimeseries({ data }: ChatTimeseriesProps) {
  const { start, end, interval } = useAnalyticsFilter();

  return (
    <ChartContainer className="aspect-auto h-60 w-full" config={chartConfig}>
      <LineChart
        data={data}
        margin={{
          left: 12,
          right: 12,
          top: 12,
        }}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="5"
          className="!stroke-border/70"
        />
        <XAxis
          dataKey="start"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={40}
          className="[&_.recharts-cartesian-axis-tick:last-child]:font-medium [&_.recharts-cartesian-axis-tick:last-child_text]:fill-foreground"
          tickFormatter={(value) =>
            formatDateTooltip(value, {
              start,
              end,
              interval,
            })
          }
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              className="min-w-36 gap-0 p-0"
              labelClassName="border-b p-2.5"
              wrapperClassName="p-2.5"
              labelFormatter={(value) =>
                formatDateTooltip(value, {
                  start,
                  end,
                  interval,
                })
              }
              formatter={(value) => `Conversas: ${String(value)}`}
            />
          }
        />
        <Line
          dataKey="chats"
          type="monotone"
          stroke="var(--color-chats)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

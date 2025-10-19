"use client";

import { CartesianGrid, XAxis, Area, AreaChart } from "recharts";

import { formatDateTooltip } from "@/utils/format-date-tooltip";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useAnalyticsFilter } from "./hooks/use-analytics-filter";

interface WellbeingTimeseriesProps {
  data: {
    start: string;
    healthy: number;
    attention: number;
    alert: number;
    critical: number;
  }[];
}

const chartConfig = {
  healthy: {
    label: "Saudável",
    color: "var(--chart-2)",
  },
  attention: {
    label: "Atenção",
    color: "var(--chart-3)",
  },
  alert: {
    label: "Alerta",
    color: "var(--chart-4)",
  },
  critical: {
    label: "Crítico",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function WellbeingTimeseries({ data }: WellbeingTimeseriesProps) {
  const { start, end, interval } = useAnalyticsFilter();

  return (
    <ChartContainer className="h-56 w-full" config={chartConfig}>
      <AreaChart
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
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
              // formatter={(value) => String(value)}
            />
          }
        />

        <defs>
          <linearGradient id="fillHealthy" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-healthy)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-healthy)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillAttention" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-attention)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-attention)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillAlert" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-alert)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-alert)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillCritical" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-critical)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-critical)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="healthy"
          type="monotone"
          fill="url(#fillHealthy)"
          fillOpacity={0.4}
          stroke="var(--color-healthy)"
          stackId="a"
        />
        <Area
          dataKey="attention"
          type="monotone"
          fill="url(#fillAttention)"
          fillOpacity={0.4}
          stroke="var(--color-attention)"
          stackId="b"
        />
        <Area
          dataKey="alert"
          type="monotone"
          fill="url(#fillAlert)"
          fillOpacity={0.4}
          stroke="var(--color-alert)"
          stackId="c"
        />
        <Area
          dataKey="critical"
          type="monotone"
          fill="url(#fillCritical)"
          fillOpacity={0.4}
          stroke="var(--color-critical)"
          stackId="d"
        />
      </AreaChart>
    </ChartContainer>
  );
}

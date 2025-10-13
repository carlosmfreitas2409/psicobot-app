import z from "zod";

import { tb } from "../tinybird/client";

import type { analyticsResponse } from "./analytics-response";
import { getStartEndDates } from "./get-start-end-dates";

type AnayticsFilter = {
  groupBy: keyof typeof analyticsResponse;
  dateFrom?: string;
  dateTo?: string;
  interval?: string;
  timezone?: string;
};

const analyticsFilterParameters = z.object({
  dateFrom: z.iso.datetime({ local: true }),
  dateTo: z.iso.datetime({ local: true }),
  granularity: z.enum(["minute", "hour", "day", "month"]).optional(),
  timezone: z.string().optional(),
});

export async function getAnalytics(parameters: AnayticsFilter) {
  const {
    groupBy,
    interval,
    dateTo: end,
    dateFrom: start,
    timezone = "UTC",
  } = parameters;

  const { startDate, endDate, granularity } = getStartEndDates({
    interval,
    start,
    end,
  });

  const pipe = tb.buildPipe({
    pipe: `v1_${groupBy}`,
    parameters: analyticsFilterParameters,
    data: z.any(),
  });

  const response = await pipe({
    dateFrom: startDate.toISOString().replace("Z", ""),
    dateTo: endDate.toISOString().replace("Z", ""),
    granularity,
    timezone,
  });

  if (
    groupBy === "totals" ||
    groupBy === "risk_totals" ||
    groupBy === "wellbeing_totals" ||
    groupBy === "chat_totals"
  ) {
    return response.data[0];
  }

  return response.data;
}

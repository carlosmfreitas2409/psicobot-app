import { endOfDay, startOfDay, subDays } from "date-fns";

export type AnalyticsFilters = {
  dateFrom?: string;
  dateTo?: string;
  interval?: string;
  timezone?: string;
};

const DEFAULT_INTERVAL = "7d";

export async function getAnalyticsFilters(
  filters: Record<string, string | undefined>,
): Promise<AnalyticsFilters> {
  const hasRange = filters.start && filters.end;

  const start = hasRange
    ? startOfDay(new Date(filters.start || subDays(new Date(), 1)))
    : undefined;

  const end = hasRange
    ? endOfDay(new Date(filters.end || new Date()))
    : undefined;

  const interval =
    start || end ? undefined : (filters.interval ?? DEFAULT_INTERVAL);

  return {
    dateFrom: start?.toISOString(),
    dateTo: end?.toISOString(),
    interval,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

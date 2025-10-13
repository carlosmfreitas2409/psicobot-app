import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { endOfDay, startOfDay, subDays } from "date-fns";

const DEFAULT_INTERVAL = "7d";

export function useAnalyticsFilter() {
  const searchParams = useSearchParams();

  const { start, end } = useMemo(() => {
    const hasRange = searchParams?.has("start") && searchParams?.has("end");

    return {
      start: hasRange
        ? startOfDay(
            new Date(searchParams?.get("start") || subDays(new Date(), 1)),
          )
        : undefined,

      end: hasRange
        ? endOfDay(new Date(searchParams?.get("end") || new Date()))
        : undefined,
    };
  }, [searchParams]);

  const interval =
    start || end
      ? undefined
      : (searchParams?.get("interval") ?? DEFAULT_INTERVAL);

  return { start, end, interval };
}

import { differenceInDays } from "date-fns";

export const INTERVAL_DATA: Record<
  string,
  {
    startDate: Date;
    granularity: "minute" | "hour" | "day" | "month";
  }
> = {
  "24h": {
    startDate: new Date(Date.now() - 86400000),
    granularity: "hour",
  },
  "7d": {
    startDate: new Date(Date.now() - 604800000),
    granularity: "day",
  },
  "30d": {
    startDate: new Date(Date.now() - 2592000000),
    granularity: "day",
  },
  "90d": {
    startDate: new Date(Date.now() - 7776000000),
    granularity: "day",
  },
  "1y": {
    startDate: new Date(Date.now() - 31556952000),
    granularity: "month",
  },
  mtd: {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    granularity: "day",
  },
  qtd: {
    startDate: new Date(
      new Date().getFullYear(),
      Math.floor(new Date().getMonth() / 3) * 3,
      1,
    ),
    granularity: "day",
  },
  ytd: {
    startDate: new Date(new Date().getFullYear(), 0, 1),
    granularity: "month",
  },
  all: {
    startDate: new Date(0),
    granularity: "month",
  },
};

export function getStartEndDates({
  interval,
  start,
  end,
}: {
  interval?: string;
  start?: string | Date | null;
  end?: string | Date | null;
}) {
  let startDate: Date;
  let endDate: Date;
  let granularity: "minute" | "hour" | "day" | "month" = "day";

  if (start || interval === "all") {
    startDate = new Date(start ?? Date.now());
    endDate = new Date(end ?? Date.now());

    const daysDifference = differenceInDays(endDate, startDate);

    if (daysDifference <= 2) {
      granularity = "hour";
    } else if (daysDifference > 180) {
      granularity = "month";
    }

    if (startDate > endDate) {
      [startDate, endDate] = [endDate, startDate];
    }
  } else {
    interval = interval ?? "30d";
    startDate = INTERVAL_DATA[interval].startDate;
    endDate = new Date(Date.now());
    granularity = INTERVAL_DATA[interval].granularity;
  }

  return { startDate, endDate, granularity };
}

import {
  startOfYear,
  startOfQuarter,
  startOfMonth,
  subDays,
  subYears,
} from "date-fns";

export const DEFAULT_INTERVAL = "7d";

export const INTERVAL_PRESETS: Record<
  string,
  {
    display: string;
    startDate: Date;
    granularity: "minute" | "hour" | "day" | "month";
  }
> = {
  "24h": {
    display: "Últimas 24 horas",
    startDate: subDays(new Date(), 1),
    granularity: "hour",
  },
  "7d": {
    display: "Últimos 7 dias",
    startDate: subDays(new Date(), 7),
    granularity: "day",
  },
  "30d": {
    display: "Últimos 30 dias",
    startDate: subDays(new Date(), 30),
    granularity: "day",
  },
  "90d": {
    display: "Últimos 3 meses",
    startDate: subDays(new Date(), 90),
    granularity: "day",
  },
  "1y": {
    display: "Últimos 12 meses",
    startDate: subYears(new Date(), 1),
    granularity: "month",
  },
  mtd: {
    display: "Mês atual",
    startDate: startOfMonth(new Date()),
    granularity: "day",
  },
  qtd: {
    display: "Trimestre atual",
    startDate: startOfQuarter(new Date()),
    granularity: "day",
  },
  ytd: {
    display: "Ano atual",
    startDate: startOfYear(new Date()),
    granularity: "month",
  },
  all: {
    display: "Todo o período",
    startDate: new Date(0),
    granularity: "month",
  },
};

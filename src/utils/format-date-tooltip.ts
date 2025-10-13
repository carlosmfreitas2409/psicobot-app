export const formatDateTooltip = (
  date: Date,
  {
    interval,
    start,
    end,
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  }: {
    interval?: string;
    start?: string | Date | null;
    end?: string | Date | null;
    timezone?: string;
  },
) => {
  const targetDate = new Date(
    date.toLocaleString("en-US", { timeZone: timezone }),
  );

  if (interval === "all") {
    start = new Date(0);
    end = new Date(Date.now());
  }

  if (start && end) {
    const diffTime = Math.abs(
      new Date(end).getTime() - new Date(start).getTime(),
    );

    const daysDifference = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysDifference <= 2) {
      return targetDate.toLocaleTimeString("pt-BR", {
        hour: "numeric",
        minute: "numeric",
      });
    }

    if (daysDifference > 180) {
      return targetDate.toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric",
      });
    }
  } else if (interval) {
    switch (interval) {
      case "24h":
        return targetDate.toLocaleTimeString("pt-BR", {
          hour: "numeric",
          minute: "numeric",
        });
      case "ytd":
      case "1y":
      case "all":
        return targetDate.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        });
      default:
        break;
    }
  }

  return targetDate.toLocaleDateString("pt-BR", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

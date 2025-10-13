"use client";

import { DateRangePicker } from "@/components/ui/date-picker/range";

import type { AnalyticsFilters } from "./get-analytics-filters";

import { INTERVAL_PRESETS } from "./mock";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

interface HeaderProps {
  filters: AnalyticsFilters;
}

export function Header({ filters }: HeaderProps) {
  const dateRange = useMemo(() => {
    return {
      from: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
      to: filters.dateTo ? new Date(filters.dateTo) : undefined,
    };
  }, [filters]);

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex-1 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-medium">Visão Geral</h1>

          <div className="flex items-center gap-2">
            <DateRangePicker
              value={dateRange}
              align="end"
              // onValueChange={onSelectDate}
              presetId={
                dateRange.from && dateRange.to ? undefined : filters.interval
              }
              presets={Object.entries(INTERVAL_PRESETS).map(([key, preset]) => {
                return {
                  id: key,
                  label: preset.display,
                  dateRange: {
                    from: preset.startDate,
                    to: new Date(Date.now()),
                  },
                };
              })}
            />

            <Button variant="outline">
              <DownloadIcon className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

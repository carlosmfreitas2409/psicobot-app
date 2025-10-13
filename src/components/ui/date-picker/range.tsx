import { useEffect, useMemo, useState } from "react";
import { enUS } from "date-fns/locale";
import { format } from "date-fns";

import { Calendar, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarPrimitive } from "@/components/ui/calendar";

import { Presets, PresetScrollContainer } from "./presets";

import type { DateRange, DateRangePreset, PickerProps } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

type DateRangePickerProps = {
  value?: DateRange;
  defaultValue?: DateRange;
  presets?: DateRangePreset[];
  presetId?: string;
  onValueChange?: (dateRange?: DateRange, preset?: DateRangePreset) => void;
} & PickerProps;

export function DateRangePicker({
  value,
  defaultValue,
  placeholder = "Select a date range",
  disabled,
  disabledDays,
  disabledNavigation,
  align = "center",
  presets,
  presetId,
  hasError,
  locale = enUS,
  onValueChange,
  ...props
}: DateRangePickerProps) {
  const isMobile = useIsMobile();

  const [isOpen, setIsOpen] = useState(false);
  const [preset, setPreset] = useState(
    presets?.find((preset) => preset.id === presetId),
  );
  const [range, setRange] = useState<DateRange | undefined>(
    preset?.dateRange ?? value ?? defaultValue,
  );
  const [month, setMonth] = useState<Date | undefined>(range?.to);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const initialRange = useMemo(() => {
    return range;
  }, [isOpen]);

  const displayValue = useMemo(() => {
    if (preset) {
      return preset.label;
    }

    if (!range) return null;

    const from = range.from
      ? format(range.from, "d MMM, yyyy", { locale })
      : "";

    const to = range.to ? format(range.to, "d MMM, yyyy", { locale }) : "";

    return `${from} - ${to}`;
  }, [range, locale, preset]);

  function getNewRange(selectedRange?: DateRange, selectedDay?: Date) {
    if ((range?.from && range?.to) || (!range?.from && !range?.to)) {
      return { from: selectedDay };
    }

    if (range?.from && !range?.to && selectedDay) {
      return range.from > selectedDay
        ? { from: selectedDay, to: range.from }
        : { from: range.from, to: selectedDay };
    }

    return selectedRange;
  }

  function handleCalendarSelect(selectedRange?: DateRange, selectedDay?: Date) {
    const newRange = getNewRange(selectedRange, selectedDay);

    setRange(newRange);
    setPreset(undefined);

    if (newRange?.from && newRange?.to) {
      onValueChange?.(newRange);
      setIsOpen(false);
    }
  }

  function handlePresetSelect(preset: DateRangePreset) {
    setRange(preset?.dateRange);
    setPreset(preset);
    onValueChange?.(preset?.dateRange, preset);
    setIsOpen(false);
  }

  function onOpenChange(open: boolean) {
    if (!open) {
      setRange(initialRange);
      setIsOpen(false);
    }

    setIsOpen(open);
  }

  useEffect(() => {
    setRange(value);
  }, [value]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isOpen || range) {
      setMonth(range?.to);
    }
  }, [isOpen]);

  useEffect(() => {
    const preset = presets?.find((preset) => preset.id === presetId);

    setPreset(preset);

    if (preset) {
      setRange(preset?.dateRange);
    }
  }, [presetId, presets]);

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger disabled={disabled} asChild>
        <Button
          variant="outline"
          className={cn(
            "group gap-2 px-4 font-normal",
            "data-[state=open]:border-ring data-[state=open]:ring-4 data-[state=open]:ring-ring/20",
            !displayValue && "text-muted-foreground",
            hasError && "border-destructive",
          )}
          aria-required={props.required || props["aria-required"]}
          aria-invalid={props["aria-invalid"]}
          aria-label={props["aria-label"]}
          aria-labelledby={props["aria-labelledby"]}
        >
          <Calendar className="h-4 w-4 shrink-0" />
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">
            {displayValue ?? placeholder}
          </span>
          <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground/80 transition-transform duration-75 group-data-[state=open]:rotate-180" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align={align}
        sideOffset={8}
        className="flex w-full overflow-hidden rounded-xl p-0"
      >
        <div className="relative flex w-full flex-col sm:flex-row-reverse sm:items-start">
          {presets && presets.length > 0 && (
            <PresetScrollContainer>
              <div className="absolute px-3 sm:inset-0 sm:left-0">
                <div className="sm:py-3">
                  <Presets
                    presets={presets}
                    onSelect={handlePresetSelect}
                    currentPresetId={presetId}
                    currentValue={range}
                  />
                </div>
              </div>
            </PresetScrollContainer>
          )}

          <CalendarPrimitive
            mode="range"
            selected={range}
            onSelect={handleCalendarSelect}
            month={month}
            onMonthChange={setMonth}
            numberOfMonths={isMobile ? 1 : 2}
            disabled={disabledDays}
            disableNavigation={disabledNavigation}
            locale={locale}
            classNames={{
              months: "relative flex flex-row divide-x",
            }}
            {...props}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

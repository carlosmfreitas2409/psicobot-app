import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Command, CommandItem, CommandList } from "@/components/ui/command";

import type { DateRange, Preset } from "./types";

type PresetProps<TPreset extends Preset, TValue> = {
  presets: TPreset[];
  currentPresetId?: string;
  currentValue?: TValue;
  onSelect: (preset: TPreset) => void;
};

export function Presets<TPreset extends Preset, TValue>({
  presets,
  onSelect,
  currentPresetId,
  currentValue,
}: PresetProps<TPreset, TValue>) {
  function compareDates(date1: Date, date2: Date) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  function compareRanges(range1: DateRange, range2: DateRange) {
    const from1 = range1.from;
    const from2 = range2.from;

    let equalFrom = false;

    if (from1 && from2) {
      equalFrom = compareDates(from1, from2);
    }

    const to1 = range1.to;
    const to2 = range2.to;

    let equalTo = false;

    if (to1 && to2) {
      equalTo = compareDates(to1, to2);
    }

    return equalFrom && equalTo;
  }

  function matchesCurrent(preset: TPreset) {
    if (currentPresetId) {
      return preset.id === currentPresetId;
    }

    if ("dateRange" in preset) {
      const value = currentValue as DateRange | undefined;

      return value && compareRanges(value, preset.dateRange as DateRange);
    }

    if ("date" in preset) {
      const value = currentValue as Date | undefined;

      return value && compareDates(value, preset.date as Date);
    }

    return false;
  }

  return (
    <Command
      className="w-full rounded ring-accent ring-offset-2 focus:outline-none"
      tabIndex={0}
      autoFocus
      loop
    >
      <CommandList className="max-h-none [&>*]:flex [&>*]:w-full [&>*]:items-start [&>*]:gap-x-2 [&>*]:gap-y-0.5 [&>*]:sm:flex-col">
        {presets.map((preset) => (
          <CommandItem
            key={preset.id}
            title={preset.label}
            value={preset.id}
            onSelect={() => onSelect(preset)}
            className={cn(
              "flex cursor-pointer items-center justify-between overflow-hidden text-ellipsis whitespace-nowrap px-2.5 py-1.5 sm:w-full sm:py-2",
              matchesCurrent(preset) && "bg-accent font-semibold",
            )}
          >
            <span>{preset.label}</span>
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
}

type PresetScrollContainerProps = {
  children: React.ReactNode;
};

export function PresetScrollContainer({
  children,
}: PresetScrollContainerProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [scrollPosition, setScrollPosition] = useState(0);

  const updateScrollPosition = useCallback(() => {
    if (!ref.current) return;

    const { scrollTop, scrollHeight, clientHeight } = ref.current;

    const position =
      scrollHeight === clientHeight
        ? 1
        : Math.min(scrollTop / (scrollHeight - clientHeight), 1);

    setScrollPosition(position);
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(updateScrollPosition);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [updateScrollPosition]);

  return (
    <div className="relative sm:h-full">
      <div
        ref={ref}
        onScroll={updateScrollPosition}
        className="scrollbar-hide relative flex h-16 w-full items-center overflow-auto border-b sm:h-full sm:w-48 sm:border-b-0 sm:border-l"
      >
        {children}
      </div>

      <div
        className="pointer-events-none absolute inset-x-[1px] bottom-0 hidden h-16 w-full rounded-b-lg bg-gradient-to-t from-white sm:block"
        style={{ opacity: 1 - scrollPosition ** 2 }}
      />
    </div>
  );
}

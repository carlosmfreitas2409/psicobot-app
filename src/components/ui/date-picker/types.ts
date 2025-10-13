import type { Matcher } from "react-day-picker";
import type { Locale } from "date-fns";

import type { PopoverContentProps } from "@radix-ui/react-popover";

export type CalendarProps = {
  locale?: Locale;
};

export type PickerProps = CalendarProps & {
  placeholder?: string;
  disabled?: boolean;
  disabledDays?: Matcher | Matcher[];
  disabledNavigation?: boolean;
  required?: boolean;
  align?: PopoverContentProps["align"];
  hasError?: boolean;
  "aria-invalid"?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-required"?: boolean;
};

export type DateRange = {
  from: Date | undefined;
  to?: Date;
};

export type Preset = {
  id: string;
  label: string;
};

export type DateRangePreset = Preset & {
  dateRange: DateRange;
};

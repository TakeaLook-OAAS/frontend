"use client";

import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import "react-day-picker/dist/style.css";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export default function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDateRange = () => {
    if (!dateRange?.from) return "기간 선택";
    if (!dateRange.to) return format(dateRange.from, "PPP", { locale: ko });
    return `${format(dateRange.from, "PPP", { locale: ko })} - ${format(
      dateRange.to,
      "PPP",
      { locale: ko }
    )}`;
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Calendar className="w-4 h-4" />
          {formatDateRange()}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
          sideOffset={5}
          align="start"
        >
          <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={onDateRangeChange}
            locale={ko}
            className="rdp"
            disabled={{ after: new Date() }}
          />
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
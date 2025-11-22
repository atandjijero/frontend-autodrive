"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { contrats } from "@/pages/admin/contrats";

export default function CalendarVehicule() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const reservations = Object.values(contrats).map((v) => v.reservation);

  const disabledRanges = reservations.map((r) => ({
    from: new Date(r.from),
    to: new Date(r.to),
  }));

  // Helper: does two date ranges overlap?
  const rangesOverlap = (a: DateRange, b: DateRange) => {
    if (!a.from || !a.to || !b.from || !b.to) return false;
    return a.from <= b.to && b.from <= a.to;
  };

  const handleSelect = (newRange: DateRange | undefined) => {
    if (!newRange?.from || !newRange?.to) {
      setDateRange(newRange);
      return;
    }

    // Check overlap with all disabled ranges
    const isInvalid = disabledRanges.some((disabled) =>
      rangesOverlap(newRange, disabled)
    );

    if (isInvalid) {
      // ❌ Prevent selecting across disabled dates
      setDateRange(undefined); // You can also keep previous value instead
      return;
    }

    // ✅ Valid selection
    setDateRange(newRange);

    console.log("Selected range:", {
      from: newRange.from.toDateString(),
      to: newRange.to.toDateString(),
    });
  };

  return (
    <Calendar
      mode="range"
      numberOfMonths={3}
      defaultMonth={new Date()}
      selected={dateRange}
      onSelect={handleSelect}
      disabled={[{ before: new Date() }, ...disabledRanges]}
      className="rounded-lg border shadow-sm"
    />
  );
}

"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { contrats } from "@/pages/admin/contrats";
import { useParams } from "react-router-dom";

export default function CalendarVehicule() {
  const { id } = useParams();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const reservations = Object.values(contrats)
    .filter((c) => c.idVehicule === id)
    .map((c) => c.reservation);

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

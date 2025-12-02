import { useState } from "react";

type CalendarVehiculeProps = {
  onChange?: (dates: { start: Date; end: Date }) => void;
};

export default function CalendarVehicule({ onChange }: CalendarVehiculeProps) {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  const handleSelect = (startDate: Date, endDate: Date) => {
    setStart(startDate);
    setEnd(endDate);
    if (onChange) {
      onChange({ start: startDate, end: endDate });
    }
  };

  return (
    <div>
      {/* Exemple simple : deux inputs type date */}
      <input
        type="date"
        onChange={(e) => handleSelect(new Date(e.target.value), end ?? new Date())}
      />
      <input
        type="date"
        onChange={(e) => handleSelect(start ?? new Date(), new Date(e.target.value))}
      />
    </div>
  );
}

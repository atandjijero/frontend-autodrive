import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { getVehicles } from "@/api/apiClient";   
import type { Vehicle } from "@/api/apiClient";  
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function ucfirst(str: string) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

export function VehiculeSearch({
  onResults,
}: {
  onResults?: (results: Vehicle[]) => void;
}) {
  const [vehicules, setVehicules] = useState<Vehicle[]>([]);
  const [inputs, setInputs] = useState({
    carrosserie: "",
    marque: "",
    transmission: "",
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const [filteredResults, setFilteredResults] = useState<Vehicle[]>([]);

  // Charger les véhicules depuis l’API
  useEffect(() => {
    getVehicles()
      .then((res) => {
        setVehicules(res.data);
        if (res.data.length > 0) {
          const prices = res.data.map((v) => v.prix);
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      })
      .catch((err) => console.error("Erreur API :", err));
  }, []);

  const handleSelect = (attribute: string, value: string) => {
    setInputs((prev) => ({ ...prev, [attribute]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const results = vehicules.filter((v) => {
      const matchesFilters =
        (inputs.marque === "" || v.marque === inputs.marque) &&
        (inputs.carrosserie === "" || v.carrosserie === inputs.carrosserie) &&
        (inputs.transmission === "" || v.transmission === inputs.transmission) &&
        v.prix >= priceRange[0] &&
        v.prix <= priceRange[1];

      return matchesFilters;
    });

    setFilteredResults(results);
    onResults?.(results);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="bg-background p-4 border-b">
        <FieldGroup>
          <Selects attribute="marque" onChange={handleSelect} inputs={inputs} vehicules={vehicules} />
          <Selects attribute="modele" onChange={handleSelect} inputs={inputs} vehicules={vehicules} />
          <Selects attribute="carrosserie" onChange={handleSelect} inputs={inputs} vehicules={vehicules} />
          <Selects attribute="transmission" onChange={handleSelect} inputs={inputs} vehicules={vehicules} />
          <SliderPrix
            value={priceRange}
            onChange={setPriceRange}
            minPrice={priceRange[0]}
            maxPrice={priceRange[1]}
          />
          <CalendarSearch dateRange={dateRange} setDateRange={setDateRange} />
        </FieldGroup>
        <Button type="submit" className="mt-4 w-full">
          Filtrer
        </Button>
      </form>
      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          {filteredResults.length > 0
            ? `${filteredResults.length} véhicule(s) trouvé(s)`
            : "Utilisez les filtres ci-dessus pour rechercher des véhicules"}
        </p>
      </div>
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////////////

export function Selects({
  inputs,
  attribute,
  vehicules,
  onChange,
}: {
  inputs?: { [attribute: string]: string };
  attribute: string;
  vehicules: Vehicle[];
  onChange?: (attribute: string, value: string) => void;
}) {
  const allValues = vehicules.map((v) => v[attribute as keyof Vehicle]);
  let distinctValues = [...new Set(allValues)].sort((a, b) =>
    String(a).localeCompare(String(b))
  );

  if (attribute === "modele" && inputs?.marque) {
    distinctValues = distinctValues.filter((value) => {
      return vehicules.some(
        (v) => v.marque === inputs.marque && v.modele === value
      );
    });
  }

  return (
    <Field>
      <FieldLabel>{ucfirst(attribute)}</FieldLabel>
      <Select
        onValueChange={(value: string) => onChange?.(attribute, value)}
        name={attribute}
        value={inputs?.[attribute]}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={ucfirst(attribute)} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>{ucfirst(attribute)}</SelectLabel>
            {distinctValues.map((value) => (
              <SelectItem key={String(value)} value={String(value)}>
                {ucfirst(String(value))}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

export function SliderPrix({
  value,
  onChange,
  minPrice,
  maxPrice,
}: {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
}) {
  return (
    <Field className="w-full">
      <FieldLabel>Tranche de prix</FieldLabel>
      <FieldDescription>
        Définissez votre fourchette de budget (€
        <span className="font-medium tabular-nums">{value[0]}</span> -{" "}
        <span className="font-medium tabular-nums">{value[1]}</span>).
      </FieldDescription>
      <Slider
        value={value}
        onValueChange={onChange}
        max={maxPrice}
        min={minPrice}
        step={10}
        className="mt-2 w-full mx-auto"
        aria-label="Price Range"
      />
    </Field>
  );
}

export function CalendarSearch({
  dateRange,
  setDateRange,
}: {
  dateRange?: DateRange;
  setDateRange?: (dateRange: DateRange | undefined) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Field className="w-full">
      <FieldLabel> Tranche de dates de disponibilité</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" id="date" className="w-48 font-normal">
            {dateRange?.from
              ? dateRange.from.toLocaleDateString() +
                (dateRange.to ? " - " + dateRange.to.toLocaleDateString() : "")
              : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0">
          <Calendar
            mode="range"
            numberOfMonths={3}
            defaultMonth={new Date()}
            selected={dateRange}
            captionLayout="dropdown"
            onSelect={(range) => {
              setDateRange?.(range);
            }}
            disabled={{ before: new Date() }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

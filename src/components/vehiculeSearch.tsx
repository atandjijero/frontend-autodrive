import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { vehicules } from "@/pages/admin/vehiculesListe";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
import { contrats } from "@/pages/admin/contrats";

function ucfirst(str: string) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

export function VehiculeSearch({
  onResults,
}: {
  onResults?: (results: typeof vehicules) => void;
}) {
  const [inputs, setInputs] = useState({
    carrosserie: "",
    marque: "",
    transmission: "",
  });

  const prices = Object.values(vehicules).map((v) => v.prix);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const [filteredResults, setFilteredResults] = useState<typeof vehicules>({});

  const handleSelect = (attribute: string, value: string) => {
    setInputs((prev) => ({ ...prev, [attribute]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const results = Object.fromEntries(
      Object.entries(vehicules).filter(([id, v]) => {
        const matchesFilters =
          (inputs.marque === "" || v.marque === inputs.marque) &&
          (inputs.carrosserie === "" || v.carrosserie === inputs.carrosserie) &&
          (inputs.transmission === "" ||
            v.transmission === inputs.transmission) &&
          v.prix >= priceRange[0] &&
          v.prix <= priceRange[1];

        // Add date range filtering
        if (dateRange?.from && dateRange?.to) {
          const rangesOverlap = (a: DateRange, b: DateRange) => {
            if (!a.from || !a.to || !b.from || !b.to) return false;
            return a.from <= b.to && b.from <= a.to;
          };

          // Check if vehicle is available (not reserved in the date range)
          const isAvailable = !Object.values(contrats).some((c) => {
            if (String(c.idVehicule) !== String(id)) return false;

            const reservRange: DateRange = {
              from: new Date(c.reservation.from),
              to: new Date(c.reservation.to),
            };

            return rangesOverlap(dateRange, reservRange);
          });

          return matchesFilters && isAvailable;
        }

        return matchesFilters;
      })
    );

    setFilteredResults(results);
    onResults?.(results);
  };

  return (
    <>
      <Card className="m-0 w-100 mx-auto text-center">
        <CardHeader>
          <CardTitle>Rechercher un véhicule</CardTitle>
          <CardDescription>
            Utilisez les filtres ci-dessous pour affiner votre recherche de
            véhicules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <FieldGroup>
              <Selects
                attribute="marque"
                onChange={handleSelect}
                inputs={inputs}
              />
              <Selects
                attribute="carrosserie"
                onChange={handleSelect}
                inputs={inputs}
              />
              <Selects
                attribute="transmission"
                onChange={handleSelect}
                inputs={inputs}
              />
              <SliderPrix
                value={priceRange}
                onChange={setPriceRange}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
              <CalendarSearch
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </FieldGroup>
            <Button type="submit" className="mt-4">
              Filtrer
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////////////

export function Selects({
  inputs,
  attribute,
  onChange,
}: {
  inputs?: { [attribute]: string };
  attribute: string;
  onChange?: (attribute: string, value: string) => void;
}) {
  // 1. Extract all values for the selected attribute
  const allValues = Object.values(vehicules).map(
    (v) => v[attribute as keyof typeof v]
  );

  // 2. Remove duplicates using Set
  let distinctValues = [...new Set(allValues)].sort((a, b) =>
    String(a).localeCompare(String(b))
  );

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
            {/* 3. Now map the DISTINCT values */}
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
  value: number[];
  onChange: (value: number[]) => void;
  minPrice: number;
  maxPrice: number;
}) {
  return (
    <Field className="w-full">
      <FieldLabel>Tranchre de prix</FieldLabel>
      <FieldDescription>
        Définissez votre fourchette de budget ($
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

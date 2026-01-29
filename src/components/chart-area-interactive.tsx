"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { getReservations } from "@/api/apiClient"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart"

const chartConfig = {
  total: {
    label: "Total réservations",
    color: "hsl(var(--chart-1))",
  },
  active: {
    label: "Réservations actives",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [chartData, setChartData] = useState<{ date: string; total: number; active: number }[]>([]);
  const [timeRange, setTimeRange] = useState("all")

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await getReservations();
        const reservations = res.data;

        // Group by month
        const monthlyData: Record<string, { total: number; active: number }> = {};
        reservations.forEach((reservation: any) => {
          const date = new Date(reservation.dateDebut);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { total: 0, active: 0 };
          }
          monthlyData[monthKey].total += 1;
          if (reservation.statut === "en cours") {
            monthlyData[monthKey].active += 1;
          }
        });

        // Convert to array and sort
        const data = Object.entries(monthlyData)
          .map(([date, counts]) => ({ date, total: counts.total, active: counts.active }))
          .sort((a, b) => a.date.localeCompare(b.date));

        setChartData(data);
      } catch (error) {
        console.error("Erreur lors du chargement des données du graphique:", error);
      }
    };

    fetchChartData();
  }, []);

  const filteredData = chartData.filter((item) => {
    if (timeRange === "all") return true;
    const date = new Date(item.date + "-01");
    const now = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    now.setDate(now.getDate() - daysToSubtract);
    return date >= now;
  })

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Réservations par mois</CardTitle>
          <CardDescription>
            Affichage du nombre de réservations par mois
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="rounded-lg">
              Toutes les données
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              3 derniers mois
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              30 derniers jours
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              7 derniers jours
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-active)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-active)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value + "-01");
                return date.toLocaleDateString("fr", {
                  month: "short",
                  year: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value + "-01").toLocaleDateString("fr", {
                      month: "short",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="active"
              type="natural"
              fill="url(#fillActive)"
              fillOpacity={0.4}
              stroke="none"
              stackId="a"
            />
            <Area
              dataKey="total"
              type="natural"
              fill="url(#fillTotal)"
              fillOpacity={0.4}
              stroke="none"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

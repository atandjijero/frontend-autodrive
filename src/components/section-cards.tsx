import { IconTrendingUp } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { getReservations, getVehicles } from "@/api/apiClient"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  const [stats, setStats] = useState({
    totalReservations: 0,
    totalRevenue: 0,
    totalVehicles: 0,
    activeReservations: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [reservationsRes, vehiclesRes] = await Promise.all([
          getReservations(),
          getVehicles(),
        ]);

        const reservations = reservationsRes.data;
        const vehicles = vehiclesRes.data;

        const totalReservations = reservations.length;
        const activeReservations = reservations.filter(r => r.statut === "en cours").length;
        const totalRevenue = reservations.reduce((sum, r) => sum + (r.vehicleId?.prix || 0), 0);
        const totalVehicles = vehicles.length;

        setStats({
          totalReservations,
          totalRevenue,
          totalVehicles,
          activeReservations,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Réservations</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalReservations}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +{Math.round((stats.activeReservations / stats.totalReservations) * 100) || 0}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Réservations actives <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {stats.activeReservations} en cours
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Revenus Totaux</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalRevenue} €
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Croissance ce mois <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Basé sur les réservations
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Véhicules Disponibles</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalVehicles}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Flotte en expansion <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Véhicules actifs</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Réservations Actives</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.activeReservations}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +{Math.round((stats.activeReservations / stats.totalReservations) * 100) || 0}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Taux d'activité élevé <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Réservations en cours</div>
        </CardFooter>
      </Card>
    </div>
  )
}

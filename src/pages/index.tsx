import { useEffect, useState } from "react";
import { getVehicles } from "@/api/apiClient";
import type { Vehicle } from "@/api/apiClient";

import { CarouselPlugin } from "@/components/carouselPlugin";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function HomePage() {
  const [vehicules, setVehicules] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger uniquement les véhicules
  useEffect(() => {
    getVehicles()
      .then((vehiculesRes) => {
        setVehicules(vehiculesRes.data);
      })
      .catch(() => setError("Impossible de charger les véhicules."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        <Skeleton className="h-40 w-full rounded-md" />
        <Skeleton className="h-40 w-full rounded-md" />
        <Skeleton className="h-40 w-full rounded-md" />
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;
  if (vehicules.length === 0) return <p>Aucun véhicule trouvé.</p>;

  // Filtrer les véhicules disponibles
  const dispos = vehicules.filter((v) => v.disponible);

  return (
    <>
      <title>AutoDrive</title>
      <div className="p-0">
        <CarouselPlugin />
        <h1 className="text-2xl font-bold">AutoDrive</h1>
        <p className="mt-2 text-lg">
          Bienvenue sur Auto Drive, votre plateforme de location de véhicules de
          confiance. Découvrez notre large gamme de voitures adaptées à tous vos
          besoins, que ce soit pour un voyage d'affaires, des vacances en
          famille ou une escapade le temps d'un week-end.
        </p>
        <Separator className="my-4" />

        {/* Liste des véhicules disponibles */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Parcourez les véhicules disponibles aujourd'hui
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dispos.map((vehicule) => (
              <Link
                to={`/vehicules/${vehicule._id}`}
                key={vehicule._id}
                className="no-underline text-inherit"
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>
                      {vehicule.marque} - {vehicule.immatriculation}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={vehicule.photos?.[0] || "/placeholder.png"}
                        alt={`${vehicule.marque} ${vehicule.modele}`}
                        className="rounded-md object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-lg font-semibold">
                        {vehicule.prix} € / jour
                      </p>
                      {vehicule.prix < 50 && (
                        <Badge variant="destructive">Promo</Badge>
                      )}
                      {vehicule.disponible ? (
                        <Badge variant="secondary">Disponible</Badge>
                      ) : (
                        <Badge variant="outline">Indisponible</Badge>
                      )}
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <p className="text-sm text-muted-foreground">Détails</p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Transmission : {vehicule.transmission}</p>
                        <p>Carrosserie : {vehicule.carrosserie}</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Section promo */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">
            Parcourez les véhicules en promotion
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dispos
              .filter((v) => v.prix < 50)
              .map((vehicule) => (
                <Link
                  to={`/vehicules/${vehicule._id}`}
                  key={vehicule._id}
                  className="no-underline text-inherit"
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>
                        {vehicule.marque} - {vehicule.immatriculation}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={vehicule.photos?.[0] || "/placeholder.png"}
                          alt={`${vehicule.marque} ${vehicule.modele}`}
                          className="rounded-md object-cover w-full h-full"
                        />
                      </AspectRatio>
                      <p className="mt-2 text-lg font-semibold">
                        {vehicule.prix} € / jour
                      </p>
                      <Badge variant="destructive">Promo</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

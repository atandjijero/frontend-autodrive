import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { VehiculeSearch } from "@/components/vehiculeSearch";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

import { getVehicles } from "@/api/apiClient";
import type { Vehicle } from "@/api/apiClient";

function VehiculesContent({
  dispos,
  handleSearchResults,
}: {
  dispos: Vehicle[];
  handleSearchResults: (results: Vehicle[]) => void;
}) {
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <div className="flex w-full">
      <Sidebar
        className={cn(
          "sticky top-16 p-3",
          !isMobile && "h-[calc(100vh-4rem)] w-[300px]"
        )}
        collapsible={isMobile ? "offcanvas" : "none"}
      >
        <SidebarContent>
          <VehiculeSearch onResults={handleSearchResults} />
        </SidebarContent>
      </Sidebar>

      <div className="flex-1 p-6 pt-16 md:p-10 w-full">
        {isMobile && (
          <div className="mb-4 fixed top-16 left-0 w-full bg-background z-40 p-4 border-b">
            <Button variant="outline" size="default" onClick={toggleSidebar}>
              <PanelLeftIcon className="mr-2 h-4 w-4" />
              Filtres
            </Button>
          </div>
        )}
        <h1 className="text-2xl font-bold">Véhicules disponibles</h1>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dispos.map((dispo) => (
            <Card
              key={dispo._id}
              className="mb-4 p-4 shadow hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle>
                  {dispo.marque} - {dispo.modele}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={dispo.photos?.[0] || "/placeholder.png"}
                  alt={`${dispo.marque} image`}
                  className="mt-2 h-40 w-full object-cover rounded-md"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Carrosserie: {dispo.carrosserie}
                  <br /> Transmission: {dispo.transmission}
                  <br /> Prix: {dispo.prix} €
                </p>

                {/* Bouton Réserver → redirection */}
                <Button
                  variant="default"
                  size="sm"
                  className="
                    mt-3 mx-auto block w-full font-semibold px-6
                    bg-white text-black border hover:bg-gray-200
                    dark:bg-black dark:text-white dark:hover:bg-gray-800
                  "
                  asChild
                >
                  <Link to={`/reservation/${dispo._id}`}>Réserver</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Vehicules() {
  const [dispos, setDispos] = useState<Vehicle[]>([]);

  useEffect(() => {
    getVehicles()
      .then((res) => setDispos(res.data))
      .catch((err) =>
        console.error("Erreur lors du chargement des véhicules :", err)
      );
  }, []);

  const handleSearchResults = (results: Vehicle[]) => {
    setDispos(results);
  };

  return (
    <>
      <Helmet>
        <title>Nos Véhicules - Location AutoDrive | Catalogue Complet</title>
        <meta name="description" content="Découvrez notre catalogue complet de véhicules de location. Voitures, SUV, utilitaires disponibles à la location. Réservation en ligne, GPS intégré, assurance complète." />
        <meta name="keywords" content="location voiture, véhicule location, catalogue auto, voiture disponible, réservation véhicule, GPS voiture, assurance auto" />
        <meta property="og:title" content="Nos Véhicules - Location AutoDrive" />
        <meta property="og:description" content="Découvrez notre catalogue complet de véhicules de location. Réservation en ligne facile." />
        <meta property="og:url" content="https://autodrive.com/vehicules" />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href="https://autodrive.com/vehicules" />
      </Helmet>

      <SidebarProvider>
        <VehiculesContent
          dispos={dispos}
          handleSearchResults={handleSearchResults}
        />
      </SidebarProvider>
    </>
  );
}

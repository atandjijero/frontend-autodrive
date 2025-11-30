import { useEffect, useState } from "react";
import { VehiculeSearch } from "@/components/vehiculeSearch";
import { vehicules } from "../admin/vehiculesListe";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function Vehicules() {
  const [dispos, setDispos] = useState(vehicules);

  useEffect(() => {
    document.title = "Véhicules – AutoDrive";
  }, []);

  const handleSearchResults = (results: typeof vehicules) => {
    setDispos(results);
  };

  return (
    <SidebarProvider>
      <Sidebar
        className="sticky top-16 h-[calc(100vh-4rem)] p-3"
        collapsible="none"
      >
        <SidebarContent>
          <VehiculeSearch onResults={handleSearchResults} />
        </SidebarContent>
      </Sidebar>
      <div className="p-0 mx-auto">
        <h1 className="text-2xl font-bold">Véhicules</h1>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(dispos).map(([id, dispo]) => (
            <Link
              to={`/vehicules/${id}`}
              key={id}
              className="no-underline text-inherit"
            >
              <Card className="mb-4 pb-4">
                <img
                  src={dispo.imageUrl}
                  alt={`${dispo.marque} image`}
                  className="mt-2 h-40 w-auto object-cover"
                />
                <h2 className="text-xl font-semibold">
                  {id} - {dispo.marque} - {dispo.modele}
                </h2>
                <p>
                  Carrosserie: {dispo.carrosserie}
                  <br /> Transmission: {dispo.transmission}
                  <br /> Prix: {dispo.prix} €
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </SidebarProvider>
  );
}

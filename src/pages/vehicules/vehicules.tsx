import { useEffect, useState } from "react";
import { VehiculeSearch } from "@/components/vehiculeSearch";
import { vehicules } from "../admin/vehiculesListe";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Vehicules() {
  const [dispos, setDispos] = useState(vehicules);

  useEffect(() => {
    document.title = "Véhicules – AutoDrive";
  }, []);

  const handleSearchResults = (results: typeof vehicules) => {
    setDispos(results);
  };

  return (
    <div className="mx-auto p-0">
      <h1 className="text-2xl font-bold">Véhicules</h1>
      <VehiculeSearch onResults={handleSearchResults} />

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
              <p>Carrosserie: {dispo.carrosserie}</p>
              <p>Transmission: {dispo.transmission}</p>
              <p>Prix: {dispo.prix} €</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getVehicles } from "@/api/apiClient";
import type { Vehicle } from "@/api/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
//import { Icon } from "lucide-react";
import { IconEdit, IconTrash } from "@tabler/icons-react";

export default function VehiculesListe() {
  const [vehicules, setVehicules] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getVehicles()
      .then((res) => {
        console.log("Réponse API :", res.data);
        setVehicules(res.data);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des véhicules :", err);
        setError("Impossible de charger les véhicules.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des véhicules...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (vehicules.length === 0) return <p>Aucun véhicule trouvé.</p>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Liste des véhicules</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicules.map((vehicule) => (
          <Card key={vehicule._id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>
                {vehicule.marque} {vehicule.modele}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vehicule.photos?.[0] ? (
                <img
                  src={vehicule.photos[0]}
                  alt={`${vehicule.marque} ${vehicule.modele}`}
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
                  Pas d'image
                </div>
              )}
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Carrosserie :</strong> {vehicule.carrosserie}
                </p>
                <p>
                  <strong>Transmission :</strong> {vehicule.transmission}
                </p>
                <p>
                  <strong>Prix :</strong> {vehicule.prix} €
                </p>
                <p>
                  <strong>Immatriculation :</strong> {vehicule.immatriculation}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Actions</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/vehicules/modifier/${vehicule._id}`}>
                        <IconEdit />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/vehicules/supprimer/${vehicule._id}`}>
                        <IconTrash />
                        Supprimer
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-right text-gray-600">
        Total : {vehicules.length} véhicules
      </p>
    </>
  );
}

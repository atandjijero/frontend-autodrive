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
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useAuth } from "@/hooks/useAuth";

export default function VehiculesDisponible() {
  const [vehicules, setVehicules] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    getVehicles()
      .then((res) => {
        console.log("Réponse API :", res.data);
        // Filtrer les véhicules disponibles
        const disponibles = res.data.filter((v: Vehicle) => v.disponible);
        setVehicules(disponibles);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des véhicules :", err);
        setError("Impossible de charger les véhicules.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des véhicules...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (vehicules.length === 0) return <p>Aucun véhicule disponible trouvé.</p>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Véhicules Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicules.map((vehicule) => (
          <Card key={vehicule.id} className="overflow-hidden">
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
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Aucune image</span>
                </div>
              )}
              <p className="text-sm text-gray-600 mb-2">
                Transmission: {vehicule.transmission}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Prix: {vehicule.prix}€
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Immatriculation: {vehicule.immatriculation}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-green-500 font-semibold">Disponible</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/vehicules/modifier/${vehicule.id}`}>
                        <IconEdit className="mr-2 h-4 w-4" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    {currentUser?.role !== 'testeur' && (
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/vehicules/supprimer/${vehicule.id}`}>
                          <IconTrash className="mr-2 h-4 w-4" />
                          Supprimer
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
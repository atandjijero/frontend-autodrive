import { useEffect, useState } from "react";
import { getReservations, deleteReservation } from "@/api/apiClient";
import type { Reservation } from "@/api/apiClient";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export default function ReservationList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les réservations
  useEffect(() => {
    getReservations()
      .then((res) => setReservations(res.data))
      .catch(() => setError("Impossible de charger les réservations."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteReservation(id);
      setReservations((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Erreur lors de la suppression de la réservation.");
    }
  };

  if (loading) return <p>Chargement des réservations...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (reservations.length === 0) return <p>Aucune réservation trouvée.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Liste des réservations</h2>
      <Separator className="mb-6" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reservations.map((res) => (
          <Card key={res._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>
                {res.vehicleId.marque} - {res.vehicleId.modele}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AspectRatio ratio={16 / 9}>
                <img
                  src={res.vehicleId.photos?.[0] || "/placeholder.png"}
                  alt={`${res.vehicleId.marque} ${res.vehicleId.modele}`}
                  className="rounded-md object-cover w-full h-full"
                />
              </AspectRatio>

              <div className="mt-3 space-y-1">
                <p>
                  <strong>Client :</strong> {res.clientId.nom} {res.clientId.prenom}
                </p>
                <p>
                  <strong>Email :</strong> {res.clientId.email}
                </p>
                <p>
                  <strong>Téléphone :</strong> {res.clientId.telephone}
                </p>
                <p>
                  <strong>Période :</strong>{" "}
                  {new Date(res.dateDebut).toLocaleDateString()} →{" "}
                  {new Date(res.dateFin).toLocaleDateString()}
                </p>
                <Badge variant={res.statut === "en cours" ? "secondary" : res.statut === "terminée" ? "outline" : "destructive"}>
                  {res.statut}
                </Badge>
              </div>

              {/* Suppression avec AlertDialog */}
              <div className="mt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Supprimer</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Voulez-vous vraiment supprimer cette réservation ?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(res._id)}>
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

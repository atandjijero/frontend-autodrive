import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { addReservation } from "@/api/apiClient";
import type { CreateReservationDto } from "@/api/apiClient";

export default function ReservationForm() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const nom = localStorage.getItem("userName") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const clientId = localStorage.getItem("userId");

    if (!clientId) {
      setErrorMessage("Veuillez vous connecter pour effectuer une réservation.");
      return;
    }

    if (!dateDebut || !dateFin) {
      setErrorMessage("Veuillez sélectionner une date de début et une date de fin.");
      return;
    }
    if (new Date(dateDebut) >= new Date(dateFin)) {
      setErrorMessage("La date de fin doit être postérieure à la date de début.");
      return;
    }

    const payload: CreateReservationDto = {
      vehicleId: vehicleId!,
      clientId,
      dateDebut: new Date(dateDebut).toISOString(),
      dateFin: new Date(dateFin).toISOString(),
    };

    try {
      const res = await addReservation(payload);
      setSuccessMessage(`✅ Merci ${nom}, votre réservation a été confirmée avec succès.`);
      console.log("Réservation créée :", res.data);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message ||
          "❌ Une erreur est survenue lors de la réservation. Veuillez réessayer."
      );
    }
  };

  const handlePaymentRedirect = () => {
    navigate("/paiement");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Réservation</CardTitle>
          <CardDescription>
            Remplissez les informations pour réserver votre véhicule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" value={nom} readOnly />
            </div>
            <div>
              <Label htmlFor="dateDebut">Date début</Label>
              <Input
                type="date"
                id="dateDebut"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dateFin">Date fin</Label>
              <Input
                type="date"
                id="dateFin"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" variant="default">
              Confirmer la réservation
            </Button>

            {successMessage && (
              <div className="text-center mt-3">
                <p className="text-green-600 font-medium">{successMessage}</p>
                <Button
                  onClick={handlePaymentRedirect}
                  className="mt-4 w-full"
                  variant="secondary"
                >
                  Procéder au paiement
                </Button>
              </div>
            )}
            {errorMessage && (
              <p className="text-red-600 text-center mt-3 font-medium">
                {errorMessage}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

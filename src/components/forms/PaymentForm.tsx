import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { addPaiement, getReservationById } from "@/api/apiClient";

export default function PaymentForm() {
  const { reservationId } = useParams();

  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const [amount, setAmount] = useState<number | null>(null);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Charger la réservation pour récupérer le montant
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        if (!reservationId) return;

        const res = await getReservationById(reservationId);
        const prix = res.data.vehicleId.prix;

        setAmount(prix);
      } catch (err) {
        setErrorMessage("❌ Impossible de charger la réservation.");
      }
    };

    fetchReservation();
  }, [reservationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!reservationId) {
      setErrorMessage("❌ Réservation introuvable.");
      return;
    }

    if (!amount) {
      setErrorMessage("❌ Montant invalide.");
      return;
    }

    const payload = {
      reservationId,
      nom: name,
      email,
      montant: amount,
      numeroCarte: cardNumber.replace(/\s/g, ""),
      expiration: expiry,
      cvv,
    };

    try {
      await addPaiement(payload);
      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message ||
          "❌ Une erreur est survenue lors du paiement."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Paiement sécurisé</CardTitle>
          <CardDescription>
            Finalisez votre réservation en toute sécurité
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nom complet</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <Label>Montant (€)</Label>
                <Input value={amount ?? ""} readOnly className="bg-gray-200" />
              </div>

              <div>
                <Label>Numéro de carte</Label>
                <Input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  required
                />
              </div>

              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label>Expiration (MM/AA)</Label>
                  <Input
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="12/25"
                    required
                  />
                </div>

                <div className="flex-1">
                  <Label>CVV</Label>
                  <Input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Payer
              </Button>

              {errorMessage && (
                <p className="text-red-600 text-center mt-3 font-medium">{errorMessage}</p>
              )}
            </form>
          ) : (
            <div className="text-center">
              <p className="text-green-600 font-semibold text-lg">
                Paiement effectué avec succès !
              </p>

              <Button
                className="mt-4 w-full"
                variant="outline"
                onClick={() =>
                  window.open(
                    `http://localhost:9000/reservations/${reservationId}/recu`,
                    "_blank"
                  )
                }
              >
                Télécharger le reçu PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

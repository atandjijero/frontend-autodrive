import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
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
import { addPaiement, getReservationById, downloadReservationReceipt, getAgencyById } from "@/api/apiClient";
import { saveAs } from "file-saver";

export default function PaymentForm() {
  const { reservationId } = useParams<{ reservationId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const [amount, setAmount] = useState<number | null>(null);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [agency, setAgency] = useState<any>(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        if (!reservationId) return;
        const res = await getReservationById(reservationId);
        const reservationData = res.data;
        
        const prix = reservationData.vehicleId?.prix;
        setAmount(prix ?? null);

        // Récupérer les informations de l'agence si elle existe
        if (reservationData.vehicleId?.agencyId) {
          try {
            const agencyRes = await getAgencyById(reservationData.vehicleId.agencyId);
            setAgency(agencyRes.data);
          } catch (agencyErr) {
            console.warn("Impossible de récupérer les informations de l'agence:", agencyErr);
          }
        }
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
      // Ne pas lancer le téléchargement ici — on passe en mode success
      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || "❌ Une erreur est survenue lors du paiement."
      );
    }
  };

  const handleDownloadAndRedirect = async () => {
    if (!reservationId) {
      console.error("Téléchargement impossible : reservationId manquant");
      return;
    }

    // Construire l'URL avec les informations de l'agence
    let receiptUrl = `http://localhost:9000/reservations/${reservationId}/recu`;
    
    if (agency) {
      const agencyParams = new URLSearchParams({
        agencyName: agency.name || '',
        agencyAddress: agency.address || '',
        agencyCity: agency.city || '',
        agencyPhone: agency.phone || '',
        agencyEmail: agency.email || ''
      });
      receiptUrl += `?${agencyParams.toString()}`;
    }

    // essayer d'ouvrir dans un nouvel onglet
    let popupOpened = false;
    try {
      const popup = window.open(receiptUrl, "_blank");
      popupOpened = !!popup;
      if (!popupOpened) {
        // fallback : télécharger via API
        try {
          const resp = await downloadReservationReceipt(reservationId);
          const blob = new Blob([resp.data], { type: resp.headers["content-type"] || "application/pdf" });
          const filename = `recu_reservation_${reservationId}.pdf`;
          saveAs(blob, filename);
        } catch (downloadErr) {
          console.error("Erreur lors du téléchargement du reçu (fallback) :", downloadErr);
        }
      }
    } catch (e) {
      console.error("Erreur lors de l'ouverture du reçu :", e);
    }

    // redirection seulement pour les 3 rôles demandés (préférer user du contexte)
    const role = user?.role || localStorage.getItem("userRole") || localStorage.getItem("role");
    console.debug("Payment button click:", { reservationId, role, popupOpened });

    if (!role) {
      console.warn("Aucun rôle trouvé pour la redirection — aucune navigation effectuée.");
      return;
    }

    const redirectMap: Record<string, string> = {
      client: "/client/dashboard",
      tourist: "/touriste/dashboard",
      touriste: "/touriste/dashboard",
      entreprise: "/entreprise/dashboard",
    };

    const target = redirectMap[role];
    if (target) {
      // petit délai pour laisser le téléchargement démarrer
      setTimeout(() => navigate(target), 250);
    } else {
      console.warn("Role présent mais pas de route correspondante:", role);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Paiement sécurisé</CardTitle>
          <CardDescription>Finalisez votre réservation en toute sécurité</CardDescription>
        </CardHeader>

        <CardContent>
          {!success ? (
            <>
              {/* Informations de l'agence */}
              {agency && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Informations de l'agence</h3>
                  <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <p><strong>Nom:</strong> {agency.name}</p>
                    <p><strong>Adresse:</strong> {agency.address}, {agency.city} {agency.postalCode}</p>
                    <p><strong>Téléphone:</strong> {agency.phone}</p>
                    <p><strong>Email:</strong> {agency.email}</p>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                    Ces informations seront incluses sur votre reçu de paiement.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="amount">Montant (€)</Label>
                <Input id="amount" value={amount ?? ""} readOnly className="bg-gray-200" />
              </div>

              <div>
                <Label htmlFor="cardNumber">Numéro de carte</Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  required
                />
              </div>

              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="expiry">Expiration (MM/AA)</Label>
                  <Input id="expiry" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="12/25" required />
                </div>

                <div className="flex-1">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" type="password" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" required />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Payer
              </Button>

              {errorMessage && <p className="text-red-600 text-center mt-3 font-medium">{errorMessage}</p>}
            </form>
            </>
          ) : (
            <div className="text-center">
              <p className="text-green-600 font-semibold text-lg">Paiement effectué avec succès !</p>

              <Button className="mt-4 w-full" variant="outline" onClick={handleDownloadAndRedirect}>
                Télécharger le reçu PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
 

import { useState, useEffect } from "react";
import { toast } from "sonner";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { addPaiement, getReservationById, downloadReservationReceipt } from "@/api/apiClient";
import { saveAs } from "file-saver";
import { CreditCard, Smartphone } from "lucide-react";

export default function PaymentForm() {
  const { reservationId } = useParams<{ reservationId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const [amount, setAmount] = useState<number | null>(null);
  const [baseAmount, setBaseAmount] = useState<number | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [appliedPromotion, setAppliedPromotion] = useState<any>(null);

  const [paymentMethod, setPaymentMethod] = useState<"CARTE" | "TMONEY" | "FLOOZ">("CARTE");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!name && (user.prenom || user.nom)) {
        setName(`${user.prenom} ${user.nom}`.trim());
      }
      if (!email && user.email) {
        setEmail(user.email);
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        if (!reservationId) return;
        const res = await getReservationById(reservationId);
        const reservationData = res.data;
        
        const prix = reservationData.vehicle?.prix != null ? reservationData.vehicle.prix : null;

        // Calculer le montant total en fonction de la durée (jours)
        let computedAmount: number | null = prix ?? null;
        let days = 1;
        if (reservationData.dateDebut && reservationData.dateFin && prix != null) {
          const start = new Date(reservationData.dateDebut);
          const end = new Date(reservationData.dateFin);
          const msPerDay = 24 * 60 * 60 * 1000;
          const diffDays = Math.ceil((end.getTime() - start.getTime()) / msPerDay);
          days = diffDays > 0 ? diffDays : 1;
          computedAmount = days * prix;
        }

        setBaseAmount(computedAmount);

        // Appliquer la promotion si présente
        if (reservationData.promotionId && computedAmount !== null) {
          const promo = reservationData.promotionId;
          setAppliedPromotion(promo);

          const promotionValue = Number(promo.valeur ?? 0);
          let discount = 0;

          if (promo.type === "pourcentage") {
            discount = Number.isFinite(promotionValue)
              ? (computedAmount * promotionValue) / 100
              : 0;
          } else {
            discount = Number.isFinite(promotionValue)
              ? Math.min(promotionValue, computedAmount)
              : 0;
          }

          if (!Number.isFinite(discount) || discount < 0) {
            discount = 0;
          }

          const totalToPay = computedAmount - discount;
          setDiscountAmount(discount);
          setAmount(Number.isFinite(totalToPay) ? totalToPay : 0);
        } else {
          setAmount(computedAmount);
        }

      } catch (err) {
        setErrorMessage("❌ Impossible de charger la réservation.");
      }
    };
    fetchReservation();
  }, [reservationId]);

  const getDashboardPath = (role?: string | null) => {
    const r = role?.toLowerCase() || "client";
    const redirectMap: Record<string, string> = {
      admin: "/admin/dashboard",
      testeur: "/admin/dashboard",
      client: "/client/dashboard",
      tourist: "/touriste/dashboard",
      touriste: "/touriste/dashboard",
      entreprise: "/entreprise/dashboard",
    };
    return redirectMap[r] || "/client/dashboard";
  };

  const handleDownloadAndRedirect = async () => {
    try {
      if (reservationId) {
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
      console.error("Erreur lors du téléchargement/redirection :", e);
    }

    const role = user?.role || localStorage.getItem("userRole") || localStorage.getItem("role");
    const target = getDashboardPath(role);
    
    // Redirection automatique après le téléchargement (petit délai)
    toast.info("Redirection vers votre tableau de bord...");
    setTimeout(() => navigate(target), 2000);
  };

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

    const payload: any = {
      reservationId,
      nom: name,
      email,
      montant: amount,
      methodePaiement: paymentMethod,
    };

    if (paymentMethod === "CARTE") {
      payload.numeroCarte = cardNumber.replace(/\s/g, "");
      payload.expiration = expiry;
      payload.cvv = cvv;
    } else {
      payload.telephone = phone;
    }

    try {
      await addPaiement(payload);
      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || "❌ Une erreur est survenue lors du paiement."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black p-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Paiement sécurisé</CardTitle>
          <CardDescription>
            {appliedPromotion ? (
              <span className="text-green-600 font-semibold flex items-center justify-center gap-1">
                ✨ Promotion appliquée : {appliedPromotion.titre}
              </span>
            ) : (
              "Finalisez votre réservation"
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sous-total :</span>
              <span>{baseAmount} €</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Remise ({appliedPromotion?.type === 'pourcentage' ? `${appliedPromotion?.valeur}%` : 'Fixe'}) :</span>
                <span>-{discountAmount.toFixed(2)} €</span>
              </div>
            )}
            <div className="pt-2 border-t flex justify-between font-bold text-lg">
              <span>Total à payer :</span>
              <span className="text-blue-600">{amount?.toFixed(2)} €</span>
            </div>
          </div>

          {!success ? (
            <div className="space-y-6">
              <Tabs defaultValue="CARTE" onValueChange={(v) => setPaymentMethod(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="CARTE" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Carte
                  </TabsTrigger>
                  <TabsTrigger value="TMONEY" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" /> TMoney
                  </TabsTrigger>
                  <TabsTrigger value="FLOOZ" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" /> Flooz
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>

                  <TabsContent value="CARTE" className="space-y-4 mt-0">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Numéro de carte</Label>
                      <Input
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        required={paymentMethod === "CARTE"}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiration (MM/AA)</Label>
                        <Input 
                          id="expiry" 
                          value={expiry} 
                          onChange={(e) => setExpiry(e.target.value)} 
                          placeholder="12/25" 
                          required={paymentMethod === "CARTE"} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv" 
                          type="password" 
                          value={cvv} 
                          onChange={(e) => setCvv(e.target.value)} 
                          placeholder="123" 
                          required={paymentMethod === "CARTE"} 
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="TMONEY" className="space-y-4 mt-0">
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-200">
                      Paiement via TMoney Togo. Un code de confirmation vous sera envoyé.
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Numéro TMoney</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        placeholder="90 xx xx xx" 
                        required={paymentMethod === "TMONEY"} 
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="FLOOZ" className="space-y-4 mt-0">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200">
                      Paiement via Moov Flooz. Un code de confirmation vous sera envoyé.
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone-flooz">Numéro Flooz</Label>
                      <Input 
                        id="phone-flooz" 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        placeholder="99 xx xx xx" 
                        required={paymentMethod === "FLOOZ"} 
                      />
                    </div>
                  </TabsContent>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-md transition-all duration-200 transform hover:scale-[1.02]">
                    Confirmer le paiement de {amount} €
                  </Button>

                  {errorMessage && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm text-center">
                      {errorMessage}
                    </div>
                  )}
                </form>
              </Tabs>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-600">Paiement effectué !</h3>
                <p className="text-muted-foreground mt-2">Votre réservation est maintenant confirmée.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button className="w-full" variant="default" onClick={handleDownloadAndRedirect}>
                  Télécharger le reçu PDF
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={() => {
                    const currentRole = user?.role || localStorage.getItem("userRole") || localStorage.getItem("role");
                    console.log("Navigation vers dashboard. Rôle détecté:", currentRole);
                    navigate(getDashboardPath(currentRole));
                  }}
                >
                  Retour au tableau de bord
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
 

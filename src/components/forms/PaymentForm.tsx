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

export default function PaymentForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!name || !email || !amount || !cardNumber || !expiry || !cvv) {
      setErrorMessage("❌ Veuillez remplir tous les champs.");
      return;
    }

    // Ici tu peux intégrer Stripe, PayPal ou ton API de paiement
    console.log("Infos paiement envoyées :", {
      name,
      email,
      amount,
      cardNumber,
      expiry,
      cvv,
    });

    setSuccessMessage("✅ Paiement effectué avec succès. Merci pour votre réservation !");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Paiement sécurisé</CardTitle>
          <CardDescription>
            Entrez vos informations pour finaliser la réservation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean Dupont"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="amount">Montant (€)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                required
              />
            </div>

            <div>
              <Label htmlFor="cardNumber">Numéro de carte</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="expiry">Expiration (MM/AA)</Label>
                <Input
                  id="expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="12/25"
                  required
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
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


            {successMessage && (
              <p className="text-green-600 text-center mt-3 font-medium">
                {successMessage}
              </p>
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

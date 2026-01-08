import { useState, useEffect } from "react";
import { appliquerPromotion, getActivePromotions } from "@/api/apiClient";
import type { Promotion } from "@/api/apiClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function PromotionsAppliquer() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promotionId, setPromotionId] = useState("");
  const [montantBase, setMontantBase] = useState(0);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    getActivePromotions().then((res) => setPromotions(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promotionId) return;
    try {
      const res = await appliquerPromotion(promotionId, { montantBase });
      setResult(res.data);
    } catch (err: any) {
      setResult({ error: "❌ Erreur lors de l'application de la promotion." });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle>Appliquer une promotion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="promotionId" className="text-lg">Sélectionner une promotion</Label>
            <Select value={promotionId} onValueChange={setPromotionId}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choisir une promotion" />
              </SelectTrigger>
              <SelectContent>
                {promotions.map((promo) => (
                  <SelectItem key={promo._id} value={promo._id}>
                    {promo.titre} - {promo.type === "pourcentage" ? `${promo.valeur}%` : `${promo.valeur} €`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="montantBase" className="text-lg">Montant de base</Label>
            <Input id="montantBase" type="number" value={montantBase} onChange={(e) => setMontantBase(Number(e.target.value))} className="h-12" />
          </div>
          <Button type="submit" className="w-full h-12 text-lg">Appliquer</Button>
        </form>
        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            {result.error ? (
              <p className="text-red-500 text-lg">{result.error}</p>
            ) : (
              <>
                <p className="text-green-600 text-lg">Montant remise : {result.montantRemise} €</p>
                <p className="text-green-600 text-lg">Montant final : {result.montantFinal} €</p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

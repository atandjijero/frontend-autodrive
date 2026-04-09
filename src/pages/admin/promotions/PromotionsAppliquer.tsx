import { useState, useEffect } from "react";
import { appliquerPromotion, getActivePromotions, getVehicleById } from "@/api/apiClient";
import type { Promotion, Vehicle } from "@/api/apiClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function PromotionsAppliquer() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [vehiclesOfPromo, setVehiclesOfPromo] = useState<Vehicle[]>([]);
  const [montantBase, setMontantBase] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getActivePromotions().then((res) => setPromotions(res.data));
  }, []);

  const handlePromotionChange = async (promoId: string) => {
    const promo = promotions.find(p => String(p.id) === promoId);
    if (promo) {
      setSelectedPromo(promo);
      setResult(null);
      setMessage(null);
      setVehiclesOfPromo([]);
      
      // Si la promotion a des véhicules associés
      if (promo.vehiculesIds && promo.vehiculesIds.length > 0) {
        try {
          // Récupérer TOUS les véhicules associés
          const vehiclePromises = promo.vehiculesIds.map(id => 
            getVehicleById(id).then(res => res.data).catch(() => null)
          );
          const vehicles = (await Promise.all(vehiclePromises)).filter(v => v !== null);
          
          if (vehicles.length > 0) {
            setVehiclesOfPromo(vehicles as Vehicle[]);
            // Auto-remplir avec le prix du premier véhicule
            setMontantBase(vehicles[0].prix || 0);
          } else {
            setMessage("⚠️ Impossible de récupérer les véhicules. Entrez le montant manuellement.");
            setMontantBase(0);
          }
        } catch (err) {
          setMessage("⚠️ Erreur lors du chargement des véhicules.");
          setMontantBase(0);
        }
      } else {
        // Promotion globale
        setMontantBase(0);
        setMessage("💡 Promotion globale - Entrez le montant de base manuellement");
      }
    }
  };

  const handleVehicleSelect = (vehicleId: number | string) => {
    const vehicle = vehiclesOfPromo.find(v => v.id === vehicleId);
    if (vehicle) {
      setMontantBase(vehicle.prix || 0);
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPromo) {
      setMessage("❌ Sélectionnez une promotion");
      return;
    }
    
    if (montantBase <= 0) {
      setMessage("❌ Entrez un montant de base supérieur à 0");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      setResult(null);
      
      const res = await appliquerPromotion(selectedPromo.id, { montantBase });
      setResult(res.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Erreur lors de l'application de la promotion.";
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const promoInfo = selectedPromo ? {
    titre: selectedPromo.titre,
    description: selectedPromo.description,
    type: selectedPromo.type,
    valeur: selectedPromo.valeur,
    dureeMin: selectedPromo.dureeMinLocation,
    montantMin: selectedPromo.montantMinCommande,
  } : null;

  const prixMoyen = vehiclesOfPromo.length > 0 
    ? (vehiclesOfPromo.reduce((sum, v) => sum + (v.prix || 0), 0) / vehiclesOfPromo.length).toFixed(2)
    : 0;

  return (
    <Card className="max-w-2xl mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle>Appliquer une promotion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="promotionId" className="text-lg font-semibold">Sélectionner une promotion</Label>
            <Select value={selectedPromo?.id ? String(selectedPromo.id) : ""} onValueChange={handlePromotionChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choisir une promotion" />
              </SelectTrigger>
              <SelectContent>
                {promotions.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">Aucune promotion active</div>
                ) : (
                  promotions.map((promo) => (
                    <SelectItem key={promo.id} value={String(promo.id)}>
                      {promo.titre} - {promo.type === "pourcentage" ? `${promo.valeur}%` : `${promo.valeur} €`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Afficher les infos de la promotion sélectionnée */}
          {promoInfo && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">{promoInfo.titre}</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">{promoInfo.description}</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div>
                  <span className="font-semibold">Réduction:</span> {promoInfo.type === "pourcentage" ? `${promoInfo.valeur}%` : `${promoInfo.valeur} €`}
                </div>
                {promoInfo.dureeMin > 1 && (
                  <div>
                    <span className="font-semibold">Durée min:</span> {promoInfo.dureeMin} jours
                  </div>
                )}
                {promoInfo.montantMin > 0 && (
                  <div>
                    <span className="font-semibold">Montant min:</span> {promoInfo.montantMin} €
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Afficher les véhicules de la promotion */}
          {vehiclesOfPromo.length > 0 && (
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Véhicules concernés par cette promotion ({vehiclesOfPromo.length})
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vehiclesOfPromo.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => handleVehicleSelect(vehicle.id)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-left ${
                      montantBase === vehicle.prix
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300"
                    }`}
                  >
                    <div className="font-semibold text-sm">
                      {vehicle.marque} {vehicle.modele || vehicle.immatriculation}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {vehicle.immatriculation}
                    </div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {vehicle.prix} € / jour
                    </div>
                  </button>
                ))}
              </div>
              {vehiclesOfPromo.length > 1 && (
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Prix moyen: {prixMoyen} €
                </p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="montantBase" className="text-lg font-semibold">
              Montant de base (€)
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              {vehiclesOfPromo.length > 0 
                ? "Sélectionnez un véhicule ou entrez manuellement" 
                : "Entrez le montant"}
            </p>
            <Input
              id="montantBase"
              type="number"
              step="0.01"
              min="0"
              value={montantBase}
              onChange={(e) => setMontantBase(parseFloat(e.target.value) || 0)}
              placeholder="Entrez le montant"
              className="h-12"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-lg" disabled={loading || !selectedPromo}>
            {loading ? "Calcul en cours..." : "Calculer la réduction"}
          </Button>

          {message && (
            <div className={`p-3 rounded text-sm ${
              message.startsWith("❌") ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300" :
              message.startsWith("⚠️") ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300" :
              "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
            }`}>
              {message}
            </div>
          )}
        </form>

        {result && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">Résultat de la réduction</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-200">Montant de base:</span>
                <span className="font-semibold text-green-900 dark:text-green-100">{montantBase.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-200">Montant remise:</span>
                <span className="font-semibold text-green-900 dark:text-green-100">-{result.montantRemise?.toFixed(2) || 0} €</span>
              </div>
              <hr className="border-green-200 dark:border-green-700 my-2" />
              <div className="flex justify-between text-lg">
                <span className="font-bold text-green-900 dark:text-green-100">Montant final:</span>
                <span className="font-bold text-green-900 dark:text-green-100">{result.montantFinal?.toFixed(2) || 0} €</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

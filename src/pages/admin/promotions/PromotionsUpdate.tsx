import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPromotionById, updatePromotion, getVehicles } from "@/api/apiClient";
import type { Promotion, UpdatePromotionDto, Vehicle } from "@/api/apiClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function PromotionsUpdate() {
  const { id } = useParams();
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [promoRes, vehRes] = await Promise.all([
          getPromotionById(id!),
          getVehicles()
        ]);
        setPromotion(promoRes.data);
        setVehicles(vehRes.data.filter(v => v.disponible)); // Only available vehicles
      } catch (err: any) {
        setMessage("Erreur de chargement : " + (err.message || "Inconnue"));
      }
    };
    if (id) {
      loadData();
    } else {
      setMessage("ID de promotion manquant dans l'URL");
    }
  }, [id]);

  const handleChange = (field: keyof UpdatePromotionDto, value: any) => {
    setPromotion((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !promotion) return;

    // Créer un objet avec seulement les champs modifiables
    const updateData: UpdatePromotionDto = {
      titre: promotion.titre,
      description: promotion.description,
      type: promotion.type,
      valeur: promotion.valeur,
      dateDebut: promotion.dateDebut,
      dateFin: promotion.dateFin,
      vehiculeId: promotion.vehiculeId,
      utilisationMax: promotion.utilisationMax,
      codesPromo: promotion.codesPromo,
      dureeMinLocation: promotion.dureeMinLocation,
      montantMinCommande: promotion.montantMinCommande,
    };

    try {
      await updatePromotion(id, updateData);
      setMessage("✅ Promotion mise à jour !");
    } catch (err: any) {
      setMessage("❌ Erreur lors de la mise à jour : " + (err.response?.data?.message || err.message));
    }
  };

  if (!promotion) return <p>Chargement...</p>;

  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle>Modifier la promotion</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="titre">Titre</Label>
              <Input
                id="titre"
                value={promotion.titre || ""}
                onChange={(e) => handleChange("titre", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={promotion.type}
                onValueChange={(val) => handleChange("type", val as "pourcentage" | "montant")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pourcentage">Pourcentage</SelectItem>
                  <SelectItem value="montant">Montant fixe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={promotion.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valeur">Valeur</Label>
              <Input
                id="valeur"
                type="number"
                value={promotion.valeur || 0}
                onChange={(e) => handleChange("valeur", Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="vehiculeId">Véhicule associé</Label>
              <Select
                value={promotion.vehiculeId || ""}
                onValueChange={(val) => handleChange("vehiculeId", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((veh) => (
                    <SelectItem key={veh._id} value={veh._id}>
                      {veh.marque} {veh.modele} - {veh.immatriculation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateDebut">Date début</Label>
              <Input
                id="dateDebut"
                type="date"
                value={promotion.dateDebut?.slice(0, 10) || ""}
                onChange={(e) => handleChange("dateDebut", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateFin">Date fin</Label>
              <Input
                id="dateFin"
                type="date"
                value={promotion.dateFin?.slice(0, 10) || ""}
                onChange={(e) => handleChange("dateFin", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="utilisationMax">Utilisation max</Label>
              <Input
                id="utilisationMax"
                type="number"
                value={promotion.utilisationMax || 0}
                onChange={(e) => handleChange("utilisationMax", Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="dureeMinLocation">Durée min location (jours)</Label>
              <Input
                id="dureeMinLocation"
                type="number"
                value={promotion.dureeMinLocation || 1}
                onChange={(e) => handleChange("dureeMinLocation", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="montantMinCommande">Montant min commande (€)</Label>
              <Input
                id="montantMinCommande"
                type="number"
                value={promotion.montantMinCommande || 0}
                onChange={(e) => handleChange("montantMinCommande", Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="codesPromo">Codes promo (séparés par des virgules)</Label>
              <Input
                id="codesPromo"
                value={promotion.codesPromo?.join(",") || ""}
                onChange={(e) => handleChange("codesPromo", e.target.value.split(","))}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Mettre à jour
          </Button>
          {message && <p className="mt-2 text-center">{message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}

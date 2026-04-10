import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPromotionById, updatePromotion, getVehicles } from "@/api/apiClient";
import type { UpdatePromotionDto, Vehicle } from "@/api/apiClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function PromotionsUpdate() {
  const { id } = useParams();
  const [formData, setFormData] = useState<UpdatePromotionDto>({});
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<number[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [promoRes, vehRes] = await Promise.all([
          getPromotionById(id!),
          getVehicles()
        ]);
        const promo = promoRes.data;
        setFormData({
          titre: promo.titre,
          description: promo.description,
          type: promo.type,
          valeur: promo.valeur,
          dateDebut: promo.dateDebut,
          dateFin: promo.dateFin,
          vehiculesIds: promo.vehiculesIds || [],
          utilisationMax: promo.utilisationMax,
          codesPromo: promo.codesPromo,
          dureeMinLocation: promo.dureeMinLocation,
          montantMinCommande: promo.montantMinCommande,
        });
        setSelectedVehicleIds(promo.vehiculesIds || []);
        setAllVehicles(vehRes.data);
        setLoading(false);
      } catch (err: any) {
        setMessage("❌ Erreur de chargement : " + (err.message || "Inconnue"));
        setLoading(false);
      }
    };
    if (id) {
      loadData();
    } else {
      setMessage("❌ ID de promotion manquant dans l'URL");
      setLoading(false);
    }
  }, [id]);

  // Véhicules candidats aux promotions + ceux déjà sélectionnés (même s'ils ne sont plus dispo)
  const displayVehicles = allVehicles.filter(
    (v) => (v.disponible && v.promotionCandidate) || selectedVehicleIds.includes(v.id)
  );

  const handleChange = (field: keyof UpdatePromotionDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleVehicle = (vehicleId: number) => {
    setSelectedVehicleIds((prev) => {
      const next = prev.includes(vehicleId)
        ? prev.filter((vid) => vid !== vehicleId)
        : [...prev, vehicleId];
      setFormData((fd) => ({ ...fd, vehiculesIds: next }));
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!formData.dateDebut || !formData.dateFin) {
      setMessage("❌ Les dates de début et fin sont requises.");
      return;
    }

    const dateDebut = new Date(formData.dateDebut);
    const dateFin = new Date(formData.dateFin);
    
    if (dateDebut >= dateFin) {
      setMessage("❌ La date de fin doit être après la date de début.");
      return;
    }

    try {
      setIsSaving(true);
      setMessage(null);
      await updatePromotion(id, { ...formData, vehiculesIds: selectedVehicleIds });
      setMessage("✅ Promotion mise à jour avec succès !");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Erreur inconnue";
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

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
                value={formData.titre || ""}
                onChange={(e) => handleChange("titre", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
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
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="valeur">Valeur</Label>
            <Input
              id="valeur"
              type="number"
              value={formData.valeur || 0}
              onChange={(e) => handleChange("valeur", Number(e.target.value))}
            />
          </div>

          {/* Sélection multiple de véhicules */}
          <div>
            <Label className="mb-3 block">
              Véhicules concernés
              <span className="text-muted-foreground text-xs ml-2">
                (aucun = promotion globale)
              </span>
            </Label>

            {selectedVehicleIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedVehicleIds.map((vid) => {
                  const v = allVehicles.find((veh) => veh.id === vid);
                  return v ? (
                    <Badge
                      key={vid}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() => toggleVehicle(vid)}
                    >
                      {v.marque} {v.modele || v.immatriculation} ✕
                    </Badge>
                  ) : null;
                })}
              </div>
            )}

            <div className="border rounded-lg max-h-48 overflow-y-auto p-2 space-y-1">
              {displayVehicles.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun véhicule disponible
                </p>
              ) : (
                displayVehicles.map((v) => (
                  <label
                    key={v.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={selectedVehicleIds.includes(v.id)}
                      onCheckedChange={() => toggleVehicle(v.id)}
                    />
                    <span className="text-sm font-medium">
                      {v.marque} {v.modele || v.immatriculation}
                    </span>
                    {!v.disponible && (
                      <Badge variant="outline" className="text-xs">Indisponible</Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {v.prix} € / jour
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateDebut">Date début</Label>
              <Input
                id="dateDebut"
                type="date"
                value={formData.dateDebut?.slice(0, 10) || ""}
                onChange={(e) => handleChange("dateDebut", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateFin">Date fin</Label>
              <Input
                id="dateFin"
                type="date"
                value={formData.dateFin?.slice(0, 10) || ""}
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
                value={formData.utilisationMax || 0}
                onChange={(e) => handleChange("utilisationMax", Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="dureeMinLocation">Durée min location (jours)</Label>
              <Input
                id="dureeMinLocation"
                type="number"
                value={formData.dureeMinLocation || 1}
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
                value={formData.montantMinCommande || 0}
                onChange={(e) => handleChange("montantMinCommande", Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="codesPromo">Codes promo (séparés par des virgules)</Label>
              <Input
                id="codesPromo"
                value={formData.codesPromo?.join(",") || ""}
                onChange={(e) => handleChange("codesPromo", e.target.value.split(","))}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? "Mise à jour en cours..." : "Mettre à jour"}
          </Button>
          {message && (
            <p className={`mt-2 text-center text-sm ${
              message.startsWith("✅") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}>
              {message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

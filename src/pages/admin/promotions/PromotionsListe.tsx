import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPromotions, deletePromotion } from "@/api/apiClient";
import type { Promotion } from "@/api/apiClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PromotionsListe() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = () => {
    getPromotions().then((res) => setPromotions(res.data));
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer cette promotion ?")) {
      try {
        await deletePromotion(id);
        loadPromotions(); // Recharger la liste
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {promotions.map((promo) => (
        <Card key={promo._id}>
          <CardHeader>
            <CardTitle>{promo.titre}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{promo.description}</p>
            <p className="mt-2 font-semibold">
              {promo.type === "pourcentage" ? `${promo.valeur}%` : `${promo.valeur} €`}
            </p>
            <p className="text-sm text-muted-foreground">
              Durée min : {promo.dureeMinLocation} jours
            </p>
            <p className="text-sm text-muted-foreground">
              Montant min commande : {promo.montantMinCommande} €
            </p>
            <p className="text-sm text-muted-foreground">
              Utilisations : {promo.utilisations} / {promo.utilisationMax || "∞"}
            </p>
            <p className="text-sm text-muted-foreground">
              Codes : {promo.codesPromo.join(', ')}
            </p>
            <Badge variant="secondary">{promo.statut}</Badge>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/promotions/update/${promo._id}`)}
              >
                Modifier
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(promo._id)}
              >
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

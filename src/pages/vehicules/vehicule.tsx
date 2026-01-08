import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { getVehicleById } from "@/api/apiClient";
import type { Vehicle } from "@/api/apiClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

export default function Vehicule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicule, setVehicule] = useState<Vehicle | null>(null);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (id) {
      getVehicleById(id)
        .then((res) => {
          setVehicule(res.data);
          document.title = `${res.data.marque} - ${res.data.immatriculation} – AutoDrive`;
        })
        .catch((err) =>
          console.error("Erreur lors du chargement du véhicule :", err)
        );
    }
  }, [id]);

  if (!vehicule)
    return <p className="text-center text-muted-foreground">Chargement...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-xl border rounded-lg overflow-hidden bg-background">
        {/* Image principale centrée avec zoom */}
        {vehicule.photos?.[0] ? (
          <div className="flex justify-center items-center p-4">
            <img
              src={vehicule.photos[0]}
              alt={`${vehicule.marque} image`}
              className="max-w-full max-h-[500px] object-contain rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => setZoom(true)}
            />
          </div>
        ) : (
          <p className="p-4 text-muted-foreground text-center">
            Pas d'image disponible
          </p>
        )}

        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold">
            {vehicule.marque} - {vehicule.immatriculation}
          </CardTitle>
          <div className="flex justify-center items-center gap-2 mt-2">
            <Badge variant={vehicule.disponible ? "default" : "destructive"}>
              {vehicule.disponible ? "Disponible" : "Indisponible"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {/* Détails avec Accordion */}
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-2"
          >
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                Détails
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><b>Marque :</b> {vehicule.marque}</p>
                    <p><b>Modèle :</b> {vehicule.modele}</p>
                    <p><b>Carrosserie :</b> {vehicule.carrosserie}</p>
                    <p><b>Transmission :</b> {vehicule.transmission}</p>
                  </div>
                  <div>
                    <p><b>Immatriculation :</b> {vehicule.immatriculation}</p>
                    <p><b>Prix :</b> {vehicule.prix} € / jour</p>
                    <p><b>Disponibilité :</b> {vehicule.disponible ? "Oui" : "Non"}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-4" />

          {/* Bouton Réserver */}
          <div className="p-4 text-center">
            {user ? (
              <>
                <p className="mb-4 text-sm text-muted-foreground">
                  Réservez ce véhicule maintenant.
                </p>
                <Button
                  size="lg"
                  className="mx-auto block font-semibold px-6 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate(`/reservation/${id}`)}
                >
                  Réserver ce véhicule
                </Button>
              </>
            ) : (
              <>
                <p className="mb-4 text-sm text-muted-foreground">
                  Connectez-vous pour pouvoir réserver ce véhicule.
                </p>
                <Link to={`/connexion?redirect=/reservation/${id}`}>
                  <Button
                    size="lg"
                    className="mx-auto block font-semibold px-6 bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Se connecter pour réserver
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal zoom avec Dialog shadcn */}
      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="max-w-5xl flex flex-col items-center bg-black">
          {/* Titre obligatoire pour l’accessibilité */}
          <VisuallyHidden>
            <DialogTitle>Aperçu du véhicule</DialogTitle>
          </VisuallyHidden>

          <DialogDescription className="text-gray-400 mb-4">
            Image en grand format du véhicule sélectionné
          </DialogDescription>

          {vehicule.photos?.[0] && (
            <img
              src={vehicule.photos[0]}
              alt="Zoom véhicule"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

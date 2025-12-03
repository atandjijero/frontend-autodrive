import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getVehicleById } from "@/api/apiClient";
import type { Vehicle } from "@/api/apiClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Vehicule() {
  const { id } = useParams();
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
                <div className="space-y-2 p-4">
                  <p>
                    <b>Carrosserie</b>: {vehicule.carrosserie}
                  </p>
                  <p>
                    <b>Transmission</b>: {vehicule.transmission}
                  </p>
                  <p>
                    <b>Prix</b>: {vehicule.prix} € / jour
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-4" />

          {/* Bouton Réserver toujours visible */}
          <div className="p-4 text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              Connectez-vous pour pouvoir réserver ce véhicule.
            </p>
            <Link to="/connexion">
              <Button
                size="lg"
                className="
      mx-auto block font-semibold px-6
      bg-white text-black hover:bg-gray-200
      dark:bg-black dark:text-white dark:hover:bg-gray-800
    "
              >
                Se connecter pour réserver
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Modal zoom avec Dialog shadcn */}
      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="max-w-5xl flex justify-center items-center bg-black">
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

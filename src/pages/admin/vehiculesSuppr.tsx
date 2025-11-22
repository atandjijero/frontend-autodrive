import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { vehicules } from "./vehiculesListe";
import { Button } from "@/components/ui/button";

export default function VehiculesSuppr() {
  const { id } = useParams();
  const handleSupprimer = () => {
    alert("Véhicule supprimé !");
  };

  useEffect(() => {
    const marque = vehicules[Number(id)]?.marque;
    document.title = `Modifier la ${marque} - Admin – AutoDrive`;
  }, [id]);

  return (
    <>
      <h1 className="text-2xl font-bold">
        Supprimer la {vehicules[Number(id)]?.marque}
      </h1>

      <p className="my-4">
        Êtes-vous sûr de vouloir supprimer le véhicule avec l'ID : {id} ?
      </p>

      <Button
        onClick={handleSupprimer}
        className="mt-4 bg-red-600 hover:bg-red-700"
      >
        Supprimer
      </Button>
    </>
  );
}

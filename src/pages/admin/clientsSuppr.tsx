import { useParams } from "react-router-dom";
import { clients } from "./clientsListe";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ClientsSuppr() {
  const { id } = useParams();
  const handleSupprimer = () => {
    alert("Client supprimé !");
  };

  useEffect(() => {
    const clientName = clients[Number(id)]?.nom ?? "Client inconnu";
    document.title = `Supprimer ${clientName} - Admin – AutoDrive`;
  }, [id]);

  return (
    <>
      <h1 className="text-2xl font-bold">
        Supprimer {clients[Number(id)]?.nom + " " + clients[Number(id)]?.prenom}
      </h1>

      <p className="my-4">
        Êtes-vous sûr de vouloir supprimer le client avec l'ID : {id} ?
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

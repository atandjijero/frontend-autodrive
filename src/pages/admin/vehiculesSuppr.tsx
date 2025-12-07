import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteVehicle, getVehicleById } from "@/api/apiClient";
import { Button } from "@/components/ui/button";

export default function VehiculesSuppr() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les infos du véhicule
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await getVehicleById(id!);
        setVehicle(res.data);

        document.title = `Supprimer ${res.data.marque} ${res.data.modele} – Admin AutoDrive`;
      } catch (err: any) {
        setErrorMessage("Véhicule introuvable.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  //  Suppression réelle
  const handleSupprimer = async () => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce véhicule ?"
    );

    if (!confirmDelete) return;

    try {
      await deleteVehicle(id);
      alert(" Véhicule supprimé avec succès !");
      navigate("/admin/vehicules"); 
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "❌ Une erreur est survenue lors de la suppression."
      );
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (errorMessage) return <p className="text-red-600">{errorMessage}</p>;

  return (
    <>
      <h1 className="text-2xl font-bold">
        Supprimer {vehicle.marque} {vehicle.modele}
      </h1>

      <p className="my-4">
        Êtes-vous sûr de vouloir supprimer ce véhicule ?
        <br />
        <strong>ID :</strong> {vehicle._id}
      </p>

      <Button
        onClick={handleSupprimer}
        className="mt-4 bg-red-600 hover:bg-red-700"
      >
        Supprimer définitivement
      </Button>
    </>
  );
}

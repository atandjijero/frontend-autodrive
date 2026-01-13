import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVehicleById, deleteVehicle } from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

export default function VehiculesSupprimer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await getVehicleById(id!);
        setVehicle(res.data);
        document.title = `Supprimer ${res.data.marque} ${res.data.modele} – Admin AutoDrive`;
      } catch (err) {
        setErrorMessage("Véhicule introuvable.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleDelete = async () => {
    if (!vehicle) return;

    try {
      setDeleting(true);
      await deleteVehicle(id!);

      toast.success("Véhicule supprimé avec succès", {
        style: { background: "#d4edda", color: "#155724" },
      });

      navigate("/admin/vehicules/liste");
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(
        error.response?.data?.message || "Erreur lors de la suppression du véhicule",
        {
          style: { background: "#fdecea", color: "#b71c1c" },
        }
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/vehicules/liste");
  };

  if (loading) return <p>Chargement...</p>;
  if (errorMessage)
    return <p className="text-red-600 font-semibold">{errorMessage}</p>;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <Card className="mt-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <CardTitle className="text-red-600">
                Confirmer la suppression
              </CardTitle>
            </div>
            <CardDescription>
              Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-lg mb-2">
                  {vehicle.marque} {vehicle.modele}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Carrosserie:</strong> {vehicle.carrosserie}
                  </div>
                  <div>
                    <strong>Transmission:</strong> {vehicle.transmission}
                  </div>
                  <div>
                    <strong>Prix:</strong> {vehicle.prix} €
                  </div>
                  <div>
                    <strong>Immatriculation:</strong> {vehicle.immatriculation}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={deleting}
                >
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Suppression..." : "Supprimer définitivement"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
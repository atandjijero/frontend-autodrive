import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getVehicleById, updateVehicle } from "@/api/apiClient";
import { VehiculeForm } from "@/components/forms/vehiculeForm";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "sonner";

export default function VehiculesModif() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Charger les infos du véhicule
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await getVehicleById(id!);
        setVehicle(res.data);

        document.title = `Modifier ${res.data.marque} ${res.data.modele} – Admin AutoDrive`;
      } catch (err) {
        setErrorMessage("Véhicule introuvable.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  //  Soumission du formulaire
  const handleUpdate = async (values: any) => {
    try {
      const formData = new FormData();

      //  Champs texte
      formData.append("carrosserie", values.carrosserie);
      formData.append("modele", values.modele);
      formData.append("marque", values.marque);
      formData.append("transmission", values.transmission);
      formData.append("prix", values.prix.toString());
      formData.append("immatriculation", values.immatriculation);

      //  Anciennes photos (URL)
      if (Array.isArray(values.photos)) {
        values.photos.forEach((url: string) => {
          formData.append("photos", url);
        });
      }

      //  Nouvelle photo uploadée
      if (values.photos instanceof FileList && values.photos.length > 0) {
        formData.append("file", values.photos[0]);
      }

      await updateVehicle(id!, formData);

      toast.success("✅ Le véhicule a été modifié avec succès.", {
        style: { background: "#e6f4ea", color: "#1e7e34" },
      });

      // Redirection professionnelle
      navigate("/admin/vehicules/liste");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "❌ Une erreur est survenue lors de la mise à jour du véhicule.",
        {
          style: { background: "#fdecea", color: "#b71c1c" },
        }
      );
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (errorMessage)
    return <p className="text-red-600 font-semibold">{errorMessage}</p>;

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-4">
            Modifier {vehicle.marque} {vehicle.modele}
          </h1>

          <Card className="mt-4 w-full">
            <CardHeader>
              <CardTitle>
                Modifier {vehicle.marque} {vehicle.modele}
              </CardTitle>
              <CardDescription>
                Mettez à jour les informations du véhicule puis enregistrez.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <VehiculeForm defaultValues={vehicle} onSubmit={handleUpdate} />

              <Button form="vehicule-form" type="submit" className="mt-4">
                Enregistrer les modifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

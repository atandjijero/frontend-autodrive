import { VehiculeForm } from "@/components/forms/vehiculeForm";
import type { VehicleFormValues } from "@/components/forms/vehiculeForm";
import { addVehicle } from "@/api/apiClient";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function VehiculesAjout() {
  const navigate = useNavigate();

  const handleCreate = async (values: VehicleFormValues) => {
    try {
      const formData = new FormData();

      //  Champs texte
      formData.append("carrosserie", values.carrosserie);
      formData.append("modele", values.modele);
      formData.append("marque", values.marque);
      formData.append("transmission", values.transmission);
      formData.append("prix", values.prix.toString());
      formData.append("immatriculation", values.immatriculation);

      // Photos (FileList)
      if (values.photos instanceof FileList) {
        Array.from(values.photos).forEach((file) => {
          formData.append("file", file);
        });
      }

      await addVehicle(formData);

      toast.success("✅ Véhicule ajouté avec succès !", {
        style: { background: "#e6f4ea", color: "#1e7e34" }, // vert pro
      });

      // ✅ Redirection professionnelle
      navigate("/vehicules/liste");

    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "❌ Impossible d’ajouter le véhicule.",
        {
          style: { background: "#fdecea", color: "#b71c1c" }, // rouge pro
        }
      );
    }
  };

  return (
    <>
      <title>Ajouter un véhicule - Admin – AutoDrive</title>

      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <Card className="w-full max-w-lg bg-background border border-border shadow-lg">
          <CardHeader>
            <CardTitle>Ajouter un véhicule</CardTitle>
            <CardDescription>
              Entrez les informations du véhicule
            </CardDescription>
          </CardHeader>

          <CardContent>
            <VehiculeForm onSubmit={handleCreate} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

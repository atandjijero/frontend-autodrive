import { VehiculeForm } from "@/components/forms/vehiculeForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VehiculesAjout() {
  return (
    <>
      <title>Ajouter un véhicule - Admin – AutoDrive</title>

      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <Card className="w-full max-w-lg bg-background border border-border shadow-lg">
          <CardHeader>
            <CardTitle>Ajouter un véhicule</CardTitle>
            <CardDescription>Entrez les informations du véhicule</CardDescription>
          </CardHeader>
          <CardContent>
            <VehiculeForm /> {/* le formulaire complet est déjà ici */}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

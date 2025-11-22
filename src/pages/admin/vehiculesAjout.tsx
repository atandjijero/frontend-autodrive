import { VehiculeForm } from "@/components/forms/vehiculeForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VehiculesAjout() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de soumission du formulaire ici
    console.log("Form submitted.");
  };
  return (
    <>
      <title>Ajouter un véhicule - Admin – AutoDrive</title>

      <h1 className="text-2xl font-bold">Ajouter un nouveau véhicule</h1>
      <Card className="mt-4 w-150">
        <CardHeader>
          <CardTitle>Ajouter un véhicule</CardTitle>
          <CardDescription>Entrez les informations du véhicule</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <VehiculeForm />{" "}
            <Button type="submit" className="mt-4" onClick={handleSubmit}>
              Ajouter le véhicule
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

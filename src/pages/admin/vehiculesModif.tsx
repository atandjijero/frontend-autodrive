import { VehiculeForm } from "@/components/forms/vehiculeForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { vehicules } from "./vehiculesListe";
import { useParams } from "react-router-dom";

export default function VehiculesModif() {
  const { id } = useParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de soumission du formulaire ici
    console.log("Form submitted.");
  };

  useEffect(() => {
    const marque = vehicules[Number(id)]?.marque;
    document.title = `Modifier la ${marque} - Admin – AutoDrive`;
  }, [id]);

  return (
    <>
      <h1 className="text-2xl font-bold">
        Modifier la {vehicules[Number(id)]?.marque}
      </h1>
      <Card className="mt-4 w-150">
        <CardHeader>
          <CardTitle>Modifier la {vehicules[Number(id)]?.marque}</CardTitle>
          <CardDescription>
            Modifier les informations du véhicule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <VehiculeForm />
            <Button type="submit" className="mt-4" onClick={handleSubmit}>
              Modifier le véhicule
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

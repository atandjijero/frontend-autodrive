import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { vehicules } from "../admin/vehiculesListe";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import CalendarVehicule from "@/components/calendar";

export default function Vehicule() {
  const { id } = useParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de soumission du formulaire ici
    console.log("Form submitted.");
  };

  useEffect(() => {
    const marque = vehicules[Number(id)]?.marque;
    const immatriculation = vehicules[Number(id)]?.immatriculation;
    document.title = `${marque} - ${immatriculation}  – AutoDrive`;
  }, [id]);

  return (
    <>
      <h1 className="text-2xl font-bold">
        {vehicules[Number(id)]?.marque} -{" "}
        {vehicules[Number(id)]?.immatriculation}
      </h1>

      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Photos</AccordionTrigger>
          <AccordionContent>
            <img
              src={vehicules[Number(id)]?.imageUrl}
              alt={`${vehicules[Number(id)]?.marque} image`}
              className="mt-2 h-40 w-auto object-cover"
            />{" "}
          </AccordionContent>
        </AccordionItem>
        <hr />
        <AccordionItem value="item-2">
          <AccordionTrigger>Details</AccordionTrigger>
          <AccordionContent>
            <p>
              <b>Carrosserie</b>: {vehicules[Number(id)]?.carrosserie}
            </p>
            <p>
              <b>Transmission</b>: {vehicules[Number(id)]?.transmission}
            </p>
            <p>
              <b>Prix</b>: {vehicules[Number(id)]?.prix} €
            </p>
          </AccordionContent>
        </AccordionItem>
        <hr />
        <AccordionItem value="item-3">
          <AccordionTrigger>Reserver</AccordionTrigger>
          <AccordionContent>
            <form action="" className="space-y-4 w-fit mx-auto text-center">
              <Field>
                <FieldLabel className="text-center">
                  Duree de reservation
                </FieldLabel>
                <FieldDescription>
                  Selectionner votre <b>date de retrait</b> et{" "}
                  <b>date de retour</b> du vehicule
                </FieldDescription>
                <CalendarVehicule />
              </Field>
              <Button type="submit" className="mt-4" onClick={handleSubmit}>
                Reserver
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

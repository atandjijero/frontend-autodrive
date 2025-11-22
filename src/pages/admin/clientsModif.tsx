import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { clients } from "./clientsListe";
import { Input } from "@/components/ui/input";

export default function ClientsModif() {
  const { id } = useParams();
  const [inputs, setInputs] = useState({
    nom: id ? clients[Number(id)].nom : "",
    prenom: id ? clients[Number(id)].prenom : "",
    email: id ? clients[Number(id)].email : "",
    telephone: id ? clients[Number(id)].telephone : "",
    adresse: id ? clients[Number(id)].adresse : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", inputs);
  };

  useEffect(() => {
    const clientName = clients[Number(id)]?.nom ?? "Client inconnu";
    document.title = `Modifier ${clientName} - Admin – AutoDrive`;
  }, [id]);

  return (
    <>
      <Card className="w-150">
        <CardHeader>
          <CardTitle>
            Modifier{" "}
            {clients[Number(id)]?.nom + " " + clients[Number(id)]?.prenom}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="nom">Nom</FieldLabel>
                <Input
                  id="nom"
                  type="text"
                  value={inputs.nom}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="prenom">Prénom</FieldLabel>
                <Input
                  id="prenom"
                  type="text"
                  value={inputs.prenom}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={inputs.email}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="telephone">Téléphone</FieldLabel>
                <Input
                  id="telephone"
                  type="tel"
                  value={inputs.telephone}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="adresse">Adresse</FieldLabel>
                <Input
                  id="adresse"
                  type="text"
                  value={inputs.adresse}
                  onChange={handleChange}
                  required
                />
              </Field>
            </FieldGroup>
            {/* Bouton de soumission */}
            <Input type="hidden" id="id" value={id || ""}></Input>
            <Button type="submit" className="mt-4" onClick={handleSubmit}>
              Modifier le client
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

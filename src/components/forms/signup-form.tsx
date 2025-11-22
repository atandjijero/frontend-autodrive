import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [inputs, setInputs] = useState({
    firstname: "",
    lastname: "",
    email: "",
    tel: "",
    adresse: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de soumission du formulaire ici
    console.log("Form submitted with data:", inputs);
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Creer un compte</CardTitle>
        <CardDescription>
          Entrez vos informations ci-dessous pour créer votre compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="firstname">Prenoms</FieldLabel>
              <Input
                id="firstname"
                type="text"
                onChange={handleChange}
                value={inputs.firstname}
                placeholder="John"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="lastname">Nom de famille</FieldLabel>
              <Input
                id="lastname"
                type="text"
                onChange={handleChange}
                value={inputs.lastname}
                placeholder="Doe"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                onChange={handleChange}
                value={inputs.email}
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                Nous utiliserons cette adresse pour vous contacter. Nous ne
                partagerons pas votre e-mail avec qui que ce soit.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="tel">Telephone</FieldLabel>
              <Input
                id="tel"
                type="tel"
                onChange={handleChange}
                value={inputs.tel}
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                Nous utiliserons cette adresse pour vous contacter. Nous ne
                partagerons pas votre e-mail avec qui que ce soit.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="adresse">Adresse</FieldLabel>
              <Input
                id="adresse"
                type="text"
                onChange={handleChange}
                value={inputs.adresse}
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                Nous utiliserons cette adresse pour vous contacter. Nous ne
                partagerons pas votre e-mail avec qui que ce soit.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
              <Input
                id="password"
                type="password"
                onChange={handleChange}
                value={inputs.password}
                required
              />
              <FieldDescription>
                Doit contenir au moins 8 caractères.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirmer le mot de passe
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                onChange={handleChange}
                value={inputs.confirmPassword}
                required
              />
              <FieldDescription>
                Veuillez confirmer votre mot de passe.
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" onSubmit={handleSubmit}>
                  Créer un compte
                </Button>
                <FieldDescription className="px-6 text-center">
                  Vous avez déjà un compte ?{" "}
                  <Link to={"/connexion"}>
                    <span>Connectez-vous</span>
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

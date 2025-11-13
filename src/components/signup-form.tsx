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

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
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
              <Input id="name" type="text" placeholder="John" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="lastname">Nom de famille</FieldLabel>
              <Input id="name" type="text" placeholder="Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
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
              <Input id="password" type="password" required />
              <FieldDescription>
                Doit contenir au moins 8 caractères.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirmer le mot de passe
              </FieldLabel>
              <Input id="confirm-password" type="password" required />
              <FieldDescription>
                Veuillez confirmer votre mot de passe.
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Créer un compte</Button>
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

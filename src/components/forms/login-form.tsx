import { cn } from "@/lib/utils";
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", inputs);
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connectez vous</CardTitle>
          <CardDescription>
            Entrez votre e-mail ci-dessous pour vous connecter à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
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
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                  <Link
                    to={"/passOublie"}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    <span>Mot de passe oublié ?</span>
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  onChange={handleChange}
                  value={inputs.password}
                  required
                />
              </Field>
              <Field>
                <Button type="submit">Connexion</Button>
                <FieldDescription className="text-center">
                  Vous n'avez pas de compte ?{" "}
                  <Link to={"/inscription"}>
                    <span>Inscrivez-vous</span>
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


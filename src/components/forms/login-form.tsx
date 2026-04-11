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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { login as apiLogin } from "@/api/apiClient";
import type { LoginResponse } from "@/api/apiClient";
import { useAuth } from "@/context/AuthContext";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await apiLogin({
        email: inputs.email,
        motPasse: inputs.password,
      });

      const data: LoginResponse = res.data;
      console.log("Réponse backend login:", data); // 👀 debug

      if (data.requiresOtp) {
          setSuccessMessage(
            data.message || "Un code OTP a été envoyé à votre adresse email."
          );
        navigate("/otp", { state: { email: inputs.email, redirect } });
      } else {
        // Synchroniser avec AuthContext
        const userId = String(data.id || "");
        authLogin({
          id: userId,
          email: data.email || "",
          nom: data.nom || "",
          prenom: data.prenom || "",
          role: (data.role as any) || "client"
        }, data.access_token || "");

        setSuccessMessage("Connexion réussie.");
        const role = data.role?.toLowerCase();

// Si un redirect est présent (ex: /reservation/123), on le priorise
        if (redirect) {
        navigate(redirect);
        } else {
          switch (role) {
            case "admin":
            case "testeur":
              navigate("/admin/dashboard");
              break;
            case "client":
              navigate("/client/dashboard");
              break;
            case "tourist":
            case "touriste":
              navigate("/touriste/dashboard");
              break;
            case "entreprise":
              navigate("/entreprise/dashboard");
              break;
            default:
              navigate("/vehicules");
          }
}

      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Échec de connexion.";
      setErrorMessage(errorMsg);
    }
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
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Connectez-vous pour accéder à votre compte.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  onChange={handleChange}
                  value={inputs.email}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                  <Link
                    to="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  onChange={handleChange}
                  value={inputs.password}
                  required
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full">
                  Se connecter
                </Button>
                <FieldDescription className="text-center">
                  Vous n'avez pas de compte ?{" "}
                  <Link to={"/inscription"}>Inscription</Link>
                </FieldDescription>
              </Field>
              {errorMessage && (
                <p className="text-center text-sm mt-2 text-red-600">
                  {errorMessage}
                </p>
              )}
              {successMessage && (
                <p className="text-center text-sm mt-2 text-green-600">
                  {successMessage}
                </p>
              )}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

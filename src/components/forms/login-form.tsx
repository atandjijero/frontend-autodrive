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
import { login } from "@/api/apiClient";
import type { LoginResponse } from "@/api/apiClient";
// translations removed: using static french strings

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  // const { t } = useTranslation();
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
      const res = await login({
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
        //  Stockage du token
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
        }

        //  Stockage de l'ID utilisateur (id ou _id)
        const userId = data._id || data.id;
        console.log("userId stocké :", userId); // 👀 debug
        if (userId) {
          localStorage.setItem("userId", userId);
        } else {
          console.error("⚠️ Aucun ID utilisateur trouvé dans la réponse backend");
        }

        // Autres infos
        if (data.nom) localStorage.setItem("userNom", data.nom);
        if (data.prenom) localStorage.setItem("userPrenom", data.prenom);
        if (data.email) localStorage.setItem("email", data.email);
        // backward-compatible keys used elsewhere in the app
        const fullName = [data.prenom, data.nom].filter(Boolean).join(" ");
        if (fullName) localStorage.setItem("userName", fullName);
        if (data.email) localStorage.setItem("userEmail", data.email);
        if (data.role) localStorage.setItem("userRole", data.role);

        setSuccessMessage("Connexion réussie.");
        const role = data.role?.toLowerCase();

// Si un redirect est présent (ex: /reservation/123), on le priorise
        if (redirect) {
        navigate(redirect);
        } else {
          switch (role) {
          case "admin":
          navigate("/admin/dashboard");
          break;
          case "client":
          navigate("/client/dashboard");
          break;
          case "tourist":
          navigate("/touriste/dashboard");
          break;
          case "entreprise":
          navigate("/entreprise/dashboard");
        break;
    default:
      navigate("/vehicules"); // fallback
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

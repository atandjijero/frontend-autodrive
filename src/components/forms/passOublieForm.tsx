import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "@/api/apiClient";

export default function PassOublieForm({ className, ...props }: React.ComponentProps<"div">) {
  const { token } = useParams();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({ newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setIsError(true);
      setMessage("Lien invalide ou expiré.");
      return;
    }

    if (inputs.newPassword !== inputs.confirmPassword) {
      setIsError(true);
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    if (inputs.newPassword.length < 8) {
      setIsError(true);
      setMessage("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword({
        token,
        newPassword: inputs.newPassword,
        confirmPassword: inputs.confirmPassword,
      });
      setIsError(false);
      setMessage(res.data.message);
      setTimeout(() => navigate("/connexion"), 2000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Impossible de réinitialiser le mot de passe.";
      setIsError(true);
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black", className)} {...props}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Réinitialiser le mot de passe</CardTitle>
          <CardDescription>Entrez votre nouveau mot de passe ci-dessous.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="newPassword">Nouveau mot de passe</FieldLabel>
                <Input id="newPassword" type="password" value={inputs.newPassword} onChange={handleChange} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirmer le mot de passe</FieldLabel>
                <Input id="confirmPassword" type="password" value={inputs.confirmPassword} onChange={handleChange} required />
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Patientez..." : "Réinitialiser"}
                </Button>
              </Field>
              {message && (
                <p className={`text-center text-sm mt-2 ${isError ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                  {message}
                </p>
              )}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { verifyEmail } from "@/api/apiClient";

export default function VerificationEmail() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token de vérification manquant.");
      return;
    }

    const verify = async () => {
      setStatus("loading");
      try {
        await verifyEmail(token);
        setStatus("success");
        setMessage("Bravo ! Votre email a été vérifié avec succès. Votre compte est maintenant actif et à jour. Vous allez être redirigé vers la page de connexion.");
        setTimeout(() => navigate("/connexion"), 5000);
      } catch (err: any) {
        setStatus("error");
        setMessage(err?.response?.data?.message || "Erreur lors de la vérification du token.");
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Vérification de l'email
          </CardTitle>
          <CardDescription>
            {status === "loading" ? "Vérification en cours..." : "Résultat de la vérification"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className={`text-sm ${status === "success" ? "text-green-600" : status === "error" ? "text-red-600" : "text-gray-600"} dark:text-gray-400`}>
              {message || (status === "loading" ? "Veuillez patienter pendant que nous vérifions votre email." : "")}
            </p>
          </div>

          <div className="pt-4 border-t">
            <Link to="/connexion">
              <Button className="w-full">Aller à la page de connexion</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
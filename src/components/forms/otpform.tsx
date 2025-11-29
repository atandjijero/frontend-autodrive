import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { verifyOtp } from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function OtpForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email: string })?.email || "";

  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      setLoading(true);
      const res = await verifyOtp({ email, otp });

      // Stockage du token et des infos utilisateur
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("email", res.data.email || email);
      localStorage.setItem("role", res.data.role || "");
      localStorage.setItem("nom", res.data.nom || "");
      localStorage.setItem("prenom", res.data.prenom || "");

      setSuccessMessage("OTP vérifié, connexion réussie !");
      setTimeout(() => {
        const role = res.data.role?.toLowerCase();
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/vehicules");
        }
      }, 1500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "OTP invalide ou expiré.";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Vérification OTP</CardTitle>
          <CardDescription>
            Entrez le code reçu par email pour valider votre connexion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="otp">Code OTP</FieldLabel>
                {/* Wrapper pour centrer le code OTP */}
                <div className="flex justify-center mt-2">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <FieldDescription className="text-center">
                  Le code est valable pendant 5 minutes.
                </FieldDescription>
              </Field>

              <Field>
                <Button type="submit" className="w-full mt-4" disabled={loading}>
                  {loading ? "Vérification en cours..." : "Vérifier"}
                </Button>
              </Field>

              {errorMessage && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert className="mt-4">
                  <AlertTitle>Succès</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

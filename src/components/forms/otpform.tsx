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
// translations removed: using static french strings

export function OtpForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email: string })?.email || "";
  const redirect = (location.state as { redirect?: string })?.redirect;

  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // const { t } = useTranslation();

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

    setSuccessMessage("OTP vérifié, connexion réussie.");
    const role = res.data.role?.toLowerCase();

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
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || "Code OTP invalide.";
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
            <CardDescription>Entrez le code reçu par email.</CardDescription>
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
                <FieldDescription className="text-center">Valide pour 10 minutes</FieldDescription>
              </Field>

              <Field>
                <Button type="submit" className="w-full mt-4" disabled={loading}>
                  {loading ? "Vérification..." : "Vérifier"}
                </Button>
              </Field>

              {errorMessage && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Erreur OTP</AlertTitle>
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

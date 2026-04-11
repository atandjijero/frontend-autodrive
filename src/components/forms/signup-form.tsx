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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { register } from "@/api/apiClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// translations removed: using static french strings

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  // const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('invite');

  const [inputs, setInputs] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    telephoneSecondaire: "",
    adresse: "",
    motPasse: "",
    confirmPassword: "",
    role: "client",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | null>(null);

  useEffect(() => {
    if (inviteToken) {
      try {
        const decoded: any = jwtDecode(inviteToken);
        if (decoded.type === 'invite' && decoded.role) {
          setInputs(prev => ({
            ...prev,
            email: decoded.email || "",
            role: decoded.role,
          }));
          setMessage("Vous avez été invité à vous inscrire en tant que testeur.");
          setMessageType('info');
        }
      } catch (err) {
        console.error("Token d'invitation invalide", err);
        setMessage("Token d'invitation invalide.");
        setMessageType('error');
      }
    }
  }, [inviteToken]);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [message]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputs.motPasse !== inputs.confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      setMessageType('error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nom", inputs.nom);
      formData.append("prenom", inputs.prenom);
      formData.append("email", inputs.email);
      formData.append("motPasse", inputs.motPasse);
      formData.append("telephone", inputs.telephone);
      if (inputs.telephoneSecondaire) formData.append("telephoneSecondaire", inputs.telephoneSecondaire);
      if (inputs.adresse) formData.append("adresse", inputs.adresse);
      formData.append("role", inputs.role);
      if (photoFile) formData.append("photo", photoFile);

      const res = await register(formData);
      setMessage(res.data?.message || "Utilisateur créé avec succès. Connectez-vous !");
      setMessageType('success');
    } catch (err: any) {
      console.error("Erreur:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || err.message || "Erreur lors de l'inscription.";
      setMessage(`Erreur : ${errorMessage}`);
      setMessageType('error');
    }
  };

  return (
    <Card {...props} className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Inscription</CardTitle>
        <CardDescription>Créez votre compte.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            {/* Photo de profil */}
            <div className="flex justify-center mb-4">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={photoPreview || ""} alt="Photo de profil" />
                  <AvatarFallback>
                    {inputs.prenom?.[0]?.toUpperCase()}{inputs.nom?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Input
                    ref={fileInputRef}
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {photoFile ? "Changer la photo" : "Ajouter une photo"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Première ligne : Prénom et Nom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="prenom">Prénom</FieldLabel>
                <Input id="prenom" type="text" placeholder="Jean" onChange={handleChange} value={inputs.prenom} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="nom">Nom</FieldLabel>
                <Input id="nom" type="text" placeholder="Dupont" onChange={handleChange} value={inputs.nom} required />
              </Field>
            </div>

            {/* Deuxième ligne : Email et Téléphone principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="votre@email.com" onChange={handleChange} value={inputs.email} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="telephone">Téléphone principal</FieldLabel>
                <Input id="telephone" type="tel" placeholder="0123456789" onChange={handleChange} value={inputs.telephone} required />
              </Field>
            </div>

            {/* Troisième ligne : Téléphone secondaire et Adresse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="telephoneSecondaire">Téléphone secondaire</FieldLabel>
                <Input id="telephoneSecondaire" type="tel" placeholder="0123456789" onChange={handleChange} value={inputs.telephoneSecondaire} />
              </Field>
              <Field>
                <FieldLabel htmlFor="adresse">Adresse</FieldLabel>
                <Input id="adresse" type="text" placeholder="Rue, ville, pays" onChange={handleChange} value={inputs.adresse} />
              </Field>
            </div>

            {/* Quatrième ligne : Rôle (plein largeur) - Masqué si invitation */}
            {!inviteToken && (
              <div className="grid grid-cols-1 gap-4">
                <Field>
                  <FieldLabel>Rôle</FieldLabel>
                  <Select
                    value={inputs.role}
                    onValueChange={(value) => setInputs((prev) => ({ ...prev, role: value }))}
                  >
                      <SelectTrigger className="w-full">
                      <SelectValue placeholder={"Sélectionnez un rôle"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="entreprise">Entreprise</SelectItem>
                      <SelectItem value="tourist">Touriste</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            )}

            {/* Rôle assigné par invitation - Lecture seule */}
            {inviteToken && (
              <div className="grid grid-cols-1 gap-4">
                <Field>
                  <FieldLabel>Rôle assigné</FieldLabel>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-700">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {inputs.role === "testeur" ? "👤 Testeur" : 
                       inputs.role === "client" ? "👤 Client" :
                       inputs.role === "entreprise" ? "🏢 Entreprise" :
                       inputs.role === "tourist" ? "✈️ Touriste" : inputs.role}
                    </p>
                  </div>
                </Field>
              </div>
            )}

            {/* Cinquième ligne : Mots de passe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="motPasse">Mot de passe</FieldLabel>
                <Input id="motPasse" type="password" placeholder="Votre mot de passe" onChange={handleChange} value={inputs.motPasse} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirmer le mot de passe</FieldLabel>
                <Input id="confirmPassword" type="password" placeholder="Votre mot de passe" onChange={handleChange} value={inputs.confirmPassword} required />
              </Field>
            </div>

            {/* Bouton et messages */}
            <Field>
              <Button type="submit" className="w-full text-sm py-2">S'inscrire</Button>
              {message && (
                <Alert
                  variant={messageType === 'error' ? 'destructive' : 'default'}
                  className={
                    messageType === 'success'
                      ? 'mt-4 border border-green-200 bg-green-50 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
                      : messageType === 'info'
                      ? 'mt-4 border border-blue-200 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
                      : 'mt-4'
                  }
                >
                  <AlertTitle>
                    {messageType === 'success' ? 'Succès' : messageType === 'error' ? 'Erreur' : 'Information'}
                  </AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              <FieldDescription className="px-4 text-center text-xs">
                Vous avez déjà un compte ?{" "}
                <Link to={"/connexion"}><span>Se connecter</span></Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

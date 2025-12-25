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
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { register } from "@/api/apiClient";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate();

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

  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputs.motPasse !== inputs.confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await register({
        nom: inputs.nom,
        prenom: inputs.prenom,
        email: inputs.email,
        motPasse: inputs.motPasse,
        telephone: inputs.telephone,
        telephoneSecondaire: inputs.telephoneSecondaire || undefined,
        adresse: inputs.adresse || undefined,
        role: inputs.role as "client" | "entreprise" | "tourist",
      });

      setMessage(res.data.message);
      setTimeout(() => navigate("/connexion"), 2000);
    } catch (err: any) {
      console.error("Erreur:", err.response?.data || err.message);
      setMessage("Impossible de créer le compte.");
    }
  };

  return (
    <Card {...props} className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Créer un compte</CardTitle>
        <CardDescription>
          Entrez vos informations ci-dessous pour créer votre compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            {/* Première ligne : Prénom et Nom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="prenom">Prénom</FieldLabel>
                <Input id="prenom" type="text" placeholder="Jean" onChange={handleChange} value={inputs.prenom} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="nom">Nom de famille</FieldLabel>
                <Input id="nom" type="text" placeholder="Dupont" onChange={handleChange} value={inputs.nom} required />
              </Field>
            </div>

            {/* Deuxième ligne : Email et Téléphone principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="jean.dupont@example.com" onChange={handleChange} value={inputs.email} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="telephone">Téléphone principal</FieldLabel>
                <Input id="telephone" type="tel" placeholder="+22890123456" onChange={handleChange} value={inputs.telephone} required />
              </Field>
            </div>

            {/* Troisième ligne : Téléphone secondaire et Adresse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="telephoneSecondaire">Téléphone secondaire (optionnel)</FieldLabel>
                <Input id="telephoneSecondaire" type="tel" placeholder="+22892123456" onChange={handleChange} value={inputs.telephoneSecondaire} />
              </Field>
              <Field>
                <FieldLabel htmlFor="adresse">Adresse (optionnelle)</FieldLabel>
                <Input id="adresse" type="text" placeholder="Rue des fleurs, Lomé" onChange={handleChange} value={inputs.adresse} />
              </Field>
            </div>

            {/* Quatrième ligne : Rôle (plein largeur) */}
            <div className="grid grid-cols-1 gap-4">
              <Field>
                <FieldLabel>Rôle</FieldLabel>
                <Select
                  value={inputs.role}
                  onValueChange={(value) => setInputs((prev) => ({ ...prev, role: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisissez un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="entreprise">Entreprise</SelectItem>
                    <SelectItem value="tourist">Touriste</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* Cinquième ligne : Mots de passe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="motPasse">Mot de passe</FieldLabel>
                <Input id="motPasse" type="password" placeholder="••••••••" onChange={handleChange} value={inputs.motPasse} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirmer le mot de passe</FieldLabel>
                <Input id="confirmPassword" type="password" placeholder="••••••••" onChange={handleChange} value={inputs.confirmPassword} required />
              </Field>
            </div>

            {/* Bouton et messages */}
            <Field>
              <Button type="submit" className="w-full text-sm py-2">Créer un compte</Button>
              {message && (
                <p className="text-center text-xs mt-2 text-green-600 dark:text-green-400">
                  {message}
                </p>
              )}
              <FieldDescription className="px-4 text-center text-xs">
                Vous avez déjà un compte ?{" "}
                <Link to={"/connexion"}><span>Connectez-vous</span></Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

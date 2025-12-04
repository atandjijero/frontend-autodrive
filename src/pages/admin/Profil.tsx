import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProfile } from "@/api/apiClient";
import type { UserProfile } from "@/api/apiClient";

// Icônes lucide-react
import { Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function Profil() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Impossible de charger le profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p className="p-6">Chargement du profil...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  // Initiales de l'utilisateur
  const initials =
    (profile?.prenom?.[0] ?? "").toUpperCase() +
    (profile?.nom?.[0] ?? "").toUpperCase();

  return (
    <div className="p-8 max-w-4xl mx-auto"> {/* largeur augmentée */}
      <Card className="p-10 shadow-xl space-y-8">
        {/* Avatar + infos principales */}
        <CardHeader className="flex flex-col items-center gap-6">
          <Avatar className="h-28 w-28 text-xl">
            <AvatarImage src={profile?.avatar ?? ""} alt={profile?.nom} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <CardTitle className="text-3xl font-bold text-center">
            {profile?.prenom} {profile?.nom}
          </CardTitle>

          {/* Email en bleu comme lien */}
          <div className="flex items-center gap-2 justify-center text-lg">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <a
              href={`mailto:${profile?.email}`}
              className="text-blue-600 underline"
            >
              {profile?.email}
            </a>
          </div>

          <Badge
            variant={
              profile?.role === "admin"
                ? "destructive"
                : profile?.role === "client"
                ? "default"
                : profile?.role === "entreprise"
                ? "secondary"
                : "outline"
            }
            className="mt-3 text-base px-4 py-2"
          >
            {profile?.role ?? "Utilisateur"}
          </Badge>
        </CardHeader>

        <Separator />

        {/* Infos détaillées en colonne */}
        <CardContent className="space-y-6 text-lg">
          <div className="flex items-center gap-4">
            <Phone className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
              <p>{profile?.telephone || "Non renseigné"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <MapPin className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Adresse</p>
              <p>{profile?.adresse || "Non renseignée"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Calendar className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date d’inscription</p>
              <p>
                {profile?.dateInscription
                  ? new Date(profile.dateInscription).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "Non disponible"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

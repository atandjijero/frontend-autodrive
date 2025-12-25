import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
    return <p className="p-6 text-muted-foreground">Chargement du profil...</p>;
  }

  if (error) {
    return <p className="p-6 text-destructive">{error}</p>;
  }

  // Initiales de l'utilisateur
  const initials =
    (profile?.prenom?.[0] ?? "").toUpperCase() +
    (profile?.nom?.[0] ?? "").toUpperCase();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Card className="p-8 shadow-xl">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Section gauche: Avatar et infos principales */}
            <div className="flex flex-col items-center md:items-start gap-6 md:w-1/3">
              <Avatar className="h-32 w-32 text-2xl">
                <AvatarImage src={profile?.avatar ?? ""} alt={profile?.nom} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>

              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {profile?.prenom} {profile?.nom}
                </h1>

                <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <a
                    href={`mailto:${profile?.email}`}
                    className="text-primary hover:underline"
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
                  className="text-sm px-3 py-1"
                >
                  {profile?.role ?? "Utilisateur"}
                </Badge>
              </div>
            </div>

            {/* Section droite: Détails */}
            <div className="md:w-2/3">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Informations détaillées</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <Phone className="h-6 w-6 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                    <p className="text-foreground font-medium">{profile?.telephone || "Non renseigné"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="h-6 w-6 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                    <p className="text-foreground font-medium">{profile?.adresse || "Non renseignée"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg md:col-span-2">
                  <Calendar className="h-6 w-6 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date d'inscription</p>
                    <p className="text-foreground font-medium">
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar ?? ""} alt={profile?.nom} />
            <AvatarFallback>
              {profile?.prenom?.[0]}
              {profile?.nom?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="text-center">
            <CardTitle className="text-xl font-bold">
              {profile?.prenom} {profile?.nom}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
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
              className="mt-2"
            >
              {profile?.role ?? "Utilisateur"}
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4 mt-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
            <p>{profile?.telephone || "Non renseigné"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Adresse</p>
            <p>{profile?.adresse || "Non renseignée"}</p>
          </div>
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
        </CardContent>
      </Card>
    </div>
  );
}

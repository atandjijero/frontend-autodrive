import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProfile, apiClient, deleteOwnAccount } from "@/api/apiClient";
import type { UserProfile } from "@/api/apiClient";

// Icônes lucide-react
import { Mail, Phone, MapPin, Calendar, Edit2, X, Trash2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Profil() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
        setEditData(res.data);
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profile });
    setPhotoPreview(profile?.photo ?? profile?.avatar ?? null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("nom", editData.nom || "");
      formData.append("prenom", editData.prenom || "");
      formData.append("telephone", editData.telephone || "");
      formData.append("adresse", editData.adresse || "");
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const response = await apiClient.patch("/auth/profil", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile(response.data);
      setEditData({});
      setPhotoFile(null);
      setPhotoPreview(null);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour du profil.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteOwnAccount();
      // Déconnexion et redirection
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userNom");
      localStorage.removeItem("userPrenom");
      localStorage.removeItem("userId");
      window.location.href = "/";
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la suppression du compte.");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Mode lecture
  if (!isEditing) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-foreground">Profil</h1>
          <Button onClick={handleEdit} variant="outline" size="sm" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Modifier
          </Button>
        </div>

        <Card className="p-8 shadow-xl">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Section gauche: Avatar et infos principales */}
              <div className="flex flex-col items-center md:items-start gap-6 md:w-1/3">
                <Avatar className="h-32 w-32 text-2xl">
                <AvatarImage src={profile?.photo ?? profile?.avatar ?? ""} alt={profile?.nom} />
                </Avatar>

                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {profile?.prenom} {profile?.nom}
                  </h2>

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
                <h3 className="text-2xl font-semibold text-foreground mb-6">Informations détaillées</h3>

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

                {/* Section Zone de danger */}
                <div className="mt-8 pt-6 border-t border-muted">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Gestion du compte
                  </h3>

                  <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">Suppression du compte</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                      Vous pouvez supprimer votre compte à tout moment. Toutes vos données seront supprimées définitivement.
                    </p>

                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          onClick={() => setDeleteDialogOpen(true)}
                          disabled={deleting}
                          variant="outline"
                          size="sm"
                          className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/20"
                        >
                          {deleting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                              Suppression en cours...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                              Supprimer mon compte
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Confirmer la suppression de votre compte
                          </AlertDialogTitle>
                          <AlertDialogDescription className="space-y-3">
                            <p>
                              Vous êtes sur le point de supprimer définitivement votre compte AutoDrive.
                            </p>
                            <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-md border border-amber-200 dark:border-amber-800">
                              <p className="text-sm font-medium mb-2 text-amber-900 dark:text-amber-100">Cette action entraînera :</p>
                              <ul className="text-sm space-y-1 text-amber-800 dark:text-amber-200">
                                <li>• La suppression de toutes vos données personnelles</li>
                                <li>• L'annulation de toutes vos réservations en cours</li>
                                <li>• La perte permanente de l'accès à votre compte</li>
                              </ul>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Cette action ne peut pas être annulée. Vous serez automatiquement déconnecté.
                            </p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
                            disabled={deleting}
                          >
                            {deleting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                                Suppression...
                              </>
                            ) : (
                              "Supprimer mon compte"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mode édition
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-foreground">Modifier le profil</h1>
      </div>

      <Card className="p-8 shadow-xl">
        <CardContent className="p-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-8"
          >
            {/* Section photo */}
            <div className="flex flex-col md:flex-row gap-8 pb-8 border-b">
              <div className="flex flex-col items-center md:items-start gap-4 md:w-1/3">
                <Avatar className="h-32 w-32 text-2xl">
                  <AvatarImage src={photoPreview ?? ""} alt="Preview" />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Changer photo
                  </Button>
                  {photoFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(profile?.photo ?? profile?.avatar ?? null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>

              {/* Informations personnelles */}
              <div className="md:w-2/3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prenom" className="text-base font-medium">
                      Prénom
                    </Label>
                    <Input
                      id="prenom"
                      type="text"
                      value={editData?.prenom || ""}
                      onChange={(e) => setEditData({ ...editData, prenom: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nom" className="text-base font-medium">
                      Nom
                    </Label>
                    <Input
                      id="nom"
                      type="text"
                      value={editData?.nom || ""}
                      onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telephone" className="text-base font-medium">
                      Téléphone
                    </Label>
                    <Input
                      id="telephone"
                      type="tel"
                      value={editData?.telephone || ""}
                      onChange={(e) => setEditData({ ...editData, telephone: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-base font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile?.email || ""}
                      disabled
                      className="mt-2 bg-muted"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="adresse" className="text-base font-medium">
                    Adresse
                  </Label>
                  <Input
                    id="adresse"
                    type="text"
                    value={editData?.adresse || ""}
                    onChange={(e) => setEditData({ ...editData, adresse: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
                Annuler
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

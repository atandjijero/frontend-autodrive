import { useState } from "react";
import { createAgency } from "@/api/apiClient";
import type { CreateAgencyDto } from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconMapPin,
  IconPhone,
  IconMail,
  IconUser,
  IconUpload,
  IconCheck
} from "@tabler/icons-react";

export default function AgencesAjout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateAgencyDto>({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    email: "",
    manager: "",
    description: "",
    isActive: true,
    location: { latitude: 0, longitude: 0 },
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleInputChange = (field: keyof CreateAgencyDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field: 'latitude' | 'longitude', value: number) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location!, [field]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createAgency(formData, logoFile || undefined);
      toast.success("✅ Agence ajoutée avec succès !", {
        style: { background: "#e6f4ea", color: "#1e7e34" },
      });
      navigate("/admin/agences/liste");
    } catch (error: any) {
        console.error('Create agency error:', error?.response ?? error);
        const apiData = error?.response?.data;
        const message = apiData?.message || apiData || "❌ Impossible d'ajouter l'agence.";
        toast.error(String(typeof message === 'object' ? JSON.stringify(message) : message), {
          style: { background: "#fdecea", color: "#b71c1c" },
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pl-4 md:pl-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/agences/liste")}>
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ajouter une agence</h1>
            <p className="text-muted-foreground">
              Créez une nouvelle agence dans votre réseau
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="hidden sm:flex">
          <IconMapPin className="h-3 w-3 mr-1" />
          Nouvelle agence
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconMapPin className="h-5 w-5" />
              Informations générales
            </CardTitle>
            <CardDescription>
              Les informations de base de l'agence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nom de l'agence *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ex: Agence Paris Centre"
                  required
                  className="transition-colors focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manager" className="text-sm font-medium">
                  Responsable
                </Label>
                <div className="relative">
                  <IconUser className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="manager"
                    value={formData.manager || ""}
                    onChange={(e) => handleInputChange("manager", e.target.value)}
                    placeholder="Ex: Jean Dupont"
                    className="pl-9 transition-colors focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Description de l'agence..."
                rows={3}
                className="transition-colors focus:border-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Adresse et contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconMail className="h-5 w-5" />
              Adresse et contact
            </CardTitle>
            <CardDescription>
              L'adresse physique et les coordonnées de l'agence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Adresse *
              </Label>
              <div className="relative">
                <IconMapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Ex: 123 Rue de la Paix"
                  className="pl-9 transition-colors focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  Ville *
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Ex: Paris"
                  required
                  className="transition-colors focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-sm font-medium">
                  Code postal *
                </Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  placeholder="Ex: 75001"
                  required
                  className="transition-colors focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">
                  Pays *
                </Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger className="transition-colors focus:border-primary">
                    <SelectValue placeholder="Sélectionner un pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Belgique">Belgique</SelectItem>
                    <SelectItem value="Bénin">Bénin</SelectItem>
                    <SelectItem value="Suisse">Suisse</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                    <SelectItem value="Togo">Togo</SelectItem>
                    <SelectItem value="Ghana">Ghana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Téléphone *
                </Label>
                <div className="relative">
                  <IconPhone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Ex: +33123456789"
                    className="pl-9 transition-colors focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email *
                </Label>
                <div className="relative">
                  <IconMail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Ex: contact@agence-paris.fr"
                    className="pl-9 transition-colors focus:border-primary"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coordonnées GPS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconMapPin className="h-5 w-5" />
              Localisation GPS
            </CardTitle>
            <CardDescription>
              Coordonnées géographiques de l'agence (optionnel)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-sm font-medium">
                    Latitude
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.location?.latitude || ""}
                    onChange={(e) => handleLocationChange("latitude", parseFloat(e.target.value) || 0)}
                    placeholder="Ex: 48.8566"
                    className="transition-colors focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-sm font-medium">
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.location?.longitude || ""}
                    onChange={(e) => handleLocationChange("longitude", parseFloat(e.target.value) || 0)}
                    placeholder="Ex: 2.3522"
                    className="transition-colors focus:border-primary"
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  if (!navigator.geolocation) {
                    toast.error("La géolocalisation n'est pas supportée par ce navigateur");
                    return;
                  }

                  try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                      navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 300000 // 5 minutes
                      });
                    });

                    handleLocationChange("latitude", position.coords.latitude);
                    handleLocationChange("longitude", position.coords.longitude);
                    toast.success("Position GPS obtenue avec succès !");
                  } catch (error: any) {
                    console.error("Erreur de géolocalisation:", error);
                    toast.error(
                      error.code === 1 ? "Accès à la localisation refusé" :
                      error.code === 2 ? "Position indisponible" :
                      error.code === 3 ? "Timeout de géolocalisation" :
                      "Erreur lors de l'obtention de la position"
                    );
                  }
                }}
                className="w-full"
              >
                <IconMapPin className="h-4 w-4 mr-2" />
                Obtenir ma position actuelle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logo et statut */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUpload className="h-5 w-5" />
              Logo et statut
            </CardTitle>
            <CardDescription>
              Logo de l'agence et configuration du statut
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="logo" className="text-sm font-medium">
                Logo de l'agence
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 transition-colors"
                />
                {logoFile && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <IconCheck className="h-3 w-3" />
                    {logoFile.name}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Formats acceptés: JPG, PNG, GIF. Taille maximale: 5MB
              </p>
            </div>

            <Separator />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
              <Label htmlFor="isActive" className="text-sm font-medium">
                Agence active
              </Label>
              <span className="text-xs text-muted-foreground">
                Désactivez pour masquer l'agence du site public
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/agences/liste")}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Ajout en cours..." : "Ajouter l'agence"}
          </Button>
        </div>
      </form>
    </div>
  );
}
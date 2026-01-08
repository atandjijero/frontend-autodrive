import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAgencyById, updateAgency } from "@/api/apiClient";
import type { Agency, UpdateAgencyDto } from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { IconArrowLeft, IconMapPin } from "@tabler/icons-react";

export default function AgencesModif() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateAgencyDto>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Charger les infos de l'agence
  useEffect(() => {
    const fetchAgency = async () => {
      try {
        const res = await getAgencyById(id!);
        setAgency(res.data);
        setFormData({
          name: res.data.name,
          address: res.data.address,
          city: res.data.city,
          postalCode: res.data.postalCode,
          country: res.data.country,
          phone: res.data.phone,
          email: res.data.email,
          manager: res.data.manager,
          description: res.data.description,
          isActive: res.data.isActive,
          location: res.data.location,
        });
      } catch (err) {
        setErrorMessage("Agence introuvable.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgency();
  }, [id]);

  const handleInputChange = (field: keyof UpdateAgencyDto, value: any) => {
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
    setSaving(true);

    try {
      await updateAgency(id!, formData, logoFile || undefined);
      toast.success("✅ Agence modifiée avec succès !", {
        style: { background: "#e6f4ea", color: "#1e7e34" },
      });
      navigate("/admin/agences/liste");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "❌ Impossible de modifier l'agence.",
        {
          style: { background: "#fdecea", color: "#b71c1c" },
        }
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Chargement de l'agence...</p>;
  if (errorMessage) return <p className="text-red-500">{errorMessage}</p>;
  if (!agency) return <p>Agence non trouvée.</p>;

  return (
    <div className="space-y-6 pl-4 md:pl-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate("/admin/agences/liste")}>
          <IconArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Modifier l'agence: {agency.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de l'agence</CardTitle>
          <CardDescription>
            Modifiez les informations de l'agence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'agence *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manager">Responsable</Label>
                <Input
                  id="manager"
                  value={formData.manager || ""}
                  onChange={(e) => handleInputChange("manager", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  value={formData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal *</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode || ""}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Pays *</Label>
                <Input
                  id="country"
                  value={formData.country || ""}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label>Coordonnées GPS</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.location?.latitude || ""}
                    onChange={(e) => handleLocationChange("latitude", parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.location?.longitude || ""}
                    onChange={(e) => handleLocationChange("longitude", parseFloat(e.target.value) || 0)}
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

            <div className="space-y-2">
              <Label htmlFor="logo">Logo (laisser vide pour garder l'actuel)</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive ?? true}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Agence active</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? "Modification en cours..." : "Modifier l'agence"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/agences/liste")}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
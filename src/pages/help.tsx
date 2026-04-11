import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconMail, IconPhone, IconMapPin } from "@tabler/icons-react";
import { getActiveAgencies } from "@/api/apiClient";
import type { Agency } from "@/api/apiClient";

export default function HelpPage() {
  const [activeAgency, setActiveAgency] = useState<Agency | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulation d'envoi
    setTimeout(() => {
      toast.success("Votre message a été envoyé avec succès !");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    const loadActiveAgency = async () => {
      try {
        const response = await getActiveAgencies({ limit: 1 });
        if (response.data?.data?.length) {
          setActiveAgency(response.data.data[0]);
        }
      } catch (err) {
        console.warn('Impossible de charger l agence active :', err);
      }
    };

    loadActiveAgency();
  }, []);

  return (
    <div className="p-6 container mx-auto max-w-6xl space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Centre d'Aide</h1>
        <p className="text-muted-foreground">
          Besoin d'aide ? Contactez notre équipe de support
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire de contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contactez-nous</CardTitle>
            <CardDescription>
              Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Envoi en cours..." : "Envoyer le message"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Informations de contact */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de contact</CardTitle>
            <CardDescription>
              {activeAgency ? "Coordonnées de l'agence active" : "Plusieurs moyens de nous contacter"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <IconMail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  {activeAgency?.email || "support@autodrive.com"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IconPhone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Téléphone</p>
                <p className="text-sm text-muted-foreground">
                  {activeAgency?.phone || "+33 1 23 45 67 89"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IconMapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Adresse</p>
                <p className="text-sm text-muted-foreground">
                  {activeAgency ? (
                    <>{activeAgency.address}<br />{activeAgency.postalCode} {activeAgency.city}, {activeAgency.country}</>
                  ) : (
                    <>
                      123 Avenue des Véhicules<br />
                      75001 Paris, France
                    </>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ rapide */}
      <Card>
        <CardHeader>
          <CardTitle>Questions fréquentes</CardTitle>
          <CardDescription>
            Trouvez rapidement des réponses à vos questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Comment réserver un véhicule ?</h4>
              <p className="text-sm text-muted-foreground">
                Parcourez notre catalogue de véhicules, sélectionnez celui qui vous convient,
                choisissez vos dates et suivez le processus de réservation.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Quels sont les documents requis ?</h4>
              <p className="text-sm text-muted-foreground">
                Un permis de conduire valide, une pièce d'identité et une carte de crédit
                pour la caution sont généralement requis.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Puis-je annuler ma réservation ?</h4>
              <p className="text-sm text-muted-foreground">
                Oui, selon nos conditions générales, vous pouvez annuler jusqu'à 24h
                avant la prise en charge sans frais.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
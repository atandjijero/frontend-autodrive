import { useEffect, useState } from "react";
import { getTemoignages, addTemoignage } from "@/api/apiClient";
import type { Temoignage } from "@/api/apiClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Temoignages() {
  const [temoignages, setTemoignages] = useState<Temoignage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testimonialMessage, setTestimonialMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getTemoignages()
      .then((res) => {
        setTemoignages(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les témoignages.");
        setLoading(false);
      });
  }, []);

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialMessage.trim()) return;

    setSubmitting(true);
    try {
      await addTemoignage({ message: testimonialMessage });
      toast.success("Témoignage ajouté avec succès !");
      setTestimonialMessage("");
      // Refresh the list
      const res = await getTemoignages();
      setTemoignages(res.data);
    } catch (err: any) {
      toast.error("Erreur lors de l'ajout du témoignage");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-muted-foreground">Chargement des témoignages...</p>;
  }

  if (error) {
    return <p className="p-6 text-destructive">{error}</p>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Témoignages</h1>

      {/* Formulaire d'ajout */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Laisser un témoignage</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTestimonialSubmit} className="space-y-4">
            <div>
              <Label htmlFor="testimonial">Votre message</Label>
              <Textarea
                id="testimonial"
                placeholder="Partagez votre expérience avec AutoDrive..."
                value={testimonialMessage}
                onChange={(e) => setTestimonialMessage(e.target.value)}
                rows={4}
                required
              />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Envoi en cours..." : "Envoyer le témoignage"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {temoignages.map((temoignage, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center">
                <Avatar className="w-10 h-10 mr-3">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{temoignage.prenom[0]}{temoignage.nom[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{temoignage.prenom} {temoignage.nom}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic">"{temoignage.message}"</p>
              <div className="flex mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
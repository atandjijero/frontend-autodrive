import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function About() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-center mb-6">
        À propos d’AutoDrive 🚗
      </h1>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Notre mission</CardTitle>
          <CardDescription>
            Simplifier la mobilité pour tous nos clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            AutoDrive est une plateforme de location de véhicules modernes et fiables,
            conçue pour répondre aux besoins des particuliers comme des professionnels.
            Notre objectif est de rendre la mobilité simple, accessible et agréable.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Pourquoi nous choisir ?</CardTitle>
          <CardDescription>
            Les avantages qui font la différence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-none space-y-3">
            <li>
              <Badge variant="secondary">🚘</Badge> Large gamme de véhicules adaptés à tous les besoins
            </li>
            <li>
              <Badge variant="secondary">💰</Badge> Tarifs compétitifs et transparents
            </li>
            <li>
              <Badge variant="secondary">🤝</Badge> Service client disponible et réactif
            </li>
            <li>
              <Badge variant="secondary">🌍</Badge> Réservation simple et rapide en ligne
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Notre vision</CardTitle>
          <CardDescription>
            Une mobilité durable et innovante
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Nous croyons que la mobilité est un facteur clé de liberté et de développement.
            AutoDrive s’engage à offrir une expérience de location fluide, sécurisée et durable,
            en intégrant des solutions innovantes pour l’avenir.
          </p>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <p className="text-center text-sm text-muted-foreground">
        © 2025 AutoDrive – Votre partenaire mobilité
      </p>
    </div>
  );
}

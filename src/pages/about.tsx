import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function About() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-center mb-6">À propos d’AutoDrive 🚗</h1>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Notre mission</h2>
        </CardHeader>
        <CardContent>
          <p>
            AutoDrive est une plateforme de location de véhicules modernes et fiables, conçue pour
            répondre aux besoins des particuliers comme des professionnels. Notre objectif est de
            rendre la mobilité simple, accessible et agréable.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Pourquoi nous choisir ?</h2>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>🚘 Large gamme de véhicules adaptés à tous les besoins</li>
            <li>💰 Tarifs compétitifs et transparents</li>
            <li>🤝 Service client disponible et réactif</li>
            <li>🌍 Réservation simple et rapide en ligne</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Notre vision</h2>
        </CardHeader>
        <CardContent>
          <p>
            Nous croyons que la mobilité est un facteur clé de liberté et de développement. 
            AutoDrive s’engage à offrir une expérience de location fluide, sécurisée et durable, 
            en intégrant des solutions innovantes pour l’avenir.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

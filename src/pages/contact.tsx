import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Helmet } from "react-helmet-async"

export default function Contact() {
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log({
      nom,
      email,
      message,
    })

    // Ici tu pourras appeler ton backend pour envoyer un mail
  }

  return (
    <>
      <Helmet>
        <title>Contact AutoDrive - Nous Contacter | Location Véhicules</title>
        <meta name="description" content="Contactez AutoDrive pour vos questions sur la location de véhicules. Service client disponible 7j/7. Réservation en ligne, support technique, informations pratiques." />
        <meta name="keywords" content="contact AutoDrive, location voiture contact, support client, réservation véhicule, service client location" />
        <meta property="og:title" content="Contact AutoDrive - Location de Véhicules" />
        <meta property="og:description" content="Contactez AutoDrive pour vos questions sur la location de véhicules. Service client disponible 7j/7." />
        <meta property="og:url" content="https://autodrive.com/contact" />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href="https://autodrive.com/contact" />
      </Helmet>

      <div className="p-6 max-w-3xl mx-auto space-y-10">
      <h1 className="text-4xl font-bold text-center mb-6">Contact 📩</h1>

      {/* Formulaire */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Envoyez-nous un message</CardTitle>
          <CardDescription>
            Remplissez le formulaire ci-dessous et notre équipe vous répondra rapidement.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Votre nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />

            <Input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Textarea
              placeholder="Votre message"
              className="min-h-[120px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <Button type="submit" className="w-full">
              Envoyer
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Localisation */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Notre localisation 📍</CardTitle>
          <CardDescription>
            Retrouvez-nous facilement grâce à la carte interactive ci-dessous.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AspectRatio ratio={16 / 9} className="rounded-md overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7933.410550627531!2d1.2436596403587978!3d6.170204125268439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e3c906961333%3A0x2201e83329a4ecad!2sA%C3%A9roport%20International%20Gnassingb%C3%A9%20Eyadema!5e0!3m2!1sfr!2stg!4v1765054999438!5m2!1sfr!2stg"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </AspectRatio>
        </CardContent>
      </Card>
    </div>
    </>
  )
}

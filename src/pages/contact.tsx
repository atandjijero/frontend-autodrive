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

export default function Contact() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-10">
      <h1 className="text-4xl font-bold text-center mb-6">Contact 📩</h1>

      {/* Formulaire dans une Card */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Envoyez-nous un message</CardTitle>
          <CardDescription>
            Remplissez le formulaire ci-dessous et notre équipe vous répondra rapidement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Input placeholder="Votre nom" />
            </div>
            <div>
              <Input type="email" placeholder="Votre email" />
            </div>
            <div>
              <Textarea placeholder="Votre message" className="min-h-[120px]" />
            </div>
            <Button type="submit" className="w-full">
             Envoyer
            </Button>

          </form>
        </CardContent>
      </Card>

      <Separator />

      {/*  Localisation Google Maps dans une Card */}
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
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d126931.66829865749!2d1.164288357999482!3d6.182302667448728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sIAEC!5e0!3m2!1sfr!2stg!4v1763808535094!5m2!1sfr!2stg"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </AspectRatio>
        </CardContent>
      </Card>
    </div>
  )
}

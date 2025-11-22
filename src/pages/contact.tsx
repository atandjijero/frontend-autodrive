import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function Contact() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-4">Contact 📩</h1>

      {/* Formulaire */}
      <div className="space-y-4">
        <Input placeholder="Votre nom" />
        <Input type="email" placeholder="Votre email" />
        <Textarea placeholder="Votre message" />
        <Button>Envoyer</Button>
      </div>

      {/* Localisation Google Maps */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Notre localisation 📍</h2>
        <AspectRatio ratio={16 / 9} className="rounded-md overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d126931.66829865749!2d1.164288357999482!3d6.182302667448728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sIAEC!5e0!3m2!1sfr!2stg!4v1763808535094!5m2!1sfr!2stg"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </AspectRatio>
      </div>
    </div>
  )
}

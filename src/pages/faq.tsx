import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Helmet } from "react-helmet-async"

export default function FAQ() {
  return (
    <>
      <Helmet>
        <title>FAQ AutoDrive - Questions Fréquentes | Location Véhicules</title>
        <meta name="description" content="Trouvez les réponses à vos questions sur la location de véhicules AutoDrive. Réservation, tarifs, assurance, conditions générales - Tout ce que vous devez savoir." />
        <meta name="keywords" content="FAQ location voiture, questions location véhicule, tarif AutoDrive, assurance auto, conditions location" />
        <meta property="og:title" content="FAQ AutoDrive - Questions Fréquentes" />
        <meta property="og:description" content="Trouvez les réponses à vos questions sur la location de véhicules AutoDrive." />
        <meta property="og:url" content="https://autodrive.com/faq" />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href="https://autodrive.com/faq" />
      </Helmet>

      <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Titre principal */}
      <h1 className="text-4xl font-bold text-center">FAQ ❓</h1>
      <p className="text-center text-muted-foreground">
        Retrouvez ici les réponses aux questions les plus fréquentes concernant nos services AutoDrive.
      </p>

      {/* Liste des questions */}
      <Accordion type="single" collapsible className="mt-6 space-y-4">
        <AccordionItem value="q1">
          <AccordionTrigger className="text-lg font-semibold">
            Comment réserver un véhicule ?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground bg-gray-50 dark:bg-gray-900/30 p-4 rounded-md">
            Vous pouvez réserver directement en ligne via notre formulaire de réservation. 
            Sélectionnez vos dates, choisissez votre véhicule et validez votre paiement en quelques clics.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q2">
          <AccordionTrigger className="text-lg font-semibold">
            Quels moyens de paiement acceptez-vous ?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground bg-gray-50 dark:bg-gray-900/30 p-4 rounded-md">
            Nous acceptons les cartes bancaires (Visa, Mastercard) ainsi que les paiements en ligne sécurisés via Stripe.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q3">
          <AccordionTrigger className="text-lg font-semibold">
            Puis-je annuler ou modifier ma réservation ?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground bg-gray-50 dark:bg-gray-900/30 p-4 rounded-md">
            Oui, vous pouvez annuler ou modifier votre réservation jusqu’à 24h avant le début de la location, 
            directement depuis votre espace client.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q4">
          <AccordionTrigger className="text-lg font-semibold">
            Proposez-vous des véhicules utilitaires ?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground bg-gray-50 dark:bg-gray-900/30 p-4 rounded-md">
            Bien sûr ! AutoDrive met à disposition une gamme complète de véhicules utilitaires adaptés 
            aux besoins des particuliers et des entreprises.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
    </>
  )
}

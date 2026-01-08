import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { useTranslation } from "react-i18next"

export default function FAQ() {
  const { t } = useTranslation()
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Titre principal */}
      <h1 className="text-4xl font-bold text-center">{t('faq.title')}</h1>
      <p className="text-center text-muted-foreground">{t('faq.intro')}</p>

      {/* Liste des questions */}
      <Accordion type="single" collapsible className="mt-6 space-y-4">
        <AccordionItem value="q1">
          <AccordionTrigger className="text-lg font-semibold">{t('faq.q1.question')}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground bg-gray-50 dark:bg-gray-900/30 p-4 rounded-md">{t('faq.q1.answer')}</AccordionContent>
        </AccordionItem>

        <AccordionItem value="q2">
          <AccordionTrigger className="text-lg font-semibold">{t('faq.q2.question')}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground bg-gray-50 dark:bg-gray-900/30 p-4 rounded-md">{t('faq.q2.answer')}</AccordionContent>
        </AccordionItem>

        <AccordionItem value="q3">
          <AccordionTrigger className="text-lg font-semibold">{t('faq.q3.question')}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground bg-gray-50 dark:bg-gray-900/30 p-4 rounded-md">{t('faq.q3.answer')}</AccordionContent>
        </AccordionItem>

        <AccordionItem value="q4">
          <AccordionTrigger className="text-lg font-semibold">{t('faq.q4.question')}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground bg-gray-50 dark:bg-gray-900/30 p-4 rounded-md">{t('faq.q4.answer')}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

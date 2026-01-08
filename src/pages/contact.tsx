import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { sendContact } from "@/api/apiClient"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { useTranslation } from "react-i18next"
import { Separator } from "@/components/ui/separator"

export default function Contact() {
  const { t } = useTranslation();
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    try {
      await sendContact({ nom, email, message })
      setNom("")
      setEmail("")
      setMessage("")
      setSuccess(true)
    } catch (err: any) {
      console.error('Contact send error', err)
      setError(err?.response?.data?.message || 'Erreur lors de l envoi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-10">
      <h1 className="text-4xl font-bold text-center mb-6">{t('contact.title')}</h1>

      {/* Formulaire */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{t('contact.form.title')}</CardTitle>
          <CardDescription>{t('contact.form.desc')}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder={t('contact.form.placeholders.name')}
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />

            <Input
              type="email"
              placeholder={t('contact.form.placeholders.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Textarea
              placeholder={t('contact.form.placeholders.message')}
              className="min-h-[120px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? t('contact.form.sending') : t('contact.form.send')}
            </Button>
            {success && <p className="text-green-600 text-center">{t('contact.form.success')}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Localisation */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{t('contact.location.title')}</CardTitle>
          <CardDescription>{t('contact.location.desc')}</CardDescription>
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
  )
}

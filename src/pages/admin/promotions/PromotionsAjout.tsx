"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { addPromotion, getVehicles } from "@/api/apiClient"
import type { Vehicle } from "@/api/apiClient"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

// ✅ Schéma Zod pour validation
const promotionSchema = z.object({
  titre: z.string().min(2, "Titre requis"),
  description: z.string().min(5, "Description trop courte"),
  type: z.enum(["pourcentage", "montant"]),
  valeur: z.coerce.number().min(1, "Valeur invalide"),
  dateDebut: z.string().min(1, "Date début requise"),
  dateFin: z.string().min(1, "Date fin requise"),
  vehiculeId: z.string().optional(),
  codesPromo: z.array(z.string()).optional(),
  utilisationMax: z.coerce.number().min(0).optional(),
  dureeMinLocation: z.coerce.number().min(1).optional(),
  montantMinCommande: z.coerce.number().min(0).optional(),
})

type PromotionFormValues = z.infer<typeof promotionSchema>

export default function PromotionsAjout() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    getVehicles().then((res) => setVehicles(res.data))
  }, [])

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      titre: "",
      description: "",
      type: "pourcentage",
      valeur: 0,
      dateDebut: "",
      dateFin: "",
      vehiculeId: "",
      codesPromo: [],
      utilisationMax: 0,
      dureeMinLocation: 1,
      montantMinCommande: 0,
    },
  })

  const onSubmit = async (values: PromotionFormValues) => {
    try {
      await addPromotion(values)
      setMessage("✅ Promotion créée avec succès !")
    } catch (err: any) {
      setMessage(err.response?.data?.message || "❌ Erreur lors de la création.")
    }
  }

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Ajouter une promotion</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Titre et Type */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="titre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Réduction Hiver 2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pourcentage">Pourcentage</SelectItem>
                          <SelectItem value="montant">Montant fixe</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Profitez de 20% de réduction..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Valeur et Véhicule */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valeur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valeur</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehiculeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Véhicule</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un véhicule" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map((v) => (
                            <SelectItem key={v._id} value={v._id}>
                              {v.marque} {v.modele} ({v.immatriculation})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateDebut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date début</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateFin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date fin</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Codes promo et Utilisation max */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="codesPromo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codes promo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="HIVER2026,WINTER20"
                        value={field.value?.join(",") || ""}
                        onChange={(e) => field.onChange(e.target.value.split(","))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="utilisationMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Utilisation maximale</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Durée min et Montant min */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dureeMinLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée minimale de location (jours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="montantMinCommande"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant minimum de commande (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">Créer la promotion</Button>
            {message && <p className="mt-2 text-center">{message}</p>}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

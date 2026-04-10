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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

// ✅ Schéma Zod pour validation
const promotionSchema = z.object({
  titre: z.string().min(2, "Titre requis"),
  description: z.string().min(5, "Description trop courte"),
  type: z.enum(["pourcentage", "montant"]),
  valeur: z.coerce.number().min(0.01, "Valeur invalide"),
  dateDebut: z.string().min(1, "Date début requise"),
  dateFin: z.string().min(1, "Date fin requise"),
  vehiculesIds: z.array(z.coerce.number()).optional(),
  codesPromo: z.array(z.string()).optional(),
  utilisationMax: z.coerce.number().min(0).optional(),
  dureeMinLocation: z.coerce.number().min(1).optional(),
  montantMinCommande: z.coerce.number().min(0).optional(),
})

type PromotionFormValues = z.infer<typeof promotionSchema>

export default function PromotionsAjout() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getVehicles().then((res) => setVehicles(res.data))
  }, [])

  // Filtrer uniquement les véhicules disponibles et éligibles aux promotions
  const availableVehicles = vehicles.filter((v) => v.disponible && v.promotionCandidate)

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      titre: "",
      description: "",
      type: "pourcentage",
      valeur: 0,
      dateDebut: "",
      dateFin: "",
      vehiculesIds: [],
      codesPromo: [],
      utilisationMax: 0,
      dureeMinLocation: 1,
      montantMinCommande: 0,
    },
  })

  const toggleVehicle = (vehicleId: number) => {
    setSelectedVehicleIds((prev) => {
      const next = prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
      form.setValue("vehiculesIds", next as any)
      return next
    })
  }

  const onSubmit = async (values: PromotionFormValues) => {
    if (!values.dateDebut || !values.dateFin) {
      setMessage("❌ Les dates de début et fin sont requises.")
      return
    }

    try {
      setLoading(true)
      setMessage(null)
      
      // Vérifier les dates
      const dateDebut = new Date(values.dateDebut)
      const dateFin = new Date(values.dateFin)
      
      if (dateDebut >= dateFin) {
        setMessage("❌ La date de fin doit être après la date de début.")
        setLoading(false)
        return
      }

      await addPromotion({
        ...values,
        vehiculesIds: selectedVehicleIds,
      })
      
      setMessage("✅ Promotion créée avec succès !")
      form.reset()
      setSelectedVehicleIds([])
    } catch (err: any) {
      console.error("Erreur:", err)
      const errorMsg = err.response?.data?.message || err.message || "Erreur lors de la création."
      setMessage(`❌ ${errorMsg}`)
    } finally {
      setLoading(false)
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

            {/* Valeur */}
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

            {/* Sélection multiple de véhicules */}
            <div>
              <FormLabel className="mb-3 block">
                Véhicules concernés
                <span className="text-muted-foreground text-xs ml-2">
                  (aucun = promotion globale sur toute la flotte)
                </span>
              </FormLabel>

              {selectedVehicleIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedVehicleIds.map((id) => {
                    const v = vehicles.find((veh) => veh.id === id)
                    return v ? (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        onClick={() => toggleVehicle(id)}
                      >
                        {v.marque} {v.modele || v.immatriculation} ✕
                      </Badge>
                    ) : null
                  })}
                </div>
              )}

              <div className="border rounded-lg max-h-48 overflow-y-auto p-2 space-y-1">
                {availableVehicles.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucun véhicule disponible
                  </p>
                ) : (
                  availableVehicles.map((v) => (
                    <label
                      key={v.id}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={selectedVehicleIds.includes(v.id)}
                        onCheckedChange={() => toggleVehicle(v.id)}
                      />
                      <span className="text-sm font-medium">
                        {v.marque} {v.modele || v.immatriculation}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {v.prix} € / jour
                      </span>
                    </label>
                  ))
                )}
              </div>
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
                        onChange={(e) => {
                          const val = e.target.value;
                          const codes = val.split(",").map(c => c.trim()).filter(c => c !== "");
                          field.onChange(codes);
                        }}
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Création en cours..." : "Créer la promotion"}
            </Button>
            {message && (
              <p className={`mt-2 text-center text-sm ${
                message.startsWith("✅") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}>
                {message}
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

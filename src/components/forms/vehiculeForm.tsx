"use client"

import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { addVehicle } from "@/api/apiClient"

// Schéma Zod conforme au DTO
const vehicleSchema = z.object({
  carrosserie: z.string().min(2),
  modele: z.string().min(2),
  marque: z.string().min(2),
  transmission: z.enum(["automatique", "manuelle"]),
  prix: z.coerce.number().min(1),
  immatriculation: z.string().min(2),
  photos: z
    .custom<FileList>((val) => val instanceof FileList)
    .optional(),
})

type VehicleFormValues = z.infer<typeof vehicleSchema>

export function VehiculeForm() {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      carrosserie: "",
      modele: "",
      marque: "",
      transmission: "automatique",
      prix: 80,
      immatriculation: "",
      photos: undefined,
    },
    mode: "onSubmit",
  })

  const onSubmit: SubmitHandler<VehicleFormValues> = async (values) => {
    try {
      // Construire FormData pour envoyer fichiers + champs texte
      const formData = new FormData()
      formData.append("carrosserie", values.carrosserie)
      formData.append("modele", values.modele)
      formData.append("marque", values.marque)
      formData.append("transmission", values.transmission)
      formData.append("prix", values.prix.toString())
      formData.append("immatriculation", values.immatriculation)

      if (values.photos) {
        Array.from(values.photos).forEach((file) => {
          formData.append("file", file) // correspond au champ attendu par FileInterceptor
        })
      }

      await addVehicle(formData)
      toast.success("Véhicule ajouté avec succès ")
      form.reset()
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Impossible d’ajouter le véhicule ❌")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Ajouter un véhicule</CardTitle>
          <CardDescription>Entrez les informations du véhicule</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Carrosserie */}
              <FormField
                control={form.control}
                name="carrosserie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carrosserie</FormLabel>
                    <FormControl>
                      <Input placeholder="SUV" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Modèle */}
              <FormField
                control={form.control}
                name="modele"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modèle</FormLabel>
                    <FormControl>
                      <Input placeholder="Corolla" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Marque */}
              <FormField
                control={form.control}
                name="marque"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marque</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Transmission */}
              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transmission</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir la transmission" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manuelle">Manuelle</SelectItem>
                          <SelectItem value="automatique">Automatique</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Prix */}
              <FormField
                control={form.control}
                name="prix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          placeholder="80"
                          value={Number.isFinite(field.value as number) ? field.value : ""}
                          onChange={(e) => {
                            const val = e.target.value
                            field.onChange(val === "" ? "" : Number(val))
                          }}
                          className="flex-1"
                        />
                        <span className="ml-2 text-muted-foreground">€</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Immatriculation */}
              <FormField
                control={form.control}
                name="immatriculation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Immatriculation</FormLabel>
                    <FormControl>
                      <Input placeholder="AB-123-CD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photos */}
              <FormField
                control={form.control}
                name="photos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photos</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting ? "Ajout en cours..." : "Ajouter le véhicule"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

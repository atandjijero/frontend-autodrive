"use client"

import { useForm } from "react-hook-form"
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

//  Schéma Zod compatible avec ajout + modification
const vehicleSchema = z.object({
  carrosserie: z.string().min(2),
  modele: z.string().min(2),
  marque: z.string().min(2),
  transmission: z.enum(["automatique", "manuelle"]),
  prix: z.coerce.number().min(1),
  immatriculation: z.string().min(2),

  // Accepte FileList OU tableau d'URL
  photos: z
    .union([
      z.custom<FileList>((val) => val instanceof FileList),
      z.array(z.string())
    ])
    .optional(),
})

export type VehicleFormValues = z.infer<typeof vehicleSchema>

export interface VehiculeFormProps {
  defaultValues?: Partial<VehicleFormValues>
  onSubmit: (values: VehicleFormValues) => Promise<void>
}

export function VehiculeForm({ defaultValues, onSubmit }: VehiculeFormProps) {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      carrosserie: defaultValues?.carrosserie ?? "",
      modele: defaultValues?.modele ?? "",
      marque: defaultValues?.marque ?? "",
      transmission: defaultValues?.transmission ?? "automatique",
      prix: defaultValues?.prix ?? 80,
      immatriculation: defaultValues?.immatriculation ?? "",
      photos: defaultValues?.photos ?? [], // accepte les URLs en modification
    },
  })

  return (
    <Form {...form}>
      <form id="vehicule-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

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
              <FormLabel>Nouvelle photo (optionnel)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Enregistrer
        </Button>
      </form>
    </Form>
  )
}

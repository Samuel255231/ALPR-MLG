
// src\pages\camion\ModifierProprietaire.tsx
import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import axios from "axios"
import type { Proprietaire } from "./types"

interface ModifierProprietaireProps {
  open: boolean
  setOpen: (open: boolean) => void
  proprietaire: Proprietaire | null
  onUpdated?: (updated: Proprietaire) => void
}

const formSchema = z.object({
  plaque: z.string().min(1, "La plaque est requise"),
  nom: z.string().min(1, "Le nom est requis"),
  marque: z.string(),
  modele: z.string(),
  chauffeur: z.string(),
  statut: z.string(),
})

type FormValues = z.infer<typeof formSchema>

const ModifierProprietaire: React.FC<ModifierProprietaireProps> = ({
  open,
  setOpen,
  proprietaire,
  onUpdated,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plaque: "",
      nom: "",
      marque: "",
      modele: "",
      chauffeur: "",
      statut: "actif",
    },
  })

  useEffect(() => {
    if (proprietaire) {
      form.reset({
        plaque: proprietaire.plaque,
        nom: proprietaire.nom,
        marque: proprietaire.marque,
        modele: proprietaire.modele,
        chauffeur: proprietaire.chauffeur,
        statut: proprietaire.statut ?? "actif",
      })
    }
  }, [proprietaire, form])

  const onSubmit = async (values: FormValues) => {
    if (!proprietaire) return
    try {
      const res = await axios.put(
        `http://localhost:8000/alpr/proprietaire/${proprietaire.id}/update/`,
        values
      )
      const updated: Proprietaire = res.data ?? { ...proprietaire, ...values }
      alert("Mise à jour réussie ✅")
      setOpen(false)
      onUpdated?.(updated)
    } catch {
      alert("Erreur lors de la mise à jour ❌")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Modifier véhicule</DialogTitle>
          <DialogDescription>
            Modifiez les informations du véhicule et du propriétaire.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="plaque" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Immatriculation</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="nom" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Propriétaire</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="marque" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Marque</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="modele" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Modèle</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="chauffeur" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Chauffeur</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="statut" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit">Enregistrer</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ModifierProprietaire




/*

import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import axios from "axios"

interface ModifierProprietaireProps {
  open: boolean
  setOpen: (open: boolean) => void
  proprietaire: {
    id: number
    plaque: string
    nom: string
    marque: string
    modele: string
    chauffeur: string
    statut?: string
  } | null
  onUpdated?: () => void
}

// 🚨 IMPORTANT : tous les champs doivent être obligatoires pour RHF
const formSchema = z.object({
  plaque: z.string().min(1, "La plaque est requise"),
  nom: z.string().min(1, "Le nom est requis"),
  marque: z.string(),
  modele: z.string(),
  chauffeur: z.string(),
  statut: z.string(),
})

type FormValues = z.infer<typeof formSchema>

const ModifierProprietaire: React.FC<ModifierProprietaireProps> = ({
  open,
  setOpen,
  proprietaire,
  onUpdated,
}) => {

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plaque: "",
      nom: "",
      marque: "",
      modele: "",
      chauffeur: "",
      statut: "actif",
    },
  })

  // Remplir quand on ouvre
  useEffect(() => {
    if (proprietaire) {
      form.reset({
        plaque: proprietaire.plaque,
        nom: proprietaire.nom,
        marque: proprietaire.marque,
        modele: proprietaire.modele,
        chauffeur: proprietaire.chauffeur,
        statut: proprietaire.statut ?? "actif",
      })
    }
  }, [proprietaire, form])

  const onSubmit = async (values: FormValues) => {
    if (!proprietaire) return
    try {
      await axios.put(
        `http://localhost:8000/alpr/proprietaire/${proprietaire.id}/update/`,
        values
      )
      alert("Mise à jour réussie")
      setOpen(false)
      onUpdated?.()
    } catch {
      alert("Erreur lors de la mise à jour")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Modifier véhicule</DialogTitle>
          <DialogDescription>
            Modifiez les informations.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/** Les champs fonctionnent maintenant sans erreur TS 
            <FormField name="plaque" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Immatriculation</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="nom" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Propriétaire</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="marque" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Marque</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="modele" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Modèle</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="chauffeur" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Chauffeur</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="statut" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit">Enregistrer</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ModifierProprietaire
*/
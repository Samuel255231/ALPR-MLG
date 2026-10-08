// src/pages/camion/AjoutProprietaire.tsx
import React from "react"
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

// Définition de l'interface Proprietaire inline
interface Proprietaire {
  id: number
  plaque: string
  nom: string
  marque: string
  modele: string
  chauffeur: string
  statut?: string
}

interface AjoutProprietaireProps {
  open: boolean
  setOpen: (open: boolean) => void
  onAdded?: (created: Proprietaire) => void // callback pour recharger la liste
}

const formSchema = z.object({
  plaque: z.string().min(1, "La plaque est requise"),
  nom: z.string().min(1, "Le nom du propriétaire est requis"),
  marque: z.string(),
  modele: z.string(),
  chauffeur: z.string(),
})

const AjoutProprietaire: React.FC<AjoutProprietaireProps> = ({ open, setOpen, onAdded }) => {
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plaque: "",
      nom: "",
      marque: "",
      modele: "",
      chauffeur: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("http://localhost:8000/alpr/proprietaire/add/", values)
      alert("Véhicule ajouté avec succès ✅")
      setOpen(false)
      form.reset() // Réinitialiser le formulaire
      if (onAdded && response.data) {
        onAdded(response.data) // ✅ Passer les données de l'API
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error)
      alert("Erreur lors de l'ajout ❌")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Ajouter un véhicule</DialogTitle>
          <DialogDescription>
            Saisissez les informations du véhicule et du propriétaire.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="plaque"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Immatriculation</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 1234 TBL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Propriétaire</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du propriétaire" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marque"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marque</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota, Renault..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modele"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modèle</FormLabel>
                    <FormControl>
                      <Input placeholder="Hilux, Clio..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chauffeur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chauffeur</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du chauffeur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Enregistrer</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AjoutProprietaire






/*
import React, { useEffect, useState } from "react"
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
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { addEvenement, fetchEvenements } from "@/redux/slices/CamionSlice"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AjoutCamionProps {
    open: boolean
    setOpen: (open: boolean) => void
}

const formSchema = z.object({
    immatriculation: z.string().min(1, "L'immatriculation est requise"),
    marque: z.string(),
    modele: z.string(),
    chauffeur: z.string(),
    etat: z.string(),
    type: z.string().min(1, "Le type est requis"),
})

const AjoutCamion: React.FC<AjoutCamionProps> = ({ open, setOpen }) => {
    const dispatch = useDispatch<AppDispatch>()
    const { evenements } = useSelector((state: RootState) => state.camions)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            immatriculation: "",
            marque: "",
            modele: "",
            chauffeur: "",
            etat: "",
            type: "",
        },
    })

    const [autoDisabled, setAutoDisabled] = useState(false)

    const type = form.watch("type")
    const immat = form.watch("immatriculation")

    useEffect(() => {
        dispatch(fetchEvenements())
    }, [dispatch])

    useEffect(() => {
        if ((type === "entree" || type === "sortie") && immat) {
            const found = evenements.find(
                (ev) => ev.immatriculation?.toLowerCase() === immat.toLowerCase()
            )

            if (found) {
                form.setValue("marque", found.marque || "")
                form.setValue("modele", found.modele || "")
                form.setValue("chauffeur", found.chauffeur || "")
                form.setValue("etat", found.etat || "")
                setAutoDisabled(true)
            } else {
                form.setValue("marque", "")
                form.setValue("modele", "")
                form.setValue("chauffeur", "")
                form.setValue("etat", "")
                setAutoDisabled(false)
            }
        } else {
            setAutoDisabled(false)
        }
    }, [immat, type, evenements, form])

    function onSubmit(values: z.infer<typeof formSchema>) {
        dispatch(addEvenement(values))
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px] bg-white">
                <DialogHeader>
                    <DialogTitle>Ajout camion</DialogTitle>
                    <DialogDescription>
                        Ajoutez un nouveau camion. Cliquez sur enregistrer pour valider.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Type 
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Sélectionner un type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="entree">Entrée</SelectItem>
                                                <SelectItem value="sortie">Sortie</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Immatriculation 
                            <FormField
                                control={form.control}
                                name="immatriculation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Immatriculation</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Entrez l'immatriculation" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Modèle 
                            <FormField
                                control={form.control}
                                name="modele"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Modèle</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Entrer le modèle" {...field} disabled={autoDisabled} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Marque 
                            <FormField
                                control={form.control}
                                name="marque"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marque</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Entrer la marque" {...field} disabled={autoDisabled} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Chauffeur 
                            <FormField
                                control={form.control}
                                name="chauffeur"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chauffeur</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Entrer le chauffeur" {...field} disabled={autoDisabled} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Etat 
                            <FormField
                                control={form.control}
                                name="etat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Etat</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full" disabled={autoDisabled}>
                                                    <SelectValue placeholder="Sélectionner un état" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Moyen">Moyen</SelectItem>
                                                <SelectItem value="Bon">Bon</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit 
                            <Button type="submit">Enregistrer</Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AjoutCamion
*/
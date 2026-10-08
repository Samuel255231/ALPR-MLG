import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { fetchZones } from "@/redux/slices/ZoneSlice"
import { updateCamera } from "@/redux/slices/CameraSlice"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type StatusType = "Actif" | "En maintenance" | "En panne"

export interface Zone {
  id: number
  nom: string
}

export interface Camera {
  id: number
  code: string
  rtsp_url: string
  description?: string
  type: string
  zone: Zone
  status: StatusType
}

interface EditCameraProps {
  open: boolean
  setOpen: (open: boolean) => void
  camera: Camera | null
}

const formSchema = z.object({
  code: z.string().min(1, "Le code est requis"),
  rtsp_url: z.string(),
  description: z.string().optional(),
  type: z.string().min(1, "Le type est requis"),
  zone: z.string().min(1, "La zone est requise"), // ✅ zone doit être un id string
  status: z.enum(["Actif", "En maintenance", "En panne"]),
})

const EditCamera: React.FC<EditCameraProps> = ({ open, setOpen, camera }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { zones } = useSelector((state: RootState) => state.zones)

  useEffect(() => {
    dispatch(fetchZones())
  }, [dispatch])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      rtsp_url: "",
      description: "",
      type: "",
      zone: "",
      status: "Actif",
    },
  })

  // ✅ Met à jour le formulaire quand la caméra change
  useEffect(() => {
    if (camera) {
      form.reset({
        code: camera.code,
        rtsp_url: camera.rtsp_url,
        description: camera.description ?? "",
        type: camera.type,
        zone: camera.zone?.id?.toString() ?? "",
        status: camera.status,
      })
    }
  }, [camera, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (camera) {
      // ✅ Convertit zone en objet { id }
      const selectedZone = zones.find((z) => z.id === Number(values.zone))
      if (!selectedZone) return

      dispatch(
        updateCamera({
          ...camera,
          code: values.code,
          rtsp_url: values.rtsp_url,
          description: values.description,
          type: values.type,
          zone: selectedZone, // ✅ objet complet
          status: values.status,
        })
      )
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Modifier la caméra</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la caméra puis cliquez sur enregistrer.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le code" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* RTSP URL */}
            <FormField
              control={form.control}
              name="rtsp_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RTSP URL</FormLabel>
                  <FormControl>
                    <Input placeholder="rtsp://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description (optionnel)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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

            {/* Zone */}
            <FormField
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner une zone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {zones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id.toString()}>
                          {zone.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Statut */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Actif">Actif</SelectItem>
                      <SelectItem value="En maintenance">En maintenance</SelectItem>
                      <SelectItem value="En panne">En panne</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Enregistrer</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditCamera

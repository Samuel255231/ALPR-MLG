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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/redux/store"
import { updateZone } from "@/redux/slices/ZoneSlice"

export interface Zone {
    id: number
    nom: string
}

interface EditZoneProps {
  open: boolean
  setOpen: (open: boolean) => void
  zone: Zone | null 
}

const formSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom doit avoir au moins 2 caractères.",
  }),
})

const EditZone: React.FC<EditZoneProps> = ({ open, setOpen, zone }) => {
  const dispatch = useDispatch<AppDispatch>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
    },
  })

  // 🔑 Pré-remplir le formulaire quand la zone change
  useEffect(() => {
    if (zone) {
      form.reset({ nom: zone.nom })
    }
  }, [zone, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (zone) {
      dispatch(updateZone({ ...zone, nom: values.nom }))
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier zone</DialogTitle>
          <DialogDescription>
            Modifiez le nom de la zone puis cliquez sur enregistrer.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la zone</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Zone A" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ce nom sera utilisé dans la liste des zones.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </DialogClose>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditZone

import React from "react"
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
import { addZone } from "@/redux/slices/ZoneSlice"

interface AjoutZoneProps {
    open: boolean
    setOpen: (open: boolean) => void
}

const formSchema = z.object({
    nom: z.string().min(2, {
        message: "Le nom doit avoir au moins 2 caractères.",
    }),
})

const AjoutZone: React.FC<AjoutZoneProps> = ({ open, setOpen }) => {
    const dispatch = useDispatch<AppDispatch>()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        dispatch(addZone(values))
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Ajout zone</DialogTitle>
                    <DialogDescription>
                        Ajoutez une nouvelle zone. Cliquez sur enregistrer pour valider.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="nom"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Zone Y" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Enregistrer</Button>
                        </form>
                    </Form>
                </div>

                {/* <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" type="button">
                            Annuler
                        </Button>
                    </DialogClose>
                    <Button type="submit">Enregistrer</Button>
                </DialogFooter> */}
            </DialogContent>

        </Dialog>
    )
}

export default AjoutZone

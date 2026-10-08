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
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { addCamera } from "@/redux/slices/CameraSlice"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchZones } from "@/redux/slices/ZoneSlice"

interface AjoutCameraProps {
    open: boolean
    setOpen: (open: boolean) => void
}

const formSchema = z.object({
    code: z.string().min(1, "Le code est requis"),
    rtsp_url: z.string(),
    description: z.string().optional(),
    type: z.string().min(1, "Le type est requis"),
    zone: z.any(),
    status: z.enum(["Actif", "En maintenance", "En panne"]),
})

const AjoutCamera: React.FC<AjoutCameraProps> = ({ open, setOpen }) => {
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
            zone: null,
            status: "Actif",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        dispatch(addCamera(values))
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} >

            <DialogContent className="sm:max-w-[600px] bg-white">
                <DialogHeader>
                    <DialogTitle>Ajout camera</DialogTitle>
                    <DialogDescription>
                        Ajoutez une nouvelle camera. Cliquez sur enregistrer pour valider.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
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
                                            <Input placeholder="Entrez le code" {...field} />
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Sélectionner un statut" />
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

                            {/* Type */}
                            <FormField
                                control={form.control}
                                name="zone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Zone</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Sélectionner un zone" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {zones.map((zone, i) => (
                                                    <SelectItem key={i} value={zone.id.toString()}>
                                                        {zone.nom}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Status */}
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Statut</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                            {/* Submit */}
                            <Button type="submit">Enregistrer</Button>
                        </form>
                    </Form>
                </div>

            </DialogContent>

        </Dialog>
    )
}

export default AjoutCamera

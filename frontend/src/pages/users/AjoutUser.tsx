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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/redux/store"
import { addZone } from "@/redux/slices/ZoneSlice"
import { addUsers } from "@/redux/slices/UserSlice"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AjoutUserProps {
    open: boolean
    setOpen: (open: boolean) => void
}

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Le nom d'utilisateur doit avoir au moins 2 caractères.",
    }),
    email: z.email(),
    password: z.string().min(8, {
        message: "Le numero télephone doit avoir au moins 10 chiffres.",
    }),
    telephone: z.string().min(10, {
        message: "Le numero télephone doit avoir au moins 10 chiffres.",
    }),
    first_name: z.string().min(2, {
        message: "Le nom de famille doit avoir au moins 2 caractères.",
    }),
    last_name: z.string().optional(),
    role: z.string().min(2, {
        message: "Le role doit avoir au moins 2 caractères.",
    }),
})

const AjoutUser: React.FC<AjoutUserProps> = ({ open, setOpen }) => {
    const dispatch = useDispatch<AppDispatch>()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            first_name: "",
            last_name: "",
            telephone: "",
            password: "",
            role: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        dispatch(addUsers(values))
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="sm:max-w-[600px] bg-white">
                <DialogHeader>
                    <DialogTitle>Ajout utilisateur</DialogTitle>
                    <DialogDescription>
                        Ajoutez une nouvelle utilisateur. Cliquez sur enregistrer pour valider.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom d'utilisateur</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: rakoto" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: test@test.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="telephone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Télephone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: 034 00 000 00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: RAKOTO" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prénoms</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: test" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rôle</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Sélectionner un role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="admin">Administrateur</SelectItem>
                                                <SelectItem value="quai">Agent de quai</SelectItem>
                                                <SelectItem value="securite">Agent de Sécurité</SelectItem>
                                            </SelectContent>
                                        </Select>
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

export default AjoutUser

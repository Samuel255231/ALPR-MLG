import React from 'react'
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
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/redux/store"
import { resetUserPassword } from '@/redux/slices/UserSlice'

interface ReinitialiserMotPasseProps {
    open: boolean
    setOpen: (open: boolean) => void
    userId: number
}

const formSchema = z.object({
    password: z.string().min(6, {
        message: "Le mot de passe doit avoir au moins 6 caractères.",
    }),
    password1: z.string().min(6, {
        message: "Le mot de passe doit avoir au moins 6 caractères.",
    }),
}).refine((data) => data.password === data.password1, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password1"],
})

const ReinitialiserMotPasse: React.FC<ReinitialiserMotPasseProps> = ({ open, setOpen, userId }) => {
    const dispatch = useDispatch<AppDispatch>()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            password1: "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        dispatch(resetUserPassword({ userId, new_password:values.password,password1:values.password1 }))
        setOpen(false)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
                    <DialogDescription>
                        Saisissez un nouveau mot de passe et confirmez-le pour l'utilisateur sélectionné.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Nouveau mot de passe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmation mot de passe</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Confirmez le mot de passe" {...field} />
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

export default ReinitialiserMotPasse

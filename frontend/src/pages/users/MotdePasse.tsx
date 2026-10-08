import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { AppDispatch } from '@/redux/store'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { updatePassword } from '@/redux/slices/AuthSlice'
import { Eye, EyeOff, Send } from 'lucide-react'


const formSchema = z.object({
    old_password: z.string().min(2, {
        message: "Veuillez saisir ancien mot de passe correct.",
    }),
    password: z.string().min(2, {
        message: "Veuillez mot de passe correct.",
    }),
    password1: z.string().min(2, {
        message: "Veuillez mot de passe correct.",
    })
}).refine((data) => data.password === data.password1, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["password1"],
})

const MotdePasse: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const dispatch = useDispatch<AppDispatch>()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            old_password: "",
            password: "",
            password1: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        const resultAction = await dispatch(updatePassword(values));
        if (updatePassword.fulfilled.match(resultAction)) {
            form.reset();
        }
        setLoading(false)
    }

    const PasswordInput = ({
        field,
        label,
        visible,
        toggleVisible,
    }: {
        field: React.ComponentProps<typeof Input>
        label: string
        visible: boolean
        toggleVisible: () => void
    }) => (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="relative">
                <FormControl>
                    <Input
                        type={visible ? 'text' : 'password'}
                        {...field}
                        className="pr-10"
                    />
                </FormControl>
                <button
                    type="button"
                    onClick={toggleVisible}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            <FormMessage />
        </FormItem>
    )
    return (

        <div className='p-4 space-y-6'>
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Changement mot de passe</h2>
                <p className="text-gray-600">Veuillez sécuriser votre compte en choisissant un mot de passe très sécurisé.</p>
            </div>
            <Card className='p-4'>
                <div className="grid gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                            <FormField
                                control={form.control}
                                name="old_password"
                                render={({ field }) => (
                                    <PasswordInput
                                        field={field}
                                        label="Ancien mot de passe"
                                        visible={showOld}
                                        toggleVisible={() => setShowOld(!showOld)}
                                    />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <PasswordInput
                                        field={field}
                                        label="Nouveau mot de passe"
                                        visible={showNew}
                                        toggleVisible={() => setShowNew(!showNew)}
                                    />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password1"
                                render={({ field }) => (
                                    <PasswordInput
                                        field={field}
                                        label="Confirmation du mot de passe"
                                        visible={showConfirm}
                                        toggleVisible={() => setShowConfirm(!showConfirm)}
                                    />
                                )}
                            />
                            <Button variant='outline' type="submit" className='bg-green-500'>
                                <Send />
                                <span className="hidden lg:inline">{loading ? 'Modification...' : 'Modifier'}</span>
                            </Button>
                        </form>
                    </Form>
                </div>
            </Card>
        </div>

    )
}

export default MotdePasse
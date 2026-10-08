import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { RootState } from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'

const Compte: React.FC = () => {
    const { userToken } = useSelector((state: RootState) => state.auth)
    const fullname =`${userToken?.user?.first_name} ${userToken?.user?.last_name}`
    const username =userToken?.user?.username
    const email =userToken?.user?.email
    const telephone =userToken?.user?.telephone
    const role =userToken?.user?.role
    return (
        <div className='p-4 space-y-6'>
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Mes comptes</h2>
                <p className="text-gray-600">Mes informtions et le droit d'accès</p>
            </div>
            <Card className='p-4'>
                <div className="grid w-full items-center gap-3">
                    <Label htmlFor="email">Nom et prénom(s)</Label>
                    <Input type="text"  value={fullname} disabled />
                </div>
                <div className="grid w-full items-center gap-3">
                    <Label htmlFor="email">Nom d'utilisateur</Label>
                    <Input type="text" value={username} disabled />
                </div>
                <div className="grid w-full items-center gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input type="text" value={email} disabled />
                </div>
                <div className="grid w-full items-center gap-3">
                    <Label htmlFor="email">Télephone</Label>
                    <Input type="text" value={telephone} disabled />
                </div>
                <div className="grid w-full items-center gap-3">
                    <Label htmlFor="email">Rôle</Label>
                    <Input type="text" value={role} disabled />
                </div>
            </Card>
        </div>
    )
}

export default Compte
import { Card } from '@/components/ui/card'
import { fetchUsers } from '@/redux/slices/UserSlice'
import type { AppDispatch, RootState } from '@/redux/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataTable } from './data-table'
import { colonneUser } from './colonne'

const User:React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
    const { users } = useSelector((state: RootState) => state.users)
    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])
    return (
        <div className='p-4 space-y-6'>
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestion d'utilisateur</h2>
                <p className="text-gray-600">Droit d'accès chaque utilisateur connecté au système</p>
            </div>
            <Card>
                <DataTable columns={colonneUser} data={users} />
            </Card>
        </div>
    )
}

export default User
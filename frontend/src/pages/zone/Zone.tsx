import { fetchZones } from '@/redux/slices/ZoneSlice'
import type { AppDispatch, RootState } from '@/redux/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataTable } from './data-table'
import { colonneZone } from './colonne'
import { Card } from '@/components/ui/card'
import { useRole } from '@/hooks/use-role'

const Zone: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { zones } = useSelector((state: RootState) => state.zones)
    const { estAdmin } = useRole()
    // l'opérateur consulte les zones mais ne peut pas les modifier
    const colonnes = estAdmin ? colonneZone : colonneZone.filter((c) => c.id !== "actions")
    useEffect(() => {
        dispatch(fetchZones())
    }, [dispatch])
    return (
        <div className='p-4 space-y-6'>
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Zones de surveillance</h2>
                <p className="text-gray-600">Zones couvertes par les caméras</p>
            </div>
            <Card>
                <DataTable columns={colonnes} data={zones} />
            </Card>
        </div>
    )
}

export default Zone
import { fetchZones } from '@/redux/slices/ZoneSlice'
import type { AppDispatch, RootState } from '@/redux/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataTable } from './data-table'
import { colonneZone } from './colonne'
import { Card } from '@/components/ui/card'

const Zone: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { zones, loading, error } = useSelector((state: RootState) => state.zones)
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
                <DataTable columns={colonneZone} data={zones} />
            </Card>
        </div>
    )
}

export default Zone
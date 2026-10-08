import type { AppDispatch, RootState } from '@/redux/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataTable } from './data-table'
import { colonneCamera } from './colonne'
import { fetchCameras } from '@/redux/slices/CameraSlice'
import { Card } from '@/components/ui/card'

const Camera: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { cameras, loading, error } = useSelector((state: RootState) => state.cameras)
    useEffect(() => {
        dispatch(fetchCameras())
    }, [dispatch])
    return (
        <div className='p-4 space-y-6'>
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Camera de suirveillance</h2>
                <p className="text-gray-600">Suirveillance et detection des bigbags entrée et sortie</p>
            </div>
            <Card>
                <DataTable columns={colonneCamera} data={cameras} />
            </Card>
        </div>
    )
}

export default Camera
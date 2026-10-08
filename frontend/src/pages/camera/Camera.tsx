import type { AppDispatch, RootState } from '@/redux/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataTable } from './data-table'
import { colonneCamera } from './colonne'
import { fetchCameras } from '@/redux/slices/CameraSlice'
import { Card } from '@/components/ui/card'
import { useRole } from '@/hooks/use-role'

const Camera: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { cameras } = useSelector((state: RootState) => state.cameras)
    const { estAdmin } = useRole()
    // l'opérateur consulte les caméras mais ne peut pas les modifier
    const colonnes = estAdmin ? colonneCamera : colonneCamera.filter((c) => c.id !== "actions")
    useEffect(() => {
        dispatch(fetchCameras())
    }, [dispatch])
    return (
        <div className='p-4 space-y-6'>
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Camera de suirveillance</h2>
                <p className="text-gray-600">Surveillance et détection des plaques par caméra</p>
            </div>
            <Card>
                <DataTable columns={colonnes} data={cameras} />
            </Card>
        </div>
    )
}

export default Camera
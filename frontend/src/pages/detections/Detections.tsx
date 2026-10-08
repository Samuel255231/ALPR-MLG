import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { fetchDetections } from "@/redux/slices/DetectionSlice"
import { Card } from "@/components/ui/card"
import { DataTable } from "./data-table"

function Detections() {
    const dispatch = useDispatch<AppDispatch>()
    const { items, loading, error } = useSelector((state: RootState) => state.detections)

    useEffect(() => {
        dispatch(fetchDetections())
    }, [dispatch])

    return (
        <div className="p-4 space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Historique des détections</h2>
                <p className="text-gray-600">Plaques détectées par le système ALPR</p>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <Card>
                {loading ? (
                    <p className="p-4 text-gray-500">Chargement en cours...</p>
                ) : (
                    <DataTable data={items} />
                )}
            </Card>
        </div>
    )
}

export default Detections

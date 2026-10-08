import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { fetchMouvements } from "@/redux/slices/MouvementSlice"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DataTable } from "./data-table"
import { colonneMouvement } from "./MouvementColumns"

function Mouvement() {
  const dispatch = useDispatch<AppDispatch>()

  // Récupérer le state depuis Redux
  const { items, loading, error } = useSelector((state: RootState) => state.mouvements)

  useEffect(() => {
    dispatch(fetchMouvements())
  }, [dispatch])

  return (
    <div className='p-4 space-y-6'>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mouvements de BigBags</h2>
        <p className="text-gray-600">Historique des entrées et sorties</p>
      </div>
      <Card>
        <DataTable columns={colonneMouvement} data={items} />
      </Card>
    </div>
  )
}

export default Mouvement

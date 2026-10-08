//src\components\section-cards.tsx
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { useEffect } from "react"
import { fetchALPRTotals } from "@/redux/slices/DahsboardSlice"
import StatCard from "./stat-card"
import { Eye, CheckCircle, Fingerprint, AlertTriangle } from "lucide-react"
export function SectionCards() {
  const dispatch = useDispatch<AppDispatch>()
  // ICI : ON RECUPERE totals, loading, error
  const { totals, loading, error } = useSelector(
    (state: RootState) => state.alprTotal
  )
  useEffect(() => {
    dispatch(fetchALPRTotals())
  }, [dispatch])
  if (loading) {
      return <div className="text-center text-gray-500">Chargement...</div>
  }
  if (error) {
     return <div className="text-center text-red-500">Erreur : {error}</div>
    }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Plaques détectées" value={totals.detectees} icon={Eye} color="blue" />
      <StatCard title="Plaques reconnues" value={totals.reconnues} icon={CheckCircle} color="green" />
      <StatCard title="Plaques uniques" value={totals.uniques} icon={Fingerprint} color="purple" />
      <StatCard title="Alertes / Non reconnues" value={totals.non_reconnues} icon={AlertTriangle} color="red" />

    </div>
  )
}

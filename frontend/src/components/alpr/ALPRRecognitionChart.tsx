// src/components/alpr/ALPRRecognitionChart.tsx
"use client"
import * as React from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

// Définir les couleurs comme constantes pour éviter le style inline
const COLORS = {
  RECONNUES: "#10b981",
  NON_RECONNUES: "#ef4444",
  ALERTES: "#f59e0b"
}

type RecognitionData = {
  name: string
  value: number
  color: string
  percentage: number
}

export default function ALPRRecognitionChart() {
  const [data, setData] = React.useState<RecognitionData[]>([])
  const [total, setTotal] = React.useState(0)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/alpr/dashboard/recognition-stats/`)
        const json = await res.json()
        
        const totalPlaques = json.total || 1
        const chartData: RecognitionData[] = [
          {
            name: "Reconnues",
            value: json.reconnues,
            color: COLORS.RECONNUES,
            percentage: json.pourcentage_reconnues || 0
          },
          {
            name: "Non reconnues",
            value: json.non_reconnues,
            color: COLORS.NON_RECONNUES,
            percentage: json.pourcentage_non_reconnues || 0
          },
          {
            name: "Alertes",
            value: json.alertes,
            color: COLORS.ALERTES,
            percentage: json.pourcentage_alertes || 0
          }
        ]
        
        setData(chartData.filter(item => item.value > 0))
        setTotal(totalPlaques)
      } catch (error) {
        console.error("Erreur fetch recognition stats:", error)
      }
    }
    fetchData()
  }, [])

  // Données mockées pour le design
  const displayData = data.length > 0 ? data : [
    { name: "Reconnues", value: 75, color: COLORS.RECONNUES, percentage: 75 },
    { name: "Non reconnues", value: 15, color: COLORS.NON_RECONNUES, percentage: 15 },
    { name: "Alertes", value: 10, color: COLORS.ALERTES, percentage: 10 }
  ]

  const totalDisplay = total > 0 ? total : 100

  // Fonction pour obtenir la classe CSS par couleur
  const getColorClass = (color: string) => {
    switch(color) {
      case COLORS.RECONNUES: return "bg-green-500"
      case COLORS.NON_RECONNUES: return "bg-red-500"
      case COLORS.ALERTES: return "bg-orange-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Répartition des plaques</CardTitle>
        <CardDescription className="text-sm">
          Ratio reconnues / non reconnues / alertes
        </CardDescription>
      </CardHeader>

      <CardContent className="p-3 pt-0">
        <div className="flex flex-col lg:flex-row items-center h-full">
          {/* Graphique - Prend plus d'espace */}
          <div className="w-full lg:w-2/3 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={(entry: RecognitionData) => `${entry.percentage}%`}
                >
                  {displayData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => {
                     return [`${value} plaques`, name];
                  }}
                  contentStyle={{ fontSize: 12, borderRadius: '6px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Légende simple - Prend moins d'espace */}
          <div className="w-full lg:w-1/3 mt-4 lg:mt-0 lg:pl-4">
            <div className="space-y-2">
              {displayData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-3 h-3 rounded-full ${getColorClass(item.color)}`}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">{item.value}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-100 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-sm font-bold">{totalDisplay}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
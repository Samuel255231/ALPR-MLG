// src/components/alpr/ALPRBarChart.tsx
"use client"
import * as React from "react"
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, YAxis } from "recharts"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

type TopPlate = {
  plaque: string
  detections: number
  reconnues: number
  taux_reconnaissance: number
}

export default function ALPRBarChart() {
  const [data, setData] = React.useState<TopPlate[]>([])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/alpr/dashboard/top-plates/`)
        const json: TopPlate[] = await res.json()
        setData(json)
      } catch (error) {
        console.error("Erreur fetch top plates:", error)
      }
    }
    fetchData()
  }, [])

  const filteredData = React.useMemo(() => {
    return data.slice(0, 10)
  }, [data])

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Top 10 plaques</CardTitle>
        <CardDescription className="text-sm">
          Plaques les plus détectées
        </CardDescription>
      </CardHeader>

      <CardContent className="p-3 pt-0">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={filteredData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="2 2" horizontal={true} vertical={false} stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              type="category" 
              dataKey="plaque" 
              width={55}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "detections") return [value, "Détections"]
                if (name === "reconnues") return [value, "Reconnues"]
                return [value, name]
              }}
              labelStyle={{ fontSize: 12, fontWeight: 'bold' }}
              contentStyle={{ fontSize: 12, borderRadius: '6px' }}
            />
            <Bar 
              dataKey="detections" 
              name="Total"
              fill="#3b82f6"
              radius={[0, 3, 3, 0]}
              barSize={16}
            />
            <Bar 
              dataKey="reconnues" 
              name="Reconnues"
              fill="#10b981"
              radius={[0, 3, 3, 0]}
              barSize={16}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
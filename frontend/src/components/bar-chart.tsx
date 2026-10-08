//src\components\bar-chart.tsx
"use client"
import * as React from "react"
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
type Mouvement = {
    camera: string
    type: "entree" | "sortie"
    quantite: number
}
// Transforme le format backend en format Recharts {camera, entree, sortie}
const transformData = (data: Mouvement[]) => {
    const grouped: Record<string, { camera: string; entree: number; sortie: number }> = {}
    data.forEach((item) => {
        if (!grouped[item.camera]) grouped[item.camera] = { camera: item.camera, entree: 0, sortie: 0 }
        if (item.type === "entree") grouped[item.camera].entree = item.quantite
        if (item.type === "sortie") grouped[item.camera].sortie = item.quantite
    })
    return Object.values(grouped)
}

export default function CameraBarChart() {
    const [timeRange, setTimeRange] = React.useState("90d")
    const [data, setData] = React.useState<Mouvement[]>([])

    // Fetch depuis ton API Django selon le range
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8000/mouvements/camera_stats/?range=${timeRange}`)
                const json: Mouvement[] = await res.json()
                setData(json)
            } catch (error) {
                console.error("Erreur fetch mouvements:", error)
            }
        }
        fetchData()
    }, [timeRange])

    const chartData = React.useMemo(() => transformData(data), [data])

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Mouvements par Caméra</CardTitle>
                <CardDescription>
                    {timeRange === "90d" ? "3 derniers mois" : timeRange === "30d" ? "30 derniers jours" : "7 derniers jours"}
                </CardDescription>
                <CardAction>
                    <ToggleGroup type="single" value={timeRange} onValueChange={setTimeRange} variant="outline" className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex">
                        <ToggleGroupItem value="90d">3 derniers mois</ToggleGroupItem>
                        <ToggleGroupItem value="30d">30 derniers jours</ToggleGroupItem>
                        <ToggleGroupItem value="7d">7 derniers jours</ToggleGroupItem>
                    </ToggleGroup>

                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="flex w-40 @[767px]/card:hidden" size="sm">
                            <SelectValue placeholder="3 derniers mois" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d">3 mois</SelectItem>
                            <SelectItem value="30d">30 jours</SelectItem>
                            <SelectItem value="7d">7 jours</SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>

            <CardContent className="px-2 pt-4  sm:px-6 sm:pt-6">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="camera" />
                        <Tooltip />
                        <Bar dataKey="entree" fill="green" />
                        <Bar dataKey="sortie" fill="red" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

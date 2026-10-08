//src\components\chart-area-interactive.tsx
"use client"
import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
// Données mock (à remplacer par ton API Django)
type ChartDataItem = {
  date: string
  entree: number
  sortie: number
}
const chartConfig = {
  entree: { label: "Entrée", color: "green" },
  sortie: { label: "Sortie", color: "red" },
}
export default function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartData, setChartData] = React.useState<ChartDataItem[]>([])
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/alpr/chart_data/`)
        if (!res.ok) throw new Error("Erreur fetch API")
        const data: ChartDataItem[] = await res.json()
        setChartData(data)
      } catch (error) {
        console.error("Erreur récupération des données:", error)
      }
    }
    fetchData()
  }, [])
  const filteredData = React.useMemo(() => {
    const referenceDate = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    if (timeRange === "7d") daysToSubtract = 7

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return chartData.filter((item) => new Date(item.date) >= startDate)
  }, [chartData,timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Stock Entrée / Sortie</CardTitle>
        <CardDescription>
          {timeRange === "90d"
            ? "Total pour les 3 derniers mois"
            : timeRange === "30d"
              ? "Total pour les 30 derniers jours"
              : "Total pour les 7 derniers jours"}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">3 derniers mois</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 derniers jours</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 derniers jours</ToggleGroupItem>
          </ToggleGroup>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="flex w-40 @[767px]/card:hidden" size="sm">
              <SelectValue placeholder="3 derniers mois" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d">3 derniers mois</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="7d">7 derniers jours</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillEntree" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="green" stopOpacity={0.8} />
                <stop offset="95%" stopColor="green" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillSortie" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="red" stopOpacity={0.8} />
                <stop offset="95%" stopColor="red" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                  }
                  indicator="dot"
                />
              }
            />
            <Area dataKey="sortie" type="natural" fill="url(#fillSortie)" stroke="red" stackId="a" />
            <Area dataKey="entree" type="natural" fill="url(#fillEntree)" stroke="green" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

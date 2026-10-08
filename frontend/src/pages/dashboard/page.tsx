// src/pages/dashboard/page.tsx
import { SectionCards } from "@/components/section-cards"
import ALPRChartArea from "@/components/alpr/ALPRChartArea"
import ALPRBarChart from "@/components/alpr/ALPRBarChart"
import ALPRRecognitionChart from "@/components/alpr/ALPRRecognitionChart"

export default function Page() {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 py-6">
      {/* ✅ 4 CARTES ALPR */}
      <SectionCards />

      {/* 📈 ÉVOLUTION DES DÉTECTIONS (pleine largeur) */}
      <div className="w-full">
        <ALPRChartArea />
      </div>

      {/* 📊 DEUX GRAPHIQUES CÔTE À CÔTE */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Top 10 plaques - 40% */}
        <div className="lg:col-span-2">
          <ALPRBarChart />
        </div>
        
        {/* Répartition - 60% */}
        <div className="lg:col-span-3">
          <ALPRRecognitionChart />
        </div>
      </div>
    </div>
  )
}
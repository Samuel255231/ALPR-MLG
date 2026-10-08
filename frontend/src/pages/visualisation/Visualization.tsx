import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'

function Visualization() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-muted-foreground">
                Date début
              </label>
              <input
                type="date"
                className="mt-1 rounded-md border px-2 py-1 text-sm shadow-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-muted-foreground">
                Date fin
              </label>
              <input
                type="date"
                className="mt-1 rounded-md border px-2 py-1 text-sm shadow-sm"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Ton contenu principal ici */}
        </CardContent>
      </Card>
    </div>

  )
}

export default Visualization
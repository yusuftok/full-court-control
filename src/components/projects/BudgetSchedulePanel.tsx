'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { NodeSumsMap } from '@/lib/project-analytics'

export interface BudgetSchedulePanelProps {
  rootNodeId: string
  sums: NodeSumsMap
}

export function BudgetSchedulePanel({
  rootNodeId,
  sums,
}: BudgetSchedulePanelProps) {
  const s = sums.get(rootNodeId) || { ev: 0, ac: 0, pv: 0 }
  const cpi = s.ac > 0 ? s.ev / s.ac : 0
  const spi = s.pv > 0 ? s.ev / s.pv : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Bütçe (CPI)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{cpi.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">EV/AC</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Takvim (SPI)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{spi.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">EV/PV</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>PV/EV/AC</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            PV: {s.pv.toFixed(0)}
          </div>
          <div className="text-sm text-muted-foreground">
            EV: {s.ev.toFixed(0)}
          </div>
          <div className="text-sm text-muted-foreground">
            AC: {s.ac.toFixed(0)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

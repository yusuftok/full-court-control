'use client'

import * as React from 'react'
import type {
  SubcontractorId,
  OwnerAggregate,
  OwnerIssueSummary,
} from '@/lib/project-analytics'
import { SubcontractorCard } from '@/components/projects/subcontractor-card'

type Responsibility = { id: string; name: string }

export interface SubRow {
  id: SubcontractorId
  name: string
  aggregate: OwnerAggregate
  issues?: OwnerIssueSummary
  responsibilities?: Responsibility[]
  progressPct?: number
  plannedStart?: string
  plannedEnd?: string
  forecastFinish?: string
  allDone?: boolean
}

export interface SubcontractorsTabProps {
  rows: SubRow[]
  onSelect?: (id: SubcontractorId) => void
}

export function SubcontractorsTab({ rows, onSelect }: SubcontractorsTabProps) {
  // No filters/sorting/search; direct card grid as requested
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {rows.map((r, i) => (
        <SubcontractorCard
          key={r.id}
          name={r.name}
          aggregate={r.aggregate}
          issues={r.issues}
          responsibilities={r.responsibilities}
          index={i}
          plannedStart={r.plannedStart}
          plannedEnd={r.plannedEnd}
          forecastFinish={r.forecastFinish}
          allDone={r.allDone}
          onClick={() => onSelect?.(r.id)}
        />
      ))}
    </div>
  )
}

'use client'

import * as React from 'react'
import { DataTable, Column } from '@/components/data/data-table'
import type { Issue, OwnershipMap } from '@/lib/project-analytics'

export interface IssueListProps {
  issues: Issue[]
  ownership: OwnershipMap
  mode?: 'owner' | 'wbs'
  filterOwnerId?: string | null
}

export function IssueList({
  issues,
  ownership,
  mode = 'owner',
  filterOwnerId,
}: IssueListProps) {
  const rows = React.useMemo(() => {
    return issues
      .map(i => ({
        ...i,
        ownerResolved: i.subcontractorId ?? ownership.get(i.nodeId) ?? null,
      }))
      .filter(i =>
        mode === 'owner' && filterOwnerId
          ? i.ownerResolved === filterOwnerId
          : true
      )
  }, [issues, ownership, mode, filterOwnerId])

  const cols: Column<(typeof rows)[number]>[] = [
    { id: 'type', header: 'Tür', accessor: 'type' },
    { id: 'node', header: 'Düğüm', accessor: 'nodeId' },
    {
      id: 'owner',
      header: 'Taşeron',
      accessor: row => row.ownerResolved ?? '-',
    },
    { id: 'sev', header: 'Öncelik', accessor: row => row.severity ?? '-' },
    {
      id: 'late',
      header: 'Gecikme (gün)',
      accessor: row => row.daysLate ?? '-',
    },
    { id: 'cost', header: 'Aşım (₺)', accessor: row => row.costOver ?? '-' },
  ]

  return (
    <DataTable data={rows} columns={cols} emptyMessage="Sorun bulunamadı" />
  )
}

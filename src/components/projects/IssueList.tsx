'use client'

import * as React from 'react'
import { DataTable, Column } from '@/components/data/data-table'
import type { Issue, OwnershipMap } from '@/lib/project-analytics'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('projectDetail')
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
    { id: 'type', header: t('table.type'), accessor: 'type' },
    { id: 'node', header: t('table.node'), accessor: 'nodeId' },
    {
      id: 'owner',
      header: t('table.owner'),
      accessor: row => row.ownerResolved ?? '-',
    },
    {
      id: 'sev',
      header: t('table.severity'),
      accessor: row => row.severity ?? '-',
    },
    {
      id: 'late',
      header: t('table.delayDays'),
      accessor: row => row.daysLate ?? '-',
    },
    {
      id: 'cost',
      header: t('table.costOver'),
      accessor: row => row.costOver ?? '-',
    },
  ]

  return (
    <DataTable data={rows} columns={cols} emptyMessage={t('empty.issues')} />
  )
}

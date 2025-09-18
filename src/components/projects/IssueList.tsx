'use client'

import * as React from 'react'

import { DataTable, Column } from '@/components/data/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Issue, IssueStatus, OwnershipMap } from '@/lib/project-analytics'
import { WbsPathTooltip } from '@/components/projects/wbs-path-tooltip'
import { useTranslations } from 'next-intl'

const ALL = 'all'

export interface IssueListProps {
  issues: Issue[]
  ownership: OwnershipMap
  mode?: 'owner' | 'wbs'
  filterOwnerId?: string | null
  ownerNameFor?: (id: string | null | undefined) => string | undefined
  wbsPath?: {
    pathLabels: (id: string) => { short: string; full: string }
    asciiPath: (id: string) => string
    labelFor: (id: string) => string
    pathIds: (id: string) => string[]
    descendantsOf: (id: string) => string[]
  }
}

interface TableRow {
  id: string
  issue: Issue
  ownerResolved: string | null
  ownerLabel: string | undefined
  responsibleValue: string | null
  responsibleLabel: string
  responsibleLabelLower: string
  reporterValue: string | null
  reporterLabel: string
  reporterLabelLower: string
  statusLabel: string
  typeLabel: string
  workItemShort: string | null
  workItemFull: string | null
  workItemAscii: string | null
  workItemId: string | null
  workItemShortLower: string | null
  workItemFullLower: string | null
  pathLabelsLower: string[]
}

export function IssueList({
  issues,
  ownership,
  mode = 'owner',
  filterOwnerId,
  ownerNameFor,
  wbsPath,
}: IssueListProps) {
  const t = useTranslations('projectDetail')

  const filtersInitial = React.useMemo(
    () => ({
      type: ALL,
      status: ALL,
      workItemQuery: '',
      responsibleQuery: '',
      subcontractor: ALL,
      reporterQuery: '',
    }),
    []
  )

  const [filters, setFilters] = React.useState(filtersInitial)

  const allLabel = t('issues.filters.placeholder')
  const noWorkItemLabel = t('issues.filters.unassignedWorkItem')
  const clearLabel = t('issues.filters.clear')

  const translateStatus = React.useCallback(
    (status?: IssueStatus) => {
      if (!status) return '-'
      return t(`issues.status.${status}` as const)
    },
    [t]
  )

  const translateType = React.useCallback(
    (type: Issue['type']) => t(`issues.types.${type}` as const),
    [t]
  )

  const rows = React.useMemo<TableRow[]>(() => {
    return issues.map(issue => {
      const ownerResolved =
        issue.subcontractorId ?? ownership.get(issue.nodeId) ?? null
      const ownerLabel = ownerResolved
        ? (ownerNameFor?.(ownerResolved) ?? ownerResolved)
        : undefined
      const responsibleValue =
        issue.responsibleId ?? issue.responsibleName ?? null
      const responsibleLabel = issue.responsibleName ?? responsibleValue ?? '-'
      const reporterValue = issue.reportedById ?? issue.reportedBy ?? null
      const reporterLabel = issue.reportedBy ?? reporterValue ?? '-'
      const responsibleLabelLower = responsibleLabel.toLowerCase()
      const reporterLabelLower = reporterLabel.toLowerCase()
      const statusLabel = translateStatus(issue.status)
      const typeLabel = translateType(issue.type)

      const workItemId = issue.nodeId?.trim() ? issue.nodeId : null
      let workItemShort: string | null = null
      let workItemFull: string | null = null
      let workItemAscii: string | null = null
      let workItemShortLower: string | null = null
      let workItemFullLower: string | null = null
      let pathLabelsLower: string[] = []
      if (workItemId && wbsPath) {
        const labels = wbsPath.pathLabels(workItemId)
        workItemShort = labels.short
        workItemFull = labels.full
        workItemAscii = wbsPath.asciiPath(workItemId)
        workItemShortLower = labels.short.toLowerCase()
        workItemFullLower = labels.full.toLowerCase()
        pathLabelsLower = wbsPath
          .pathIds(workItemId)
          .map(id => wbsPath.labelFor(id).toLowerCase())
      }

      if (!workItemId && wbsPath) {
        workItemShort = null
        workItemFull = null
        workItemAscii = null
      }

      return {
        id: issue.id,
        issue,
        ownerResolved,
        ownerLabel,
        responsibleValue,
        responsibleLabel,
        responsibleLabelLower,
        reporterValue,
        reporterLabel,
        reporterLabelLower,
        statusLabel,
        typeLabel,
        workItemShort,
        workItemFull,
        workItemAscii,
        workItemId,
        workItemShortLower,
        workItemFullLower,
        pathLabelsLower,
      }
    })
  }, [issues, ownership, ownerNameFor, translateStatus, translateType, wbsPath])

  const subcontractorOptions = React.useMemo(() => {
    const map = new Map<string, string>()
    rows.forEach(row => {
      if (!row.ownerResolved) return
      const key = row.ownerResolved
      if (!map.has(key)) {
        map.set(key, row.ownerLabel ?? key)
      }
    })
    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, 'tr'))
  }, [rows])

  const statusOptions = React.useMemo(() => {
    const set = new Set<IssueStatus>()
    rows.forEach(row => {
      const status = row.issue.status
      if (status) set.add(status)
    })
    return Array.from(set)
      .map(value => ({ value, label: translateStatus(value) }))
      .sort((a, b) => a.label.localeCompare(b.label, 'tr'))
  }, [rows, translateStatus])

  const typeOptions = React.useMemo(
    () =>
      Array.from(new Set(issues.map(issue => issue.type)))
        .map(value => ({ value, label: translateType(value) }))
        .sort((a, b) => a.label.localeCompare(b.label, 'tr')),
    [issues, translateType]
  )

  const filteredRows = React.useMemo(() => {
    const responsibleQuery = filters.responsibleQuery.trim().toLowerCase()
    const reporterQuery = filters.reporterQuery.trim().toLowerCase()
    const workItemQuery = filters.workItemQuery.trim().toLowerCase()
    const noWorkItemLabelLower = noWorkItemLabel.toLowerCase()
    return rows.filter(row => {
      if (mode === 'owner' && filterOwnerId) {
        if (row.ownerResolved !== filterOwnerId) {
          return false
        }
      }

      if (filters.type !== ALL && row.issue.type !== filters.type) {
        return false
      }

      if (filters.status !== ALL && row.issue.status !== filters.status) {
        return false
      }

      if (
        filters.subcontractor !== ALL &&
        row.ownerResolved !== filters.subcontractor
      ) {
        return false
      }

      if (
        responsibleQuery &&
        !row.responsibleLabelLower.includes(responsibleQuery)
      ) {
        return false
      }

      if (reporterQuery && !row.reporterLabelLower.includes(reporterQuery)) {
        return false
      }

      if (workItemQuery) {
        if (!row.workItemId) {
          if (!noWorkItemLabelLower.includes(workItemQuery)) return false
        } else {
          const matches =
            (row.workItemFullLower?.includes(workItemQuery) ?? false) ||
            (row.workItemShortLower?.includes(workItemQuery) ?? false) ||
            row.workItemId.toLowerCase().includes(workItemQuery) ||
            row.pathLabelsLower.some(label => label.includes(workItemQuery))
          if (!matches) return false
        }
      }

      return true
    })
  }, [rows, filters, mode, filterOwnerId, noWorkItemLabel])

  const statusBadgeClass = React.useCallback((status?: IssueStatus) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'in-progress':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'resolved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'closed':
        return 'bg-slate-100 text-slate-700 border-slate-200'
      case 'on-hold':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-muted text-muted-foreground border-border/60'
    }
  }, [])

  const columns = React.useMemo<Column<TableRow>[]>(() => {
    return [
      {
        id: 'type',
        header: t('issues.columns.type'),
        accessor: row => row.typeLabel,
      },
      {
        id: 'status',
        header: t('issues.columns.status'),
        accessor: row => (
          <Badge
            variant="outline"
            className={statusBadgeClass(row.issue.status)}
          >
            {row.statusLabel}
          </Badge>
        ),
      },
      {
        id: 'workItem',
        header: t('issues.columns.workItem'),
        accessor: row => {
          if (!row.workItemId) {
            return <span>{noWorkItemLabel}</span>
          }
          if (!row.workItemAscii || !row.workItemFull || !row.workItemShort) {
            return <span>{row.workItemId}</span>
          }
          return (
            <WbsPathTooltip ascii={row.workItemAscii} label={row.workItemFull}>
              <span className="cursor-help truncate text-foreground/90">
                {row.workItemShort}
              </span>
            </WbsPathTooltip>
          )
        },
      },
      {
        id: 'responsible',
        header: t('issues.columns.responsible'),
        accessor: row => row.responsibleLabel,
      },
      {
        id: 'subcontractor',
        header: t('issues.columns.subcontractor'),
        accessor: row => row.ownerLabel ?? '-',
      },
      {
        id: 'reporter',
        header: t('issues.columns.reporter'),
        accessor: row => row.reporterLabel,
      },
    ]
  }, [t, statusBadgeClass, noWorkItemLabel])

  const filtersActive = React.useMemo(() => {
    return (
      filters.type !== ALL ||
      filters.status !== ALL ||
      filters.workItemQuery.trim() !== '' ||
      filters.responsibleQuery.trim() !== '' ||
      filters.subcontractor !== ALL ||
      filters.reporterQuery.trim() !== ''
    )
  }, [filters])

  const resetFilters = React.useCallback(() => {
    setFilters(filtersInitial)
  }, [filtersInitial])

  const renderSelect = (
    value: string,
    onChange: (next: string) => void,
    label: string,
    options: Array<{ value: string; label: string }>,
    widthClass = 'w-44'
  ) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={widthClass} aria-label={label}>
          <SelectValue placeholder={allLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {renderSelect(
          filters.type,
          value => setFilters(prev => ({ ...prev, type: value })),
          t('issues.filters.type'),
          typeOptions,
          'w-40'
        )}
        {renderSelect(
          filters.status,
          value => setFilters(prev => ({ ...prev, status: value })),
          t('issues.filters.status'),
          statusOptions,
          'w-40'
        )}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {t('issues.filters.workItem')}
          </span>
          <Input
            value={filters.workItemQuery}
            onChange={e =>
              setFilters(prev => ({ ...prev, workItemQuery: e.target.value }))
            }
            placeholder={allLabel}
            className="w-72"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {t('issues.filters.responsible')}
          </span>
          <Input
            value={filters.responsibleQuery}
            onChange={e =>
              setFilters(prev => ({
                ...prev,
                responsibleQuery: e.target.value,
              }))
            }
            placeholder={allLabel}
            className="w-44"
          />
        </div>
        {renderSelect(
          filters.subcontractor,
          value => setFilters(prev => ({ ...prev, subcontractor: value })),
          t('issues.filters.subcontractor'),
          subcontractorOptions
        )}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {t('issues.filters.reporter')}
          </span>
          <Input
            value={filters.reporterQuery}
            onChange={e =>
              setFilters(prev => ({ ...prev, reporterQuery: e.target.value }))
            }
            placeholder={allLabel}
            className="w-40"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          disabled={!filtersActive}
        >
          {clearLabel}
        </Button>
      </div>

      <DataTable
        data={filteredRows}
        columns={columns}
        rowKey="id"
        emptyMessage={t('empty.issues')}
      />
    </div>
  )
}

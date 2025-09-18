'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { OwnershipMap, WbsNode } from '@/lib/project-analytics'
import type { Health } from '@/lib/project-analytics'
import type { WbsScheduleEntry } from '@/lib/mock-data'
import { flattenVisible, type FlatRow } from '@/lib/wbs-utils'
import { cn } from '@/lib/utils'

type VirtuosoCmp = React.ComponentType<{
  totalCount: number
  itemContent: (index: number) => React.ReactNode
  overscan?: number
  style?: React.CSSProperties
}>

const statusConfig: Record<
  WbsScheduleEntry['status'],
  { label: string; className: string }
> = {
  'not-started': {
    label: 'Başlamadı',
    className: 'bg-slate-100 text-slate-700 ring-slate-200/80',
  },
  'in-progress': {
    label: 'Başladı',
    className: 'bg-blue-100 text-blue-700 ring-blue-200/70',
  },
  completed: {
    label: 'Bitti',
    className: 'bg-emerald-100 text-emerald-700 ring-emerald-200/70',
  },
}

const healthTokens: Record<
  Health['level'],
  { className: string; label: string; sub: (value: number) => string }
> = {
  good: {
    className: 'bg-emerald-100 text-emerald-700 ring-emerald-200/70',
    label: 'İyi',
    sub: value => value.toFixed(2),
  },
  risky: {
    className: 'bg-amber-100 text-amber-700 ring-amber-200/70',
    label: 'Riskli',
    sub: value => value.toFixed(2),
  },
  critical: {
    className: 'bg-rose-100 text-rose-700 ring-rose-200/70',
    label: 'Kritik',
    sub: value => value.toFixed(2),
  },
}

const detailThemes: Record<
  'good' | 'risky' | 'critical' | 'base',
  {
    bg: string
    border: string
    accent: string
    chip: string
    value: string
    divider: string
  }
> = {
  good: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    accent: 'text-emerald-800',
    chip: 'bg-white/60 text-emerald-700 ring-emerald-200/70',
    value: 'text-emerald-900',
    divider: 'border-emerald-300/70',
  },
  risky: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    accent: 'text-amber-800',
    chip: 'bg-white/60 text-amber-700 ring-amber-200/70',
    value: 'text-amber-900',
    divider: 'border-amber-300/70',
  },
  critical: {
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    accent: 'text-rose-800',
    chip: 'bg-white/60 text-rose-700 ring-rose-200/70',
    value: 'text-rose-900',
    divider: 'border-rose-300/70',
  },
  base: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    accent: 'text-slate-700',
    chip: 'bg-white/60 text-slate-700 ring-slate-200/80',
    value: 'text-slate-900',
    divider: 'border-slate-300/70',
  },
}

export interface WbsTreePanelProps {
  root: WbsNode
  schedule: Map<string, WbsScheduleEntry>
  nodeHealth: Map<string, Health>
  ownership: OwnershipMap
  selectedNodeId?: string | null
  onSelectNode?: (id: string) => void
  filterOwnerId?: string | null
  searchQuery?: string
  onSearchQueryChange?: (value: string) => void
  ownerNameFor?: (ownerId: string | null | undefined) => string | undefined
  onClearOwnerFilter?: () => void
}

function formatDate(value?: number) {
  if (value == null || Number.isNaN(value)) return '—'
  if (!Number.isFinite(value)) return '—'
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return '—'
  return date.toLocaleDateString('tr-TR', { dateStyle: 'medium' })
}

function formatMetric(value?: number) {
  if (value == null || Number.isNaN(value)) return '—'
  return value.toFixed(2)
}

export function WbsTreePanel({
  root,
  schedule,
  nodeHealth,
  ownership,
  selectedNodeId,
  onSelectNode,
  filterOwnerId,
  searchQuery = '',
  onSearchQueryChange,
  ownerNameFor,
  onClearOwnerFilter,
}: WbsTreePanelProps) {
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const [expanded, setExpanded] = React.useState<Set<string>>(
    () => new Set([root.id])
  )

  React.useEffect(() => {
    setExpanded(new Set([root.id]))
  }, [root.id])

  const toggle = React.useCallback((id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const { nodeById, parentById } = React.useMemo(() => {
    const nodeMap = new Map<string, WbsNode>()
    const parentMap = new Map<string, string | null>()
    const walk = (node: WbsNode, parent: string | null) => {
      nodeMap.set(node.id, node)
      parentMap.set(node.id, parent)
      node.children?.forEach(child => walk(child, node.id))
    }
    walk(root, null)
    return { nodeById: nodeMap, parentById: parentMap }
  }, [root])

  const rows = React.useMemo<FlatRow[]>(() => {
    const forceExpand = normalizedQuery.length > 0
    const expandedSet = forceExpand
      ? (() => {
          const all = new Set<string>()
          const collect = (node: WbsNode) => {
            all.add(node.id)
            node.children?.forEach(collect)
          }
          collect(root)
          return all
        })()
      : expanded
    const base = flattenVisible(
      root,
      expandedSet,
      ownership,
      filterOwnerId ?? null,
      false
    )
    if (!forceExpand) return base
    return base.filter(row => {
      const label = (row.node.name || row.id).toLowerCase()
      return label.includes(normalizedQuery)
    })
  }, [root, expanded, ownership, filterOwnerId, normalizedQuery])

  const [Virtuoso, setVirtuoso] = React.useState<VirtuosoCmp | null>(null)
  React.useEffect(() => {
    let mounted = true
    import('react-virtuoso')
      .then(mod => {
        if (mounted) setVirtuoso(() => mod.Virtuoso as unknown as VirtuosoCmp)
      })
      .catch(() => {
        if (mounted) setVirtuoso(null)
      })
    return () => {
      mounted = false
    }
  }, [])

  const activeId = React.useMemo(() => {
    if (selectedNodeId && schedule.has(selectedNodeId)) return selectedNodeId
    return root.id
  }, [selectedNodeId, schedule, root.id])

  const [focusIndex, setFocusIndex] = React.useState(0)
  React.useEffect(() => {
    if (!activeId) return
    const idx = rows.findIndex(r => r.id === activeId)
    if (idx >= 0) setFocusIndex(idx)
  }, [activeId, rows])

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (rows.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.min(rows.length - 1, focusIndex + 1)
      setFocusIndex(next)
      const id = rows[next]?.id
      if (id) onSelectNode?.(id)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = Math.max(0, focusIndex - 1)
      setFocusIndex(prev)
      const id = rows[prev]?.id
      if (id) onSelectNode?.(id)
    } else if (e.key === 'ArrowRight') {
      const id = rows[focusIndex]?.id
      if (!id) return
      const node = nodeById.get(id)
      if (!node) return
      if (node.children && node.children.length > 0 && !expanded.has(id)) {
        e.preventDefault()
        toggle(id)
      }
    } else if (e.key === 'ArrowLeft') {
      const id = rows[focusIndex]?.id
      if (!id) return
      if (expanded.has(id)) {
        e.preventDefault()
        toggle(id)
      }
    } else if (e.key === 'Enter') {
      const id = rows[focusIndex]?.id
      if (id) onSelectNode?.(id)
    }
  }

  const renderRow = (row: FlatRow, index: number) => {
    const node = row.node
    const entry = schedule.get(row.id)
    const ownerId = ownership.get(row.id)
    const ownerLabel = ownerNameFor?.(ownerId ?? null) ?? ownerId ?? undefined
    const hasChildren = (node.children?.length ?? 0) > 0
    const isExpanded = expanded.has(row.id)
    const isSelected = activeId === row.id
    const status = entry?.status ?? 'not-started'
    const statusBadge = statusConfig[status]
    const h = nodeHealth.get(row.id)
    let healthToken: (typeof healthTokens)[Health['level']] | null = null
    let rowBackground: string | undefined
    if (h) {
      healthToken = healthTokens[h.level]
    }
    return (
      <div
        key={row.id}
        className={cn(
          'px-2 border-b border-slate-200/70',
          index === 0 && 'border-t border-slate-200/70',
          index === rows.length - 1 && 'border-b-0'
        )}
        style={{ paddingLeft: row.depth * 16 }}
      >
        <div
          className={cn(
            'flex items-center gap-2 rounded-md border border-transparent px-2 py-1 text-sm transition-colors',
            isSelected ? 'bg-primary/10 border-primary/40' : 'hover:bg-muted/50'
          )}
          style={undefined}
        >
          {hasChildren ? (
            <button
              type="button"
              className="text-xs w-5"
              onClick={() => toggle(row.id)}
            >
              {isExpanded ? '▾' : '▸'}
            </button>
          ) : (
            <span className="w-5" />
          )}
          <button
            type="button"
            className="flex-1 truncate text-left"
            onClick={() => onSelectNode?.(row.id)}
          >
            {node.name || row.id}
            {ownerLabel && (
              <span className="ml-2 text-xs text-muted-foreground">
                {ownerLabel}
              </span>
            )}
          </button>
          <Badge variant="outline" className={statusBadge.className}>
            {statusBadge.label}
          </Badge>
          {healthToken && h && (
            <Badge
              variant="outline"
              className={cn(
                'inline-flex items-center gap-1 rounded-full border-none px-3 py-1 text-xs font-semibold shadow-sm ring-1 ring-inset',
                healthToken.className
              )}
            >
              <span>{healthToken.label}</span>
              <span className="text-[11px] font-medium opacity-80">
                {healthToken.sub(h.combined)}
              </span>
            </Badge>
          )}
        </div>
      </div>
    )
  }

  const treeContent = rows.length ? (
    rows.map((row, index) => renderRow(row, index))
  ) : (
    <div className="p-6 text-sm text-muted-foreground">
      Eşleşen iş bulunamadı.
    </div>
  )

  const selectedEntry = schedule.get(activeId)
  const selectedNode = nodeById.get(activeId)
  const selectedOwner = ownerNameFor?.(ownership.get(activeId) ?? null)
  const selectedHealth = nodeHealth.get(activeId)

  type DetailToneKey = 'good' | 'risky' | 'critical' | 'base'
  const detailToneKey: DetailToneKey = React.useMemo(() => {
    if (selectedHealth) return selectedHealth.level
    if (!selectedEntry) return 'base'
    if (selectedEntry.status === 'completed') return 'good'
    if (selectedEntry.status === 'not-started' && selectedEntry.blocked)
      return 'critical'
    if (selectedEntry.status === 'not-started' && selectedEntry.blockRisk)
      return 'risky'
    if (selectedEntry.status === 'in-progress') return 'risky'
    return 'base'
  }, [selectedEntry, selectedHealth])

  const detailTheme = detailThemes[detailToneKey]

  const planRows = selectedEntry
    ? [
        {
          label: 'Planlanan Başlangıç',
          value: formatDate(selectedEntry.baselineStart),
        },
        {
          label: 'Planlanan Bitiş',
          value: formatDate(selectedEntry.baselineFinish),
        },
      ]
    : []

  const forecastRows = selectedEntry
    ? [
        {
          label: 'Forecast Başlangıç',
          value: formatDate(selectedEntry.forecastStart),
        },
        {
          label: 'Forecast Bitiş',
          value: formatDate(selectedEntry.forecastFinish),
        },
      ]
    : []

  const actualRows = selectedEntry
    ? [
        {
          label: 'Gerçek Başlangıç',
          value: formatDate(selectedEntry.actualStart),
        },
        {
          label: 'Gerçek Bitiş',
          value: formatDate(selectedEntry.actualFinish),
        },
      ]
    : []

  const performanceRows = selectedEntry
    ? [
        { label: 'CPI', value: formatMetric(selectedHealth?.cpi) },
        { label: 'SPI', value: formatMetric(selectedHealth?.spi) },
      ]
    : []

  const sections = selectedEntry
    ? [
        { key: 'plan', title: 'Plan', rows: planRows },
        { key: 'forecast', title: 'Forecast', rows: forecastRows },
        { key: 'actual', title: 'Gerçek', rows: actualRows },
        { key: 'perf', title: 'Performans', rows: performanceRows },
      ]
    : []

  const predecessorItems = selectedEntry?.predecessors?.map(pid => ({
    id: pid,
    label: nodeById.get(pid)?.name || pid,
  }))

  const buildPath = React.useCallback(
    (id: string): Array<{ id: string; label: string }> => {
      const items: Array<{ id: string; label: string }> = []
      let current: string | null | undefined = id
      while (current) {
        const node = nodeById.get(current)
        if (!node) break
        items.push({ id: node.id, label: node.name || node.id })
        current = parentById.get(current) ?? null
      }
      return items.reverse()
    },
    [nodeById, parentById]
  )

  const pathItems = buildPath(activeId)
  const breadcrumbItems = pathItems.slice(1, -1)
  const breadcrumbText = breadcrumbItems.length
    ? `${breadcrumbItems.map(item => item.label).join(' › ')} ›`
    : ''

  const detailRef = React.useRef<HTMLDivElement | null>(null)
  const [detailHeight, setDetailHeight] = React.useState(520)

  React.useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return
    const node = detailRef.current
    if (!node) return
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const next = Math.max(360, Math.round(entry.contentRect.height))
        setDetailHeight(prev => (Math.abs(prev - next) > 1 ? next : prev))
      }
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const leftColumnStyle = React.useMemo(
    () => ({ minHeight: detailHeight }),
    [detailHeight]
  )

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
      <div className="flex flex-col min-h-0" style={leftColumnStyle}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <Input
            value={searchQuery}
            onChange={e => onSearchQueryChange?.(e.target.value)}
            placeholder="WBS içinde ara"
            className="w-full"
          />
        </div>
        {filterOwnerId && (
          <div className="mb-3 flex items-center justify-between gap-2 rounded-md border border-dashed bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <span>
              Taşeron filtresi:{' '}
              <span className="font-medium text-foreground">
                {ownerNameFor?.(filterOwnerId) ?? filterOwnerId}
              </span>
            </span>
            {onClearOwnerFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={onClearOwnerFilter}
              >
                Temizle
              </Button>
            )}
          </div>
        )}
        <div
          className="flex-1 border rounded-md outline-none min-h-0"
          tabIndex={0}
          onKeyDown={onKeyDown}
          style={{ minHeight: 0 }}
        >
          {Virtuoso ? (
            rows.length > 0 ? (
              <Virtuoso
                totalCount={rows.length}
                itemContent={(index: number) => renderRow(rows[index]!, index)}
                overscan={12}
                style={{ height: '100%' }}
              />
            ) : (
              <div className="p-6 text-sm text-muted-foreground">
                Eşleşen iş bulunamadı.
              </div>
            )
          ) : (
            <div className="h-full overflow-auto">{treeContent}</div>
          )}
        </div>
      </div>
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border p-5 shadow-sm',
          detailTheme.bg,
          detailTheme.border
        )}
        ref={detailRef}
      >
        <div className="relative space-y-5">
          <div className="space-y-1">
            {breadcrumbText && (
              <p
                className={cn(
                  'text-xs font-medium uppercase tracking-[0.18em] text-slate-500',
                  detailTheme.accent
                )}
              >
                {breadcrumbText}
              </p>
            )}
            <h3 className="text-xl font-semibold text-slate-900">
              {selectedNode?.name || activeId}
            </h3>
            {selectedOwner && (
              <p className="text-sm text-slate-600">{selectedOwner}</p>
            )}
          </div>
          {selectedEntry ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    'rounded-full border-none px-3 py-1 text-xs font-semibold shadow-sm ring-1 ring-inset',
                    statusConfig[selectedEntry.status].className
                  )}
                >
                  {statusConfig[selectedEntry.status].label}
                </Badge>
                {selectedEntry.status === 'in-progress' && selectedHealth && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border-none px-3 py-1 text-xs font-semibold shadow-sm ring-1 ring-inset',
                      healthTokens[selectedHealth.level].className
                    )}
                  >
                    <span>{healthTokens[selectedHealth.level].label}</span>
                    <span className="text-[11px] font-medium opacity-80">
                      {healthTokens[selectedHealth.level].sub(
                        selectedHealth.combined
                      )}
                    </span>
                  </Badge>
                )}
                {selectedEntry.status === 'not-started' && (
                  <>
                    {selectedEntry.blocked && (
                      <Badge
                        variant="outline"
                        className="rounded-full border-none bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm ring-1 ring-inset ring-rose-200/70"
                      >
                        Bloklanmış
                      </Badge>
                    )}
                    {selectedEntry.blockRisk && (
                      <Badge
                        variant="outline"
                        className="rounded-full border-none bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm ring-1 ring-inset ring-amber-200/70"
                      >
                        Bloklanma Riski
                      </Badge>
                    )}
                  </>
                )}
              </div>
              <div className="space-y-3">
                {sections.map(section => (
                  <div
                    key={section.key}
                    className="rounded-xl bg-white/60 p-3 shadow-sm ring-1 ring-white/50"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {section.title}
                    </p>
                    <div className="mt-2 space-y-2">
                      {section.rows.map(row => (
                        <div
                          key={`${section.key}-${row.label}`}
                          className="grid grid-cols-[max-content_1fr_max-content] items-center gap-3 rounded-lg bg-white/70 px-3 py-2 shadow-sm ring-1 ring-white/60"
                        >
                          <span className="text-[13px] font-medium text-slate-600">
                            {row.label}
                          </span>
                          <span
                            className={cn(
                              'h-px w-full border-t border-dashed opacity-70',
                              detailTheme.divider
                            )}
                          />
                          <span
                            className={cn(
                              'text-sm font-semibold',
                              row.value === '—'
                                ? 'text-slate-400'
                                : detailTheme.value
                            )}
                          >
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {predecessorItems && predecessorItems.length > 0 && (
                  <div className="rounded-xl bg-white/60 p-3 shadow-sm ring-1 ring-white/50">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Önkoşullar
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {predecessorItems.map(item => (
                        <span
                          key={item.id}
                          className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-inset ring-white/60"
                        >
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              Bu düğüm için program bilgisi bulunamadı.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

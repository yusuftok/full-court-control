'use client'

import * as React from 'react'
import type { WbsNode, OwnershipMap, Health } from '@/lib/project-analytics'
import { Badge } from '@/components/ui/badge'
import { flattenVisible } from '@/lib/wbs-utils'
type VirtuosoCmp = React.ComponentType<{
  totalCount: number
  itemContent: (index: number) => React.ReactNode
  overscan?: number
  style?: React.CSSProperties
}>

export interface WbsHealthTreeProps {
  root: WbsNode
  ownership: OwnershipMap
  nodeHealth: Map<string, Health>
  onSelectNode?: (id: string) => void
  filterOwnerId?: string | null
  view?: 'contract' | 'leaf'
  selectedNodeId?: string | null
  searchQuery?: string
  overscan?: number
}
const levelClass = (lvl: Health['level']) =>
  (
    ({
      good: 'bg-green-100 text-green-700 border-green-200',
      risky: 'bg-orange-100 text-orange-700 border-orange-200',
      critical: 'bg-red-100 text-red-700 border-red-200',
    }) as const
  )[lvl]

export function WbsHealthTree({
  root,
  ownership,
  nodeHealth,
  onSelectNode,
  filterOwnerId,
  view = 'contract',
  selectedNodeId = null,
  searchQuery = '',
  overscan = 10,
}: WbsHealthTreeProps) {
  const [expanded, setExpanded] = React.useState<Set<string>>(
    new Set([root.id])
  )

  const toggle = React.useCallback((id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const normalizedQuery = (searchQuery || '').trim().toLowerCase()

  const rows = React.useMemo(() => {
    // Hızlı aramada, tüm id'leri expanded kabul et
    const allExpanded = new Set<string>()
    const pushAll = (n: WbsNode) => {
      allExpanded.add(n.id)
      n.children?.forEach(pushAll)
    }
    if (normalizedQuery) pushAll(root)
    const base = flattenVisible(
      root,
      normalizedQuery ? allExpanded : expanded,
      ownership,
      filterOwnerId ?? null,
      view === 'contract'
    )
    if (!normalizedQuery) return base
    const filtered = base.filter(r =>
      (r.node.name || r.id).toLowerCase().includes(normalizedQuery)
    )
    return filtered
  }, [root, expanded, ownership, filterOwnerId, view, normalizedQuery])

  // Dynamically import Virtuoso on client; fallback to simple list if not installed.
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

  const Row = ({ index }: { index: number }) => {
    const r = rows[index]
    const owner = ownership.get(r.id)
    const h = nodeHealth.get(r.id)
    const hasChildren = (r.node.children?.length ?? 0) > 0
    const isOpen = expanded.has(r.id)
    const isSelected = selectedNodeId === r.id
    return (
      <div className="px-2 py-1" style={{ paddingLeft: r.depth * 16 }}>
        <div
          className={
            'flex items-center gap-2 rounded hover:bg-muted/50 ' +
            (isSelected ? 'bg-primary/10 ring-1 ring-primary' : '')
          }
        >
          {hasChildren ? (
            <button className="text-xs w-5" onClick={() => toggle(r.id)}>
              {isOpen ? '▾' : '▸'}
            </button>
          ) : (
            <span className="w-5" />
          )}
          <button
            className="flex-1 text-left truncate"
            onClick={() => onSelectNode?.(r.id)}
          >
            {r.node.name ?? r.id}
          </button>
          {owner && <Badge variant="outline">{owner}</Badge>}
          {h && (
            <Badge variant="outline" className={levelClass(h.level)}>
              {h.combined.toFixed(2)}
            </Badge>
          )}
        </div>
      </div>
    )
  }

  // Klavye gezinme: yukarı/aşağı seçim, sağ/sol aç-kapa, Enter seçim
  const [focusIndex, setFocusIndex] = React.useState(0)
  React.useEffect(() => {
    // Seçili düğüm değiştiyse odak indeksini senkronla
    if (!selectedNodeId) return
    const idx = rows.findIndex(r => r.id === selectedNodeId)
    if (idx >= 0) setFocusIndex(idx)
  }, [selectedNodeId, rows])

  // Virtual list ref is optional; omitted to avoid type coupling

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (rows.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.min(rows.length - 1, focusIndex + 1)
      setFocusIndex(next)
      onSelectNode?.(rows[next].id)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = Math.max(0, focusIndex - 1)
      setFocusIndex(prev)
      onSelectNode?.(rows[prev].id)
    } else if (e.key === 'ArrowRight') {
      const id = rows[focusIndex]?.id
      if (!id) return
      const hasChildren = (rows[focusIndex].node.children?.length ?? 0) > 0
      if (hasChildren && !expanded.has(id)) {
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
      if (!id) return
      onSelectNode?.(id)
    }
  }

  if (Virtuoso) {
    return (
      <div
        className="border rounded-md outline-none"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <Virtuoso
          totalCount={rows.length}
          itemContent={(index: number) => <Row index={index} />}
          overscan={overscan}
          style={{ height: 480 }}
        />
      </div>
    )
  }

  return (
    <div
      className="border rounded-md max-h-[480px] overflow-auto outline-none"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {rows.map((_, i) => (
        <Row key={rows[i].id} index={i} />
      ))}
    </div>
  )
}

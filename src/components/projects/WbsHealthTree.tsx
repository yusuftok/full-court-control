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

  const rows = React.useMemo(() => {
    return flattenVisible(
      root,
      expanded,
      ownership,
      filterOwnerId ?? null,
      view === 'contract'
    )
  }, [root, expanded, ownership, filterOwnerId, view])

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
    return (
      <div className="px-2 py-1" style={{ paddingLeft: r.depth * 16 }}>
        <div className="flex items-center gap-2 rounded hover:bg-muted/50">
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

  if (Virtuoso) {
    return (
      <div className="border rounded-md">
        <Virtuoso
          totalCount={rows.length}
          itemContent={(index: number) => <Row index={index} />}
          overscan={10}
          style={{ height: 480 }}
        />
      </div>
    )
  }

  return (
    <div className="border rounded-md max-h-[480px] overflow-auto">
      {rows.map((_, i) => (
        <Row key={rows[i].id} index={i} />
      ))}
    </div>
  )
}

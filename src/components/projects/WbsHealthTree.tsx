'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type {
  WbsNode,
  OwnershipMap,
  NodeSumsMap,
  Health,
} from '@/lib/project-analytics'
import { Badge } from '@/components/ui/badge'

export interface WbsHealthTreeProps {
  root: WbsNode
  ownership: OwnershipMap
  nodeHealth: Map<string, Health>
  onSelectNode?: (id: string) => void
  filterOwnerId?: string | null
}

function Row({
  node,
  depth,
  ownership,
  nodeHealth,
  onSelect,
  filterOwnerId,
}: {
  node: WbsNode
  depth: number
  ownership: OwnershipMap
  nodeHealth: Map<string, Health>
  onSelect: (id: string) => void
  filterOwnerId?: string | null
}) {
  const [open, setOpen] = React.useState(true)
  const owner = ownership.get(node.id)
  const h = nodeHealth.get(node.id)
  const hidden = filterOwnerId && owner !== filterOwnerId

  const levelClass = (lvl: Health['level']) =>
    (
      ({
        good: 'bg-green-100 text-green-700 border-green-200',
        risky: 'bg-orange-100 text-orange-700 border-orange-200',
        critical: 'bg-red-100 text-red-700 border-red-200',
      }) as const
    )[lvl]

  return (
    <div
      className={cn(hidden && 'opacity-50')}
      style={{ paddingLeft: depth * 16 }}
    >
      <div
        className={cn(
          'flex items-center gap-2 py-1 px-2 rounded hover:bg-muted/50'
        )}
      >
        {node.children?.length ? (
          <button
            type="button"
            className="text-xs w-5"
            onClick={() => setOpen(o => !o)}
          >
            {open ? '▾' : '▸'}
          </button>
        ) : (
          <span className="w-5" />
        )}
        <button
          className="text-left flex-1 truncate"
          onClick={() => onSelect(node.id)}
        >
          {node.name ?? node.id}
        </button>
        {owner && <Badge variant="outline">{owner}</Badge>}
        {h && (
          <Badge variant="outline" className={levelClass(h.level)}>
            {h.combined.toFixed(2)}
          </Badge>
        )}
      </div>
      {open &&
        node.children?.map(child => (
          <Row
            key={child.id}
            node={child}
            depth={depth + 1}
            ownership={ownership}
            nodeHealth={nodeHealth}
            onSelect={onSelect}
            filterOwnerId={filterOwnerId}
          />
        ))}
    </div>
  )
}

export function WbsHealthTree({
  root,
  ownership,
  nodeHealth,
  onSelectNode,
  filterOwnerId,
}: WbsHealthTreeProps) {
  return (
    <div className="border rounded-md">
      <Row
        node={root}
        depth={0}
        ownership={ownership}
        nodeHealth={nodeHealth}
        onSelect={id => onSelectNode?.(id)}
        filterOwnerId={filterOwnerId}
      />
    </div>
  )
}

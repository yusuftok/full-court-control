import type { WbsNode, OwnershipMap } from './project-analytics'

export interface FlatRow {
  id: string
  depth: number
  node: WbsNode
}

// Determine if node or any descendant has matching owner
function hasOwnerMatch(
  node: WbsNode,
  ownership: OwnershipMap,
  target: string
): boolean {
  const own = ownership.get(node.id)
  if (own === target) return true
  if (!node.children) return false
  return node.children.some(c => hasOwnerMatch(c, ownership, target))
}

export function flattenVisible(
  root: WbsNode,
  expanded: Set<string>,
  ownership: OwnershipMap,
  filterOwnerId?: string | null,
  contractOnly?: boolean
): FlatRow[] {
  const out: FlatRow[] = []

  const walk = (node: WbsNode, depth: number, parentOwner: string | null) => {
    if (filterOwnerId) {
      if (!hasOwnerMatch(node, ownership, filterOwnerId)) return
    }
    const owner = ownership.get(node.id) ?? null
    const isBoundary = owner !== parentOwner

    // In contract view, sadece boundary düğümler gösterilir; fakat çocuklar her zaman gezilir
    if (!contractOnly || isBoundary || depth === 0) {
      out.push({ id: node.id, depth, node })
    }

    const shouldRecurse = contractOnly ? true : expanded.has(node.id)
    if (node.children && shouldRecurse) {
      for (const c of node.children) walk(c, depth + 1, owner)
    }
  }

  walk(root, 0, ownership.get(root.id) ?? null)
  return out
}

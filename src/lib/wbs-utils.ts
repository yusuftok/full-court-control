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
  filterOwnerId?: string | null
): FlatRow[] {
  const out: FlatRow[] = []

  const walk = (node: WbsNode, depth: number) => {
    if (filterOwnerId) {
      if (!hasOwnerMatch(node, ownership, filterOwnerId)) return
    }
    out.push({ id: node.id, depth, node })
    if (node.children && expanded.has(node.id)) {
      for (const c of node.children) walk(c, depth + 1)
    }
  }

  walk(root, 0)
  return out
}

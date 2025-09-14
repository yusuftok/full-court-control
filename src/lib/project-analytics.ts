export type SubcontractorId = string

export interface WbsNode {
  id: string
  name?: string
  assignedSubcontractorId?: SubcontractorId | null
  children?: WbsNode[]
}

export interface NodeMetrics {
  ev?: number // Earned Value
  ac?: number // Actual Cost
  pv?: number // Planned Value
}

export interface NodeSums {
  ev: number
  ac: number
  pv: number
}

export type OwnershipMap = Map<string, SubcontractorId | null>
export type NodeSumsMap = Map<string, NodeSums>

export type IssueType = 'delay' | 'overrun'
export interface Issue {
  id: string
  nodeId: string
  subcontractorId?: SubcontractorId | null
  type: IssueType
  severity?: 'low' | 'medium' | 'high' | 'critical'
  daysLate?: number
  costOver?: number
  cpi?: number
  spi?: number
}

// Resolve ownership with the "closest assigned ancestor" rule.
export function resolveOwnership(root: WbsNode): OwnershipMap {
  const map: OwnershipMap = new Map()

  const dfs = (node: WbsNode, inherited: SubcontractorId | null) => {
    const owner = node.assignedSubcontractorId ?? inherited ?? null
    map.set(node.id, owner)
    node.children?.forEach(child => dfs(child, owner))
  }

  dfs(root, null)
  return map
}

// Sum EV/AC/PV for every subtree. Missing metrics treated as 0.
export function rollupNodeSums(
  root: WbsNode,
  metricsById: Map<string, NodeMetrics>
): NodeSumsMap {
  const sums: NodeSumsMap = new Map()

  const dfs = (node: WbsNode): NodeSums => {
    const m = metricsById.get(node.id) || {}
    let ev = m.ev ?? 0
    let ac = m.ac ?? 0
    let pv = m.pv ?? 0
    if (node.children) {
      for (const c of node.children) {
        const cs = dfs(c)
        ev += cs.ev
        ac += cs.ac
        pv += cs.pv
      }
    }
    const out: NodeSums = { ev, ac, pv }
    sums.set(node.id, out)
    return out
  }

  dfs(root)
  return sums
}

export interface Health {
  cpi: number
  spi: number
  combined: number // 0.6*CPI + 0.4*SPI
  level: 'good' | 'risky' | 'critical'
}

import { PERFORMANCE_THRESHOLDS as T } from '@/lib/performance-thresholds'

export function toHealth(cpi: number, spi: number): Health {
  const combined = 0.6 * cpi + 0.4 * spi
  let level: Health['level']
  if (combined >= T.COMBINED.good) level = 'good'
  else if (combined >= T.COMBINED.risky) level = 'risky'
  else level = 'critical'
  return { cpi, spi, combined, level }
}

export function computeNodeHealthFromSums(
  sums: NodeSumsMap
): Map<string, Health> {
  const res = new Map<string, Health>()
  for (const [id, s] of sums) {
    const cpi = s.ac > 0 ? s.ev / s.ac : 0
    const spi = s.pv > 0 ? s.ev / s.pv : 0
    res.set(id, toHealth(cpi, spi))
  }
  return res
}

export interface OwnerAggregate extends NodeSums, Health {}

// Aggregate by resolved owner using node sums.
export function aggregateByOwner(
  ownership: OwnershipMap,
  sums: NodeSumsMap
): Map<SubcontractorId, OwnerAggregate> {
  // Simple aggregation that sums every node owned by an owner.
  // Note: This double-counts when parent and child have same owner.
  const tmp = new Map<SubcontractorId, NodeSums>()
  for (const [nodeId, owner] of ownership) {
    if (!owner) continue
    const s = sums.get(nodeId)
    if (!s) continue
    const prev = tmp.get(owner) || { ev: 0, ac: 0, pv: 0 }
    tmp.set(owner, {
      ev: prev.ev + s.ev,
      ac: prev.ac + s.ac,
      pv: prev.pv + s.pv,
    })
  }
  const out = new Map<SubcontractorId, OwnerAggregate>()
  for (const [owner, s] of tmp) {
    const cpi = s.ac > 0 ? s.ev / s.ac : 0
    const spi = s.pv > 0 ? s.ev / s.pv : 0
    out.set(owner, { ...s, ...toHealth(cpi, spi) })
  }
  return out
}

// Contract-level aggregation: sum only at nodes where ownership changes
// (i.e., node.owner !== parent.owner). Avoids double counting.
export function aggregateByOwnerContractLevel(
  root: WbsNode,
  ownership: OwnershipMap,
  sums: NodeSumsMap
): Map<SubcontractorId, OwnerAggregate> {
  const tmp = new Map<SubcontractorId, NodeSums>()

  const walk = (node: WbsNode, parentOwner: SubcontractorId | null) => {
    const owner = ownership.get(node.id) ?? null
    if (owner && owner !== parentOwner) {
      const s = sums.get(node.id)
      if (s) {
        const prev = tmp.get(owner) || { ev: 0, ac: 0, pv: 0 }
        tmp.set(owner, {
          ev: prev.ev + s.ev,
          ac: prev.ac + s.ac,
          pv: prev.pv + s.pv,
        })
      }
    }
    node.children?.forEach(c => walk(c, owner))
  }

  walk(root, null)

  const out = new Map<SubcontractorId, OwnerAggregate>()
  for (const [owner, s] of tmp) {
    const cpi = s.ac > 0 ? s.ev / s.ac : 0
    const spi = s.pv > 0 ? s.ev / s.pv : 0
    out.set(owner, { ...s, ...toHealth(cpi, spi) })
  }
  return out
}

export interface OwnerIssueSummary {
  delay: number
  overrun: number
}

export function groupIssuesByOwner(
  issues: Issue[],
  ownership: OwnershipMap
): Map<SubcontractorId, OwnerIssueSummary> {
  const out = new Map<SubcontractorId, OwnerIssueSummary>()
  for (const issue of issues) {
    const owner = issue.subcontractorId ?? ownership.get(issue.nodeId)
    if (!owner) continue
    const prev = out.get(owner) || { delay: 0, overrun: 0 }
    if (issue.type === 'delay') prev.delay += 1
    else prev.overrun += 1
    out.set(owner, prev)
  }
  return out
}

// Convenience helper to compute everything needed for the UI
export function buildAnalytics(
  root: WbsNode,
  metricsById: Map<string, NodeMetrics>,
  issues: Issue[]
) {
  const ownership = resolveOwnership(root)
  const sums = rollupNodeSums(root, metricsById)
  const nodeHealth = computeNodeHealthFromSums(sums)
  const ownerAgg = aggregateByOwnerContractLevel(root, ownership, sums)
  const ownerIssue = groupIssuesByOwner(issues, ownership)
  return { ownership, sums, nodeHealth, ownerAgg, ownerIssue }
}

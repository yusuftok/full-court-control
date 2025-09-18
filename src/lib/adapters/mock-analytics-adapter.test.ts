import { describe, it, expect } from 'vitest'
import { getMockAnalyticsData } from './adapters/mock-analytics-adapter'
import {
  buildAnalytics,
  resolveOwnership,
  type OwnershipMap,
  type Issue,
  type WbsNode,
} from '@/lib/project-analytics'

function collectIds(root: WbsNode): Set<string> {
  const ids = new Set<string>()
  const dfs = (n: WbsNode) => {
    ids.add(n.id)
    n.children?.forEach(dfs)
  }
  dfs(root)
  return ids
}

function isValidOwnership(map: OwnershipMap): boolean {
  for (const [, owner] of map) {
    if (!(typeof owner === 'string' || owner === null)) return false
  }
  return true
}

function isValidIssues(issues: Issue[], ids: Set<string>): boolean {
  return issues.every(i => {
    const typeOk =
      i.type === 'instant' || i.type === 'acceptance' || i.type === 'planned'
    const nodeOk = ids.has(i.nodeId)
    const daysOk =
      i.daysLate === undefined ||
      (typeof i.daysLate === 'number' &&
        Number.isFinite(i.daysLate) &&
        i.daysLate >= 0)
    const costOk =
      i.costOver === undefined ||
      (typeof i.costOver === 'number' &&
        Number.isFinite(i.costOver) &&
        i.costOver >= 0)
    return typeOk && nodeOk && daysOk && costOk
  })
}

describe('mock analytics adapter contract', () => {
  it('provides valid shapes for ownership, metrics and issues', () => {
    const { root, metricsById, issues } = getMockAnalyticsData()
    const ids = collectIds(root)

    // Ownership contract
    const ownership = resolveOwnership(root)
    expect(isValidOwnership(ownership)).toBe(true)
    // Contains all node ids
    ids.forEach(id => expect(ownership.has(id)).toBe(true))

    // Metrics contract
    for (const [id, m] of metricsById) {
      expect(typeof id).toBe('string')
      expect(typeof (m.ev ?? 0)).toBe('number')
      expect(typeof (m.ac ?? 0)).toBe('number')
      expect(typeof (m.pv ?? 0)).toBe('number')
    }

    // Issues contract
    expect(isValidIssues(issues, ids)).toBe(true)

    // Analytics build should succeed and produce matching keys
    const a = buildAnalytics(root, metricsById, issues)
    expect(a.ownership.size).toBeGreaterThan(0)
    expect(a.nodeHealth.size).toBeGreaterThan(0)
  })
})

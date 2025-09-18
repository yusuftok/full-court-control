import { describe, it, expect } from 'vitest'
import {
  WbsNode,
  resolveOwnership,
  rollupNodeSums,
  computeNodeHealthFromSums,
  aggregateByOwner,
  groupIssuesByOwner,
  Issue,
} from './project-analytics'

const tree: WbsNode = {
  id: 'root',
  children: [
    {
      id: 'A',
      assignedSubcontractorId: 's1',
      children: [{ id: 'A1' }, { id: 'A2' }],
    },
    {
      id: 'B',
      children: [{ id: 'B1', assignedSubcontractorId: 's2' }, { id: 'B2' }],
    },
  ],
}

const metrics = new Map([
  ['A1', { ev: 10, ac: 12, pv: 11 }],
  ['A2', { ev: 5, ac: 7, pv: 6 }],
  ['B1', { ev: 8, ac: 8, pv: 9 }],
  ['B2', { ev: 2, ac: 4, pv: 3 }],
])

describe('project-analytics', () => {
  it('resolves ownership by closest assigned ancestor', () => {
    const ownership = resolveOwnership(tree)
    expect(ownership.get('A')).toBe('s1')
    expect(ownership.get('A1')).toBe('s1')
    expect(ownership.get('B1')).toBe('s2')
    expect(ownership.get('B2')).toBe(null) // B2'nin atası B, sahip atanmamış
  })

  it('rolls up sums and computes health', () => {
    const sums = rollupNodeSums(tree, metrics)
    const h = computeNodeHealthFromSums(sums)
    expect(sums.get('A')!.ev).toBe(15)
    expect(sums.get('root')!.ac).toBe(31)
    expect(h.get('A')!.cpi).toBeCloseTo(15 / 19, 3)
  })

  it('aggregates by owner (contract level) and issues', () => {
    const ownership = resolveOwnership(tree)
    const sums = rollupNodeSums(tree, metrics)
    const agg = aggregateByOwner(ownership, sums)
    // naive aggregation double-counts parent+children
    expect(agg.get('s1')!.ev).toBe(30)
    // contract-level aggregation should avoid double counting
    const { aggregateByOwnerContractLevel } = await import(
      './project-analytics'
    )
    const aggContract = aggregateByOwnerContractLevel(tree, ownership, sums)
    expect(aggContract.get('s1')!.ev).toBe(15)

    const issues: Issue[] = [
      { id: 'i1', nodeId: 'A1', type: 'instant' },
      { id: 'i2', nodeId: 'B1', type: 'planned' },
      { id: 'i3', nodeId: 'A', type: 'acceptance' },
    ]
    const ownerIssue = groupIssuesByOwner(issues, ownership)
    expect(ownerIssue.get('s1')!.instant).toBe(1)
    expect(ownerIssue.get('s1')!.acceptance).toBe(1)
    expect(ownerIssue.get('s2')!.planned).toBe(1)
  })
})

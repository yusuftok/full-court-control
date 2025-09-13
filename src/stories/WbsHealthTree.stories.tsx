import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { WbsHealthTree } from '@/components/projects/WbsHealthTree'
import {
  buildAnalytics,
  type WbsNode,
  type NodeMetrics,
  type Issue,
} from '@/lib/project-analytics'

const meta: Meta<typeof WbsHealthTree> = {
  title: 'Projects/WbsHealthTree',
  component: WbsHealthTree,
}
export default meta
type Story = StoryObj<typeof WbsHealthTree>

const root: WbsNode = {
  id: 'root',
  name: 'Örnek Proje',
  children: [
    {
      id: 'structure',
      name: 'Kaba İnşaat',
      assignedSubcontractorId: 'sub-construction-1',
      children: [
        { id: 'excavation', name: 'Kazı' },
        { id: 'foundation', name: 'Temel' },
      ],
    },
    {
      id: 'electrical',
      name: 'Elektrik',
      assignedSubcontractorId: 'sub-electrical-1',
      children: [
        { id: 'strong', name: 'Güçlü Akım' },
        { id: 'weak', name: 'Zayıf Akım' },
      ],
    },
  ],
}

const metrics = new Map<string, NodeMetrics>([
  ['excavation', { ev: 120, ac: 140, pv: 130 }],
  ['foundation', { ev: 180, ac: 220, pv: 200 }],
  ['strong', { ev: 90, ac: 88, pv: 92 }],
  ['weak', { ev: 70, ac: 90, pv: 85 }],
])

const issues: Issue[] = [
  { id: 'i1', nodeId: 'foundation', type: 'overrun' },
  { id: 'i2', nodeId: 'weak', type: 'delay', daysLate: 5 },
]

const a = buildAnalytics(root, metrics, issues)

export const Default: Story = {
  args: {
    root,
    ownership: a.ownership,
    nodeHealth: a.nodeHealth,
  },
}

export const ContractLevel: Story = {
  args: {
    root,
    ownership: a.ownership,
    nodeHealth: a.nodeHealth,
    view: 'contract',
  },
}

export const LeafView: Story = {
  args: {
    root,
    ownership: a.ownership,
    nodeHealth: a.nodeHealth,
    view: 'leaf',
  },
}

// --- Large dataset (5k+ nodes) ---
function buildLargeTree(): {
  root: WbsNode
  metrics: Map<string, NodeMetrics>
  issues: Issue[]
} {
  // Balanced 4-ary tree, depth 6 -> 5461 nodes
  const root: WbsNode = { id: 'root', name: 'Büyük Proje', children: [] }
  const metrics = new Map<string, NodeMetrics>()
  let counter = 0

  const makeChildren = (prefix: string, depth: number): WbsNode[] => {
    if (depth === 0) return []
    const out: WbsNode[] = []
    for (let i = 0; i < 4; i++) {
      const id = `${prefix}-${i}`
      const node: WbsNode = {
        id,
        name: `Düğüm ${++counter}`,
        assignedSubcontractorId:
          depth % 2 === 0 ? `sub-${(i % 3) + 1}` : undefined,
      }
      node.children = makeChildren(id, depth - 1)
      out.push(node)
      // Add some metrics to many nodes (treat non-leaves as having some EV/AC/PV too)
      const ev = (counter % 7) * 10 + 50
      const ac = (counter % 5) * 12 + 40
      const pv = (counter % 6) * 11 + 45
      metrics.set(id, { ev, ac, pv })
    }
    return out
  }

  root.children = makeChildren('n', 6)
  const issues: Issue[] = []
  return { root, metrics, issues }
}

const large = buildLargeTree()
const largeA = buildAnalytics(large.root, large.metrics, large.issues)

export const LargeDataset: Story = {
  name: 'Large (5k+ nodes) - Contract',
  args: {
    root: large.root,
    ownership: largeA.ownership,
    nodeHealth: largeA.nodeHealth,
    view: 'contract',
  },
}

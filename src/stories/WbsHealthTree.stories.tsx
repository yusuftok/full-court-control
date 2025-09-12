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

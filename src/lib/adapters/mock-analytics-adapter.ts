import type { Issue, NodeMetrics, WbsNode } from '@/lib/project-analytics'

export interface MockAnalyticsData {
  root: WbsNode
  metricsById: Map<string, NodeMetrics>
  issues: Issue[]
}

export function getMockAnalyticsData(): MockAnalyticsData {
  const root: WbsNode = {
    id: 'root',
    name: 'Mock Proje',
    children: [
      {
        id: 'structure',
        name: 'Kaba İnşaat',
        assignedSubcontractorId: 'sub-1',
        children: [
          { id: 'excavation', name: 'Kazı' },
          { id: 'foundation', name: 'Temel' },
        ],
      },
      {
        id: 'electrical',
        name: 'Elektrik',
        assignedSubcontractorId: 'sub-2',
        children: [
          { id: 'strong-power', name: 'Güçlü Akım' },
          { id: 'weak-power', name: 'Zayıf Akım' },
        ],
      },
    ],
  }

  const metricsById = new Map<string, NodeMetrics>([
    ['excavation', { ev: 120, ac: 140, pv: 130 }],
    ['foundation', { ev: 180, ac: 220, pv: 200 }],
    ['strong-power', { ev: 90, ac: 88, pv: 92 }],
    ['weak-power', { ev: 70, ac: 90, pv: 85 }],
  ])

  const issues: Issue[] = [
    { id: 'i1', nodeId: 'foundation', type: 'overrun', costOver: 35000 },
    { id: 'i2', nodeId: 'weak-power', type: 'delay', daysLate: 6 },
  ]

  return { root, metricsById, issues }
}

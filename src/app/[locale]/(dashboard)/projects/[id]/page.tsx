'use client'

import * as React from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  HardHat,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
// tooltips/progress components not used here
import { PageContainer, PageContent } from '@/components/layout/page-container'
import { DataTable, Column } from '@/components/data/data-table'
import { SubcontractorOverview } from '@/components/projects/SubcontractorOverview'
import { WbsHealthTree } from '@/components/projects/WbsHealthTree'
import { IssueList } from '@/components/projects/IssueList'
import { BudgetSchedulePanel } from '@/components/projects/BudgetSchedulePanel'
import { ProjectOverviewHeader } from '@/components/projects/project-overview-header'
import {
  buildAnalytics,
  type WbsNode,
  type Issue,
  type NodeMetrics,
  type OwnerAggregate,
  type OwnerIssueSummary,
  type SubcontractorId,
} from '@/lib/project-analytics'
import { mockSubcontractors } from '@/components/projects/data/mock-subcontractors'
import { PERFORMANCE_THRESHOLDS as T } from '@/lib/performance-thresholds'
import { getDetailedProject, getSimpleProjects } from '@/lib/mock-data'
import { useTranslations, useLocale } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface TeamMember {
  id: string
  name: string
  role: string
  tasksCompleted: number
  hoursWorked: number
  status: 'active' | 'on-leave' | 'off-site'
}

// Equipment type removed from scope

/*
const mockProjectData: Record<string, ProjectDetails> = {
  '1': {
    id: '1',
    name: 'Ataşehir Ofis Kompleksi',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-12-20',
    progress: 45,
    budget: 15000000,
    spent: 6750000,
    location: 'Ataşehir, İstanbul',
    contractor: 'Mega İnşaat A.Ş.',
    teamSize: 45,
    completedTasks: 11,
    totalTasks: 24,
    upcomingMilestones: [
      {
        id: 'm1',
        name: 'Temel Atma Tamamlama',
        dueDate: '2024-09-15',
        status: 'completed',
        progress: 100,
      },
      {
        id: 'm2',
        name: 'İskelet Yapı Bitirme',
        dueDate: '2024-11-30',
        status: 'in-progress',
        progress: 75,
      },
      {
        id: 'm3',
        name: 'Dış Cephe Kaplama',
        dueDate: '2024-12-15',
        status: 'pending',
        progress: 0,
      },
    ],
    recentActivities: [
      {
        id: 'a1',
        type: 'task',
        title: '6. Kat Beton Döküm Tamamlandı',
        description: 'Kalite kontrol testleri başarılı',
        timestamp: '2024-08-19T10:30:00Z',
        user: 'Murat Demir',
      },
      {
        id: 'a2',
        type: 'issue',
        title: 'Malzeme Teslimat Gecikmesi',
        description: 'Çelik konstrüksiyon malzemeleri 2 gün gecikecek',
        timestamp: '2024-08-19T08:15:00Z',
        user: 'Ayşe Kaya',
      },
      {
        id: 'a3',
        type: 'milestone',
        title: 'İskelet Yapı %75 Tamamlandı',
        description: 'Planlanan sürede ilerliyor',
        timestamp: '2024-08-18T16:45:00Z',
        user: 'Ali Özkan',
      },
    ],
    teamMembers: [
      {
        id: 't1',
        name: 'Murat Demir',
        role: 'Şantiye Şefi',
        tasksCompleted: 23,
        hoursWorked: 42,
        status: 'active',
      },
      {
        id: 't2',
        name: 'Ayşe Kaya',
        role: 'İnşaat Mühendisi',
        tasksCompleted: 18,
        hoursWorked: 38,
        status: 'active',
      },
      {
        id: 't3',
        name: 'Mehmet Yılmaz',
        role: 'Kalite Kontrol',
        tasksCompleted: 15,
        hoursWorked: 35,
        status: 'active',
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Bahçeşehir Konut Projesi',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2025-01-30',
    progress: 25,
    budget: 8500000,
    spent: 2125000,
    location: 'Bahçeşehir, İstanbul',
    contractor: 'Konut İnşaat Ltd.',
    teamSize: 28,
    completedTasks: 5,
    totalTasks: 18,
    upcomingMilestones: [
      {
        id: 'm1',
        name: 'Temeller ve Altyapı',
        dueDate: '2024-09-15',
        status: 'completed',
        progress: 100,
      },
      {
        id: 'm2',
        name: 'Kaba İnşaat',
        dueDate: '2024-12-30',
        status: 'in-progress',
        progress: 40,
      },
    ],
    recentActivities: [
      {
        id: 'a1',
        type: 'task',
        title: 'A Blok Temel Kazı Tamamlandı',
        description: 'İlk blok temeller başarıyla tamamlandı',
        timestamp: '2024-08-19T14:30:00Z',
        user: 'Zeynep Koç',
      },
    ],
    teamMembers: [
      {
        id: 't1',
        name: 'Zeynep Koç',
        role: 'Proje Yöneticisi',
        tasksCompleted: 12,
        hoursWorked: 35,
        status: 'active',
      },
    ],
  },
  '3': {
    id: '3',
    name: 'Ankara Metro B2 Hattı',
    status: 'active',
    startDate: '2023-09-15',
    endDate: '2025-06-30',
    progress: 78,
    budget: 45000000,
    spent: 35100000,
    location: 'Çankaya, Ankara',
    contractor: 'Metro Yapı A.Ş.',
    teamSize: 120,
    completedTasks: 25,
    totalTasks: 32,
    upcomingMilestones: [
      {
        id: 'm1',
        name: 'Tünel Kazı İşleri',
        dueDate: '2025-02-15',
        status: 'in-progress',
        progress: 85,
      },
    ],
    recentActivities: [
      {
        id: 'a1',
        type: 'milestone',
        title: 'Tünel Kazı %85 Tamamlandı',
        description: 'Hedeflenen sürede ilerliyor',
        timestamp: '2024-08-19T11:00:00Z',
        user: 'Engin Çelik',
      },
    ],
    teamMembers: [
      {
        id: 't1',
        name: 'Engin Çelik',
        role: 'Şef Mühendis',
        tasksCompleted: 45,
        hoursWorked: 55,
        status: 'active',
      },
    ],
  },
  '4': {
    id: '4',
    name: 'İzmir Ege Rezidans',
    status: 'pending',
    startDate: '2024-06-01',
    endDate: '2025-10-15',
    progress: 0,
    budget: 12000000,
    spent: 0,
    location: 'Alsancak, İzmir',
    contractor: 'Ege İnşaat',
    teamSize: 0,
    completedTasks: 0,
    totalTasks: 16,
    upcomingMilestones: [
      {
        id: 'm1',
        name: 'Proje Başlangıcı',
        dueDate: '2024-09-01',
        status: 'pending',
        progress: 0,
      },
    ],
    recentActivities: [
      {
        id: 'a1',
        type: 'update',
        title: 'Proje Planlandı',
        description: 'İzinler bekleniyor',
        timestamp: '2024-08-15T09:00:00Z',
        user: 'Selin Özdemir',
      },
    ],
    teamMembers: [
      {
        id: 't1',
        name: 'Selin Özdemir',
        role: 'Proje Yöneticisi',
        tasksCompleted: 0,
        hoursWorked: 8,
        status: 'active',
      },
    ],
  },
  '5': {
    id: '5',
    name: 'Beyoğlu Tarihi Bina Restorasyonu',
    status: 'completed',
    startDate: '2023-12-01',
    endDate: '2024-11-30',
    progress: 100,
    budget: 3500000,
    spent: 3200000,
    location: 'Galata, İstanbul',
    contractor: 'Restorasyon Uzmanları Ltd.',
    teamSize: 15,
    completedTasks: 22,
    totalTasks: 22,
    upcomingMilestones: [
      {
        id: 'm1',
        name: 'Proje Tamamlandı',
        dueDate: '2024-11-30',
        status: 'completed',
        progress: 100,
      },
    ],
    recentActivities: [
      {
        id: 'a1',
        type: 'task',
        title: 'Son Rötuşlar Tamamlandı',
        description: 'Tarihi bina restorasyonu başarıyla bitti',
        timestamp: '2024-11-30T16:00:00Z',
        user: 'Orhan Pamuk',
      },
      {
        id: 'a2',
        type: 'milestone',
        title: 'Proje Başarıyla Teslim Edildi',
        description: 'Müze açılışa hazır',
        timestamp: '2024-11-30T17:30:00Z',
        user: 'Orhan Pamuk',
      },
    ],
    teamMembers: [
      {
        id: 't1',
        name: 'Orhan Pamuk',
        role: 'Restorasyon Uzmanı',
        tasksCompleted: 22,
        hoursWorked: 180,
        status: 'active',
      },
      {
        id: 't2',
        name: 'Elif Şafak',
        role: 'Sanat Tarihçisi',
        tasksCompleted: 8,
        hoursWorked: 95,
        status: 'active',
      },
    ],
    equipment: [
      {
        id: 'e1',
        name: 'Taş İşleme Seti',
        type: 'Restorasyon',
        status: 'operational',
        location: 'Atölye',
        lastMaintenance: '2024-11-15',
      },
    ],
  },
}
*/

const activityTypeConfig = {
  task: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  milestone: { icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
  issue: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  update: { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100' },
}

const teamColumns: Column<TeamMember>[] = [
  {
    id: 'name',
    header: 'İsim',
    accessor: 'name',
    sortable: true,
  },
  {
    id: 'role',
    header: 'Görev',
    accessor: 'role',
    sortable: true,
  },
  {
    id: 'tasksCompleted',
    header: 'Tamamlanan',
    accessor: 'tasksCompleted',
    sortable: true,
  },
  {
    id: 'hoursWorked',
    header: 'Saat',
    accessor: row => `${row.hoursWorked}h`,
    sortable: true,
  },
  {
    id: 'status',
    header: 'Durum',
    accessor: row => (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          row.status === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : row.status === 'on-leave'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        )}
      >
        {row.status === 'active'
          ? 'Aktif'
          : row.status === 'on-leave'
            ? 'İzinli'
            : 'Saha Dışı'}
      </span>
    ),
    sortable: true,
  },
]

export default function ProjectDashboardPage() {
  const t = useTranslations('projectDetail')
  const tCommon = useTranslations('common')
  const tMilestone = useTranslations('milestone')
  const locale = useLocale()
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = params.id as string
  const detailed = getDetailedProject(projectId)
  const simple = React.useMemo(
    () => getSimpleProjects().find(p => p.id === projectId),
    [projectId]
  )

  // --- WBS & Analytics (hooks must be before any early return) ---
  const subsNameMap = React.useMemo(() => {
    const m = new Map<string, string>()
    mockSubcontractors.forEach(s => m.set(s.id, s.companyName))
    return m
  }, [])

  const wbsRoot: WbsNode = React.useMemo(
    () => ({
      id: 'root',
      name: simple?.name || 'Proje',
      children: [
        {
          id: 'structure',
          name: 'Kaba İnşaat',
          assignedSubcontractorId: 'sub-construction-1',
          children: [
            {
              id: 'excavation',
              name: 'Kazı',
              assignedSubcontractorId: 'sub-construction-1',
            },
            {
              id: 'foundation',
              name: 'Temel',
              assignedSubcontractorId: 'sub-construction-1',
            },
            {
              id: 'columns',
              name: 'Kolonlar',
              assignedSubcontractorId: 'sub-construction-1',
            },
            {
              id: 'slabs',
              name: 'Döşemeler',
              assignedSubcontractorId: 'sub-construction-1',
            },
          ],
        },
        {
          id: 'mechanical',
          name: 'Mekanik',
          assignedSubcontractorId: 'sub-mechanical-1',
          children: [
            { id: 'hvac', name: 'HVAC' },
            { id: 'plumbing', name: 'Sıhhi Tesisat' },
            { id: 'fire', name: 'Yangın' },
            { id: 'sprinkler', name: 'Sprinkler' },
          ],
        },
        {
          id: 'electrical',
          name: 'Elektrik',
          assignedSubcontractorId: 'sub-electrical-1',
          children: [
            { id: 'strong-power', name: 'Güçlü Akım' },
            { id: 'weak-power', name: 'Zayıf Akım' },
            { id: 'lighting', name: 'Aydınlatma' },
            { id: 'automation', name: 'Otomasyon' },
          ],
        },
        {
          id: 'finishes',
          name: 'İnce İşler',
          assignedSubcontractorId: 'sub-finishes-1',
          children: [
            {
              id: 'plaster',
              name: 'Sıva',
              children: [
                { id: 'plaster-floor1', name: 'Sıva - 1. Kat' },
                { id: 'plaster-floor2', name: 'Sıva - 2. Kat' },
              ],
            },
            {
              id: 'painting',
              name: 'Boya',
              children: [
                { id: 'paint-corridors', name: 'Boya - Koridorlar' },
                { id: 'paint-rooms', name: 'Boya - Odalar' },
              ],
            },
            {
              id: 'flooring',
              name: 'Zemin Kaplama',
              children: [
                { id: 'ceramic', name: 'Seramik' },
                { id: 'laminate', name: 'Laminat' },
              ],
            },
          ],
        },
      ],
    }),
    [simple?.name]
  )

  const metricsById = React.useMemo(() => {
    return new Map<string, NodeMetrics>([
      ['excavation', { ev: 120, ac: 140, pv: 130 }],
      ['foundation', { ev: 180, ac: 220, pv: 200 }],
      ['hvac', { ev: 90, ac: 100, pv: 110 }],
      ['plumbing', { ev: 60, ac: 70, pv: 75 }],
      ['strong-power', { ev: 80, ac: 85, pv: 90 }],
      ['weak-power', { ev: 70, ac: 95, pv: 85 }],
      ['columns', { ev: 150, ac: 155, pv: 170 }],
      ['slabs', { ev: 110, ac: 130, pv: 140 }],
      ['fire', { ev: 55, ac: 65, pv: 80 }],
      ['sprinkler', { ev: 45, ac: 60, pv: 70 }],
      ['lighting', { ev: 95, ac: 100, pv: 120 }],
      ['automation', { ev: 70, ac: 90, pv: 95 }],
      ['plaster', { ev: 40, ac: 55, pv: 60 }],
      ['plaster-floor1', { ev: 20, ac: 25, pv: 30 }],
      ['plaster-floor2', { ev: 18, ac: 22, pv: 28 }],
      ['painting', { ev: 35, ac: 40, pv: 50 }],
      ['paint-corridors', { ev: 12, ac: 14, pv: 18 }],
      ['paint-rooms', { ev: 16, ac: 20, pv: 25 }],
      ['flooring', { ev: 50, ac: 60, pv: 65 }],
      ['ceramic', { ev: 22, ac: 30, pv: 35 }],
      ['laminate', { ev: 26, ac: 28, pv: 30 }],
    ])
  }, [])

  const issues: Issue[] = React.useMemo(
    () => [
      { id: 'i1', nodeId: 'foundation', type: 'overrun', costOver: 40000 },
      { id: 'i2', nodeId: 'weak-power', type: 'delay', daysLate: 8 },
      { id: 'i3', nodeId: 'hvac', type: 'delay', daysLate: 4 },
    ],
    []
  )

  const analytics = React.useMemo(
    () => buildAnalytics(wbsRoot, metricsById, issues),
    [wbsRoot, metricsById, issues]
  )

  // Configurable WBS depth for tasks shown in the timeline (default: one below top)
  const taskDepth = React.useMemo(() => {
    const qp = searchParams.get('taskDepth')
    const v = qp ? Number(qp) : 2
    return Number.isFinite(v) ? Math.max(0, Math.floor(v)) : 2
  }, [searchParams])
  const tasksMax = React.useMemo(() => {
    const qp = searchParams.get('tasksMax')
    const v = qp ? Number(qp) : 18
    return Number.isFinite(v) ? Math.max(1, Math.floor(v)) : 18
  }, [searchParams])
  const taskParts = React.useMemo(() => {
    const qp = searchParams.get('taskParts')
    const v = qp ? Number(qp) : 2
    return Number.isFinite(v) ? Math.max(1, Math.floor(v)) : 2
  }, [searchParams])

  // Tasks generated from WBS nodes for the timeline
  type WbsTask = {
    id: string
    name: string
    startDate: string
    dueDate: string
    forecastDate?: string
    actualDate?: string
    slipDays?: number
    status: 'completed' | 'in-progress'
    progress: number
    owner?: SubcontractorId
    isCritical?: boolean
    blockers: number
    dependsOn: string[]
    blocks: string[]
  }

  // Optional "today" override via query param to simulate different views
  const todayOverride = searchParams.get('today')
  const nowMs = React.useMemo(() => {
    if (!todayOverride) return Date.now()
    const d = new Date(todayOverride)
    const t = d.getTime()
    return Number.isFinite(t) ? t : Date.now()
  }, [todayOverride])

  // Produce WBS tasks at given depth, mapped into milestone-like shape to reuse visuals
  const getWbsTasks = React.useCallback(
    (exactDepth: number): WbsTask[] => {
      // Build a visual timeline range that centers 'today' around ~55% when project timeline is skewed
      const rawStart = simple?.startDate
        ? new Date(simple.startDate).getTime()
        : 0
      const rawEnd = simple?.endDate ? new Date(simple.endDate).getTime() : 0
      let start = rawStart
      let end = rawEnd
      if (rawEnd > rawStart) {
        const span = rawEnd - rawStart
        const realPct = (nowMs - rawStart) / span
        const desired = 0.55
        if (realPct < 0.35 || realPct > 0.75) {
          start = Math.floor(nowMs - desired * span)
          end = start + span
        }
      }
      const total = end > start ? end - start : 1
      // Collect nodes at the exact requested depth to avoid heterogenous depths
      const nodes: Array<{ id: string; name: string; depth: number }> = []
      const walk = (n: WbsNode, d: number) => {
        if (d === exactDepth)
          nodes.push({ id: n.id, name: n.name || n.id, depth: d })
        n.children?.forEach(c => walk(c, d + 1))
      }
      walk(wbsRoot, 0)
      if (nodes.length === 0) return []
      const tasks: WbsTask[] = []
      const startTimes: number[] = []
      const endTimes: number[] = []
      // Expand each node into several sub-parts to increase variety
      for (let ni = 0; ni < nodes.length && tasks.length < tasksMax; ni++) {
        const l = nodes[ni]
        for (let p = 0; p < taskParts && tasks.length < tasksMax; p++) {
          const idx = tasks.length
          const seed = Array.from(l.id).reduce(
            (a, c) => (a * 33 + c.charCodeAt(0)) >>> 0,
            0
          )
          const offBase = (seed % 60) / 100 // 0..0.59
          const offJitter = (p * 7) / 100 // small shift per part
          const offRatio = Math.min(0.85, offBase + offJitter)
          const durBase = 0.18 + ((seed >> 3) % 25) / 100 // 0.18..0.43
          const durShrink = Math.max(0.5, 1 - p * 0.15)
          const durRatio = Math.min(0.6, durBase * durShrink)
          const s = start + Math.floor(total * offRatio)
          const e = Math.min(end, s + Math.floor(total * durRatio))
          const m = metricsById.get(l.id)
          const ev = m?.ev ?? 0
          const pv = m?.pv ?? 1
          const spi = pv > 0 ? ev / pv : 1
          // Diversify status: completed early/late, in-progress (fc late/early/on-track)
          const pattern = idx % 6
          let actual: number | undefined
          let forecast: number | undefined
          if (pattern === 0) {
            // Completed early
            actual = e - Math.floor((e - s) * 0.1)
          } else if (pattern === 1) {
            // Completed late
            actual = e + Math.floor((e - s) * 0.2)
          } else if (pattern === 2) {
            // In-progress -> forecast by SPI (may be early/late)
            forecast = s + Math.floor((e - s) / Math.max(spi || 1, 0.01)) // could be early/late
          } else if (pattern === 3) {
            // In-progress late: push forecast beyond due and today for dashed
            forecast = Math.max(
              e + Math.floor((e - s) * 0.25),
              nowMs + 7 * 86400000
            )
          } else if (pattern === 4) {
            // In-progress near plan
            forecast = e - Math.floor((e - s) * 0.05)
          } else {
            // In-progress early but still future (ensure dashed green case)
            const futureShift = Math.max(
              3 * 86400000,
              Math.floor((e - s) * 0.05)
            )
            const near = Math.min(
              e - Math.floor((e - s) * 0.15),
              end - futureShift
            )
            forecast = Math.max(near, nowMs + futureShift)
          }
          // In‑progress işte forecast geçmişte olamaz; en azından bugün+1g olsun
          if (!actual && forecast && forecast < nowMs + 24 * 3600 * 1000) {
            forecast = nowMs + 24 * 3600 * 1000
          }
          const fc = forecast ?? actual ?? e
          const taskId = `${l.id}-p${p}`
          tasks.push({
            id: taskId,
            name: p > 0 ? `${l.name} • Faz ${p + 1}` : l.name,
            startDate: new Date(s).toISOString(),
            dueDate: new Date(e).toISOString(),
            forecastDate: forecast
              ? new Date(forecast).toISOString()
              : undefined,
            actualDate: actual ? new Date(actual).toISOString() : undefined,
            slipDays: Math.round((fc - e) / 86400000),
            status: actual ? 'completed' : 'in-progress',
            progress: actual ? 100 : 0,
            owner: analytics.ownership.get(l.id) ?? undefined,
            isCritical: analytics.nodeHealth.get(l.id)?.level === 'critical',
            blockers: 0,
            dependsOn: [],
            blocks: [],
          })
          startTimes.push(s)
          endTimes.push(e)
        }
      }
      // Ensure at least one unfinished task exists for active projects
      const hasActive = tasks.some(t => !t.actualDate)
      if (!hasActive && tasks.length > 0) {
        // Mark the last one as in-progress into the future to show dashed
        const t = tasks[tasks.length - 1]
        const due = new Date(t.dueDate).getTime()
        t.actualDate = undefined
        t.status = 'in-progress'
        t.forecastDate = new Date(
          Math.max(due + 7 * 86400000, nowMs + 7 * 86400000)
        ).toISOString()
        t.slipDays = Math.round(
          (new Date(t.forecastDate).getTime() - due) / 86400000
        )
        t.progress = 0
      }
      // Ensure there is at least one task due within the next 14 days (unfinished)
      const hasUpcoming = tasks.some(t => {
        if (t.actualDate) return false
        const due = new Date(t.dueDate).getTime()
        const dt = Math.ceil((due - nowMs) / 86400000)
        return dt >= 0 && dt <= 14
      })
      if (!hasUpcoming && tasks.length > 0) {
        // Pick the first unfinished task or last task
        const idx = tasks.findIndex(t => !t.actualDate)
        const t = idx >= 0 ? tasks[idx] : tasks[tasks.length - 1]
        const desiredDue = Math.min(end - 2 * 86400000, nowMs + 7 * 86400000)
        t.actualDate = undefined
        t.status = 'in-progress'
        t.dueDate = new Date(
          Math.max(desiredDue, nowMs + 1 * 86400000)
        ).toISOString()
        const dueMs = new Date(t.dueDate).getTime()
        const fcMs = Math.max(dueMs + 2 * 86400000, nowMs + 3 * 86400000)
        t.forecastDate = new Date(fcMs).toISOString()
        t.slipDays = Math.round((fcMs - dueMs) / 86400000)
        t.progress = 0
      }
      // Ensure at least one task forecasts exactly project end for visual variety
      if (tasks.length > 0) {
        let lastIdx = -1
        for (let i = tasks.length - 1; i >= 0; i--) {
          if (!tasks[i].actualDate) {
            lastIdx = i
            break
          }
        }
        if (lastIdx >= 0) {
          const t = tasks[lastIdx]
          t.forecastDate = new Date(end).toISOString()
          const due = new Date(t.dueDate).getTime()
          t.slipDays = Math.round((end - due) / 86400000)
        }
      }
      // Build simple deterministic dependencies within the same depth
      const idIndex = new Map<string, number>()
      tasks.forEach((t, i) => idIndex.set(t.id, i))
      for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i]
        const start = startTimes[i]
        // candidate predecessors: tasks that end before this task starts
        const preds: number[] = []
        for (let j = 0; j < i; j++) {
          if (endTimes[j] <= start) preds.push(j)
        }
        // choose up to 2 predecessors based on index pattern
        const want = i % 6 === 0 ? 2 : i % 3 === 0 ? 1 : 0
        for (let k = 0; k < Math.min(want, preds.length); k++) {
          const pj = preds[(i + k) % preds.length]
          const pid = tasks[pj].id
          if (!t.dependsOn.includes(pid)) t.dependsOn.push(pid)
        }
      }
      // compute blocks (successors)
      for (let i = 0; i < tasks.length; i++) {
        for (const pid of tasks[i].dependsOn) {
          const pj = idIndex.get(pid)
          if (pj != null) {
            const ptask = tasks[pj]
            if (!ptask.blocks.includes(tasks[i].id))
              ptask.blocks.push(tasks[i].id)
          }
        }
      }
      return tasks
    },
    [
      analytics.nodeHealth,
      analytics.ownership,
      metricsById,
      simple?.endDate,
      simple?.startDate,
      wbsRoot,
      taskParts,
      tasksMax,
      nowMs,
    ]
  )

  const subcontractorOverviewData = React.useMemo(() => {
    const arr: Array<{
      id: string
      name: string
      aggregate: OwnerAggregate
      issues?: OwnerIssueSummary
    }> = []
    for (const [id, agg] of analytics.ownerAgg) {
      arr.push({
        id,
        name: subsNameMap.get(id) || id,
        aggregate: agg,
        issues: analytics.ownerIssue.get(id),
      })
    }
    return arr.sort((a, b) => a.aggregate.combined - b.aggregate.combined)
  }, [analytics.ownerAgg, analytics.ownerIssue, subsNameMap])

  const ownerLabel = (raw?: string) => {
    if (!raw) return undefined
    // 1) Prefer concrete subcontractor company name from mock registry
    const mapped = subsNameMap.get(raw)
    if (mapped) return mapped
    // 2) Try i18n fallback for non-id slugs (kept for backwards compatibility)
    const slug = raw
      .replaceAll('İ', 'I')
      .replaceAll('ı', 'i')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const key = `owner.${slug}`
    const translated = tMilestone(key as never)
    if (translated === key || translated === `milestone.${key}`) {
      // 3) Humanize raw as last resort
      return raw.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    }
    return translated
  }

  // Build WBS lookup helpers for showing path excerpts
  const wbsMaps = React.useMemo(() => {
    const nodeById = new Map<string, WbsNode>()
    const parent = new Map<string, string | null>()
    const dfs = (n: WbsNode, p: string | null) => {
      nodeById.set(n.id, n)
      parent.set(n.id, p)
      n.children?.forEach(c => dfs(c, n.id))
    }
    dfs(wbsRoot, null)
    const pathTo = (id: string) => {
      const arr: WbsNode[] = []
      let cur: string | null | undefined = id
      while (cur) {
        const node = nodeById.get(cur)
        if (!node) break
        arr.push(node)
        cur = parent.get(cur) ?? null
      }
      return arr.reverse()
    }
    const toName = (id: string) => nodeById.get(id)?.name || id
    return { nodeById, parent, pathTo, toName }
  }, [wbsRoot])

  const asciiBranchMarked = React.useCallback(
    (focusNodeId: string, otherNodeId: string, rel: InsightKind) => {
      const a = wbsMaps.pathTo(focusNodeId)
      const b = wbsMaps.pathTo(otherNodeId)
      const aIds = a.map(n => n.id)
      const bIds = b.map(n => n.id)
      let i = 0
      while (i < aIds.length && i < bIds.length && aIds[i] === bIds[i]) i++
      const lines: string[] = []
      const prefix = (n: number, last: boolean) =>
        ' '.repeat(n * 2) + (last ? '└─ ' : '├─ ')
      // common path
      if (i > 0) {
        lines.push(wbsMaps.toName(aIds[0]))
        for (let k = 1; k < i; k++) {
          lines.push(prefix(k, true) + wbsMaps.toName(aIds[k]))
        }
      } else {
        lines.push(wbsMaps.toName(aIds[0] || bIds[0] || wbsRoot.id))
      }
      // branch A
      for (let k = i; k < aIds.length; k++) {
        const isFocus = aIds[k] === focusNodeId
        const name = wbsMaps.toName(aIds[k])
        const marker = isFocus ? '▶ ' : ''
        lines.push(prefix(k, k === aIds.length - 1) + marker + name)
      }
      // branch B
      for (let k = i; k < bIds.length; k++) {
        const pre = ' '.repeat(i * 2)
        const branch = k === i ? '├─ ' : '   '.repeat(k - i) + '└─ '
        const isOther = bIds[k] === otherNodeId
        const mark = isOther
          ? rel === 'blocking' || rel === 'blockRisk'
            ? '● '
            : '◆ '
          : ''
        lines.push(pre + branch + mark + wbsMaps.toName(bIds[k]))
      }
      return lines.join('\n')
    },
    [wbsMaps]
  )

  // Insight modal state
  type InsightKind = 'blocked' | 'blocking' | 'blockedRisk' | 'blockRisk'
  const [insightOpen, setInsightOpen] = React.useState(false)
  const [insightKind, setInsightKind] = React.useState<InsightKind>('blocked')
  const [insightCards, setInsightCards] = React.useState<
    Array<{
      title: string
      details?: string
      ascii: string
      focusName: string
      otherName: string
      rel: InsightKind
      focusOwner?: string | null
      otherOwner?: string | null
    }>
  >([])
  const [insightIndex, setInsightIndex] = React.useState(0)

  type TabKey = 'overview' | 'subs' | 'wbs' | 'issues' | 'evm'
  const [activeTab, setActiveTab] = React.useState<TabKey>(
    (searchParams.get('tab') as TabKey) || 'overview'
  )
  const [selectedOwner, setSelectedOwner] = React.useState<string | null>(
    searchParams.get('subcontractorId')
  )
  const [view, setView] = React.useState<'contract' | 'leaf'>(
    (searchParams.get('view') as 'contract' | 'leaf') || 'contract'
  )
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(
    searchParams.get('nodeId')
  )
  const [wbsQuery, setWbsQuery] = React.useState<string>(
    searchParams.get('q') || ''
  )

  // Milestone filter states (URL-driven)
  const [msState, setMsState] = React.useState<
    | 'all'
    | 'overdue'
    | 'critical'
    | 'risky'
    | 'upcoming'
    | 'blocked'
    | 'blocking'
    | 'blockedRisk'
    | 'blockRisk'
    | null
  >(
    (searchParams.get('msState') as
      | 'all'
      | 'overdue'
      | 'critical'
      | 'risky'
      | 'upcoming'
      | 'blocked'
      | 'blocking'
      | 'blockedRisk'
      | 'blockRisk'
      | null) ?? null
  )
  const [msRange, setMsRange] = React.useState<number | null>(() => {
    const v = searchParams.get('msRange')
    return v ? Number(v) : null
  })
  // Single-tooltip policy: track which marker is hovered
  const [hoveredMs, setHoveredMs] = React.useState<string | null>(null)

  React.useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString())
    sp.set('tab', activeTab)
    if (selectedOwner) sp.set('subcontractorId', selectedOwner)
    else sp.delete('subcontractorId')
    sp.set('view', view)
    if (selectedNodeId) sp.set('nodeId', selectedNodeId)
    else sp.delete('nodeId')
    if (wbsQuery) sp.set('q', wbsQuery)
    else sp.delete('q')
    if (msState) sp.set('msState', msState)
    else sp.delete('msState')
    if (msRange != null) sp.set('msRange', String(msRange))
    else sp.delete('msRange')
    router.replace(`?${sp.toString()}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTab,
    selectedOwner,
    view,
    selectedNodeId,
    wbsQuery,
    msState,
    msRange,
  ])

  if (!detailed || !simple) {
    return (
      <PageContainer>
        <PageContent>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Building2 className="size-16 text-muted-foreground mb-4" />
              <h1 className="text-2xl font-semibold mb-2">Proje Bulunamadı</h1>
              <p className="text-muted-foreground mb-4">
                Aradığınız proje mevcut değil veya erişim izniniz bulunmuyor.
              </p>
              <Button asChild>
                <Link href={`/${locale}/dashboard`}>
                  <ArrowLeft className="size-4 mr-2" />
                  Ana Panele Dön
                </Link>
              </Button>
            </div>
          </div>
        </PageContent>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageContent>
        {/* Modern overview header with KPI card content moved here */}
        <ProjectOverviewHeader project={simple} />

        {/* Tabs */}
        <div className="mb-4 border-b">
          <div className="flex gap-4">
            {[
              { id: 'overview', label: 'Genel Bakış' },
              { id: 'subs', label: 'Taşeronlar' },
              { id: 'wbs', label: 'İş Kırılımı' },
              { id: 'issues', label: 'Sorunlar' },
              { id: 'evm', label: 'Bütçe & Takvim' },
            ].map(t => (
              <button
                key={t.id}
                className={cn(
                  'px-3 py-2 text-sm border-b-2',
                  activeTab === (t.id as typeof activeTab)
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
                onClick={() => setActiveTab(t.id as typeof activeTab)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Milestones */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="size-5" />
                    İş Maddeleri
                  </span>
                  {(() => {
                    const today = new Date(nowMs)
                    const ms = getWbsTasks(taskDepth)
                    const startMs = simple?.startDate
                      ? new Date(simple.startDate).getTime()
                      : 0

                    const isOverdue = (m: WbsTask) =>
                      (m.actualDate
                        ? new Date(m.actualDate) > new Date(m.dueDate)
                        : today > new Date(m.dueDate)) && m.progress < 100

                    const daysToDue = (m: WbsTask) =>
                      Math.ceil(
                        (new Date(m.dueDate).getTime() - today.getTime()) /
                          86400000
                      )

                    const spiMs = (m: WbsTask) => {
                      const due = new Date(m.dueDate).getTime()
                      const fc = (
                        m.forecastDate
                          ? new Date(m.forecastDate)
                          : new Date(m.dueDate)
                      ).getTime()
                      const plannedDur = Math.max(1, due - startMs)
                      const forecastDur = Math.max(1, fc - startMs)
                      return plannedDur / forecastDur
                    }

                    // Dependency helpers for bloklama/bloklanma analizleri
                    const byId = new Map(ms.map(x => [x.id, x]))
                    const startMsOf = (t: WbsTask) =>
                      new Date(t.startDate).getTime()
                    const fcEndMsOf = (t: WbsTask) =>
                      t.actualDate
                        ? new Date(t.actualDate).getTime()
                        : t.forecastDate
                          ? new Date(t.forecastDate).getTime()
                          : new Date(t.dueDate).getTime()
                    const isBlocked = (t: WbsTask) => {
                      if (startMsOf(t) >= today.getTime()) return false
                      for (const pid of t.dependsOn) {
                        const p = byId.get(pid)
                        if (!p) continue
                        if (
                          !p.actualDate ||
                          new Date(p.actualDate).getTime() > today.getTime()
                        )
                          return true
                      }
                      return false
                    }
                    const isBlocking = (t: WbsTask) => {
                      if (!isOverdue(t)) return false
                      for (const sid of t.blocks) {
                        const s = byId.get(sid)
                        if (!s) continue
                        if (startMsOf(s) < today.getTime()) return true
                      }
                      return false
                    }
                    const isBlockedRisk = (t: WbsTask) => {
                      if (startMsOf(t) <= today.getTime()) return false
                      for (const pid of t.dependsOn) {
                        const p = byId.get(pid)
                        if (!p) continue
                        if (fcEndMsOf(p) > startMsOf(t)) return true
                      }
                      return false
                    }
                    const isBlockRisk = (t: WbsTask) => {
                      if (fcEndMsOf(t) <= new Date(t.dueDate).getTime())
                        return false
                      for (const sid of t.blocks) {
                        const s = byId.get(sid)
                        if (!s) continue
                        if (
                          startMsOf(s) > today.getTime() &&
                          fcEndMsOf(t) > startMsOf(s)
                        )
                          return true
                      }
                      return false
                    }

                    // Counts are computed on the same dataset as the list below
                    const allCount = ms.length
                    let overdue = 0
                    let upcoming = 0
                    let kritCount = 0
                    let riskCount = 0
                    for (const m of ms) {
                      const unfinished = m.progress < 100
                      if (unfinished && isOverdue(m)) {
                        overdue++
                        continue // Overdue overrides other categories
                      }
                      if (unfinished) {
                        const dt = daysToDue(m)
                        if (dt >= 0 && dt <= 14) upcoming++
                        const spi = spiMs(m)
                        if (spi < T.SPI.risky) kritCount++
                        else if (spi < T.SPI.good) riskCount++
                      }
                    }
                    return (
                      <div className="hidden md:flex items-center gap-2 text-sm">
                        {/* All */}
                        <button
                          className={cn(
                            'px-2 py-0.5 rounded border transition-colors',
                            !msState || msState === 'all'
                              ? 'bg-secondary text-foreground border-secondary'
                              : 'text-muted-foreground border'
                          )}
                          onClick={() => setMsState(null)}
                        >
                          Hepsi ({allCount})
                        </button>
                        {/* Gecikmiş */}
                        <button
                          className={cn(
                            'px-2 py-0.5 rounded border transition-colors',
                            msState === 'overdue'
                              ? 'bg-red-800 text-white border-red-800'
                              : 'bg-red-100 text-red-800 border-red-200'
                          )}
                          onClick={() =>
                            setMsState(msState === 'overdue' ? null : 'overdue')
                          }
                        >
                          Gecikmiş ({overdue})
                        </button>
                        {/* Kritik: normal red, SPI < 0.90 */}
                        <button
                          className={cn(
                            'px-2 py-0.5 rounded border transition-colors',
                            msState === 'critical'
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-red-100 text-red-700 border-red-200'
                          )}
                          onClick={() =>
                            setMsState(
                              msState === 'critical' ? null : 'critical'
                            )
                          }
                        >
                          Kritik ({kritCount})
                        </button>
                        {/* Riskli: orange, 0.90 ≤ SPI < 0.95 (non-overdue) */}
                        <button
                          className={cn(
                            'px-2 py-0.5 rounded border transition-colors',
                            msState === 'risky'
                              ? 'bg-orange-500 text-white border-orange-500'
                              : 'bg-orange-100 text-orange-700 border-orange-200'
                          )}
                          onClick={() =>
                            setMsState(msState === 'risky' ? null : 'risky')
                          }
                        >
                          Riskli ({riskCount})
                        </button>
                        {/* Yaklaşan */}
                        <button
                          className={cn(
                            'px-2 py-0.5 rounded border transition-colors',
                            msState === 'upcoming'
                              ? 'bg-yellow-500 text-white border-yellow-500'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          )}
                          onClick={() => {
                            setMsState(
                              msState === 'upcoming' ? null : 'upcoming'
                            )
                            setMsRange(14)
                          }}
                        >
                          ≤14g ({upcoming})
                        </button>
                        {/* Bloklanan */}
                        <button
                          className={cn(
                            'px-2 py-0.5 rounded border transition-colors',
                            msState === 'blocked'
                              ? 'bg-gray-800 text-white border-gray-800'
                              : 'bg-gray-100 text-gray-800 border-gray-200'
                          )}
                          onClick={() =>
                            setMsState(msState === 'blocked' ? null : 'blocked')
                          }
                        >
                          Bloklanan ({ms.filter(m => isBlocked(m)).length})
                        </button>
                        {/* Bloklayan */}
                        <button
                          className={cn(
                            'px-2 py-0.5 rounded border transition-colors',
                            msState === 'blocking'
                              ? 'bg-slate-600 text-white border-slate-600'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          )}
                          onClick={() =>
                            setMsState(
                              msState === 'blocking' ? null : 'blocking'
                            )
                          }
                        >
                          Bloklayan ({ms.filter(m => isBlocking(m)).length})
                        </button>
                        {/* Bloklanma Riski */}
                        <button
                          className={cn(
                            'px-2 py-0.5 rounded border transition-colors',
                            msState === 'blockedRisk'
                              ? 'bg-amber-700 text-white border-amber-700'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          )}
                          onClick={() =>
                            setMsState(
                              msState === 'blockedRisk' ? null : 'blockedRisk'
                            )
                          }
                        >
                          Bloklanma Riski (
                          {ms.filter(m => isBlockedRisk(m)).length})
                        </button>
                        {/* Bloklama Riski */}
                        <button
                          className={cn(
                            'px-2 py-0.5 rounded border transition-colors',
                            msState === 'blockRisk'
                              ? 'bg-rose-700 text-white border-rose-700'
                              : 'bg-rose-100 text-rose-800 border-rose-200'
                          )}
                          onClick={() =>
                            setMsState(
                              msState === 'blockRisk' ? null : 'blockRisk'
                            )
                          }
                        >
                          Bloklama Riski (
                          {ms.filter(m => isBlockRisk(m)).length})
                        </button>
                      </div>
                    )
                  })()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-visible">
                  {/* Global today line that cuts through all rows */}
                  {(() => {
                    // Use the same unadjusted project range as rows to avoid visual mismatch
                    const start = simple?.startDate
                      ? new Date(simple.startDate).getTime()
                      : 0
                    const end = simple?.endDate
                      ? new Date(simple.endDate).getTime()
                      : 0
                    const today = nowMs
                    const pct =
                      start && end && end > start
                        ? Math.min(
                            100,
                            Math.max(0, ((today - start) / (end - start)) * 100)
                          )
                        : 0
                    return (
                      <div
                        aria-hidden
                        className="absolute inset-y-0 pointer-events-none z-40"
                        style={{ left: `${pct}%` }}
                      >
                        <div className="h-full border-l-2 border-dashed border-sky-600/50" />
                      </div>
                    )
                  })()}
                  <div className="space-y-3">
                    {(() => {
                      const all = getWbsTasks(taskDepth)
                      const today = new Date(nowMs)
                      const filtered = all.filter(m => {
                        if (!msState || msState === 'all') return true
                        const due = new Date(m.dueDate)
                        const daysToDue = Math.ceil(
                          (due.getTime() - today.getTime()) / 86400000
                        )
                        const isOverdue =
                          (m.actualDate
                            ? new Date(m.actualDate) > due
                            : today > due) && m.progress < 100
                        const isUpcoming =
                          daysToDue >= 0 &&
                          (msRange != null
                            ? daysToDue <= msRange
                            : daysToDue <= 14) &&
                          m.progress < 100
                        if (msState === 'overdue') return isOverdue
                        if (msState === 'upcoming') return isUpcoming
                        if (
                          msState === 'blocked' ||
                          msState === 'blocking' ||
                          msState === 'blockedRisk' ||
                          msState === 'blockRisk'
                        ) {
                          // reconstruct helpers aligned with toolbar
                          const byId = new Map(all.map(x => [x.id, x]))
                          const startMsOf = (t: WbsTask) =>
                            new Date(t.startDate).getTime()
                          const fcEndMsOf = (t: WbsTask) =>
                            t.actualDate
                              ? new Date(t.actualDate).getTime()
                              : t.forecastDate
                                ? new Date(t.forecastDate).getTime()
                                : new Date(t.dueDate).getTime()
                          const isBlocked = (t: WbsTask) => {
                            if (startMsOf(t) >= nowMs) return false
                            for (const pid of t.dependsOn) {
                              const p = byId.get(pid)
                              if (!p) continue
                              if (
                                !p.actualDate ||
                                new Date(p.actualDate).getTime() > nowMs
                              )
                                return true
                            }
                            return false
                          }
                          const isBlocking = (t: WbsTask) => {
                            if (
                              !(
                                (t.actualDate
                                  ? new Date(t.actualDate) > due
                                  : today > due) && t.progress < 100
                              )
                            )
                              return false
                            for (const sid of t.blocks) {
                              const s = byId.get(sid)
                              if (!s) continue
                              if (startMsOf(s) < nowMs) return true
                            }
                            return false
                          }
                          const isBlockedRisk = (t: WbsTask) => {
                            if (startMsOf(t) <= nowMs) return false
                            for (const pid of t.dependsOn) {
                              const p = byId.get(pid)
                              if (!p) continue
                              if (fcEndMsOf(p) > startMsOf(t)) return true
                            }
                            return false
                          }
                          const isBlockRisk = (t: WbsTask) => {
                            if (fcEndMsOf(t) <= new Date(t.dueDate).getTime())
                              return false
                            for (const sid of t.blocks) {
                              const s = byId.get(sid)
                              if (!s) continue
                              if (
                                startMsOf(s) > nowMs &&
                                fcEndMsOf(t) > startMsOf(s)
                              )
                                return true
                            }
                            return false
                          }
                          if (msState === 'blocked') return isBlocked(m)
                          if (msState === 'blocking') return isBlocking(m)
                          if (msState === 'blockedRisk') return isBlockedRisk(m)
                          if (msState === 'blockRisk') return isBlockRisk(m)
                        }
                        if (msState === 'critical' || msState === 'risky') {
                          if (isOverdue) return false // overdue dominates
                          if (m.progress >= 100) return false
                          const start = simple?.startDate
                            ? new Date(simple.startDate).getTime()
                            : 0
                          const dueMs = due.getTime()
                          const fcMs = (
                            m.forecastDate ? new Date(m.forecastDate) : due
                          ).getTime()
                          const plannedDur = Math.max(1, dueMs - start)
                          const forecastDur = Math.max(1, fcMs - start)
                          const spiMs = plannedDur / forecastDur
                          if (msState === 'critical') return spiMs < T.SPI.risky
                          return spiMs >= T.SPI.risky && spiMs < T.SPI.good
                        }
                        return true
                      })
                      return filtered.map(m => {
                        // Build per-row dependency insights
                        const byId = new Map(all.map(x => [x.id, x]))
                        const startMsOf = (t: WbsTask) =>
                          new Date(t.startDate).getTime()
                        const fcEndMsOf = (t: WbsTask) =>
                          t.actualDate
                            ? new Date(t.actualDate).getTime()
                            : t.forecastDate
                              ? new Date(t.forecastDate).getTime()
                              : new Date(t.dueDate).getTime()
                        const unfinishedPredecessors = m.dependsOn
                          .map(id => byId.get(id))
                          .filter(
                            (p): p is WbsTask =>
                              !!p &&
                              (!p.actualDate ||
                                new Date(p.actualDate).getTime() > nowMs)
                          )
                        const blockingSuccessors = m.blocks
                          .map(id => byId.get(id))
                          .filter(
                            (s): s is WbsTask => !!s && startMsOf(s) < nowMs
                          )
                        const blockedRiskPreds = m.dependsOn
                          .map(id => byId.get(id))
                          .filter(
                            (p): p is WbsTask =>
                              !!p &&
                              startMsOf(m) > nowMs &&
                              fcEndMsOf(p) > startMsOf(m)
                          )
                        const blockRiskSuccs = m.blocks
                          .map(id => byId.get(id))
                          .filter(
                            (s): s is WbsTask =>
                              !!s &&
                              startMsOf(s) > nowMs &&
                              fcEndMsOf(m) > startMsOf(s)
                          )
                        const due = new Date(m.dueDate)
                        let fc = m.forecastDate
                          ? new Date(m.forecastDate)
                          : undefined
                        const delta =
                          m.slipDays ??
                          (fc
                            ? Math.round(
                                (fc.getTime() - due.getTime()) / 86400000
                              )
                            : 0)
                        const daysToDue = Math.ceil(
                          (due.getTime() - nowMs) / 86400000
                        )
                        const statusColor =
                          m.progress >= 100
                            ? 'green'
                            : delta > 0
                              ? 'red'
                              : daysToDue <= 14
                                ? 'yellow'
                                : 'blue'
                        const colorClasses =
                          statusColor === 'green'
                            ? 'bg-green-100 text-green-700'
                            : statusColor === 'red'
                              ? 'bg-red-100 text-red-700'
                              : statusColor === 'yellow'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                        const start = simple?.startDate
                          ? new Date(simple.startDate).getTime()
                          : 0
                        const end = simple?.endDate
                          ? new Date(simple.endDate).getTime()
                          : 0
                        const duePct =
                          start && end && end > start
                            ? Math.min(
                                100,
                                Math.max(
                                  0,
                                  ((due.getTime() - start) / (end - start)) *
                                    100
                                )
                              )
                            : 0
                        if (!fc && simple) {
                          const spi =
                            simple.earnedValue > 0
                              ? simple.earnedValue /
                                Math.max(simple.plannedValue, 1)
                              : 1
                          const plannedDur = Math.max(1, due.getTime() - start)
                          const estDur = plannedDur / (spi || 1)
                          fc = new Date(start + estDur)
                        }
                        const isCompleted =
                          (m.progress ?? 0) >= 100 ||
                          m.status === 'completed' ||
                          !!m.actualDate
                        const fcEff: Date | undefined = isCompleted
                          ? m.actualDate
                            ? new Date(m.actualDate)
                            : (fc as Date | undefined)
                          : (fc as Date | undefined)
                        const fcPct =
                          fcEff && start && end && end > start
                            ? Math.min(
                                100,
                                Math.max(
                                  0,
                                  (((fcEff as Date).getTime() - start) /
                                    (end - start)) *
                                    100
                                )
                              )
                            : duePct
                        const baseDate = fcEff ?? due
                        const drift = Math.round(
                          (baseDate.getTime() - due.getTime()) / 86400000
                        )
                        // label positions: push to exact edges when very close to 0%/100%
                        const planLabelPct =
                          duePct > 99.2
                            ? 100
                            : duePct < 0.8
                              ? 0
                              : Math.min(97, Math.max(3, duePct))
                        const fcLabelPct =
                          fcPct > 99.2
                            ? 100
                            : fcPct < 0.8
                              ? 0
                              : Math.min(97, Math.max(3, fcPct))
                        // today overlay for overdue visualization
                        const todayPct = (() => {
                          if (!(start && end && end > start)) return duePct
                          const t = Math.min(
                            100,
                            Math.max(0, ((nowMs - start) / (end - start)) * 100)
                          )
                          return t
                        })()
                        // color for forecast marker handled via drift check inline
                        // Consider markers visually "close" when within ~2.5% of width
                        const markersClose =
                          Math.abs(fcLabelPct - planLabelPct) < 2.5
                        const planAnchor =
                          planLabelPct > 92
                            ? 'right'
                            : planLabelPct < 8
                              ? 'left'
                              : 'center'
                        const fcAnchor =
                          fcLabelPct > 92
                            ? 'right'
                            : fcLabelPct < 8
                              ? 'left'
                              : 'center'
                        // Milestone-specific SPI using start→due vs start→forecast durations
                        // spiMs = plannedDuration / forecastDuration
                        // If forecast earlier than due -> spiMs > 1 (treat as green)
                        const plannedDurMs =
                          start && due ? Math.max(1, due.getTime() - start) : 1
                        const forecastDurMs =
                          start && fcEff
                            ? Math.max(1, (fcEff as Date).getTime() - start)
                            : plannedDurMs
                        const spiMs = plannedDurMs / Math.max(1, forecastDurMs)
                        // Base color strictly by milestone SPI thresholds (tolerance respected)
                        const spiBaseColor =
                          spiMs >= T.SPI.good
                            ? 'bg-green-600'
                            : spiMs >= T.SPI.risky
                              ? 'bg-orange-500'
                              : 'bg-red-600'
                        // Future/Delta rendering between Plan and Forecast (only future part)
                        const isLate = fcPct > duePct
                        const dashedStart = Math.max(planLabelPct, todayPct)
                        const dashedSegWidth = Math.max(
                          0,
                          fcLabelPct - dashedStart
                        )
                        // Tooltip positioning: if markers are far, show Plan above and Forecast below; if close, only Forecast shows combined tooltip below
                        const planTipPos = !markersClose
                          ? ({
                              bottom: '100%',
                              marginBottom: 8,
                            } as React.CSSProperties)
                          : ({
                              top: '100%',
                              marginTop: 8,
                            } as React.CSSProperties)
                        const fcTipPos = {
                          top: '100%',
                          marginTop: 8,
                        } as React.CSSProperties
                        return (
                          <div
                            key={m.id}
                            className="p-3 rounded-lg bg-muted/40 border"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div
                                  className={cn(
                                    'size-8 rounded-full flex items-center justify-center',
                                    colorClasses
                                  )}
                                >
                                  <Calendar className="size-4" />
                                </div>
                                {/* Insight actions active only for relevant filters (moved inline after owner) */}
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <h4 className="font-medium truncate">
                                      {m.name}
                                    </h4>
                                    {/* Removed per-task 'Kritik' label for clarity */}
                                    {m.owner && (
                                      <span className="px-1.5 py-0.5 text-[11px] rounded bg-secondary text-foreground/80">
                                        {ownerLabel(m.owner)}
                                      </span>
                                    )}
                                    {msState === 'blocked' &&
                                      unfinishedPredecessors.length > 0 && (
                                        <div className="text-xs shrink-0">
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <button
                                                className="underline text-blue-600 hover:text-blue-700"
                                                onClick={() => {
                                                  setInsightKind('blocked')
                                                  const cards =
                                                    unfinishedPredecessors.map(
                                                      p => {
                                                        const focus =
                                                          m.id.split('-p')[0]
                                                        const other =
                                                          p.id.split('-p')[0]
                                                        const fOwner =
                                                          analytics.ownership.get(
                                                            focus
                                                          )
                                                        const oOwner =
                                                          analytics.ownership.get(
                                                            other
                                                          )
                                                        return {
                                                          title:
                                                            'Neden Bloklu?',
                                                          details: `${wbsMaps.toName(other)} işi tamamlanmadı`,
                                                          ascii:
                                                            asciiBranchMarked(
                                                              focus,
                                                              other,
                                                              'blocked'
                                                            ),
                                                          focusName:
                                                            wbsMaps.toName(
                                                              focus
                                                            ),
                                                          otherName:
                                                            wbsMaps.toName(
                                                              other
                                                            ),
                                                          rel: 'blocked' as const,
                                                          focusOwner: fOwner
                                                            ? subsNameMap.get(
                                                                fOwner
                                                              ) || fOwner
                                                            : null,
                                                          otherOwner: oOwner
                                                            ? subsNameMap.get(
                                                                oOwner
                                                              ) || oOwner
                                                            : null,
                                                        }
                                                      }
                                                    )
                                                  setInsightCards(cards)
                                                  setInsightIndex(0)
                                                  setInsightOpen(true)
                                                }}
                                              >
                                                Neden Bloklu?
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              Nedenleri gör
                                            </TooltipContent>
                                          </Tooltip>
                                        </div>
                                      )}
                                    {msState === 'blocking' &&
                                      blockingSuccessors.length > 0 && (
                                        <div className="text-xs shrink-0">
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <button
                                                className="underline text-rose-600 hover:text-rose-700"
                                                onClick={() => {
                                                  setInsightKind('blocking')
                                                  const cards =
                                                    blockingSuccessors.map(
                                                      s => {
                                                        const focus =
                                                          m.id.split('-p')[0]
                                                        const other =
                                                          s.id.split('-p')[0]
                                                        const fOwner =
                                                          analytics.ownership.get(
                                                            focus
                                                          )
                                                        const oOwner =
                                                          analytics.ownership.get(
                                                            other
                                                          )
                                                        return {
                                                          title:
                                                            'Neyi Blokluyor?',
                                                          details: `${wbsMaps.toName(other)} başlatılamıyor`,
                                                          ascii:
                                                            asciiBranchMarked(
                                                              focus,
                                                              other,
                                                              'blocking'
                                                            ),
                                                          focusName:
                                                            wbsMaps.toName(
                                                              focus
                                                            ),
                                                          otherName:
                                                            wbsMaps.toName(
                                                              other
                                                            ),
                                                          rel: 'blocking' as const,
                                                          focusOwner: fOwner
                                                            ? subsNameMap.get(
                                                                fOwner
                                                              ) || fOwner
                                                            : null,
                                                          otherOwner: oOwner
                                                            ? subsNameMap.get(
                                                                oOwner
                                                              ) || oOwner
                                                            : null,
                                                        }
                                                      }
                                                    )
                                                  setInsightCards(cards)
                                                  setInsightIndex(0)
                                                  setInsightOpen(true)
                                                }}
                                              >
                                                Neyi Blokluyor?
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              Etkilediği işler
                                            </TooltipContent>
                                          </Tooltip>
                                        </div>
                                      )}
                                    {msState === 'blockedRisk' &&
                                      blockedRiskPreds.length > 0 && (
                                        <div className="text-xs shrink-0">
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <button
                                                className="underline text-amber-700 hover:text-amber-800"
                                                onClick={() => {
                                                  setInsightKind('blockedRisk')
                                                  const cards =
                                                    blockedRiskPreds.map(p => {
                                                      const focus =
                                                        m.id.split('-p')[0]
                                                      const other =
                                                        p.id.split('-p')[0]
                                                      const fOwner =
                                                        analytics.ownership.get(
                                                          focus
                                                        )
                                                      const oOwner =
                                                        analytics.ownership.get(
                                                          other
                                                        )
                                                      return {
                                                        title:
                                                          'Neden Bloklanabilir?',
                                                        details: `${wbsMaps.toName(other)} forecast bitişi bu işin planlanan başlangıcını aşıyor`,
                                                        ascii:
                                                          asciiBranchMarked(
                                                            focus,
                                                            other,
                                                            'blockedRisk'
                                                          ),
                                                        focusName:
                                                          wbsMaps.toName(focus),
                                                        otherName:
                                                          wbsMaps.toName(other),
                                                        rel: 'blockedRisk' as const,
                                                        focusOwner: fOwner
                                                          ? subsNameMap.get(
                                                              fOwner
                                                            ) || fOwner
                                                          : null,
                                                        otherOwner: oOwner
                                                          ? subsNameMap.get(
                                                              oOwner
                                                            ) || oOwner
                                                          : null,
                                                      }
                                                    })
                                                  setInsightCards(cards)
                                                  setInsightIndex(0)
                                                  setInsightOpen(true)
                                                }}
                                              >
                                                Neden Bloklanabilir?
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              Öngörülen nedenler
                                            </TooltipContent>
                                          </Tooltip>
                                        </div>
                                      )}
                                    {msState === 'blockRisk' &&
                                      blockRiskSuccs.length > 0 && (
                                        <div className="text-xs shrink-0">
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <button
                                                className="underline text-rose-700 hover:text-rose-800"
                                                onClick={() => {
                                                  setInsightKind('blockRisk')
                                                  const cards =
                                                    blockRiskSuccs.map(s => {
                                                      const focus =
                                                        m.id.split('-p')[0]
                                                      const other =
                                                        s.id.split('-p')[0]
                                                      const fOwner =
                                                        analytics.ownership.get(
                                                          focus
                                                        )
                                                      const oOwner =
                                                        analytics.ownership.get(
                                                          other
                                                        )
                                                      return {
                                                        title:
                                                          'Neyi Bloklayabilir?',
                                                        details: `${wbsMaps.toName(other)} planlanan başlangıcını aşma riski`,
                                                        ascii:
                                                          asciiBranchMarked(
                                                            focus,
                                                            other,
                                                            'blockRisk'
                                                          ),
                                                        focusName:
                                                          wbsMaps.toName(focus),
                                                        otherName:
                                                          wbsMaps.toName(other),
                                                        rel: 'blockRisk' as const,
                                                        focusOwner: fOwner
                                                          ? subsNameMap.get(
                                                              fOwner
                                                            ) || fOwner
                                                          : null,
                                                        otherOwner: oOwner
                                                          ? subsNameMap.get(
                                                              oOwner
                                                            ) || oOwner
                                                          : null,
                                                      }
                                                    })
                                                  setInsightCards(cards)
                                                  setInsightIndex(0)
                                                  setInsightOpen(true)
                                                }}
                                              >
                                                Neyi Bloklayabilir?
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              Riskli ardıllar
                                            </TooltipContent>
                                          </Tooltip>
                                        </div>
                                      )}
                                  </div>
                                  {typeof m.blockers === 'number' &&
                                    m.blockers > 0 && (
                                      <div className="text-xs text-muted-foreground">
                                        Engelleyici: {m.blockers}
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div
                                  className={cn(
                                    'text-sm font-semibold',
                                    drift > 0
                                      ? 'text-red-600'
                                      : drift < 0
                                        ? 'text-green-700'
                                        : 'text-muted-foreground'
                                  )}
                                >
                                  {drift >= 0 ? '+' : ''}
                                  {drift}g
                                </div>
                              </div>
                            </div>
                            <div className="mt-2">
                              {/* Use a named group so both tooltips can react to the same hover target */}
                              <div className="relative group group/msrow">
                                {/* Track */}
                                <div className="relative h-2 w-full">
                                  {/* track background + clipped fills */}
                                  <div className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                                    {/* Progress fill: completed→actual, in‑progress→plan (no gap before dashed) */}
                                    <div
                                      className={cn(
                                        'h-full rounded-full',
                                        spiBaseColor
                                      )}
                                      style={{
                                        width: `${isCompleted ? fcPct : Math.min(planLabelPct, fcLabelPct)}%`,
                                      }}
                                    />
                                    {/* Plan↔Forecast difference (from plan to forecast) */}
                                    {!isCompleted && dashedSegWidth > 0 && (
                                      <div
                                        className="absolute inset-y-0 left-0 z-10"
                                        style={{
                                          left: `${planLabelPct}%`,
                                          width: `${Math.max(0, fcLabelPct - planLabelPct)}%`,
                                          // Denser colored portion: thicker color band, thinner gap
                                          backgroundImage: isLate
                                            ? 'repeating-linear-gradient(135deg, rgba(239,68,68,0.9) 0, rgba(239,68,68,0.9) 12px, rgba(239,68,68,0.0) 12px, rgba(239,68,68,0.0) 16px)'
                                            : 'repeating-linear-gradient(135deg, rgba(22,163,74,0.9) 0, rgba(22,163,74,0.9) 12px, rgba(22,163,74,0.0) 12px, rgba(22,163,74,0.0) 16px)',
                                        }}
                                      />
                                    )}
                                  </div>
                                  {/* Removed per-bar today line; using global dashed line */}
                                  {/* Plan marker */}
                                  <div
                                    className="absolute"
                                    style={{
                                      left: `calc(${planLabelPct}% - 6px)`,
                                      top: markersClose ? -10 : -6,
                                    }}
                                  >
                                    {/* Avoid nested default group collisions; name the inner group */}
                                    <div
                                      className="relative group/marker z-50"
                                      onMouseEnter={() =>
                                        setHoveredMs(
                                          markersClose
                                            ? `combo:${m.id}`
                                            : `plan:${m.id}`
                                        )
                                      }
                                      onMouseLeave={() => setHoveredMs(null)}
                                    >
                                      <div className="size-3.5 rounded-full bg-gray-300 border border-gray-500 shadow-md ring-2 ring-white dark:ring-gray-900" />
                                      {!markersClose && (
                                        <div
                                          className={cn(
                                            'absolute z-50 px-2 py-1 rounded-md border bg-popover text-popover-foreground text-xs shadow pointer-events-none whitespace-nowrap',
                                            hoveredMs === `plan:${m.id}`
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                            planAnchor === 'center' &&
                                              'left-1/2 -translate-x-1/2',
                                            planAnchor === 'left' && 'left-0',
                                            planAnchor === 'right' && 'right-0'
                                          )}
                                          style={planTipPos}
                                        >
                                          Plan:{' '}
                                          {due.toLocaleDateString('tr-TR')}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {/* Forecast marker */}
                                  {fc && (
                                    <div
                                      className="absolute"
                                      style={{
                                        left: `calc(${fcLabelPct}% - 6px)`,
                                        top: markersClose ? undefined : -6,
                                        bottom: markersClose ? -10 : undefined,
                                      }}
                                    >
                                      <div
                                        className="relative group/marker z-50"
                                        onMouseEnter={() =>
                                          setHoveredMs(
                                            markersClose
                                              ? `combo:${m.id}`
                                              : `fc:${m.id}`
                                          )
                                        }
                                        onMouseLeave={() => setHoveredMs(null)}
                                      >
                                        <div
                                          className={cn(
                                            'size-3.5 rounded-full border shadow-md ring-2 ring-white dark:ring-gray-900',
                                            drift > 0
                                              ? 'bg-red-600 border-red-700'
                                              : 'bg-emerald-600 border-emerald-700'
                                          )}
                                        />
                                        <div
                                          className={cn(
                                            'absolute z-50 px-2 py-1 rounded-md border bg-popover text-popover-foreground text-xs shadow pointer-events-none whitespace-nowrap',
                                            hoveredMs === `fc:${m.id}` ||
                                              (markersClose &&
                                                hoveredMs === `combo:${m.id}`)
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                            fcAnchor === 'center' &&
                                              'left-1/2 -translate-x-1/2',
                                            fcAnchor === 'left' && 'left-0',
                                            fcAnchor === 'right' && 'right-0'
                                          )}
                                          style={fcTipPos}
                                        >
                                          {markersClose ? (
                                            <span>
                                              Plan:{' '}
                                              {due.toLocaleDateString('tr-TR')}{' '}
                                              •{' '}
                                              {isCompleted
                                                ? 'Gerçek'
                                                : 'Tahmin'}
                                              :{' '}
                                              {(fc as Date).toLocaleDateString(
                                                'tr-TR'
                                              )}
                                            </span>
                                          ) : isCompleted ? (
                                            <span>
                                              Gerçek:{' '}
                                              {(fc as Date).toLocaleDateString(
                                                'tr-TR'
                                              )}
                                            </span>
                                          ) : (
                                            <span>
                                              Tahmin:{' '}
                                              {(fc as Date).toLocaleDateString(
                                                'tr-TR'
                                              )}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {/* Remove duplicate overdue overlay (already rendered above) */}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Son Aktiviteler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {detailed.recentActivities.map(activity => {
                    const config = activityTypeConfig[activity.type]
                    const Icon = config.icon

                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg construction-hover"
                      >
                        <div
                          className={cn(
                            'size-8 rounded-full flex items-center justify-center',
                            config.bg
                          )}
                        >
                          <Icon className={cn('size-4', config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">
                            {activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground mb-1">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{activity.user}</span>
                            <span>•</span>
                            <span>
                              {new Date(activity.timestamp).toLocaleString(
                                'tr-TR'
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'subs' && (
          <div className="mb-8">
            <SubcontractorOverview
              data={subcontractorOverviewData}
              onSelect={id => {
                setSelectedOwner(id)
                setActiveTab('wbs')
              }}
            />
          </div>
        )}

        {activeTab === 'wbs' && (
          <div className="mb-8">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex-1 max-w-[320px]">
                <Input
                  placeholder={tCommon('search')}
                  value={wbsQuery}
                  onChange={e => setWbsQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={cn(
                    'px-2 py-1 text-xs rounded border',
                    view === 'contract'
                      ? 'bg-primary text-white border-primary'
                      : 'text-muted-foreground'
                  )}
                  onClick={() => setView('contract')}
                >
                  Kontrat Düzeyi
                </button>
                <button
                  className={cn(
                    'px-2 py-1 text-xs rounded border',
                    view === 'leaf'
                      ? 'bg-primary text-white border-primary'
                      : 'text-muted-foreground'
                  )}
                  onClick={() => setView('leaf')}
                >
                  Tüm Yapraklar
                </button>
              </div>
            </div>
            <WbsHealthTree
              root={wbsRoot}
              ownership={analytics.ownership}
              nodeHealth={analytics.nodeHealth}
              onSelectNode={id => setSelectedNodeId(id)}
              filterOwnerId={selectedOwner}
              view={view}
              selectedNodeId={selectedNodeId}
              searchQuery={wbsQuery}
            />
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="mb-8">
            <IssueList
              issues={issues}
              ownership={analytics.ownership}
              mode="owner"
              filterOwnerId={selectedOwner}
            />
          </div>
        )}

        {activeTab === 'evm' && (
          <div className="mb-8">
            <BudgetSchedulePanel
              rootNodeId={wbsRoot.id}
              sums={analytics.sums}
            />
          </div>
        )}
        {/* --- end tabs content --- */}

        {/* Insight Modal for dependency explorations */}
        <Dialog open={insightOpen} onOpenChange={setInsightOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HelpCircle className="size-4" />
                {insightCards[insightIndex]?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="p-3">
              {insightCards.length > 0 && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      ▶ İncelenen: {insightCards[insightIndex]?.focusName}
                      {insightCards[insightIndex]?.focusOwner && (
                        <span className="opacity-70">
                          ({insightCards[insightIndex]?.focusOwner})
                        </span>
                      )}
                    </span>
                    {insightCards[insightIndex]?.rel === 'blocking' ||
                    insightCards[insightIndex]?.rel === 'blockRisk' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        ● Etkilenen: {insightCards[insightIndex]?.otherName}
                        {insightCards[insightIndex]?.otherOwner && (
                          <span className="opacity-70">
                            ({insightCards[insightIndex]?.otherOwner})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                        ◆ Etkileyen: {insightCards[insightIndex]?.otherName}
                        {insightCards[insightIndex]?.otherOwner && (
                          <span className="opacity-70">
                            ({insightCards[insightIndex]?.otherOwner})
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {insightCards[insightIndex]?.details}
                  </div>
                  <pre className="font-mono text-xs md:text-sm bg-muted/40 p-3 rounded border overflow-auto whitespace-pre">
                    {insightCards[insightIndex]?.ascii}
                  </pre>
                </div>
              )}
            </div>
            <DialogFooter>
              <div className="flex items-center justify-between w-full">
                <button
                  className="px-2 py-1 text-xs rounded border"
                  disabled={insightIndex <= 0}
                  onClick={() => setInsightIndex(i => Math.max(0, i - 1))}
                >
                  <span className="inline-flex items-center gap-1">
                    <ChevronLeft className="size-4" /> Önceki
                  </span>
                </button>
                <div className="text-xs text-muted-foreground">
                  {insightCards.length > 0
                    ? `${insightIndex + 1} / ${insightCards.length}`
                    : '0 / 0'}
                </div>
                <button
                  className="px-2 py-1 text-xs rounded border"
                  disabled={insightIndex >= insightCards.length - 1}
                  onClick={() =>
                    setInsightIndex(i =>
                      Math.min(insightCards.length - 1, i + 1)
                    )
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    Sonraki <ChevronRight className="size-4" />
                  </span>
                </button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Team Members */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardHat className="size-5" />
              Ekip Üyeleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={detailed.teamMembers}
              columns={teamColumns}
              emptyMessage={t('empty.team')}
            />
          </CardContent>
        </Card>
      </PageContent>
    </PageContainer>
  )
}

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
// tooltips/progress components not used here
import { PageContainer, PageContent } from '@/components/layout/page-container'
import { DataTable, Column } from '@/components/data/data-table'
import { SubcontractorsTab } from '@/components/projects/subcontractors-tab'
import { WbsTreePanel } from '@/components/projects/wbs-tree-panel'
import { IssueList } from '@/components/projects/IssueList'
import { WbsPathTooltip } from '@/components/projects/wbs-path-tooltip'
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
import {
  computeFsForecast,
  computeScheduleWithAgg,
  type ScheduleNode,
} from '@/lib/wbs-schedule'
import { mockSubcontractors } from '@/components/projects/data/mock-subcontractors'
import {
  generateBudgetMetricsFromWbs,
  generateWbsScheduleData,
} from '@/lib/mock-data'
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
  status: 'active' | 'on-leave' | 'off-site'
  tasksCompleted?: number
  hoursWorked?: number
  subcontractor?: string | null
  phone?: string | null
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
    id: 'subcontractor',
    header: 'Taşeron',
    accessor: (row: TeamMember) => row.subcontractor ?? '-',
    sortable: true,
  },
  {
    id: 'phone',
    header: 'Telefon',
    accessor: (row: TeamMember) => row.phone ?? '-',
    sortable: false,
  },
  {
    id: 'status',
    header: 'Durum',
    accessor: (row: TeamMember) => (
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
              children: [
                { id: 'foundation-formwork', name: 'Temel Kalıp' },
                { id: 'foundation-rebar', name: 'Temel Donatı' },
                { id: 'foundation-concrete', name: 'Temel Beton' },
              ],
            },
            {
              id: 'columns',
              name: 'Kolonlar',
              assignedSubcontractorId: 'sub-construction-1',
              children: [
                { id: 'columns-rebar', name: 'Kolon Donatı Ana' },
                { id: 'columns-formwork', name: 'Kolon Kalıp Ana' },
                { id: 'columns-concrete', name: 'Kolon Beton Ana' },
              ],
            },
            {
              id: 'slabs',
              name: 'Döşemeler',
              assignedSubcontractorId: 'sub-construction-1',
              children: [
                { id: 'slab-formwork', name: 'Döşeme Kalıp' },
                { id: 'slab-rebar', name: 'Döşeme Donatı' },
                { id: 'slab-concrete', name: 'Döşeme Beton' },
              ],
            },
          ],
        },
        {
          id: 'mechanical',
          name: 'Mekanik',
          assignedSubcontractorId: 'sub-mechanical-1',
          children: [
            {
              id: 'hvac',
              name: 'HVAC',
              children: [
                { id: 'hvac-ducting', name: 'Ducting' },
                { id: 'hvac-ahu', name: 'AHU Montaj' },
                { id: 'hvac-insulation', name: 'İzolasyon' },
              ],
            },
            {
              id: 'plumbing',
              name: 'Sıhhi Tesisat',
              children: [
                { id: 'plumb-rough', name: 'Rough-in' },
                { id: 'plumb-fixtures', name: 'Armatür Montaj' },
                { id: 'plumb-test', name: 'Basınç Testi' },
              ],
            },
            { id: 'fire', name: 'Yangın' },
            { id: 'sprinkler', name: 'Sprinkler' },
          ],
        },
        {
          id: 'electrical',
          name: 'Elektrik',
          assignedSubcontractorId: 'sub-electrical-1',
          children: [
            {
              id: 'strong-power',
              name: 'Güçlü Akım',
              children: [
                { id: 'sp-main-panel', name: 'Ana Pano' },
                { id: 'sp-floor-panels', name: 'Kat Panoları' },
                { id: 'sp-cable-trays', name: 'Kablo Kanalları' },
              ],
            },
            {
              id: 'weak-power',
              name: 'Zayıf Akım',
              children: [
                { id: 'wp-data', name: 'Veri Kablolama' },
                { id: 'wp-security', name: 'Güvenlik Sistemleri' },
              ],
            },
            { id: 'lighting', name: 'Aydınlatma' },
            {
              id: 'automation',
              name: 'Otomasyon Sistemleri',
              children: [
                { id: 'automation-controls', name: 'Kontrol Panelleri' },
                { id: 'automation-integration', name: 'Saha Entegrasyonu' },
              ],
            },
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

  const projectTiming = React.useMemo(() => {
    const ps = simple?.startDate
      ? new Date(simple.startDate).getTime()
      : Date.now()
    const pe = simple?.endDate
      ? new Date(simple.endDate).getTime()
      : ps + 120 * 86400000
    const span = Math.max(1, pe - ps)
    const plannedCutoff = ps + span * 0.65
    const dataDate = Math.min(Date.now(), plannedCutoff)
    return { start: ps, end: pe, dataDate }
  }, [simple?.startDate, simple?.endDate])

  const metricsById = React.useMemo(
    () =>
      generateBudgetMetricsFromWbs(
        wbsRoot,
        projectTiming.start,
        projectTiming.end,
        projectTiming.dataDate
      ),
    [wbsRoot, projectTiming]
  )

  const wbsSchedule = React.useMemo(
    () =>
      generateWbsScheduleData(
        wbsRoot,
        projectTiming.start,
        projectTiming.end,
        projectTiming.dataDate,
        metricsById
      ),
    [wbsRoot, projectTiming, metricsById]
  )

  const issues: Issue[] = React.useMemo(
    () => [
      {
        id: 'i1',
        nodeId: 'foundation',
        type: 'planned',
        status: 'in-progress',
        costOver: 40000,
        subcontractorId: 'sub-construction-1',
        responsibleId: 'person-murat-demir',
        responsibleName: 'Murat Demir',
        reportedBy: 'Ayşe Kaya',
        reportedAt: '2024-08-14',
        title: 'Temelde beton sarfiyatı öngörünün üzerinde',
      },
      {
        id: 'i2',
        nodeId: 'hvac-ducting',
        type: 'instant',
        status: 'open',
        daysLate: 8,
        subcontractorId: 'sub-mechanical-1',
        responsibleId: 'person-hasan-kurt',
        responsibleName: 'Hasan Kurt',
        reportedBy: 'Selin Acar',
        reportedAt: '2024-08-09',
        title: 'HVAC kanal montajında koordinasyon problemi',
      },
      {
        id: 'i3',
        nodeId: 'electrical',
        type: 'acceptance',
        status: 'resolved',
        costOver: 12000,
        subcontractorId: 'sub-electrical-1',
        responsibleId: 'person-emre-ates',
        responsibleName: 'Emre Ateş',
        reportedBy: 'Nihat Korkmaz',
        reportedAt: '2024-07-28',
        title: 'Elektrik pano revizyonu ek maliyet yarattı',
      },
      {
        id: 'i4',
        nodeId: 'mechanical',
        type: 'planned',
        status: 'on-hold',
        daysLate: 3,
        subcontractorId: 'sub-mechanical-1',
        responsibleId: 'person-hasan-kurt',
        responsibleName: 'Hasan Kurt',
        reportedBy: 'Merve Demet',
        reportedAt: '2024-08-17',
        title: 'Mekanik sahada saha erişim kısıtı',
      },
    ],
    []
  )

  const analytics = React.useMemo(
    () => buildAnalytics(wbsRoot, metricsById, issues),
    [wbsRoot, metricsById, issues]
  )

  // Top-level WBS items (contract boundaries) per subcontractor for hover panel
  const subcontractorResponsibilities = React.useMemo(() => {
    type Item = { id: string; name: string }
    const map = new Map<string, Item[]>()
    const walk = (node: WbsNode, parentOwner: string | null) => {
      const owner = analytics.ownership.get(node.id) ?? null
      const isBoundary = owner && owner !== parentOwner
      if (isBoundary && owner) {
        const arr = map.get(owner) ?? []
        arr.push({ id: node.id, name: node.name || node.id })
        map.set(owner, arr)
      }
      node.children?.forEach(c => walk(c, owner))
    }
    walk(wbsRoot, null)
    const list = Array.from(map.entries()).map(([id, items]) => ({
      id,
      name: subsNameMap.get(id) || id,
      items,
    }))
    // Keep stable order: by name
    list.sort((a, b) => a.name.localeCompare(b.name, 'tr'))
    return list
  }, [wbsRoot, analytics.ownership, subsNameMap])

  // Configurable WBS depth for tasks shown in the timeline (default: one below top)
  const taskDepth = React.useMemo(() => {
    const qp = searchParams.get('taskDepth')
    const v = qp ? Number(qp) : 2
    return Number.isFinite(v) ? Math.max(0, Math.floor(v)) : 2
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
  const todayOverride =
    searchParams.get('today') || searchParams.get('dataDate')
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
      const start = rawStart
      const end = rawEnd
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
      for (let ni = 0; ni < nodes.length; ni++) {
        const l = nodes[ni]
        for (let p = 0; p < taskParts; p++) {
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
          // WBS-backed schedule rule (FS-only, allow_early_start=false):
          // Başlamamış leaf için forecast başlangıcı baseline'dan erken olamaz.
          // Biz finish'i işliyoruz; bu durumda finish de baseline'dan erken olmamalı.
          const notStarted = s > nowMs && !actual
          if (notStarted && forecast && forecast < e) {
            forecast = e
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
      // Sanity: rare cases where start might drift after due; clamp start before due
      for (let i = 0; i < tasks.length; i++) {
        const sMs = new Date(tasks[i].startDate).getTime()
        const dMs = new Date(tasks[i].dueDate).getTime()
        if (sMs > dMs) {
          const safe = Math.max(start, dMs - Math.floor(total * 0.08)) // ~%8 proje süresi
          tasks[i].startDate = new Date(safe).toISOString()
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
      // Ensure at least one task starts exactly at project start (visual anchor)
      if (tasks.length > 0) {
        // Choose the globally earliest start, regardless of completion state
        let anchorIdx = 0
        for (let i = 1; i < startTimes.length; i++) {
          if (startTimes[i] < startTimes[anchorIdx]) anchorIdx = i
        }
        if (startTimes[anchorIdx] !== start) {
          tasks[anchorIdx].startDate = new Date(start).toISOString()
          startTimes[anchorIdx] = start
        }
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
      const baseOf = baseTaskId
      // Track base-node predecessor→successor pairs to avoid duplicate relations across phases
      const pairSeen = new Set<string>()
      // helper: detect if adding edge a(dependsOn)->b creates a cycle
      const reaches = (fromId: string, targetId: string): boolean => {
        const seen = new Set<string>()
        const stack = [fromId]
        while (stack.length) {
          const cur = stack.pop() as string
          if (cur === targetId) return true
          if (seen.has(cur)) continue
          seen.add(cur)
          const ji = idIndex.get(cur)
          if (ji == null) continue
          for (const pid of tasks[ji].dependsOn) stack.push(pid)
        }
        return false
      }
      for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i]
        const start = startTimes[i]
        // candidate predecessors: tasks that end before this task starts
        const preds: number[] = []
        for (let j = 0; j < i; j++) {
          if (endTimes[j] <= start && baseOf(tasks[j].id) !== baseOf(t.id))
            preds.push(j)
        }
        // choose up to 2 predecessors based on index pattern
        const want = i % 6 === 0 ? 2 : i % 3 === 0 ? 1 : 0
        for (let k = 0; k < Math.min(want, preds.length); k++) {
          const pj = preds[(i + k) % preds.length]
          const pid = tasks[pj].id
          const key = `${baseOf(pid)}->${baseOf(t.id)}`
          if (pairSeen.has(key)) continue
          if (!t.dependsOn.includes(pid) && !reaches(pid, t.id)) {
            t.dependsOn.push(pid)
            pairSeen.add(key)
          }
        }
      }
      // Ensure invariant-compliant, deterministic examples per category for filters
      ;(() => {
        const WANT = { blocked: 2, blocking: 2, blockedRisk: 2, blockRisk: 2 }

        const startMsOf = (x: WbsTask) => new Date(x.startDate).getTime()
        const dueMsOf = (x: WbsTask) => new Date(x.dueDate).getTime()
        const fcEndMsOf = (x: WbsTask) =>
          x.actualDate
            ? new Date(x.actualDate).getTime()
            : x.forecastDate
              ? new Date(x.forecastDate).getTime()
              : new Date(x.dueDate).getTime()

        const unfinished = tasks
          .map((t, i) => ({ t, i }))
          .filter(x => !x.t.actualDate)
        const started = unfinished.filter(x => startMsOf(x.t) < nowMs)
        const overdue = unfinished.filter(x => dueMsOf(x.t) < nowMs)
        const future = unfinished.filter(x => startMsOf(x.t) > nowMs)

        // BLOCKED: first WANT.blocked from started
        for (let k = 0; k < Math.min(WANT.blocked, started.length); k++) {
          const bi = started[k].i
          // choose an unfinished predecessor deterministically: closest prior unfinished
          let pj = -1
          for (let j = bi - 1; j >= 0; j--) {
            if (
              !tasks[j].actualDate &&
              baseOf(tasks[j].id) !== baseOf(tasks[bi].id)
            ) {
              pj = j
              break
            }
          }
          if (pj === -1 && unfinished.length > 0) {
            const alt = unfinished.find(
              x => baseOf(tasks[x.i].id) !== baseOf(tasks[bi].id)
            )
            if (alt) pj = alt.i
          }
          if (pj >= 0) {
            const pid = tasks[pj].id
            const key = `${baseOf(pid)}->${baseOf(tasks[bi].id)}`
            if (
              !pairSeen.has(key) &&
              !tasks[bi].dependsOn.includes(pid) &&
              !reaches(pid, tasks[bi].id)
            ) {
              tasks[bi].dependsOn.push(pid)
              pairSeen.add(key)
            }
          }
        }

        // BLOCKING: first WANT.blocking from overdue
        for (let k = 0; k < Math.min(WANT.blocking, overdue.length); k++) {
          const ai = overdue[k].i
          const succ = started.find(
            x => x.i !== ai && baseOf(tasks[x.i].id) !== baseOf(tasks[ai].id)
          )
          if (succ) {
            const aid = tasks[ai].id
            const key = `${baseOf(aid)}->${baseOf(tasks[succ.i].id)}`
            if (
              !pairSeen.has(key) &&
              !tasks[succ.i].dependsOn.includes(aid) &&
              !reaches(aid, tasks[succ.i].id)
            ) {
              tasks[succ.i].dependsOn.push(aid)
              pairSeen.add(key)
            }
          }
        }

        // BLOCKED RISK: first WANT.blockedRisk from future
        for (let k = 0; k < Math.min(WANT.blockedRisk, future.length); k++) {
          const ti = future[k].i
          const t = tasks[ti]
          const pred = unfinished.find(
            x => x.i !== ti && baseOf(tasks[x.i].id) !== baseOf(tasks[ti].id)
          )
          if (pred) {
            const tStart = startMsOf(t)
            const p = tasks[pred.i]
            if (fcEndMsOf(p) <= tStart) {
              p.forecastDate = new Date(tStart + 2 * 86400000).toISOString()
            }
            const key = `${baseOf(p.id)}->${baseOf(t.id)}`
            if (
              !pairSeen.has(key) &&
              !t.dependsOn.includes(p.id) &&
              !reaches(p.id, t.id)
            ) {
              t.dependsOn.push(p.id)
              pairSeen.add(key)
            }
          }
        }

        // BLOCK RISK: pair unfinished task with future-start successor
        for (let k = 0; k < Math.min(WANT.blockRisk, future.length); k++) {
          const s = tasks[future[k].i]
          const cand = unfinished.find(
            x => x.i !== future[k].i && baseOf(tasks[x.i].id) !== baseOf(s.id)
          )
          if (!cand) break
          const t = tasks[cand.i]
          const sStart = startMsOf(s)
          if (fcEndMsOf(t) <= sStart) {
            const due = new Date(t.dueDate).getTime()
            const newFc = Math.max(sStart + 2 * 86400000, due + 86400000)
            t.forecastDate = new Date(newFc).toISOString()
            t.slipDays = Math.round((newFc - due) / 86400000)
          }
          const key = `${baseOf(t.id)}->${baseOf(s.id)}`
          if (
            !pairSeen.has(key) &&
            !s.dependsOn.includes(t.id) &&
            !reaches(t.id, s.id)
          ) {
            s.dependsOn.push(t.id)
            pairSeen.add(key)
          }
        }
      })()
      // Sanitize: a finished task shouldn't be blocked by unfinished predecessors
      // Keep only predecessors that are already finished by 'now'
      for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i]
        if (t.progress >= 100) {
          t.dependsOn = t.dependsOn.filter(pid => {
            const pj = idIndex.get(pid)
            if (pj == null) return false
            const p = tasks[pj]
            return !!p.actualDate && new Date(p.actualDate).getTime() <= nowMs
          })
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
      // Apply FS-only forecast calculator (WBS-backed schedule rules)
      try {
        const fsInputs = tasks.map(t => {
          const bs = new Date(t.startDate).getTime()
          const bf = new Date(t.dueDate).getTime()
          const started = bs < nowMs && !t.actualDate
          const actualStart = started ? bs : undefined
          const actualFinish = t.actualDate
            ? new Date(t.actualDate).getTime()
            : undefined
          const baseId = baseTaskId(t.id)
          const met = metricsById.get(baseId)
          const spiHint =
            met && met.pv && met.pv > 0 ? (met.ev || 0) / met.pv : undefined
          return {
            id: t.id,
            baselineStart: bs,
            baselineFinish: bf,
            actualStart,
            actualFinish,
            spiHint,
            predecessors: (t.dependsOn || []).map(id => ({
              taskId: id,
              lagDays: 0,
            })),
          }
        })
        const fsRes = computeFsForecast(fsInputs, {
          dataDate: nowMs,
          allowEarlyStart: false,
        })
        for (const t of tasks) {
          if (!t.actualDate) {
            const r = fsRes.get(t.id)
            if (r?.forecastFinish) {
              t.forecastDate = new Date(r.forecastFinish).toISOString()
              const dueMs = new Date(t.dueDate).getTime()
              t.slipDays = Math.round(
                ((r.forecastFinish as number) - dueMs) / 86400000
              )
            }
          } else {
            // Completed: keep actual as-is
          }
        }
      } catch {}
      // Spread clustered forecasts across the remaining timeline using SPI-biased jitter
      try {
        const baseOf = baseTaskId
        const spanFuture = Math.max(30 * 86400000, end - nowMs - 5 * 86400000)
        for (const t of tasks) {
          if (t.actualDate) continue
          const fcMs = t.forecastDate
            ? new Date(t.forecastDate).getTime()
            : new Date(t.dueDate).getTime()
          // If forecast is within ~14 gün of today, push it into the future window with SPI bias
          if (fcMs <= nowMs + 14 * 86400000) {
            const met = metricsById.get(baseOf(t.id))
            const spiHint =
              met && met.pv && met.pv > 0 ? (met.ev || 0) / met.pv : 1
            const u =
              ((Array.from(t.id).reduce(
                (a, c) => (a * 33 + c.charCodeAt(0)) >>> 0,
                0
              ) %
                1000) +
                1) /
              1000
            // Bias: spi<1 -> geçe doğru (daha büyük), spi>1 -> bugüne yakın (daha küçük)
            const exp = Math.min(2.2, Math.max(0.5, 1.4 - (spiHint - 1)))
            const biased = Math.pow(u, exp)
            const newFc = Math.min(
              end - 2 * 86400000,
              nowMs + 7 * 86400000 + Math.round(biased * spanFuture)
            )
            const finalFc = Math.max(newFc, new Date(t.dueDate).getTime())
            t.forecastDate = new Date(finalFc).toISOString()
            const dueMs = new Date(t.dueDate).getTime()
            t.slipDays = Math.round((finalFc - dueMs) / 86400000)
          }
        }
      } catch {}
      // Ensure at least one task finishes exactly at project end (right edge)
      try {
        if (tasks.length > 0 && end > start) {
          let bestIdx = -1
          let bestFinish = -Infinity
          for (let i = 0; i < tasks.length; i++) {
            const t = tasks[i]
            const fin = t.actualDate
              ? new Date(t.actualDate).getTime()
              : t.forecastDate
                ? new Date(t.forecastDate).getTime()
                : new Date(t.dueDate).getTime()
            if (fin > bestFinish) {
              bestFinish = fin
              bestIdx = i
            }
          }
          if (bestIdx >= 0 && bestFinish < end) {
            tasks[bestIdx].forecastDate = new Date(end).toISOString()
            const dueMs = new Date(tasks[bestIdx].dueDate).getTime()
            tasks[bestIdx].slipDays = Math.round((end - dueMs) / 86400000)
          }
        }
      } catch {}
      // Sort for display: earliest start first (stable tie‑breakers)
      tasks.sort((a, b) => {
        const as = new Date(a.startDate).getTime()
        const bs = new Date(b.startDate).getTime()
        if (as !== bs) return as - bs
        const ad = new Date(a.dueDate).getTime()
        const bd = new Date(b.dueDate).getTime()
        if (ad !== bd) return ad - bd
        return a.name.localeCompare(b.name)
      })
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
      nowMs,
    ]
  )

  // Aggregate project-level forecast finish using FS schedule on current depth tasks
  const projectForecastFinishBySchedule = React.useMemo(() => {
    try {
      const tasks = getWbsTasks(taskDepth)
      const root: ScheduleNode = {
        id: 'root-fs',
        children: tasks.map(t => ({
          id: t.id,
          baselineStart: new Date(t.startDate).getTime(),
          baselineFinish: new Date(t.dueDate).getTime(),
          actualStart:
            new Date(t.startDate).getTime() < nowMs && !t.actualDate
              ? new Date(t.startDate).getTime()
              : undefined,
          actualFinish: t.actualDate
            ? new Date(t.actualDate).getTime()
            : undefined,
          predecessors: (t.dependsOn || []).map(id => ({
            taskId: id,
            lagDays: 0,
          })),
        })),
      }
      const agg = computeScheduleWithAgg(root, {
        dataDate: nowMs,
        allowEarlyStart: false,
      })
      const rootAgg = agg.get('root-fs')
      return rootAgg?.forecastFinish
        ? new Date(rootAgg.forecastFinish)
        : undefined
    } catch {
      return undefined
    }
  }, [getWbsTasks, taskDepth, nowMs])

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

  const subcontractorsRows = React.useMemo(() => {
    const scopeById = new Map<string, Array<{ id: string; name: string }>>()
    subcontractorResponsibilities.forEach(item => {
      scopeById.set(item.id, item.items)
    })

    // Tüm leaf WBS düğümlerini taşerona göre grupla, ileride gecikme/aşım sayıları için kullanacağız
    const leafMetricsByOwner = new Map<
      string,
      Array<{ id: string; metrics: NodeMetrics | undefined }>
    >()
    const collectLeaves = (node: WbsNode) => {
      if (!node.children || node.children.length === 0) {
        const owner = analytics.ownership.get(node.id)
        if (owner) {
          const arr = leafMetricsByOwner.get(owner) ?? []
          arr.push({ id: node.id, metrics: metricsById.get(node.id) })
          leafMetricsByOwner.set(owner, arr)
        }
        return
      }
      node.children.forEach(collectLeaves)
    }
    collectLeaves(wbsRoot)

    const derivedIssueCounts = new Map<string, OwnerIssueSummary>()
    const spiCutoff = T.SPI.good
    const cpiCutoff = T.CPI.good
    leafMetricsByOwner.forEach((leaves, owner) => {
      let instant = 0
      const acceptance = 0
      let planned = 0
      leaves.forEach(({ metrics }) => {
        if (!metrics) return
        const { ev = 0, ac = 0, pv = 0 } = metrics
        const leafCpi = ac > 0 ? ev / ac : 0
        const leafSpi = pv > 0 ? ev / pv : 0
        if (leafSpi < spiCutoff) planned += 1
        if (leafCpi < cpiCutoff) instant += 1
        // Acceptance kontrolleri için ek metrik bulunmadığından türetilmez
      })
      derivedIssueCounts.set(owner, { instant, acceptance, planned })
    })

    // Owner'a göre plan başlangıç/bitiş penceresi ve forecast özetlerini WBS görevlerinden çıkar
    const summary = new Map<
      string,
      {
        start: number
        end: number
        hasUnfinished: boolean
        latestForecast?: number
      }
    >()
    try {
      const tasks = getWbsTasks(taskDepth)
      for (const t of tasks) {
        if (!t.owner) continue
        const s = new Date(t.startDate).getTime()
        const e = new Date(t.dueDate).getTime()
        const fc = t.actualDate
          ? undefined
          : t.forecastDate
            ? new Date(t.forecastDate).getTime()
            : undefined
        const entry = summary.get(t.owner) || {
          start: s,
          end: e,
          hasUnfinished: false,
          latestForecast: undefined,
        }
        entry.start = Math.min(entry.start, s)
        entry.end = Math.max(entry.end, e)
        if (!t.actualDate) entry.hasUnfinished = true
        if (fc != null) {
          entry.latestForecast = Math.max(entry.latestForecast ?? fc, fc)
        }
        summary.set(t.owner, entry)
      }
    } catch {}

    return subcontractorOverviewData.map(x => {
      const derivedIssues = derivedIssueCounts.get(x.id)
      const existing = x.issues
      const mergedIssues: OwnerIssueSummary | undefined = derivedIssues
        ? {
            instant: derivedIssues.instant + (existing?.instant ?? 0),
            acceptance: derivedIssues.acceptance + (existing?.acceptance ?? 0),
            planned: derivedIssues.planned + (existing?.planned ?? 0),
          }
        : existing
      const summaryEntry = summary.get(x.id)
      const latestForecastMs =
        summaryEntry?.latestForecast ??
        (summaryEntry?.hasUnfinished ? summaryEntry?.end : undefined)
      return {
        id: x.id,
        name: x.name,
        aggregate: x.aggregate,
        issues: mergedIssues,
        responsibilities: scopeById.get(x.id) || [],
        // Fallback progress from SPI; if you have a dedicated progress %, inject it here.
        progressPct: Math.round(
          Math.max(0, Math.min(1, x.aggregate.spi)) * 100
        ),
        plannedStart: summaryEntry?.start
          ? new Date(summaryEntry.start).toISOString()
          : undefined,
        plannedEnd: summaryEntry?.end
          ? new Date(summaryEntry.end).toISOString()
          : undefined,
        forecastFinish: latestForecastMs
          ? new Date(latestForecastMs).toISOString()
          : undefined,
        allDone: summaryEntry ? summaryEntry.hasUnfinished === false : false,
      }
    })
  }, [
    subcontractorOverviewData,
    subcontractorResponsibilities,
    getWbsTasks,
    taskDepth,
    analytics.ownership,
    metricsById,
    wbsRoot,
  ])

  const ownerLabel = React.useCallback(
    (raw?: string | null) => {
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
    },
    [subsNameMap, tMilestone]
  )

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
    const firstLeafUnder = (id: string): string | null => {
      const start = nodeById.get(id)
      if (!start) return null
      // If already leaf
      if (!start.children || start.children.length === 0) return null
      let cur: WbsNode | undefined = start.children[0]
      while (cur && cur.children && cur.children.length > 0) {
        cur = cur.children[0]
      }
      return cur ? cur.id : null
    }
    const descendantsOf = (id: string): string[] => {
      const start = nodeById.get(id)
      if (!start) return []
      const acc: string[] = []
      const stack = [...(start.children ?? [])]
      while (stack.length) {
        const current = stack.pop()!
        acc.push(current.id)
        if (current.children) {
          stack.push(...current.children)
        }
      }
      return acc
    }
    return { nodeById, parent, pathTo, toName, firstLeafUnder, descendantsOf }
  }, [wbsRoot])

  const baseTaskId = React.useCallback(
    (id: string) => id.replace(/-p\d+$/, ''),
    []
  )

  const taskPathLabels = React.useCallback(
    (taskId: string): { short: string; full: string } => {
      const baseId = baseTaskId(taskId)
      let path = wbsMaps.pathTo(baseId)
      if (path.length > 1 && path[0].id === wbsRoot.id) {
        path = path.slice(1)
      }
      let names = path.map(node => node.name || wbsMaps.toName(node.id))
      if (names.length === 0) {
        names = [wbsMaps.toName(baseId)]
      }
      const full = names.join(' › ')
      let short = full
      if (names.length > 3) {
        short = [...names.slice(0, 2), '...', ...names.slice(-2)].join(' › ')
      }
      return { short, full }
    },
    [baseTaskId, wbsMaps, wbsRoot.id]
  )

  const asciiPath = React.useCallback(
    (taskId: string): string => {
      const baseId = baseTaskId(taskId)
      const path = wbsMaps.pathTo(baseId)
      if (path.length === 0) return wbsMaps.toName(baseId)
      const lines: string[] = []
      path.forEach((node, idx) => {
        const label = wbsMaps.toName(node.id)
        if (idx === 0) {
          lines.push(label)
          return
        }
        const glyph = idx === path.length - 1 ? '└─ ' : '├─ '
        const indent = '  '.repeat(idx - 1)
        lines.push(`${indent}${glyph}${label}`)
      })
      return lines.join('\n')
    },
    [baseTaskId, wbsMaps]
  )

  const wbsPathHelpers = React.useMemo(
    () => ({
      pathLabels: (id: string) => taskPathLabels(id),
      asciiPath: (id: string) => asciiPath(id),
      labelFor: (id: string) => wbsMaps.toName(id),
      pathIds: (id: string) => wbsMaps.pathTo(id).map(node => node.id),
      descendantsOf: (id: string) => [id, ...wbsMaps.descendantsOf(id)],
    }),
    [taskPathLabels, asciiPath, wbsMaps]
  )

  const asciiBranchMarked = React.useCallback(
    (
      focusNodeId: string,
      otherNodeId: string,
      rel: InsightKind,
      opts?: {
        causeLeafId?: string
        effectLeafId?: string
        causeLabel?: string
        effectLabel?: string
      }
    ) => {
      const a = wbsMaps.pathTo(focusNodeId)
      const b = wbsMaps.pathTo(otherNodeId)
      const aIds = a.map(n => n.id)
      const bIds = b.map(n => n.id)
      let i = 0
      while (i < aIds.length && i < bIds.length && aIds[i] === bIds[i]) i++

      const lines: string[] = []

      // common path
      if (i > 0) {
        lines.push(wbsMaps.toName(aIds[0]))
        for (let k = 1; k < i; k++) {
          lines.push(' '.repeat(k * 2) + '└─ ' + wbsMaps.toName(aIds[k]))
        }
      } else {
        lines.push(wbsMaps.toName(aIds[0] || bIds[0] || wbsRoot.id))
      }

      const renderBranch = (
        ids: string[],
        isFocusBranch: boolean,
        first: boolean
      ) => {
        const splitIndex = i === 0 ? 1 : i
        for (let k = splitIndex; k < ids.length; k++) {
          const pre = ' '.repeat(i * 2)
          const atSplit = k === splitIndex
          const branchGlyph = atSplit
            ? first
              ? '├─ '
              : '└─ '
            : '   '.repeat(k - i) + '└─ '
          const id = ids[k]
          const isLeaf = k === ids.length - 1
          let marker = ''
          if (isLeaf) {
            const isFocusLeaf = isFocusBranch && id === focusNodeId
            const isOtherLeaf = !isFocusBranch && id === otherNodeId
            const causeIsOther = rel === 'blocked' || rel === 'blockedRisk'
            const isCauseLeaf = causeIsOther ? isOtherLeaf : isFocusLeaf
            const isEffectLeaf = causeIsOther ? isFocusLeaf : isOtherLeaf
            marker = isCauseLeaf ? '▶ ' : isEffectLeaf ? '● ' : ''
          }
          lines.push(pre + branchGlyph + marker + wbsMaps.toName(id))
          // If this leaf corresponds to the actual dependency endpoints, render down to them
          if (isLeaf) {
            const wantCauseOnThisBranch =
              rel === 'blocked' || rel === 'blockedRisk'
                ? !isFocusBranch
                : isFocusBranch
            // ensure we don't add duplicate edges per base-node; actual effect flag not used further
            const deeperId = wantCauseOnThisBranch
              ? opts?.causeLeafId
              : opts?.effectLeafId
            const deeperLabel = wantCauseOnThisBranch
              ? opts?.causeLabel
              : opts?.effectLabel
            if (deeperId || deeperLabel) {
              let label = deeperId
                ? wbsMaps.toName(deeperId)
                : String(deeperLabel)
              const parentLabel = wbsMaps.toName(id)
              if (label && parentLabel && label.trim() === parentLabel.trim()) {
                // Avoid showing identical child name; clarify as a lower-level task
                label = label.includes('•') ? label : `${label} • Faz 1`
              }
              const depMarker = wantCauseOnThisBranch ? '▶ ' : '● '
              lines.push(
                pre +
                  '   '.repeat(Math.max(1, ids.length - i)) +
                  '└─ ' +
                  depMarker +
                  label
              )
            }
          }
        }
      }

      const causeIsOther = rel === 'blocked' || rel === 'blockedRisk'
      if (causeIsOther) {
        renderBranch(bIds, false, true) // cause first
        renderBranch(aIds, true, false) // effect second
      } else {
        renderBranch(aIds, true, true) // cause first
        renderBranch(bIds, false, false) // effect second
      }

      return lines.join('\n')
    },
    [wbsMaps, wbsRoot.id]
  )

  const openInsightCards = React.useCallback((cards: InsightCard[]) => {
    if (cards.length === 0) return
    setInsightCards(cards)
    setInsightIndex(0)
    setInsightOpen(true)
  }, [])

  const buildScheduleInsights = React.useCallback(
    (nodeId: string, mode: 'blocked' | 'blockRisk'): InsightCard[] => {
      const visited = new Set<string>()
      const gather = (id: string): InsightCard[] => {
        if (visited.has(id)) return []
        visited.add(id)
        const entry = wbsSchedule.get(id)
        if (entry) {
          const preds = entry.predecessors ?? []
          const focusName = wbsMaps.toName(id)
          const focusOwnerLabel =
            ownerLabel(analytics.ownership.get(id) ?? null) ?? null
          const focusLeaf = wbsMaps.firstLeafUnder(id) || undefined
          const baselineStart = entry.baselineStart ?? null
          const cards: InsightCard[] = preds.reduce<InsightCard[]>(
            (acc, pid) => {
              const predEntry = wbsSchedule.get(pid)
              if (!predEntry) return acc
              const otherName = wbsMaps.toName(pid)
              const otherOwnerLabel =
                ownerLabel(analytics.ownership.get(pid) ?? null) ?? null
              if (mode === 'blocked') {
                if (predEntry.status === 'completed') return acc
                acc.push({
                  title: 'Neden Bloklu?',
                  details: `${otherName} işi tamamlanmadı`,
                  ascii: asciiBranchMarked(id, pid, 'blocked', {
                    causeLabel: otherName,
                    effectLabel: focusName,
                    causeLeafId: wbsMaps.firstLeafUnder(pid) || undefined,
                    effectLeafId: focusLeaf,
                  }),
                  focusName,
                  otherName,
                  rel: 'blocked',
                  focusOwner: focusOwnerLabel,
                  otherOwner: otherOwnerLabel,
                  causeLabel: otherName,
                  effectLabel: focusName,
                  focusLabel: focusName,
                  otherLabel: otherName,
                })
              } else {
                if (
                  baselineStart == null ||
                  baselineStart <= projectTiming.dataDate ||
                  predEntry.forecastFinish == null ||
                  predEntry.forecastFinish <= baselineStart
                ) {
                  return acc
                }
                acc.push({
                  title: 'Neden Bloklanabilir?',
                  details: `${otherName} forecast bitişi bu işin planlanan başlangıcını aşıyor`,
                  ascii: asciiBranchMarked(id, pid, 'blockedRisk', {
                    causeLabel: otherName,
                    effectLabel: focusName,
                    causeLeafId: wbsMaps.firstLeafUnder(pid) || undefined,
                    effectLeafId: focusLeaf,
                  }),
                  focusName,
                  otherName,
                  rel: 'blockedRisk',
                  focusOwner: focusOwnerLabel,
                  otherOwner: otherOwnerLabel,
                  causeLabel: otherName,
                  effectLabel: focusName,
                  focusLabel: focusName,
                  otherLabel: otherName,
                })
              }
              return acc
            },
            []
          )
          if (cards.length > 0) return cards
        }
        const node = wbsMaps.nodeById.get(id)
        if (!node?.children) return []
        for (const child of node.children) {
          const result = gather(child.id)
          if (result.length > 0) return result
        }
        return []
      }
      return gather(nodeId)
    },
    [
      wbsSchedule,
      wbsMaps,
      ownerLabel,
      analytics.ownership,
      asciiBranchMarked,
      projectTiming.dataDate,
    ]
  )

  const handleScheduleInsightRequest = React.useCallback(
    (payload: { nodeId: string; mode: 'blocked' | 'blockRisk' }) => {
      const cards = buildScheduleInsights(payload.nodeId, payload.mode)
      openInsightCards(cards)
    },
    [buildScheduleInsights, openInsightCards]
  )

  // Insight modal state
  type InsightKind = 'blocked' | 'blocking' | 'blockedRisk' | 'blockRisk'

  type InsightCard = {
    title: string
    details?: string
    ascii: string
    focusName: string
    otherName: string
    rel: InsightKind
    focusOwner?: string | null
    otherOwner?: string | null
    causeLabel?: string
    effectLabel?: string
    focusLabel?: string
    otherLabel?: string
  }
  const [insightOpen, setInsightOpen] = React.useState(false)
  const [insightCards, setInsightCards] = React.useState<InsightCard[]>([])
  const [insightIndex, setInsightIndex] = React.useState(0)

  type TabKey = 'overview' | 'subs' | 'wbs' | 'issues' | 'team'
  const [activeTab, setActiveTab] = React.useState<TabKey>(
    (searchParams.get('tab') as TabKey) || 'overview'
  )
  const [selectedOwner, setSelectedOwner] = React.useState<string | null>(
    searchParams.get('subcontractorId')
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
  const [hoveredCardId, setHoveredCardId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString())
    sp.set('tab', activeTab)
    if (selectedOwner) sp.set('subcontractorId', selectedOwner)
    else sp.delete('subcontractorId')
    sp.delete('view')
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
  }, [activeTab, selectedOwner, selectedNodeId, wbsQuery, msState, msRange])

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
        <ProjectOverviewHeader
          project={simple}
          subcontractorResponsibilities={subcontractorResponsibilities}
          projectedFinishBySchedule={projectForecastFinishBySchedule}
        />

        {/* Tabs */}
        <div className="mb-4 border-b">
          <div className="flex gap-4">
            {[
              { id: 'overview', label: 'Proje İlerlemesi' },
              { id: 'subs', label: 'Taşeronlar' },
              { id: 'wbs', label: 'İş Kırılımı' },
              { id: 'issues', label: 'Sorunlar' },
              { id: 'team', label: 'Ekip' },
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
                      // Completed tasks cannot be considered blocked
                      if (t.progress >= 100) return false
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
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-sky-600/10 text-sky-800 border border-sky-600/30 text-[10px] whitespace-nowrap">
                          Bugün ·{' '}
                          {new Date(today).toLocaleDateString('tr-TR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </div>
                      </div>
                    )
                  })()}
                  {/* Global project end line at the far right */}
                  {(() => {
                    const hasRange = !!(simple?.startDate && simple?.endDate)
                    if (!hasRange) return null
                    return (
                      <div
                        aria-hidden
                        className="absolute inset-y-0 pointer-events-none z-30"
                        style={{ left: `100%` }}
                      >
                        <div className="h-full border-l-2 border-dashed border-rose-600/50" />
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-rose-600/10 text-rose-800 border border-rose-600/30 text-[10px] whitespace-nowrap">
                          Proje Bitiş ·{' '}
                          {new Date(simple!.endDate!).toLocaleDateString(
                            'tr-TR',
                            {
                              day: '2-digit',
                              month: 'short',
                            }
                          )}
                        </div>
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
                            if (t.progress >= 100) return false
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
                            if (startMsOf(t) <= nowMs) return false
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
                      // Sort by earliest start first
                      filtered.sort((a, b) => {
                        const sa = new Date(a.startDate).getTime()
                        const sb = new Date(b.startDate).getTime()
                        if (sa !== sb) return sa - sb
                        // same start → tie-break by due date, then name for stability
                        const da = new Date(a.dueDate).getTime()
                        const db = new Date(b.dueDate).getTime()
                        if (da !== db) return da - db
                        return a.name.localeCompare(b.name, 'tr')
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
                        const blockingSuccessors =
                          m.progress >= 100
                            ? []
                            : m.blocks
                                .map(id => byId.get(id))
                                .filter(
                                  (s): s is WbsTask =>
                                    !!s && startMsOf(s) < nowMs
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
                        const baseFocusId = baseTaskId(m.id)
                        const labels = taskPathLabels(m.id)
                        const ascii = asciiPath(m.id)
                        const hasUnfinishedPredOther =
                          unfinishedPredecessors.some(
                            p => baseFocusId !== baseTaskId(p.id)
                          )
                        const hasBlockingSuccOther = blockingSuccessors.some(
                          s => baseFocusId !== baseTaskId(s.id)
                        )
                        const hasBlockedRiskPredOther = blockedRiskPreds.some(
                          p => baseFocusId !== baseTaskId(p.id)
                        )
                        const hasBlockRiskSuccOther = blockRiskSuccs.some(
                          s => baseFocusId !== baseTaskId(s.id)
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
                        // Eğer iş tamamlanmamışsa tahmini bitiş bugün(=nowMs) öncesinde olamaz
                        if (
                          !m.actualDate &&
                          (m.progress ?? 0) < 100 &&
                          fc &&
                          fc.getTime() < nowMs
                        ) {
                          // En azından bugün+1 gün olarak ayarla (daha okunaklı görünüm için)
                          fc = new Date(nowMs + 24 * 3600 * 1000)
                        }
                        const isCompleted =
                          (m.progress ?? 0) >= 100 ||
                          m.status === 'completed' ||
                          !!m.actualDate
                        const actual: Date | undefined = m.actualDate
                          ? new Date(m.actualDate)
                          : undefined
                        const fcEff: Date | undefined = isCompleted
                          ? m.actualDate
                            ? actual
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
                        // Task window relative to project timeline
                        const taskStartPct = (() => {
                          if (!(start && end && end > start)) return 0
                          const s = new Date(m.startDate).getTime()
                          return Math.min(
                            100,
                            Math.max(0, ((s - start) / (end - start)) * 100)
                          )
                        })()
                        // label positions: push to exact edges when very close to 0%/100%
                        const planPctLabel =
                          duePct > 99.2
                            ? 100
                            : duePct < 0.8
                              ? 0
                              : Math.min(97, Math.max(3, duePct))
                        const fcPctLabel =
                          fcPct > 99.2
                            ? 100
                            : fcPct < 0.8
                              ? 0
                              : Math.min(97, Math.max(3, fcPct))
                        const progressAbsPct = Math.max(
                          0,
                          Math.min(planPctLabel, fcPctLabel) - taskStartPct
                        )
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
                          Math.abs(fcPctLabel - planPctLabel) < 2.5
                        const planAnchor =
                          planPctLabel > 92
                            ? 'right'
                            : planPctLabel < 8
                              ? 'left'
                              : 'center'
                        const fcAnchor =
                          fcPctLabel > 92
                            ? 'right'
                            : fcPctLabel < 8
                              ? 'left'
                              : 'center'
                        const startAnchor =
                          taskStartPct > 92
                            ? 'right'
                            : taskStartPct < 8
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
                        const dashedStart = Math.max(planPctLabel, todayPct)
                        const dashedSegWidth = Math.max(
                          0,
                          fcPctLabel - dashedStart
                        )
                        // Solid continuation between plan→today for unfinished (avoid grey gap)
                        const overdueSolidWidth = Math.max(
                          0,
                          todayPct - planPctLabel
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
                        const startTipPos = {
                          bottom: '100%',
                          marginBottom: 8,
                        } as React.CSSProperties
                        const isSameDay = (a: Date, b: Date) =>
                          a.toDateString() === b.toDateString()
                        const hidePlanMarker = (() => {
                          const fcDate = actual ?? (fcEff as Date | undefined)
                          return !!fcDate && isSameDay(due, fcDate)
                        })()
                        return (
                          <div
                            key={m.id}
                            className="relative p-3 rounded-lg bg-muted/40 border"
                            style={{
                              zIndex: hoveredCardId === m.id ? 80 : undefined,
                            }}
                            onMouseEnter={() => setHoveredCardId(m.id)}
                            onMouseLeave={() =>
                              setHoveredCardId(prev =>
                                prev === m.id ? null : prev
                              )
                            }
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <WbsPathTooltip
                                  ascii={ascii}
                                  label={labels.full}
                                >
                                  <div className="flex items-center gap-2 min-w-0 cursor-default">
                                    <div
                                      className={cn(
                                        'size-8 rounded-full flex items-center justify-center',
                                        colorClasses
                                      )}
                                    >
                                      <Calendar className="size-4" />
                                    </div>
                                    <h4 className="font-medium flex-1 min-w-0">
                                      <span className="block max-w-full truncate">
                                        {labels.short}
                                      </span>
                                    </h4>
                                  </div>
                                </WbsPathTooltip>
                                {m.owner && (
                                  <span className="px-1.5 py-0.5 text-[11px] rounded bg-secondary text-foreground/80">
                                    {ownerLabel(m.owner)}
                                  </span>
                                )}
                                {msState === 'blocked' &&
                                  hasUnfinishedPredOther && (
                                    <div className="text-xs shrink-0">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            className="underline text-blue-600 hover:text-blue-700"
                                            onClick={() => {
                                              const focus = baseTaskId(m.id)
                                              const seen = new Set<string>()
                                              const cards = [] as Array<{
                                                title: string
                                                details: string
                                                ascii: string
                                                focusName: string
                                                otherName: string
                                                rel: 'blocked'
                                                focusOwner: string | null
                                                otherOwner: string | null
                                                causeLabel?: string
                                                effectLabel?: string
                                                focusLabel?: string
                                                otherLabel?: string
                                              }>
                                              for (const p of unfinishedPredecessors) {
                                                const other = baseTaskId(p.id)
                                                if (other === focus) continue
                                                if (seen.has(other)) continue
                                                seen.add(other)
                                                const fOwner =
                                                  analytics.ownership.get(focus)
                                                const oOwner =
                                                  analytics.ownership.get(other)
                                                cards.push({
                                                  title: 'Neden Bloklu?',
                                                  details: `${wbsMaps.toName(other)} işi tamamlanmadı`,
                                                  ascii: asciiBranchMarked(
                                                    focus,
                                                    other,
                                                    'blocked',
                                                    {
                                                      causeLabel: p.name,
                                                      effectLabel: m.name,
                                                      causeLeafId:
                                                        wbsMaps.firstLeafUnder(
                                                          other
                                                        ) || undefined,
                                                      effectLeafId:
                                                        wbsMaps.firstLeafUnder(
                                                          focus
                                                        ) || undefined,
                                                    }
                                                  ),
                                                  focusName:
                                                    wbsMaps.toName(focus),
                                                  otherName:
                                                    wbsMaps.toName(other),
                                                  rel: 'blocked',
                                                  focusOwner: fOwner
                                                    ? subsNameMap.get(fOwner) ||
                                                      fOwner
                                                    : null,
                                                  otherOwner: oOwner
                                                    ? subsNameMap.get(oOwner) ||
                                                      oOwner
                                                    : null,
                                                  causeLabel: p.name,
                                                  effectLabel: m.name,
                                                  focusLabel: m.name,
                                                  otherLabel: p.name,
                                                })
                                              }
                                              openInsightCards(cards)
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
                                  hasBlockingSuccOther && (
                                    <div className="text-xs shrink-0">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            className="underline text-rose-600 hover:text-rose-700"
                                            onClick={() => {
                                              const focus = baseTaskId(m.id)
                                              const seen = new Set<string>()
                                              const cards = [] as Array<{
                                                title: string
                                                details: string
                                                ascii: string
                                                focusName: string
                                                otherName: string
                                                rel: 'blocking'
                                                focusOwner: string | null
                                                otherOwner: string | null
                                                causeLabel?: string
                                                effectLabel?: string
                                                focusLabel?: string
                                                otherLabel?: string
                                              }>
                                              for (const s of blockingSuccessors) {
                                                const other = baseTaskId(s.id)
                                                if (other === focus) continue
                                                if (seen.has(other)) continue
                                                seen.add(other)
                                                const fOwner =
                                                  analytics.ownership.get(focus)
                                                const oOwner =
                                                  analytics.ownership.get(other)
                                                cards.push({
                                                  title: 'Neyi Blokluyor?',
                                                  details: `${wbsMaps.toName(other)} başlatılamıyor`,
                                                  ascii: asciiBranchMarked(
                                                    focus,
                                                    other,
                                                    'blocking',
                                                    {
                                                      causeLabel: m.name,
                                                      effectLabel: s.name,
                                                      causeLeafId:
                                                        wbsMaps.firstLeafUnder(
                                                          focus
                                                        ) || undefined,
                                                      effectLeafId:
                                                        wbsMaps.firstLeafUnder(
                                                          other
                                                        ) || undefined,
                                                    }
                                                  ),
                                                  focusName:
                                                    wbsMaps.toName(focus),
                                                  otherName:
                                                    wbsMaps.toName(other),
                                                  rel: 'blocking',
                                                  focusOwner: fOwner
                                                    ? subsNameMap.get(fOwner) ||
                                                      fOwner
                                                    : null,
                                                  otherOwner: oOwner
                                                    ? subsNameMap.get(oOwner) ||
                                                      oOwner
                                                    : null,
                                                  causeLabel: m.name,
                                                  effectLabel: s.name,
                                                  focusLabel: m.name,
                                                  otherLabel: s.name,
                                                })
                                              }
                                              openInsightCards(cards)
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
                                  hasBlockedRiskPredOther && (
                                    <div className="text-xs shrink-0">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            className="underline text-amber-700 hover:text-amber-800"
                                            onClick={() => {
                                              const focus = baseTaskId(m.id)
                                              const seen = new Set<string>()
                                              const cards = [] as Array<{
                                                title: string
                                                details: string
                                                ascii: string
                                                focusName: string
                                                otherName: string
                                                rel: 'blockedRisk'
                                                focusOwner: string | null
                                                otherOwner: string | null
                                                causeLabel?: string
                                                effectLabel?: string
                                                focusLabel?: string
                                                otherLabel?: string
                                              }>
                                              for (const p of blockedRiskPreds) {
                                                const other = baseTaskId(p.id)
                                                if (other === focus) continue
                                                if (seen.has(other)) continue
                                                seen.add(other)
                                                const fOwner =
                                                  analytics.ownership.get(focus)
                                                const oOwner =
                                                  analytics.ownership.get(other)
                                                cards.push({
                                                  title: 'Neden Bloklanabilir?',
                                                  details: `${wbsMaps.toName(other)} forecast bitişi bu işin planlanan başlangıcını aşıyor`,
                                                  ascii: asciiBranchMarked(
                                                    focus,
                                                    other,
                                                    'blockedRisk',
                                                    {
                                                      causeLabel: p.name,
                                                      effectLabel: m.name,
                                                      causeLeafId:
                                                        wbsMaps.firstLeafUnder(
                                                          other
                                                        ) || undefined,
                                                      effectLeafId:
                                                        wbsMaps.firstLeafUnder(
                                                          focus
                                                        ) || undefined,
                                                    }
                                                  ),
                                                  focusName:
                                                    wbsMaps.toName(focus),
                                                  otherName:
                                                    wbsMaps.toName(other),
                                                  rel: 'blockedRisk',
                                                  focusOwner: fOwner
                                                    ? subsNameMap.get(fOwner) ||
                                                      fOwner
                                                    : null,
                                                  otherOwner: oOwner
                                                    ? subsNameMap.get(oOwner) ||
                                                      oOwner
                                                    : null,
                                                  causeLabel: p.name,
                                                  effectLabel: m.name,
                                                })
                                              }
                                              openInsightCards(cards)
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
                                  hasBlockRiskSuccOther && (
                                    <div className="text-xs shrink-0">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            className="underline text-rose-700 hover:text-rose-800"
                                            onClick={() => {
                                              const focus = baseTaskId(m.id)
                                              const seen = new Set<string>()
                                              const cards = [] as Array<{
                                                title: string
                                                details: string
                                                ascii: string
                                                focusName: string
                                                otherName: string
                                                rel: 'blockRisk'
                                                focusOwner: string | null
                                                otherOwner: string | null
                                                causeLabel?: string
                                                effectLabel?: string
                                                focusLabel?: string
                                                otherLabel?: string
                                              }>
                                              for (const s of blockRiskSuccs) {
                                                const other = baseTaskId(s.id)
                                                if (other === focus) continue
                                                if (seen.has(other)) continue
                                                seen.add(other)
                                                const fOwner =
                                                  analytics.ownership.get(focus)
                                                const oOwner =
                                                  analytics.ownership.get(other)
                                                cards.push({
                                                  title: 'Neyi Bloklayabilir?',
                                                  details: `${wbsMaps.toName(other)} planlanan başlangıcını aşma riski`,
                                                  ascii: asciiBranchMarked(
                                                    focus,
                                                    other,
                                                    'blockRisk',
                                                    {
                                                      causeLabel: m.name,
                                                      effectLabel: s.name,
                                                      causeLeafId:
                                                        wbsMaps.firstLeafUnder(
                                                          focus
                                                        ) || undefined,
                                                      effectLeafId:
                                                        wbsMaps.firstLeafUnder(
                                                          other
                                                        ) || undefined,
                                                    }
                                                  ),
                                                  focusName:
                                                    wbsMaps.toName(focus),
                                                  otherName:
                                                    wbsMaps.toName(other),
                                                  rel: 'blockRisk',
                                                  focusOwner: fOwner
                                                    ? subsNameMap.get(fOwner) ||
                                                      fOwner
                                                    : null,
                                                  otherOwner: oOwner
                                                    ? subsNameMap.get(oOwner) ||
                                                      oOwner
                                                    : null,
                                                  causeLabel: m.name,
                                                  effectLabel: s.name,
                                                })
                                              }
                                              openInsightCards(cards)
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
                                {typeof m.blockers === 'number' &&
                                  m.blockers > 0 && (
                                    <div className="text-xs text-muted-foreground">
                                      Engelleyici: {m.blockers}
                                    </div>
                                  )}
                              </div>
                              <div className="text-right pr-24">
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
                                    {/* Progress fill: completed→actual, in‑progress→min(plan,fc) — colored by SPI category */}
                                    <div
                                      className={cn(
                                        'absolute inset-y-0 rounded-full',
                                        spiBaseColor
                                      )}
                                      style={{
                                        left: `${taskStartPct}%`,
                                        width: `${isCompleted ? Math.max(0, fcPctLabel - taskStartPct) : progressAbsPct}%`,
                                      }}
                                    />
                                    {/* Continue color between plan→today when overdue */}
                                    {!isCompleted && overdueSolidWidth > 0 && (
                                      <div
                                        className={cn(
                                          'absolute inset-y-0 rounded-none',
                                          spiBaseColor
                                        )}
                                        style={{
                                          left: `${planPctLabel}%`,
                                          width: `${overdueSolidWidth}%`,
                                        }}
                                      />
                                    )}
                                    {/* Plan↔Forecast difference (future-only, dashed between today→forecast) */}
                                    {!isCompleted && dashedSegWidth > 0 && (
                                      <div
                                        className="absolute inset-y-0 left-0 z-10"
                                        style={{
                                          left: `${dashedStart}%`,
                                          width: `${Math.max(0, fcPctLabel - dashedStart)}%`,
                                          // Denser colored portion: thicker color band, thinner gap
                                          backgroundImage: isLate
                                            ? 'repeating-linear-gradient(135deg, rgba(239,68,68,0.9) 0, rgba(239,68,68,0.9) 12px, rgba(239,68,68,0.0) 12px, rgba(239,68,68,0.0) 16px)'
                                            : 'repeating-linear-gradient(135deg, rgba(22,163,74,0.9) 0, rgba(22,163,74,0.9) 12px, rgba(22,163,74,0.0) 12px, rgba(22,163,74,0.0) 16px)',
                                        }}
                                      />
                                    )}
                                  </div>
                                  {/* Removed per-bar today line; using global dashed line */}
                                  {/* Start marker */}
                                  <div
                                    className="absolute"
                                    style={{
                                      left: `calc(${taskStartPct}% - 6px)`,
                                      top: -6,
                                    }}
                                  >
                                    <div
                                      className="relative group/marker z-50"
                                      onMouseEnter={() =>
                                        setHoveredMs(`start:${m.id}`)
                                      }
                                      onMouseLeave={() => setHoveredMs(null)}
                                      aria-label="Başlangıç"
                                    >
                                      <div className="size-3.5 rounded-full bg-gray-200 border border-gray-500 shadow-md ring-2 ring-white dark:ring-gray-900" />
                                      <div
                                        className={cn(
                                          'absolute z-50 px-2 py-1 rounded-md border bg-popover text-popover-foreground text-xs shadow pointer-events-none whitespace-nowrap',
                                          hoveredMs === `start:${m.id}`
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                          startAnchor === 'center' &&
                                            'left-1/2 -translate-x-1/2',
                                          startAnchor === 'left' && 'left-0',
                                          startAnchor === 'right' && 'right-0'
                                        )}
                                        style={startTipPos}
                                      >
                                        Başlangıç:{' '}
                                        {new Date(
                                          m.startDate
                                        ).toLocaleDateString('tr-TR')}
                                      </div>
                                    </div>
                                  </div>
                                  {/* Plan marker (hidden if equals forecast/actual same gün) */}
                                  {!hidePlanMarker && (
                                    <div
                                      className="absolute"
                                      style={{
                                        left: `calc(${planPctLabel}% - 6px)`,
                                        top: markersClose ? -10 : -6,
                                      }}
                                    >
                                      <div
                                        className="relative group/marker z-50"
                                        onMouseEnter={() =>
                                          setHoveredMs(`plan:${m.id}`)
                                        }
                                        onMouseLeave={() => setHoveredMs(null)}
                                      >
                                        <div className="size-3.5 rounded-full bg-gray-300 border border-gray-500 shadow-md ring-2 ring-white dark:ring-gray-900" />
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
                                          Planlanan Bitiş:{' '}
                                          {due.toLocaleDateString('tr-TR')}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {/* Forecast marker */}
                                  {fc && (
                                    <div
                                      className="absolute"
                                      style={{
                                        left: `calc(${fcPctLabel}% - 6px)`,
                                        top: markersClose ? undefined : -6,
                                        bottom: markersClose ? -10 : undefined,
                                      }}
                                    >
                                      <div
                                        className="relative group/marker z-50"
                                        onMouseEnter={() =>
                                          setHoveredMs(`fc:${m.id}`)
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
                                          {isCompleted ? (
                                            <span>
                                              Gerçekleşen Bitiş:{' '}
                                              {(fc as Date).toLocaleDateString(
                                                'tr-TR'
                                              )}
                                            </span>
                                          ) : (
                                            <span>
                                              Öngörülen Bitiş:{' '}
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
            <SubcontractorsTab
              rows={subcontractorsRows}
              onSelect={id => {
                setSelectedOwner(id)
                setActiveTab('wbs')
              }}
            />
          </div>
        )}

        {activeTab === 'wbs' && (
          <div className="mb-8">
            <WbsTreePanel
              root={wbsRoot}
              schedule={wbsSchedule}
              nodeHealth={analytics.nodeHealth}
              ownership={analytics.ownership}
              selectedNodeId={selectedNodeId}
              onSelectNode={id => setSelectedNodeId(id)}
              filterOwnerId={selectedOwner}
              searchQuery={wbsQuery}
              onSearchQueryChange={setWbsQuery}
              ownerNameFor={ownerLabel}
              onClearOwnerFilter={() => setSelectedOwner(null)}
              onRequestInsight={handleScheduleInsightRequest}
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
              ownerNameFor={ownerLabel}
              wbsPath={wbsPathHelpers}
            />
          </div>
        )}

        {activeTab === 'team' && (
          <div className="mb-8">
            <Card>
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
          </div>
        )}

        {/* Bütçe & Takvim sekmesi kaldırıldı */}
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
                    {insightCards[insightIndex]?.rel === 'blocked' ||
                    insightCards[insightIndex]?.rel === 'blockedRisk' ? (
                      <>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                          ▶ Etkileyen:{' '}
                          {insightCards[insightIndex]?.otherLabel ||
                            insightCards[insightIndex]?.otherName}
                          {insightCards[insightIndex]?.otherOwner && (
                            <span className="opacity-70">
                              ({insightCards[insightIndex]?.otherOwner})
                            </span>
                          )}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          ● İncelenen:{' '}
                          {insightCards[insightIndex]?.focusLabel ||
                            insightCards[insightIndex]?.focusName}
                          {insightCards[insightIndex]?.focusOwner && (
                            <span className="opacity-70">
                              ({insightCards[insightIndex]?.focusOwner})
                            </span>
                          )}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          ▶ İncelenen:{' '}
                          {insightCards[insightIndex]?.focusLabel ||
                            insightCards[insightIndex]?.focusName}
                          {insightCards[insightIndex]?.focusOwner && (
                            <span className="opacity-70">
                              ({insightCards[insightIndex]?.focusOwner})
                            </span>
                          )}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                          ● Etkilenen:{' '}
                          {insightCards[insightIndex]?.otherLabel ||
                            insightCards[insightIndex]?.otherName}
                          {insightCards[insightIndex]?.otherOwner && (
                            <span className="opacity-70">
                              ({insightCards[insightIndex]?.otherOwner})
                            </span>
                          )}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {insightCards[insightIndex]?.details}
                  </div>
                  <pre className="font-mono text-xs md:text-sm bg-muted/40 p-3 rounded border overflow-auto whitespace-pre">
                    {insightCards[insightIndex]?.ascii}
                  </pre>
                  {insightCards[insightIndex]?.causeLabel && (
                    <div className="text-xs text-muted-foreground">
                      Bağımlılık: {insightCards[insightIndex]?.causeLabel} →{' '}
                      {insightCards[insightIndex]?.effectLabel}
                    </div>
                  )}
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
      </PageContent>
    </PageContainer>
  )
}

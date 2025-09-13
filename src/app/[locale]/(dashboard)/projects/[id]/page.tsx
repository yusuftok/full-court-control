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
  Truck,
  HardHat,
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
} from '@/lib/project-analytics'
import { mockSubcontractors } from '@/components/projects/data/mock-subcontractors'
import { getDetailedProject, getSimpleProjects } from '@/lib/mock-data'
import { useTranslations, useLocale } from 'next-intl'

// Mock project data - in real app this would come from API
interface ProjectDetails {
  id: string
  name: string
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled'
  startDate: string
  endDate: string
  progress: number
  budget: number
  spent: number
  location: string
  contractor: string
  teamSize: number
  completedTasks: number
  totalTasks: number
  upcomingMilestones: Milestone[]
  recentActivities: Activity[]
  teamMembers: TeamMember[]
  equipment: Equipment[]
}

interface Milestone {
  id: string
  name: string
  dueDate: string
  status: 'completed' | 'in-progress' | 'pending' | 'overdue'
  progress: number
}

interface Activity {
  id: string
  type: 'task' | 'milestone' | 'issue' | 'update'
  title: string
  description: string
  timestamp: string
  user: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  tasksCompleted: number
  hoursWorked: number
  status: 'active' | 'on-leave' | 'off-site'
}

interface Equipment {
  id: string
  name: string
  type: string
  status: 'operational' | 'maintenance' | 'broken'
  location: string
  lastMaintenance: string
}

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
    equipment: [
      {
        id: 'e1',
        name: 'Kule Vinç #1',
        type: 'Kaldırma',
        status: 'operational',
        location: 'Blok A',
        lastMaintenance: '2024-08-01',
      },
      {
        id: 'e2',
        name: 'Beton Mikseri #3',
        type: 'Beton',
        status: 'maintenance',
        location: 'Santral',
        lastMaintenance: '2024-08-15',
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
    equipment: [
      {
        id: 'e1',
        name: 'Kepçe #2',
        type: 'Hafriyat',
        status: 'operational',
        location: 'A Blok',
        lastMaintenance: '2024-08-10',
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
    equipment: [
      {
        id: 'e1',
        name: 'TBM Makinesi',
        type: 'Tünel',
        status: 'operational',
        location: 'Hat B2',
        lastMaintenance: '2024-08-05',
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
    equipment: [],
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
          ],
        },
        {
          id: 'mechanical',
          name: 'Mekanik',
          assignedSubcontractorId: 'sub-mechanical-1',
          children: [
            { id: 'hvac', name: 'HVAC' },
            { id: 'plumbing', name: 'Sıhhi Tesisat' },
          ],
        },
        {
          id: 'electrical',
          name: 'Elektrik',
          assignedSubcontractorId: 'sub-electrical-1',
          children: [
            { id: 'strong-power', name: 'Güçlü Akım' },
            { id: 'weak-power', name: 'Zayıf Akım' },
          ],
        },
      ],
    }),
    [projectId]
  )

  const metricsById = React.useMemo(() => {
    return new Map<string, NodeMetrics>([
      ['excavation', { ev: 120, ac: 140, pv: 130 }],
      ['foundation', { ev: 180, ac: 220, pv: 200 }],
      ['hvac', { ev: 90, ac: 100, pv: 110 }],
      ['plumbing', { ev: 60, ac: 70, pv: 75 }],
      ['strong-power', { ev: 80, ac: 85, pv: 90 }],
      ['weak-power', { ev: 70, ac: 95, pv: 85 }],
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
    const slug = raw
      .replaceAll('İ', 'I')
      .replaceAll('ı', 'i')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const key = `owner.${slug}`
    // Cast to never to satisfy typed next-intl function without using 'any'
    const translated = tMilestone(key as never)
    // Fallback when key missing
    return translated === key ? raw : translated
  }

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
    'overdue' | 'upcoming' | 'ontrack' | null
  >(
    (searchParams.get('msState') as
      | 'overdue'
      | 'upcoming'
      | 'ontrack'
      | null) ?? null
  )
  const [msRange, setMsRange] = React.useState<number | null>(() => {
    const v = searchParams.get('msRange')
    return v ? Number(v) : null
  })

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Milestones */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="size-5" />
                    Kilometre Taşları
                  </span>
                  {(() => {
                    const today = new Date()
                    const ms = detailed.upcomingMilestones ?? []
                    const overdue = ms.filter(
                      m =>
                        (m.actualDate
                          ? new Date(m.actualDate) > new Date(m.dueDate)
                          : today > new Date(m.dueDate)) && m.progress < 100
                    ).length
                    const upcoming = ms.filter(m => {
                      const d = new Date(m.dueDate)
                      const dt = Math.ceil(
                        (d.getTime() - today.getTime()) / 86400000
                      )
                      return dt >= 0 && dt <= 14 && m.progress < 100
                    }).length
                    const onTrack =
                      ms.filter(m => m.progress < 100).length -
                      overdue -
                      upcoming
                    const slips = ms.map(m => m.slipDays ?? 0)
                    const avgSlip = slips.length
                      ? Math.round(
                          slips.reduce((a, b) => a + b, 0) / slips.length
                        )
                      : 0
                    return (
                      <div className="hidden md:flex items-center gap-2 text-sm">
                        <button
                          className={cn(
                            'px-2 py-0.5 rounded border transition-colors',
                            msState === 'overdue'
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-red-100 text-red-700 border-red-200'
                          )}
                          onClick={() =>
                            setMsState(msState === 'overdue' ? null : 'overdue')
                          }
                        >
                          Overdue {overdue}
                        </button>
                        <button
                          className={cn(
                            'px-2 py-0.5 rounded border transition-colors',
                            msState === 'upcoming'
                              ? 'bg-yellow-600 text-white border-yellow-600'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          )}
                          onClick={() => {
                            setMsState(
                              msState === 'upcoming' ? null : 'upcoming'
                            )
                            setMsRange(14)
                          }}
                        >
                          ≤14g {upcoming}
                        </button>
                        <button
                          className={cn(
                            'px-2 py-0.5 rounded border transition-colors',
                            msState === 'ontrack'
                              ? 'bg-green-600 text-white border-green-600'
                              : 'bg-green-100 text-green-700 border-green-200'
                          )}
                          onClick={() =>
                            setMsState(msState === 'ontrack' ? null : 'ontrack')
                          }
                        >
                          On‑track {Math.max(onTrack, 0)}
                        </button>
                        <span className="text-muted-foreground">
                          Δ {avgSlip >= 0 ? '+' : ''}
                          {avgSlip}g
                        </span>
                      </div>
                    )
                  })()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-visible">
                  {/* Global today line that cuts through all rows */}
                  {(() => {
                    const start = simple?.startDate
                      ? new Date(simple.startDate).getTime()
                      : 0
                    const end = simple?.endDate
                      ? new Date(simple.endDate).getTime()
                      : 0
                    const today = Date.now()
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
                      const all = detailed.upcomingMilestones ?? []
                      const today = new Date()
                      const filtered = all.filter(m => {
                        if (!msState) return true
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
                        const isOnTrack =
                          m.progress < 100 && !isOverdue && !isUpcoming
                        if (msState === 'overdue') return isOverdue
                        if (msState === 'upcoming') return isUpcoming
                        if (msState === 'ontrack') return isOnTrack
                        return true
                      })
                      return filtered.map(m => {
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
                          (due.getTime() - Date.now()) / 86400000
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
                        // clamp label positions to keep inside container visually
                        const planLabelPct = Math.min(97, Math.max(3, duePct))
                        const fcLabelPct = Math.min(97, Math.max(3, fcPct))
                        // today overlay for overdue visualization
                        const todayPct = (() => {
                          if (!(start && end && end > start)) return duePct
                          const t = Math.min(
                            100,
                            Math.max(
                              0,
                              ((Date.now() - start) / (end - start)) * 100
                            )
                          )
                          return t
                        })()
                        // color for forecast marker handled via drift check inline
                        // Consider markers visually "close" only when < ~1% of width apart
                        const markersClose =
                          Math.abs(fcLabelPct - planLabelPct) < 1
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
                          spiMs >= 0.95
                            ? 'bg-green-600'
                            : spiMs >= 0.85
                              ? 'bg-orange-500'
                              : 'bg-red-600'
                        // Future/Delta rendering between Plan and Forecast
                        const isLate = fcPct > duePct
                        const diffStart = Math.min(duePct, fcPct)
                        const diffEnd = Math.max(duePct, fcPct)
                        // Entire Plan↔Forecast delta is rendered as dashed, irrespective of 'today'
                        const dashedStart = diffStart
                        const dashedSegWidth = Math.max(0, diffEnd - diffStart)
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
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <h4 className="font-medium truncate">
                                      {m.name}
                                    </h4>
                                    {m.isCritical && (
                                      <Badge
                                        variant="outline"
                                        className="px-1.5 py-0.5 text-[11px] bg-red-100 text-red-700 border-red-200"
                                      >
                                        Kritik
                                      </Badge>
                                    )}
                                    {m.owner && (
                                      <span className="px-1.5 py-0.5 text-[11px] rounded bg-secondary text-foreground/80">
                                        {ownerLabel(m.owner)}
                                      </span>
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
                                    {/* Base fill up to earlier of Plan/Forecast */}
                                    <div
                                      className={cn(
                                        'h-full rounded-full',
                                        spiBaseColor
                                      )}
                                      style={{
                                        width: `${Math.min(duePct, fcPct)}%`,
                                      }}
                                    />
                                    {/* Plan↔Forecast difference (always dashed) */}
                                    {dashedSegWidth > 0 &&
                                      diffEnd > todayPct && (
                                        <div
                                          className="absolute inset-y-0 left-0 z-10"
                                          style={{
                                            left: `${dashedStart}%`,
                                            width: `${dashedSegWidth}%`,
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
                                    <div className="relative group/marker z-50">
                                      <div className="size-3.5 rounded-full bg-gray-300 border border-gray-500 shadow-md ring-2 ring-white dark:ring-gray-900" />
                                      {!markersClose && (
                                        <div
                                          className={cn(
                                            'absolute z-50 px-2 py-1 rounded-md border bg-popover text-popover-foreground text-xs shadow opacity-0 group-hover/msrow:opacity-100 group-hover:opacity-100 pointer-events-none whitespace-nowrap',
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
                                      <div className="relative group/marker z-50">
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
                                            'absolute z-50 px-2 py-1 rounded-md border bg-popover text-popover-foreground text-xs shadow opacity-0 group-hover/msrow:opacity-100 group-hover:opacity-100 pointer-events-none whitespace-nowrap',
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
                                              • Tahmin:{' '}
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

        {/* Equipment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="size-5" />
              Ekipman Durumu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {detailed.equipment.map(equipment => (
                <div
                  key={equipment.id}
                  className="p-4 border rounded-lg construction-hover"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{equipment.name}</h4>
                    <Badge
                      variant={
                        equipment.status === 'operational'
                          ? 'default'
                          : equipment.status === 'maintenance'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {equipment.status === 'operational'
                        ? 'Çalışıyor'
                        : equipment.status === 'maintenance'
                          ? 'Bakımda'
                          : 'Arızalı'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {equipment.type} • {equipment.location}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Son bakım:{' '}
                    {new Date(equipment.lastMaintenance).toLocaleDateString(
                      'tr-TR'
                    )}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </PageContainer>
  )
}

'use client'

import * as React from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Truck,
  HardHat,
  Wrench,
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  PageContainer,
  PageHeader,
  PageContent,
} from '@/components/layout/page-container'
import { StatCard, StatCardGrid } from '@/components/data/stat-card'
import { DataTable, Column, StatusBadge } from '@/components/data/data-table'
import { SubcontractorOverview } from '@/components/projects/SubcontractorOverview'
import { WbsHealthTree } from '@/components/projects/WbsHealthTree'
import { IssueList } from '@/components/projects/IssueList'
import { BudgetSchedulePanel } from '@/components/projects/BudgetSchedulePanel'
import {
  buildAnalytics,
  type WbsNode,
  type Issue,
  type NodeMetrics,
  type OwnerAggregate,
  type OwnerIssueSummary,
} from '@/lib/project-analytics'
import { mockSubcontractors } from '@/components/projects/data/mock-subcontractors'

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
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = params.id as string
  const project = mockProjectData[projectId]

  // --- WBS & Analytics (hooks must be before any early return) ---
  const subsNameMap = React.useMemo(() => {
    const m = new Map<string, string>()
    mockSubcontractors.forEach(s => m.set(s.id, s.companyName))
    return m
  }, [])

  const wbsRoot: WbsNode = React.useMemo(
    () => ({
      id: 'root',
      name: (mockProjectData[projectId]?.name as string) || 'Proje',
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

  type TabKey = 'overview' | 'subs' | 'wbs' | 'issues' | 'evm'
  const [activeTab, setActiveTab] = React.useState<TabKey>(
    (searchParams.get('tab') as TabKey) || 'overview'
  )
  const [selectedOwner, setSelectedOwner] = React.useState<string | null>(
    searchParams.get('subcontractorId')
  )

  React.useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString())
    sp.set('tab', activeTab)
    if (selectedOwner) sp.set('subcontractorId', selectedOwner)
    else sp.delete('subcontractorId')
    router.replace(`?${sp.toString()}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedOwner])

  if (!project) {
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
                <Link href="/dashboard">
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

  const budgetUsagePercentage = Math.round(
    (project.spent / project.budget) * 100
  )

  return (
    <PageContainer>
      <PageContent>
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="construction-hover"
          >
            <Link href="/dashboard">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{project.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={project.status} />
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {project.location}
              </span>
            </div>
          </div>
        </div>

        <PageHeader
          title="Proje Kontrol Paneli"
          description={`${project.contractor} • ${project.teamSize} kişilik ekip`}
          action={
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Calendar className="size-4 mr-2" />
                Program Görüntüle
              </Button>
              <Button>
                <Wrench className="size-4 mr-2" />
                Proje Ayarları
              </Button>
            </div>
          }
        />

        {/* Project Stats */}
        <StatCardGrid columns={4} className="mb-8">
          <StatCard
            title="Proje İlerlemesi"
            value={`${project.progress}%`}
            icon={TrendingUp}
            change={{
              value: 5.2,
              type: 'increase',
              period: 'geçen haftaya göre',
            }}
          />
          <StatCard
            title="Bütçe Kullanımı"
            value={`${budgetUsagePercentage}%`}
            icon={Building2}
            description={`${(project.spent / 1000000).toFixed(1)}M₺ / ${(project.budget / 1000000).toFixed(1)}M₺`}
          />
          <StatCard
            title="Tamamlanan Görevler"
            value={`${project.completedTasks}/${project.totalTasks}`}
            icon={CheckCircle}
            change={{
              value: 12,
              type: 'increase',
              period: 'bu hafta tamamlanan',
            }}
          />
          <StatCard
            title="Ekip Mevcudu"
            value={project.teamSize}
            icon={Users}
            description="Aktif çalışan"
          />
        </StatCardGrid>

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
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="size-5" />
                  Kilometre Taşları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.upcomingMilestones.map(milestone => (
                    <div
                      key={milestone.id}
                      className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg construction-hover"
                    >
                      <div
                        className={cn(
                          'size-8 rounded-full flex items-center justify-center',
                          milestone.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : milestone.status === 'in-progress'
                              ? 'bg-blue-100 dark:bg-blue-900/30'
                              : milestone.status === 'overdue'
                                ? 'bg-red-100 dark:bg-red-900/30'
                                : 'bg-gray-100 dark:bg-gray-900/30'
                        )}
                      >
                        <Calendar
                          className={cn(
                            'size-4',
                            milestone.status === 'completed'
                              ? 'text-green-600 dark:text-green-400'
                              : milestone.status === 'in-progress'
                                ? 'text-blue-600 dark:text-blue-400'
                                : milestone.status === 'overdue'
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-gray-600 dark:text-gray-400'
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{milestone.name}</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(milestone.dueDate).toLocaleDateString(
                              'tr-TR'
                            )}
                          </span>
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
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
                  {project.recentActivities.map(activity => {
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
            <WbsHealthTree
              root={wbsRoot}
              ownership={analytics.ownership}
              nodeHealth={analytics.nodeHealth}
              onSelectNode={() => {}}
              filterOwnerId={selectedOwner}
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
              data={project.teamMembers}
              columns={teamColumns}
              emptyMessage="Ekip üyesi bulunamadı"
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
              {project.equipment.map(equipment => (
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

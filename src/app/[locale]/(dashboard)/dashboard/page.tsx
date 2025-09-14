'use client'

import * as React from 'react'
import {
  Plus,
  Building2,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Activity,
  Timer,
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CircularProgress } from '@/components/ui/circular-progress'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  PageContainer,
  PageHeader,
  PageContent,
} from '@/components/layout/page-container'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import {
  ProjectCard,
  type Project as CardProject,
} from '@/components/projects/project-card'
import { getSimpleProjects } from '@/lib/mock-data'
import type { Project as SimpleProject } from '@/components/projects/types/project-types'
import { useRouter } from 'next/navigation'
import { PERFORMANCE_THRESHOLDS as T } from '@/lib/performance-thresholds'
import { useLocale } from 'next-intl'

// Mock data uses Project type from component

// Mock data - İlk 3 proje farklı performans durumlarını gösterecek şekilde
// Legacy mock kept below; runtime uses centralized mocks via getSimpleProjects()
const mockProjects: CardProject[] = [
  {
    id: '1',
    name: 'Şehir Merkezi Ofis Kompleksi',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    progress: 68,
    plannedProgress: 70,
    // İYİ durumu: CPI = 1.05, SPI = 0.97 → Combined = 0.6*1.05 + 0.4*0.97 = 1.018 (≥0.95)
    earnedValue: 1680000, // Kazanılan değer
    actualCost: 1600000, // CPI = 1680000/1600000 = 1.05 (İyi)
    plannedValue: 1732000, // SPI = 1680000/1732000 = 0.97 (İyi)
    plannedBudgetToDate: 1750000,
    subcontractors: 5,
    totalTasks: 250,
    completedTasks: 84,
    location: 'Istanbul, Turkey',
    budget: 2500000,
    manager: 'Ahmet Yılmaz',
    budgetSpent: 65,
    daysRemaining: 45,
    totalPlannedDays: 167,
    riskLevel: 'low',
    qualityScore: 4.2,
    healthStatus: 'healthy',
  },
  {
    id: '2',
    name: 'Konut Kulesi A',
    status: 'active',
    startDate: '2024-02-01',
    endDate: '2024-08-15',
    progress: 45,
    plannedProgress: 55,
    // RİSKLİ durumu: CPI = 0.87, SPI = 0.90 → Combined = 0.6*0.87 + 0.4*0.90 = 0.882 (0.90-0.94)
    earnedValue: 870000, // Kazanılan değer
    actualCost: 1000000, // CPI = 870000/1000000 = 0.87 (Riskli)
    plannedValue: 965000, // SPI = 870000/965000 = 0.90 (Riskli)
    plannedBudgetToDate: 990000,
    subcontractors: 8,
    totalTasks: 89,
    completedTasks: 40,
    location: 'Ankara, Turkey',
    budget: 1800000,
    manager: 'Fatma Demir',
    budgetSpent: 56,
    daysRemaining: 78,
    totalPlannedDays: 196,
    riskLevel: 'medium',
    qualityScore: 3.8,
    healthStatus: 'warning',
  },
  {
    id: '3',
    name: 'Alışveriş Merkezi Genişletme',
    status: 'active', // pending'den active'e değiştiriyoruz
    startDate: '2024-03-10',
    endDate: '2024-12-15',
    progress: 25,
    plannedProgress: 30,
    // KRİTİK durumu: CPI = 0.76, SPI = 0.79 → Combined = 0.6*0.76 + 0.4*0.79 = 0.772 (<0.90)
    earnedValue: 380000, // Kazanılan değer
    actualCost: 500000, // CPI = 380000/500000 = 0.76 (Kritik)
    plannedValue: 480000, // SPI = 380000/480000 = 0.79 (Kritik)
    plannedBudgetToDate: 480000,
    subcontractors: 3,
    totalTasks: 156,
    completedTasks: 39,
    location: 'Izmir, Turkey',
    budget: 3200000,
    manager: 'Mehmet Kaya',
    budgetSpent: 15,
    daysRemaining: 120,
    totalPlannedDays: 280,
    riskLevel: 'high',
    qualityScore: 3.2,
    healthStatus: 'critical',
  },
  {
    id: '4',
    name: 'Otoyol Köprüsü Yenileme',
    status: 'completed',
    startDate: '2023-08-20',
    endDate: '2024-01-15',
    progress: 100,
    plannedProgress: 100,
    earnedValue: 950000,
    actualCost: 931000,
    plannedValue: 950000,
    plannedBudgetToDate: 950000,
    subcontractors: 4,
    totalTasks: 67,
    completedTasks: 67,
    location: 'Bursa, Turkey',
    budget: 950000,
    manager: 'Ayşe Özkan',
    budgetSpent: 98,
    daysRemaining: 0,
    totalPlannedDays: 148,
    riskLevel: 'low',
    qualityScore: 4.7,
    healthStatus: 'healthy',
  },
  {
    id: '5',
    name: 'Hastane Ek Binası İnşaatı',
    status: 'active',
    startDate: '2023-11-01',
    endDate: '2024-05-15',
    progress: 89,
    plannedProgress: 95,
    earnedValue: 3649000,
    actualCost: 3895000,
    plannedValue: 3895000,
    plannedBudgetToDate: 3895000,
    subcontractors: 12,
    totalTasks: 203,
    completedTasks: 181,
    location: 'Istanbul, Turkey',
    budget: 4100000,
    manager: 'Can Bulut',
    budgetSpent: 95,
    daysRemaining: 12,
    totalPlannedDays: 196,
    riskLevel: 'high',
    qualityScore: 3.5,
    healthStatus: 'critical',
  },
]

// All widgets now use modern Card components with embedded styles

export default function DashboardPage() {
  const [isCreatingProject, setIsCreatingProject] = React.useState(false)
  const [projectFilter, setProjectFilter] = React.useState('all')
  const router = useRouter()
  const locale = useLocale()

  const breadcrumbItems: Array<{ label: string; href: string }> = []

  const handleProjectClick = (project: CardProject) => {
    // Navigate to localized project details page with rich WBS demo params
    const params = new URLSearchParams({ taskDepth: '2', tasksMax: '18' })
    router.push(`/${locale}/projects/${project.id}?${params.toString()}`)
  }

  const handleCreateProject = () => {
    setIsCreatingProject(true)
    // Simulate project creation flow
    setTimeout(() => {
      alert(
        '🚀 Yeni Proje Oluşturma\n\n📋 Proje adı girin\n📅 Başlangıç tarihi seçin\n👷 Ekip yöneticisi atayın\n💰 Bütçe belirleyin\n\n✅ Bu modal yakında aktif olacak!'
      )
      setIsCreatingProject(false)
    }, 1000)
  }

  // Filter projects based on selected filter
  const getFilteredProjects = () => {
    // Convert centralized simple projects into ProjectCard model
    const statusMap = {
      planned: 'pending',
      active: 'active',
      'on-hold': 'inactive',
      completed: 'completed',
      cancelled: 'cancelled',
    } as const
    const toCard = (p: SimpleProject): CardProject => ({
      id: p.id,
      name: p.name,
      status: statusMap[(p.status || 'active') as keyof typeof statusMap],
      startDate: p.startDate,
      endDate: p.endDate,
      progress: p.progress,
      plannedProgress: p.plannedProgress,
      earnedValue: p.earnedValue,
      actualCost: p.actualCost,
      plannedValue: p.plannedValue,
      plannedBudgetToDate: p.plannedBudgetToDate,
      subcontractors:
        (p.subcontractorIds?.length ?? 0) ||
        (p.subcontractors
          ? Object.values(p.subcontractors).filter(Boolean).length
          : 0),
      totalTasks: p.totalTasks,
      completedTasks: p.completedTasks,
      location: p.location,
      budget: p.budget,
      manager: p.manager,
      budgetSpent: p.budgetSpent,
      daysRemaining: p.daysRemaining,
      riskLevel: p.riskLevel,
      qualityScore: p.qualityScore,
      healthStatus: p.healthStatus,
    })

    const activeProjects = getSimpleProjects()
      .map(toCard)
      .filter(p => p.status === 'active')

    switch (projectFilter) {
      case 'critical':
        return activeProjects.filter(p => p.healthStatus === 'critical')
      case 'risky':
        return activeProjects.filter(p => p.healthStatus === 'warning')
      default:
        return activeProjects
    }
  }

  // Calculate dashboard stats
  const totalProjects = mockProjects.length
  const activeProjects = mockProjects.filter(p => p.status === 'active').length
  // Calculate overview card metrics (only what we use below)
  const activeBudget = mockProjects
    .filter(p => p.status === 'active')
    .reduce((sum, p) => sum + p.budget, 0)
  // Derivations like averageProgress/overallPerformance are removed to avoid unused vars
  const mockActiveArea = 20000 // Mock value in m²

  // Rubriğe göre proje sınıflandırması ve metrik hesapları
  const activeProjectsList = mockProjects.filter(p => p.status === 'active')
  const totalActiveBudget = activeProjectsList.reduce(
    (sum, p) => sum + p.budget,
    0
  )

  // Her proje için performans sınıflandırması
  const classifyProjectPerformance = (project: CardProject) => {
    const cpi =
      project.earnedValue > 0 ? project.earnedValue / project.actualCost : 0
    const spi =
      project.earnedValue > 0 ? project.earnedValue / project.plannedValue : 0
    const combined = 0.6 * cpi + 0.4 * spi

    if (combined < T.COMBINED.risky) return 'kritik'
    if (combined < T.COMBINED.good) return 'riskli'
    return 'iyi'
  }

  // Projeler performansa göre sınıflandırılıyor
  const kritikProjects = activeProjectsList.filter(
    p => classifyProjectPerformance(p) === 'kritik'
  )
  const riskliProjects = activeProjectsList.filter(
    p => classifyProjectPerformance(p) === 'riskli'
  )

  // Bütçe oranları hesaplama (k, r, ktr)
  const kritikBudget = kritikProjects.reduce((sum, p) => sum + p.budget, 0)
  const riskliBudget = riskliProjects.reduce((sum, p) => sum + p.budget, 0)

  const k = totalActiveBudget > 0 ? (kritikBudget / totalActiveBudget) * 100 : 0
  const r = totalActiveBudget > 0 ? (riskliBudget / totalActiveBudget) * 100 : 0
  const ktr = k + r

  // Eski değişkenler için geriye dönük uyumluluk
  const criticalProjectsList = kritikProjects // Eski sistem ile uyumlu
  const criticalProjectsCount = kritikProjects.length
  const budgetSharePercentage = Math.round(ktr) // Toplam risk oranı

  // Cost Performance: Average of progress vs budgetSpent ratio
  const costPerformance =
    criticalProjectsList.length > 0
      ? Math.round(
          (criticalProjectsList.reduce(
            (sum, p) => sum + p.progress / (p.budgetSpent || 1),
            0
          ) /
            criticalProjectsList.length) *
            100
        )
      : 0

  // Schedule Performance: Average progress of critical projects
  const schedulePerformance =
    criticalProjectsList.length > 0
      ? Math.round(
          criticalProjectsList.reduce((sum, p) => sum + p.progress, 0) /
            criticalProjectsList.length
        )
      : 0

  // Rubriğe göre genel durum belirleme
  const getStatusTheme = (k: number, r: number, ktr: number) => {
    // KRİTİK: k >= 15 OR r >= 30 OR ktr >= 20
    if (k >= 15 || r >= 30 || ktr >= 20) {
      return 'KRİTİK'
    }
    // RİSKLİ: k >= 7 OR r >= 15 OR ktr >= 10
    else if (k >= 7 || r >= 15 || ktr >= 10) {
      return 'RİSKLİ'
    }
    // İYİ: Diğer durumlar
    else {
      return 'İYİ'
    }
  }

  const statusTheme = getStatusTheme(k, r, ktr)

  // Aggregate milestone summary across active projects
  const milestoneAgg = React.useMemo(() => {
    const acc = {
      total: 0,
      completed: 0,
      upcoming: 0,
      overdue: 0,
      remaining: 0,
    }
    try {
      const sims: SimpleProject[] = getSimpleProjects()
      for (const p of sims) {
        const ms = p.milestoneSummary
        if (!ms) continue
        acc.total += ms.total
        acc.completed += ms.completed
        acc.upcoming += ms.upcoming
        acc.overdue += ms.overdue
        acc.remaining += ms.remaining
      }
    } catch {}
    return acc
  }, [])

  // Classify milestone health for badge (İYİ/RİSKLİ/KRİTİK)
  const msIssuePct = Math.round(
    ((milestoneAgg.upcoming + milestoneAgg.overdue) /
      Math.max(1, milestoneAgg.total)) *
      100
  )
  const msBadge =
    msIssuePct >= 20
      ? { text: 'KRİTİK', cls: 'bg-red-100 text-red-700' }
      : msIssuePct >= 10
        ? { text: 'RİSKLİ', cls: 'bg-orange-100 text-orange-700' }
        : { text: 'İYİ', cls: 'bg-green-100 text-green-700' }

  if (totalProjects === 0) {
    // Empty state for new users
    return (
      <PageContainer>
        <PageContent>
          <div className="flex items-center justify-center min-h-[60vh] animate-build-up">
            <div className="text-center max-w-md">
              <div className="flex justify-center mb-6">
                <div className="size-16 bg-muted rounded-2xl flex items-center justify-center construction-hover animate-float-tools">
                  <Building2 className="size-8 text-muted-foreground" />
                </div>
              </div>
              <h1 className="text-2xl font-semibold mb-2">
                Temeli Atmaya Hazır mısın? 🏗️
              </h1>
              <p className="text-muted-foreground mb-6">
                Harika bir şey inşa etmek için temeli atalım! İlk inşaat
                projenizi oluşturun, projeden gerçeğe dönüştürmekte size
                yardımcı olalım. Baret takma zamanı! 👷
              </p>
              <Button
                onClick={handleCreateProject}
                disabled={isCreatingProject}
                className="modern-button group button-enhanced"
              >
                <Plus
                  className={cn(
                    'size-4 mr-2 transition-transform',
                    isCreatingProject && 'animate-spin'
                  )}
                />
                {isCreatingProject ? 'Temel Atılıyor...' : 'İnşaata Başla'}
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
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />

        <PageHeader
          title="İzleme ve Operasyon Merkezi 🏗️"
          description="Sahadaki tüm inşaat faaliyetlerinin kuşbakışı görünümü ve gerçek zamanlı kontrol merkezi"
        />

        {/* Sophisticated Dashboard Widgets - ProjectCard Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-stagger">
          {/* Genel Görünüm Kartı - Overview Card */}
          <Card
            className={cn(
              'cursor-pointer floating-card group scale-smooth container-responsive border-l-4 bg-gradient-to-br from-transparent hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col',
              statusTheme === 'İYİ' &&
                'border-l-green-400 from-green-50/50 hover:shadow-green-200/50',
              statusTheme === 'RİSKLİ' &&
                'border-l-orange-400 from-orange-50/50 hover:shadow-orange-200/50 ring-2 ring-orange-500/70',
              statusTheme === 'KRİTİK' &&
                'border-l-red-400 from-red-50/50 hover:shadow-red-200/50 ring-2 ring-red-500/80'
            )}
            onClick={() =>
              alert(
                `🏗️ Genel Görünüm Detayı (Rubrik)\n\n📊 Risk Metrikları:\n• K (Kritik): %${k.toFixed(1)}\n• R (Riskli): %${r.toFixed(1)}\n• KTR (Toplam): %${ktr.toFixed(1)}\n\n💰 Bütçe Bilgileri:\n• Aktif Bütçe: ${(activeBudget / 1000000).toFixed(1)}M TL\n• Aktif Alan: ${mockActiveArea.toLocaleString()} m²\n• Aktif Proje: ${activeProjects} adet\n\n📋 Rubrik Durumu: ${statusTheme}\n${statusTheme === 'İYİ' ? '✅ Tüm risk oranları eşiklerin altında - Durumu iyi!' : statusTheme === 'RİSKLİ' ? '⚠️ Risk oranları eşik seviyelerinde - Yakın takip öneriliyor!' : '🚨 Risk oranları kritik eşikleri aştı - Acil müdahale gerekli!'}\n\n📌 Eşikler: Kritik≥15%, Riskli≥30%, Toplam≥20% → KRİTİK`
              )
            }
          >
            {/* Shimmer Effect for RISKLI and KRITIK states */}
            {statusTheme !== 'İYİ' && (
              <div
                className={cn(
                  'absolute inset-0 -translate-x-full animate-shimmer',
                  statusTheme === 'RİSKLİ' && 'opacity-60',
                  statusTheme === 'KRİTİK' && 'opacity-70'
                )}
              >
                <div
                  className={cn(
                    'h-full w-full bg-gradient-to-r from-transparent to-transparent skew-x-12',
                    statusTheme === 'RİSKLİ' && 'via-orange-300/40',
                    statusTheme === 'KRİTİK' && 'via-red-300/40'
                  )}
                />
              </div>
            )}

            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle
                  className={cn(
                    'text-heading-md flex items-center gap-2',
                    statusTheme === 'İYİ' &&
                      'text-green-700 dark:text-green-400',
                    statusTheme === 'RİSKLİ' &&
                      'text-orange-700 dark:text-orange-400',
                    statusTheme === 'KRİTİK' && 'text-red-700 dark:text-red-400'
                  )}
                >
                  <Building2 className="size-5" />
                  Genel Görünüm
                  {/* TODO: Replace with i18n key: t('dashboard.overview.title') */}
                </CardTitle>
                <div
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold min-w-[80px] justify-center',
                    statusTheme === 'İYİ' && 'bg-green-100 text-green-700',
                    statusTheme === 'RİSKLİ' && 'bg-orange-100 text-orange-700',
                    statusTheme === 'KRİTİK' &&
                      'bg-red-100 text-red-700 animate-pulse'
                  )}
                >
                  {statusTheme === 'İYİ'
                    ? '🟢 İYİ'
                    : statusTheme === 'RİSKLİ'
                      ? '🟡 RİSKLİ'
                      : '🔴 KRİTİK'}
                  {/* TODO: Replace with i18n keys */}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Top Section */}
              <div className="space-y-4 flex-1">
                {/* Active Budget */}
                <div className="text-center">
                  <div
                    className={cn(
                      'text-2xl font-bold mb-1',
                      statusTheme === 'İYİ' && 'text-green-700',
                      statusTheme === 'RİSKLİ' && 'text-orange-700',
                      statusTheme === 'KRİTİK' && 'text-red-700'
                    )}
                  >
                    ₺{(activeBudget / 1000000).toFixed(0)}M TL
                  </div>
                  <div
                    className={cn(
                      'text-sm font-medium',
                      statusTheme === 'İYİ' && 'text-green-600',
                      statusTheme === 'RİSKLİ' && 'text-orange-600',
                      statusTheme === 'KRİTİK' && 'text-red-600'
                    )}
                  >
                    Aktif Bütçe
                    {/* TODO: Replace with i18n key: t('dashboard.overview.activeBudget') */}
                  </div>
                </div>

                {/* Active Area - PRIMARY/LARGEST */}
                <div className="text-center">
                  <div
                    className={cn(
                      'text-4xl font-bold mb-1',
                      statusTheme === 'İYİ' && 'text-green-800',
                      statusTheme === 'RİSKLİ' && 'text-orange-800',
                      statusTheme === 'KRİTİK' && 'text-red-800'
                    )}
                  >
                    {mockActiveArea.toLocaleString()} m²
                  </div>
                  <div
                    className={cn(
                      'text-sm font-medium',
                      statusTheme === 'İYİ' && 'text-green-600',
                      statusTheme === 'RİSKLİ' && 'text-orange-600',
                      statusTheme === 'KRİTİK' && 'text-red-600'
                    )}
                  >
                    Aktif Alan
                    {/* TODO: Replace with i18n key: t('dashboard.overview.activeArea') */}
                  </div>
                </div>
              </div>

              {/* Performance and Active Projects Grid - Always at bottom */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Risk Oranı (ktr) with CircularProgress */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-2 h-12 w-12 flex items-center justify-center">
                    <CircularProgress
                      percentage={Math.min(ktr, 100)} // 100'ü aşmasın
                      size={48}
                      strokeWidth={4}
                      color={
                        statusTheme === 'İYİ'
                          ? 'rgb(34 197 94)'
                          : statusTheme === 'RİSKLİ'
                            ? 'rgb(249 115 22)'
                            : 'rgb(239 68 68)'
                      }
                      showText={false}
                      animate={true}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={cn(
                          'text-sm font-bold',
                          statusTheme === 'İYİ' && 'text-green-700',
                          statusTheme === 'RİSKLİ' && 'text-orange-700',
                          statusTheme === 'KRİTİK' && 'text-red-700'
                        )}
                      >
                        %{Math.round(ktr)}
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'text-sm font-medium text-center',
                      statusTheme === 'İYİ' && 'text-green-600',
                      statusTheme === 'RİSKLİ' && 'text-orange-600',
                      statusTheme === 'KRİTİK' && 'text-red-600'
                    )}
                  >
                    Proje Performansı
                    {/* TODO: Replace with i18n key: t('dashboard.overview.projectPerformance') */}
                  </div>
                </div>

                {/* Active Projects */}
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 flex items-center justify-center mb-2">
                    <span
                      className={cn(
                        'text-2xl font-bold',
                        statusTheme === 'İYİ' && 'text-green-700',
                        statusTheme === 'RİSKLİ' && 'text-orange-700',
                        statusTheme === 'KRİTİK' && 'text-red-700'
                      )}
                    >
                      {activeProjects}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'text-sm font-medium text-center',
                      statusTheme === 'İYİ' && 'text-green-600',
                      statusTheme === 'RİSKLİ' && 'text-orange-600',
                      statusTheme === 'KRİTİK' && 'text-red-600'
                    )}
                  >
                    Aktif Proje
                    {/* TODO: Replace with i18n key: t('dashboard.overview.activeProjects') */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kritik Projeler Widget - Same structure as Genel Görünüm */}
          <Card
            className="cursor-pointer floating-card group scale-smooth container-responsive border-l-4 border-l-red-400 bg-gradient-to-br from-red-50/50 to-transparent hover:shadow-red-200/50 transition-all duration-300 relative overflow-hidden ring-2 ring-red-500/80 flex flex-col"
            onClick={() =>
              alert(
                `🚨 Kritik Projeler Detayı\n\n• Kritik Proje Sayısı: ${criticalProjectsCount} adet\n• Bütçe Payı: %${budgetSharePercentage}\n• Bütçe Performansı: %${costPerformance}\n• Takvim Performansı: %${schedulePerformance}\n\n🚨 ${criticalProjectsList.map(p => p.name).join(', ')}\n\n🔥 Acil müdahale gerekli!`
              )
            }
          >
            {/* Shimmer Effect for Critical State */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer opacity-70">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-red-300/40 to-transparent skew-x-12" />
            </div>

            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-heading-md text-red-700 dark:text-red-400 flex items-center gap-2">
                  <AlertTriangle className="size-5" />
                  Kritik Projeler
                  {/* TODO: Replace with i18n key: t('dashboard.criticalProjects.title') */}
                </CardTitle>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-bold animate-pulse min-w-[80px] justify-center">
                  🔴 KRİTİK
                  {/* TODO: Replace with i18n key: t('dashboard.criticalProjects.badge') */}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Top Section */}
              <div className="space-y-4 flex-1">
                {/* Budget Share */}
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1 text-red-800">
                    %{budgetSharePercentage}
                  </div>
                  <div className="text-sm font-medium text-red-700">
                    Bütçe Payı
                    {/* TODO: Replace with i18n key: t('dashboard.criticalProjects.budgetShare') */}
                  </div>
                </div>

                {/* Critical Projects Count - PRIMARY/LARGEST */}
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1 text-red-900">
                    {criticalProjectsCount}
                  </div>
                  <div className="text-sm font-medium text-red-700">
                    Kritik Proje
                    {/* TODO: Replace with i18n key: t('dashboard.criticalProjects.count') */}
                  </div>
                </div>
              </div>

              {/* Performance Metrics Grid - Always at bottom */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Cost Performance with CircularProgress */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-2 h-12 w-12 flex items-center justify-center">
                    <CircularProgress
                      percentage={costPerformance}
                      size={48}
                      strokeWidth={4}
                      color="rgb(239 68 68)"
                      showText={false}
                      animate={true}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-red-800">
                        %{costPerformance}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-center text-red-700">
                    Bütçe Performansı
                    {/* TODO: Replace with i18n key: t('dashboard.criticalProjects.budgetPerformance') */}
                  </div>
                </div>

                {/* Schedule Performance */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-2 h-12 w-12 flex items-center justify-center">
                    <CircularProgress
                      percentage={schedulePerformance}
                      size={48}
                      strokeWidth={4}
                      color="rgb(239 68 68)"
                      showText={false}
                      animate={true}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-red-800">
                        %{schedulePerformance}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-center text-red-700">
                    Takvim Performansı
                    {/* TODO: Replace with i18n key: t('dashboard.criticalProjects.schedulePerformance') */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Riskli Projeler Widget - Same structure as Kritik Projeler */}
          <Card
            className="cursor-pointer floating-card group scale-smooth container-responsive border-l-4 border-l-orange-400 bg-gradient-to-br from-orange-50/50 to-transparent hover:shadow-orange-200/50 transition-all duration-300 relative overflow-hidden ring-2 ring-orange-500/70 flex flex-col"
            onClick={() => {
              // Calculate risky projects
              const riskyProjects = mockProjects.filter(
                p =>
                  p.riskLevel === 'medium' ||
                  (p.progress < 75 && p.progress >= 50 && p.status === 'active')
              )
              const riskyProjectsCount = riskyProjects.length
              const totalActiveBudget = mockProjects
                .filter(p => p.status === 'active')
                .reduce((sum, p) => sum + p.budget, 0)
              const riskyBudget = riskyProjects.reduce(
                (sum, p) => sum + p.budget,
                0
              )
              const budgetSharePercentage = Math.round(
                (riskyBudget / totalActiveBudget) * 100
              )
              const costPerformance = Math.round(
                (riskyProjects.reduce(
                  (sum, p) => sum + p.progress / (p.budgetSpent || 1),
                  0
                ) /
                  riskyProjects.length) *
                  100
              )
              const schedulePerformance = Math.round(
                riskyProjects.reduce((sum, p) => sum + p.progress, 0) /
                  riskyProjects.length
              )
              const riskyProjectsList = riskyProjects.map(p => p.name)

              alert(
                `🟡 Riskli Projeler Detayı\n\n• Riskli Proje Sayısı: ${riskyProjectsCount} adet\n• Bütçe Payı: %${budgetSharePercentage}\n• Bütçe Performansı: %${costPerformance}\n• Takvim Performansı: %${schedulePerformance}\n\n🟡 ${riskyProjectsList.join(', ')}\n\n⚠️ Yakın takip öneriliyor!`
              )
            }}
          >
            {/* Shimmer Effect for Risk State */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer opacity-60">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-orange-300/40 to-transparent skew-x-12" />
            </div>

            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-heading-md text-orange-700 dark:text-orange-400 flex items-center gap-2">
                  <AlertTriangle className="size-5" />
                  Riskli Projeler
                  {/* TODO: Replace with i18n key: t('dashboard.riskyProjects.title') */}
                </CardTitle>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold animate-pulse min-w-[80px] justify-center">
                  🟡 RİSKLİ
                  {/* TODO: Replace with i18n key: t('dashboard.riskyProjects.badge') */}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Top Section */}
              <div className="space-y-4 flex-1">
                {/* Budget Share */}
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1 text-orange-700">
                    %
                    {Math.round(
                      (mockProjects
                        .filter(
                          p =>
                            p.riskLevel === 'medium' ||
                            (p.progress < 75 &&
                              p.progress >= 50 &&
                              p.status === 'active')
                        )
                        .reduce((sum, p) => sum + p.budget, 0) /
                        mockProjects
                          .filter(p => p.status === 'active')
                          .reduce((sum, p) => sum + p.budget, 0)) *
                        100
                    )}
                  </div>
                  <div className="text-sm font-medium text-orange-600">
                    Bütçe Payı
                    {/* TODO: Replace with i18n key: t('dashboard.riskyProjects.budgetShare') */}
                  </div>
                </div>

                {/* Risky Projects Count - PRIMARY/LARGEST */}
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1 text-orange-800">
                    {
                      mockProjects.filter(
                        p =>
                          p.riskLevel === 'medium' ||
                          (p.progress < 75 &&
                            p.progress >= 50 &&
                            p.status === 'active')
                      ).length
                    }
                  </div>
                  <div className="text-sm font-medium text-orange-600">
                    Riskli Proje
                    {/* TODO: Replace with i18n key: t('dashboard.riskyProjects.count') */}
                  </div>
                </div>
              </div>

              {/* Performance Metrics Grid - Always at bottom */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Cost Performance with CircularProgress */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-2 h-12 w-12 flex items-center justify-center">
                    <CircularProgress
                      percentage={Math.round(
                        (mockProjects
                          .filter(
                            p =>
                              p.riskLevel === 'medium' ||
                              (p.progress < 75 &&
                                p.progress >= 50 &&
                                p.status === 'active')
                          )
                          .reduce(
                            (sum, p) => sum + p.progress / (p.budgetSpent || 1),
                            0
                          ) /
                          mockProjects.filter(
                            p =>
                              p.riskLevel === 'medium' ||
                              (p.progress < 75 &&
                                p.progress >= 50 &&
                                p.status === 'active')
                          ).length) *
                          100
                      )}
                      size={48}
                      strokeWidth={4}
                      color="rgb(249 115 22)"
                      showText={false}
                      animate={true}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-orange-700">
                        %
                        {Math.round(
                          (mockProjects
                            .filter(
                              p =>
                                p.riskLevel === 'medium' ||
                                (p.progress < 75 &&
                                  p.progress >= 50 &&
                                  p.status === 'active')
                            )
                            .reduce(
                              (sum, p) =>
                                sum + p.progress / (p.budgetSpent || 1),
                              0
                            ) /
                            mockProjects.filter(
                              p =>
                                p.riskLevel === 'medium' ||
                                (p.progress < 75 &&
                                  p.progress >= 50 &&
                                  p.status === 'active')
                            ).length) *
                            100
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-center text-orange-600">
                    Bütçe Performansı
                    {/* TODO: Replace with i18n key: t('dashboard.riskyProjects.budgetPerformance') */}
                  </div>
                </div>

                {/* Schedule Performance */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-2 h-12 w-12 flex items-center justify-center">
                    <CircularProgress
                      percentage={Math.round(
                        mockProjects
                          .filter(
                            p =>
                              p.riskLevel === 'medium' ||
                              (p.progress < 75 &&
                                p.progress >= 50 &&
                                p.status === 'active')
                          )
                          .reduce((sum, p) => sum + p.progress, 0) /
                          mockProjects.filter(
                            p =>
                              p.riskLevel === 'medium' ||
                              (p.progress < 75 &&
                                p.progress >= 50 &&
                                p.status === 'active')
                          ).length
                      )}
                      size={48}
                      strokeWidth={4}
                      color="rgb(249 115 22)"
                      showText={false}
                      animate={true}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-orange-700">
                        %
                        {Math.round(
                          mockProjects
                            .filter(
                              p =>
                                p.riskLevel === 'medium' ||
                                (p.progress < 75 &&
                                  p.progress >= 50 &&
                                  p.status === 'active')
                            )
                            .reduce((sum, p) => sum + p.progress, 0) /
                            mockProjects.filter(
                              p =>
                                p.riskLevel === 'medium' ||
                                (p.progress < 75 &&
                                  p.progress >= 50 &&
                                  p.status === 'active')
                            ).length
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-center text-orange-600">
                    Takvim Performansı
                    {/* TODO: Replace with i18n key: t('dashboard.riskyProjects.schedulePerformance') */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kilometre Taşları Widget */}
          <Card
            className="cursor-pointer floating-card group scale-smooth container-responsive border-l-4 border-l-blue-400 bg-gradient-to-br from-blue-50/50 to-transparent hover:shadow-blue-200/50 transition-all duration-300"
            onClick={() =>
              alert(
                `🎯 Kilometre Taşları\n\nTamamlanan: ${milestoneAgg.completed}\nYaklaşan (≤14g): ${milestoneAgg.upcoming}\nGeciken: ${milestoneAgg.overdue}\nKalan: ${milestoneAgg.remaining}\n\n📊 Toplam: ${milestoneAgg.completed + milestoneAgg.upcoming + milestoneAgg.overdue + milestoneAgg.remaining}`
              )
            }
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-heading-md text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Target className="size-5" />
                  Kilometre Taşları
                </CardTitle>
                <div
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold min-w-[80px] justify-center ${msBadge.cls}`}
                >
                  {msBadge.text}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Milestone Progress Visualization */}
              <div className="relative">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <CircularProgress
                      percentage={Math.round(
                        (milestoneAgg.completed /
                          Math.max(1, milestoneAgg.total)) *
                          100
                      )}
                      size={80}
                      strokeWidth={8}
                      color="rgb(59 130 246)"
                      showText={false}
                      animate={true}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-blue-700">
                        {milestoneAgg.completed}
                      </span>
                      <span className="text-xs text-blue-600">
                        /{milestoneAgg.total}
                      </span>
                      <span className="text-xs text-blue-500">Tamamlandı</span>
                    </div>
                  </div>
                </div>

                {/* Milestone Summary Grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div
                    className="p-2 rounded-lg border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 cursor-pointer hover:scale-105 transition-transform"
                    onClick={e => {
                      e.stopPropagation()
                      alert(
                        `🟡 Yaklaşan Kilometre Taşları: ${milestoneAgg.upcoming}`
                      )
                    }}
                  >
                    <div className="text-lg font-bold text-yellow-700">
                      {milestoneAgg.upcoming}
                    </div>
                    <div className="text-xs text-yellow-600">Yaklaşan</div>
                  </div>
                  <div
                    className="p-2 rounded-lg border border-red-200 bg-gradient-to-br from-red-50 to-red-100 cursor-pointer hover:scale-105 transition-transform"
                    onClick={e => {
                      e.stopPropagation()
                      alert(
                        `🔴 Geciken Kilometre Taşları: ${milestoneAgg.overdue}`
                      )
                    }}
                  >
                    <div className="text-lg font-bold text-red-700">
                      {milestoneAgg.overdue}
                    </div>
                    <div className="text-xs text-red-600">Geciken</div>
                  </div>
                  <div
                    className="p-2 rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer hover:scale-105 transition-transform"
                    onClick={e => {
                      e.stopPropagation()
                      alert(
                        `📋 Kalan Kilometre Taşları: ${milestoneAgg.remaining}`
                      )
                    }}
                  >
                    <div className="text-lg font-bold text-gray-700">
                      {milestoneAgg.remaining}
                    </div>
                    <div className="text-xs text-gray-600">Kalan</div>
                  </div>
                </div>
              </div>

              {/* Completed Indicator */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                <span className="text-sm font-semibold text-green-800">
                  Tamamlanan
                </span>
                <span className="text-lg font-bold text-green-700">
                  {milestoneAgg.completed}
                </span>
              </div>

              <div className="text-xs text-blue-600 opacity-75">
                {Math.round(
                  ((milestoneAgg.upcoming + milestoneAgg.overdue) /
                    Math.max(1, milestoneAgg.total)) *
                    100
                )}
                % kilometre taşı yakın veya gecikmiş
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Projects Overview Cards - Same as Projects Page */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Building2 className="size-6 text-primary" />
                Aktif Projeler
              </h2>
              <ToggleGroup
                type="single"
                value={projectFilter}
                onValueChange={value => setProjectFilter(value || 'all')}
                className="bg-muted p-1 rounded-lg"
              >
                <ToggleGroupItem
                  value="all"
                  className="text-xs px-3 py-1.5 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
                >
                  Tümü
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="critical"
                  className="text-xs px-3 py-1.5 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm data-[state=on]:text-red-700"
                >
                  Kritik
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="risky"
                  className="text-xs px-3 py-1.5 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm data-[state=on]:text-orange-700"
                >
                  Riskli
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Button
              variant="outline"
              className="modern-button group"
              onClick={() => router.push(`/${locale}/projects`)}
            >
              Tüm Projeleri Gör
            </Button>
          </div>

          <div className="grid-responsive spacing-relaxed animate-stagger">
            {getFilteredProjects()
              .slice(0, 4)
              .map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={handleProjectClick}
                  index={index}
                />
              ))}
          </div>
        </div>

        {/* Modern Activity and Overview Grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          style={{ display: 'none' }}
        >
          {/* Ultra Modern Live Activity Feed */}
          <Card className="lg:col-span-2 floating-card glass-card border-l-4 border-l-blue-400 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-transparent">
              <CardTitle className="flex items-center gap-3 text-heading-lg">
                <div className="pulse-ring">
                  <Activity className="size-6 text-blue-500 animate-pulse" />
                </div>
                <span className="font-bold tracking-tight">
                  Canlı Faaliyet Akışı
                </span>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-caption font-bold animate-spring-in">
                  <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                  CANLI
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 animate-stagger">
                {/* HIGH PRIORITY - Task Delayed */}
                <div className="group flex items-center gap-4 p-4 floating-card rounded-xl border border-red-200/50 border-l-4 border-l-red-400 bg-gradient-to-r from-red-50/30 to-transparent hover:from-red-50/60 transition-all duration-300 modern-hover relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer opacity-70">
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-red-300/40 to-transparent skew-x-12" />
                  </div>
                  <div className="relative">
                    <div className="size-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-lg">
                      <Clock className="size-6 text-red-600 animate-pulse" />
                    </div>
                    <div className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-red-800 text-body-md">
                      Çatı izolasyonu 4 gün gecikecek
                    </p>
                    <p className="text-body-sm text-muted-foreground">
                      <span className="font-medium text-blue-600">
                        Şehir Merkezi Ofis Kompleksi
                      </span>{' '}
                      •{' '}
                      <span className="font-medium text-orange-600">
                        Bulut İzolasyon
                      </span>{' '}
                      •{' '}
                      <span className="font-medium text-red-600">
                        30 dk önce
                      </span>
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Plandan %15 sapma • 3 iş etkilenecek
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-caption font-bold animate-pulse">
                      YÜKSEK
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Hava koşulları
                    </div>
                  </div>
                </div>

                {/* MEDIUM PRIORITY - Contractor Issue */}
                <div className="group flex items-center gap-4 p-4 floating-card rounded-xl border border-yellow-200/50 border-l-4 border-l-yellow-400 bg-gradient-to-r from-yellow-50/30 to-transparent hover:from-yellow-50/60 transition-all duration-300 modern-hover">
                  <div className="size-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <AlertTriangle className="size-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-yellow-800 text-body-md">
                      Taşeron işçi eksikliği bildirdi
                    </p>
                    <p className="text-body-sm text-muted-foreground">
                      <span className="font-medium text-blue-600">
                        Alışveriş Merkezi Genişletme
                      </span>{' '}
                      •{' '}
                      <span className="font-medium text-orange-600">
                        Demir Yapı
                      </span>{' '}
                      • <span className="font-medium">4 saat önce</span>
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      5 kalıpçı ihtiyacı • 2 gün gecikme riski
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-caption font-bold">
                      ORTA
                    </div>
                    <div className="text-xs text-muted-foreground">
                      İşçi sorunu
                    </div>
                  </div>
                </div>

                {/* LOW PRIORITY - Task Completed */}
                <div className="group flex items-center gap-4 p-4 floating-card rounded-xl border border-green-200/50 border-l-4 border-l-green-400 bg-gradient-to-r from-green-50/30 to-transparent hover:from-green-50/60 transition-all duration-300 modern-hover">
                  <div className="relative">
                    <CircularProgress
                      percentage={100}
                      size={48}
                      strokeWidth={4}
                      color="rgb(16 185 129)"
                      showText={false}
                      animate={true}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle className="size-5 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-green-800 text-body-md">
                      Elektrik ana pano montajı tamamlandı
                    </p>
                    <p className="text-body-sm text-muted-foreground">
                      <span className="font-medium text-blue-600">
                        Konut Kulesi A
                      </span>{' '}
                      •{' '}
                      <span className="font-medium text-orange-600">
                        Aydın Elektrik
                      </span>{' '}
                      • <span className="font-medium">2 saat önce</span>
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Plandan 2 gün önde • %8 pozitif sapma
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-caption font-bold">
                      DÜŞÜK
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Zamanında
                    </div>
                  </div>
                </div>

                {/* MEDIUM PRIORITY - Quality Check */}
                <div className="group flex items-center gap-4 p-4 floating-card rounded-xl border border-blue-200/50 border-l-4 border-l-blue-400 bg-gradient-to-r from-blue-50/30 to-transparent hover:from-blue-50/60 transition-all duration-300 modern-hover">
                  <div className="size-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Building2 className="size-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-blue-800 text-body-md">
                      Beton numune testi onaylandı
                    </p>
                    <p className="text-body-sm text-muted-foreground">
                      <span className="font-medium text-blue-600">
                        Hastane Ek Binası İnşaatı
                      </span>{' '}
                      • C30 dayanım sağlandı •{' '}
                      <span className="font-medium">1 saat önce</span>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Kalite kontrolü geçti • Döküm devam edebilir
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-caption font-bold">
                      ORTA
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Kalite OK
                    </div>
                  </div>
                </div>

                {/* LOW PRIORITY - Contractor Assignment */}
                <div className="group flex items-center gap-4 p-4 floating-card rounded-xl border border-purple-200/50 border-l-4 border-l-purple-400 bg-gradient-to-r from-purple-50/30 to-transparent hover:from-purple-50/60 transition-all duration-300 modern-hover">
                  <div className="size-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Users className="size-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-purple-800 text-body-md">
                      Yeni taşeron atandı
                    </p>
                    <p className="text-body-sm text-muted-foreground">
                      <span className="font-medium text-blue-600">
                        Otoyol Köprüsü Yenileme
                      </span>{' '}
                      •{' '}
                      <span className="font-medium text-orange-600">
                        Star Seramik
                      </span>{' '}
                      • <span className="font-medium">Az önce</span>
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      Zemin kaplama işleri • Sözleşme onaylandı
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-caption font-bold">
                      DÜŞÜK
                    </div>
                    <div className="text-xs text-muted-foreground">Atama</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ultra Modern Quick Actions Panel */}
          <Card className="floating-card glass-card border-l-4 border-l-indigo-400 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-transparent">
              <CardTitle className="flex items-center gap-3 text-heading-lg">
                <div className="relative">
                  <Timer className="size-6 text-indigo-500" />
                  <div className="absolute inset-0 animate-shimmer">
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  </div>
                </div>
                <span className="font-bold tracking-tight">Hızlı İşlemler</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
              {/* Approval Requests Button */}
              <Button
                className="w-full justify-start group modern-hover glass-button h-14 relative overflow-hidden border-0 bg-gradient-to-r from-orange-50/50 to-transparent hover:from-orange-100/70"
                onClick={() =>
                  alert(
                    '⚠️ Onay İstekleri\n\n• 3 acil onay bekliyor\n• Malzeme satın alma\n• Taşeron sözleşmeleri\n• Proje değişiklikleri\n\n🚨 Hemen kontrol edin!'
                  )
                }
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center w-full">
                  <div className="size-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    <AlertTriangle className="size-5 text-orange-600 animate-pulse group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-orange-800 text-body-md">
                      Onay İsteklerine Git
                    </div>
                    <div className="text-caption text-orange-600 opacity-75">
                      3 acil onay bekliyor
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold animate-pulse">
                      ACİL
                    </div>
                    <div className="size-6 text-orange-500 opacity-60 group-hover:translate-x-1 transition-transform">
                      →
                    </div>
                  </div>
                </div>
              </Button>

              {/* Work Item Definition Button */}
              <Button
                className="w-full justify-start group modern-hover glass-button h-14 relative overflow-hidden border-0 bg-gradient-to-r from-purple-50/50 to-transparent hover:from-purple-100/70"
                onClick={() =>
                  alert(
                    '📝 Yeni İş Maddesi Tanımla\n\n• İş kapsamı belirleme\n• Kaynak gereksinimleri\n• Tahmini süre ve maliyet\n• Taşeron atama\n\n✅ İş madde editörü yakında aktif!'
                  )
                }
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center w-full">
                  <div className="size-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    <Plus className="size-5 text-purple-600 group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-purple-800 text-body-md">
                      Yeni İş Maddesi Tanımla
                    </div>
                    <div className="text-caption text-purple-600 opacity-75">
                      Bir projeye yeni iş kalemi ekle
                    </div>
                  </div>
                  <div className="size-6 text-purple-500 opacity-60 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>
              </Button>

              {/* Plan Creation Button */}
              <Button
                className="w-full justify-start group modern-hover glass-button h-14 relative overflow-hidden border-0 bg-gradient-to-r from-blue-50/50 to-transparent hover:from-blue-100/70"
                onClick={() =>
                  alert(
                    '🏗️ Yeni Proje Tanımla\n\n• Proje kapsamı\n• Temel bilgiler\n• Lokasyon ve detaylar\n\n✅ Proje oluşturma editörü yakında aktif!'
                  )
                }
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center w-full">
                  <div className="size-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    <Plus className="size-5 text-blue-600 group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-blue-800 text-body-md">
                      Yeni Proje Tanımla
                    </div>
                    <div className="text-caption text-blue-600 opacity-75">
                      Yeni inşaat projesi başlat
                    </div>
                  </div>
                  <div className="size-6 text-blue-500 opacity-60 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>
              </Button>

              {/* Team Member Addition Button */}
              <Button
                className="w-full justify-start group modern-hover glass-button h-14 relative overflow-hidden border-0 bg-gradient-to-r from-green-50/50 to-transparent hover:from-green-100/70"
                onClick={() =>
                  alert(
                    '👷 Ekip Üyesi Alma\n\n• Pozisyon seçimi\n• Yetkinlik kontrolü\n• İK onay süreci\n\n✅ İnsan kaynakları modülü geliştiriliyor!'
                  )
                }
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center w-full">
                  <div className="size-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    <Users className="size-5 text-green-600 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-green-800 text-body-md">
                      Ekip Üyesi Al
                    </div>
                    <div className="text-caption text-green-600 opacity-75">
                      Personel & yetkinlik yönetimi
                    </div>
                  </div>
                  <div className="size-6 text-green-500 opacity-60 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </PageContainer>
  )
}

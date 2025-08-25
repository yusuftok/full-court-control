'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import {
  Plus,
  Building2,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  DollarSign,
  Star,
  Wrench,
  Target,
  Activity,
  Timer,
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CircularProgress } from '@/components/ui/circular-progress'
import {
  PageContainer,
  PageHeader,
  PageContent,
} from '@/components/layout/page-container'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { ProjectCard, type Project } from '@/components/projects/project-card'
import { AnalyticsMetricCard } from '@/components/data/stat-card'
import { CircularMetricCard } from '@/components/data/circular-metric-card'

// Mock data uses Project type from component

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Şehir Merkezi Ofis Kompleksi',
    status: 'active',
    startDate: '2024-01-15',
    progress: 68,
    subcontractors: 5,
    totalTasks: 250,
    completedTasks: 84,
    location: 'Istanbul, Turkey',
    budget: 2500000,
    manager: 'Ahmet Yılmaz',
    budgetSpent: 65,
    daysRemaining: 45,
    riskLevel: 'low',
    qualityScore: 4.2,
    healthStatus: 'healthy',
  },
  {
    id: '2',
    name: 'Konut Kulesi A',
    status: 'active',
    startDate: '2024-02-01',
    progress: 45,
    subcontractors: 8,
    totalTasks: 89,
    completedTasks: 40,
    location: 'Ankara, Turkey',
    budget: 1800000,
    manager: 'Fatma Demir',
    budgetSpent: 52,
    daysRemaining: 78,
    riskLevel: 'medium',
    qualityScore: 3.8,
    healthStatus: 'warning',
  },
  {
    id: '3',
    name: 'Alışveriş Merkezi Genişletme',
    status: 'pending',
    startDate: '2024-03-10',
    progress: 12,
    subcontractors: 3,
    totalTasks: 156,
    completedTasks: 19,
    location: 'Izmir, Turkey',
    budget: 3200000,
    manager: 'Mehmet Kaya',
    budgetSpent: 8,
    daysRemaining: 120,
    riskLevel: 'low',
    qualityScore: 4.0,
    healthStatus: 'healthy',
  },
  {
    id: '4',
    name: 'Otoyol Köprüsü Yenileme',
    status: 'completed',
    startDate: '2023-08-20',
    endDate: '2024-01-15',
    progress: 100,
    subcontractors: 4,
    totalTasks: 67,
    completedTasks: 67,
    location: 'Bursa, Turkey',
    budget: 950000,
    manager: 'Ayşe Özkan',
    budgetSpent: 98,
    daysRemaining: 0,
    riskLevel: 'low',
    qualityScore: 4.7,
    healthStatus: 'healthy',
  },
  {
    id: '5',
    name: 'Hastane Ek Binası İnşaatı',
    status: 'active',
    startDate: '2023-11-01',
    progress: 89,
    subcontractors: 12,
    totalTasks: 203,
    completedTasks: 181,
    location: 'Istanbul, Turkey',
    budget: 4100000,
    manager: 'Can Bulut',
    budgetSpent: 95,
    daysRemaining: 12,
    riskLevel: 'high',
    qualityScore: 3.5,
    healthStatus: 'critical',
  },
]

// All widgets now use modern Card components with embedded styles

export default function DashboardPage() {
  const [isCreatingProject, setIsCreatingProject] = React.useState(false)

  const breadcrumbItems: Array<{ label: string; href: string }> = []

  const handleProjectClick = (project: Project) => {
    // Navigate to project details
    window.location.href = `/projects/${project.id}`
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

  // Calculate dashboard stats
  const totalProjects = mockProjects.length
  const activeProjects = mockProjects.filter(p => p.status === 'active').length
  const completedProjects = mockProjects.filter(
    p => p.status === 'completed'
  ).length
  const totalTasks = mockProjects.reduce((sum, p) => sum + p.totalTasks, 0)
  const completedTasks = mockProjects.reduce(
    (sum, p) => sum + p.completedTasks,
    0
  )
  const averageProgress = Math.round(
    mockProjects.reduce((sum, p) => sum + p.progress, 0) / totalProjects
  )

  const criticalProjects = mockProjects.filter(
    p => p.progress < 30 && p.status === 'active'
  ).length
  const onScheduleProjects = mockProjects.filter(
    p => p.progress >= 75 && p.status === 'active'
  ).length

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
          {/* Geciken İşler Widget - Circular Progress */}
          <Card
            className="cursor-pointer floating-card group scale-smooth container-responsive border-l-4 border-l-amber-400 bg-gradient-to-br from-amber-50/50 to-transparent hover:shadow-amber-200/50 transition-all duration-300 relative overflow-hidden"
            onClick={() =>
              alert(
                `🔴 Geciken İşler Detayı\n\n• Toplam Geciken: 8/250 iş (%3.2)\n• Kritik Path'te: 2 iş\n• Etkilenen Taşeron: 4 firma\n• Ortalama Gecikme: 3.5 gün\n\n⚠️ Normal seviyede gecikme oranı!`
              )
            }
          >
            {/* Shimmer Effect for Urgent State */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer opacity-70">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-amber-300/40 to-transparent skew-x-12" />
            </div>

            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-heading-md text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="size-5" />
                  Geciken İşler
                </CardTitle>
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-caption font-bold">
                  🟡 DİKKAT
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Circular Progress Display */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <CircularProgress
                    percentage={Math.round((8 / 250) * 100)}
                    size={64}
                    strokeWidth={6}
                    color="rgb(245 158 11)"
                    showText={false}
                    animate={true}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-amber-700">8</span>
                    <span className="text-xs text-amber-600">/250</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-body-sm text-amber-600 mb-1">
                    İş Durumu
                  </div>
                  <div className="text-heading-sm text-amber-800 mb-2">
                    3.2% Geciken
                  </div>
                  <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out relative bg-gradient-to-r from-amber-500 to-amber-400"
                      style={{ width: '3.2%' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Severity Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-red-50 border border-red-200">
                  <div className="text-sm font-bold text-red-700">2</div>
                  <div className="text-xs text-red-600">Kritik</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="text-sm font-bold text-amber-700">4</div>
                  <div className="text-xs text-amber-600">Orta</div>
                </div>
                <div className="p-2 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="text-sm font-bold text-yellow-700">2</div>
                  <div className="text-xs text-yellow-600">Hafif</div>
                </div>
              </div>

              <div className="text-xs text-amber-600 opacity-75">
                Elektrik işlerinde yoğunlaşma
              </div>
            </CardContent>
          </Card>

          {/* Kritik Deadline'lar Widget - Multi-segment */}
          <Card
            className="cursor-pointer floating-card group scale-smooth container-responsive border-l-4 border-l-red-400 bg-gradient-to-br from-red-50/50 to-transparent hover:shadow-red-200/50 transition-all duration-300 relative overflow-hidden ring-2 ring-red-500/80"
            onClick={() =>
              alert(
                `⏰ Kritik Deadline'lar\n\nBu Hafta (3): Pazartesi, Çarşamba, Cuma\nGelecek Hafta (5): Yoğun program\nBu Ay (12): Toplam milestone\n\n🚨 Hemen aksiyon gerekli!`
              )
            }
          >
            {/* Shimmer Effect for Urgent State */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer opacity-70">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-red-300/40 to-transparent skew-x-12" />
            </div>

            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-heading-md text-red-700 dark:text-red-400 flex items-center gap-2">
                  <Clock className="size-5" />
                  Kritik Deadline'lar
                </CardTitle>
                <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-caption font-bold animate-pulse">
                  🔴 ACİL
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Timeline Segments */}
              <div className="grid grid-cols-1 gap-3">
                <div
                  className="group/item flex items-center gap-3 p-3 rounded-xl border border-red-200/50 bg-gradient-to-r from-red-50/50 to-transparent hover:from-red-100/70 transition-all duration-300"
                  onClick={e => {
                    e.stopPropagation()
                    alert(
                      `⏰ Bu Hafta Kritik Deadline'lar\n\n• Pazartesi: Elektrik sistemi teslimi\n• Çarşamba: Yapı ruhsatı onayı\n• Cuma: Alt yüklenici ödemeleri\n\n🚨 Hemen aksiyon gerekli!`
                    )
                  }}
                >
                  <div className="relative">
                    <CircularProgress
                      percentage={100}
                      size={32}
                      strokeWidth={3}
                      color="rgb(239 68 68)"
                      showText={false}
                      animate={true}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-red-700">3</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-red-800">
                      Bu Hafta
                    </div>
                    <div className="text-xs text-red-600">En yakın: 5 gün</div>
                  </div>
                  <div className="size-2 bg-red-500 rounded-full animate-pulse" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div
                    className="p-2 rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 text-center"
                    onClick={e => {
                      e.stopPropagation()
                      alert(
                        `📅 Gelecek Hafta\n\n• Sıhhi tesisat testleri\n• Dış cephe kaplama\n• Yangın güvenlik sistemi\n• Asansör montajı\n• Zemin döşeme tamamlama`
                      )
                    }}
                  >
                    <div className="text-lg font-bold text-orange-700">5</div>
                    <div className="text-xs text-orange-600">Gelecek Hafta</div>
                  </div>
                  <div
                    className="p-2 rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 text-center"
                    onClick={e => {
                      e.stopPropagation()
                      alert(
                        `🗓️ Bu Ay Tamamlanacaklar\n\n• İç dekorasyon başlangıcı\n• Cam montaj işleri\n• Güvenlik sistemi kurulumu\n• Son kontrol ve testler`
                      )
                    }}
                  >
                    <div className="text-lg font-bold text-blue-700">12</div>
                    <div className="text-xs text-blue-600">Bu Ay</div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-red-600 opacity-75">
                Toplam 20 deadline - En kritik: 5 gün
              </div>
            </CardContent>
          </Card>

          {/* Taşeron Risk Haritası Widget - Status Cards */}
          <Card
            className="cursor-pointer floating-card group scale-smooth container-responsive border-l-4 border-l-orange-400 bg-gradient-to-br from-orange-50/50 to-transparent hover:shadow-orange-200/50 transition-all duration-300 relative overflow-hidden ring-2 ring-orange-500/70"
            onClick={() =>
              alert(
                `🏗️ Taşeron Risk Haritası\n\nSorunlu (2): Acil müdahale\nRiskli (3): Yakın takip\nBeklemede (4): Programlı\n\n⚠️ 9 taşerondan 5'i risk altında`
              )
            }
          >
            {/* Shimmer Effect for Risk State */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer opacity-60">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-orange-400/50 to-transparent skew-x-12" />
            </div>

            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-heading-md text-orange-700 dark:text-orange-400 flex items-center gap-2">
                  <Users className="size-5" />
                  Taşeron Risk Haritası
                </CardTitle>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold whitespace-nowrap">
                  ⚠️ RİSK
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Risk Level Visualization */}
              <div className="space-y-3">
                <div
                  className="flex items-center gap-3 p-2 rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-red-100/50"
                  onClick={e => {
                    e.stopPropagation()
                    alert(
                      `🔴 Sorunlu Taşeronlar (2)\n\n• Elektrik A.Ş: İşleri 3 gün gecikmiş\n• Yapı Ltd: Kritik milestone kaçırıldı\n\n⚡ Acil müdahale gerekli`
                    )
                  }}
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full text-sm font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-red-800">
                      Sorunlu
                    </div>
                    <div className="text-xs text-red-600">Acil müdahale</div>
                  </div>
                  <div className="size-2 bg-red-500 rounded-full animate-pulse" />
                </div>

                <div
                  className="flex items-center gap-3 p-2 rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100/50"
                  onClick={e => {
                    e.stopPropagation()
                    alert(
                      `🟡 Riskli Taşeronlar (3)\n\n• Sıhhi Tesisat Co: Malzeme tedarik sorunu\n• Boyar İnşaat: İşçi kaynağı yetersiz\n• Demir Doğrama: Alt tedarikçi gecikmesi\n\n⚠️ Yakın takip öneriliyor`
                    )
                  }}
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 text-white rounded-full text-sm font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-yellow-800">
                      Riskli
                    </div>
                    <div className="text-xs text-yellow-600">Yakın takip</div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-3 p-2 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/50"
                  onClick={e => {
                    e.stopPropagation()
                    alert(
                      `⏸️ Beklemede Taşeronlar (4)\n\n• Cam Montaj: Elektrik tamamını bekliyor\n• Zemin Döşeme: Sıhhi tesisat onayı\n• Dış Cephe: Ruhsat onayı süreci\n• İç Dekorasyon: Zemin hazırlığı\n\n📋 Programlandı`
                    )
                  }}
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-blue-800">
                      Beklemede
                    </div>
                    <div className="text-xs text-blue-600">Programlandı</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar - Risk Distribution */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-orange-600">Risk Dağılımı</span>
                  <span className="font-semibold text-orange-700">
                    9 Taşeron
                  </span>
                </div>
                <div className="h-2 bg-orange-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-red-500 transition-all duration-700 ease-out"
                    style={{ width: '22%' }}
                  />
                  <div
                    className="bg-yellow-500 transition-all duration-700 ease-out"
                    style={{ width: '33%' }}
                  />
                  <div
                    className="bg-blue-500 transition-all duration-700 ease-out"
                    style={{ width: '45%' }}
                  />
                </div>
              </div>

              <div className="text-xs text-orange-600 opacity-75">
                5/9 taşeron takip gerektiriyor
              </div>
            </CardContent>
          </Card>

          {/* İş Akış Durumu Widget - Flow Visualization */}
          <Card
            className="cursor-pointer floating-card group scale-smooth container-responsive border-l-4 border-l-blue-400 bg-gradient-to-br from-blue-50/50 to-transparent hover:shadow-blue-200/50 transition-all duration-300"
            onClick={() =>
              alert(
                `🎯 İş Akış Durumu\n\nGeciken (8): Odaklanma gerekli\nRisk Altında (15): Yakından izleniyor\nBloke (12): Bağımlılık beklemede\n\n📊 Toplam 35/250 iş takip gerektiriyor (%14 - Normal seviye)`
              )
            }
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-heading-md text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Target className="size-5" />
                  İş Akış Durumu
                </CardTitle>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold whitespace-nowrap">
                  ✅ OK
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Flow State Visualization */}
              <div className="relative">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <CircularProgress
                      percentage={Math.round((35 / 250) * 100)}
                      size={80}
                      strokeWidth={8}
                      color="rgb(59 130 246)"
                      showText={false}
                      animate={true}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-blue-700">
                        35
                      </span>
                      <span className="text-xs text-blue-600">/250</span>
                      <span className="text-xs text-blue-500">Takip</span>
                    </div>
                  </div>
                </div>

                {/* Flow Status Grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div
                    className="p-2 rounded-lg border border-red-200 bg-gradient-to-br from-red-50 to-red-100 cursor-pointer hover:scale-105 transition-transform"
                    onClick={e => {
                      e.stopPropagation()
                      alert(
                        `🔴 Geciken İşler (8)\n\n• Elektrik montajı (3 gün gecikti)\n• Sıhhi tesisat testleri (2 gün)\n• Yapı denetim raporu (4 gün)\n• Zemin hazırlığı (1 gün)\n\n🎯 Odaklanma gerekli`
                      )
                    }}
                  >
                    <div className="text-lg font-bold text-red-700">8</div>
                    <div className="text-xs text-red-600">Geciken</div>
                  </div>
                  <div
                    className="p-2 rounded-lg border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 cursor-pointer hover:scale-105 transition-transform"
                    onClick={e => {
                      e.stopPropagation()
                      alert(
                        `🟡 Risk Altındaki İşler (15)\n\n• Dış cephe işleri (hava durumu)\n• Beton dökümü (malzeme gecikmesi)\n• Cam montajı (tedarikçi sorunu)\n• Boyama hazırlıkları\n\n👀 Yakından izleniyor`
                      )
                    }}
                  >
                    <div className="text-lg font-bold text-yellow-700">15</div>
                    <div className="text-xs text-yellow-600">Risk</div>
                  </div>
                  <div
                    className="p-2 rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer hover:scale-105 transition-transform"
                    onClick={e => {
                      e.stopPropagation()
                      alert(
                        `⏸️ Bloke İşler (12)\n\n• İç dekorasyon (elektrik bekleniyor)\n• Zemin döşeme (sıhhi tesisat)\n• Boyama işleri (alçı kuruması)\n• Dış alan düzenleme\n\n🔗 Bağımlılık nedeniyle beklemede`
                      )
                    }}
                  >
                    <div className="text-lg font-bold text-gray-700">12</div>
                    <div className="text-xs text-gray-600">Bloke</div>
                  </div>
                </div>
              </div>

              {/* Healthy Tasks Indicator */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                <span className="text-sm font-semibold text-green-800">
                  Normal Akış
                </span>
                <span className="text-lg font-bold text-green-700">215</span>
              </div>

              <div className="text-xs text-blue-600 opacity-75">
                14% iş özel takip gerektiriyor
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Activity and Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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

        {/* Modern Projects Overview Cards - Same as Projects Page */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="size-6 text-primary" />
              Aktif Projeler
            </h2>
            <Button
              variant="outline"
              className="modern-button group"
              onClick={() => (window.location.href = '/projects')}
            >
              Tüm Projeleri Gör
            </Button>
          </div>

          <div className="grid-responsive spacing-relaxed animate-stagger">
            {mockProjects
              .filter(p => p.status === 'active')
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
      </PageContent>
    </PageContainer>
  )
}

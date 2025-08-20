"use client"

import * as React from "react"
import { Plus, Building2, Calendar, Users, TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageContainer, PageHeader, PageContent } from "@/components/layout/page-container"
import { StatCard, StatCardGrid } from "@/components/data/stat-card"
import { DataTable, Column, StatusBadge } from "@/components/data/data-table"
import { LoadingState } from "@/components/ui/loading"

// Mock data types
interface Project {
  id: string
  name: string
  status: "active" | "inactive" | "pending" | "completed" | "cancelled"
  startDate: string
  progress: number
  subcontractors: number
  totalTasks: number
  completedTasks: number
}

// Mock data
const mockProjects: Project[] = [
  {
    id: "1",
    name: "Şehir Merkezi Ofis Kompleksi",
    status: "active",
    startDate: "2024-01-15",
    progress: 68,
    subcontractors: 5,
    totalTasks: 124,
    completedTasks: 84
  },
  {
    id: "2", 
    name: "Konut Kulesi A",
    status: "active",
    startDate: "2024-02-01",
    progress: 45,
    subcontractors: 8,
    totalTasks: 89,
    completedTasks: 40
  },
  {
    id: "3",
    name: "Alışveriş Merkezi Genişletme",
    status: "pending",
    startDate: "2024-03-10",
    progress: 12,
    subcontractors: 3,
    totalTasks: 156,
    completedTasks: 19
  },
  {
    id: "4",
    name: "Otoyol Köprüsü Yenileme",
    status: "completed",
    startDate: "2023-08-20",
    progress: 100,
    subcontractors: 4,
    totalTasks: 67,
    completedTasks: 67
  }
]

const projectColumns: Column<Project>[] = [
  {
    id: "name",
    header: "Proje Adı",
    accessor: "name",
    sortable: true,
  },
  {
    id: "status",
    header: "Durum", 
    accessor: (row) => <StatusBadge status={row.status} />,
    sortable: true,
  },
  {
    id: "progress",
    header: "İlerleme",
    accessor: (row) => (
      <div className="flex items-center gap-2 min-w-[120px] group">
        <div className="flex-1 h-2 bg-secondary rounded-full construction-progress overflow-visible">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${row.progress}%` }}
          />
        </div>
        <span className="text-sm font-medium group-hover:font-bold transition-all">{row.progress}%</span>
      </div>
    ),
    sortable: true,
  },
  {
    id: "tasks",
    header: "Görevler",
    accessor: (row) => `${row.completedTasks}/${row.totalTasks}`,
    sortable: true,
  },
  {
    id: "subcontractors",
    header: "Taahütçüler",
    accessor: "subcontractors",
    sortable: true,
  },
  {
    id: "startDate",
    header: "Başlangıç Tarihi",
    accessor: (row) => new Date(row.startDate).toLocaleDateString(),
    sortable: true,
  },
]

export default function DashboardPage() {
  const [selectedProjects, setSelectedProjects] = React.useState<string[]>([])
  const [isCreatingProject, setIsCreatingProject] = React.useState(false)

  const handleProjectClick = (project: Project) => {
    // Navigate to project details
    window.location.href = `/projects/${project.id}`
  }

  const handleCreateProject = () => {
    setIsCreatingProject(true)
    // TODO: Open project creation modal or navigate to create page
    console.log("Opening project creation flow")
  }

  // Calculate dashboard stats
  const totalProjects = mockProjects.length
  const activeProjects = mockProjects.filter(p => p.status === "active").length
  const completedProjects = mockProjects.filter(p => p.status === "completed").length
  const totalTasks = mockProjects.reduce((sum, p) => sum + p.totalTasks, 0)
  const completedTasks = mockProjects.reduce((sum, p) => sum + p.completedTasks, 0)
  const averageProgress = Math.round(mockProjects.reduce((sum, p) => sum + p.progress, 0) / totalProjects)

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
              <h1 className="text-2xl font-semibold mb-2">Temeli Atmaya Hazır mısın? 🏗️</h1>
              <p className="text-muted-foreground mb-6">
                Harika bir şey inşa etmek için temeli atalım! İlk inşaat projenizi oluşturun, 
                projeden gerçeğe dönüştürmekte size yardımcı olalım. Baret takma zamanı! 👷
              </p>
              <Button onClick={handleCreateProject} disabled={isCreatingProject} className="group">
                <Plus className={cn("size-4 mr-2 transition-transform", isCreatingProject && "animate-spin")} />
                {isCreatingProject ? "Temel Atılıyor..." : "İnşaata Başla"}
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
        <PageHeader
          title="İnşaat Komuta Merkezi 🏗️"
          description="Sahadaki tüm inşaat faaliyetlerinin kuşbakışı görünümü"
          action={
            <Button onClick={handleCreateProject} disabled={isCreatingProject} className="group">
              <Plus className={cn("size-4 mr-2 transition-transform group-hover:rotate-90")} />
              {isCreatingProject ? "Planlar Hazırlanıyor..." : "Yeni Proje"}
            </Button>
          }
        />

        {/* Stats Cards */}
        <StatCardGrid columns={4} className="mb-8">
          <StatCard
            title="Toplam Projeler"
            value={totalProjects}
            icon={Building2}
            change={{
              value: 12.5,
              type: "increase",
              period: "geçen aya göre"
            }}
          />
          <StatCard
            title="Aktif Şantiyeler"
            value={activeProjects}
            icon={Clock}
            description="Yapım aşamasında"
          />
          <StatCard
            title="Bu Hafta Tamamlanan"
            value={12}
            icon={CheckCircle}
            change={{
              value: 8.2,
              type: "increase", 
              period: "geçen haftaya göre"
            }}
            description="İş emri adedi"
          />
          <StatCard
            title="Genel İlerleme"
            value={`${averageProgress}%`}
            icon={TrendingUp}
            description="Tüm şantiyeler ortalaması"
            change={{
              value: 3.4,
              type: "increase", 
              period: "geçen aya göre"
            }}
          />
        </StatCardGrid>

        {/* Recent Activity Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5" />
                Bugünkü Faaliyetler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg construction-hover">
                  <div className="size-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="size-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">12 görev tamamlandı! 🔨</p>
                    <p className="text-sm text-muted-foreground">Ekip 3 aktif şantiyede verimli çalıştı</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg construction-hover">
                  <div className="size-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Users className="size-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">8 saha raporu sahadan geldi 📋</p>
                    <p className="text-sm text-muted-foreground">Şefler ilerlemeleri inceliyor</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg construction-hover">
                  <div className="size-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <AlertTriangle className="size-4 text-yellow-600 dark:text-yellow-400 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">3 konu baret takmanı gerektiriyor ⚠️</p>
                    <p className="text-sm text-muted-foreground">Zaman kritik onaylar bekliyor</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start group">
                <Plus className="size-4 mr-2 group-hover:rotate-90 transition-transform" />
                Yeni Plan Hazırla 📋
              </Button>
              <Button variant="outline" className="w-full justify-start group">
                <Users className="size-4 mr-2 group-hover:scale-110 transition-transform" />
                Ekip Üyesi Al 👷
              </Button>
              <Button variant="outline" className="w-full justify-start group">
                <TrendingUp className="size-4 mr-2 group-hover:animate-pulse" />
                Şantiye İlerlemesini Kontrol Et 📈
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle>Aktif Projeler</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={mockProjects}
              columns={projectColumns}
              onRowClick={handleProjectClick}
              emptyMessage="Proje bulunamadı"
            />
          </CardContent>
        </Card>
      </PageContent>
    </PageContainer>
  )
}
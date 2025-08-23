"use client"

import * as React from "react"
import { Plus, Search, Filter, Building2, MoreHorizontal, AlertTriangle, CheckCircle, Clock, Star, TrendingUp, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageContainer, PageHeader, PageContent } from "@/components/layout/page-container"
import { DataTable, Column, StatusBadge, TableAction } from "@/components/data/data-table"
import { Breadcrumbs } from "@/components/navigation/breadcrumbs"
import { ProjectCard, type Project } from "@/components/projects/project-card"
import { cn } from "@/lib/utils"

// Project interface now imported from shared component

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Şehir Merkezi Ofis Kompleksi",
    status: "active",
    startDate: "2024-01-15",
    progress: 68,
    subcontractors: 5,
    totalTasks: 124,
    completedTasks: 84,
    location: "Istanbul, Turkey",
    budget: 2500000,
    manager: "Ahmet Yılmaz",
    budgetSpent: 65,
    daysRemaining: 45,
    riskLevel: "low",
    qualityScore: 4.2,
    healthStatus: "healthy"
  },
  {
    id: "2",
    name: "Konut Kulesi A",
    status: "active",
    startDate: "2024-02-01",
    progress: 45,
    subcontractors: 8,
    totalTasks: 89,
    completedTasks: 40,
    location: "Ankara, Turkey",
    budget: 1800000,
    manager: "Fatma Demir",
    budgetSpent: 52,
    daysRemaining: 78,
    riskLevel: "medium",
    qualityScore: 3.8,
    healthStatus: "warning"
  },
  {
    id: "3",
    name: "Alışveriş Merkezi Genişletme",
    status: "pending",
    startDate: "2024-03-10",
    progress: 12,
    subcontractors: 3,
    totalTasks: 156,
    completedTasks: 19,
    location: "Izmir, Turkey",
    budget: 3200000,
    manager: "Mehmet Kaya",
    budgetSpent: 8,
    daysRemaining: 120,
    riskLevel: "low",
    qualityScore: 4.0,
    healthStatus: "healthy"
  },
  {
    id: "4",
    name: "Otoyol Köprüsü Yenileme", 
    status: "completed",
    startDate: "2023-08-20",
    endDate: "2024-01-15",
    progress: 100,
    subcontractors: 4,
    totalTasks: 67,
    completedTasks: 67,
    location: "Bursa, Turkey",
    budget: 950000,
    manager: "Ayşe Özkan",
    budgetSpent: 98,
    daysRemaining: 0,
    riskLevel: "low",
    qualityScore: 4.7,
    healthStatus: "healthy"
  },
  {
    id: "5",
    name: "Hastane Ek Binası İnşaatı",
    status: "active",
    startDate: "2023-11-01",
    progress: 89,
    subcontractors: 12,
    totalTasks: 203,
    completedTasks: 181,
    location: "Istanbul, Turkey",
    budget: 4100000,
    manager: "Can Bulut",
    budgetSpent: 95,
    daysRemaining: 12,
    riskLevel: "high",
    qualityScore: 3.5,
    healthStatus: "critical"
  }
]

const projectColumns: Column<Project>[] = [
  {
    id: "name",
    header: "Proje Adı",
    accessor: (row) => (
      <div>
        <div className="font-medium">{row.name}</div>
        <div className="text-sm text-muted-foreground">{row.location}</div>
      </div>
    ),
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
      <div className="flex items-center gap-2 min-w-[120px]">
        <div className="flex-1 h-2 bg-secondary rounded-full">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${row.progress}%` }}
          />
        </div>
        <span className="text-sm font-medium">{row.progress}%</span>
      </div>
    ),
    sortable: true,
  },
  {
    id: "tasks",
    header: "Görevler",
    accessor: (row) => (
      <div>
        <div className="font-medium">{row.completedTasks}/{row.totalTasks}</div>
        <div className="text-xs text-muted-foreground">
          {row.totalTasks - row.completedTasks} kalan
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    id: "budget",
    header: "Bütçe",
    accessor: (row) => `₺${(row.budget / 1000).toFixed(0)}K`,
    sortable: true,
  },
  {
    id: "manager",
    header: "Proje Yöneticisi",
    accessor: "manager",
    sortable: true,
  },
  {
    id: "startDate",
    header: "Başlangıç Tarihi",
    accessor: (row) => new Date(row.startDate).toLocaleDateString(),
    sortable: true,
  },
  {
    id: "actions",
    header: "",
    accessor: (row) => (
      <TableAction
        onView={() => window.location.href = `/projects/${row.id}`}
        onEdit={() => alert(`📝 ${row.name} projesini düzenleme modal'ı açılacak`)}
        onDelete={() => {
          if (confirm(`⚠️ ${row.name} projesini silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!`)) {
            alert(`🗑️ ${row.name} projesi silindi`)
          }
        }}
      />
    ),
    width: "100px",
  },
]


export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("active")
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: "asc" | "desc" } | undefined>(undefined)
  const [searchFocused, setSearchFocused] = React.useState(false)

  const breadcrumbItems = [
    { label: "Projeler", href: "/projects" }
  ]

  const filteredProjects = React.useMemo(() => {
    let filtered = mockProjects

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.manager.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    // Sort
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Project] as any
        const bValue = b[sortConfig.key as keyof Project] as any
        
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    return filtered
  }, [searchTerm, statusFilter, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === "asc" ? "desc" : "asc"
    }))
  }

  const handleProjectClick = (project: Project) => {
    // Navigate to project detail page (simulated)
    window.location.href = `/projects/${project.id}`
  }

  const handleCreateProject = () => {
    // Open project creation modal (simulated)
    alert("🚀 Yeni Proje Oluşturma\n\n📋 Proje adı girin\n📅 Başlangıç tarihi seçin\n👷 Ekip yöneticisi atayın\n💰 Bütçe belirleyin\n\n✅ Bu modal yakında aktif olacak!")
  }

  return (
    <PageContainer>
      <PageContent>
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />
        
        <PageHeader
          title="Projeler 🏗️"
          description="İnşaat projelerinizi başlangıçtan teslime kadar tek yerden yönetin."
          action={
            <Button onClick={handleCreateProject} className="modern-button group button-enhanced">
              <Plus className="size-4 mr-2 group-hover:rotate-90 transition-transform" />
              <span className="group-hover:hidden">Yeni İnşaata Başla</span>
              <span className="hidden group-hover:inline">Hadi Başlayalım! 🚀</span>
            </Button>
          }
        />

        {/* Filters and Search */}
        <div className="mb-6 p-4 glass rounded-xl border border-white/10 overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder={searchFocused ? "Projeyle ilişkili ipucu verin. Örn: ofis kompleksi, Istanbul, Ahmet..." : "Tüm projeler arasında arayın..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="h-10 pl-10 bg-background/90 backdrop-blur-sm border-2 border-muted/40 rounded-xl modern-focus hover:border-primary/40 focus:border-primary/60 transition-colors shadow-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={cn(
                "h-10 px-3 rounded-xl bg-background/90 backdrop-blur-sm border-2 border-muted/40 text-sm modern-focus",
                "hover:border-primary/40 focus:border-primary/60 transition-colors shadow-sm min-w-[180px]"
              )}
            >
              <option value="all">🏭 Tüm Şantiyeler</option>
              <option value="active">🔨 İnşaat Halinde</option>
              <option value="pending">📋 Planlama Aşaması</option>
              <option value="completed">✅ Tamamlandı & Denetlendi</option>
              <option value="cancelled">❌ İptal Edildi</option>
            </select>
          </div>
        </div>

        {/* Projects Grid for Mobile */}
        <div className="lg:hidden space-y-4 mb-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={handleProjectClick}
              index={index}
              className="h-auto" // Override height for mobile
            />
          ))}
        </div>

        {/* Projects Grid for Desktop - Modern Masonry Layout */}
        <div className="hidden lg:block">
          <div className="grid-responsive spacing-relaxed animate-stagger">
            {filteredProjects.map((project, index) => (
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
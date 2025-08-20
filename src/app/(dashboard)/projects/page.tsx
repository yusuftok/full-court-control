"use client"

import * as React from "react"
import { Plus, Search, Filter, Building2, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageContainer, PageHeader, PageContent } from "@/components/layout/page-container"
import { DataTable, Column, StatusBadge, TableAction } from "@/components/data/data-table"
import { Breadcrumbs } from "@/components/navigation/breadcrumbs"
import { cn } from "@/lib/utils"

interface Project {
  id: string
  name: string
  status: "active" | "inactive" | "pending" | "completed" | "cancelled"
  startDate: string
  endDate?: string
  progress: number
  subcontractors: number
  totalTasks: number
  completedTasks: number
  location: string
  budget: number
  manager: string
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Downtown Office Complex",
    status: "active",
    startDate: "2024-01-15",
    progress: 68,
    subcontractors: 5,
    totalTasks: 124,
    completedTasks: 84,
    location: "Istanbul, Turkey",
    budget: 2500000,
    manager: "Ahmet Yılmaz"
  },
  {
    id: "2",
    name: "Residential Tower A",
    status: "active",
    startDate: "2024-02-01",
    progress: 45,
    subcontractors: 8,
    totalTasks: 89,
    completedTasks: 40,
    location: "Ankara, Turkey",
    budget: 1800000,
    manager: "Fatma Demir"
  },
  {
    id: "3",
    name: "Shopping Mall Extension",
    status: "pending",
    startDate: "2024-03-10",
    progress: 12,
    subcontractors: 3,
    totalTasks: 156,
    completedTasks: 19,
    location: "Izmir, Turkey",
    budget: 3200000,
    manager: "Mehmet Kaya"
  },
  {
    id: "4",
    name: "Highway Bridge Renovation", 
    status: "completed",
    startDate: "2023-08-20",
    endDate: "2024-01-15",
    progress: 100,
    subcontractors: 4,
    totalTasks: 67,
    completedTasks: 67,
    location: "Bursa, Turkey",
    budget: 950000,
    manager: "Ayşe Özkan"
  },
  {
    id: "5",
    name: "Hospital Wing Construction",
    status: "active",
    startDate: "2023-11-01",
    progress: 89,
    subcontractors: 12,
    totalTasks: 203,
    completedTasks: 181,
    location: "Istanbul, Turkey",
    budget: 4100000,
    manager: "Can Bulut"
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
        onView={() => console.log("View project", row.id)}
        onEdit={() => console.log("Edit project", row.id)}
        onDelete={() => console.log("Delete project", row.id)}
      />
    ),
    width: "100px",
  },
]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: "asc" | "desc" } | undefined>(undefined)

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
    console.log("Navigate to project:", project.id)
    // TODO: Navigate to project detail page
  }

  const handleCreateProject = () => {
    console.log("Create new project")
    // TODO: Open project creation modal/page
  }

  return (
    <PageContainer>
      <PageContent>
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />
        
        <PageHeader
          title="Aktif İnşaat Şantiyeleri 🏗️"
          description="Tüm inşaat operasyonlarınızın komuta merkezi - temelden son denetleme kadar"
          action={
            <Button onClick={handleCreateProject} className="group construction-hover">
              <Plus className="size-4 mr-2 group-hover:rotate-90 transition-transform" />
              Yeni İnşaata Başla
            </Button>
          }
        />

        {/* Filters and Search */}
        <Card className="mb-6 construction-hover animate-build-up">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🔍 Şantiye Bulucu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Şantiye, konum, şef arayın... 🔍"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 construction-hover"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={cn(
                  "h-9 px-3 rounded-md border border-input bg-background text-sm construction-hover",
                  "focus:outline-none focus:ring-2 focus:ring-ring"
                )}
              >
                <option value="all">🏭 Tüm Şantiyeler</option>
                <option value="active">🔨 İnşaat Halinde</option>
                <option value="pending">📋 Planlama Aşaması</option>
                <option value="completed">✅ Tamamlandı & Denetlendi</option>
                <option value="cancelled">❌ İptal Edildi</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid for Mobile */}
        <div className="lg:hidden space-y-4 mb-6">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="cursor-pointer construction-hover animate-build-up transition-all duration-200"
              onClick={() => handleProjectClick(project)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.location} • {project.manager}
                    </p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">İlerleme</span>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full construction-progress">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Görevler:</span> {project.completedTasks}/{project.totalTasks}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bütçe:</span> ₺{(project.budget / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects Table for Desktop */}
        <div className="hidden lg:block">
          <DataTable
            data={filteredProjects}
            columns={projectColumns}
            loading={false}
            sortConfig={sortConfig}
            onSort={handleSort}
            onRowClick={handleProjectClick}
            emptyMessage="Proje bulunamadı"
          />
        </div>
      </PageContent>
    </PageContainer>
  )
}
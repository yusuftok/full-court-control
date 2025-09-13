'use client'

import * as React from 'react'
import { Plus, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  PageContainer,
  PageHeader,
  PageContent,
} from '@/components/layout/page-container'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import {
  ProjectCard,
  type Project as ProjectCardProject,
} from '@/components/projects/project-card'
import {
  ProjectStatus,
  Project,
} from '@/components/projects/types/project-types'
import { cn } from '@/lib/utils'
import { getSimpleProjects } from '@/lib/mock-data'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

// Project interface now imported from shared component

// Import ProjectCategory
import { ProjectCategory } from '@/components/projects/types/project-types'

// Mock projects for demo
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Ataşehir Ofis Kompleksi',
    location: 'Ataşehir, İstanbul',
    startDate: '2024-01-15',
    endDate: '2024-12-20',
    budget: 15000000,
    description: 'Modern 25 katlı ofis kompleksi projesi',
    status: ProjectStatus.ACTIVE,
    progress: 45,
    plannedProgress: 50,
    earnedValue: 6750000,
    actualCost: 7200000,
    plannedValue: 7500000,
    plannedBudgetToDate: 7500000,
    totalTasks: 24,
    completedTasks: 11,
    healthStatus: 'healthy',
    riskLevel: 'low',
    qualityScore: 4.2,
    manager: 'Ahmet Yılmaz',
    budgetSpent: 6750000,
    daysRemaining: 120,
    totalPlannedDays: 339,
    createdBy: 'Demo User',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2025-08-20T00:00:00.000Z',
    mainContractorTeam: {
      chiefEngineer: 'Ahmet Yılmaz',
      civilEngineer: 'Mehmet Demir',
      mechanicalEngineer: 'Ali Kaya',
      electricalEngineer: 'Fatma Şahin',
    },
    subcontractors: {
      constructionId: 'sub-1',
      mechanicalId: 'sub-5',
      electricalId: 'sub-8',
    },
    category: ProjectCategory.COMMERCIAL,
    templateId: 'template-commercial-1',
    divisions: [],
    divisionInstances: [],
  },
  {
    id: '2',
    name: 'Bahçeşehir Konut Projesi',
    location: 'Bahçeşehir, İstanbul',
    startDate: '2024-03-01',
    endDate: '2025-01-30',
    budget: 8500000,
    description: '12 blok lüks konut projesi',
    status: ProjectStatus.ACTIVE,
    progress: 25,
    plannedProgress: 35,
    earnedValue: 2125000,
    actualCost: 2500000,
    plannedValue: 2975000,
    plannedBudgetToDate: 2975000,
    totalTasks: 18,
    completedTasks: 5,
    healthStatus: 'warning',
    riskLevel: 'medium',
    qualityScore: 3.8,
    manager: 'Zeynep Koç',
    budgetSpent: 2125000,
    daysRemaining: 158,
    createdBy: 'Demo User',
    createdAt: '2024-02-25T00:00:00.000Z',
    updatedAt: '2025-08-20T00:00:00.000Z',
    mainContractorTeam: {
      chiefEngineer: 'Zeynep Koç',
      civilEngineer: 'Hasan Özkan',
      mechanicalEngineer: 'Ayşe Tuncer',
      electricalEngineer: 'Murat Arslan',
    },
    subcontractors: {
      constructionId: 'sub-2',
      mechanicalId: 'sub-6',
      electricalId: 'sub-9',
    },
    category: ProjectCategory.RESIDENTIAL,
    templateId: 'template-residential-1',
    divisions: [],
    divisionInstances: [],
  },
  {
    id: '3',
    name: 'Ankara Metro B2 Hattı',
    location: 'Çankaya, Ankara',
    startDate: '2023-09-15',
    endDate: '2025-06-30',
    budget: 45000000,
    description: 'Metro altyapı genişletme projesi - 8 km hat',
    status: ProjectStatus.ACTIVE,
    progress: 78,
    plannedProgress: 75,
    earnedValue: 35100000,
    actualCost: 33800000,
    plannedValue: 33750000,
    plannedBudgetToDate: 33750000,
    totalTasks: 32,
    completedTasks: 25,
    healthStatus: 'healthy',
    riskLevel: 'high',
    qualityScore: 4.5,
    manager: 'Engin Çelik',
    budgetSpent: 35100000,
    daysRemaining: 315,
    createdBy: 'Demo User',
    createdAt: '2023-08-10T00:00:00.000Z',
    updatedAt: '2025-08-20T00:00:00.000Z',
    mainContractorTeam: {
      chiefEngineer: 'Engin Çelik',
      civilEngineer: 'Burhan Aktaş',
      mechanicalEngineer: 'Selma Yıldız',
      electricalEngineer: 'İbrahim Güven',
    },
    subcontractors: {
      constructionId: 'sub-3',
      mechanicalId: 'sub-7',
      electricalId: 'sub-10',
    },
    category: ProjectCategory.INFRASTRUCTURE,
    templateId: 'template-infrastructure-1',
    divisions: [],
    divisionInstances: [],
  },
  {
    id: '4',
    name: 'İzmir Ege Rezidans',
    location: 'Alsancak, İzmir',
    startDate: '2024-06-01',
    endDate: '2025-10-15',
    budget: 12000000,
    description: 'Deniz manzaralı lüks rezidans projesi',
    status: ProjectStatus.PLANNED,
    progress: 0,
    plannedProgress: 0,
    earnedValue: 0,
    actualCost: 150000,
    plannedValue: 0,
    plannedBudgetToDate: 0,
    totalTasks: 16,
    completedTasks: 0,
    healthStatus: 'healthy',
    riskLevel: 'low',
    qualityScore: 0,
    manager: 'Selin Özdemir',
    budgetSpent: 0,
    daysRemaining: 450,
    createdBy: 'Demo User',
    createdAt: '2024-05-15T00:00:00.000Z',
    updatedAt: '2025-08-20T00:00:00.000Z',
    mainContractorTeam: {
      chiefEngineer: 'Selin Özdemir',
      civilEngineer: 'Can Yücel',
      mechanicalEngineer: 'Pınar Avcı',
      electricalEngineer: 'Kemal Ertürk',
    },
    subcontractors: {
      constructionId: null,
      mechanicalId: null,
      electricalId: null,
    },
    category: ProjectCategory.RESIDENTIAL,
    templateId: 'template-residential-2',
    divisions: [],
    divisionInstances: [],
  },
  {
    id: '5',
    name: 'Beyoğlu Tarihi Bina Restorasyonu',
    location: 'Galata, İstanbul',
    startDate: '2023-12-01',
    endDate: '2024-11-30',
    budget: 3500000,
    description: '1890 yapımı tarihi binanın restorasyon projesi',
    status: ProjectStatus.COMPLETED,
    progress: 100,
    plannedProgress: 100,
    earnedValue: 3500000,
    actualCost: 3200000,
    plannedValue: 3500000,
    plannedBudgetToDate: 3500000,
    totalTasks: 22,
    completedTasks: 22,
    healthStatus: 'healthy',
    riskLevel: 'low',
    qualityScore: 4.8,
    manager: 'Orhan Pamuk',
    budgetSpent: 3200000,
    daysRemaining: 0,
    createdBy: 'Demo User',
    createdAt: '2023-11-15T00:00:00.000Z',
    updatedAt: '2024-12-01T00:00:00.000Z',
    mainContractorTeam: {
      chiefEngineer: 'Orhan Pamuk',
      civilEngineer: 'Elif Şafak',
      mechanicalEngineer: 'Aziz Nesin',
      electricalEngineer: 'Yaşar Kemal',
    },
    subcontractors: {
      constructionId: 'sub-4',
      mechanicalId: 'sub-6',
      electricalId: 'sub-9',
    },
    category: ProjectCategory.RENOVATION,
    templateId: 'template-renovation-1',
    divisions: [],
    divisionInstances: [],
  },
  {
    id: '6',
    name: 'Antalya Mega AVM Projesi',
    location: 'Lara, Antalya',
    startDate: '2024-02-15',
    endDate: '2025-08-30',
    budget: 28000000,
    description: '80 dükkan ve sinema kompleksi',
    status: ProjectStatus.ON_HOLD,
    progress: 15,
    plannedProgress: 40,
    earnedValue: 4200000,
    actualCost: 5600000,
    plannedValue: 11200000,
    plannedBudgetToDate: 11200000,
    totalTasks: 35,
    completedTasks: 5,
    healthStatus: 'critical',
    riskLevel: 'high',
    qualityScore: 2.1,
    manager: 'Cem Karaca',
    budgetSpent: 4200000,
    daysRemaining: 200,
    createdBy: 'Demo User',
    createdAt: '2024-01-20T00:00:00.000Z',
    updatedAt: '2025-08-20T00:00:00.000Z',
    mainContractorTeam: {
      chiefEngineer: 'Cem Karaca',
      civilEngineer: 'Barış Manço',
      mechanicalEngineer: 'Fikret Kızılok',
      electricalEngineer: 'Erkin Koray',
    },
    subcontractors: {
      constructionId: 'sub-1',
      mechanicalId: 'sub-5',
      electricalId: 'sub-8',
    },
    category: ProjectCategory.COMMERCIAL,
    templateId: 'template-commercial-2',
    divisions: [],
    divisionInstances: [],
  },
  {
    id: '7',
    name: 'Bursa Spor Kompleksi',
    location: 'Osmangazi, Bursa',
    startDate: '2024-01-10',
    endDate: '2024-10-25',
    budget: 7500000,
    description: 'Olimpik yüzme havuzu ve spor salonu',
    status: ProjectStatus.CANCELLED,
    progress: 8,
    plannedProgress: 25,
    earnedValue: 600000,
    actualCost: 900000,
    plannedValue: 1875000,
    plannedBudgetToDate: 1875000,
    totalTasks: 20,
    completedTasks: 2,
    healthStatus: 'critical',
    riskLevel: 'high',
    qualityScore: 1.5,
    manager: 'Fatih Terim',
    budgetSpent: 600000,
    daysRemaining: 0,
    createdBy: 'Demo User',
    createdAt: '2023-12-20T00:00:00.000Z',
    updatedAt: '2025-08-20T00:00:00.000Z',
    mainContractorTeam: {
      chiefEngineer: 'Fatih Terim',
      civilEngineer: 'Şenol Güneş',
      mechanicalEngineer: 'Abdullah Avcı',
      electricalEngineer: 'Ersun Yanal',
    },
    subcontractors: {
      constructionId: 'sub-2',
      mechanicalId: null,
      electricalId: null,
    },
    category: ProjectCategory.INFRASTRUCTURE,
    templateId: 'template-infrastructure-2',
    divisions: [],
    divisionInstances: [],
  },
]

// Convert Project to ProjectCardProject for display
const convertToCardProject = (project: Project): ProjectCardProject => ({
  id: project.id,
  name: project.name,
  status: project.status.toLowerCase() as ProjectCardProject['status'], // Convert enum to string
  startDate: project.startDate,
  endDate: project.endDate,
  progress: project.progress,
  plannedProgress: project.plannedProgress,
  earnedValue: project.earnedValue,
  actualCost: project.actualCost,
  plannedValue: project.plannedValue,
  plannedBudgetToDate: project.plannedBudgetToDate,
  subcontractors:
    (project.subcontractorIds?.length ?? 0) ||
    Object.values(project.subcontractors).filter(Boolean).length,
  totalTasks: project.totalTasks,
  completedTasks: project.completedTasks,
  location: project.location,
  budget: project.budget,
  manager: project.manager,
  budgetSpent: project.budgetSpent,
  daysRemaining: project.daysRemaining,
  riskLevel: project.riskLevel,
  qualityScore: project.qualityScore,
  healthStatus: project.healthStatus,
})

// DataTable columns removed - using ProjectCard for display instead

export default function ProjectsPage() {
  const router = useRouter()
  const locale = useLocale()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('active')
  const [sortConfig, setSortConfig] = React.useState<
    { key: string; direction: 'asc' | 'desc' } | undefined
  >(undefined)
  const [searchFocused, setSearchFocused] = React.useState(false)
  const [projects] = React.useState<Project[]>(getSimpleProjects())

  const breadcrumbItems = [{ label: 'Projeler', href: '/projects' }]

  const filteredProjects = React.useMemo(() => {
    let filtered = projects

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        project =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.manager.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    // Sort
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Project]
        const bValue = b[sortConfig.key as keyof Project]

        // Handle different types of values for sorting
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const result = aValue.localeCompare(bValue)
          return sortConfig.direction === 'asc' ? result : -result
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          const result = aValue - bValue
          return sortConfig.direction === 'asc' ? result : -result
        }

        // Fallback for other types
        const aStr = String(aValue)
        const bStr = String(bValue)
        const result = aStr.localeCompare(bStr)
        return sortConfig.direction === 'asc' ? result : -result
      })
    }

    return filtered
  }, [searchTerm, statusFilter, sortConfig, projects])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction:
        current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleProjectClick = (project: ProjectCardProject) => {
    // Navigate to localized project detail page
    router.push(`/${locale}/projects/${project.id}`)
  }

  const handleCreateProject = () => {
    // Navigate to localized new project page
    router.push(`/${locale}/projects/new`)
  }

  return (
    <PageContainer>
      <PageContent>
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />

        <PageHeader
          title="Projeler 🏗️"
          description="İnşaat projelerinizi başlangıçtan teslime kadar tek yerden yönetin."
          action={
            <Button
              onClick={handleCreateProject}
              className="modern-button group button-enhanced"
            >
              <Plus className="size-4 mr-2 group-hover:rotate-90 transition-transform" />
              Yeni İnşaata Başla
            </Button>
          }
        />

        {/* Filters and Search */}
        <div className="mb-6 p-4 glass rounded-xl border border-white/10 overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder={
                  searchFocused
                    ? 'Projeyle ilişkili ipucu verin. Örn: ofis kompleksi, Istanbul, Ahmet...'
                    : 'Tüm projeler arasında arayın...'
                }
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="h-10 pl-10 bg-background/90 backdrop-blur-sm border-2 border-muted/40 rounded-xl modern-focus hover:border-primary/40 focus:border-primary/60 transition-colors shadow-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className={cn(
                'h-10 px-3 rounded-xl bg-background/90 backdrop-blur-sm border-2 border-muted/40 text-sm modern-focus',
                'hover:border-primary/40 focus:border-primary/60 transition-colors shadow-sm min-w-[180px]'
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
              project={convertToCardProject(project)}
              onClick={() => handleProjectClick(convertToCardProject(project))}
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
                project={convertToCardProject(project)}
                onClick={() =>
                  handleProjectClick(convertToCardProject(project))
                }
                index={index}
              />
            ))}
          </div>
        </div>
      </PageContent>
    </PageContainer>
  )
}

/**
 * Centralized mock data for Full-Court Control Pro
 * This file ensures consistency across all pages and components
 */

import {
  ProjectStatus,
  ProjectCategory,
  Project,
  DivisionInstance,
  DivisionNode,
} from '@/components/projects/types/project-types'

// Base project interface that matches all required structures
export interface BaseProject {
  id: string
  name: string
  location: string
  description: string
  status: ProjectStatus
  progress: number
  budget: number
  budgetSpent: number
  startDate: string
  endDate: string
  manager: string
  totalTasks: number
  completedTasks: number
  healthStatus: 'healthy' | 'warning' | 'critical'
  riskLevel: 'low' | 'medium' | 'high'
  qualityScore: number
  daysRemaining: number
  category: ProjectCategory
  templateId: string
  contractor: string
}

// Detailed project data for individual project pages
export interface DetailedProject extends BaseProject {
  teamSize: number
  upcomingMilestones: Milestone[]
  recentActivities: Activity[]
  teamMembers: TeamMember[]
  equipment: Equipment[]
  mainContractorTeam: {
    chiefEngineer: string
    civilEngineer: string
    mechanicalEngineer: string
    electricalEngineer: string
  }
  subcontractors: {
    constructionId: string
    mechanicalId: string
    electricalId: string
  }
  createdBy: string
  createdAt: string
  updatedAt: string
  divisions: DivisionNode[]
  divisionInstances: DivisionInstance[]
}

// Supporting interfaces
export interface Milestone {
  id: string
  name: string
  dueDate: string
  status: 'completed' | 'in-progress' | 'pending' | 'overdue'
  progress: number
}

export interface Activity {
  id: string
  type: 'task' | 'milestone' | 'issue' | 'update'
  title: string
  description: string
  timestamp: string
  user: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  tasksCompleted: number
  hoursWorked: number
  status: 'active' | 'on-leave' | 'off-site'
}

export interface Equipment {
  id: string
  name: string
  type: string
  status: 'operational' | 'maintenance' | 'broken'
  location: string
  lastMaintenance: string
}

// Search item interface for global search
export interface SearchItem {
  id: string
  type: 'project' | 'template' | 'person' | 'task'
  name: string
  description?: string
  url: string
  category: string
  emoji?: string
}

// Centralized project data - single source of truth
export const MOCK_PROJECTS: DetailedProject[] = [
  {
    // Project 1 - Active, Healthy
    id: '1',
    name: 'Şehir Merkezi Ofis Kompleksi',
    location: 'İstanbul, Levent',
    description: 'İstanbul merkez lokasyonda 15 katlı ofis projesi',
    status: ProjectStatus.ACTIVE,
    progress: 68,
    budget: 25000000,
    budgetSpent: 17500000,
    startDate: '2024-01-15',
    endDate: '2024-12-15',
    manager: 'Ahmet Yılmaz',
    totalTasks: 124,
    completedTasks: 84,
    healthStatus: 'healthy',
    riskLevel: 'low',
    qualityScore: 4.5,
    daysRemaining: 95,
    category: ProjectCategory.COMMERCIAL,
    templateId: 'template-commercial-1',
    contractor: 'Mega İnşaat A.Ş.',
    teamSize: 45,
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
        type: 'milestone',
        title: 'İskelet Yapı %75 Tamamlandı',
        description: 'Zamanında ilerleme kaydediliyor',
        timestamp: '2024-08-18T14:20:00Z',
        user: 'Ahmet Yılmaz',
      },
    ],
    teamMembers: [
      {
        id: 't1',
        name: 'Ahmet Yılmaz',
        role: 'Proje Yöneticisi',
        tasksCompleted: 45,
        hoursWorked: 320,
        status: 'active',
      },
      {
        id: 't2',
        name: 'Murat Demir',
        role: 'İnşaat Mühendisi',
        tasksCompleted: 38,
        hoursWorked: 280,
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
    createdBy: 'Demo User',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2025-08-20T00:00:00.000Z',
    divisions: [],
    divisionInstances: [],
  },
  {
    // Project 2 - Active, Warning
    id: '2',
    name: 'Konut Kulesi A',
    location: 'Ankara, Çankaya',
    description: "Ankara'da 25 katlı lüks konut projesi",
    status: ProjectStatus.ACTIVE,
    progress: 45,
    budget: 35000000,
    budgetSpent: 15750000,
    startDate: '2024-02-01',
    endDate: '2025-01-30',
    manager: 'Fatma Demir',
    totalTasks: 145,
    completedTasks: 56,
    healthStatus: 'warning',
    riskLevel: 'medium',
    qualityScore: 3.8,
    daysRemaining: 158,
    category: ProjectCategory.RESIDENTIAL,
    templateId: 'template-residential-1',
    contractor: 'Yüksel İnşaat A.Ş.',
    teamSize: 65,
    upcomingMilestones: [
      {
        id: 'm4',
        name: '15. Kat Tamamlama',
        dueDate: '2024-10-15',
        status: 'in-progress',
        progress: 60,
      },
      {
        id: 'm5',
        name: 'Dış Cephe Başlangıç',
        dueDate: '2024-11-01',
        status: 'pending',
        progress: 0,
      },
    ],
    recentActivities: [
      {
        id: 'a4',
        type: 'task',
        title: '12. Kat Betonarme Tamamlandı',
        description: 'Kalite kontrol onaylandı',
        timestamp: '2024-08-20T14:20:00Z',
        user: 'Sevim Kaya',
      },
      {
        id: 'a5',
        type: 'issue',
        title: 'Malzeme Tedarik Gecikmesi',
        description: 'Çelik konstrüksiyon teslimatı 1 hafta ertelendi',
        timestamp: '2024-08-19T09:15:00Z',
        user: 'Fatma Demir',
      },
    ],
    teamMembers: [
      {
        id: 't4',
        name: 'Fatma Demir',
        role: 'Proje Yöneticisi',
        tasksCompleted: 42,
        hoursWorked: 290,
        status: 'active',
      },
      {
        id: 't5',
        name: 'Sevim Kaya',
        role: 'İnşaat Mühendisi',
        tasksCompleted: 35,
        hoursWorked: 250,
        status: 'active',
      },
    ],
    equipment: [
      {
        id: 'e3',
        name: 'Kule Vinç #2',
        type: 'Kaldırma',
        status: 'operational',
        location: 'Konut Blok A',
        lastMaintenance: '2024-07-20',
      },
    ],
    mainContractorTeam: {
      chiefEngineer: 'Fatma Demir',
      civilEngineer: 'Hasan Özkan',
      mechanicalEngineer: 'Ayşe Tuncer',
      electricalEngineer: 'Murat Arslan',
    },
    subcontractors: {
      constructionId: 'sub-2',
      mechanicalId: 'sub-6',
      electricalId: 'sub-9',
    },
    createdBy: 'Demo User',
    createdAt: '2024-02-25T00:00:00.000Z',
    updatedAt: '2025-08-20T00:00:00.000Z',
    divisions: [],
    divisionInstances: [],
  },
  {
    // Project 3 - Active, Healthy (near completion)
    id: '3',
    name: 'Alışveriş Merkezi Genişletme',
    location: 'İzmir, Bornova',
    description: 'İzmir AVM genişletme projesi',
    status: ProjectStatus.ACTIVE,
    progress: 85,
    budget: 18000000,
    budgetSpent: 15300000,
    startDate: '2024-03-15',
    endDate: '2024-11-30',
    manager: 'Mehmet Kaya',
    totalTasks: 98,
    completedTasks: 83,
    healthStatus: 'healthy',
    riskLevel: 'low',
    qualityScore: 4.2,
    daysRemaining: 42,
    category: ProjectCategory.COMMERCIAL,
    templateId: 'template-commercial-2',
    contractor: 'Metro İnşaat Ltd.',
    teamSize: 38,
    upcomingMilestones: [
      {
        id: 'm6',
        name: 'Mağaza Alanları Bitirme',
        dueDate: '2024-10-30',
        status: 'in-progress',
        progress: 90,
      },
      {
        id: 'm7',
        name: 'Son Kontroller ve Teslim',
        dueDate: '2024-11-25',
        status: 'pending',
        progress: 0,
      },
    ],
    recentActivities: [
      {
        id: 'a6',
        type: 'milestone',
        title: 'Food Court Alanı Tamamlandı',
        description: 'Tüm tesisatlar çalışır durumda',
        timestamp: '2024-08-18T16:45:00Z',
        user: 'Kemal Öz',
      },
    ],
    teamMembers: [
      {
        id: 't6',
        name: 'Mehmet Kaya',
        role: 'Saha Şefi',
        tasksCompleted: 55,
        hoursWorked: 380,
        status: 'active',
      },
    ],
    equipment: [
      {
        id: 'e4',
        name: 'Forklift #1',
        type: 'Taşıma',
        status: 'operational',
        location: 'Depo',
        lastMaintenance: '2024-08-10',
      },
    ],
    mainContractorTeam: {
      chiefEngineer: 'Mehmet Kaya',
      civilEngineer: 'Kemal Öz',
      mechanicalEngineer: 'Seda Akın',
      electricalEngineer: 'Burak Çetin',
    },
    subcontractors: {
      constructionId: 'sub-3',
      mechanicalId: 'sub-7',
      electricalId: 'sub-10',
    },
    createdBy: 'Demo User',
    createdAt: '2024-03-10T00:00:00.000Z',
    updatedAt: '2025-08-20T00:00:00.000Z',
    divisions: [],
    divisionInstances: [],
  },
  {
    // Project 4 - Completed
    id: '4',
    name: 'Otoyol Köprüsü Yenileme',
    location: 'Bursa, Osmangazi',
    description: 'Bursa otoyolu köprü yenileme işleri',
    status: ProjectStatus.COMPLETED,
    progress: 100,
    budget: 12000000,
    budgetSpent: 11800000,
    startDate: '2024-01-10',
    endDate: '2024-09-15',
    manager: 'Can Bulut',
    totalTasks: 89,
    completedTasks: 89,
    healthStatus: 'healthy',
    riskLevel: 'low',
    qualityScore: 4.7,
    daysRemaining: 0,
    category: ProjectCategory.INFRASTRUCTURE,
    templateId: 'template-infrastructure-1',
    contractor: 'Karayolları İnş. A.Ş.',
    teamSize: 28,
    upcomingMilestones: [
      {
        id: 'm8',
        name: 'Proje Teslimi',
        dueDate: '2024-09-15',
        status: 'completed',
        progress: 100,
      },
    ],
    recentActivities: [
      {
        id: 'a7',
        type: 'milestone',
        title: 'Proje Başarıyla Tamamlandı',
        description: 'Tüm kalite testleri geçildi, proje teslim edildi',
        timestamp: '2024-09-15T16:00:00Z',
        user: 'Can Bulut',
      },
    ],
    teamMembers: [
      {
        id: 't7',
        name: 'Can Bulut',
        role: 'Proje Yöneticisi',
        tasksCompleted: 65,
        hoursWorked: 420,
        status: 'off-site',
      },
    ],
    equipment: [
      {
        id: 'e5',
        name: 'Asfalt Makinesi',
        type: 'Yol',
        status: 'operational',
        location: 'Köprü Girişi',
        lastMaintenance: '2024-08-05',
      },
    ],
    mainContractorTeam: {
      chiefEngineer: 'Can Bulut',
      civilEngineer: 'İbrahim Çelik',
      mechanicalEngineer: 'Elif Yıldız',
      electricalEngineer: 'Ozan Kılıç',
    },
    subcontractors: {
      constructionId: 'sub-4',
      mechanicalId: 'sub-8',
      electricalId: 'sub-11',
    },
    createdBy: 'Demo User',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-09-15T16:00:00.000Z',
    divisions: [],
    divisionInstances: [],
  },
  {
    // Project 5 - Active, Critical
    id: '5',
    name: 'Hastane Ek Binası İnşaatı',
    location: 'İstanbul, Beşiktaş',
    description: 'İstanbul devlet hastanesi ek bina inşaatı',
    status: ProjectStatus.ACTIVE,
    progress: 25,
    budget: 28000000,
    budgetSpent: 7000000,
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    manager: 'Ayşe Özkan',
    totalTasks: 156,
    completedTasks: 38,
    healthStatus: 'critical',
    riskLevel: 'high',
    qualityScore: 3.2,
    daysRemaining: 185,
    category: ProjectCategory.HEALTHCARE,
    templateId: 'template-healthcare-1',
    contractor: 'Sağlık İnşaat A.Ş.',
    teamSize: 52,
    upcomingMilestones: [
      {
        id: 'm9',
        name: 'Temel İşleri Tamamlama',
        dueDate: '2024-09-30',
        status: 'overdue',
        progress: 60,
      },
      {
        id: 'm10',
        name: 'İskelet Yapı Başlangıç',
        dueDate: '2024-11-15',
        status: 'pending',
        progress: 0,
      },
    ],
    recentActivities: [
      {
        id: 'a8',
        type: 'issue',
        title: 'Kritik Gecikme - Temel İşleri',
        description: 'Hava koşulları nedeniyle temel işleri gecikti',
        timestamp: '2024-08-20T08:30:00Z',
        user: 'Ayşe Özkan',
      },
      {
        id: 'a9',
        type: 'task',
        title: 'Tıbbi Gaz Tesisatı Planlandı',
        description: 'Teknik çizimler onaylandı',
        timestamp: '2024-08-19T09:15:00Z',
        user: 'Nurcan Yıldız',
      },
    ],
    teamMembers: [
      {
        id: 't8',
        name: 'Ayşe Özkan',
        role: 'Proje Yöneticisi',
        tasksCompleted: 25,
        hoursWorked: 180,
        status: 'active',
      },
      {
        id: 't9',
        name: 'Nurcan Yıldız',
        role: 'İnşaat Mühendisi',
        tasksCompleted: 18,
        hoursWorked: 150,
        status: 'active',
      },
    ],
    equipment: [
      {
        id: 'e6',
        name: 'Beton Pompası',
        type: 'Beton',
        status: 'maintenance',
        location: 'Ana Giriş',
        lastMaintenance: '2024-08-12',
      },
    ],
    mainContractorTeam: {
      chiefEngineer: 'Ayşe Özkan',
      civilEngineer: 'Nurcan Yıldız',
      mechanicalEngineer: 'Emre Yılmaz',
      electricalEngineer: 'Deniz Kaya',
    },
    subcontractors: {
      constructionId: 'sub-5',
      mechanicalId: 'sub-9',
      electricalId: 'sub-12',
    },
    createdBy: 'Demo User',
    createdAt: '2024-03-25T00:00:00.000Z',
    updatedAt: '2025-08-20T00:00:00.000Z',
    divisions: [],
    divisionInstances: [],
  },
  {
    // Project 6 - On Hold
    id: '6',
    name: 'Antalya Mega AVM Projesi',
    location: 'Antalya, Muratpaşa',
    description: "Antalya'da 3 katlı mega alışveriş merkezi",
    status: ProjectStatus.ON_HOLD,
    progress: 15,
    budget: 45000000,
    budgetSpent: 6750000,
    startDate: '2024-06-01',
    endDate: '2025-08-30',
    manager: 'Serkan Yıldırım',
    totalTasks: 200,
    completedTasks: 30,
    healthStatus: 'warning',
    riskLevel: 'high',
    qualityScore: 3.5,
    daysRemaining: 245,
    category: ProjectCategory.COMMERCIAL,
    templateId: 'template-commercial-3',
    contractor: 'Antalya İnşaat Ltd.',
    teamSize: 75,
    upcomingMilestones: [
      {
        id: 'm11',
        name: 'İzin Süreçleri Tamamlama',
        dueDate: '2024-10-01',
        status: 'in-progress',
        progress: 40,
      },
    ],
    recentActivities: [
      {
        id: 'a10',
        type: 'update',
        title: 'Proje Geçici Olarak Durduruldu',
        description: 'Belediye izin süreçleri bekleniyor',
        timestamp: '2024-08-15T10:00:00Z',
        user: 'Serkan Yıldırım',
      },
    ],
    teamMembers: [
      {
        id: 't10',
        name: 'Serkan Yıldırım',
        role: 'Proje Yöneticisi',
        tasksCompleted: 20,
        hoursWorked: 120,
        status: 'on-leave',
      },
    ],
    equipment: [
      {
        id: 'e7',
        name: 'Kazı Makinesi',
        type: 'Kazı',
        status: 'broken',
        location: 'Saha Girişi',
        lastMaintenance: '2024-07-30',
      },
    ],
    mainContractorTeam: {
      chiefEngineer: 'Serkan Yıldırım',
      civilEngineer: 'Pınar Özdemir',
      mechanicalEngineer: 'Cem Akbulut',
      electricalEngineer: 'Leyla Koç',
    },
    subcontractors: {
      constructionId: 'sub-6',
      mechanicalId: 'sub-10',
      electricalId: 'sub-13',
    },
    createdBy: 'Demo User',
    createdAt: '2024-05-25T00:00:00.000Z',
    updatedAt: '2025-08-20T00:00:00.000Z',
    divisions: [],
    divisionInstances: [],
  },
  {
    // Project 7 - Cancelled
    id: '7',
    name: 'Bursa Spor Kompleksi',
    location: 'Bursa, Nilüfer',
    description: 'Çok amaçlı spor kompleksi ve yüzme havuzu',
    status: ProjectStatus.CANCELLED,
    progress: 5,
    budget: 22000000,
    budgetSpent: 1100000,
    startDate: '2024-07-01',
    endDate: '2025-05-30',
    manager: 'Tolga Avcı',
    totalTasks: 180,
    completedTasks: 9,
    healthStatus: 'critical',
    riskLevel: 'high',
    qualityScore: 2.8,
    daysRemaining: 0,
    category: ProjectCategory.SPORTS,
    templateId: 'template-sports-1',
    contractor: 'Spor Tesisleri A.Ş.',
    teamSize: 0,
    upcomingMilestones: [],
    recentActivities: [
      {
        id: 'a11',
        type: 'update',
        title: 'Proje İptal Edildi',
        description: 'Bütçe yetersizliği nedeniyle proje iptal edildi',
        timestamp: '2024-08-10T14:30:00Z',
        user: 'Tolga Avcı',
      },
    ],
    teamMembers: [],
    equipment: [],
    mainContractorTeam: {
      chiefEngineer: 'Tolga Avcı',
      civilEngineer: 'Gamze Yılmaz',
      mechanicalEngineer: 'Kaan Özkan',
      electricalEngineer: 'Sibel Demir',
    },
    subcontractors: {
      constructionId: 'sub-7',
      mechanicalId: 'sub-11',
      electricalId: 'sub-14',
    },
    createdBy: 'Demo User',
    createdAt: '2024-06-25T00:00:00.000Z',
    updatedAt: '2024-08-10T14:30:00.000Z',
    divisions: [],
    divisionInstances: [],
  },
]

// Convert to simple projects for pages that don't need full details
export const getSimpleProjects = (): Project[] => {
  return MOCK_PROJECTS.map(project => ({
    id: project.id,
    name: project.name,
    location: project.location,
    startDate: project.startDate,
    endDate: project.endDate,
    budget: project.budget,
    description: project.description,
    status: project.status,
    progress: project.progress,
    plannedProgress: Math.min(project.progress + 5, 100), // Assume planned is slightly ahead
    earnedValue: Math.round(project.budget * (project.progress / 100)),
    actualCost: Math.round(project.budgetSpent),
    plannedValue: Math.round(
      project.budget * (Math.min(project.progress + 5, 100) / 100)
    ),
    plannedBudgetToDate: Math.round(
      project.budget * (Math.min(project.progress + 5, 100) / 100)
    ),
    totalTasks: project.totalTasks,
    completedTasks: project.completedTasks,
    healthStatus: project.healthStatus,
    riskLevel: project.riskLevel,
    qualityScore: project.qualityScore,
    manager: project.manager,
    budgetSpent: project.budgetSpent,
    daysRemaining: project.daysRemaining,
    createdBy: project.createdBy,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    mainContractorTeam: project.mainContractorTeam,
    subcontractors: project.subcontractors,
    category: project.category,
    templateId: project.templateId,
    divisions: project.divisions,
    divisionInstances: project.divisionInstances,
  }))
}

// Get detailed project by ID
export const getDetailedProject = (id: string): DetailedProject | undefined => {
  return MOCK_PROJECTS.find(project => project.id === id)
}

// Convert to search items for global search
export const getSearchableProjects = (): SearchItem[] => {
  return MOCK_PROJECTS.map(project => ({
    id: `project-${project.id}`,
    type: 'project' as const,
    name: project.name,
    description: project.description,
    url: `/projects/${project.id}`,
    category: 'Projeler',
    emoji: getProjectEmoji(project.category),
  }))
}

// Get emoji for project category
function getProjectEmoji(category: ProjectCategory): string {
  switch (category) {
    case ProjectCategory.COMMERCIAL:
      return '🏢'
    case ProjectCategory.RESIDENTIAL:
      return '🏠'
    case ProjectCategory.INFRASTRUCTURE:
      return '🌉'
    case ProjectCategory.HEALTHCARE:
      return '🏥'
    case ProjectCategory.SPORTS:
      return '🏟️'
    default:
      return '🏗️'
  }
}

// Export individual projects by ID for backward compatibility
export const mockProjectData: Record<string, DetailedProject> =
  MOCK_PROJECTS.reduce(
    (acc, project) => {
      acc[project.id] = project
      return acc
    },
    {} as Record<string, DetailedProject>
  )

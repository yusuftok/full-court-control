export enum ProjectCategory {
  RESIDENTIAL = 'residential', // Konut
  COMMERCIAL = 'commercial', // Ticari
  INFRASTRUCTURE = 'infrastructure', // Altyapı
  RENOVATION = 'renovation', // Renovasyon
  HEALTHCARE = 'healthcare', // Sağlık
  SPORTS = 'sports', // Spor
}

export enum ProjectStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  ON_HOLD = 'on-hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum CreateProjectStep {
  BASIC_INFO = 0,
  MAIN_CONTRACTOR_TEAM = 1,
  SUBCONTRACTOR_MANAGEMENT = 2,
  TEMPLATE_SELECTION = 3,
  DIVISION_SETUP = 4,
  PREVIEW = 5,
}

export interface MainContractorTeam {
  chiefEngineer: string // Ana Yüklenici Sorumlu Şef Mühendis
  civilEngineer: string // Ana Yüklenici Sorumlu İnşaat Mühendisi
  mechanicalEngineer: string // Ana Yüklenici Sorumlu Makine Mühendisi
  electricalEngineer: string // Ana Yüklenici Sorumlu Elektrik Mühendisi
}

export interface ProjectFormData {
  // Step 1: Temel Bilgiler
  name: string
  location: string
  startDate: string
  endDate: string
  budget: number
  description?: string

  // Step 2: Ana Yüklenici Ekibi
  mainContractorTeam: MainContractorTeam

  // Step 3: Taşeron Atamaları
  subcontractors: {
    constructionId: string | null // Yapı İşleri Taşeronu
    mechanicalId: string | null // Mekanik İşleri Taşeronu
    electricalId: string | null // Elektrik İşleri Taşeronu
  }

  // Step 4: Proje Tipi & Şablon
  category: ProjectCategory
  templateId: string | null

  // Step 5: Division Yapısı
  divisions: DivisionNode[] // Template structure (read-only reference)
  divisionInstances: DivisionInstance[] // Actual project instances
}

export interface DivisionNode {
  id: string
  name: string
  children?: DivisionNode[]
  assignedSubcontractorId?: string | null // Bu bölümden sorumlu taşeron
  description?: string
  estimatedDuration?: number // gün cinsinden
  estimatedCost?: number // TL cinsinden
  priority?: 'low' | 'medium' | 'high' | 'critical'
  status?: 'planned' | 'in-progress' | 'completed' | 'on-hold'
  isInstance?: boolean // For marking user-created nodes vs template nodes
  instanceCount?: number // For showing instance counts in templates
}

export interface DivisionInstance {
  id: string // Unique instance ID (instance-${timestamp})
  nodeId: string // Reference to template node
  name: string // Custom instance name (can differ from template)
  parentInstanceId?: string // For hierarchical instances
  children?: DivisionInstance[] // Child instances
  taskCount: number // Default: 0
  progress: number // Default: 0 (0-100)
  assignedSubcontractorId?: string | null // Bu instance'dan sorumlu taşeron
  description?: string
  estimatedDuration?: number // gün cinsinden
  estimatedCost?: number // TL cinsinden
  priority?: 'low' | 'medium' | 'high' | 'critical'
  status?: 'planned' | 'in-progress' | 'completed' | 'on-hold'
  createdAt: string
  updatedAt?: string
}

export interface CreateProjectRequest extends ProjectFormData {
  createdBy: string
  createdAt: string
}

export type TimePoint = { label: string; value: number }

export interface Project extends CreateProjectRequest {
  id: string
  status: ProjectStatus
  progress: number
  plannedProgress: number
  earnedValue: number
  actualCost: number
  plannedValue: number
  plannedBudgetToDate: number
  totalTasks: number
  completedTasks: number
  healthStatus: 'healthy' | 'warning' | 'critical'
  riskLevel: 'low' | 'medium' | 'high'
  qualityScore: number
  manager: string // Ana sorumlu kişi (genelde Şef Mühendis)
  budgetSpent: number // Harcanan bütçe yüzdesi
  daysRemaining: number
  totalPlannedDays?: number
  updatedAt: string
  // Opsiyonel: proje genelinde atanan tüm taşeron kimlikleri
  subcontractorIds?: string[]
  // Opsiyonel: iş akış durumu
  workflowStatus?: {
    delayed: number
    risk: number
    blocked: number
    normal: number
  }
  // Opsiyonel: CPI/SPI trend serileri
  cpiSeriesMonthly?: TimePoint[]
  spiSeriesMonthly?: TimePoint[]
  cpiSeriesWeekly?: TimePoint[]
  spiSeriesWeekly?: TimePoint[]
}

export enum SubcontractorType {
  CONSTRUCTION = 'construction',  // Yapı İşleri
  MECHANICAL = 'mechanical',      // Mekanik İşleri
  ELECTRICAL = 'electrical'       // Elektrik İşleri
}

export interface Subcontractor {
  id: string
  companyName: string
  type: SubcontractorType
  responsiblePerson: string
  phone: string
  email?: string
  address?: string
  taxNumber?: string
  createdAt: string
  updatedAt?: string
  isActive: boolean
  
  // İstatistiksel bilgiler (opsiyonel)
  completedProjects?: number
  averageRating?: number
  totalRevenue?: number
  specializations?: string[]  // Özel yetenekler/uzmanlık alanları
}

export interface SubcontractorFormData {
  companyName: string
  type: SubcontractorType
  responsiblePerson: string
  phone: string
  email: string
  address: string
  taxNumber: string
  specializations: string[]
}

export interface CreateSubcontractorRequest extends SubcontractorFormData {
  createdBy: string
  createdAt: string
}

// Taşeron seçimi için kullanılacak
export interface SubcontractorOption {
  value: string      // subcontractor.id
  label: string      // companyName - responsiblePerson
  subcontractor: Subcontractor
}

// Taşeron performans bilgileri
export interface SubcontractorPerformance {
  subcontractorId: string
  projectId: string
  rating: number  // 1-5 arası
  completionTime: number  // planlanan süreye göre yüzde
  qualityScore: number  // kalite puanı
  budgetAdherence: number  // bütçeye uyum yüzdesi
  comments?: string
  evaluatedBy: string
  evaluatedAt: string
}
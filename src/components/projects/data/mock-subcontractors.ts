import { Subcontractor, SubcontractorType } from '../types/subcontractor-types'

export const mockSubcontractors: Subcontractor[] = [
  // Yapı İşleri Taşeronları
  {
    id: 'sub-construction-1',
    companyName: 'Özkan İnşaat Ltd. Şti.',
    type: SubcontractorType.CONSTRUCTION,
    responsiblePerson: 'Mehmet Özkan',
    phone: '0532-123-4567',
    email: 'mehmet@ozkanimsaat.com.tr',
    address: 'Atatürk Mah. İnşaat Cad. No:15 Şişli/İstanbul',
    taxNumber: '1234567890',
    createdAt: '2023-06-15',
    updatedAt: '2024-01-10',
    isActive: true,
    completedProjects: 24,
    averageRating: 4.3,
    totalRevenue: 15750000,
    specializations: ['Betonarme İnşaat', 'Çelik Yapı', 'Prefabrik Sistem'],
  },
  {
    id: 'sub-construction-2',
    companyName: 'Yılmaz Yapı A.Ş.',
    type: SubcontractorType.CONSTRUCTION,
    responsiblePerson: 'Ali Yılmaz',
    phone: '0533-234-5678',
    email: 'ali@yilmazyapi.com.tr',
    address: 'Cumhuriyet Mah. Yapı Sok. No:8 Beşiktaş/İstanbul',
    taxNumber: '2345678901',
    createdAt: '2023-03-22',
    updatedAt: '2024-02-05',
    isActive: true,
    completedProjects: 18,
    averageRating: 4.1,
    totalRevenue: 12300000,
    specializations: ['Konut İnşaatı', 'Villa Projesi', 'Restorasyon'],
  },
  {
    id: 'sub-construction-3',
    companyName: 'Akbay İnş. Taah. San. Tic. Ltd. Şti.',
    type: SubcontractorType.CONSTRUCTION,
    responsiblePerson: 'Hasan Akbay',
    phone: '0534-345-6789',
    email: 'hasan@akbayinsaat.com',
    address: 'Maltepe Mah. Sanayi Cad. No:42 Maltepe/İstanbul',
    taxNumber: '3456789012',
    createdAt: '2023-09-08',
    updatedAt: '2024-01-20',
    isActive: true,
    completedProjects: 31,
    averageRating: 4.6,
    totalRevenue: 28900000,
    specializations: ['Altyapı İnşaatı', 'Köprü Yapımı', 'Tünel İnşaatı'],
  },

  // Mekanik İşleri Taşeronları
  {
    id: 'sub-mechanical-1',
    companyName: 'Termo Mekanik Sistemler Ltd.',
    type: SubcontractorType.MECHANICAL,
    responsiblePerson: 'Ahmet Demir',
    phone: '0535-456-7890',
    email: 'ahmet@termomekanik.com.tr',
    address: 'Organize Sanayi Böl. 15. Cad. No:23 Gebze/Kocaeli',
    taxNumber: '4567890123',
    createdAt: '2023-05-12',
    updatedAt: '2024-01-18',
    isActive: true,
    completedProjects: 42,
    averageRating: 4.4,
    totalRevenue: 8750000,
    specializations: [
      'HVAC Sistemleri',
      'Merkezi Isıtma',
      'Soğutma Sistemleri',
      'Havalandırma',
    ],
  },
  {
    id: 'sub-mechanical-2',
    companyName: 'İklim Tesisat ve Montaj A.Ş.',
    type: SubcontractorType.MECHANICAL,
    responsiblePerson: 'Mustafa Kaya',
    phone: '0536-567-8901',
    email: 'mustafa@iklimtesisat.com.tr',
    address: 'Teknopark Mah. İnovasyon Cad. No:7 Pendik/İstanbul',
    taxNumber: '5678901234',
    createdAt: '2023-01-30',
    updatedAt: '2024-02-12',
    isActive: true,
    completedProjects: 38,
    averageRating: 4.2,
    totalRevenue: 9200000,
    specializations: [
      'Su Tesisatı',
      'Doğalgaz Sistemleri',
      'Yangın Söndürme',
      'Temiz Su',
    ],
  },
  {
    id: 'sub-mechanical-3',
    companyName: 'Endüstriyel Makine ve Tesisat',
    type: SubcontractorType.MECHANICAL,
    responsiblePerson: 'Ömer Çetin',
    phone: '0537-678-9012',
    email: 'omer@endustriyeltesisat.com',
    address: 'Sanayi Mah. Makine Cad. No:56 Tuzla/İstanbul',
    taxNumber: '6789012345',
    createdAt: '2023-08-17',
    updatedAt: '2024-01-25',
    isActive: true,
    completedProjects: 29,
    averageRating: 4.5,
    totalRevenue: 11800000,
    specializations: [
      'Endüstriyel HVAC',
      'Kazan Sistemleri',
      'Kompresör Montajı',
      'Buhar Sistemleri',
    ],
  },

  // Elektrik İşleri Taşeronları
  {
    id: 'sub-electrical-1',
    companyName: 'Volt Elektrik Müh. Ltd. Şti.',
    type: SubcontractorType.ELECTRICAL,
    responsiblePerson: 'Hasan Çelik',
    phone: '0538-789-0123',
    email: 'hasan@voltelektrik.com.tr',
    address: 'Elektrik Mah. Enerji Sok. No:12 Ümraniye/İstanbul',
    taxNumber: '7890123456',
    createdAt: '2023-04-05',
    updatedAt: '2024-02-08',
    isActive: true,
    completedProjects: 47,
    averageRating: 4.7,
    totalRevenue: 6900000,
    specializations: [
      'Güçlü Akım',
      'Zayıf Akım',
      'Aydınlatma Sistemleri',
      'Pano Montajı',
    ],
  },
  {
    id: 'sub-electrical-2',
    companyName: 'Enerji Sistemleri ve Otomasyon',
    type: SubcontractorType.ELECTRICAL,
    responsiblePerson: 'Fatih Aksoy',
    phone: '0539-890-1234',
    email: 'fatih@enerjisistem.com.tr',
    address: 'Otomasyon Mah. Teknoloji Cad. No:34 Kadıköy/İstanbul',
    taxNumber: '8901234567',
    createdAt: '2023-07-20',
    updatedAt: '2024-01-30',
    isActive: true,
    completedProjects: 35,
    averageRating: 4.3,
    totalRevenue: 8400000,
    specializations: [
      'Bina Otomasyonu',
      'Güvenlik Sistemleri',
      'Yangın Alarm',
      'Ses Sistemleri',
    ],
  },
  {
    id: 'sub-electrical-3',
    companyName: 'Mega Elektrik Taah. San. Tic. Ltd.',
    type: SubcontractorType.ELECTRICAL,
    responsiblePerson: 'İbrahim Yurt',
    phone: '0541-901-2345',
    email: 'ibrahim@megaelektrik.com',
    address: 'Elektrikçiler Sit. B Blok No:18 Bayrampaşa/İstanbul',
    taxNumber: '9012345678',
    createdAt: '2023-02-14',
    updatedAt: '2024-02-20',
    isActive: true,
    completedProjects: 52,
    averageRating: 4.1,
    totalRevenue: 13200000,
    specializations: [
      'Yüksek Gerilim',
      'Transformatör',
      'Generator Sistemleri',
      'İletim Hatları',
    ],
  },

  // Pasif taşeron örneği
  {
    id: 'sub-construction-4',
    companyName: 'Eski Yapı Ltd. (PASİF)',
    type: SubcontractorType.CONSTRUCTION,
    responsiblePerson: 'Kemal Eski',
    phone: '0542-012-3456',
    email: 'kemal@eskiyapi.com',
    address: 'Eski Mah. Kapanan Cad. No:99',
    taxNumber: '0123456789',
    createdAt: '2022-11-10',
    updatedAt: '2023-12-15',
    isActive: false,
    completedProjects: 8,
    averageRating: 2.1,
    totalRevenue: 2100000,
    specializations: ['Tadilat İşleri'],
  },
]

// Taşeron türüne göre filtreleme yardımcı fonksiyonu
export const getSubcontractorsByType = (
  type: SubcontractorType
): Subcontractor[] => {
  return mockSubcontractors.filter(sub => sub.type === type && sub.isActive)
}

// Taşeron seçenekleri için dropdown formatına çevirme
export const getSubcontractorOptions = (type: SubcontractorType) => {
  return getSubcontractorsByType(type).map(sub => ({
    value: sub.id,
    label: `${sub.companyName} - ${sub.responsiblePerson}`,
    subcontractor: sub,
  }))
}

// Taşeron türlerinin Türkçe karşılıkları
export const getSubcontractorTypeLabel = (type: SubcontractorType): string => {
  switch (type) {
    case SubcontractorType.CONSTRUCTION:
      return 'Yapı İşleri'
    case SubcontractorType.MECHANICAL:
      return 'Mekanik İşleri'
    case SubcontractorType.ELECTRICAL:
      return 'Elektrik İşleri'
    default:
      return type
  }
}

// ID'ye göre taşeron bulma
export const findSubcontractorById = (
  id: string
): Subcontractor | undefined => {
  return mockSubcontractors.find(sub => sub.id === id)
}

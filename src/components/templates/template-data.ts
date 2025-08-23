import { DivisionTemplate, DivisionNode, ProjectData } from './template-types'

export const mockTemplates: DivisionTemplate[] = [
  {
    id: "1",
    name: "Yüksek Kat Konut Binası",
    description: "10 kattan yüksek konut kuleleri için standart bölüm şablonu",
    createdBy: "Ahmet Yılmaz",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
    usageCount: 8,
    divisions: [
      {
        id: "1-1",
        name: "Temel & Bodrum",
        children: [
          { id: "1-1-1", name: "Kazı İşleri" },
          { id: "1-1-2", name: "Temel Betonu" },
          { id: "1-1-3", name: "Bodrum Duvarları" }
        ]
      },
      {
        id: "1-2",
        name: "Yapı Sistemi",
        children: [
          { id: "1-2-1", name: "Kolon & Kiriş" },
          { id: "1-2-2", name: "Döşeme Plakları" },
          { id: "1-2-3", name: "Dış Duvarlar" }
        ]
      },
      {
        id: "1-3",
        name: "Mekanik Elektrik Tesisat",
        children: [
          { id: "1-3-1", name: "Elektrik" },
          { id: "1-3-2", name: "Tesisat" },
          { id: "1-3-3", name: "HVAC" }
        ]
      },
      {
        id: "1-4",
        name: "Son Kat",
        children: [
          { id: "1-4-1", name: "İç Finisaj" },
          { id: "1-4-2", name: "Dış Cephe" }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Ticari Ofis Kompleksi",
    description: "Orta ve büyük ticari ofis binaları için bölüm şablonu",
    createdBy: "Fatma Demir",
    createdAt: "2024-02-05",
    updatedAt: "2024-02-08",
    usageCount: 5,
    divisions: [
      {
        id: "2-1",
        name: "Saha Hazırlığı",
        children: [
          { id: "2-1-1", name: "Yıkım" },
          { id: "2-1-2", name: "Saha Temizliği" },
          { id: "2-1-3", name: "Altyapı Kurulumu" }
        ]
      },
      {
        id: "2-2",
        name: "Çekirdek & Kabuk",
        children: [
          { id: "2-2-1", name: "Temel" },
          { id: "2-2-2", name: "Yapısal İskelet" },
          { id: "2-2-3", name: "Bina Kabuğu" }
        ]
      },
      {
        id: "2-3",
        name: "Kiracı İyileştirmeleri", 
        children: [
          { id: "2-3-1", name: "İç Mekan Düzenleme" },
          { id: "2-3-2", name: "Teknoloji Altyapısı" }
        ]
      },
      {
        id: "2-4",
        name: "Saha İşleri",
        children: [
          { id: "2-4-1", name: "Peyzaj" },
          { id: "2-4-2", name: "Otopark & Erişim" }
        ]
      }
    ]
  },
  {
    id: "3",
    name: "Altyapı Köprüsü",
    description: "Karayolu ve demiryolu köprü inşaat projeleri için şablon",
    createdBy: "Mehmet Kaya",
    createdAt: "2023-12-15",
    updatedAt: "2024-01-20",
    usageCount: 3,
    divisions: [
      {
        id: "3-1",
        name: "Temeller",
        children: [
          { id: "3-1-1", name: "Kazık Montajı" },
          { id: "3-1-2", name: "Kazık Başlıkları" },
          { id: "3-1-3", name: "Ayaklar" }
        ]
      },
      {
        id: "3-2",
        name: "Üst Yapı",
        children: [
          { id: "3-2-1", name: "Kiriş Montajı" },
          { id: "3-2-2", name: "Tabla İnşaatı" }
        ]
      },
      {
        id: "3-3",
        name: "Finisaj & Güvenlik",
        children: [
          { id: "3-3-1", name: "Korkuluk & Bariyerler" },
          { id: "3-3-2", name: "Tabla Finisajı" },
          { id: "3-3-3", name: "Aydınlatma & Tabela" }
        ]
      }
    ]
  }
]

export const mockProjects: ProjectData[] = [
  { id: '1', name: 'Şehir Merkezi Ofis Kompleksi', status: 'active', progress: 68 },
  { id: '2', name: 'Konut Kulesi A', status: 'active', progress: 45 },
  { id: '3', name: 'Alışveriş Merkezi Genişletme', status: 'pending', progress: 12 },
  { id: '4', name: 'Hastane Ek Binası İnşaatı', status: 'active', progress: 89 }
]

export const getDefaultDivisions = (category: string): DivisionNode[] => {
  const templates = {
    residential: [
      {
        id: 'res-1',
        name: 'Temel & Bodrum İşleri',
        children: [
          { id: 'res-1-1', name: 'Kazı İşleri' },
          { id: 'res-1-2', name: 'Temel Betonu' },
          { id: 'res-1-3', name: 'İzolasyon' }
        ]
      },
      {
        id: 'res-2',
        name: 'Yapı Sistemi',
        children: [
          { id: 'res-2-1', name: 'Kolon ve Kiriş' },
          { id: 'res-2-2', name: 'Duvar İnşaatı' }
        ]
      }
    ],
    commercial: [
      {
        id: 'com-1',
        name: 'Altyapı Hazırlık',
        children: [
          { id: 'com-1-1', name: 'Saha Temizliği' },
          { id: 'com-1-2', name: 'Geçici Tesis' }
        ]
      },
      {
        id: 'com-2',
        name: 'Çelik Konstrüksiyon',
        children: [
          { id: 'com-2-1', name: 'Çelik Montaj' },
          { id: 'com-2-2', name: 'Kaynak İşleri' }
        ]
      }
    ],
    infrastructure: [
      {
        id: 'inf-1',
        name: 'Güzergah Hazırlık',
        children: [
          { id: 'inf-1-1', name: 'Kamulaştırma' },
          { id: 'inf-1-2', name: 'Eski Yapı Yıkım' }
        ]
      }
    ],
    renovation: [
      {
        id: 'ren-1',
        name: 'Yıkım ve Hazırlık',
        children: [
          { id: 'ren-1-1', name: 'Kısmi Yıkım' },
          { id: 'ren-1-2', name: 'Hafriyat Temizliği' }
        ]
      }
    ]
  }
  
  return templates[category as keyof typeof templates] || templates.residential
}

// Helper function to count total nodes in template
export const countNodes = (nodes: DivisionNode[]): number => {
  return nodes.reduce((count, node) => {
    return count + 1 + (node.children ? countNodes(node.children) : 0)
  }, 0)
}
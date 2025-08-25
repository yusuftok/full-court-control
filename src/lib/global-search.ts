export interface SearchItem {
  id: string
  type: 'project' | 'template' | 'person' | 'task'
  name: string
  description?: string
  url: string
  category: string
  emoji?: string
}

export const searchableItems: SearchItem[] = [
  // Projects
  {
    id: 'project-1',
    type: 'project',
    name: 'Şehir Merkezi Ofis Kompleksi',
    description: 'İstanbul merkez lokasyonda 15 katlı ofis projesi',
    url: '/projects/1',
    category: 'Projeler',
    emoji: '🏢',
  },
  {
    id: 'project-2',
    type: 'project',
    name: 'Konut Kulesi A',
    description: "Ankara'da 25 katlı lüks konut projesi",
    url: '/projects/2',
    category: 'Projeler',
    emoji: '🏠',
  },
  {
    id: 'project-3',
    type: 'project',
    name: 'Alışveriş Merkezi Genişletme',
    description: 'İzmir AVM genişletme projesi',
    url: '/projects/3',
    category: 'Projeler',
    emoji: '🛒',
  },
  {
    id: 'project-4',
    type: 'project',
    name: 'Otoyol Köprüsü Yenileme',
    description: 'Bursa otoyolu köprü yenileme işleri',
    url: '/projects/4',
    category: 'Projeler',
    emoji: '🌉',
  },
  {
    id: 'project-5',
    type: 'project',
    name: 'Hastane Ek Binası İnşaatı',
    description: 'İstanbul devlet hastanesi ek bina inşaatı',
    url: '/projects/5',
    category: 'Projeler',
    emoji: '🏥',
  },

  // Templates
  {
    id: 'template-1',
    type: 'template',
    name: 'Yüksek Kat Konut Binası',
    description: '10 kattan yüksek konut kuleleri için standart şablon',
    url: '/templates?selected=1',
    category: 'Şablonlar',
    emoji: '🏗️',
  },
  {
    id: 'template-2',
    type: 'template',
    name: 'Ticari Ofis Kompleksi',
    description: 'Orta ve büyük ticari ofis binaları için şablon',
    url: '/templates?selected=2',
    category: 'Şablonlar',
    emoji: '🏢',
  },
  {
    id: 'template-3',
    type: 'template',
    name: 'Altyapı Köprüsü',
    description: 'Karayolu ve demiryolu köprü inşaat şablonu',
    url: '/templates?selected=3',
    category: 'Şablonlar',
    emoji: '🌉',
  },

  // Tasks/Görevler
  {
    id: 'task-1',
    type: 'task',
    name: 'Temel Atma İşleri',
    description: 'Şehir Merkezi Ofis Kompleksi - Temel kazısı ve beton dökümü',
    url: '/projects/1/tasks/temel-atma',
    category: 'Görevler',
    emoji: '🏗️',
  },
  {
    id: 'task-2',
    type: 'task',
    name: 'Elektrik Tesisatı',
    description: 'Konut Kulesi A - Ana elektrik hattı döşeme çalışmaları',
    url: '/projects/2/tasks/elektrik',
    category: 'Görevler',
    emoji: '⚡',
  },
  {
    id: 'task-3',
    type: 'task',
    name: 'Dış Cephe Finisajı',
    description: 'Hastane Ek Binası - Cam montajı ve son cephe işlemleri',
    url: '/projects/5/tasks/finisaj',
    category: 'Görevler',
    emoji: '🏢',
  },
  {
    id: 'task-4',
    type: 'task',
    name: 'Su Tesisatı Kontrolü',
    description: 'Alışveriş Merkezi - Ana su hattı ve sızdırmazlık testleri',
    url: '/projects/3/tasks/su-tesisat',
    category: 'Görevler',
    emoji: '💧',
  },

  // People/Kişiler
  {
    id: 'person-1',
    type: 'person',
    name: 'Ahmet Yılmaz',
    description: 'Proje Yöneticisi - Şehir Merkezi Ofis Kompleksi',
    url: '/people/ahmet-yilmaz',
    category: 'Kişiler',
    emoji: '👨‍💼',
  },
  {
    id: 'person-2',
    type: 'person',
    name: 'Fatma Demir',
    description: 'Proje Yöneticisi - Konut Kulesi A',
    url: '/people/fatma-demir',
    category: 'Kişiler',
    emoji: '👩‍💼',
  },
  {
    id: 'person-3',
    type: 'person',
    name: 'Mehmet Kaya',
    description: 'Saha Şefi - Alışveriş Merkezi Genişletme',
    url: '/people/mehmet-kaya',
    category: 'Kişiler',
    emoji: '👷‍♂️',
  },
  {
    id: 'person-4',
    type: 'person',
    name: 'Can Bulut',
    description: 'Baş Mimar - Hastane Ek Binası İnşaatı',
    url: '/people/can-bulut',
    category: 'Kişiler',
    emoji: '👨‍🔧',
  },
  {
    id: 'person-5',
    type: 'person',
    name: 'Ayşe Özkan',
    description: 'Elektrik Mühendisi - Otoyol Köprüsü Yenileme',
    url: '/people/ayse-ozkan',
    category: 'Kişiler',
    emoji: '👩‍🔧',
  },
]

export function searchItems(query: string, limit = 8): SearchItem[] {
  if (!query.trim()) return []

  const searchTerm = query.toLowerCase().trim()

  const results = searchableItems.filter(item => {
    return (
      item.name.toLowerCase().includes(searchTerm) ||
      item.description?.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm)
    )
  })

  // Sort by relevance (exact matches first, then partial matches)
  results.sort((a, b) => {
    const aExact = a.name.toLowerCase().startsWith(searchTerm) ? 1 : 0
    const bExact = b.name.toLowerCase().startsWith(searchTerm) ? 1 : 0
    return bExact - aExact
  })

  return results.slice(0, limit)
}

export function groupSearchResults(
  results: SearchItem[]
): Record<string, SearchItem[]> {
  return results.reduce(
    (groups, item) => {
      const category = item.category
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(item)
      return groups
    },
    {} as Record<string, SearchItem[]>
  )
}

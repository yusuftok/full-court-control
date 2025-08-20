"use client"

import * as React from "react"
import { Plus, Search, FolderTree, Copy, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageContainer, PageHeader, PageContent } from "@/components/layout/page-container"
import { Breadcrumbs } from "@/components/navigation/breadcrumbs"

interface DivisionNode {
  id: string
  name: string
  children?: DivisionNode[]
}

interface DivisionTemplate {
  id: string
  name: string
  description: string
  createdBy: string
  createdAt: string
  updatedAt: string
  usageCount: number
  divisions: DivisionNode[]
}

const mockTemplates: DivisionTemplate[] = [
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

// Render division tree
function DivisionTree({ divisions, level = 0 }: { divisions: DivisionNode[], level?: number }) {
  return (
    <div className={level > 0 ? "ml-4" : ""}>
      {divisions.map((division) => (
        <div key={division.id} className="py-1">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <FolderTree className="size-3 text-muted-foreground" />
              <span className="font-medium">{division.name}</span>
            </div>
          </div>
          {division.children && (
            <DivisionTree divisions={division.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function DivisionTemplatesPage() {
  const [searchTerm, setSearchTerm] = React.useState("")

  const breadcrumbItems = [
    { label: "Bölüm Şablonları", href: "/templates" }
  ]

  const filteredTemplates = React.useMemo(() => {
    if (!searchTerm) return mockTemplates
    
    return mockTemplates.filter(template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const handleCreateTemplate = () => {
    console.log("Create new template")
    // TODO: Navigate to template designer
  }

  const handleEditTemplate = (template: DivisionTemplate) => {
    console.log("Edit template:", template.id)
    // TODO: Navigate to template editor
  }

  const handleDuplicateTemplate = (template: DivisionTemplate) => {
    console.log("Duplicate template:", template.id)
    // TODO: Create copy of template
  }

  const handleDeleteTemplate = (template: DivisionTemplate) => {
    console.log("Delete template:", template.id)
    // TODO: Show confirmation dialog
  }

  return (
    <PageContainer>
      <PageContent>
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />
        
        <PageHeader
          title="Bölüm Şablonları"
          description="Projeleriniz için yeniden kullanılabilir bölüm hiyerarşileri oluşturun ve yönetin"
          action={
            <Button onClick={handleCreateTemplate}>
              <Plus className="size-4 mr-2" />
              Yeni Şablon
            </Button>
          }
        />

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Şablonları ad, açıklama veya oluşturucuya göre arayın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditTemplate(template)}
                      className="size-8"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDuplicateTemplate(template)}
                      className="size-8"
                    >
                      <Copy className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTemplate(template)}
                      className="size-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  {/* Template Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {template.createdBy} tarafından oluşturuldu
                    </span>
                    <span className="text-muted-foreground">
                      {template.usageCount} kez kullanıldı
                    </span>
                  </div>
                  
                  {/* Division Tree Preview */}
                  <div className="border rounded-lg p-3 bg-muted/30 max-h-48 overflow-y-auto">
                    <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Bölüm Yapısı
                    </div>
                    <DivisionTree divisions={template.divisions} />
                  </div>
                  
                  {/* Template Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="size-3 mr-1" />
                      Düzenle
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDuplicateTemplate(template)}
                    >
                      <Copy className="size-3 mr-1" />
                      Kopyala
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FolderTree className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Şablon bulunamadı</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {searchTerm
                  ? "Aradığınızı bulmak için arama kriterlerinizi ayarlamayı deneyin."
                  : "Proje planlamaya başlamak için ilk bölüm şablonunuzu oluşturun."
                }
              </p>
              <Button onClick={handleCreateTemplate}>
                <Plus className="size-4 mr-2" />
                Şablon Oluştur
              </Button>
            </CardContent>
          </Card>
        )}
      </PageContent>
    </PageContainer>
  )
}
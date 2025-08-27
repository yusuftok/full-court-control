'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Construction,
  Users,
  Building,
  Building2,
  Sparkles,
  ChevronRight,
  FolderTree,
  Eye,
  Edit,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  PageContainer,
  PageHeader,
  PageContent,
} from '@/components/layout/page-container'
import { mockTemplates } from '@/components/templates/template-data'
import {
  DivisionTemplate,
  DivisionNode,
} from '@/components/templates/template-types'

const templateCategoryConfig = {
  residential: {
    icon: Building,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    gradient: 'from-blue-50/50 to-blue-100/30',
    label: 'Konut',
  },
  commercial: {
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    gradient: 'from-purple-50/50 to-purple-100/30',
    label: 'Ticari',
  },
  infrastructure: {
    icon: Building2,
    color: 'text-green-600',
    bg: 'bg-green-100',
    gradient: 'from-green-50/50 to-green-100/30',
    label: 'Altyapı',
  },
  renovation: {
    icon: Construction,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    gradient: 'from-orange-50/50 to-orange-100/30',
    label: 'Renovasyon',
  },
}

export default function TemplatesPage() {
  const searchParams = useSearchParams()
  const selectedTemplateId = searchParams.get('selected')
  const selectedTemplate = selectedTemplateId
    ? mockTemplates.find(t => t.id === selectedTemplateId)
    : null

  // Template kategorilerine göre gruplandır
  const templatesByCategory = React.useMemo(() => {
    return mockTemplates.reduce(
      (acc, template) => {
        // Template kategori belirleme (basit heuristic)
        const category = template.name.toLowerCase().includes('konut')
          ? 'residential'
          : template.name.toLowerCase().includes('ofis') ||
              template.name.toLowerCase().includes('ticari')
            ? 'commercial'
            : template.name.toLowerCase().includes('köprü') ||
                template.name.toLowerCase().includes('altyapı')
              ? 'infrastructure'
              : 'renovation'

        if (!acc[category]) acc[category] = []
        acc[category].push(template)
        return acc
      },
      {} as Record<string, DivisionTemplate[]>
    )
  }, [])

  const totalDivisions = (template: DivisionTemplate): number => {
    const countNodes = (nodes: DivisionNode[]): number => {
      return nodes.reduce((count, node) => {
        return count + 1 + (node.children ? countNodes(node.children) : 0)
      }, 0)
    }
    return countNodes(template.divisions)
  }

  if (selectedTemplate) {
    return (
      <PageContainer>
        <PageContent>
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="construction-hover"
            >
              <Link href="/templates">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">
                {selectedTemplate.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {selectedTemplate.description}
              </p>
            </div>
          </div>

          {/* Şablon Detayı */}
          <Card className="floating-card glass-card border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-heading-lg">
                    <FolderTree className="size-6 text-primary" />
                    Şablon Yapısı
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{selectedTemplate.divisions.length} ana bölüm</span>
                    <span>•</span>
                    <span>{totalDivisions(selectedTemplate)} toplam bölüm</span>
                    <span>•</span>
                    <span>{selectedTemplate.usageCount} kez kullanıldı</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline">
                    <Eye className="size-4 mr-2" />
                    Önizle
                  </Button>
                  <Button asChild>
                    <Link href="/settings/templates">
                      <Edit className="size-4 mr-2" />
                      Düzenle
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedTemplate.divisions.map(division => (
                  <div
                    key={division.id}
                    className="border-l-2 border-green-300 pl-4"
                  >
                    <h4 className="font-medium text-lg">{division.name}</h4>
                    {division.children && division.children.length > 0 && (
                      <div className="ml-4 mt-2 space-y-2">
                        {division.children.map(child => (
                          <div
                            key={child.id}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <div className="size-2 bg-muted-foreground rounded-full" />
                            {child.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </PageContent>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageContent>
        <PageHeader
          title="Şablon Kütüphanesi"
          description="Projeleriniz için hazır şablon yapıları inceleyin ve kullanın"
          action={
            <Button asChild className="gradient-primary text-white">
              <Link href="/settings/templates">
                <Sparkles className="size-4 mr-2" />
                Şablon Yönetimi
              </Link>
            </Button>
          }
        />

        <div className="space-y-8">
          {Object.entries(templatesByCategory).map(
            ([categoryKey, templates]) => {
              const config =
                templateCategoryConfig[
                  categoryKey as keyof typeof templateCategoryConfig
                ]
              const Icon = config.icon

              return (
                <div key={categoryKey} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-8 ${config.bg} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className={`size-5 ${config.color}`} />
                    </div>
                    <h2 className="text-xl font-semibold">
                      {config.label} Şablonları
                    </h2>
                    <Badge variant="outline" className="ml-auto">
                      {templates.length} şablon
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(template => (
                      <Card
                        key={template.id}
                        className={`floating-card glass-card border-l-4 border-l-${config.color.replace('text-', '').replace('-600', '-400')} bg-gradient-to-br ${config.gradient} hover:shadow-xl transition-all duration-300 group`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                                {template.name}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {template.description}
                              </p>
                            </div>
                            <div
                              className={`size-10 ${config.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon className={`size-5 ${config.color}`} />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Template İstatistikleri */}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {template.divisions.length} ana bölüm
                            </span>
                            <span className="text-muted-foreground">
                              {totalDivisions(template)} toplam
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{template.createdBy}</span>
                            <span>{template.usageCount} kez kullanıldı</span>
                          </div>

                          {/* Şablon Görüntüle Butonu */}
                          <Button
                            asChild
                            className="w-full modern-button group bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:scale-105 hover:shadow-lg"
                          >
                            <Link href={`/templates?selected=${template.id}`}>
                              <Eye className="size-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                              <span className="group-hover:tracking-wide transition-all duration-200">
                                Şablonu İncele
                              </span>
                              <ChevronRight className="size-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            }
          )}
        </div>

        {/* Boş durum */}
        {Object.keys(templatesByCategory).length === 0 && (
          <Card className="glass-card !p-4 modern-hover">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="size-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 animate-float-tools hover:animate-pulse">
                <FolderTree className="size-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Henüz Şablon Yok 📋
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Proje planlamaya başlamak için ilk bölüm şablonunuzu oluşturun.
              </p>
              <Button
                asChild
                className="modern-button gradient-primary border-0 text-white hover:scale-105 group hover:shadow-xl"
              >
                <Link href="/settings/templates">
                  <Construction className="size-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="group-hover:tracking-wide transition-all duration-200">
                    İlk Şablonunu Oluştur
                  </span>
                  <Sparkles className="size-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </PageContent>
    </PageContainer>
  )
}

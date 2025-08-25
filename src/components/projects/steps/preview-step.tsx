'use client'

import { Calendar, Banknote, MapPin, Users, Building, TreePine, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ProjectFormData, ProjectCategory } from '../types/project-types'
import { findSubcontractorById, getSubcontractorTypeLabel } from '../data/mock-subcontractors'
import { mockTemplates } from '@/components/templates/template-data'

interface PreviewStepProps {
  formData: ProjectFormData
}

const CATEGORY_LABELS = {
  [ProjectCategory.RESIDENTIAL]: 'Konut',
  [ProjectCategory.COMMERCIAL]: 'Ticari', 
  [ProjectCategory.INFRASTRUCTURE]: 'Altyapı',
  [ProjectCategory.RENOVATION]: 'Renovasyon'
}

export const PreviewStep: React.FC<PreviewStepProps> = ({ formData }) => {
  const selectedTemplate = formData.templateId 
    ? mockTemplates.find(t => t.id === formData.templateId)
    : null

  const constructionSubcontractor = formData.subcontractors.constructionId 
    ? findSubcontractorById(formData.subcontractors.constructionId)
    : null
  
  const mechanicalSubcontractor = formData.subcontractors.mechanicalId 
    ? findSubcontractorById(formData.subcontractors.mechanicalId)
    : null
    
  const electricalSubcontractor = formData.subcontractors.electricalId 
    ? findSubcontractorById(formData.subcontractors.electricalId)
    : null

  const projectDuration = formData.startDate && formData.endDate 
    ? Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 3600 * 24))
    : 0

  const totalDivisions = formData.divisions.reduce((count, div) => {
    return count + 1 + (div.children ? div.children.length : 0)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Başarı Mesajı */}
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200 text-lg">
                Proje Hazır!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Tüm bilgiler tamamlandı. Aşağıdaki özeti kontrol edin ve "Projeyi Oluştur" butonuna tıklayın.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Temel Bilgiler */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            <CardTitle>Proje Bilgileri</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
                {formData.name}
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">
                    {formData.location}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">
                    {new Date(formData.startDate).toLocaleDateString('tr-TR')} - {' '}
                    {new Date(formData.endDate).toLocaleDateString('tr-TR')}
                  </span>
                  <Badge variant="secondary" className="ml-2">
                    {projectDuration} gün
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">
                    {new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY'
                    }).format(formData.budget)}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="space-y-3">
                <Badge variant="outline" className="inline-block">
                  {CATEGORY_LABELS[formData.category]}
                </Badge>
                
                {selectedTemplate && (
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Şablon:</p>
                    <p className="font-medium">{selectedTemplate.name}</p>
                  </div>
                )}
                
                {formData.description && (
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Açıklama:</p>
                    <p className="text-sm">{formData.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ana Yüklenici Ekibi */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <CardTitle>Ana Yüklenici Ekibi</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Şef Mühendis
                </p>
                <p className="text-slate-900 dark:text-slate-100">
                  {formData.mainContractorTeam.chiefEngineer}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  İnşaat Mühendisi
                </p>
                <p className="text-slate-900 dark:text-slate-100">
                  {formData.mainContractorTeam.civilEngineer}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Makine Mühendisi
                </p>
                <p className="text-slate-900 dark:text-slate-100">
                  {formData.mainContractorTeam.mechanicalEngineer}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Elektrik Mühendisi
                </p>
                <p className="text-slate-900 dark:text-slate-100">
                  {formData.mainContractorTeam.electricalEngineer}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Taşeronlar */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-orange-600" />
            <CardTitle>Seçili Taşeronlar</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {constructionSubcontractor && (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Yapı İşleri</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {constructionSubcontractor.companyName} - {constructionSubcontractor.responsiblePerson}
                  </p>
                </div>
                <Badge variant="outline">Yapı</Badge>
              </div>
            )}
            
            {mechanicalSubcontractor && (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Mekanik İşleri</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {mechanicalSubcontractor.companyName} - {mechanicalSubcontractor.responsiblePerson}
                  </p>
                </div>
                <Badge variant="outline">Mekanik</Badge>
              </div>
            )}
            
            {electricalSubcontractor && (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Elektrik İşleri</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {electricalSubcontractor.companyName} - {electricalSubcontractor.responsiblePerson}
                  </p>
                </div>
                <Badge variant="outline">Elektrik</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Proje Yapısı */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TreePine className="w-5 h-5 text-green-600" />
            <CardTitle>Proje Yapısı</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary">
              {totalDivisions} toplam bölüm
            </Badge>
            <Badge variant="secondary">
              {formData.divisions.length} ana bölüm
            </Badge>
          </div>

          <div className="space-y-3">
            {formData.divisions.map((division) => (
              <div key={division.id} className="border-l-2 border-green-300 pl-4">
                <p className="font-medium">{division.name}</p>
                {division.children && division.children.length > 0 && (
                  <div className="ml-4 mt-2 space-y-1">
                    {division.children.map((child) => (
                      <p key={child.id} className="text-sm text-slate-600 dark:text-slate-400">
                        • {child.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {formData.divisions.length === 0 && (
            <p className="text-sm text-slate-500 italic">
              Henüz bölüm tanımlanmamış
            </p>
          )}
        </CardContent>
      </Card>

      {/* Son Kontrol */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                Proje Oluşturulmaya Hazır
              </h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <p>✅ Temel bilgiler tamamlandı</p>
                <p>✅ Ana yüklenici ekibi atandı</p>
                <p>✅ Taşeronlar seçildi</p>
                <p>✅ Proje yapısı oluşturuldu</p>
                <p className="mt-3 font-medium">
                  "Projeyi Oluştur" butonuna tıklayarak projeyi kaydetebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
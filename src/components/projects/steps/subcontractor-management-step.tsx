'use client'

import { useState } from 'react'
import { Users, Building, Plus, Check, Star, MapPin, Phone, Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ProjectFormData } from '../types/project-types'
import { SubcontractorType, Subcontractor } from '../types/subcontractor-types'
import { 
  mockSubcontractors, 
  getSubcontractorsByType, 
  getSubcontractorTypeLabel,
  findSubcontractorById 
} from '../data/mock-subcontractors'
import { SubcontractorSelector } from '../subcontractor-selector'

interface SubcontractorManagementStepProps {
  formData: ProjectFormData
  updateFormData: (updates: Partial<ProjectFormData>) => void
}

interface NewSubcontractorForm {
  companyName: string
  responsiblePerson: string
  phone: string
  email: string
  address: string
  type: SubcontractorType
}

const emptyNewSubcontractorForm: NewSubcontractorForm = {
  companyName: '',
  responsiblePerson: '',
  phone: '',
  email: '',
  address: '',
  type: SubcontractorType.CONSTRUCTION
}

export const SubcontractorManagementStep: React.FC<SubcontractorManagementStepProps> = ({
  formData,
  updateFormData
}) => {
  const [newSubcontractorDialogOpen, setNewSubcontractorDialogOpen] = useState(false)
  const [newSubcontractorForm, setNewSubcontractorForm] = useState<NewSubcontractorForm>(emptyNewSubcontractorForm)
  const [selectedSubcontractorType, setSelectedSubcontractorType] = useState<SubcontractorType | null>(null)

  // Global subcontractor list (simulated - in real app would be from state management)
  const [subcontractorList, setSubcontractorList] = useState<Subcontractor[]>(mockSubcontractors)

  const handleSubcontractorChange = (type: 'constructionId' | 'mechanicalId' | 'electricalId', value: string | null) => {
    updateFormData({
      subcontractors: {
        ...formData.subcontractors,
        [type]: value
      }
    })
  }

  const openAddSubcontractorDialog = (type: SubcontractorType) => {
    setSelectedSubcontractorType(type)
    setNewSubcontractorForm({ ...emptyNewSubcontractorForm, type })
    setNewSubcontractorDialogOpen(true)
  }

  const handleAddNewSubcontractor = () => {
    const newSubcontractor: Subcontractor = {
      id: `new-${Date.now()}`,
      companyName: newSubcontractorForm.companyName,
      type: newSubcontractorForm.type,
      responsiblePerson: newSubcontractorForm.responsiblePerson,
      phone: newSubcontractorForm.phone,
      email: newSubcontractorForm.email,
      address: newSubcontractorForm.address,
      createdAt: new Date().toISOString(),
      isActive: true,
      completedProjects: 0,
      averageRating: 0
    }

    // Add to global list
    setSubcontractorList(prev => [...prev, newSubcontractor])

    // Auto-select the new subcontractor
    const fieldMap = {
      [SubcontractorType.CONSTRUCTION]: 'constructionId' as const,
      [SubcontractorType.MECHANICAL]: 'mechanicalId' as const,
      [SubcontractorType.ELECTRICAL]: 'electricalId' as const,
    }
    
    handleSubcontractorChange(fieldMap[newSubcontractor.type], newSubcontractor.id)

    // Reset form
    setNewSubcontractorForm(emptyNewSubcontractorForm)
    setNewSubcontractorDialogOpen(false)
    setSelectedSubcontractorType(null)
  }

  const subcontractorSections = [
    {
      key: 'constructionId' as const,
      type: SubcontractorType.CONSTRUCTION,
      title: 'Yapı İşleri Taşeronu',
      description: 'İnşaat, betonarme ve yapısal işlerden sorumlu taşeron',
      icon: Building,
      color: 'text-orange-600'
    },
    {
      key: 'mechanicalId' as const,
      type: SubcontractorType.MECHANICAL,
      title: 'Mekanik İşleri Taşeronu',
      description: 'HVAC, tesisat ve mekanik sistemlerden sorumlu taşeron',
      icon: Users,
      color: 'text-green-600'
    },
    {
      key: 'electricalId' as const,
      type: SubcontractorType.ELECTRICAL,
      title: 'Elektrik İşleri Taşeronu',
      description: 'Elektrik sistemi ve enerji altyapısından sorumlu taşeron',
      icon: Users,
      color: 'text-blue-600'
    }
  ]

  const completedSelections = Object.values(formData.subcontractors).filter(Boolean).length
  const totalSelections = subcontractorSections.length

  const renderSubcontractorCard = (subcontractor: Subcontractor) => (
    <div className="border rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">
            {subcontractor.companyName}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {subcontractor.responsiblePerson}
          </p>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {subcontractor.phone}
            </div>
            {subcontractor.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {subcontractor.email}
              </div>
            )}
          </div>
          
          {subcontractor.address && (
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <MapPin className="w-3 h-3" />
              {subcontractor.address}
            </div>
          )}
        </div>
        
        <div className="text-right">
          {subcontractor.averageRating && subcontractor.averageRating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              {subcontractor.averageRating.toFixed(1)}
            </div>
          )}
          {subcontractor.completedProjects && (
            <p className="text-xs text-slate-500 mt-1">
              {subcontractor.completedProjects} proje
            </p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Taşeron Seçimi</CardTitle>
          <CardDescription>
            Her iş türü için bir taşeron seçin. Mevcut listeden seçebilir veya yeni taşeron ekleyebilirsiniz.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8">
          <div className="space-y-8">
            {subcontractorSections.map((section) => {
              const selectedId = formData.subcontractors[section.key]
              const selectedSubcontractor = selectedId ? findSubcontractorById(selectedId) : null
              const availableSubcontractors = getSubcontractorsByType(section.type)
              const Icon = section.icon
              
              return (
                <Card key={section.key} className="border-l-4 border-l-slate-300 dark:border-l-slate-600">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-12 gap-4 items-start">
                      <div className={`w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${section.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <div className="col-span-5">
                        <Label className="text-base font-medium">
                          {section.title} *
                        </Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {section.description}
                        </p>
                      </div>
                      
                      <div className="col-span-6 flex flex-col">
                        <div className="flex-1 flex items-end">
                          <SubcontractorSelector
                            type={section.type}
                            value={selectedId || ''}
                            onChange={(value) => handleSubcontractorChange(section.key, value || null)}
                            onNewSubcontractor={() => openAddSubcontractorDialog(section.type)}
                            subcontractorList={subcontractorList}
                            placeholder={`${getSubcontractorTypeLabel(section.type)} seçmek için yazmaya başlayın...`}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Yeni Taşeron Ekleme Dialog */}
      <Dialog open={newSubcontractorDialogOpen} onOpenChange={setNewSubcontractorDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader className="px-0">
            <DialogTitle>
              Yeni {selectedSubcontractorType && getSubcontractorTypeLabel(selectedSubcontractorType)} Taşeronu Ekle
            </DialogTitle>
            <DialogDescription>
              Yeni taşeron bilgilerini girin. Kaydedildikten sonra otomatik olarak seçili hale gelecek.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-6">
            <div>
              <Label htmlFor="companyName">Firma Adı *</Label>
              <Input
                id="companyName"
                value={newSubcontractorForm.companyName}
                onChange={(e) => setNewSubcontractorForm(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Örn: Özkan İnşaat Ltd. Şti."
              />
            </div>

            <div>
              <Label htmlFor="responsiblePerson">Yetkili Kişi *</Label>
              <Input
                id="responsiblePerson"
                value={newSubcontractorForm.responsiblePerson}
                onChange={(e) => setNewSubcontractorForm(prev => ({ ...prev, responsiblePerson: e.target.value }))}
                placeholder="Örn: Mehmet Özkan"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefon *</Label>
                <Input
                  id="phone"
                  value={newSubcontractorForm.phone}
                  onChange={(e) => setNewSubcontractorForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="0532-123-4567"
                />
              </div>

              <div>
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={newSubcontractorForm.email}
                  onChange={(e) => setNewSubcontractorForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="mehmet@firma.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Adres</Label>
              <Input
                id="address"
                value={newSubcontractorForm.address}
                onChange={(e) => setNewSubcontractorForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="İş adresi"
              />
            </div>
          </div>

          <DialogFooter className="pt-6">
            <button
              type="button"
              onClick={() => setNewSubcontractorDialogOpen(false)}
              className="px-4 py-2 border border-input bg-background rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleAddNewSubcontractor}
              disabled={!newSubcontractorForm.companyName || !newSubcontractorForm.responsiblePerson || !newSubcontractorForm.phone}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kaydet ve Kullan
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Durum Mesajları */}
      {completedSelections > 0 && completedSelections < totalSelections && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">!</span>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Devam edebilmek için tüm taşeron türleri seçilmelidir. 
                Eksik: {totalSelections - completedSelections} taşeron
              </p>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
'use client'

import * as React from 'react'
import {
  Plus,
  FolderTree,
  Construction,
  Sparkles,
  Copy,
  CheckCircle,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DivisionTemplate,
  TemplateFormData,
  ProjectData,
} from './template-types'
import { mockProjects } from './template-data'

interface CreateTemplateModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  templateForm: TemplateFormData
  onTemplateFormChange: (form: TemplateFormData) => void
  onSubmit: () => void
}

export function CreateTemplateModal({
  isOpen,
  onOpenChange,
  templateForm,
  onTemplateFormChange,
  onSubmit,
}: CreateTemplateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="size-5 gradient-primary rounded-sm flex items-center justify-center">
              <Plus className="size-3 text-white" />
            </div>
            Yeni Şablon Oluştur
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            🎯 İnşaat projelerinizin temelini atın! 🏗️ Akllı şablonlarla
            işlerinizi hızlandırın.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-3 mt-2">
          <div className="space-y-2">
            <Label htmlFor="template-name">Şablon Adı</Label>
            <Input
              id="template-name"
              placeholder="örn: 5 Katlı Konut Binası"
              value={templateForm.name}
              onChange={e =>
                onTemplateFormChange({ ...templateForm, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-description">Açıklama</Label>
            <Textarea
              id="template-description"
              placeholder="Bu şablonun hangi tip projeler için kullanılacağını açıklayın..."
              value={templateForm.description}
              onChange={e =>
                onTemplateFormChange({
                  ...templateForm,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-category">Proje Kategorisi</Label>
            <select
              id="template-category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={templateForm.category}
              onChange={e =>
                onTemplateFormChange({
                  ...templateForm,
                  category: e.target.value as any,
                })
              }
            >
              <option value="residential">
                🏠 Konut İnşaatı - Ev, apart, site projeleri
              </option>
              <option value="commercial">
                🏢 Ticari Yapı - Ofis, mağaza, plaza inşaatı
              </option>
              <option value="infrastructure">
                🌉 Altyapı Projesi - Yol, köprü, tünel işleri
              </option>
              <option value="renovation">
                🔨 Tadilat/Renovasyon - Yenileme ve restorasyon
              </option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button
            onClick={onSubmit}
            className="gradient-primary text-white hover:shadow-lg group"
          >
            <Construction className="size-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
            <span className="group-hover:tracking-wide transition-all duration-200">
              Oluştur ve Düzenle
            </span>
            <Sparkles className="size-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ApplyToProjectModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedTemplate: DivisionTemplate | null
  onConfirmApply: (projectId: string) => void
}

export function ApplyToProjectModal({
  isOpen,
  onOpenChange,
  selectedTemplate,
  onConfirmApply,
}: ApplyToProjectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={open => onOpenChange(open)}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="size-5 bg-gradient-to-r from-green-500 to-green-600 rounded-sm flex items-center justify-center">
              <FolderTree className="size-3 text-white" />
            </div>
            Şablonu Projeye Uygula
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            Bu şablonu hangi projeye uygulamak istiyorsunuz?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-64 overflow-y-auto px-3 mt-2">
          {mockProjects.map(project => (
            <div
              key={project.id}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-colors cursor-pointer group"
              onClick={() => onConfirmApply(project.id)}
            >
              <div className="flex-1">
                <h4 className="font-semibold text-sm group-hover:text-green-700">
                  {project.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  Durum:{' '}
                  {project.status === 'active'
                    ? '🔨 Aktif'
                    : project.status === 'pending'
                      ? '📋 Planlama'
                      : '✅ Tamamlandı'}{' '}
                  • İlerleme: {project.progress}%
                </p>
              </div>
              <div className="size-8 bg-green-100 group-hover:bg-green-200 rounded-full flex items-center justify-center transition-colors">
                <span className="text-green-600 text-lg">→</span>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DuplicateTemplateModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  template: DivisionTemplate | null
  onConfirm: (newName: string) => void
}

export function DuplicateTemplateModal({
  isOpen,
  onOpenChange,
  template,
  onConfirm,
}: DuplicateTemplateModalProps) {
  const [newName, setNewName] = React.useState('')

  React.useEffect(() => {
    if (template && isOpen) {
      setNewName(`${template.name} (Kopya)`)
    }
  }, [template, isOpen])

  const handleConfirm = () => {
    if (newName.trim()) {
      onConfirm(newName.trim())
      onOpenChange(false)
    }
  }

  const duplicateMessages = [
    '🎯 Mükemmel seçim! Kanıtlanmış şablonu klonlıyorsunuz!',
    '⚡ Hızlı çözüm! Deneyimli şablonun kopyasını oluşturuyorsunuz!',
    '🚀 Akıllıca! Başarılı şablonu çoğaltıyorsunuz!',
    '💎 Değerli şablonu güvenli şekilde kopyalıyorsunuz!',
  ]

  const randomMessage =
    duplicateMessages[Math.floor(Math.random() * duplicateMessages.length)]

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="size-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-sm flex items-center justify-center">
              <Copy className="size-3 text-white" />
            </div>
            Şablonu Kopyala
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            {randomMessage}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-3 mt-2">
          <div className="space-y-2">
            <Label htmlFor="duplicate-name">Yeni Şablon Adı</Label>
            <Input
              id="duplicate-name"
              placeholder="Şablon adı girin..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
          </div>

          {template && (
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">
                Kopyalanacak Şablon:
              </div>
              <div className="font-medium text-sm">{template.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {template.divisions.length} ana bölüm • {template.usageCount}{' '}
                kez kullanıldı
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button
            onClick={handleConfirm}
            className="gradient-primary text-white hover:shadow-lg group"
          >
            <Copy className="size-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
            <span className="group-hover:tracking-wide transition-all duration-200">
              Kopyala
            </span>
            <CheckCircle className="size-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteTemplateModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  template: DivisionTemplate | null
  onConfirm: () => void
}

export function DeleteTemplateModal({
  isOpen,
  onOpenChange,
  template,
  onConfirm,
}: DeleteTemplateModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const deleteMessages = [
    '⚠️ Dikkat! Bu şablonu tamamen siliyorsunuz!',
    '🗑️ Bu şablon kalıcı olarak silinecek!',
    '❌ Silme işlemi geri alınamaz!',
    '💥 Şablon verisi tamamen kaybolacak!',
  ]

  const randomMessage =
    deleteMessages[Math.floor(Math.random() * deleteMessages.length)]

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="size-5 bg-gradient-to-r from-red-500 to-red-600 rounded-sm flex items-center justify-center">
              <AlertTriangle className="size-3 text-white" />
            </div>
            Şablonu Sil
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            {randomMessage}
          </DialogDescription>
        </DialogHeader>

        {template && (
          <div className="bg-red-50/50 border border-red-200/50 p-3 rounded-lg mx-3 mt-2">
            <div className="text-xs text-red-600/70 mb-1">
              Silinecek Şablon:
            </div>
            <div className="font-medium text-sm text-red-800">
              {template.name}
            </div>
            <div className="text-xs text-red-600/70 mt-1">
              {template.divisions.length} ana bölüm • {template.usageCount} kez
              kullanıldı
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button
            onClick={handleConfirm}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white hover:shadow-lg group"
          >
            <Trash2 className="size-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
            <span className="group-hover:tracking-wide transition-all duration-200">
              Kalıcı Olarak Sil
            </span>
            <AlertTriangle className="size-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

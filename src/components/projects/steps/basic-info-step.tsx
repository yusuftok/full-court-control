'use client'

import { Building2, MapPin, Calendar, Banknote, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ProjectFormData } from '../types/project-types'

interface BasicInfoStepProps {
  formData: ProjectFormData
  updateFormData: (updates: Partial<ProjectFormData>) => void
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  updateFormData,
}) => {
  const handleInputChange = (
    field: keyof ProjectFormData,
    value: string | number
  ) => {
    updateFormData({ [field]: value })
  }

  // Bugünün tarihini varsayılan başlangıç tarihi olarak ayarla
  const today = new Date().toISOString().split('T')[0]

  // 6 ay sonrasını varsayılan bitiş tarihi olarak ayarla
  const sixMonthsLater = new Date()
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6)
  const defaultEndDate = sixMonthsLater.toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <CardTitle>Proje Bilgileri</CardTitle>
          </div>
          <CardDescription>
            Projenin temel bilgilerini girin. Bu bilgiler projenin kimliğini
            oluşturacak.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-8">
          {/* Proje Adı */}
          <div>
            <Label htmlFor="project-name" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Proje Adı *
            </Label>
            <Input
              id="project-name"
              placeholder="Örn: Şehir Merkezi Ofis Kompleksi"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              className="mt-1"
            />
            {!formData.name && (
              <p className="text-sm text-slate-500 mt-1">
                Projenizi tanımlayıcı net bir isim verin
              </p>
            )}
          </div>

          {/* Lokasyon */}
          <div>
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Lokasyon *
            </Label>
            <Input
              id="location"
              placeholder="Projenin gerçekleştirileceği şehir ve ilçe bilgisi - Örn: Ataşehir, İstanbul"
              value={formData.location}
              onChange={e => handleInputChange('location', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Tarih Aralığı */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Başlangıç Tarihi *
              </Label>
              <Input
                id="start-date"
                type="date"
                value={formData.startDate || today}
                onChange={e => handleInputChange('startDate', e.target.value)}
                className="mt-1"
                min={today}
              />
            </div>

            <div>
              <Label htmlFor="end-date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Bitiş Tarihi *
              </Label>
              <Input
                id="end-date"
                type="date"
                value={formData.endDate || defaultEndDate}
                onChange={e => handleInputChange('endDate', e.target.value)}
                className="mt-1"
                min={formData.startDate || today}
              />
            </div>
          </div>

          {/* Süre Hesaplaması */}
          {formData.startDate && formData.endDate && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                📅 Proje Süresi:{' '}
                <span className="font-medium">
                  {Math.ceil(
                    (new Date(formData.endDate).getTime() -
                      new Date(formData.startDate).getTime()) /
                      (1000 * 3600 * 24)
                  )}{' '}
                  gün
                </span>
              </p>
            </div>
          )}

          {/* Bütçe */}
          <div>
            <Label htmlFor="budget" className="flex items-center gap-2">
              <Banknote className="w-4 h-4" />
              Toplam Bütçe (TL) *
            </Label>
            <Input
              id="budget"
              type="number"
              placeholder="2500000"
              value={formData.budget || ''}
              onChange={e =>
                handleInputChange('budget', parseFloat(e.target.value) || 0)
              }
              className="mt-1"
              min="0"
              step="10000"
            />
            {formData.budget > 0 && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                }).format(formData.budget)}
              </p>
            )}
            {!formData.budget && (
              <p className="text-sm text-slate-500 mt-1">
                Projenin tahmini toplam maliyeti
              </p>
            )}
          </div>

          {/* Açıklama */}
          <div>
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Proje Açıklaması
            </Label>
            <Textarea
              id="description"
              placeholder="Proje hakkında detaylar, özel notlar veya gereklilikler..."
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

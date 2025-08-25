'use client'

import { Users, Crown, Hammer, Wrench, Zap } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ProjectFormData } from '../types/project-types'
import { EngineerSelector } from '../engineer-selector'

interface MainContractorTeamStepProps {
  formData: ProjectFormData
  updateFormData: (updates: Partial<ProjectFormData>) => void
}

export const MainContractorTeamStep: React.FC<MainContractorTeamStepProps> = ({
  formData,
  updateFormData,
}) => {
  const handleTeamMemberChange = (
    role: keyof ProjectFormData['mainContractorTeam'],
    value: string
  ) => {
    updateFormData({
      mainContractorTeam: {
        ...formData.mainContractorTeam,
        [role]: value,
      },
    })
  }

  const teamRoles = [
    {
      key: 'chiefEngineer' as const,
      title: 'Ana Yüklenici Sorumlu Şef Mühendis',
      description: 'Projenin genel teknik sorumlusu ve koordinatörü',
      icon: Crown,
      placeholder: 'Şef Mühendis seçmek için yazmaya başlayın...',
      color: 'text-purple-600',
      roleType: 'chief',
    },
    {
      key: 'civilEngineer' as const,
      title: 'Ana Yüklenici Sorumlu İnşaat Mühendisi',
      description: 'Yapısal tasarım ve inşaat işlerinden sorumlu',
      icon: Hammer,
      placeholder: 'İnşaat Mühendisi seçmek için yazmaya başlayın...',
      color: 'text-orange-600',
      roleType: 'civil',
    },
    {
      key: 'mechanicalEngineer' as const,
      title: 'Ana Yüklenici Sorumlu Makine Mühendisi',
      description: 'HVAC, tesisat ve mekanik sistemlerden sorumlu',
      icon: Wrench,
      placeholder: 'Makine Mühendisi seçmek için yazmaya başlayın...',
      color: 'text-green-600',
      roleType: 'mechanical',
    },
    {
      key: 'electricalEngineer' as const,
      title: 'Ana Yüklenici Sorumlu Elektrik Mühendisi',
      description: 'Elektrik sistemi ve enerji altyapısından sorumlu',
      icon: Zap,
      placeholder: 'Elektrik Mühendisi seçmek için yazmaya başlayın...',
      color: 'text-blue-600',
      roleType: 'electrical',
    },
  ]

  const completedRoles = Object.values(formData.mainContractorTeam).filter(
    Boolean
  ).length
  const totalRoles = teamRoles.length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mühendis Atamaları</CardTitle>
          <CardDescription>
            Projenin ana yüklenici ekibindeki sorumlu mühendisleri atayın. Her
            disiplin için bir sorumlu mühendis gereklidir.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6">
            {teamRoles.map(role => {
              const isCompleted = !!formData.mainContractorTeam[role.key]
              const Icon = role.icon

              return (
                <Card
                  key={role.key}
                  className={`transition-all duration-200 ${
                    isCompleted
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'hover:shadow-md'
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-12 gap-4 items-start">
                      <div
                        className={`w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${role.color}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="col-span-5">
                        <Label
                          htmlFor={role.key}
                          className="text-base font-medium"
                        >
                          {role.title} *
                        </Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {role.description}
                        </p>
                      </div>

                      <div className="col-span-6 flex flex-col">
                        <div className="flex-1 flex items-end">
                          <EngineerSelector
                            role={role.roleType}
                            value={formData.mainContractorTeam[role.key]}
                            onChange={value =>
                              handleTeamMemberChange(role.key, value)
                            }
                            placeholder={role.placeholder}
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

      {/* Validasyon Mesajları */}
      {completedRoles > 0 && completedRoles < totalRoles && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">!</span>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Devam edebilmek için tüm mühendis pozisyonları atanmalıdır.
                Eksik: {totalRoles - completedRoles} pozisyon
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {completedRoles === totalRoles && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">✓</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Harika! Ana yüklenici ekibi tamamlandı. Sonraki adımda
                taşeronları seçebilirsiniz.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

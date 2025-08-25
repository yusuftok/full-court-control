'use client'

import * as React from 'react'
import { useState } from 'react'
import { ArrowLeft, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  PageContainer,
  PageHeader,
  PageContent,
} from '@/components/layout/page-container'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import {
  CreateProjectStep,
  ProjectFormData,
  ProjectStatus,
  ProjectCategory,
  Project,
} from '@/components/projects/types/project-types'

// Step components
import { BasicInfoStep } from '@/components/projects/steps/basic-info-step'
import { MainContractorTeamStep } from '@/components/projects/steps/main-contractor-team-step'
import { SubcontractorManagementStep } from '@/components/projects/steps/subcontractor-management-step'
import { TemplateSelectionStep } from '@/components/projects/steps/template-selection-step'
import { ModificationChoiceDropdown } from '@/components/projects/modification-choice-dropdown'
import { DivisionSetupStep } from '@/components/projects/steps/division-setup-step'
import { PreviewStep } from '@/components/projects/steps/preview-step'
import { HorizontalStepIndicator } from '@/components/projects/horizontal-step-indicator'

const stepConfig = [
  {
    id: CreateProjectStep.BASIC_INFO,
    title: 'Temel Bilgiler',
    description: 'Proje adı ve lokasyon',
    component: BasicInfoStep,
  },
  {
    id: CreateProjectStep.MAIN_CONTRACTOR_TEAM,
    title: 'Ana Yüklenici Ekibi',
    description: 'Mühendis atamaları',
    component: MainContractorTeamStep,
  },
  {
    id: CreateProjectStep.SUBCONTRACTOR_MANAGEMENT,
    title: 'Taşeron Yönetimi',
    description: 'Alt yükleniciler',
    component: SubcontractorManagementStep,
  },
  {
    id: CreateProjectStep.TEMPLATE_SELECTION,
    title: 'Şablon Seçimi',
    description: 'Proje tipi ve şablon',
    component: TemplateSelectionStep,
  },
  {
    id: CreateProjectStep.DIVISION_SETUP,
    title: 'Bölüm Yapısı',
    description: 'Division düzenlemesi',
    component: DivisionSetupStep,
  },
  {
    id: CreateProjectStep.PREVIEW,
    title: 'Önizleme',
    description: 'Son kontrol ve onay',
    component: PreviewStep,
  },
]

export default function CreateProjectPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<CreateProjectStep>(
    CreateProjectStep.BASIC_INFO
  )
  const [templateStepValid, setTemplateStepValid] = useState(true)
  const [templateHasModifications, setTemplateHasModifications] =
    useState(false)
  const [templateModificationChoice, setTemplateModificationChoice] = useState<
    'update' | 'save-new' | 'project-only' | null
  >(null)

  // Default dates
  const getDefaultDates = () => {
    const today = new Date().toISOString().split('T')[0]
    const sixMonthsLater = new Date()
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6)
    const defaultEndDate = sixMonthsLater.toISOString().split('T')[0]
    return { startDate: today, endDate: defaultEndDate }
  }

  const [formData, setFormData] = useState<ProjectFormData>(() => {
    const defaultDates = getDefaultDates()
    return {
      name: '',
      location: '',
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
      budget: 0,
      description: '',
      mainContractorTeam: {
        chiefEngineer: '',
        civilEngineer: '',
        mechanicalEngineer: '',
        electricalEngineer: '',
      },
      subcontractors: {
        constructionId: null,
        mechanicalId: null,
        electricalId: null,
      },
      category: ProjectCategory.RESIDENTIAL,
      templateId: null,
      divisions: [],
    }
  })

  const updateFormData = (updates: Partial<ProjectFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case CreateProjectStep.BASIC_INFO:
        return !!(
          formData.name &&
          formData.location &&
          formData.startDate &&
          formData.endDate &&
          formData.budget > 0
        )

      case CreateProjectStep.MAIN_CONTRACTOR_TEAM:
        return !!(
          formData.mainContractorTeam.chiefEngineer &&
          formData.mainContractorTeam.civilEngineer &&
          formData.mainContractorTeam.mechanicalEngineer &&
          formData.mainContractorTeam.electricalEngineer
        )

      case CreateProjectStep.SUBCONTRACTOR_MANAGEMENT:
        return !!(
          formData.subcontractors.constructionId &&
          formData.subcontractors.mechanicalId &&
          formData.subcontractors.electricalId
        )

      case CreateProjectStep.TEMPLATE_SELECTION:
        // Template step is valid if step itself is valid AND no pending modification choice needed
        return (
          templateStepValid &&
          (!templateHasModifications || templateModificationChoice !== null)
        )

      case CreateProjectStep.DIVISION_SETUP:
        return formData.divisions.length > 0

      case CreateProjectStep.PREVIEW:
        return true

      default:
        return false
    }
  }

  const canGoBack = (): boolean => {
    return currentStep > CreateProjectStep.BASIC_INFO
  }

  const handleNext = () => {
    if (canGoNext() && currentStep < CreateProjectStep.PREVIEW) {
      setCurrentStep(current => current + 1)
    }
  }

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep) {
      setCurrentStep(stepId)
    }
  }

  const handleBack = () => {
    if (canGoBack()) {
      setCurrentStep(current => current - 1)
    }
  }

  const handleCreateProject = () => {
    // Generate new project from form data
    const newProject: Project = {
      ...formData,
      id: `project-${Date.now()}`,
      status: ProjectStatus.ACTIVE,
      progress: 0,
      totalTasks: formData.divisions.reduce((total, div) => {
        return total + 1 + (div.children ? div.children.length : 0)
      }, 0),
      completedTasks: 0,
      healthStatus: 'healthy',
      riskLevel: 'low',
      qualityScore: 4.0,
      manager: formData.mainContractorTeam.chiefEngineer,
      budgetSpent: 0,
      daysRemaining:
        formData.startDate && formData.endDate
          ? Math.ceil(
              (new Date(formData.endDate).getTime() - new Date().getTime()) /
                (1000 * 3600 * 24)
            )
          : 0,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In real app, would save to database here
    console.log('Creating project:', newProject)

    // Show success message and redirect
    alert(
      `✅ "${formData.name}" projesi başarıyla oluşturuldu!\n\n🎯 ${formData.divisions.length} ana bölüm\n👥 Tam ekip atandı\n📅 ${Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 3600 * 24))} günlük süre`
    )
    router.push('/projects')
  }

  const getProgressPercentage = (): number => {
    return Math.round(((currentStep + 1) / stepConfig.length) * 100)
  }

  const getCurrentStepConfig = () => {
    return stepConfig.find(step => step.id === currentStep)
  }

  const CurrentStepComponent =
    getCurrentStepConfig()?.component || BasicInfoStep

  const breadcrumbItems = [
    { label: 'Projeler', href: '/projects' },
    { label: 'Yeni Proje Oluştur', href: '/projects/new' },
  ]

  return (
    <PageContainer>
      <PageContent className="p-4">
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />

        <div className="mb-3">
          <PageHeader
            title="Yeni Proje Oluştur 🏗️"
            description="Adım adım proje bilgilerini girin ve ekip atamasını tamamlayın."
            className="pb-1 mb-1"
          />
        </div>

        {/* Horizontal Step Navigation */}
        <HorizontalStepIndicator
          steps={stepConfig}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        {/* Ana İçerik - Current Step */}
        <div className="mb-16">
          <div className="glass rounded-xl border border-white/10 overflow-visible">
            {/* Step Content */}
            <div className="p-5">
              <CurrentStepComponent
                formData={formData}
                updateFormData={updateFormData}
                {...(currentStep === CreateProjectStep.TEMPLATE_SELECTION && {
                  onStepValidityChange: setTemplateStepValid,
                  onModificationStateChange: (
                    hasModifications: boolean,
                    modificationChoice: string | null
                  ) => {
                    console.log('Template modification state changed:', {
                      hasModifications,
                      modificationChoice,
                    })
                    setTemplateHasModifications(hasModifications)
                    // Only update modificationChoice if it's a valid choice, ignore null from template step
                    if (
                      modificationChoice === 'update' ||
                      modificationChoice === 'save-new' ||
                      modificationChoice === 'project-only'
                    ) {
                      setTemplateModificationChoice(modificationChoice)
                    }
                  },
                })}
              />
            </div>
          </div>
        </div>
      </PageContent>

      {/* Fixed Navigation Footer - Always at bottom of viewport */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-white/10 z-40">
        <div className="px-6 py-3">
          {/* Navigation buttons - full width */}
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={!canGoBack()}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Geri
              </Button>

              {/* Template Modification Choice - Inline */}
              {currentStep === CreateProjectStep.TEMPLATE_SELECTION &&
                templateHasModifications &&
                formData.templateId && (
                  <div className="flex-1 max-w-sm mx-4">
                    <ModificationChoiceDropdown
                      value={templateModificationChoice}
                      onChange={choice => {
                        console.log('Modification choice selected:', choice)
                        setTemplateModificationChoice(choice)
                      }}
                      className="w-full"
                    />
                  </div>
                )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/projects')}
                >
                  İptal
                </Button>

                {currentStep === CreateProjectStep.PREVIEW ? (
                  <Button
                    onClick={handleCreateProject}
                    className="bg-green-600 hover:bg-green-700 gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Projeyi Oluştur
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canGoNext()}
                    className="gap-2"
                  >
                    İleri
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

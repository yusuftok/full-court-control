import * as React from "react"
import { Banknote, Star, Clock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgress } from "@/components/ui/circular-progress"
import { StatusBadge } from "@/components/data/data-table"

// Project interface
export interface Project {
  id: string
  name: string
  status: "active" | "inactive" | "pending" | "completed" | "cancelled"
  startDate: string
  endDate?: string
  progress: number
  subcontractors: number
  totalTasks: number
  completedTasks: number
  location: string
  budget: number
  manager: string
  budgetSpent: number
  daysRemaining?: number
  riskLevel: "low" | "medium" | "high"
  qualityScore: number
  healthStatus: "healthy" | "warning" | "critical"
}

// Health indicator component
function HealthIndicator({ project }: { project: Project }) {
  const getHealthColor = (status: Project['healthStatus']) => {
    switch (status) {
      case 'healthy': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'critical': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getHealthIcon = (status: Project['healthStatus']) => {
    switch (status) {
      case 'healthy': return '🟢'
      case 'warning': return '🟡'
      case 'critical': return '🔴'
      default: return '⚪'
    }
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm">{getHealthIcon(project.healthStatus)}</span>
      <span className={cn("text-xs font-medium", getHealthColor(project.healthStatus))}>
        {project.healthStatus === 'healthy' ? 'Sağlıklı' :
         project.healthStatus === 'warning' ? 'Dikkat' : 'Kritik'}
      </span>
    </div>
  )
}

// Quality stars component
function QualityStars({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "size-3 transition-all duration-300 hover:scale-125",
            star <= score ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          )}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">
        {score.toFixed(1)}/5
      </span>
    </div>
  )
}


// Main project card component
interface ProjectCardProps {
  project: Project
  onClick: (project: Project) => void
  index?: number
  className?: string
}

export function ProjectCard({ project, onClick, index = 0, className }: ProjectCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer floating-card group scale-smooth container-responsive h-[520px] flex flex-col",
        // Semantic border colors
        project.healthStatus === "healthy" && "border-l-4 border-l-green-400",
        project.healthStatus === "warning" && "border-l-4 border-l-yellow-400", 
        project.healthStatus === "critical" && "border-l-4 border-l-red-400",
        className
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onClick(project)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-heading-md text-high-contrast group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {project.name}
            </CardTitle>
            <div className="text-body-sm text-medium-contrast flex items-center gap-1 truncate mb-2">
              📍 {project.location} • <StatusBadge status={project.status} /> • <HealthIndicator project={project} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-body-sm text-medium-contrast">👷 {project.manager} • {project.subcontractors} Alt Yüklenici</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col h-full">
        {/* Content area - grows to fill available space */}
        <div className="space-y-4 flex-1">
          {/* Modern Single Progress Display */}
          <div className="flex items-center gap-4">
            <CircularProgress 
              percentage={project.progress}
              size={56}
              strokeWidth={4}
              color={
                project.progress >= 100 ? "rgb(16 185 129)" :
                project.progress >= 75 ? "rgb(59 130 246)" :
                project.progress >= 50 ? "rgb(245 158 11)" :
                "rgb(107 114 128)"
              }
              showText={true}
              animate={true}
            />
            <div className="flex-1">
              <div className="text-body-sm text-medium-contrast mb-1">Proje İlerlemesi</div>
              <div className="text-heading-sm text-high-contrast mb-2">
                {project.progress >= 100 ? "Tamamlandı! 🎉" :
                 project.progress >= 75 ? "Son sprint 🏃‍♂️" :
                 project.progress >= 60 ? "İyi mesafe alındı 📈" :
                 project.progress >= 40 ? "Yolu yarıladı 🚀" :
                 project.progress >= 20 ? "İyi başlangıç 👍" : "Henüz başlarda 🔥"}
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out relative"
                  style={{ 
                    width: `${project.progress}%`,
                    background: project.progress >= 100 ? 'linear-gradient(90deg, #10b981, #34d399)' :
                               project.progress >= 75 ? 'linear-gradient(90deg, #3b82f6, #60a5fa)' :
                               project.progress >= 50 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' :
                               'linear-gradient(90deg, #6b7280, #9ca3af)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Clean Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className={cn(
              "rounded-xl p-3 border transition-all duration-300 hover:scale-[1.02] cursor-pointer",
              project.budgetSpent > 90 ? "budget-over-limit" :
              project.budgetSpent > 75 ? "budget-approaching-limit" : "budget-healthy"
            )}
            onClick={() => alert(`💰 Bütçe Detayları\n\nToplam: ₺${(project.budget/1000).toFixed(0)}K\nKullanılan: ${project.budgetSpent}%\nKalan: ₺${((project.budget * (100-project.budgetSpent))/100000).toFixed(0)}K`)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-caption">Bütçe Kullanımı</span>
                <Banknote className="size-4 opacity-60" />
              </div>
              <div className="text-heading-md">{project.budgetSpent}%</div>
            </div>

            <div className={cn(
              "rounded-xl p-3 border transition-all duration-300 hover:scale-[1.02] cursor-pointer",
              project.daysRemaining && project.daysRemaining < 15 ? "schedule-delayed" :
              project.daysRemaining && project.daysRemaining < 30 ? "schedule-at-risk" : "schedule-on-track"
            )}
            onClick={() => alert(`⏰ Zaman Çizelgesi\n\nKalan: ${project.daysRemaining ? `${project.daysRemaining} gün` : 'Tamamlandı'}\nBaşlangıç: ${new Date(project.startDate).toLocaleDateString('tr-TR')}`)}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-caption">Kalan Süre</span>
                <Clock className="size-4 opacity-60" />
              </div>
              <div className="text-heading-md">
                {project.daysRemaining ? `${project.daysRemaining}g` : 'Tamam'}
              </div>
            </div>

            <div className={cn(
              "rounded-xl p-3 border transition-all duration-300 hover:scale-[1.02] cursor-pointer",
              project.qualityScore >= 4.5 ? "quality-excellent" :
              project.qualityScore >= 3.5 ? "quality-good" :
              project.qualityScore >= 2.5 ? "quality-fair" : "quality-poor"
            )}
            onClick={() => alert(`⭐ Kalite Raporu\n\nMevcut Skor: ${project.qualityScore}/5\n\nDeğerlendirme Kriterleri:\n• İş kalitesi\n• Zamanında teslimat\n• Güvenlik standartları\n• Müşteri memnuniyeti`)}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-caption">Kalite Skoru</span>
                <Star className="size-4 opacity-60" />
              </div>
              <QualityStars score={project.qualityScore} />
            </div>

            <div className="rounded-xl p-3 border transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700 border-indigo-200/50 dark:from-indigo-950/30 dark:to-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/50"
            onClick={() => alert(`🔨 İş Detayları\n\nTamamlanan: ${project.completedTasks}\nToplam: ${project.totalTasks}\nKalan: ${project.totalTasks - project.completedTasks}\n\nTamamlanma: %${Math.round((project.completedTasks/project.totalTasks)*100)}`)}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-caption">Kalan İşler</span>
                <CheckCircle className="size-4 opacity-60" />
              </div>
              <div className="text-heading-md">
                {project.totalTasks - project.completedTasks}/{project.totalTasks}
              </div>
            </div>
          </div>
        </div>
        
        {/* Modern Action Button - Always at bottom */}
        <div className="relative mt-4">
          <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] group/btn relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
            
            <span className="relative flex items-center justify-center gap-2 transition-all">
              Projeyi Görüntüle
              <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
          
          {/* Floating action indicators */}
          {project.healthStatus === "critical" && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              🚨 Acil
            </div>
          )}
          {project.progress >= 100 && (
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
              ✅ Tamamlandı
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
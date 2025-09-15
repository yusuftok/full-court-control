'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CircularProgress } from '@/components/ui/circular-progress'
import { StatusBadge } from '@/components/data/data-table'
import { Badge } from '@/components/ui/badge'
import {
  PERFORMANCE_THRESHOLDS as T,
  levelFrom as levelFromCfg,
} from '@/lib/performance-thresholds'

// Project interface
export interface Project {
  id: string
  name: string
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled'
  startDate: string
  endDate?: string
  progress: number
  plannedProgress: number
  subcontractors: number
  totalTasks: number
  completedTasks: number
  location: string
  budget: number
  manager: string
  budgetSpent: number
  earnedValue: number
  actualCost: number
  plannedValue: number
  plannedBudgetToDate: number
  daysRemaining?: number
  totalPlannedDays?: number
  riskLevel: 'low' | 'medium' | 'high'
  qualityScore: number
  healthStatus: 'healthy' | 'warning' | 'critical'
}

// Performance levels type
type PerformanceLevel = 'İyi' | 'Riskli' | 'Kritik'

// Status-only badge for title area
function StatusOnlyBadge({
  value,
  kind = 'COMBINED' as const,
}: {
  value: number
  kind?: 'CPI' | 'SPI' | 'COMBINED'
}) {
  const getPerformanceLevel = (val: number): PerformanceLevel => {
    const lvl = levelFromCfg(val, kind)
    return lvl
  }

  const getPerformanceColor = (level: PerformanceLevel) => {
    switch (level) {
      case 'İyi':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Riskli':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'Kritik':
        return 'bg-red-100 text-red-700 border-red-200'
    }
  }

  const level = getPerformanceLevel(value)

  return (
    <Badge
      className={cn(
        'text-xs px-1.5 py-0.5 font-medium',
        getPerformanceColor(level)
      )}
    >
      {level}
    </Badge>
  )
}

// Performance badge component for CPI/SPI indicators
function PerformanceBadge({
  value,
  label,
}: {
  value: number
  label: string
  type?: 'budget' | 'schedule'
}) {
  const getPerformanceLevel = (val: number): PerformanceLevel => {
    // Default to SPI thresholds when kind is not specified (used rarely)
    const lvl = levelFromCfg(val, 'SPI')
    return lvl
  }

  const getPerformanceColor = (level: PerformanceLevel) => {
    switch (level) {
      case 'İyi':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Riskli':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'Kritik':
        return 'bg-red-100 text-red-700 border-red-200'
    }
  }

  const level = getPerformanceLevel(value)
  const formattedValue = value.toFixed(2)

  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{formattedValue}</span>
        <Badge
          variant="outline"
          className={cn(
            'text-xs px-1.5 py-0.5 font-medium',
            getPerformanceColor(level)
          )}
        >
          {level}
        </Badge>
      </div>
    </div>
  )
}

// Health indicator component based on combined CPI/SPI performance
function HealthIndicator({ project }: { project: Project }) {
  // Calculate combined performance: 60% CPI + 40% SPI
  const cpi =
    project.earnedValue > 0 ? project.earnedValue / project.actualCost : 0
  const spi =
    project.earnedValue > 0 ? project.earnedValue / project.plannedValue : 0
  const combinedPerformance = 0.6 * cpi + 0.4 * spi

  return <StatusOnlyBadge value={combinedPerformance} />
}

// Main project card component
interface ProjectCardProps {
  project: Project
  onClick?: (project: Project) => void
  href?: string
  index?: number
  className?: string
}

export function ProjectCard({
  project,
  onClick,
  href,
  index = 0,
  className,
}: ProjectCardProps) {
  // Calculate combined performance for border color: 60% CPI + 40% SPI
  const cpi =
    project.earnedValue > 0 ? project.earnedValue / project.actualCost : 0
  const spi =
    project.earnedValue > 0 ? project.earnedValue / project.plannedValue : 0
  const combinedPerformance = 0.6 * cpi + 0.4 * spi

  const getPerformanceTheme = (combined: number) => {
    if (combined >= T.COMBINED.good) {
      return {
        border: 'border-l-4 border-l-green-400',
        background: 'bg-gradient-to-br from-green-50/30 to-emerald-50/20',
        cardStyle: 'hover:shadow-green-200/50 hover:shadow-xl',
        textAccent: 'text-green-700',
        animation: 'hover:scale-[1.02] transition-all duration-300',
        progressGradient: 'linear-gradient(90deg, #10b981, #34d399)',
        buttonGradient: 'bg-gradient-to-r from-green-600 to-emerald-600',
      }
    }
    if (combined >= T.COMBINED.risky) {
      return {
        border: 'border-l-4 border-l-orange-400',
        background: 'bg-gradient-to-br from-orange-50/30 to-orange-100/20',
        cardStyle: 'hover:shadow-orange-200/50 hover:shadow-xl',
        textAccent: 'text-orange-700',
        animation: 'hover:scale-[1.01] transition-all duration-300',
        progressGradient: 'linear-gradient(90deg, #ea580c, #f97316)',
        buttonGradient: 'bg-gradient-to-r from-orange-600 to-orange-500',
      }
    }
    return {
      border: 'border-l-4 border-l-red-400',
      background: 'bg-gradient-to-br from-red-50/30 to-rose-50/20',
      cardStyle: 'hover:shadow-red-200/50 hover:shadow-lg',
      textAccent: 'text-red-700',
      animation: 'hover:scale-[1.005] transition-all duration-200',
      progressGradient: 'linear-gradient(90deg, #dc2626, #ef4444)',
      buttonGradient: 'bg-gradient-to-r from-red-600 to-rose-600',
    }
  }

  const theme = getPerformanceTheme(combinedPerformance)

  // Helper function for individual metric boxes
  const getMetricBoxTheme = (value: number, kind: 'CPI' | 'SPI') => {
    const thr = kind === 'SPI' ? T.SPI : T.CPI
    if (value >= thr.good) {
      return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/60 text-green-800'
    }
    if (value >= thr.risky) {
      return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200/60 text-orange-800'
    }
    return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200/60 text-red-800'
  }

  const card = (
    <Card
      className={cn(
        'cursor-pointer floating-card !px-0 group container-responsive h-[520px] flex flex-col',
        // Dynamic theming based on combined performance
        theme.border,
        theme.background,
        theme.cardStyle,
        theme.animation,
        className
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={onClick ? () => onClick(project) : undefined}
    >
      <CardHeader className="pb-2 px-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <CardTitle
                className={cn(
                  'text-heading-md text-high-contrast transition-colors line-clamp-2 flex-1',
                  `group-hover:${theme.textAccent}`
                )}
              >
                {project.name}
              </CardTitle>
              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                <StatusBadge status={project.status} />
                <HealthIndicator project={project} />
              </div>
            </div>
            <div className="text-body-sm text-medium-contrast flex items-center gap-1 truncate mb-2">
              📍 {project.location} • 📅{' '}
              {new Date(project.startDate).toLocaleDateString('tr-TR')}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-body-sm text-medium-contrast">
                👷 {project.manager} • {project.subcontractors} Alt Yüklenici
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-full px-2">
        {/* Content area - grows to fill available space */}
        <div className="space-y-4 flex-1">
          {/* Enhanced Progress Display */}
          <div className="flex items-center gap-4">
            <CircularProgress
              percentage={project.progress}
              size={56}
              strokeWidth={4}
              color={
                project.progress >= 100
                  ? 'rgb(16 185 129)'
                  : project.progress >= 75
                    ? 'rgb(59 130 246)'
                    : project.progress >= 50
                      ? 'rgb(245 158 11)'
                      : 'rgb(107 114 128)'
              }
              showText={true}
              animate={true}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>
                  Plan: {project.plannedProgress}% → Gerçek: {project.progress}%
                </span>
                <span>
                  Kalan: {project.totalTasks - project.completedTasks}/
                  {project.totalTasks}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out relative"
                  style={{
                    width: `${project.progress}%`,
                    background:
                      project.progress >= 100
                        ? 'linear-gradient(90deg, #10b981, #34d399)'
                        : theme.progressGradient,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                'rounded-xl p-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer space-y-1.5 flex flex-col',
                getMetricBoxTheme(
                  project.earnedValue > 0
                    ? project.earnedValue / project.actualCost
                    : 0,
                  'CPI'
                )
              )}
              // Alerts removed as requested
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-caption">Bütçe Performansı</span>
                <StatusOnlyBadge
                  value={
                    project.earnedValue > 0
                      ? project.earnedValue / project.actualCost
                      : 0
                  }
                  kind="CPI"
                />
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">CPI</div>
                  <div className="text-lg font-bold">
                    {project.earnedValue > 0
                      ? (project.earnedValue / project.actualCost).toFixed(2)
                      : '0.00'}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="space-y-2 text-sm text-muted-foreground flex-1">
                  <div className="flex justify-between">
                    <span>Harcanan:</span>
                    <span className="font-semibold">
                      ₺{(project.actualCost / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Elde Edilen:</span>
                    <span className="font-semibold">
                      ₺{(project.earnedValue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Toplam Bütçe:</span>
                    <span className="font-bold text-base">
                      ₺{(project.budget / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm border-t border-dashed border-gray-300 dark:border-gray-600 pt-2 mt-2">
                  <span className="text-amber-600 dark:text-amber-400">
                    Böyle Giderse:
                  </span>
                  <span className="font-semibold text-amber-700 dark:text-amber-300">
                    ₺
                    {(() => {
                      const cpi =
                        project.earnedValue > 0
                          ? project.earnedValue / project.actualCost
                          : 1
                      const spi =
                        project.earnedValue > 0
                          ? project.earnedValue / project.plannedValue
                          : 1
                      const eac =
                        project.actualCost +
                        (project.budget - project.earnedValue) / (cpi * spi)
                      return (eac / 1000000).toFixed(1)
                    })()}
                    M
                  </span>
                </div>
              </div>
            </div>

            <div
              className={cn(
                'rounded-xl p-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer space-y-1.5 flex flex-col',
                getMetricBoxTheme(
                  project.earnedValue > 0
                    ? project.earnedValue / project.plannedValue
                    : 0,
                  'SPI'
                )
              )}
              // Alerts removed as requested
            >
              <div className="flex items-center justify-between">
                <span className="text-caption">Takvim Performansı</span>
                <StatusOnlyBadge
                  value={
                    project.earnedValue > 0
                      ? project.earnedValue / project.plannedValue
                      : 0
                  }
                />
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">SPI</div>
                  <div className="text-lg font-bold">
                    {project.earnedValue > 0
                      ? (project.earnedValue / project.plannedValue).toFixed(2)
                      : '0.00'}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="space-y-2 text-sm text-muted-foreground flex-1">
                  <div className="flex justify-between">
                    <span>Elde Edilen:</span>
                    <span className="font-semibold text-sm">
                      ₺{(project.earnedValue / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Planlanan:</span>
                    <span className="font-semibold text-sm">
                      ₺{(project.plannedValue / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  {project.endDate && (
                    <div className="flex justify-between">
                      <span>Hedef Bitiş:</span>
                      <span className="font-medium">
                        {new Date(project.endDate).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-sm border-t border-dashed border-gray-300 dark:border-gray-600 pt-2 mt-2">
                  <span className="text-amber-600 dark:text-amber-400">
                    Böyle Giderse:
                  </span>
                  <span className="font-semibold text-amber-700 dark:text-amber-300">
                    {(() => {
                      const spi =
                        project.earnedValue > 0
                          ? project.earnedValue / project.plannedValue
                          : 1
                      const projectedTotalDays =
                        (project.totalPlannedDays || 0) / spi
                      const projectedEndDate = new Date(project.startDate)
                      projectedEndDate.setDate(
                        projectedEndDate.getDate() +
                          Math.round(projectedTotalDays)
                      )
                      return projectedEndDate.toLocaleDateString('tr-TR')
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Action Button - Always at bottom */}
        <div className="relative mt-4">
          <button
            className={cn(
              'w-full text-white font-medium py-2.5 rounded-xl transition-all duration-300 hover:shadow-xl active:scale-[0.98] group/btn relative overflow-hidden',
              theme.buttonGradient,
              theme.animation
            )}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />

            <span className="relative flex items-center justify-center gap-2 transition-all">
              Projeyi Görüntüle
              <svg
                className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </button>

          {/* Floating action indicators */}
          {project.healthStatus === 'critical' && (
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
  if (href)
    return (
      <Link href={href} className="block">
        {card}
      </Link>
    )
  return card
}

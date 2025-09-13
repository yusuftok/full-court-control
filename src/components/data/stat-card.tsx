import * as React from 'react'
import { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period: string
  }
  icon?: LucideIcon
  description?: string
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  description,
  className,
}: StatCardProps) {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      // Format large numbers with K, M, B suffixes
      if (val >= 1000000000) {
        return (val / 1000000000).toFixed(1) + 'B'
      }
      if (val >= 1000000) {
        return (val / 1000000).toFixed(1) + 'M'
      }
      if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'K'
      }
      return val.toLocaleString()
    }
    return val
  }

  const formatChange = (changeValue: number): string => {
    const absValue = Math.abs(changeValue)
    const sign = changeValue > 0 ? '+' : changeValue < 0 ? '-' : '+'
    return `${sign}${absValue.toFixed(1)}%`
  }

  return (
    <Card
      className={cn('construction-hover animate-build-up group', className)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {title}
          </h3>
          {Icon && (
            <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors animate-float-tools" />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-bold">{formatValue(value)}</div>

          {change && (
            <div className="flex items-center gap-1 text-xs">
              <span
                className={cn(
                  'font-medium',
                  change.type === 'increase'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                {formatChange(change.value)}
              </span>
              <span className="text-muted-foreground">{change.period}</span>
            </div>
          )}

          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Grid wrapper for multiple stat cards
interface StatCardGridProps {
  children: React.ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4
}

export function StatCardGrid({
  children,
  className,
  columns = 4,
}: StatCardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  )
}

// Enhanced Analytics Metric Card - ProjectCard Style
interface AnalyticsMetricCardProps
  extends Omit<StatCardProps, 'value' | 'change'> {
  primary: number
  secondary?: number
  tertiary?: number
  labels: {
    primary: string
    secondary?: string
    tertiary?: string
  }
  type: 'ratio' | 'breakdown' | 'progress'
  status?: 'normal' | 'warning' | 'critical' | 'success'
  unit?: string
  interactive?: boolean
  onSegmentClick?: (segment: 'primary' | 'secondary' | 'tertiary') => void
}

export function AnalyticsMetricCard({
  title,
  primary,
  secondary,
  tertiary,
  labels,
  type,
  status = 'normal',
  icon: Icon,
  description,
  className,
  unit = '',
  interactive = false,
  onSegmentClick,
}: AnalyticsMetricCardProps) {
  const total = primary + (secondary || 0) + (tertiary || 0)
  const primaryPercentage = total > 0 ? Math.round((primary / total) * 100) : 0
  const secondaryPercentage =
    total > 0 && secondary ? Math.round((secondary / total) * 100) : 0
  const tertiaryPercentage =
    total > 0 && tertiary ? Math.round((tertiary / total) * 100) : 0

  const getStatusClass = () => {
    switch (status) {
      case 'success':
        return 'border-l-4 border-l-green-400 bg-gradient-to-br from-green-50/50 to-transparent'
      case 'warning':
        return 'border-l-4 border-l-yellow-400 bg-gradient-to-br from-yellow-50/50 to-transparent'
      case 'critical':
        return 'border-l-4 border-l-red-400 bg-gradient-to-br from-red-50/50 to-transparent'
      default:
        return 'border-l-4 border-l-blue-400 bg-gradient-to-br from-blue-50/50 to-transparent'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return '🟢'
      case 'warning':
        return '🟡'
      case 'critical':
        return '🔴'
      default:
        return '🔵'
    }
  }

  const renderRatioDisplay = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-3xl font-bold tracking-tight">
            {primary}
            {unit}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {labels.primary}
          </div>
        </div>
        <div className="text-right space-y-1">
          <div className="text-lg text-muted-foreground">
            / {total}
            {unit}
          </div>
          <div className="text-xs text-muted-foreground">Toplam</div>
        </div>
      </div>

      {/* Modern Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">İlerleme</span>
          <span className="font-semibold">{primaryPercentage}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden relative">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700 ease-out relative',
              status === 'success'
                ? 'bg-gradient-to-r from-green-500 to-green-400'
                : status === 'warning'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                  : status === 'critical'
                    ? 'bg-gradient-to-r from-red-500 to-red-400'
                    : 'bg-gradient-to-r from-blue-500 to-blue-400'
            )}
            style={{ width: `${primaryPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  )

  const renderBreakdownDisplay = () => (
    <div className="space-y-4">
      {/* Segment Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div
          className={cn(
            'p-3 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden',
            status === 'critical'
              ? 'border-red-200 bg-gradient-to-br from-red-50 to-red-100'
              : status === 'warning'
                ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100'
                : 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100',
            interactive && 'group'
          )}
          onClick={interactive ? () => onSegmentClick?.('primary') : undefined}
        >
          {interactive && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
          )}
          <div className="relative">
            <div className="text-xl font-bold">{primary}</div>
            <div className="text-xs text-muted-foreground truncate">
              {labels.primary}
            </div>
          </div>
        </div>

        {secondary !== undefined && (
          <div
            className={cn(
              'p-3 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden',
              'border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100',
              interactive && 'group'
            )}
            onClick={
              interactive ? () => onSegmentClick?.('secondary') : undefined
            }
          >
            {interactive && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            )}
            <div className="relative">
              <div className="text-xl font-bold">{secondary}</div>
              <div className="text-xs text-muted-foreground truncate">
                {labels.secondary}
              </div>
            </div>
          </div>
        )}

        {tertiary !== undefined && (
          <div
            className={cn(
              'p-3 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden',
              'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100',
              interactive && 'group'
            )}
            onClick={
              interactive ? () => onSegmentClick?.('tertiary') : undefined
            }
          >
            {interactive && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            )}
            <div className="relative">
              <div className="text-xl font-bold">{tertiary}</div>
              <div className="text-xs text-muted-foreground truncate">
                {labels.tertiary}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Dağılım</span>
          <span className="font-semibold">Toplam: {total}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden flex">
          <div
            className={cn(
              'transition-all duration-700 ease-out',
              status === 'critical'
                ? 'bg-red-500'
                : status === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-blue-500'
            )}
            style={{ width: `${primaryPercentage}%` }}
          />
          {secondary !== undefined && (
            <div
              className="bg-orange-500 transition-all duration-700 ease-out"
              style={{ width: `${secondaryPercentage}%` }}
            />
          )}
          {tertiary !== undefined && (
            <div
              className="bg-purple-500 transition-all duration-700 ease-out"
              style={{ width: `${tertiaryPercentage}%` }}
            />
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Card
      className={cn(
        'construction-hover animate-build-up group relative overflow-hidden',
        getStatusClass(),
        'transition-all duration-300 hover:scale-[1.02] hover:shadow-lg',
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {title}
            </h3>
            <span className="text-xs">{getStatusIcon()}</span>
          </div>
          {Icon && (
            <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors animate-float-tools" />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {type === 'ratio' ? renderRatioDisplay() : renderBreakdownDisplay()}

        {description && (
          <p className="text-xs text-muted-foreground mt-3 opacity-80">
            {description}
          </p>
        )}
      </CardContent>

      {/* Floating action indicator */}
      {status === 'critical' && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          🚨 Acil
        </div>
      )}
    </Card>
  )
}

// Specialized stat card variants
interface ProgressStatCardProps
  extends Omit<StatCardProps, 'value' | 'change'> {
  current: number
  target: number
  unit?: string
}

export function ProgressStatCard({
  title,
  current,
  target,
  unit = '',
  icon: Icon,
  description,
  className,
}: ProgressStatCardProps) {
  const percentage = target > 0 ? Math.round((current / target) * 100) : 0
  const [justReachedMilestone, setJustReachedMilestone] = React.useState<
    number | null
  >(null)

  // Check for milestone achievements
  React.useEffect(() => {
    const milestones = [25, 50, 75, 100]
    const reachedMilestone = milestones.find(
      m => percentage >= m && percentage < m + 5 // Recently reached
    )

    if (reachedMilestone && reachedMilestone !== justReachedMilestone) {
      setJustReachedMilestone(reachedMilestone)
      setTimeout(() => setJustReachedMilestone(null), 3000)
    }
  }, [percentage, justReachedMilestone])

  const getMilestoneClass = () => {
    if (percentage >= 100) return 'milestone-100'
    if (percentage >= 75) return 'milestone-75'
    if (percentage >= 50) return 'milestone-50'
    if (percentage >= 25) return 'milestone-25'
    return ''
  }

  return (
    <Card
      className={cn(
        'construction-hover animate-build-up group',
        justReachedMilestone && 'animate-progress-celebration',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {Icon && <Icon className="size-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">
              {current.toLocaleString()}
              {unit}
            </div>
            <div className="text-sm text-muted-foreground">
              / {target.toLocaleString()}
              {unit}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">İlerleme</span>
              <span className="font-medium">{percentage}%</span>
            </div>
            <div
              className={cn(
                'h-2 bg-secondary rounded-full overflow-hidden construction-progress progress-milestone',
                getMilestoneClass(),
                justReachedMilestone && 'animate-happy-bounce'
              )}
            >
              <div
                className={cn(
                  'h-full transition-all duration-500 ease-out',
                  percentage >= 100
                    ? 'gradient-success'
                    : percentage >= 75
                      ? 'bg-green-500'
                      : percentage >= 50
                        ? 'bg-primary'
                        : percentage >= 25
                          ? 'bg-yellow-500'
                          : 'bg-gray-400'
                )}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>

          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

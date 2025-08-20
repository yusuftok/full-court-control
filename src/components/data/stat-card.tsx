import * as React from "react"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
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
  className
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
    return `${changeValue >= 0 ? '+' : ''}${absValue.toFixed(1)}%`
  }

  return (
    <Card className={cn("construction-hover animate-build-up group", className)}>
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
          <div className="text-2xl font-bold">
            {formatValue(value)}
          </div>
          
          {change && (
            <div className="flex items-center gap-1 text-xs">
              <span
                className={cn(
                  "font-medium",
                  change.type === "increase" 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {formatChange(change.value)}
              </span>
              <span className="text-muted-foreground">
                {change.period}
              </span>
            </div>
          )}
          
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
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
  columns = 4 
}: StatCardGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }

  return (
    <div className={cn(
      "grid gap-4",
      gridCols[columns],
      className
    )}>
      {children}
    </div>
  )
}

// Specialized stat card variants
interface ProgressStatCardProps extends Omit<StatCardProps, 'value' | 'change'> {
  current: number
  target: number
  unit?: string
}

export function ProgressStatCard({
  title,
  current,
  target,
  unit = "",
  icon: Icon,
  description,
  className
}: ProgressStatCardProps) {
  const percentage = target > 0 ? Math.round((current / target) * 100) : 0
  
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            {title}
          </h3>
          {Icon && (
            <Icon className="size-4 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">
              {current.toLocaleString()}{unit}
            </div>
            <div className="text-sm text-muted-foreground">
              / {target.toLocaleString()}{unit}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">İlerleme</span>
              <span className="font-medium">{percentage}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden construction-progress">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
          
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
import * as React from "react"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CircularProgress } from "@/components/ui/circular-progress"

// Circular Progress Metric Card - Like ProjectCard
interface CircularMetricCardProps {
  title: string
  percentage: number
  value: string
  target?: string
  icon?: LucideIcon
  status?: 'normal' | 'warning' | 'critical' | 'success'
  description?: string
  className?: string
  size?: number
  onClick?: () => void
}

export function CircularMetricCard({
  title,
  percentage,
  value,
  target,
  icon: Icon,
  status = 'normal',
  description,
  className,
  size = 64,
  onClick
}: CircularMetricCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'rgb(16 185 129)'
      case 'warning': return 'rgb(245 158 11)'
      case 'critical': return 'rgb(239 68 68)'
      default: return 'rgb(59 130 246)'
    }
  }
  
  const getStatusClass = () => {
    switch (status) {
      case 'success': return 'border-l-4 border-l-green-400 bg-gradient-to-br from-green-50/50 to-transparent'
      case 'warning': return 'border-l-4 border-l-yellow-400 bg-gradient-to-br from-yellow-50/50 to-transparent'
      case 'critical': return 'border-l-4 border-l-red-400 bg-gradient-to-br from-red-50/50 to-transparent'
      default: return 'border-l-4 border-l-blue-400 bg-gradient-to-br from-blue-50/50 to-transparent'
    }
  }
  
  const getStatusIcon = () => {
    switch (status) {
      case 'success': return '🟢'
      case 'warning': return '🟡'
      case 'critical': return '🔴'
      default: return '🔵'
    }
  }
  
  return (
    <Card className={cn(
      "construction-hover animate-build-up group relative overflow-hidden",
      getStatusClass(),
      "transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer",
      className
    )}
    onClick={onClick}>
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
        <div className="flex items-center gap-4">
          <CircularProgress
            percentage={percentage}
            size={size}
            strokeWidth={4}
            color={getStatusColor()}
            showText={true}
            animate={true}
          />
          <div className="flex-1">
            <div className="text-2xl font-bold tracking-tight mb-1">
              {value}
            </div>
            {target && (
              <div className="text-sm text-muted-foreground mb-2">
                / {target}
              </div>
            )}
            {description && (
              <div className="text-xs text-muted-foreground">
                {description}
              </div>
            )}
          </div>
        </div>
        
        {/* Progress bar for additional context */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">İlerleme</span>
            <span className="font-semibold">{percentage}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out relative"
              style={{ 
                width: `${percentage}%`,
                backgroundColor: getStatusColor()
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
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
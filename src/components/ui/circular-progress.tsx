import * as React from 'react'
import { cn } from '@/lib/utils'

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  showText?: boolean
  label?: string
  labelInside?: boolean
  animate?: boolean
  className?: string
}

export function CircularProgress({
  percentage,
  size = 60,
  strokeWidth = 6,
  color = 'rgb(59 130 246)',
  backgroundColor = 'rgb(226 232 240)',
  showText = true,
  label,
  labelInside = false,
  animate = true,
  className,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            className="opacity-20"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn(
              'transition-all duration-1000 ease-out',
              animate && 'animate-pulse'
            )}
            style={{
              filter: `drop-shadow(0 0 6px ${color}40)`,
            }}
          />
        </svg>
        {showText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center leading-tight">
              <span className="text-xs font-bold" style={{ color }}>
                {percentage}%
              </span>
              {label && labelInside && (
                <span className="text-[9px] text-muted-foreground">
                  {label}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {label && !labelInside && (
        <span className="text-xs text-muted-foreground font-medium">
          {label}
        </span>
      )}
    </div>
  )
}

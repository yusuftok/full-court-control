import * as React from "react"
import { cn } from "@/lib/utils"

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  theme?: "construction" | "default"
}

export function LoadingSpinner({ 
  size = "md", 
  className,
  theme = "construction" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  if (theme === "construction") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn("animate-hammer-swing", sizeClasses[size])}>
          🔨
        </div>
        <span className="text-sm text-muted-foreground animate-pulse">
          Harika bir şey inşa ediliyor...
        </span>
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        className
      )}
    />
  )
}

export interface LoadingSkeletonProps {
  className?: string
  theme?: "construction" | "default"
}

export function LoadingSkeleton({ className, theme = "construction" }: LoadingSkeletonProps) {
  if (theme === "construction") {
    return (
      <div className={cn("animate-pulse blueprint-scan bg-muted rounded", className)} />
    )
  }

  return (
    <div className={cn("animate-pulse bg-muted rounded", className)} />
  )
}

export interface LoadingStateProps {
  children?: React.ReactNode
  isLoading: boolean
  loadingText?: string
  theme?: "construction" | "default"
  className?: string
}

export function LoadingState({ 
  children, 
  isLoading, 
  loadingText,
  theme = "construction",
  className 
}: LoadingStateProps) {
  if (isLoading) {
    const messages = [
      "Temel atılıyor...",
      "Beton karıştırılıyor...", 
      "Projeler okunuyor...",
      "Güvenlik protokolleri kontrol ediliyor...",
      "Ekiple koordinasyon sağlanıyor...",
      "İki kez ölç, bir kez kes...",
      "Kalite kontrolü devam ediyor..."
    ]
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-[200px] gap-4", className)}>
        <div className="text-4xl animate-construction-bounce">🏗️</div>
        <LoadingSpinner theme={theme} />
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          {loadingText || randomMessage}
        </p>
      </div>
    )
  }

  return <>{children}</>
}
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  theme?: 'construction' | 'default'
}

export function LoadingSpinner({
  size = 'md',
  className,
  theme = 'construction',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  if (theme === 'construction') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className={cn('animate-hammer-swing', sizeClasses[size])}>🔨</div>
        <span className="text-sm text-muted-foreground animate-pulse">
          Harika bir şey inşa ediliyor...
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  )
}

export interface LoadingSkeletonProps {
  className?: string
  theme?: 'construction' | 'default'
}

export function LoadingSkeleton({
  className,
  theme = 'construction',
}: LoadingSkeletonProps) {
  if (theme === 'construction') {
    return (
      <div
        className={cn(
          'animate-pulse blueprint-scan bg-muted rounded',
          className
        )}
      />
    )
  }

  return <div className={cn('animate-pulse bg-muted rounded', className)} />
}

export interface LoadingStateProps {
  children?: React.ReactNode
  isLoading: boolean
  loadingText?: string
  theme?: 'construction' | 'default'
  className?: string
}

export function LoadingState({
  children,
  isLoading,
  loadingText,
  theme = 'construction',
  className,
}: LoadingStateProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0)
  const [showTools, setShowTools] = React.useState(false)

  if (isLoading) {
    const messages = [
      { text: 'Temel atılıyor...', emoji: '🏗️' },
      { text: 'Beton karıştırılıyor...', emoji: '🪣' },
      { text: 'Projeler okunuyor...', emoji: '📜' },
      { text: 'Güvenlik protokolleri kontrol ediliyor...', emoji: '🧡' },
      { text: 'Ekiple koordinasyon sağlanıyor...', emoji: '📞' },
      { text: 'İki kez ölç, bir kez kes...', emoji: '📏' },
      { text: 'Kalite kontrolü devam ediyor...', emoji: '✅' },
      { text: 'Planlar çiziliyor...', emoji: '📊' },
      { text: 'Malzemeler sayılıyor...', emoji: '🪣' },
      { text: 'Kahve hazırlanıyor... Şaka! 😄', emoji: '☕' },
    ]

    const currentMessage = messages[currentMessageIndex]

    // Rotate messages every 2 seconds
    React.useEffect(() => {
      const interval = setInterval(() => {
        setCurrentMessageIndex(prev => (prev + 1) % messages.length)
        setShowTools(prev => !prev)
      }, 2000)
      return () => clearInterval(interval)
    }, [])

    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center min-h-[200px] gap-4',
          className
        )}
      >
        <div className="relative">
          <div className="text-4xl animate-construction-bounce">
            {currentMessage.emoji}
          </div>
          {showTools && (
            <div className="absolute -top-2 -right-2 text-lg animate-float-tools">
              🔨
            </div>
          )}
        </div>

        <LoadingSpinner theme={theme} />

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground max-w-xs animate-pulse">
            {loadingText || currentMessage.text}
          </p>
          <p className="text-xs text-muted-foreground/70">
            👷 Sabırlı olmak iyi şantiye şefinin ilk kuralıdır...
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Whimsical Construction Crew Component
export function ConstructionCrew({
  message = 'Ekip çalışıyor...',
}: {
  message?: string
}) {
  const [currentWorker, setCurrentWorker] = React.useState(0)
  const workers = ['👷', '🏗️', '🔨', '⚒️', '🪓', '📐', '📏']

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWorker(prev => (prev + 1) % workers.length)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3 animate-spring-in">
      <div className="text-2xl animate-construction-cheer">
        {workers[currentWorker]}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{message}</span>
        <div className="flex gap-1">
          {workers.slice(0, 3).map((worker, i) => (
            <span
              key={i}
              className={cn(
                'text-xs transition-all duration-300',
                i === currentWorker % 3 ? 'animate-happy-bounce' : 'opacity-50'
              )}
            >
              {worker}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Empty State with Personality
export function EmptyStateConstruction({
  title = 'Henüz hiçbir şey yok',
  description = 'Hadi ilk projeyi başlatalım!',
  action,
  className,
}: {
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  const [currentTool, setCurrentTool] = React.useState(0)
  const tools = ['🔨', '⚒️', '🪚', '📐', '📏', '🪓']

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTool(prev => (prev + 1) % tools.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[300px] gap-6 text-center',
        className
      )}
    >
      <div className="relative">
        <div className="text-6xl animate-float opacity-20">🏗️</div>
        <div className="absolute -top-4 -right-4 text-2xl animate-tools-party">
          {tools[currentTool]}
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground/70 animate-pulse">
          💡 Her büyük proje tek bir tuğla ile başlar!
        </p>
      </div>

      {action && <div className="animate-spring-in">{action}</div>}
    </div>
  )
}

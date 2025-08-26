'use client'

import * as React from 'react'
import { Check, ArrowLeft, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepConfig {
  id: number
  title: string
  description: string
  icon?: string
}

interface HorizontalStepIndicatorProps {
  steps: StepConfig[]
  currentStep: number
  onStepClick?: (stepId: number) => void
  className?: string
}

export function HorizontalStepIndicator({
  steps,
  currentStep,
  onStepClick,
  className,
}: HorizontalStepIndicatorProps) {
  // State for micro-interactions
  const [hoveredStep, setHoveredStep] = React.useState<number | null>(null)
  const [pressedStep, setPressedStep] = React.useState<number | null>(null)
  const [celebratingStep, setCelebratingStep] = React.useState<number | null>(
    null
  )
  const prevCurrentStep = React.useRef(currentStep)

  // Track step completion for celebration effects
  React.useEffect(() => {
    if (currentStep > prevCurrentStep.current) {
      // New step completed - trigger celebration
      const newlyCompleted = prevCurrentStep.current
      setCelebratingStep(newlyCompleted)

      // Clear celebration after animation
      setTimeout(() => setCelebratingStep(null), 800)
    }
    prevCurrentStep.current = currentStep
  }, [currentStep])

  const getProgressPercentage = (): number => {
    return Math.round(((currentStep + 1) / steps.length) * 100)
  }

  const canClickStep = (stepId: number): boolean => {
    return stepId <= currentStep
  }

  const getStepIcon = (stepId: number): string => {
    const icons = ['🏗️', '👥', '🔧', '📋', '🧱', '✅']
    return icons[stepId] || '📄'
  }

  // Handle step interactions
  const handleStepClick = (stepId: number) => {
    if (!canClickStep(stepId)) return

    setPressedStep(stepId)
    setTimeout(() => setPressedStep(null), 150)

    onStepClick?.(stepId)
  }

  const handleStepHover = (stepId: number, isHovered: boolean) => {
    if (!canClickStep(stepId)) return
    setHoveredStep(isHovered ? stepId : null)
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Progress Overview - Mobile/Tablet */}
      <div className="glass rounded-xl p-2 border border-white/10 lg:hidden">
        <div className="flex items-center justify-center mb-2">
          <span className="text-xs font-medium">
            Adım {currentStep + 1} / {steps.length}
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-primary/80 h-1.5 rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${getProgressPercentage()}%` }}
          >
            {/* Animated shimmer effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
              style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite',
              }}
            />
          </div>
        </div>
        <div className="text-center">
          <div className="font-medium text-xs">{steps[currentStep]?.title}</div>
          <div className="text-xs opacity-75 hidden sm:block">
            {steps[currentStep]?.description}
          </div>
        </div>
      </div>

      {/* Horizontal Step Navigation - Desktop */}
      <div className="hidden lg:block glass rounded-lg border border-white/10 overflow-hidden">
        <div className="px-4 py-1.5">
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step Item */}
                <div
                  className={cn(
                    'flex flex-col items-center group relative z-10',
                    canClickStep(step.id) && onStepClick
                      ? 'cursor-pointer'
                      : '',
                    'transition-all duration-200',
                    hoveredStep === step.id && 'transform scale-110',
                    pressedStep === step.id && 'transform scale-95',
                    celebratingStep === step.id && 'animate-bounce'
                  )}
                  onClick={() => handleStepClick(step.id)}
                  onMouseEnter={() => handleStepHover(step.id, true)}
                  onMouseLeave={() => handleStepHover(step.id, false)}
                >
                  {/* Step Circle */}
                  <div
                    className={cn(
                      'relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200',
                      'border-2 backdrop-blur-sm overflow-hidden',
                      currentStep === step.id
                        ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/20'
                        : currentStep > step.id
                          ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-500 text-white shadow-lg shadow-green-500/30'
                          : 'bg-background border-muted-foreground/30 text-muted-foreground hover:border-primary/50 hover:shadow-md',
                      hoveredStep === step.id &&
                        canClickStep(step.id) &&
                        'ring-2 ring-primary/30 shadow-lg',
                      pressedStep === step.id && 'ring-4 ring-primary/40',
                      celebratingStep === step.id &&
                        'ring-4 ring-yellow-400/50 shadow-xl shadow-yellow-400/20'
                    )}
                  >
                    {currentStep > step.id ? (
                      <div className="relative">
                        <Check
                          className={cn(
                            'w-5 h-5 transition-all duration-200',
                            celebratingStep === step.id && 'animate-pulse'
                          )}
                        />
                        {celebratingStep === step.id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-yellow-300 animate-spin" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <span
                        className={cn(
                          'text-base transition-all duration-200',
                          hoveredStep === step.id &&
                            canClickStep(step.id) &&
                            'transform scale-110',
                          pressedStep === step.id && 'transform scale-90'
                        )}
                      >
                        {getStepIcon(step.id)}
                      </span>
                    )}

                    {/* Enhanced animations for current step */}
                    {currentStep === step.id && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
                        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                      </>
                    )}

                    {/* Celebration particles for completed step */}
                    {celebratingStep === step.id && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                            style={{
                              left: `${20 + Math.random() * 60}%`,
                              top: `${20 + Math.random() * 60}%`,
                              animationDelay: `${i * 100}ms`,
                              animationDuration: '1s',
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Hover glow effect */}
                    {hoveredStep === step.id && canClickStep(step.id) && (
                      <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="text-center mt-2 max-w-28">
                    <div
                      className={cn(
                        'font-medium text-xs leading-tight mb-1 transition-all duration-200',
                        currentStep === step.id
                          ? 'text-primary font-semibold'
                          : currentStep > step.id
                            ? 'text-green-700 dark:text-green-400 font-medium'
                            : 'text-muted-foreground',
                        hoveredStep === step.id &&
                          canClickStep(step.id) &&
                          'text-primary/80 font-medium',
                        celebratingStep === step.id &&
                          'text-green-600 font-bold'
                      )}
                    >
                      {step.title}
                    </div>
                    <div
                      className={cn(
                        'text-xs leading-tight transition-all duration-200 hidden sm:block',
                        currentStep === step.id
                          ? 'text-foreground opacity-90'
                          : 'text-muted-foreground opacity-75',
                        hoveredStep === step.id &&
                          canClickStep(step.id) &&
                          'opacity-90',
                        celebratingStep === step.id &&
                          'text-green-600/80 opacity-100'
                      )}
                    >
                      {step.description}
                    </div>
                  </div>

                  {/* Enhanced Active Step Indicator */}
                  {currentStep === step.id && (
                    <div className="absolute -bottom-3 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    </div>
                  )}

                  {/* Celebration indicator */}
                  {celebratingStep === step.id && (
                    <div className="absolute -top-6 -right-2">
                      <div className="text-yellow-400 animate-bounce text-sm">
                        ✨
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Connection Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px mx-4 relative group">
                    {/* Background line */}
                    <div className="absolute inset-0 bg-muted-foreground/20 rounded-full" />

                    {/* Animated progress line */}
                    <div
                      className={cn(
                        'absolute inset-0 rounded-full transition-all duration-300 ease-out overflow-hidden',
                        currentStep > step.id
                          ? 'bg-gradient-to-r from-primary to-green-500 w-full'
                          : currentStep === step.id
                            ? 'bg-gradient-to-r from-primary to-primary/50 w-1/2 animate-pulse'
                            : 'w-0'
                      )}
                    >
                      {/* Moving shimmer effect on active progress */}
                      {currentStep >= step.id && (
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                          style={{
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 2s infinite',
                          }}
                        />
                      )}
                    </div>

                    {/* Construction blueprint pattern overlay */}
                    <div
                      className={cn(
                        'absolute inset-0 opacity-20 transition-opacity duration-200',
                        hoveredStep === step.id || hoveredStep === step.id + 1
                          ? 'opacity-40'
                          : ''
                      )}
                      style={{
                        backgroundImage: `repeating-linear-gradient(
                          90deg,
                          transparent,
                          transparent 4px,
                          currentColor 4px,
                          currentColor 6px
                        )`,
                      }}
                    />

                    {/* Completion celebration on line */}
                    {celebratingStep === step.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Final Step Completion Message Only */}
          {currentStep === steps.length - 1 && (
            <div className="text-center mt-2">
              <div className="text-sm font-semibold text-green-600">
                <span className="flex items-center justify-center gap-1">
                  <span>🎉 Proje Hazır!</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tablet View - Simplified Horizontal */}
      <div className="hidden md:block lg:hidden glass rounded-xl border border-white/10 overflow-hidden">
        <div className="px-3 py-1">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'flex items-center space-x-2',
                  canClickStep(step.id) && onStepClick ? 'cursor-pointer' : ''
                )}
                onClick={() => canClickStep(step.id) && onStepClick?.(step.id)}
              >
                {/* Step Circle - Smaller */}
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200',
                    'border backdrop-blur-sm relative overflow-hidden',
                    currentStep === step.id
                      ? 'bg-primary border-primary text-primary-foreground shadow-lg ring-2 ring-primary/20'
                      : currentStep > step.id
                        ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-500 text-white shadow-md'
                        : 'bg-background border-muted-foreground/30 text-muted-foreground hover:border-primary/50'
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step Title - Abbreviated */}
                <div
                  className={cn(
                    'text-sm font-medium',
                    currentStep === step.id
                      ? 'text-primary'
                      : currentStep > step.id
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-muted-foreground'
                  )}
                >
                  {step.title.split(' ')[0]} {/* First word only */}
                </div>

                {/* Separator */}
                {index < steps.length - 1 && (
                  <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

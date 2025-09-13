'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// Lightweight tooltip API compatible with shadcn usage
// (No external dependency; degrades gracefully on mobile)

type TriggerProps = React.HTMLAttributes<HTMLElement> & {
  asChild?: boolean
  children: React.ReactNode
}

type ContentProps = React.HTMLAttributes<HTMLDivElement> & {
  sideOffset?: number
  className?: string
  children: React.ReactNode
}

const TooltipContext = React.createContext<{
  open: boolean
  setOpen: (v: boolean) => void
} | null>(null)

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div
        className="relative block w-full"
        // Container does not manage hover; Trigger handles it to support absolute children
      >
        {children}
      </div>
    </TooltipContext.Provider>
  )
}

export function TooltipTrigger({ asChild, children, ...rest }: TriggerProps) {
  const ctx = React.useContext(TooltipContext)
  const triggerProps: React.HTMLAttributes<HTMLElement> = {
    onMouseEnter: () => ctx?.setOpen(true),
    onMouseLeave: () => ctx?.setOpen(false),
    onFocus: () => ctx?.setOpen(true),
    onBlur: () => ctx?.setOpen(false),
    ...(rest as React.HTMLAttributes<HTMLElement>),
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement,
      triggerProps as unknown as never
    )
  }
  return (
    <div className="block w-full" {...triggerProps}>
      {children}
    </div>
  )
}

export const TooltipContent = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ className, sideOffset = 4, style, children, ...props }, ref) => {
    const ctx = React.useContext(TooltipContext)
    if (!ctx) return null
    const { open } = ctx
    if (!open) return null
    return (
      <div
        ref={ref}
        role="tooltip"
        className={cn(
          'z-50 select-none rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md',
          'absolute left-1/2 -translate-x-1/2',
          className
        )}
        style={{ marginTop: sideOffset, top: `100%`, ...style }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TooltipContent.displayName = 'TooltipContent'

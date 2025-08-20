import * as React from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps extends React.ComponentProps<"div"> {
  children: React.ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  className?: string
}

export function PageContainer({ 
  children, 
  maxWidth = "full", 
  className, 
  ...props 
}: PageContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-none"
  }

  return (
    <div 
      className={cn(
        "flex-1 flex flex-col",
        maxWidthClasses[maxWidth],
        "mx-auto w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface PageHeaderProps extends React.ComponentProps<"div"> {
  title: string
  description?: string
  action?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ 
  title, 
  description, 
  action, 
  children, 
  className,
  ...props 
}: PageHeaderProps) {
  return (
    <div 
      className={cn(
        "flex flex-col gap-4 pb-6 border-b mb-6 animate-build-up",
        "sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight hover:text-primary transition-colors cursor-default">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground hover:text-foreground transition-colors cursor-default">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-2 animate-build-up">
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

interface PageContentProps extends React.ComponentProps<"main"> {
  children: React.ReactNode
  className?: string
}

export function PageContent({ children, className, ...props }: PageContentProps) {
  return (
    <main 
      className={cn("flex-1 p-6", className)} 
      {...props}
    >
      {children}
    </main>
  )
}

// Combined layout wrapper
interface AppLayoutProps {
  children: React.ReactNode
  className?: string
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {children}
    </div>
  )
}
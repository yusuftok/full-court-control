import * as React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  separator?: React.ReactNode
  homeIcon?: boolean
}

export function Breadcrumbs({
  items,
  className,
  separator = <ChevronRight className="size-4 text-muted-foreground" />,
  homeIcon = true,
}: BreadcrumbsProps) {
  // Add home item if requested and not already present
  const allItems = React.useMemo(() => {
    if (homeIcon && items[0]?.label !== 'Operasyon Merkezi') {
      return [
        { label: 'Operasyon Merkezi', href: '/dashboard', icon: Home },
        ...items,
      ]
    }
    return items
  }, [items, homeIcon])

  return (
    <nav aria-label="Breadcrumb" className={cn('', className)}>
      <ol className="flex items-center space-x-2 text-sm">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          const Icon = item.icon

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {index > 0 && (
                <span className="mr-2" aria-hidden="true">
                  {separator}
                </span>
              )}

              {isLast || !item.href ? (
                <span
                  className={cn(
                    'flex items-center gap-1.5 font-medium',
                    isLast ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {Icon && <Icon className="size-4 shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 font-medium transition-colors',
                    'text-muted-foreground hover:text-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:rounded-sm'
                  )}
                >
                  {Icon && <Icon className="size-4 shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Utility function to generate breadcrumbs from pathname
interface GenerateBreadcrumbsOptions {
  pathname: string
  params?: Record<string, string>
  customLabels?: Record<string, string>
  homeIcon?: boolean
}

export function generateBreadcrumbs({
  pathname,
  params = {},
  customLabels = {},
  homeIcon = true,
}: GenerateBreadcrumbsOptions): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = []

  let currentPath = ''

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Replace dynamic segments with actual values
    let label = customLabels[segment] || segment
    if (segment.startsWith('[') && segment.endsWith(']')) {
      const paramKey = segment.slice(1, -1)
      label = params[paramKey] || segment
    }

    // Capitalize and format label
    label = label.replace(/-/g, ' ')
    label = label.charAt(0).toUpperCase() + label.slice(1)

    items.push({
      label,
      href: index === segments.length - 1 ? undefined : currentPath,
    })
  })

  return items
}

// Hook for automatic breadcrumbs based on current route
export function useBreadcrumbs({
  customLabels,
  homeIcon = true,
}: {
  customLabels?: Record<string, string>
  homeIcon?: boolean
} = {}) {
  // This would need to be adapted based on your routing solution
  // For Next.js, you might use useRouter and useParams

  return React.useMemo(() => {
    // Placeholder implementation
    // In a real app, this would derive breadcrumbs from current route
    return []
  }, [customLabels, homeIcon])
}

// Breadcrumb wrapper with responsive behavior
interface ResponsiveBreadcrumbsProps extends BreadcrumbsProps {
  maxItems?: number
}

export function ResponsiveBreadcrumbs({
  items,
  maxItems = 3,
  className,
  ...props
}: ResponsiveBreadcrumbsProps) {
  const shouldCollapse = items.length > maxItems

  if (!shouldCollapse) {
    return <Breadcrumbs items={items} className={className} {...props} />
  }

  // Show first item, ellipsis, and last few items
  const firstItem = items[0]
  const lastItems = items.slice(-(maxItems - 1))

  const collapsedItems: BreadcrumbItem[] = [
    firstItem,
    { label: '...', href: undefined },
    ...lastItems,
  ]

  return <Breadcrumbs items={collapsedItems} className={className} {...props} />
}

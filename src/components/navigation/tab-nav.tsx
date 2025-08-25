'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface TabNavItem {
  id: string
  label: string
  href: string
  icon?: LucideIcon
  badge?: string | number
  disabled?: boolean
}

interface TabNavProps {
  items: TabNavItem[]
  className?: string
  variant?: 'default' | 'pills' | 'underline'
}

export function TabNav({ items, className, variant = 'default' }: TabNavProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const baseStyles =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50'

  const variantStyles = {
    default: {
      container: 'border-b',
      item: 'border-b-2 border-transparent px-4 py-2 hover:text-foreground data-[active=true]:border-primary data-[active=true]:text-foreground',
      active: '',
    },
    pills: {
      container: 'bg-muted p-1 rounded-lg',
      item: 'px-3 py-1.5 rounded-md hover:bg-background hover:text-foreground data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-sm',
      active: '',
    },
    underline: {
      container: '',
      item: 'relative px-4 py-2 text-muted-foreground hover:text-foreground data-[active=true]:text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:opacity-0 after:transition-opacity data-[active=true]:after:opacity-100',
      active: '',
    },
  }

  const styles = variantStyles[variant]

  return (
    <nav className={cn(styles.container, className)}>
      <div className="flex items-center space-x-1">
        {items.map(item => {
          const Icon = item.icon
          const active = isActive(item.href)

          if (item.disabled) {
            return (
              <div
                key={item.id}
                className={cn(
                  baseStyles,
                  styles.item,
                  'cursor-not-allowed opacity-50'
                )}
              >
                {Icon && <Icon className="size-4" />}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(baseStyles, styles.item, 'text-muted-foreground')}
              data-active={active}
            >
              {Icon && <Icon className="size-4" />}
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// Mobile-friendly tab navigation with dropdown for overflow
interface MobileTabNavProps extends TabNavProps {
  maxVisibleItems?: number
}

export function MobileTabNav({
  items,
  maxVisibleItems = 3,
  className,
  variant = 'default',
}: MobileTabNavProps) {
  const pathname = usePathname()
  const [showAll, setShowAll] = React.useState(false)

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const visibleItems = showAll ? items : items.slice(0, maxVisibleItems)
  const hasMore = items.length > maxVisibleItems

  return (
    <div className={className}>
      {/* Desktop - show all items */}
      <div className="hidden md:block">
        <TabNav items={items} variant={variant} />
      </div>

      {/* Mobile - show limited items with expand option */}
      <div className="md:hidden">
        <TabNav items={visibleItems} variant={variant} />
        {hasMore && (
          <div className="flex justify-center mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll
                ? 'Show Less'
                : `Show ${items.length - maxVisibleItems} More`}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Scrollable tab navigation for many items
interface ScrollableTabNavProps extends TabNavProps {
  showScrollButtons?: boolean
}

export function ScrollableTabNav({
  items,
  className,
  variant = 'default',
  showScrollButtons = true,
}: ScrollableTabNavProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const checkScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
    }
  }, [])

  React.useEffect(() => {
    checkScroll()
    const element = scrollRef.current
    if (element) {
      element.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)

      return () => {
        element.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className={cn('relative', className)}>
      {showScrollButtons && canScrollLeft && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
          onClick={() => scroll('left')}
        >
          ←
        </Button>
      )}

      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <TabNav items={items} variant={variant} />
      </div>

      {showScrollButtons && canScrollRight && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
          onClick={() => scroll('right')}
        >
          →
        </Button>
      )}
    </div>
  )
}

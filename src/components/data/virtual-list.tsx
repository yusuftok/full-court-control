'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { cn } from '@/lib/utils'

export interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  overscan?: number
  onScroll?: (scrollTop: number) => void
  keyExtractor?: (item: T, index: number) => string | number
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
  overscan = 5,
  onScroll,
  keyExtractor = (_, index) => index,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  const totalHeight = items.length * itemHeight

  const startIndex = useMemo(() => {
    return Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  }, [scrollTop, itemHeight, overscan])

  const endIndex = useMemo(() => {
    return Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )
  }, [scrollTop, containerHeight, itemHeight, overscan, items.length])

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
    }))
  }, [items, startIndex, endIndex])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop
    setScrollTop(newScrollTop)
    onScroll?.(newScrollTop)
  }, [onScroll])

  return (
    <div
      ref={scrollElementRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index }) => (
          <div
            key={keyExtractor(item, index)}
            style={{
              position: 'absolute',
              top: index * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
}

export interface VirtualTableProps<T> {
  items: T[]
  columns: Array<{
    id: string
    header: string | React.ReactNode
    width?: string
    render: (item: T, index: number) => React.ReactNode
  }>
  itemHeight: number
  containerHeight: number
  className?: string
  headerClassName?: string
  rowClassName?: string
  overscan?: number
  onScroll?: (scrollTop: number) => void
  keyExtractor?: (item: T, index: number) => string | number
  onRowClick?: (item: T, index: number) => void
}

export function VirtualTable<T>({
  items,
  columns,
  itemHeight,
  containerHeight,
  className,
  headerClassName,
  rowClassName,
  overscan = 5,
  onScroll,
  keyExtractor = (_, index) => index,
  onRowClick,
}: VirtualTableProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  const totalHeight = items.length * itemHeight
  const headerHeight = 40

  const startIndex = useMemo(() => {
    return Math.max(0, Math.floor((scrollTop - headerHeight) / itemHeight) - overscan)
  }, [scrollTop, itemHeight, overscan, headerHeight])

  const endIndex = useMemo(() => {
    return Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight - headerHeight) / itemHeight) + overscan
    )
  }, [scrollTop, containerHeight, itemHeight, overscan, items.length, headerHeight])

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
    }))
  }, [items, startIndex, endIndex])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop
    setScrollTop(newScrollTop)
    onScroll?.(newScrollTop)
  }, [onScroll])

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <div
        className={cn(
          'grid border-b bg-muted/50 font-medium text-sm sticky top-0 z-10',
          headerClassName
        )}
        style={{
          gridTemplateColumns: columns.map(col => col.width || '1fr').join(' '),
          height: headerHeight,
        }}
      >
        {columns.map(column => (
          <div key={column.id} className="px-4 py-3 text-left font-medium">
            {column.header}
          </div>
        ))}
      </div>

      {/* Virtual Body */}
      <div
        ref={scrollElementRef}
        className="overflow-auto"
        style={{ height: containerHeight - headerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map(({ item, index }) => (
            <div
              key={keyExtractor(item, index)}
              className={cn(
                'grid border-b hover:bg-muted/50 transition-colors cursor-pointer absolute left-0 right-0',
                rowClassName
              )}
              style={{
                gridTemplateColumns: columns.map(col => col.width || '1fr').join(' '),
                top: index * itemHeight,
                height: itemHeight,
              }}
              onClick={() => onRowClick?.(item, index)}
            >
              {columns.map(column => (
                <div key={column.id} className="px-4 py-3 text-sm">
                  {column.render(item, index)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Hook for managing virtual scroll state
export function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5,
}: {
  itemCount: number
  itemHeight: number
  containerHeight: number
  overscan?: number
}) {
  const [scrollTop, setScrollTop] = useState(0)

  const totalHeight = itemCount * itemHeight

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return {
    scrollTop,
    totalHeight,
    startIndex,
    endIndex,
    handleScroll,
  }
}
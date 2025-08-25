'use client'

import * as React from 'react'
import { ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// Types for table configuration
export interface Column<T> {
  id: string
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  sortable?: boolean
  width?: string
  className?: string
}

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  sortConfig?: SortConfig
  onSort?: (key: string) => void
  onRowClick?: (row: T, index: number) => void
  rowKey?: keyof T | ((row: T, index: number) => string)
  emptyMessage?: string
  className?: string
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  sortConfig,
  onSort,
  onRowClick,
  rowKey,
  emptyMessage = 'Veri bulunamadı',
  className,
}: DataTableProps<T>) {
  const getRowKey = React.useCallback(
    (row: T, index: number): string => {
      if (typeof rowKey === 'function') {
        return rowKey(row, index)
      }
      if (rowKey && row[rowKey] != null) {
        return String(row[rowKey])
      }
      return index.toString()
    },
    [rowKey]
  )

  const getCellValue = React.useCallback((row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row)
    }
    return row[column.accessor] as React.ReactNode
  }, [])

  const handleSort = (columnId: string) => {
    if (onSort) {
      onSort(columnId)
    }
  }

  const getSortIcon = (columnId: string) => {
    if (!sortConfig || sortConfig.key !== columnId) {
      return <ChevronDown className="size-4 opacity-30" />
    }

    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="size-4" />
    ) : (
      <ChevronDown className="size-4" />
    )
  }

  if (loading) {
    return <DataTableSkeleton columns={columns} className={className} />
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50">
              {columns.map(column => (
                <th
                  key={column.id}
                  className={cn(
                    'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                    '[&:has([role=checkbox])]:pr-0',
                    column.className,
                    column.sortable &&
                      'cursor-pointer select-none hover:text-foreground'
                  )}
                  style={{ width: column.width }}
                  onClick={
                    column.sortable ? () => handleSort(column.id) : undefined
                  }
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && getSortIcon(column.id)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 px-4 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={getRowKey(row, index)}
                  className={cn(
                    'border-b transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-muted/50',
                    'data-[state=selected]:bg-muted'
                  )}
                  onClick={
                    onRowClick ? () => onRowClick(row, index) : undefined
                  }
                >
                  {columns.map(column => (
                    <td
                      key={`${getRowKey(row, index)}-${column.id}`}
                      className={cn(
                        'px-4 py-2 align-middle [&:has([role=checkbox])]:pr-0',
                        column.className
                      )}
                    >
                      {getCellValue(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Skeleton loader for loading state
interface DataTableSkeletonProps {
  columns: Column<any>[]
  rows?: number
  className?: string
}

export function DataTableSkeleton({
  columns,
  rows = 5,
  className,
}: DataTableSkeletonProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b">
              {columns.map(column => (
                <th
                  key={column.id}
                  className={cn(
                    'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                    column.className
                  )}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, index) => (
              <tr key={index} className="border-b">
                {columns.map(column => (
                  <td key={column.id} className="px-4 py-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Utility components for common table cells
interface TableActionProps {
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
  className?: string
}

export function TableAction({
  onEdit,
  onDelete,
  onView,
  className,
}: TableActionProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {onView && (
        <Button variant="ghost" size="sm" onClick={onView}>
          Görüntüle
        </Button>
      )}
      {onEdit && (
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Düzenle
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-destructive hover:text-destructive"
        >
          Sil
        </Button>
      )}
      <Button variant="ghost" size="icon" className="size-8">
        <MoreHorizontal className="size-4" />
      </Button>
    </div>
  )
}

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    active:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    inactive:
      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    pending:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    completed:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }

  const statusLabels = {
    active: 'Aktif',
    inactive: 'Pasif',
    pending: 'Beklemede',
    completed: 'Tamamlandı',
    cancelled: 'İptal',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  )
}

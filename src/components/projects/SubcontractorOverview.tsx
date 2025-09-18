'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import type {
  OwnerAggregate,
  OwnerIssueSummary,
  SubcontractorId,
} from '@/lib/project-analytics'

export interface SubcontractorOverviewProps {
  data: Array<{
    id: SubcontractorId
    name: string
    aggregate: OwnerAggregate
    issues?: OwnerIssueSummary
  }>
  onSelect?: (id: SubcontractorId) => void
}

export function SubcontractorOverview({
  data,
  onSelect,
}: SubcontractorOverviewProps) {
  const t = useTranslations('projectDetail')
  const summaryKeys: Array<keyof OwnerIssueSummary> = [
    'instant',
    'acceptance',
    'planned',
  ]
  const summaryLabels: Record<keyof OwnerIssueSummary, string> = {
    instant: t('issues.summary.instant'),
    acceptance: t('issues.summary.acceptance'),
    planned: t('issues.summary.planned'),
  }
  const sorted = React.useMemo(
    () => [...data].sort((a, b) => b.aggregate.combined - a.aggregate.combined),
    [data]
  )

  const levelClass = (lvl: OwnerAggregate['level']) =>
    (
      ({
        good: 'bg-green-100 text-green-700 border-green-200',
        risky: 'bg-orange-100 text-orange-700 border-orange-200',
        critical: 'bg-red-100 text-red-700 border-red-200',
      }) as const
    )[lvl]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {sorted.map(item => (
        <Card
          key={item.id}
          className={cn(
            'cursor-pointer hover:shadow-md transition',
            item.aggregate.level === 'critical'
              ? 'border-red-200'
              : item.aggregate.level === 'risky'
                ? 'border-orange-200'
                : 'border-green-200'
          )}
          onClick={() => onSelect?.(item.id)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="truncate">{item.name}</span>
              <Badge
                variant="outline"
                className={levelClass(item.aggregate.level)}
              >
                {item.aggregate.combined.toFixed(2)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>{t('metrics.cpi')}</span>
              <span className="font-medium text-foreground">
                {item.aggregate.cpi.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>{t('metrics.spi')}</span>
              <span className="font-medium text-foreground">
                {item.aggregate.spi.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {summaryKeys.map(key => (
                <Badge key={key} variant="secondary">
                  {summaryLabels[key]}: {item.issues?.[key] ?? 0}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

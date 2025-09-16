import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CircularProgress } from '@/components/ui/circular-progress'
import { PERFORMANCE_THRESHOLDS as T } from '@/lib/performance-thresholds'
import type { OwnerAggregate, OwnerIssueSummary } from '@/lib/project-analytics'

type Responsibility = { id: string; name: string }

export interface SubcontractorCardProps {
  name: string
  aggregate: OwnerAggregate
  issues?: OwnerIssueSummary
  responsibilities?: Responsibility[]
  index?: number
  onClick?: () => void
  plannedStart?: string
  plannedEnd?: string
  forecastFinish?: string
  allDone?: boolean
}

function levelBadgeClass(level: OwnerAggregate['level']) {
  if (level === 'good') return 'bg-green-100 text-green-700 border-green-200'
  if (level === 'risky')
    return 'bg-orange-100 text-orange-700 border-orange-200'
  return 'bg-red-100 text-red-700 border-red-200'
}

function levelLabel(level: OwnerAggregate['level']) {
  return level === 'good' ? 'İyi' : level === 'risky' ? 'Riskli' : 'Kritik'
}

function themeByCombined(value: number) {
  if (value >= T.COMBINED.good) {
    return {
      border: 'border-l-4 border-l-green-400',
      background: 'bg-gradient-to-br from-green-50/30 to-emerald-50/20',
      card: 'hover:shadow-green-200/50 hover:shadow-xl',
      progress: 'linear-gradient(90deg, #10b981, #34d399)',
      button: 'bg-gradient-to-r from-green-600 to-emerald-600',
      accent: 'text-green-700',
    }
  }
  if (value >= T.COMBINED.risky) {
    return {
      border: 'border-l-4 border-l-orange-400',
      background: 'bg-gradient-to-br from-orange-50/30 to-orange-100/20',
      card: 'hover:shadow-orange-200/50 hover:shadow-xl',
      progress: 'linear-gradient(90deg, #ea580c, #f97316)',
      button: 'bg-gradient-to-r from-orange-600 to-orange-500',
      accent: 'text-orange-700',
    }
  }
  return {
    border: 'border-l-4 border-l-red-400',
    background: 'bg-gradient-to-br from-red-50/30 to-rose-50/20',
    card: 'hover:shadow-red-200/50 hover:shadow-lg',
    progress: 'linear-gradient(90deg, #dc2626, #ef4444)',
    button: 'bg-gradient-to-r from-red-600 to-rose-600',
    accent: 'text-red-700',
  }
}

function metricBoxClass(value: number, kind: 'CPI' | 'SPI') {
  const thr = kind === 'CPI' ? T.CPI : T.SPI
  if (value >= thr.good)
    return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/60 text-green-800'
  if (value >= thr.risky)
    return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200/60 text-orange-800'
  return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200/60 text-red-800'
}

export function SubcontractorCard({
  name,
  aggregate,
  issues,
  responsibilities,
  index = 0,
  onClick,
  plannedStart,
  plannedEnd,
  forecastFinish,
  allDone,
}: SubcontractorCardProps) {
  const theme = themeByCombined(aggregate.combined)
  const progressPct = (() => {
    // Gerçek ilerleme: toplanan iş değeri (EV) / toplam sözleşme değeri (BAC)
    if (aggregate.bac <= 0) return 0
    const pct = Math.round((aggregate.ev / aggregate.bac) * 100)
    return Math.max(0, Math.min(100, pct))
  })()

  return (
    <Card
      className={cn(
        'cursor-pointer floating-card !px-0 group container-responsive min-h-[420px] flex flex-col',
        theme.border,
        theme.background,
        theme.card
      )}
      style={{ animationDelay: `${index * 40}ms` }}
      onClick={onClick}
    >
      <CardHeader className="pb-2 px-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold truncate flex-1">
            {name}
          </CardTitle>
          <Badge variant="outline" className={levelBadgeClass(aggregate.level)}>
            {levelLabel(aggregate.level)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-full px-2">
        <div className="space-y-3 flex-1">
          {/* Progress */}
          <div className="flex items-start gap-4">
            <CircularProgress
              percentage={progressPct}
              size={56}
              strokeWidth={4}
              color={
                aggregate.level === 'good'
                  ? 'rgb(22 163 74)'
                  : aggregate.level === 'risky'
                    ? 'rgb(234 88 12)'
                    : 'rgb(239 68 68)'
              }
              showText
              label="İlerleme"
              labelInside
              animate
            />
            <div className="flex-1">
              {responsibilities && responsibilities.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {responsibilities.slice(0, 3).map(r => (
                    <span
                      key={r.id}
                      className="inline-flex items-center rounded border bg-muted px-1.5 py-0.5 text-[10px]"
                    >
                      {r.name}
                    </span>
                  ))}
                  {responsibilities.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{responsibilities.length - 3}
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="secondary"
                  title="Gecikme sayısı (takvim gecikmesi)"
                >
                  Gecikme: {issues?.delay ?? 0}
                </Badge>
                <Badge
                  variant="secondary"
                  title="Bütçe aşımı sayısı (cost overrun)"
                >
                  Aşım: {issues?.overrun ?? 0}
                </Badge>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                'rounded-xl p-2 border space-y-1.5',
                metricBoxClass(aggregate.cpi, 'CPI')
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold uppercase whitespace-nowrap overflow-hidden text-ellipsis flex-1">
                  Bütçe Performansı
                </span>
                <Badge
                  variant="outline"
                  className={levelBadgeClass(
                    aggregate.cpi >= T.CPI.good
                      ? 'good'
                      : aggregate.cpi >= T.CPI.risky
                        ? 'risky'
                        : 'critical'
                  )}
                >
                  {levelLabel(
                    aggregate.cpi >= T.CPI.good
                      ? 'good'
                      : aggregate.cpi >= T.CPI.risky
                        ? 'risky'
                        : 'critical'
                  )}
                </Badge>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">CPI</span>
                <span className="text-lg font-bold">
                  {aggregate.cpi.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Harcanan</span>
                  <span>₺{(aggregate.ac / 1_000_000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span>Elde Edilen</span>
                  <span>₺{(aggregate.ev / 1_000_000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span>Toplam Bütçe</span>
                  <span>₺{(aggregate.bac / 1_000_000).toFixed(1)}M</span>
                </div>
              </div>
              <div className="flex justify-between text-sm border-t border-dashed border-gray-300 dark:border-gray-600 pt-2 mt-2">
                <span className="text-amber-600 dark:text-amber-400">
                  Böyle Giderse:
                </span>
                <span className="font-bold text-base text-amber-700 dark:text-amber-300">
                  ₺
                  {(() => {
                    const cpi = aggregate.cpi
                    const eac = cpi > 0 ? aggregate.pv / cpi : aggregate.pv
                    return (eac / 1_000_000).toFixed(1)
                  })()}
                  M
                </span>
              </div>
            </div>
            <div
              className={cn(
                'rounded-xl p-2 border space-y-1.5',
                metricBoxClass(aggregate.spi, 'SPI')
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold uppercase whitespace-nowrap overflow-hidden text-ellipsis flex-1">
                  Takvim Performansı
                </span>
                <Badge
                  variant="outline"
                  className={levelBadgeClass(
                    aggregate.spi >= T.SPI.good
                      ? 'good'
                      : aggregate.spi >= T.SPI.risky
                        ? 'risky'
                        : 'critical'
                  )}
                >
                  {levelLabel(
                    aggregate.spi >= T.SPI.good
                      ? 'good'
                      : aggregate.spi >= T.SPI.risky
                        ? 'risky'
                        : 'critical'
                  )}
                </Badge>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">SPI</span>
                <span className="text-lg font-bold">
                  {aggregate.spi.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Elde Edilen</span>
                  <span>₺{(aggregate.ev / 1_000_000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span>Planlanan</span>
                  <span>₺{(aggregate.pv / 1_000_000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span>Hedef Bitiş</span>
                  <span>
                    {plannedEnd
                      ? new Date(plannedEnd).toLocaleDateString('tr-TR')
                      : '—'}
                  </span>
                </div>
              </div>
              {(() => {
                // Öncelik: WBS forecast -> hepsi bitti -> matematiksel tahmin
                if (allDone) {
                  return (
                    <div className="flex justify-between text-sm border-t border-dashed border-gray-300 dark:border-gray-600 pt-2 mt-2">
                      <span className="text-amber-600 dark:text-amber-400">
                        Böyle Giderse:
                      </span>
                      <span className="font-bold text-base text-amber-700 dark:text-amber-300">
                        Tümü tamamlandı
                      </span>
                    </div>
                  )
                }
                if (forecastFinish) {
                  return (
                    <div className="flex justify-between text-sm border-t border-dashed border-gray-300 dark:border-gray-600 pt-2 mt-2">
                      <span className="text-amber-600 dark:text-amber-400">
                        Böyle Giderse:
                      </span>
                      <span className="font-bold text-base text-amber-700 dark:text-amber-300">
                        {new Date(forecastFinish).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  )
                }
                const spi = aggregate.spi
                const now = Date.now()
                const start = plannedStart
                  ? new Date(plannedStart).getTime()
                  : now
                const end =
                  plannedEnd && new Date(plannedEnd).getTime() > start
                    ? new Date(plannedEnd).getTime()
                    : now + 14 * 86400000
                const anchor = Math.max(now, start)
                const fc = anchor + (end - anchor) / (spi > 0 ? spi : 1)
                return (
                  <div className="flex justify-between text-sm border-t border-dashed border-gray-300 dark:border-gray-600 pt-2 mt-2">
                    <span className="text-amber-600 dark:text-amber-400">
                      Böyle Giderse:
                    </span>
                    <span className="font-bold text-base text-amber-700 dark:text-amber-300">
                      {new Date(fc).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="relative mt-3">
          <button
            className={cn(
              'w-full text-white font-medium py-2.5 rounded-xl transition-all duration-300 hover:shadow-xl active:scale-[0.98] group/btn relative overflow-hidden',
              theme.button
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center justify-center gap-2">
              Detay Görüntüle
              <svg
                className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

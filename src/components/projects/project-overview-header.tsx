'use client'

import * as React from 'react'
import { Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/data/data-table'
import { cn } from '@/lib/utils'
import type { Project } from '@/components/projects/types/project-types'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import {
  PERFORMANCE_THRESHOLDS as T,
  levelFrom as levelFromCfg,
} from '@/lib/performance-thresholds'

type RangeMode = 'months' | 'weeks'

function badgeClass(level: 'İyi' | 'Riskli' | 'Kritik') {
  if (level === 'İyi') return 'bg-green-100 text-green-700 border-green-200'
  if (level === 'Riskli')
    return 'bg-orange-100 text-orange-700 border-orange-200'
  return 'bg-red-100 text-red-700 border-red-200'
}

function boxThemeSpi(value: number) {
  if (value >= T.SPI.good)
    return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/60 text-green-800'
  if (value >= T.SPI.risky)
    return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200/60 text-orange-800'
  return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200/60 text-red-800'
}

function boxThemeCpi(value: number) {
  if (value >= T.CPI.good)
    return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/60 text-green-800'
  if (value >= T.CPI.risky)
    return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200/60 text-orange-800'
  return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200/60 text-red-800'
}

function buildSeries(current: number, mode: RangeMode) {
  const n = mode === 'months' ? 6 : 8
  const now = new Date()
  const items: Array<{ label: string; value: number }> = []
  let v = Math.max(0.6, Math.min(1.2, current + 0.05))
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now)
    if (mode === 'months') d.setMonth(d.getMonth() - i)
    else d.setDate(d.getDate() - i * 7)
    v = v + (current - v) * 0.35 + (Math.random() - 0.5) * 0.04
    v = Math.max(0.6, Math.min(1.4, v))
    const label =
      mode === 'months'
        ? d.toLocaleDateString('tr-TR', { month: 'short' })
        : `${d.getDate()}.${d.getMonth() + 1}`
    items.push({ label, value: Number(v.toFixed(2)) })
  }
  return items
}

export function ProjectOverviewHeader({ project }: { project: Project }) {
  // CPI = EV / AC (guard against divide-by-zero)
  const cpi =
    project.actualCost > 0 ? project.earnedValue / project.actualCost : 1
  const spi =
    project.earnedValue > 0 ? project.earnedValue / project.plannedValue : 0
  const perfLevel = levelFromCfg(0.6 * cpi + 0.4 * spi, 'COMBINED')
  const subCount =
    project.subcontractorIds?.length ??
    Object.values(project.subcontractors || {}).filter(Boolean).length

  const remainingTasks = project.totalTasks - project.completedTasks
  // EAC ≈ BAC / CPI. If CPI < 1, EAC >= BAC olması beklenir.
  const eac = cpi > 0 ? project.budget / cpi : project.budget
  const projectedEnd = (() => {
    const s =
      project.earnedValue > 0 ? project.earnedValue / project.plannedValue : 1
    const totalDays = project.totalPlannedDays || 0
    const projDays = s > 0 ? Math.round(totalDays / s) : totalDays
    const d = new Date(project.startDate)
    d.setDate(d.getDate() + projDays)
    return d
  })()

  const [range, setRange] = React.useState<RangeMode>('months')
  const [cpiSeries, setCpiSeries] = React.useState(
    () => project.cpiSeriesMonthly ?? buildSeries(cpi, 'months')
  )
  const [spiSeries, setSpiSeries] = React.useState(
    () => project.spiSeriesMonthly ?? buildSeries(spi, 'months')
  )
  React.useEffect(() => {
    const monthlyCpi = project.cpiSeriesMonthly ?? buildSeries(cpi, 'months')
    const monthlySpi = project.spiSeriesMonthly ?? buildSeries(spi, 'months')
    const weeklyCpi = project.cpiSeriesWeekly ?? buildSeries(cpi, 'weeks')
    const weeklySpi = project.spiSeriesWeekly ?? buildSeries(spi, 'weeks')
    setCpiSeries(range === 'months' ? monthlyCpi : weeklyCpi)
    setSpiSeries(range === 'months' ? monthlySpi : weeklySpi)
  }, [
    cpi,
    spi,
    range,
    project.cpiSeriesMonthly,
    project.spiSeriesMonthly,
    project.cpiSeriesWeekly,
    project.spiSeriesWeekly,
  ])

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-2xl font-semibold truncate">
              {project.name}
            </CardTitle>
            <div className="mt-1 text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
              <span>📍 {project.location}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-4" />
                {new Date(project.startDate).toLocaleDateString('tr-TR')}
              </span>
              <span>•</span>
              <span>👷 {project.manager}</span>
              <span>•</span>
              <span>{subCount} Alt Yüklenici</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {(() => {
              const raw = String(project.status).toLowerCase()
              const mapped =
                raw === 'on-hold'
                  ? 'inactive'
                  : raw === 'planned'
                    ? 'pending'
                    : (raw as
                        | 'active'
                        | 'inactive'
                        | 'pending'
                        | 'completed'
                        | 'cancelled')
              return <StatusBadge status={mapped} />
            })()}
            <Badge variant="outline" className={badgeClass(perfLevel)}>
              {perfLevel}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
          {/* Bütçe Kutusu */}
          <div
            className={cn(
              'rounded-xl p-2 transition-all duration-300 space-y-1.5 flex flex-col border h-full min-h-[200px]',
              boxThemeCpi(cpi)
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-caption">Bütçe Performansı</span>
              <Badge
                variant="outline"
                className={badgeClass(levelFromCfg(cpi, 'CPI'))}
              >
                {levelFromCfg(cpi, 'CPI')}
              </Badge>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">CPI</div>
                <div
                  className={cn(
                    'text-lg font-bold',
                    cpi >= T.CPI.good
                      ? 'text-green-700'
                      : cpi >= T.CPI.risky
                        ? 'text-orange-700'
                        : 'text-red-700'
                  )}
                >
                  {cpi.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="space-y-2 text-sm text-muted-foreground flex-1">
                <div className="flex justify-between">
                  <span>Harcanan:</span>
                  <span className="font-semibold">
                    ₺{(project.actualCost / 1_000_000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Elde Edilen:</span>
                  <span className="font-semibold">
                    ₺{(project.earnedValue / 1_000_000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Toplam Bütçe:</span>
                  <span className="font-bold text-base">
                    ₺{(project.budget / 1_000_000).toFixed(1)}M
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm border-t border-dashed border-gray-300 dark:border-gray-600 pt-2 mt-2">
                <span className="text-amber-600 dark:text-amber-400">
                  Böyle Giderse:
                </span>
                <span className="font-bold text-base text-amber-700 dark:text-amber-300">
                  ₺{(eac / 1_000_000).toFixed(1)}M
                </span>
              </div>
            </div>
          </div>

          {/* Takvim Kutusu */}
          <div
            className={cn(
              'rounded-xl p-2 transition-all duration-300 space-y-1.5 flex flex-col border h-full min-h-[200px]',
              boxThemeSpi(spi)
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-caption">Takvim Performansı</span>
              <Badge
                variant="outline"
                className={badgeClass(levelFromCfg(spi, 'SPI'))}
              >
                {levelFromCfg(spi, 'SPI')}
              </Badge>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">SPI</div>
                <div
                  className={cn(
                    'text-lg font-bold',
                    spi >= T.SPI.good
                      ? 'text-green-700'
                      : spi >= T.SPI.risky
                        ? 'text-orange-700'
                        : 'text-red-700'
                  )}
                >
                  {spi.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="space-y-2 text-sm text-muted-foreground flex-1">
                <div className="flex justify-between">
                  <span>Elde Edilen:</span>
                  <span className="font-semibold text-sm">
                    ₺{(project.earnedValue / 1_000_000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Planlanan:</span>
                  <span className="font-semibold text-sm">
                    ₺{(project.plannedValue / 1_000_000).toFixed(2)}M
                  </span>
                </div>
                {project.endDate && (
                  <div className="flex justify-between">
                    <span>Hedef Bitiş:</span>
                    <span className="font-medium">
                      {new Date(project.endDate).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-between text-sm border-t border-dashed border-gray-300 dark:border-gray-600 pt-2 mt-2">
                <span className="text-amber-600 dark:text-amber-400">
                  Böyle Giderse:
                </span>
                <span className="font-semibold text-amber-700 dark:text-amber-300">
                  {projectedEnd.toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          </div>

          {/* Kilometre Taşları */}
          <div className="rounded-xl p-2 border bg-background h-full min-h-[200px] flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-blue-700">
                Kilometre Taşları
              </span>
              <Badge variant="outline" className={badgeClass(perfLevel)}>
                {perfLevel}
              </Badge>
            </div>
            {(() => {
              const ms = project.milestoneSummary || {
                total: 10,
                completed: Math.round(10 * (project.progress / 100)),
                upcoming: 2,
                overdue: 1,
                remaining: Math.max(
                  0,
                  10 - Math.round(10 * (project.progress / 100)) - 3
                ),
              }
              const followPct = Math.round(
                ((ms.upcoming + ms.overdue) / Math.max(1, ms.total)) * 100
              )
              return (
                <div className="flex-1 flex flex-col gap-1.5">
                  {/* Order: Geciken, Yaklaşan, Kalan */}
                  <div className="grid grid-cols-3 gap-3 items-stretch">
                    <div className="rounded-lg py-5 px-4 text-center bg-red-50 border border-red-100">
                      <div className="text-2xl font-bold text-red-700 leading-6">
                        {ms.overdue}
                      </div>
                      <div className="text-sm text-red-700 leading-5">
                        Geciken
                      </div>
                    </div>
                    <div className="rounded-lg py-5 px-4 text-center bg-yellow-50 border border-yellow-100">
                      <div className="text-2xl font-bold text-yellow-700 leading-6">
                        {ms.upcoming}
                      </div>
                      <div className="text-sm text-yellow-700 leading-5">
                        Yaklaşan
                      </div>
                    </div>
                    <div className="rounded-lg py-5 px-4 text-center bg-gray-50 border border-gray-200">
                      <div className="text-2xl font-bold text-gray-700 leading-6">
                        {ms.remaining}
                      </div>
                      <div className="text-sm text-gray-700 leading-5">
                        Kalan
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 mt-auto">
                    <div className="rounded-lg py-2.5 px-3 flex items-center justify-between bg-green-50 border border-green-100">
                      <div className="text-sm font-semibold text-green-700">
                        Tamamlanan
                      </div>
                      <div className="text-xl font-bold text-green-700">
                        {ms.completed}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Trend Kutusu (sona alındı) */}
          <div className="rounded-xl p-2 border bg-background overflow-hidden h-full min-h-[200px] flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold">CPI / SPI Trend</span>
              <div className="flex items-center gap-1 text-xs">
                {/* Full buttons on md+ */}
                <div className="hidden md:flex gap-1">
                  <button
                    className={cn(
                      'px-2 py-0.5 rounded border',
                      range === 'months'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'text-muted-foreground'
                    )}
                    onClick={() => setRange('months')}
                  >
                    Son 6 Ay
                  </button>
                  <button
                    className={cn(
                      'px-2 py-0.5 rounded border',
                      range === 'weeks'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'text-muted-foreground'
                    )}
                    onClick={() => setRange('weeks')}
                  >
                    Son 8 Hafta
                  </button>
                </div>
                {/* Compact select on small screens */}
                <select
                  className="md:hidden border rounded px-2 py-1 bg-background text-xs"
                  value={range}
                  onChange={e => setRange(e.target.value as RangeMode)}
                >
                  <option value="months">6 Ay</option>
                  <option value="weeks">8 Hafta</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="h-16">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs text-muted-foreground">CPI</span>
                  <span className="text-xs font-medium">{cpi.toFixed(2)}</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={cpiSeries}
                    margin={{ left: 28, right: 8, top: 2, bottom: 8 }}
                  >
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10 }}
                      interval={0}
                      height={16}
                    />
                    <YAxis
                      domain={[0.6, 1.4]}
                      ticks={[0.6, 0.8, 1, 1.2, 1.4]}
                      tick={{ fontSize: 10 }}
                      width={28}
                    />
                    <ReferenceLine
                      y={1}
                      stroke="#999"
                      strokeDasharray="4 4"
                      label={{
                        value: '1.00',
                        position: 'left',
                        fill: '#666',
                        fontSize: 10,
                      }}
                    />
                    <Tooltip
                      formatter={(v: unknown) => String(v)}
                      labelFormatter={(l: unknown) => String(l)}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#16a34a"
                      dot={false}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-16">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs text-muted-foreground">SPI</span>
                  <span className="text-xs font-medium">{spi.toFixed(2)}</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={spiSeries}
                    margin={{ left: 28, right: 8, top: 2, bottom: 8 }}
                  >
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10 }}
                      interval={0}
                      height={16}
                    />
                    <YAxis
                      domain={[0.6, 1.4]}
                      ticks={[0.6, 0.8, 1, 1.2, 1.4]}
                      tick={{ fontSize: 10 }}
                      width={28}
                    />
                    <ReferenceLine
                      y={1}
                      stroke="#999"
                      strokeDasharray="4 4"
                      label={{
                        value: '1.00',
                        position: 'left',
                        fill: '#666',
                        fontSize: 10,
                      }}
                    />
                    <Tooltip
                      formatter={(v: unknown) => String(v)}
                      labelFormatter={(l: unknown) => String(l)}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#2563eb"
                      dot={false}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

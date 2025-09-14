// Centralized performance thresholds used across the app
// - SPI: 0.90 (risky), 0.95 (good)
// - CPI: keep existing behavior unless updated later
// - COMBINED (0.6*CPI + 0.4*SPI): keep existing behavior

export type MetricKind = 'SPI' | 'CPI' | 'COMBINED'

export const PERFORMANCE_THRESHOLDS = {
  SPI: {
    risky: 0.9,
    good: 0.95,
  },
  CPI: {
    risky: 0.9,
    good: 0.95,
  },
  COMBINED: {
    risky: 0.9,
    good: 0.95,
  },
} as const

export type PerfLevel = 'İyi' | 'Riskli' | 'Kritik'

export function levelFrom(value: number, kind: MetricKind): PerfLevel {
  const { risky, good } = PERFORMANCE_THRESHOLDS[kind]
  if (value >= good) return 'İyi'
  if (value >= risky) return 'Riskli'
  return 'Kritik'
}

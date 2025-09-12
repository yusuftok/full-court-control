import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SubcontractorOverview } from '@/components/projects/SubcontractorOverview'
import type { OwnerAggregate, OwnerIssueSummary } from '@/lib/project-analytics'

const meta: Meta<typeof SubcontractorOverview> = {
  title: 'Projects/SubcontractorOverview',
  component: SubcontractorOverview,
}
export default meta
type Story = StoryObj<typeof SubcontractorOverview>

const mkAgg = (combined: number, cpi: number, spi: number): OwnerAggregate => ({
  ev: 100,
  ac: 120,
  pv: 110,
  combined,
  cpi,
  spi,
  level: combined >= 0.95 ? 'good' : combined >= 0.9 ? 'risky' : 'critical',
})

const data = [
  {
    id: 'sub-construction-1',
    name: 'Özkan İnşaat',
    aggregate: mkAgg(0.88, 0.83, 0.95),
    issues: { delay: 2, overrun: 1 } as OwnerIssueSummary,
  },
  {
    id: 'sub-electrical-1',
    name: 'Volt Elektrik',
    aggregate: mkAgg(0.97, 1.01, 0.92),
    issues: { delay: 0, overrun: 0 } as OwnerIssueSummary,
  },
  {
    id: 'sub-mechanical-1',
    name: 'Termo Mekanik',
    aggregate: mkAgg(0.92, 0.94, 0.9),
    issues: { delay: 1, overrun: 0 } as OwnerIssueSummary,
  },
]

export const Default: Story = { args: { data } }

import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { computeFsForecast } from '@/lib/wbs-schedule'

const meta: Meta = {
  title: 'WBS/Schedule (FS-only)',
}

export default meta
type Story = StoryObj

export const FsOnlyExample: Story = {
  render: () => {
    const dataDate = new Date('2025-09-14').getTime()
    const tasks = [
      {
        id: 'A',
        baselineStart: new Date('2025-09-01').getTime(),
        baselineFinish: new Date('2025-09-05').getTime(),
        predecessors: [],
      },
      {
        id: 'B',
        baselineStart: new Date('2025-09-06').getTime(),
        baselineFinish: new Date('2025-09-12').getTime(),
        predecessors: [{ taskId: 'A', lagDays: 0 }],
      },
      {
        id: 'C',
        baselineStart: new Date('2025-09-03').getTime(),
        baselineFinish: new Date('2025-09-10').getTime(),
        actualStart: new Date('2025-09-04').getTime(), // started, not finished
      },
    ]
    const res = computeFsForecast(tasks, { dataDate, allowEarlyStart: false })
    return (
      <div style={{ fontFamily: 'monospace', fontSize: 12 }}>
        <div>data_date: 2025-09-14</div>
        <pre>
          {tasks
            .map(t => {
              const r = res.get(t.id)
              const ef = r?.forecastFinish
              return `${t.id}: EF_f = ${ef ? new Date(ef).toISOString().slice(0, 10) : '-'}\n`
            })
            .join('')}
        </pre>
      </div>
    )
  },
}

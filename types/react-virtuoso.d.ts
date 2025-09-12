declare module 'react-virtuoso' {
  import * as React from 'react'
  export interface VirtuosoProps {
    totalCount: number
    itemContent: (index: number) => React.ReactNode
    overscan?: number
    style?: React.CSSProperties
  }
  export const Virtuoso: React.ComponentType<VirtuosoProps>
  export const VirtuosoGrid: React.ComponentType<Record<string, unknown>>
}

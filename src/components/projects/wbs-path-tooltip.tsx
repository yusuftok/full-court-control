'use client'

import * as React from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface WbsPathTooltipProps {
  ascii: string
  label?: string
  children: React.ReactElement<{ 'aria-label'?: string }>
  sideOffset?: number
}

export function WbsPathTooltip({
  ascii,
  label,
  children,
  sideOffset = 8,
}: WbsPathTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {React.cloneElement(children, {
          'aria-label': label ?? children.props['aria-label'],
        })}
      </TooltipTrigger>
      <TooltipContent className="max-w-[520px] p-0" sideOffset={sideOffset}>
        <pre className="font-mono text-xs whitespace-pre bg-transparent p-2">
          {ascii}
        </pre>
      </TooltipContent>
    </Tooltip>
  )
}

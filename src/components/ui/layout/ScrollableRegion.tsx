import type { ReactNode } from 'react'

type ScrollableRegionProps = {
  labelledBy: string
  children: ReactNode
}

export function ScrollableRegion({ labelledBy, children }: ScrollableRegionProps)
{
  return (
    <div
      role="region"
      aria-labelledby={labelledBy}
      tabIndex={0}
      className="overflow-x-auto rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {children}
    </div>
  )
}

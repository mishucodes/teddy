import type { ReactNode } from 'react'

type DocsSectionProps = {
  id: string
  title: string
  children: ReactNode
}

export function DocsSection({ id, title, children }: DocsSectionProps)
{
  const headingID = `${id}-heading`
  return (
    <section id={id} aria-labelledby={headingID} className="scroll-mt-6">
      <h2 id={headingID}>{title}</h2>
      {children}
    </section>
  )
}

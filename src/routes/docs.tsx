import { createFileRoute } from '@tanstack/react-router'
import { AboutSection } from '#/components/docs-page/AboutSection'
import { GuideSection } from '#/components/docs-page/GuideSection'
import { HowItWorksSection } from '#/components/docs-page/HowItWorksSection'
import { TableOfContents } from '#/components/docs-page/TableOfContents'
import { SITE_NAME } from '#/constants/site'

export const Route = createFileRoute('/docs')({
  head: () => ({
    meta: [
      { title: `Docs · ${SITE_NAME}` },
      { name: 'description', content: `What ${SITE_NAME} is, how its compiler works, and a guide to the language.` },
    ],
  }),
  component: DocsPage,
})

function DocsPage()
{
  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-[12rem_minmax(0,1fr)]">
      <TableOfContents />
      <article className="prose max-w-3xl min-w-0 prose-neutral dark:prose-invert prose-code:before:content-none prose-code:after:content-none">
        <h1>Docs</h1>
        <AboutSection />
        <HowItWorksSection />
        <GuideSection />
      </article>
    </main>
  )
}

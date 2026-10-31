import { createFileRoute } from '@tanstack/react-router'
import { Intro } from '#/components/landing-page/Intro'
import { Playground } from '#/components/landing-page/Playground'
import { author, blog, github, linkedIn, portfolio, twitter } from '#/constants/contact'
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '#/constants/site'
import { jsonLDScript, pageSEO } from '#/lib/seo'

const { meta, links } = pageSEO({
  title: `${SITE_NAME}: a tiny programming language that compiles to JavaScript`,
  description: `${SITE_TAGLINE} Write Teddy in the browser and see its tokens, AST, JavaScript output and console, live.`,
  path: '/',
})

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_TAGLINE,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any (runs in the browser)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Person', name: author, url: portfolio, sameAs: [github, linkedIn, twitter, blog] },
}

export const Route = createFileRoute('/')({
  head: () => ({ meta, links, scripts: [jsonLDScript(structuredData)] }),
  component: LandingPage,
})

function LandingPage()
{
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Intro />
      <Playground />
    </main>
  )
}

import type { ComponentProps } from 'react'
import { SITE_URL } from '#/constants/site'

type PageSEO = {
  title: string
  description: string
  path: string
}

type HeadTags = {
  meta: ComponentProps<'meta'>[]
  links: ComponentProps<'link'>[]
}

export function absoluteURL(path: string): string
{
  return new URL(path, SITE_URL).href
}

export function pageSEO({ title, description, path }: PageSEO): HeadTags
{
  const url = absoluteURL(path)
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

export function jsonLDScript(data: Record<string, unknown>): ComponentProps<'script'>
{
  return { type: 'application/ld+json', children: JSON.stringify(data).replace(/</g, '\\u003c') }
}

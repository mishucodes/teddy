import { docsSections } from '#/content/docs-page/sections'

export function TableOfContents()
{
  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-6 lg:self-start">
      <p className="mb-2 text-sm font-semibold">On this page</p>
      <ul className="space-y-1 text-sm">
        {Object.values(docsSections).map(({ id, title }) => (
          <li key={id}>
            <a href={`#${id}`} className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">{title}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

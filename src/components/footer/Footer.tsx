import { author, blog, github, linkedIn, mail, portfolio, twitter } from '#/constants/contact'

const elsewhere = [
  { label: 'GitHub', href: github },
  { label: 'LinkedIn', href: linkedIn },
  { label: 'X', href: twitter },
  { label: 'Blog', href: blog },
  { label: 'Email', href: `mailto:${mail}` },
]

export function Footer()
{
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Made by {author}. More of my work at{' '}
          <a href={portfolio} rel="author" className="font-medium text-foreground underline underline-offset-4">
            {new URL(portfolio).host}
          </a>
        </p>
        <nav aria-label="Elsewhere">
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {elsewhere.map(({ label, href }) => (
              <li key={label}>
                <a href={href} rel="me" className="underline-offset-4 hover:text-foreground hover:underline">{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}

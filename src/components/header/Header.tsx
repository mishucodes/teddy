import { Link } from '@tanstack/react-router'
import { ModeToggle } from '#/components/ui/theme/mode-toggle'
import { LOGO } from '#/constants/images'
import { NAV_LINKS } from '#/constants/routes'
import { SITE_NAME } from '#/constants/site'

export function Header()
{
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" activeOptions={{ exact: true }} className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight">
          <img {...LOGO} alt="" className="h-7 w-auto dark:invert" />
          {SITE_NAME}
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <nav aria-label="Main">
            <ul className="flex gap-4 text-sm">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    activeOptions={{ exact: true }}
                    className="text-muted-foreground underline-offset-8 hover:text-foreground data-[status=active]:text-foreground data-[status=active]:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

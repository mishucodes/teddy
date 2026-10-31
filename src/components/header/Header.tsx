import { Link } from '@tanstack/react-router'
import { ModeToggle } from '#/components/ui/theme/mode-toggle'
import { SITE_NAME } from '#/constants/site'

export function Header()
{
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-heading text-xl font-bold tracking-tight">
          {SITE_NAME}
        </Link>
        <ModeToggle />
      </div>
    </header>
  )
}

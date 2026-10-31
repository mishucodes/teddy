import { Link } from '@tanstack/react-router'

export function NotFound()
{
  return (
    <main className="mx-auto max-w-6xl px-4 py-20 text-center">
      <h1 className="font-heading text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 text-muted-foreground">This page doesn’t exist, or it moved.</p>
      <p className="mt-6">
        <Link to="/" className="underline underline-offset-4">Back to the playground</Link>
      </p>
    </main>
  )
}

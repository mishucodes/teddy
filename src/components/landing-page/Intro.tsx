import { SITE_TAGLINE } from '#/constants/site'

export function Intro()
{
  return (
    <section className="mb-8">
      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{SITE_TAGLINE}</h1>
      <p className="mt-2 text-muted-foreground">
        Write some Teddy on the left, then press Run to see the JavaScript it becomes and what it prints.
      </p>
    </section>
  )
}

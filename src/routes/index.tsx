import { createFileRoute } from '@tanstack/react-router'
import { Intro } from '#/components/landing-page/Intro'
import { Playground } from '#/components/landing-page/Playground'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage()
{
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Intro />
      <Playground />
    </main>
  )
}
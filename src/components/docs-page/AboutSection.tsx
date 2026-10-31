import { DocsSection } from '#/components/docs-page/DocsSection'
import { ORIGINAL_REPO_URL } from '#/constants/site'
import { docsSections } from '#/content/docs-page/sections'

export function AboutSection()
{
  return (
    <DocsSection {...docsSections.about}>
      <p>
        Teddy is a small programming language inspired by the language-building chapter of{' '}
        <cite>Eloquent JavaScript</cite> by Marijn Haverbeke. The aim is to understand interpreters and compilers by
        building a language from first principles (my own lexer, parser, AST and code generator) rather than following
        the book verbatim. It diverges from the book’s example in design and execution, reflecting experiments and ideas
        formed along the way.
      </p>
      <p>
        The name is not just because “teddy” is the canonical toy name, but because the word’s origin (President Teddy
        Roosevelt) is one I find interesting. It also feels fitting: an innocuous name with a hint of larger ambition
        beneath it.
      </p>
      <p>
        I wrote the language in 2024 while learning JavaScript (<a href={ORIGINAL_REPO_URL}>see the original</a>). This
        version keeps that code as it was, adds TypeScript types around it, and gives it a playground.
      </p>
    </DocsSection>
  )
}

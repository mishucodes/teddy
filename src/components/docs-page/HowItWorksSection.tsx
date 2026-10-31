import { DocsSection } from '#/components/docs-page/DocsSection'
import { docsSections } from '#/content/docs-page/sections'

export function HowItWorksSection()
{
  return (
    <DocsSection {...docsSections.howItWorks}>
      <p>
        What the book calls a “parser” reads source code and produces a data structure (an AST) that reflects the
        structure of the program. Teddy splits that job into two steps, then adds a third that produces JavaScript:
      </p>
      <ol>
        <li><strong>Lex:</strong> break the code into <dfn>tokens</dfn> (atoms).</li>
        <li><strong>Parse:</strong> build an <dfn>AST</dfn> (Abstract Syntax Tree) from those tokens.</li>
        <li><strong>Transpile:</strong> turn the AST into JavaScript. JS for now; an AST could become any language.</li>
      </ol>
      <h3>Isn’t it misleading to call this a language?</h3>
      <p>
        It just translates into JS, and I wouldn’t argue otherwise. It’s still worth doing, because it teaches how a
        language breaks code into tokens, how it builds an AST from them, and how an AST becomes something a machine can
        run.
      </p>
      <h3>Why “atoms”?</h3>
      <p>
        It isn’t poor poetry. An atom literally means “something that cannot be broken up any further”. In the same way,
        a token is the smallest piece of information a language considers legal.
      </p>
    </DocsSection>
  )
}

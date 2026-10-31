import { useId } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import type { CompiledStages, PlaygroundResult } from '#/types/playground'

const STAGE_VIEWS = [
  { value: 'tokens', label: 'Tokens' },
  { value: 'ast', label: 'AST' },
  { value: 'js', label: 'JavaScript' },
] as const satisfies ReadonlyArray<{ value: keyof CompiledStages; label: string }>

const panelClassName = 'max-h-96 overflow-auto p-4 font-mono text-sm leading-6 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset'

type StageOutputProps = {
  result: PlaygroundResult | null
}

export function StageOutput({ result }: StageOutputProps)
{
  const headingID = useId()
  const stages: Partial<CompiledStages> = result && 'stages' in result ? result.stages : {}
  const placeholder = (
    <p className="text-muted-foreground">
      {result ? 'Nothing to show: compilation stopped before this step.' : '…'}
    </p>
  )

  return (
    <section aria-labelledby={headingID} className="overflow-hidden rounded-xl border bg-card">
      <Tabs defaultValue="js" className="gap-0">
        <div className="flex items-center justify-between gap-4 border-b px-4 py-1.5">
          <h2 id={headingID} className="text-sm font-semibold">Output</h2>
          <TabsList aria-label="Compilation stage">
            {STAGE_VIEWS.map(({ value, label }) => <TabsTrigger key={value} value={value}>{label}</TabsTrigger>)}
          </TabsList>
        </div>

        <TabsContent value="tokens" className={panelClassName}>
          {stages.tokens ? (
            <table className="w-full text-left">
              <caption className="sr-only">Tokens, in the order the lexer produced them</caption>
              <thead className="text-muted-foreground">
                <tr><th scope="col" className="pr-4 font-normal">#</th><th scope="col" className="pr-4 font-normal">Type</th><th scope="col" className="font-normal">Value</th></tr>
              </thead>
              <tbody>
                {stages.tokens.map((token, index) => (
                  <tr key={index}>
                    <td className="pr-4 text-muted-foreground tabular-nums">{index}</td>
                    <td className="pr-4">{token.type}</td>
                    <td className="whitespace-pre">
                      {JSON.stringify(token.value)}
                      {'name' in token && <span className="text-muted-foreground"> ({token.name})</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : placeholder}
        </TabsContent>

        <TabsContent value="ast" className={panelClassName}>
          {stages.ast ? <pre>{JSON.stringify(stages.ast, null, 2)}</pre> : placeholder}
        </TabsContent>

        <TabsContent value="js" className={panelClassName}>
          {stages.js ? <pre>{stages.js}</pre> : placeholder}
        </TabsContent>
      </Tabs>
    </section>
  )
}

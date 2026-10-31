import { useEffect, useId, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Play } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { StageOutput } from '#/components/landing-page/StageOutput'
import { sampleSource } from '#/content/landing-page/sample-source'
import { runInWorker } from '#/lib/run-in-worker'
import type { PlaygroundResult } from '#/types/playground'

export function Playground()
{
  const [source, setSource] = useState(sampleSource)
  const [result, setResult] = useState<PlaygroundResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const sourceHeadingID = useId()
  const consoleHeadingID = useId()

  useEffect(() =>
  {
    void runInWorker(sampleSource).then(setResult)
  }, [])

  async function run()
  {
    setIsRunning(true)
    setResult(await runInWorker(source))
    setIsRunning(false)
  }

  function runOnModEnter(event: KeyboardEvent<HTMLTextAreaElement>)
  {
    if (!((event.metaKey || event.ctrlKey) && event.key === 'Enter')) return
    event.preventDefault()
    void run()
  }

  const logs = result && 'logs' in result ? result.logs : []

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card">
        <div className="flex items-center justify-between gap-4 border-b px-4 py-2">
          <h2 id={sourceHeadingID} className="text-sm font-semibold">Teddy</h2>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">Ctrl / ⌘ + Enter</span>
            <Button size="sm" onClick={() => void run()} disabled={isRunning}>
              <Play data-icon="inline-start" />
              {isRunning ? 'Running…' : 'Run'}
            </Button>
          </div>
        </div>
        <textarea
          aria-labelledby={sourceHeadingID}
          aria-keyshortcuts="Control+Enter Meta+Enter"
          value={source}
          onChange={(event) => setSource(event.target.value)}
          onKeyDown={runOnModEnter}
          spellCheck={false}
          wrap="off"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="min-h-96 flex-1 resize-y bg-transparent p-4 font-mono text-sm leading-6 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
        />
      </section>

      <div className="flex min-w-0 flex-col gap-6">
        <StageOutput result={result} />

        <section className="overflow-hidden rounded-xl border bg-card">
          <h2 id={consoleHeadingID} className="border-b px-4 py-2 text-sm font-semibold">Console</h2>
          <div role="log" aria-labelledby={consoleHeadingID} className="min-h-24 p-4 font-mono text-sm leading-6">
            {logs.map((line, index) => <p key={index} className="whitespace-pre-wrap">{line}</p>)}
            {result?.status === 'success' && logs.length === 0 && <p className="text-muted-foreground">No output.</p>}
            {(result?.status === 'compileError' || result?.status === 'runtimeError') && <p className="whitespace-pre-wrap text-destructive">{result.message}</p>}
            {result?.status === 'timeout' && <p className="text-destructive">Stopped after 2 seconds: something is stuck in a loop.</p>}
          </div>
        </section>
      </div>
    </div>
  )
}

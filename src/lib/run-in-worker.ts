import type { PlaygroundResult } from '#/types/playground'

const TIMEOUT_IN_MS = 2000

export function runInWorker(sourceCode: string): Promise<PlaygroundResult>
{
  return new Promise((resolve) =>
  {
    const worker = new Worker(new URL('./playground-worker.ts', import.meta.url), { type: 'module' })
    const finish = (result: PlaygroundResult) =>
    {
      clearTimeout(timer)
      worker.terminate()
      resolve(result)
    }
    const timer = setTimeout(() => finish({ status: 'timeout' }), TIMEOUT_IN_MS)

    worker.addEventListener('message', (event: MessageEvent<PlaygroundResult>) => finish(event.data))
    worker.addEventListener('error', (event) => finish({ status: 'compileError', message: event.message }))
    worker.postMessage(sourceCode)
  })
}

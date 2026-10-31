import { tokeniseThisCode } from './lexer'
import { parseTheseTokens } from './parser'
import { convertToJS } from './transpiler'
import type { PlaygroundResult } from '../types/playground'

function compileThisCode(sourceCode: string): string
{
  return convertToJS(parseTheseTokens(tokeniseThisCode(sourceCode)))
}

function formatLogValue(value: unknown): string
{
  if (typeof value === 'object' && value !== null) return JSON.stringify(value)
  return String(value)
}

function runThisCode(js: string, logs: string[]): void
{
  const capturedConsole = { log: (...values: unknown[]) => logs.push(values.map(formatLogValue).join(' ')) }
  new Function('console', js)(capturedConsole)
}

function messageOf(error: unknown): string
{
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error)
}

function compileAndRun(sourceCode: string): PlaygroundResult
{
  let js: string
  try
  {
    js = compileThisCode(sourceCode)
  }
  catch (error)
  {
    return { status: 'compileError', message: messageOf(error) }
  }

  const logs: string[] = []
  try
  {
    runThisCode(js, logs)
    return { status: 'success', js, logs }
  }
  catch (error)
  {
    return { status: 'runtimeError', js, logs, message: messageOf(error) }
  }
}

self.addEventListener('message', (event: MessageEvent<string>) =>
{
  self.postMessage(compileAndRun(event.data))
})

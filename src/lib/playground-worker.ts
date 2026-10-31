import { tokeniseThisCode } from './lexer'
import { parseTheseTokens } from './parser'
import { convertToJS } from './transpiler'
import type { CompiledStages, PlaygroundResult } from '../types/playground'

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
  const partialStages: Partial<CompiledStages> = {}
  let stages: CompiledStages
  try
  {
    const tokens = tokeniseThisCode(sourceCode)
    partialStages.tokens = tokens
    const ast = parseTheseTokens([...tokens])
    partialStages.ast = ast
    stages = { tokens, ast, js: convertToJS(ast) }
  }
  catch (error)
  {
    return { status: 'compileError', stages: partialStages, message: messageOf(error) }
  }

  const logs: string[] = []
  try
  {
    runThisCode(stages.js, logs)
    return { status: 'success', stages, logs }
  }
  catch (error)
  {
    return { status: 'runtimeError', stages, logs, message: messageOf(error) }
  }
}

self.addEventListener('message', (event: MessageEvent<string>) =>
{
  self.postMessage(compileAndRun(event.data))
})

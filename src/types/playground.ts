import type { Tokens } from '#/lib/lexer'
import type { AST } from '#/lib/parser'

export type CompiledStages = { tokens: Tokens; ast: AST; js: string }

export type PlaygroundResult =
  | { status: 'success'; stages: CompiledStages; logs: string[] }
  | { status: 'compileError'; stages: Partial<CompiledStages>; message: string }
  | { status: 'runtimeError'; stages: CompiledStages; logs: string[]; message: string }
  | { status: 'timeout' }

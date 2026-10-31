export type PlaygroundResult =
  | { status: 'success'; js: string; logs: string[] }
  | { status: 'compileError'; message: string }
  | { status: 'runtimeError'; js: string; logs: string[]; message: string }
  | { status: 'timeout' }

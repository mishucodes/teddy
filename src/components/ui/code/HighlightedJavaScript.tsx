import { useMemo } from 'react'
import { parse } from 'sugar-high/core'
import { tokenize } from 'sugar-high/lang/javascript'
import type { ParseOptions } from 'sugar-high/core'

// sugar-high's types for the JS preset don't match ParseOptions; wrapping tokenize bridges them without a cast.
const javascript: ParseOptions = { tokenize: (source) => tokenize(source, undefined) }

type HighlightedJavaScriptProps = {
  code: string
}

export function HighlightedJavaScript({ code }: HighlightedJavaScriptProps)
{
  const { lines } = useMemo(() => parse(code, javascript), [code])

  return (
    <pre>
      <code>
        {lines.map(({ index, tokens }) => (
          <span key={index}>
            {tokens.map(({ type, value }, tokenIndex) => <span key={tokenIndex} style={{ color: `var(--sh-${type})` }}>{value}</span>)}
            {'\n'}
          </span>
        ))}
      </code>
    </pre>
  )
}

import { DocsSection } from '#/components/docs-page/DocsSection'
import { ScrollableRegion } from '#/components/ui/layout/ScrollableRegion'
import { dataTypes, guideExample, keywords, operators, otherNotes } from '#/content/docs-page/guide'
import { docsSections } from '#/content/docs-page/sections'

export function GuideSection()
{
  return (
    <DocsSection {...docsSections.guide}>
      <pre tabIndex={0} aria-label="Example Teddy program"><code>{guideExample}</code></pre>

      <h3 id="data-types">Data types</h3>
      <ScrollableRegion labelledBy="data-types">
        <table>
          <thead>
            <tr><th scope="col">Type</th><th scope="col">Syntax</th><th scope="col">Example</th></tr>
          </thead>
          <tbody>
            {dataTypes.map(({ kind, name, description, example }) => (
              <tr key={name}>
                <th scope="row">{name} <span className="font-normal text-muted-foreground">({kind.toLowerCase()})</span></th>
                <td>{description}</td>
                <td><code>{example}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableRegion>

      <h3 id="keywords">Keywords</h3>
      <ScrollableRegion labelledBy="keywords">
        <table>
          <thead>
            <tr><th scope="col">Keyword</th><th scope="col">Meaning</th><th scope="col">Example</th></tr>
          </thead>
          <tbody>
            {keywords.map(({ keyword, meaning, example }) => (
              <tr key={keyword}>
                <th scope="row"><code>{keyword}</code></th>
                <td>{meaning}</td>
                <td><code>{example}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableRegion>

      <h3 id="operators">Operators</h3>
      <ScrollableRegion labelledBy="operators">
        <table>
          <thead>
            <tr><th scope="col">Kind</th><th scope="col">Operators</th><th scope="col">Note</th></tr>
          </thead>
          <tbody>
            {operators.map(({ kind, symbols, note }) => (
              <tr key={kind}>
                <th scope="row">{kind}</th>
                <td><code className="whitespace-pre">{symbols}</code></td>
                <td>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableRegion>

      <h3>Everything else</h3>
      <dl>
        {otherNotes.map(({ term, detail }) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{detail}</dd>
          </div>
        ))}
      </dl>
    </DocsSection>
  )
}

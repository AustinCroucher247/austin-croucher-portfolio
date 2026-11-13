const items = [
  'React',
  'JavaScript',
  'TypeScript',
  'PHP',
  'Node',
  'Firebase',
  'MySQL',
  'WordPress',
  'Strapi',
  'Unity',
  'C#',
  'LLM tool use',
];

/** A slow, endless strip of the tools I work in. Pauses on hover. */
export default function Ticker() {
  // The list is rendered twice so the loop has no seam; the copy is hidden from screen readers.
  return (
    <div className="ticker" aria-label={`Tools: ${items.join(', ')}`}>
      <div className="ticker__track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <ul key={copy}>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

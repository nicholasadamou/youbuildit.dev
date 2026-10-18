'use client';

import { useEffect, useId, useRef, useState } from 'react';

export default function Diagram({ source }: { source: string }) {
  const id = useId().replace(/:/g, '');
  const container = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'neutral',
          fontFamily: 'Arial, sans-serif',
        });
        const { svg } = await mermaid.render(`diagram-${id}`, source);
        if (!cancelled && container.current) container.current.innerHTML = svg;
      } catch {
        if (!cancelled)
          setError('Diagram could not be displayed. Read the source below.');
      }
    }
    void render();
    return () => {
      cancelled = true;
    };
  }, [id, source]);
  return (
    <figure className="docs-diagram">
      <figcaption>Workflow diagram</figcaption>
      <div
        ref={container}
        role="img"
        aria-label="Workflow described in the diagram source"
      />
      {error && <p role="status">{error}</p>}
      <details>
        <summary>Diagram source</summary>
        <pre>{source}</pre>
      </details>
    </figure>
  );
}

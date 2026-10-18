import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
});
const { default: mermaid } = await import('mermaid');
mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' });
const files = [
  'README.md',
  ...fs
    .readdirSync('docs')
    .filter(file => file.endsWith('.md'))
    .map(file => `docs/${file}`),
];
let diagrams = 0;
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  for (const [, diagram] of source.matchAll(/```mermaid\s*\n([\s\S]*?)```/g)) {
    try {
      await mermaid.parse(diagram);
      diagrams++;
    } catch (error) {
      throw new Error(`${file}: invalid Mermaid diagram`, { cause: error });
    }
  }
  for (const [, target] of source.matchAll(
    /\[[^\]]*\]\(([^\s)]+)(?:\s+[^)]*)?\)/g
  )) {
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const destination = path.resolve(
      path.dirname(file),
      decodeURIComponent(target.split('#')[0])
    );
    if (!fs.existsSync(destination))
      throw new Error(`${file}: broken local link ${target}`);
  }
}
console.log(
  `Validated ${files.length} Markdown files and ${diagrams} Mermaid diagrams.`
);

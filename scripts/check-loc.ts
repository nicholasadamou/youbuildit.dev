import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import budget from './loc-budget.json';

const files = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard'],
  { encoding: 'utf8' }
)
  .trim()
  .split('\n');
let total = 0;
for (const file of new Set(files)) {
  if (!/\.(tsx?|jsx?|mjs|css)$/.test(file) || !fs.existsSync(file)) continue;
  const lines = fs.readFileSync(file, 'utf8').trimEnd().split('\n').length;
  total += lines;
  const limit =
    (budget.exceptions as Record<string, number>)[file] ?? budget.perFile;
  if (lines > limit)
    throw new Error(
      `${file}: ${lines} lines exceeds ${limit}. Split responsibilities or remove duplication.`
    );
}
if (total > budget.total)
  throw new Error(
    `Source totals ${total} lines, exceeding the ${budget.total} baseline. Remove duplication before adding code.`
  );
console.log(
  `Source budget: ${total}/${budget.total} lines; new files limited to ${budget.perFile}.`
);

---
title: Contributing
description: Keep changes focused, checks reproducible, and the codebase small.
group: Development
---

# Contributing

Start with [Local development](local-development.md). Use a branch for your change and keep the scope focused. Describe the behavior before and after the change in your pull request.

## Run the shared checks

```bash
bun run check
bun run build
```

The pre-commit hook uses the same `check` command as CI. Pre-push runs `verify:browser`: it creates a disposable PostgreSQL database, applies migrations, builds production, and runs browser checks. Installation enables the hooks through Husky. Formatting failures can be repaired with `bun run format`; review the resulting diff before committing.

CI uses the committed Flox environment and frozen Bun lockfile. It runs formatting, ESLint, TypeScript, Markdown/link validation, Mermaid parsing and browser rendering, the line budget, tests, and a production build. Browser tests use an isolated PostgreSQL service and a clearly labeled fixture, including solution and ZIP checks. Inside Flox, run `bunx playwright install chromium` once, then `bun run verify:browser`. This provisions a temporary PostgreSQL cluster on port 55438 and stops it afterward. Set `TEST_DATABASE_URL` to reuse a dedicated `youbuildit_test` database. The seed refuses other database names.

Dependabot proposes weekly dependency and Actions updates.

## Keep code lean

`scripts/loc-budget.json` records the repository's baseline authored source line count and existing oversized files. The total cannot grow past the baseline, and new source files must stay at or below 350 lines. Existing oversized files may shrink but cannot grow beyond their recorded ceiling.

Prefer deleting duplicate UI and sharing content over compressing readable code. Comments should explain decisions rather than narrate syntax. Changes to the budget require an explicit rationale in review.

## Update documentation

Edit the relevant Markdown page in `docs/`, with a title, description, and group in its front matter. Use relative `.md` links between pages; the website converts them to `/docs` routes. Use fenced `mermaid` blocks for diagrams. CI checks Markdown, local links, and diagram syntax.

## Commit and release

Use conventional commit prefixes such as `feat:`, `fix:`, `docs:`, or `ci:`. Keep the subject within 72 characters. Do not commit secrets or environment files.

A successful CI run for a push to `main` triggers an automatic patch tag and a GitHub release with generated notes. The automation checks out the tested SHA and skips revisions that already have a release tag. Re-running it is safe. No package is published.

## Report a problem

Open [an issue](https://github.com/youbuildit/youbuildit.dev/issues) with the route, reproduction steps, expected result, and observed behavior. Challenge ideas and content corrections are welcome; include the challenge URL when relevant.

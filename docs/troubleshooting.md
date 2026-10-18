---
title: Troubleshooting
description: Recover from empty results, unavailable solutions, and local setup problems.
group: Guides
---

# Troubleshooting

## No challenges match

Clear the search and filters. A narrow combination can return no results even when the library has content. If the page reports a loading error, retry once and check your connection.

## A solution will not download

Not every challenge includes solution files. Check whether the challenge offers a download, then retry from its page. A persistent failure should be reported with the challenge URL and HTTP status, without private credentials.

## The local database is unavailable

Verify that `PRISMA_DATABASE_URL` is set to a development PostgreSQL or Prisma Accelerate URL. Direct PostgreSQL connections use the Prisma PostgreSQL driver adapter; Accelerate connections use the Accelerate extension. SQLite paths are not supported.

An empty development database has no challenge records. Migrations create the schema, not a copy of production content. Homepage and documentation do not require challenge data, but browsing challenges does.

## Dependencies or generated types are stale

Activate Flox and install from the lockfile again:

```bash
flox activate
bun install --frozen-lockfile
bun run typecheck
```

The install step generates Prisma types. If the dependency manifest and lockfile disagree, update the lockfile with `bun install` and commit both files after review.

## A commit is blocked

Read the failing check, fix the underlying issue, and rerun `bun run check`. Use `bun run format` for formatting changes. Mermaid errors usually indicate an invalid diagram node or unsupported syntax. Line-budget errors name the file or total that exceeded its limit.

## Flox cannot resolve packages

Check network access and the installed Flox version. The committed lockfile avoids routine re-resolution. As a temporary fallback, use the versions in `package.json`; report that the Flox environment was not verified rather than changing its pins silently.

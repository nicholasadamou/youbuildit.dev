# Automation

- `test.yml`: the `ci` workflow runs the locked Flox environment, frozen Bun install, shared `check` command, and production build for pushes and pull requests.
- `auto-release.yml`: a successful main push produces a patch tag and GitHub source release for the tested SHA. Re-runs reuse the tag and recover missing releases.
- `migrate.yml`: applies PostgreSQL migrations on main when schema or migrations change. Requires `PRISMA_DATABASE_URL`; concurrent migrations are serialized.
- `sync-content.yml`: requests a Vercel rebuild after a content event or manual dispatch. Requires `VERCEL_DEPLOY_HOOK` and fails explicitly if missing.

See [contributor documentation](../../docs/contributing.md) for local checks and [architecture](../../docs/architecture.md) for the delivery flow. Repository Actions settings must allow workflows to write release tags; the CI workflow itself is read-only.

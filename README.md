# <img src="public/logo.svg" width="36" height="36" alt="" align="absmiddle" /> You Build It

Learn by building real applications. Explore free coding challenges, implement them in your own language, and compare available reference solutions. No account required.

[![CI](https://github.com/youbuildit/youbuildit.dev/actions/workflows/test.yml/badge.svg)](https://github.com/youbuildit/youbuildit.dev/actions/workflows/test.yml)
[![Release](https://img.shields.io/github/v/release/youbuildit/youbuildit.dev)](https://github.com/youbuildit/youbuildit.dev/releases)
[![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Bun](https://img.shields.io/badge/Bun-1.3.11-292b25?logo=bun)](https://bun.sh)
[![Flox](https://img.shields.io/badge/Flox-reproducible-26754e)](https://flox.dev)
[![License](https://img.shields.io/badge/license-PolyForm_Shield-526447)](LICENSE)

[![Less watching. More building.](public/og.png)](https://youbuildit.dev)

[Explore challenges](https://youbuildit.dev/challenges) · [Documentation](docs/README.md) · [Contribute](docs/contributing.md)

## Run locally

```bash
flox activate
bun install --frozen-lockfile
cp .env.example .env.local
# Set a development PRISMA_DATABASE_URL in .env.local.
bun run dev --hostname 127.0.0.1 --port 4317
```

Next.js, React, and TypeScript power the interface; Prisma Accelerate connects challenge content to PostgreSQL. Documentation lives in `docs/` and also renders at `/docs`.

See [local development](docs/local-development.md) for configuration, [architecture](docs/architecture.md) for diagrams, and [the API reference](docs/api.md) for public endpoints.

## Quality and releases

`bun run check` runs formatting, lint, types, Markdown/Mermaid validation, the LOC budget, and tests. `bun run verify` also builds production. Git hooks mirror CI; successful main builds produce automatic patch releases.

Licensed under [PolyForm Shield](LICENSE).

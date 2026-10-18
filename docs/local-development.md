---
title: Local development
description: A reproducible environment for working on the platform, with Flox, Bun, and Prisma Postgres.
group: Development
---

# Local development

This guide runs the website itself. To solve a challenge, you can work in any language without setting up the platform.

## Start with Flox

Install [Flox](https://flox.dev/docs/install-flox/) and clone the repository. The committed environment supplies Node.js, Bun, Git, and PostgreSQL on macOS and Linux.

```bash
git clone https://github.com/youbuildit/youbuildit.dev.git
cd youbuildit.dev
flox activate
bun install --frozen-lockfile
cp .env.example .env.local
```

Set `PRISMA_DATABASE_URL` in `.env.local` to a development PostgreSQL URL (`postgresql://…`) or Prisma Accelerate URL (`prisma+postgres://…`). Never use a production database for local experiments. The schema is PostgreSQL; SQLite URLs are not supported.

## Run the website

```bash
bun run dev --hostname 127.0.0.1 --port 4317
```

Open `http://127.0.0.1:4317`. Alternatively, after installing dependencies and configuring your environment, use `flox services start web`. Inspect it with `flox services status` and stop it with `flox services stop web`.

Bun manages dependencies and scripts; Next.js and Prisma use Node.js for runtime compatibility. Without Flox, install the Node and Bun versions declared in `package.json` and follow the same commands.

## Configure the application

| Variable                        | Purpose                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------- |
| `PRISMA_DATABASE_URL`           | Required at runtime for challenge data; PostgreSQL directly or through Prisma Accelerate |
| `NEXT_PUBLIC_BASE_URL`          | Canonical site origin for metadata and links                                             |
| `GITHUB_TOKEN`                  | Optional token for GitHub commit metadata                                                |
| `NEXT_PUBLIC_CODE_REPO_URL`     | Optional source-code repository link                                                     |
| `NEXT_PUBLIC_FEEDBACK_REPO_URL` | Optional feedback repository link                                                        |

`bun install` generates the Prisma client without a database connection. Database migrations need `PRISMA_DATABASE_URL` explicitly exported to the CLI environment. Use `bun run db:migrate` only against a database you intend to update.

## Check and preview

```bash
bun run check
bun run build
bun run start --hostname 127.0.0.1 --port 4317
```

`check` runs formatting, lint, TypeScript, Markdown and Mermaid validation, the source line budget, and tests. `verify` adds the production build. The pre-commit hook runs `check`; pre-push builds and runs the browser suite against a disposable PostgreSQL database, matching CI.

Edit documentation in `docs/`. The website reads these Markdown files at build time, so no second copy of the content needs maintenance.

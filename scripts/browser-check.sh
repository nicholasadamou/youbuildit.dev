#!/usr/bin/env bash
set -euo pipefail

if [ -z "${TEST_DATABASE_URL:-}" ]; then
  command -v initdb >/dev/null || { echo 'Activate Flox to run isolated browser checks.' >&2; exit 1; }
  browser_cluster="$(mktemp -d "${TMPDIR:-/tmp}/youbuildit-browser.XXXXXX")"
  initdb -D "$browser_cluster/data" --auth=trust --username=postgres > "$browser_cluster/init.log"
  pg_ctl -D "$browser_cluster/data" -o "-h 127.0.0.1 -p 55438 -k $browser_cluster" -l "$browser_cluster/postgres.log" start
  trap 'pg_ctl -D "$browser_cluster/data" -m fast stop; echo "Database logs: $browser_cluster"' EXIT
  createdb -h 127.0.0.1 -p 55438 -U postgres youbuildit_test
  export TEST_DATABASE_URL=postgresql://postgres@127.0.0.1:55438/youbuildit_test
fi

case "$TEST_DATABASE_URL" in
  postgres://*/youbuildit_test|postgresql://*/youbuildit_test) ;;
  *) echo 'TEST_DATABASE_URL must point to a dedicated youbuildit_test database.' >&2; exit 1 ;;
esac
export PRISMA_DATABASE_URL="$TEST_DATABASE_URL"
bun run db:migrate
bunx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code
bun scripts/seed-browser.ts
bun run build
bun run test:browser

#!/usr/bin/env bash
# Create a Turso cloud database from your local Payload SQLite file, then print
# how to set DATABASE_URL + DATABASE_AUTH_TOKEN on Vercel.
#
# Prerequisites:
#   brew tap libsql/sqld && brew install tursodatabase/tap/turso
#   turso auth signup   # or turso auth login
#
# Usage:
#   pnpm run turso:create-from-local
#   TURSO_DB_NAME=my-site pnpm run turso:create-from-local
#   pnpm run turso:create-from-local /path/to/payload.db

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB_FILE="${1:-$ROOT/data/payload.db}"
NAME="${TURSO_DB_NAME:-shamal-payload}"

if ! command -v turso >/dev/null 2>&1; then
  echo "Turso CLI not found. Install with:"
  echo "  brew tap libsql/sqld && brew install tursodatabase/tap/turso"
  exit 1
fi

if [[ ! -f "$DB_FILE" ]]; then
  echo "SQLite file not found: $DB_FILE"
  exit 1
fi

echo "Creating Turso database '${NAME}' from ${DB_FILE} ..."
if ! turso db create "$NAME" --from-file "$DB_FILE" --wait; then
  echo "If the database name already exists, choose another: TURSO_DB_NAME=my-new-name pnpm run turso:create-from-local"
  exit 1
fi

echo ""
echo "Add these to Vercel → Settings → Environment Variables (Production + Preview):"
echo ""
echo "  DATABASE_URL=$(turso db show --url "$NAME")"
echo ""
echo "Create a token (copy once; it is not shown again):"
echo "  turso db tokens create \"$NAME\""
echo ""
echo "Put the token value in: DATABASE_AUTH_TOKEN"
echo "Then redeploy. Media stays in S3; this only moves the SQLite data to Turso."

#!/usr/bin/env bash
# Local BSON dump using mongodump (MongoDB Database Tools). Requires `mongodump` on PATH.
# Uses MONGODB_URI or DATABASE_URI from the environment (load .env via `set -a; source .env` if needed).

set -euo pipefail
URI="${MONGODB_URI:-${DATABASE_URI:-}}"
if [[ -z "$URI" ]]; then
  echo "Set MONGODB_URI or DATABASE_URI (e.g. export MONGODB_URI='mongodb+srv://...')"
  exit 1
fi
if ! command -v mongodump >/dev/null 2>&1; then
  echo "mongodump not found. Install MongoDB Database Tools: https://www.mongodb.com/docs/database-tools/"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${ROOT}/backup/mongo-dump-$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$OUT"
mongodump --uri="$URI" --out="$OUT"
echo "Wrote: $OUT"

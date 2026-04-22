#!/usr/bin/env bash
# Backup SQLite file configured by DATABASE_URL into ./backup/<timestamp>/ (or BACKUP_DIR).
#
# Usage (from repo root):
#   pnpm run backup:db
#   DATABASE_URL=./data/payload.db ./scripts/backup-sqlite.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi

DB_URL="${DATABASE_URL:-file:./data/payload.db}"
if [[ "$DB_URL" == ":memory:" ]] || [[ "$DB_URL" == libsql:* ]]; then
  echo "backup-sqlite: DATABASE_URL must point to a local sqlite file path." >&2
  exit 1
fi

DB_FILE="${DB_URL#file:}"
if [[ ! -f "$DB_FILE" ]]; then
  echo "backup-sqlite: database file not found: $DB_FILE" >&2
  exit 1
fi

BACKUP_ROOT="${BACKUP_DIR:-$ROOT/backup}"
TS="$(date +%Y%m%d-%H%M%S)"
OUT="$BACKUP_ROOT/sqlite-$TS"
mkdir -p "$OUT"

echo "backup-sqlite: copying $DB_FILE to $OUT"
cp "$DB_FILE" "$OUT/payload.db"

echo "backup-sqlite: done. Restore with: pnpm run restore:db -- sqlite-$TS"
if [[ "${BACKUP_COMPRESS:-}" == "1" ]]; then
  ARCHIVE="$BACKUP_ROOT/sqlite-$TS.tar.gz"
  tar -czf "$ARCHIVE" -C "$BACKUP_ROOT" "sqlite-$TS"
  echo "backup-sqlite: compressed: $ARCHIVE"
fi

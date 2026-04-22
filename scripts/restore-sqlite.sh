#!/usr/bin/env bash
# Restore SQLite file from a folder created by backup-sqlite.sh (under backup/).
#
# Usage (from repo root):
#   pnpm run restore:db -- sqlite-20260420-143022

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
  echo "restore-sqlite: DATABASE_URL must point to a local sqlite file path." >&2
  exit 1
fi
DB_FILE="${DB_URL#file:}"

BACKUP_ROOT="${BACKUP_DIR:-$ROOT/backup}"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <backup-folder-name>" >&2
  echo "Example: $0 sqlite-20260420-143022" >&2
  echo "Folders in $BACKUP_ROOT:" >&2
  ls -1 "$BACKUP_ROOT" 2>/dev/null || true
  exit 1
fi

NAME="$1"
if [[ "$NAME" == *"/"* ]] || [[ "$NAME" == *".."* ]]; then
  echo "restore-sqlite: invalid folder name." >&2
  exit 1
fi

SRC="$BACKUP_ROOT/$NAME/payload.db"
if [[ ! -f "$SRC" ]]; then
  echo "restore-sqlite: not found: $SRC" >&2
  exit 1
fi

mkdir -p "$(dirname "$DB_FILE")"
echo "restore-sqlite: restoring $SRC to $DB_FILE"
cp "$SRC" "$DB_FILE"
echo "restore-sqlite: done."

#!/usr/bin/env bash
# Dump the database named in MONGODB_URI into ./backup/<timestamp>/ (or BACKUP_DIR).
# Requires MongoDB Database Tools: https://www.mongodb.com/try/download/database-tools
#
# Usage (from repo root):
#   pnpm run backup:db
#   MONGODB_URI="mongodb://..." ./scripts/backup-mongodb.sh
#
# Cron example (daily 2:00 AM, repo at /path/to/Shamal-Tech2):
#   0 2 * * * cd /path/to/Shamal-Tech2 && /usr/bin/env MONGODB_URI='mongodb+srv://...' ./scripts/backup-mongodb.sh
# Prefer a root crontab with env from a protected file rather than embedding secrets in crontab.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi

if [[ -z "${MONGODB_URI:-}" ]]; then
  echo "backup-mongodb: MONGODB_URI is not set. Add it to .env or export it." >&2
  exit 1
fi

if ! command -v mongodump &>/dev/null; then
  echo "backup-mongodb: mongodump not found. Install MongoDB Database Tools and ensure it is in PATH." >&2
  exit 1
fi

BACKUP_ROOT="${BACKUP_DIR:-$ROOT/backup}"
TS="$(date +%Y%m%d-%H%M%S)"
OUT="$BACKUP_ROOT/mongodb-$TS"

mkdir -p "$OUT"

echo "backup-mongodb: dumping to $OUT"
mongodump --uri="$MONGODB_URI" --out="$OUT"

echo "backup-mongodb: done. Restore with: pnpm run restore:db -- mongodb-$TS"
if [[ "${BACKUP_COMPRESS:-}" == "1" ]]; then
  ARCHIVE="$BACKUP_ROOT/mongodb-$TS.tar.gz"
  tar -czf "$ARCHIVE" -C "$BACKUP_ROOT" "mongodb-$TS"
  echo "backup-mongodb: compressed: $ARCHIVE"
fi

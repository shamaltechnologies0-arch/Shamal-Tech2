#!/usr/bin/env bash
# Restore from a folder created by backup-mongodb.sh (under backup/).
#
# Usage (from repo root):
#   pnpm run restore:db -- mongodb-20250405-143022
#
# Optional: pass --drop after the folder name to drop existing collections first (destructive).

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
  echo "restore-mongodb: MONGODB_URI is not set." >&2
  exit 1
fi

if ! command -v mongorestore &>/dev/null; then
  echo "restore-mongodb: mongorestore not found. Install MongoDB Database Tools." >&2
  exit 1
fi

BACKUP_ROOT="${BACKUP_DIR:-$ROOT/backup}"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <backup-folder-name>" >&2
  echo "Example: $0 mongodb-20250405-143022" >&2
  echo "Folders in $BACKUP_ROOT:" >&2
  ls -1 "$BACKUP_ROOT" 2>/dev/null || true
  exit 1
fi

NAME="$1"
shift
# Allow optional --drop and other mongorestore flags
if [[ "$NAME" == -* ]]; then
  echo "restore-mongodb: first argument must be the backup folder name, not a flag." >&2
  exit 1
fi

# Only allow restores from direct children of BACKUP_ROOT (no path traversal)
if [[ "$NAME" == *"/"* ]] || [[ "$NAME" == *".."* ]]; then
  echo "restore-mongodb: invalid folder name." >&2
  exit 1
fi

SRC="$BACKUP_ROOT/$NAME"
if [[ ! -d "$SRC" ]]; then
  echo "restore-mongodb: not found: $SRC" >&2
  exit 1
fi

echo "restore-mongodb: restoring from $SRC into URI database (hostname redacted)"
mongorestore --uri="$MONGODB_URI" "$@" "$SRC"

#!/usr/bin/env bash
# Auto-installer for architect-skill (cursor)
# Default: --global (unless --local is explicitly provided)
set -euo pipefail

SOURCE="${BASH_SOURCE[0]}"
while [[ -L "$SOURCE" ]]; do
  DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  [[ "$SOURCE" != /* ]] && SOURCE="$DIR/$SOURCE"
done
SCRIPT_DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"

MODE="--global"
for arg in "$@"; do
  if [[ "$arg" == "--local" ]]; then
    MODE=""
  fi
done

if [[ "cursor" == "all" ]]; then
  exec node "${SCRIPT_DIR}/scripts/install.js" ${MODE} "$@"
else
  exec node "${SCRIPT_DIR}/scripts/install.js" ${MODE} --target "cursor" "$@"
fi

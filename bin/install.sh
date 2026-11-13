#!/usr/bin/env bash
# Unified entrypoint installer for architect-skill
# Usage: ./bin/install.sh [--target <agent>] [--local|--global]
set -euo pipefail

SOURCE="${BASH_SOURCE[0]}"
while [[ -L "$SOURCE" ]]; do
  DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  [[ "$SOURCE" != /* ]] && SOURCE="$DIR/$SOURCE"
done
BIN_DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
ROOT_DIR="$(cd -P "${BIN_DIR}/.." && pwd)"

# Infer target from script invocation name if called as install-skill-<target>.sh
SCRIPT_NAME="$(basename "$0")"
TARGET=""
if [[ "$SCRIPT_NAME" =~ ^install-skill-(.+)\.sh$ ]]; then
  TARGET="${BASH_REMATCH[1]}"
fi

MODE="--global"
PASSTHROUGH_ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --local)
      MODE=""
      shift
      ;;
    --global)
      MODE="--global"
      shift
      ;;
    --target)
      TARGET="$2"
      shift 2
      ;;
    *)
      PASSTHROUGH_ARGS+=("$1")
      shift
      ;;
  esac
done

if [[ -n "$TARGET" && "$TARGET" != "all" ]]; then
  exec node "${ROOT_DIR}/scripts/install.js" ${MODE} --target "$TARGET" "${PASSTHROUGH_ARGS[@]}"
else
  exec node "${ROOT_DIR}/scripts/install.js" ${MODE} "${PASSTHROUGH_ARGS[@]}"
fi

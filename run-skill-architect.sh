#!/usr/bin/env bash
# ==============================================================================
# run-skill-architect.sh
# Global & Post-Clone Interactive Launcher for architect-skill
# - Auto-registers itself in ~/.local/bin/run-skill-architect.sh (and run-skill-architect)
#   so it can be executed from ANY directory without `./` prefix.
# - Auto-detects installed AI Agents / IDEs on the host machine and presents
#   an interactive installation menu (when no direct flags are passed).
# ==============================================================================
set -euo pipefail

SOURCE="${BASH_SOURCE[0]}"
while [[ -L "$SOURCE" ]]; do
  DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  [[ "$SOURCE" != /* ]] && SOURCE="$DIR/$SOURCE"
done
SCRIPT_DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"

# Ensure ~/.local/bin has symlinks to this script so `run-skill-architect.sh` works globally without `./`
USER_BIN_DIR="${HOME}/.local/bin"
mkdir -p "${USER_BIN_DIR}"
ln -sfn "${SCRIPT_DIR}/run-skill-architect.sh" "${USER_BIN_DIR}/run-skill-architect.sh"
ln -sfn "${SCRIPT_DIR}/run-skill-architect.sh" "${USER_BIN_DIR}/run-skill-architect"

# Also register all `install-skill-<agent>.sh` wrappers in ~/.local/bin for global access without `./`
for wrapper in "${SCRIPT_DIR}"/install-skill-*.sh; do
  if [[ -f "$wrapper" ]]; then
    ln -sfn "$wrapper" "${USER_BIN_DIR}/$(basename "$wrapper")"
  fi
done

if [[ $# -eq 0 ]]; then
  exec node "${SCRIPT_DIR}/scripts/install.js" --interactive
else
  exec node "${SCRIPT_DIR}/scripts/install.js" "$@"
fi

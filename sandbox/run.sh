#!/usr/bin/env bash
set -euo pipefail
# Container Sandbox Runner (--network=none, read-only rootfs, non-root UID 10001)
ENGINE="${CONTAINER_ENGINE:-docker}"
DOCS_DIR="${1:-$(pwd)/docs}"
mkdir -p "${DOCS_DIR}"

exec "${ENGINE}" run --rm \
  --network=none \
  --read-only \
  --user 10001:10001 \
  --cap-drop=ALL \
  --security-opt=no-new-privileges:true \
  -v "${DOCS_DIR}:/workspace/docs:rw" \
  architect-skill-sandbox:latest

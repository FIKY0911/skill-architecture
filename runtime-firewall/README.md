# Runtime Firewall & Cryptographic Tool Pinning (`runtime-firewall/`)

## 1. Purpose
Protects `architect-skill` against MCP tool rug-pulls, silent script drift, and unauthorized parameter injection.

## 2. Components
- `tool-pins.json`: SHA-256 hash registry of all approved skill scripts.
- `policy.yaml` / `deny-rules.json`: Default-deny rules blocking network egress and credential path access.
- `verify.js` / `tool-firewall.js`: Runtime SHA-256 verification utility.

# Zero-Knowledge Credential Broker (`broker/`)

## 1. Purpose
Ensures the AI agent never reads, processes, or stores actual credential values from either the host AI environment or the target application/APK being designed.

## 2. Components
- `broker.js` / `zero-knowledge-proxy.js`: Issues opaque lease placeholders (`{{SECRET_<NAME>}}`) and scrubs outbound strings.
- `intake.js` / `lease-manager.js`: Registers symbolic reference handles (`ref://service/key`) without accepting raw secret values.
- `policies.json` / `credential-intake.json`: Scoped lease policy definitions.

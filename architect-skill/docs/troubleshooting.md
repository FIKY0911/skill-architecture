# Troubleshooting Guide

## 1. `ERR_ZERO_EGRESS_BLOCKED`
- **Cause**: A script or test attempted to call `fetch()`, `http.request()`, `net.connect()`, or `dns.lookup()`.
- **Resolution**: `architect-skill` is strictly local-first. Remove any external network call.

## 2. `ERR_CREDENTIAL_PATH_BLOCKED`
- **Cause**: A path passed to `sanitize-input.js` targeted `.env`, `*.pem`, `*.key`, `*.keystore`, or an AI agent credential folder.
- **Resolution**: Never pass secret files to the skill. Use symbolic placeholders via `broker/intake.js`.

## 3. `TOOL_PIN_MISMATCH`
- **Cause**: A file under `scripts/` was modified without updating `runtime-firewall/tool-pins.json`.
- **Resolution**: After verifying the code change is authentic, run `node runtime-firewall/verify.js --update`.

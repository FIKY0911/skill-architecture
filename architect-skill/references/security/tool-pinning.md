# Cryptographic Tool Pinning & Supply Chain Integrity

**Standard**: SLSA (Supply-chain Levels for Software Artifacts) Level 3 & MCP Tool Integrity  
**Target Subsystem**: `architect-skill/runtime-firewall/`

---

## 1. Threat Model: Rug-Pull & Silent Drift Attacks

In multi-agent and MCP (Model Context Protocol) ecosystems, external tools or scripts may be modified after initial approval:
- **Tool Rug-Pull**: An external server or local script is altered between turns to exfiltrate workspace files.
- **Schema Poisoning**: Tool descriptions or parameter schemas are mutated to trick the agent into passing sensitive files as arguments.

---

## 2. SHA-256 Digest Pinning Architecture

`architect-skill` maintains an immutable cryptographic registry in `runtime-firewall/tool-pins.json`:

```json
{
  "version": "1.0.0",
  "algorithm": "SHA-256",
  "pins": {
    "scripts/secret-scan.js": "<sha256-digest>",
    "scripts/egress-guard.js": "<sha256-digest>",
    "scripts/sanitize-input.js": "<sha256-digest>"
  }
}
```

### Verification Lifecycle (`runtime-firewall/verify.js`)
1. Prior to executing any internal script or external tool, `verify.js` reads the target file bytes from disk.
2. Computes `crypto.createHash('sha256').update(bytes).digest('hex')`.
3. Compares the computed digest against `tool-pins.json` using constant-time comparison (`crypto.timingSafeEqual`).
4. If a mismatch or unpinned tool is detected, execution halts immediately with exit code `1` and logs a `TOOL_PIN_MISMATCH` security alert.

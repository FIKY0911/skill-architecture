# Zero-Trust Caller Model (Agent as Untrusted Actor)

**Standard**: NIST SP 800-207 (Zero Trust Architecture)  
**Target Subsystem**: `architect-skill` Trust & Validation Layer

---

## 1. Principle: The AI Agent is an Untrusted Caller

In an AI-assisted software engineering environment, the LLM or agent orchestrator can be influenced by:
- Indirect prompt injection inside third-party repository files.
- Context window confusion or path hallucination.
- Accidental inclusion of sensitive environment variables or host paths.

Therefore, `architect-skill` never trusts parameters passed by the AI agent implicitly. Every script, file path, and template variable is validated against deterministic security invariants before execution.

---

## 2. Trust Boundaries & Enforcement Gates

| Trust Boundary | Untrusted Input | Enforcement Gate | Failure Action |
| :--- | :--- | :--- | :--- |
| **Filesystem Boundary** | File paths passed to scripts | `scripts/sanitize-input.js` + `policies/filesystem-scope.json` | Reject traversal (`../`), null bytes, and blocked patterns (`.env`, `*.pem`). |
| **Content Boundary** | Generated Markdown / Mermaid text | `scripts/secret-scan.js` | Redact credentials to `[REDACTED:<TYPE>]` or abort with exit code `1`. |
| **Network Boundary** | Script runtime execution | `scripts/egress-guard.js` | Throw `ERR_ZERO_EGRESS_BLOCKED` on any socket/HTTP/DNS call. |
| **Tool Integrity Boundary** | Script / MCP tool invocation | `runtime-firewall/verify.js` | Verify SHA-256 digest against `tool-pins.json` before execution. |

---

## 3. Principle of Least Privilege

1. **Read Scope**: Restricted strictly to `./assets/`, `./references/`, `./policies/`, `./templates/`, and `./docs/`.
2. **Write Scope**: Restricted strictly to `./docs/` and `~/.architect-skill-backup/`.
3. **Environment Scope**: Scripts scrub `process.env` of sensitive keys (`AWS_*`, `OPENAI_*`, `ANTHROPIC_*`, `GEMINI_*`, `GITHUB_*`, `*TOKEN*`, `*SECRET*`, `*KEY*`, `*PASSWORD*`) upon initialization.

# Security Policy: architect-skill

## 1. Security Overview and Philosophy

`architect-skill` is engineered from the ground up for high-trust environments. Unlike traditional AI extensions that rely on external cloud gateways or execute unverified third-party code, `architect-skill` enforces a strict **Zero-Trust, Zero-Egress, Local-First** operational boundary.

### Core Security Guarantees:
- **Zero-Egress Execution**: Total absence of outbound network requests. No external API calls, no remote telemetry beacons, no analytics collection.
- **Zero-Credential Access**: Absolute prohibition on reading, parsing, or transmitting user credentials, secret environment files, or agent authentication tokens.
- **Deterministic Sandboxing**: Optional Linux Landlock LSM, container `--network=none`, and microVM confinement layers.
- **Cryptographic Tool Pinning**: Verification of all scripts and tool schemas using SHA-256 integrity digests prior to execution.

---

## 2. Threat Model and Boundary Analysis

The threat model of `architect-skill` is evaluated against the Microsoft STRIDE methodology:

| Threat Category | Primary Risk Vector | Countermeasure Implemented |
|---|---|---|
| **Spoofing** | Rogue script pretending to be a verified skill component | SHA-256 cryptographic tool pinning in `runtime-firewall/verify.js` |
| **Tampering** | Unauthorized modification of templates or output files | Filesystem scoping rules (`policies/filesystem-scope.json`) restricting writes to `./docs/` |
| **Repudiation** | Unaudited generation of production architecture specifications | Append-only local audit logging (`docs/.architect-audit.log`) without credential leakage |
| **Information Disclosure** | Exfiltration of `.env` files, API keys, or private keys | Multi-layer regex secret scanner (`scripts/secret-scan.js`) and `.gitignore` policy |
| **Denial of Service** | Resource exhaustion or disk flooding via malicious input | Strict input sanitization (`scripts/sanitize-input.js`) and path traversal protection |
| **Elevation of Privilege** | Agent executing arbitrary system commands or network sockets | Runtime monkey-patch guard (`scripts/egress-guard.js`) and unprivileged container UID `10001` |

---

## 3. Absolute Credential Protection Policy

`architect-skill` enforces strict barriers against credential handling:

1. **Restricted Filesystem Paths**:
   The skill is strictly forbidden from accessing, reading, or processing:
   - Environment configurations: `.env`, `.env.*`, `*.env`
   - Private keys and certificates: `*.pem`, `*.key`, `*.keystore`, `*.crt`, `*.p12`, `*.pfx`, `id_rsa*`, `id_ed25519*`
   - Secret directories: `secrets/`, `credentials/`, `private/`, `~/.ssh/`, `~/.aws/`
   - Agent session tokens: `~/.claude/auth*`, `~/.cursor/**`
2. **Automated Secret Scanning**:
   All user inputs and generated artifacts must pass through `scripts/secret-scan.js`. Any detected credential patterns (AWS keys, GitHub tokens, OpenAI keys, JWT tokens, database connection strings with passwords) are instantly masked with deterministic placeholders:
   - AWS Keys -> `[REDACTED:AWS_KEY]`
   - API Tokens -> `[REDACTED:API_KEY]`
   - Database Passwords -> `[REDACTED:DB_PASSWORD]`
   - Private Keys -> `[REDACTED:PRIVATE_KEY_BLOCK]`

---

## 4. Zero-Egress Runtime Guard

Outbound network traffic is neutralized at multiple layers:
1. **Node.js Runtime Boundary**: `scripts/egress-guard.js` monkey-patches `net.Socket`, `tls.connect`, `http.request`, `https.request`, `dgram.createSocket`, and `globalThis.fetch`. Any network connection attempt immediately throws `ERR_ZERO_EGRESS_BLOCKED`.
2. **Container Isolation**: When executed via `sandbox/run.sh`, Docker/Podman runs with `--network=none`, `--read-only`, and `--cap-drop=ALL`.
3. **OS Kernel Sandboxing**: Linux Landlock LSM profile blocks the `socket()` syscall for `AF_INET` and `AF_INET6` families.

---

## 5. Vulnerability Reporting and Disclosure Protocol

We take the security of `architect-skill` seriously. If you discover a security vulnerability, we request that you follow responsible disclosure guidelines.

### Reporting Procedure
- **Private Channel**: Please do NOT open a public GitHub issue for security vulnerabilities.
- **Email Contact**: Send encrypted or detailed vulnerability reports to `security@example.com` (or the maintainer's verified security contact).
- **Report Contents**:
  - Detailed description of the vulnerability.
  - Proof-of-concept (PoC) script or reproduction steps.
  - Affected components, scripts, or adapters.
  - Assessment of potential impact and suggested mitigation.

### Response Timeline and SLA
- **Initial Acknowledgment**: Within 24 hours of receipt.
- **Triage and Impact Assessment**: Within 48 hours.
- **Fix and Patch Release**: Within 7 business days for critical vulnerabilities.
- **Public Disclosure**: Coordinated public disclosure following release of the patch.

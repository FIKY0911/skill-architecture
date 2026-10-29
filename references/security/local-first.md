# Local-First & Zero-Egress Architecture

**Standard**: Ink & Switch Local-First Software Principles & Zero-Egress Runtime Confinement  
**Target Subsystem**: `architect-skill` Execution & Network Containment

---

## 1. The Seven Ideals of Local-First Software Applied to AI Skills

1. **No Spinners / Instant Local Execution**: All reference templates, Mermaid validators, and structure checks execute directly against local disk I/O with zero network round-trip latency.
2. **Your Work is Not Trapped on a Remote Server**: Generated artifacts reside in `./docs/` in standard Markdown (`.md`), Mermaid (`.mmd`), and JSON formats.
3. **The Network is Optional (Strict Offline Operation)**: `architect-skill` operates with 100% feature parity inside air-gapped environments or containers launched with `--network=none`.
4. **Seamless Collaboration via Git**: Plain-text UTF-8 LF-normalized outputs integrate cleanly with Git branches, pull requests, and line-level code review.
5. **The Long Now**: Zero proprietary binary formats. Files remain readable decades into the future without SaaS subscriptions.
6. **Security & Privacy by Default**: Because no bytes ever leave the workstation, exfiltration via network egress is structurally impossible.
7. **User Retain Ultimate Ownership & Control**: No background daemons, telemetry pings, or remote version checks.

---

## 2. Zero-Egress Enforcement Architecture

`architect-skill` enforces `zero-egress` across three defense-in-depth layers:

### Layer 1: Runtime Socket Monkey-Patching (`scripts/egress-guard.js`)
Before any validation or lifecycle script executes, `egress-guard.js` overrides Node.js built-in networking primitives:
- `net.Socket.prototype.connect`
- `net.connect` / `net.createConnection`
- `http.request` / `http.get`
- `https.request` / `https.get`
- `tls.connect`
- `dgram.createSocket`
- `dns.lookup` / `dns.resolve`
- `globalThis.fetch`

Any invocation throws a deterministic `Error` with `code = 'ERR_ZERO_EGRESS_BLOCKED'`.

### Layer 2: Policy Allowlist (`policies/network-allowlist.json`)
The network allowlist defaults to an empty array `[]`. Even if a tool attempts to query the policy file, zero external hosts are permitted.

### Layer 3: OS / Container Network Namespace Isolation (`sandbox/run.sh`)
When executed via the container wrapper, the Linux kernel unshares the network namespace (`--network=none`), dropping all network interfaces except the isolated local loopback (`lo`).

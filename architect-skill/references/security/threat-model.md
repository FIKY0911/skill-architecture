# Threat Modeling and Risk Assessment Reference Specification

## Standard: Microsoft STRIDE Methodology, DFD Trust Boundaries, and DREAD Scoring
This document establishes the authoritative security engineering standard for Threat Modeling within `architect-skill`. It formalizes the application of the Microsoft STRIDE model across Data Flow Diagram (DFD) elements, defines Zero-Trust boundary mapping, details quantitative risk evaluation via DREAD, and maps attack trees to concrete architectural countermeasures.

---

## 1. The STRIDE Threat Taxonomy

Threat modeling identifies architectural vulnerabilities during the design phase before code deployment. The STRIDE framework categorizes threats based on the security property violated:

```
+-------------------------------------------------------------------------+
| STRIDE CATEGORIZATION & SECURITY PROPERTY VIOLATED                      |
|                                                                         |
|  [S] Spoofing Identity          --> Violates Authentication             |
|  [T] Tampering with Data        --> Violates Integrity                  |
|  [R] Repudiation                --> Violates Non-Repudiation            |
|  [I] Information Disclosure     --> Violates Confidentiality            |
|  [D] Denial of Service          --> Violates Availability               |
|  [E] Elevation of Privilege     --> Violates Authorization              |
+-------------------------------------------------------------------------+
```

### STRIDE Definitions in Multi-Agent & Tooling Contexts
1. **Spoofing Identity**: An attacker or rogue script masquerades as an authorized user, agent adapter, or trusted tool provider.
2. **Tampering with Data**: Unauthorized modification of configuration files, prompt templates, local audit logs, or generated `./docs/` artifacts.
3. **Repudiation**: An actor executes an unauthorized or destructive action (e.g., deleting a database table or modifying security policies) without an immutable audit trail.
4. **Information Disclosure**: Unintentional exfiltration of environment credentials, private API keys, or proprietary source code to external servers or untrusted model contexts.
5. **Denial of Service**: Exhaustion of local disk storage, infinite regex processing loops (ReDoS), or memory exhaustion causing agent crashes.
6. **Elevation of Privilege**: An unprivileged tool script escapes sandboxing to execute arbitrary operating system commands as the host root/user.

---

## 2. Data Flow Diagram (DFD) Element Mapping

STRIDE applies systematically to the five fundamental elements of Data Flow Diagrams:

```
+-------------------------------------------------------------------------+
| ELEMENT-TO-THREAT MATRIX                                                |
|                                                                         |
| DFD Element         | S | T | R | I | D | E | Standard Security Control |
|---------------------|---|---|---|---|---|---|---------------------------|
| External Entity     | X |   | X |   |   |   | Strong Mutual Auth, Signatures
| Data Flow           |   | X |   | X | X |   | TLS, Message Hashes, Nonces |
| Data Store          |   | X | X | X | X |   | Encryption at Rest, ACLs  |
| Process / Function  | X | X | X | X | X | X | Sandboxing, Least Privilege |
| Trust Boundary      | Cross-boundary inspection required for all threats|
+-------------------------------------------------------------------------+
```

### Trust Boundary Mapping in `architect-skill`
A Trust Boundary separates entities possessing different levels of privilege. In `architect-skill`, three distinct trust boundaries are strictly enforced:

```
[HOST SYSTEM / OPERATING SYSTEM ENVIRONMENT]
  |
  |=== (Trust Boundary 1: Filesystem Scoping) ===
  v
[ARCHITECT-SKILL LOCAL RUNTIME / NODE.JS PROCESS]
  |
  |=== (Trust Boundary 2: Sandbox / Egress Guard) ===
  v
[UNTRUSTED EXTERNAL INPUTS / LLM CONTEXT / TOOL SCRIPTS]
```

1. **Boundary 1 (Agent vs Host OS)**: The agent operates with zero knowledge of the host environment variables (`.env`, SSH keys in `~/.ssh/`, cloud credentials in `~/.aws/`).
2. **Boundary 2 (Process vs Network Egress)**: The runtime process is intercepted by an Egress Guard, completely blocking network sockets.
3. **Boundary 3 (Input Sanitization)**: All inputs crossing from user prompts or external documents are treated as untrusted text strings.

---

## 3. Quantitative Risk Scoring: The DREAD Model

To prioritize vulnerabilities objectively, calculate the composite DREAD score on a 1-to-10 integer scale across five dimensions:

$$\text{DREAD Score} = \frac{\text{Damage} + \text{Reproducibility} + \text{Exploitability} + \text{Affected Users} + \text{Discoverability}}{5}$$

### Scoring Dimensions
1. **Damage Potential (D)**: How severe is the impact if the exploit succeeds? (0 = None, 5 = Data leakage, 10 = Complete system takeover).
2. **Reproducibility (R)**: How easily can the attack be reproduced? (0 = Impractical/Theoretic, 5 = Complex timing window, 10 = Deterministic script).
3. **Exploitability (E)**: What technical skill is required to execute the exploit? (0 = Advanced nation-state exploit, 5 = Experienced hacker, 10 = Script kiddie / simple cURL).
4. **Affected Users (A)**: What percentage of users are impacted? (0 = None, 5 = Specific edge cases, 10 = All users globally).
5. **Discoverability (D)**: How easy is it for an adversary to discover the flaw? (0 = Hidden obscure logic, 5 = Requires decompilation, 10 = Publicly visible in cleartext).

### Risk Classification Tiers
- Composite Score 8.0 to 10.0: **CRITICAL** (Block release; immediate mitigation required).
- Composite Score 6.0 to 7.9: **HIGH** (Must resolve before general production availability).
- Composite Score 4.0 to 5.9: **MEDIUM** (Schedule in upcoming development sprint).
- Composite Score 0.0 to 3.9: **LOW** (Accept risk or document operational workaround).

---

## 4. Attack Trees and Architectural Countermeasures

An Attack Tree models an adversary's paths to achieve a malicious objective. Below is the formal attack tree for credential exfiltration:

```
Goal: Exfiltrate Application Secrets via AI Agent Tooling
 ├── 1. Read Host File System Secrets
 │    ├── 1.1 Path Traversal (e.g., ../../.env)
 │    │    └── Mitigation: Path Sanitizer (`sanitize-input.js`), Filesystem Scope
 │    └── 1.2 Accessing Private Keys (*.pem, *.key)
 │         └── Mitigation: Regex Deny Rules, Gitignore Exclusions
 ├── 2. Extract Secrets from LLM Context / Prompts
 │    ├── 2.1 Indirect Prompt Injection
 │    │    └── Mitigation: Structured Delimiters, Taint Analysis
 │    └── 2.2 Re-printing Ingested Tokens to Generated Output
 │         └── Mitigation: Automated Redaction Engine (`secret-scan.js`)
 └── 3. Transmit Captured Secrets Over Network
      ├── 3.1 HTTP POST to Malicious Webhook
      │    └── Mitigation: Zero-Egress Guard (`egress-guard.js`)
      └── 3.2 DNS Exfiltration (UDP Port 53)
           └── Mitigation: Sandboxed Socket Interception, Network Namespace Confinement
```

---

## 5. Threat Model Register Example

| Threat ID | Threat Category | Threat Scenario | D | R | E | A | D | Total | Severity | Architectural Countermeasure |
|---|---|---|---|---|---|---|---|---|---|---|
| `THR-001` | Information Disclosure | Tool script scans project tree and logs AWS Secret Key to generated documentation. | 9 | 10 | 8 | 10 | 9 | **9.2** | **CRITICAL** | Pre-write regex secret scanning with automated masking to `[REDACTED:AWS_KEY]`. |
| `THR-002` | Tampering | Malicious prompt uses `../../etc/passwd` path traversal during wizard execution. | 8 | 9 | 8 | 8 | 7 | **8.0** | **CRITICAL** | Path normalization stripping `../` sequences and restricting writes strictly to `./docs/`. |
| `THR-003` | Denial of Service | Unbounded regular expression triggers catastrophic backtracking (ReDoS) during scan. | 6 | 7 | 5 | 10 | 4 | **6.4** | **HIGH** | Compile regexes with atomic groups and enforce input length upper bounds. |
| `THR-004` | Elevation of Privilege | Modified third-party npm package replaces local utility with root shell command. | 10 | 4 | 3 | 10 | 2 | **5.8** | **MEDIUM** | SHA-256 cryptographic tool pinning and Landlock unprivileged confinement. |

---

## 6. Architectural Verification Checklist
When verifying Threat Models:
- [ ] Every Data Flow Diagram element is systematically analyzed against all applicable STRIDE categories.
- [ ] Trust boundaries explicitly isolate the agent, host OS, and external network.
- [ ] Vulnerabilities are ranked quantitatively using the 5-factor DREAD scoring formula.
- [ ] Critical and High severity threats have verified automated countermeasures implemented.
- [ ] The threat model register is audited and re-baselined upon any architectural modification.

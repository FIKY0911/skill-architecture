# TEST_INFRA: End-to-End Testing Infrastructure & Methodology

**Target System**: `architect-skill`  
**Test Suite Path**: `/home/fiky/Documents/Latihan Agent/SKILL/architect-skill/tests/e2e/`  
**Runner Entrypoint**: `node tests/e2e/runner.js`  
**Author / Lead**: E2E Testing Track Engineer (John McCarthy Persona: Formal Logician)  
**Standard**: 4-Tier Requirement-Driven Opaque-Box E2E Testing Framework  
**Integrity Mode**: Local-First, Zero-Egress, Zero-Dependency  

---

## 1. Executive Overview & Test Strategy

The `architect-skill` is an enterprise-grade software architecture orchestration engine operating across 7 AI agent platforms (Claude, Cursor, Continue, Windsurf, Cline, Codex, Antigravity). To guarantee absolute reliability, cryptographic integrity, and zero credential leakage, the test infrastructure adheres to strict **opaque-box, requirement-driven validation**.

### Core Testing Principles
1. **Zero External Dependencies**: All test suites and the test runner run on native Node.js (v18+) standard modules (`assert`, `fs`, `path`, `crypto`, `os`, `child_process`). No external npm packages (Jest, Mocha, Vitest) are required or permitted.
2. **Deterministic Opaque-Box Verification**: Tests treat system components as black boxes, exercising inputs and evaluating observable outputs, file artifacts, and error codes against authoritative specifications in `PROJECT.md`, `spec_repo.md`, `spec_wizard.md`, and `standards_report.md`.
3. **Zero-Egress Isolation**: Tests never establish network connections. The test execution environment is verified to prevent socket egress, DNS requests, and telemetry leakage.
4. **Credential Immunity**: Test fixtures employ exclusively synthetic, dummy credentials. Tests verify that real host credentials (`~/.ssh`, `~/.aws`, `.env`, API keys) are strictly shielded and unreadable by the skill.
5. **Progressive Testability & Graceful Diagnostics**: Tests are structured to validate components as they materialize across milestones, providing precise actionable reports for implementing agents.

---

## 2. Test Architecture & Runner Design

The test harness is driven by `architect-skill/tests/e2e/runner.js`, a standalone, zero-dependency Node.js test runner with colored terminal output, execution timers, granular test isolation, and deterministic exit codes.

### Runner Interface & Capabilities
- **Exit Code Convention**: Exit code `0` on 100% pass; exit code `1` if any test fails.
- **Execution Modes**:
  - Run entire suite: `node tests/e2e/runner.js`
  - Run specific tier: `node tests/e2e/runner.js --tier 1` (or `2`, `3`, `4`)
  - Filter by name pattern: `node tests/e2e/runner.js --filter secret`
  - Verbose output: `node tests/e2e/runner.js --verbose`
- **Output Reporting**: Formatted tier grouping, pass/fail glyphs (`✓` / `✗`), elapsed execution time in milliseconds, error stack traces, and an executive summary table.

```
+-------------------------------------------------------------------------+
|                  architect-skill E2E Test Runner                        |
|                     (node tests/e2e/runner.js)                          |
+------------------------------------+------------------------------------+
                                     |
    +--------------------------------+--------------------------------+
    |                                |                                |
    v                                v                                v
+---------------+            +---------------+            +---------------+
|    Tier 1     |            |    Tier 2     |            |    Tier 3     |
|Feature Isol.  |            |  Boundaries   |            | Combinations  |
+---------------+            +---------------+            +---------------+
                                                              |
                                                              v
                                                      +---------------+
                                                      |    Tier 4     |
                                                      | Real-World    |
                                                      +---------------+
```

---

## 3. Directory Layout & Organization

All E2E test files are co-located under `architect-skill/tests/e2e/`:

```
architect-skill/tests/e2e/
├── runner.js                           # Standalone test runner and CLI harness
├── helpers/
│   ├── test-context.js                 # Isolated temp directories, mock environments
│   └── assertions.js                   # Extended domain assertions (Mermaid, JSON schema, redacting)
├── tier1-features/
│   ├── manifest.test.js                # Core root metadata & skill.yaml verification
│   ├── adapters.test.js                # 7 AI agent adapter syntax and configuration
│   ├── references.test.js              # PRD, BRD, SRD, architecture, and system design refs
│   ├── uml-assets.test.js              # Raw Mermaid UML templates syntax & structure
│   ├── ui-guides.test.js               # UI library guides & 8 senior frontend aesthetic tokens
│   └── scripts.test.js                 # Zero-dependency Node.js scripts unit & CLI contracts
├── tier2-boundaries/
│   ├── limits-empty.test.js            # Empty files, 0-byte inputs, extreme input sizes
│   ├── malformed-inputs.test.js        # Corrupt JSON, broken frontmatter, invalid syntax
│   ├── path-traversal.test.js          # Traversal attacks (../, %00, absolute paths, illegal chars)
│   ├── secret-detection.test.js        # Regex boundary anchors, false-positive resistance
│   └── mermaid-syntax.test.js          # Unclosed brackets, illegal tokens, diagram malformations
├── tier3-combinations/
│   ├── wizard-output.test.js           # Multi-stage wizard state -> output artifact compilation
│   ├── install-adapters.test.js        # Multi-agent installer -> symlink/copy & backup pipeline
│   └── secret-redaction-pipeline.test.js# Secret detection -> masking -> backup -> clean verification
└── tier4-scenarios/
    ├── ecommerce-platform.test.js      # Full e-commerce platform architecture generation scenario
    └── fintech-settlement.test.js      # Enterprise fintech banking settlement architecture scenario
```

---

## 4. 4-Tier Test Categorization Matrix

### Tier 1: Feature Coverage (Isolated Functional Verification)
Verifies all inventoried features in isolation, with a minimum of 5 tests per core capability.

| Capability Area | Minimum Tests | Primary Assertions | Target Source Files |
|---|---|---|---|
| **Root Metadata & Manifest** | 6 | Schema version, 7 platforms registered, permissions (egress: none, forbidden secret patterns), governance files presence | `skill.yaml`, `SKILL.md`, `README.md`, `LICENSE`, `.gitignore` |
| **Agent Adapters** | 7 | XML tag syntax for Claude, MDC frontmatter for Cursor, slash command for Continue, Windsurf cascade rules, Cline autonomy, Codex CLI, Antigravity skill structure, matrix table | `adapters/*` |
| **Industry References** | 6 | Atlassian PRD structure, BABOK BRD financial/RACI formulas, ISO 29148 SRD EARS syntax & verification matrix, Clean Architecture layer rules, Kleppmann fencing tokens, STRIDE threat models | `references/requirements/*`, `references/architecture/*`, `references/system-design/*`, `references/security/*` |
| **Raw UML Assets** | 6 | Valid Mermaid keywords, correct syntax for Sequence, ERD, State, C4 Container, Activity, zero credential leakage | `assets/uml/*.mmd` |
| **UI Guides & FE Aesthetics** | 6 | 6 UI library guides, 8 senior frontend aesthetic token sets (Neubrutalism, Bento Grid, Glassmorphism, Swiss, Clean SaaS, Material 3, Neumorphism, Retro Terminal), WCAG accessibility warnings | `assets/ui/ui-libraries.md`, `assets/ui/fe-aesthetics.md` |
| **Zero-Egress & Utility Scripts** | 7 | Script syntax (`node -c`), programmatic exports, CLI flags (`--help`, `--dry-run`), secret detection, socket interception, input sanitization | `scripts/*.js` |

### Tier 2: Boundary & Corner Cases
Verifies resilience against extreme inputs, malicious payloads, and edge conditions.

| Test Focus | Test Conditions | Expected System Behavior |
|---|---|---|
| **Empty Inputs** | 0-byte files, empty string prompt, empty JSON `{}` | Graceful degradation, informative error messages, no unhandled exceptions |
| **Extreme Lengths** | 10,000 line markdown file, 1,000 entity names, 1MB prompt string | Efficient streaming/chunking, no memory exhaustion or event loop freezing |
| **Malformed Schemas** | Corrupted JSON state, invalid YAML frontmatter, truncated files | Rejection with specific line/column diagnostics, fallback to clean initialization |
| **Path Traversal Attacks** | `../../etc/passwd`, `..\\..\\windows\\system32`, `docs/../../malicious.md`, null byte `%00` | Hard rejection by `sanitize-input.js` and `policies/filesystem-scope.json` |
| **Secret Detection Precision** | AWS keys, GitHub tokens, JWTs, private keys, passwords vs benign UUIDs, commit hashes, clean DB URLs | 100% true-positive recall on credentials, 0 false-positives on standard identifiers |
| **Mermaid Syntax Boundaries** | Missing `end` in `alt`/`opt`, unclosed entity brackets, missing semicolons, unknown diagram types | `validate-mermaid.js` flags line number and syntax error, halting generation |

### Tier 3: Cross-Feature Combinations (Integration Pipelines)
Verifies multi-component workflows where the output of one subsystem feeds into the input of another.

| Pipeline | Steps Verified | Verification Invariant |
|---|---|---|
| **Wizard State -> Output Generation** | `init` -> `set` responses -> template hydration -> `record-file` -> `finalize` | `.architect-manifest.json` matches generated files and SHA-256 digests; all `./docs/` artifacts match template structure |
| **Installer -> Adapter Symlinks -> Backups** | `install.js --dry-run` -> `install.js --local` -> overwrite existing -> verify backup | Backups created in `~/.architect-skill-backup/<timestamp>/`; installed files match source adapters |
| **Secret Scan -> Redaction -> Verification** | Dirty artifact created -> `secret-scan.js --mask` -> verify replacement -> verify backup | Clean file contains `[REDACTED:<TYPE>]`; backup preserves original; re-scan yields clean status |
| **Input Sanitizer -> Path Scope -> File Write** | User provides project name with illegal chars and path traversal -> sanitize -> write | Path resolved safely inside `./docs/`; unauthorized destinations rejected |

### Tier 4: Real-World Application Scenarios
Executes comprehensive end-to-end simulations of actual real-world architectural engagements.

1. **Scenario 1: Comprehensive E-Commerce Platform**
   - *Domain*: High-traffic B2C Retail E-Commerce
   - *Architecture*: Modular Monolith / Clean Architecture with boundary crossing DTOs
   - *Requirements*: Atlassian PRD for Checkout, Product Catalog, Inventory, and Payment Webhook
   - *System Design*: Redis caching with XFetch probabilistic early expiration, PostgreSQL read-replicas
   - *Diagrams*: C4 Container, Relational ERD (10 entities), Checkout Sequence Diagram
   - *UI*: Tailwind CSS + shadcn/ui with Bento Grid / Modern SaaS aesthetic
   - *Security Audit*: 100% zero credential leakage across all generated artifacts; zero network requests

2. **Scenario 2: Mission-Critical Fintech Banking Settlement System**
   - *Domain*: Enterprise Core Banking & Interbank Settlement
   - *Architecture*: Event-Driven Architecture with Transactional Outbox Pattern
   - *Requirements*: BABOK BRD (RACI matrix, financial ROI, PCI-DSS compliance), ISO/IEC/IEEE 29148:2018 SRD (EARS syntax, verification matrix)
   - *System Design*: Distributed locking with Martin Kleppmann fencing tokens, Kafka DLQ with exponential jitter backoff, Redis Sliding Window Counter rate limiting
   - *Diagrams*: C4 Container, Double-entry Ledger ERD, Payment Settlement Sequence with rollback, State Machine
   - *UI*: Swiss Editorial / Clean SaaS Enterprise design tokens
   - *Security Audit*: Append-only `.architect-audit.log` verification, Landlock profile adherence, zero network egress enforced by `egress-guard.js`

---

## 5. Execution Command Reference

```bash
# Run complete test suite (all tiers)
node tests/e2e/runner.js

# Run specific tier
node tests/e2e/runner.js --tier 1
node tests/e2e/runner.js --tier 2
node tests/e2e/runner.js --tier 3
node tests/e2e/runner.js --tier 4

# Run with verbose diagnostic output
node tests/e2e/runner.js --verbose

# Run specific test file directly
node tests/e2e/tier1-features/manifest.test.js
node tests/e2e/tier2-boundaries/secret-detection.test.js
node tests/e2e/tier3-combinations/wizard-output.test.js
node tests/e2e/tier4-scenarios/fintech-settlement.test.js
```

---

## 6. Assertion Framework & Oracle Specifications

To maintain zero dependencies while providing high-fidelity diagnostics, the test harness implements domain-specific assertions in `helpers/assertions.js`:

- `assertJsonSchema(data, schema)`: Verifies object structure, required fields, and types without third-party schema validators.
- `assertMermaidValid(content)`: Evaluates bracket stacks, diagram keywords, node definitions, and token integrity.
- `assertSecretRedacted(content)`: Confirms no unredacted AWS keys, GitHub tokens, JWTs, private keys, or passwords exist.
- `assertZeroEgress(fn)`: Executes function under `egress-guard` monkey patch and asserts that any network attempt throws `EgressBlockedError`.
- `assertDirectoryTree(dir, expectedFiles)`: Validates full directory structure against expected layout.

---

## 7. Quality Gates & Acceptance Thresholds

The E2E test suite defines the ultimate quality gate for project completion:

| Gate Metric | Threshold | Rationale |
|---|---|---|
| **Test Pass Rate** | **100%** | Zero failing tests permitted across all tiers |
| **Flakiness Rate** | **0%** | All tests are fully deterministic with isolated state |
| **Network Egress** | **0 bytes** | Zero network calls permitted during any test execution |
| **Credential Leakage** | **0 findings** | Zero plain credentials tolerated in any generated or tested artifact |
| **Runner Exit Code** | **0** | Clean integration with CI/CD and automated orchestration gates |

When all tests pass, the test suite status is formally published to `/home/fiky/Documents/Latihan Agent/SKILL/TEST_READY.md`.

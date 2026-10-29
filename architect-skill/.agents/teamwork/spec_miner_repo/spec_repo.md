# Comprehensive Repository Blueprint Specification: architect-skill

**Authoritative Source**: `/home/fiky/Documents/Latihan Agent/SKILL/struktur-repo-skill.txt`  
**Complementary Specifications**:
- `/home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/ORIGINAL_REQUEST.md`
- `/home/fiky/Documents/Latihan Agent/SKILL/struktur-instalasi-pengguna.txt`
- `/home/fiky/Documents/Latihan Agent/SKILL/struktur-output-pengguna.txt`  
**Inspection Target**: `/home/fiky/Documents/Latihan Agent/SKILL/architect-skill/`  
**Status**: Specification Minined & Verified  
**Date**: 2026-10-28  

---

## 1. Executive Summary & Existing State Gap Analysis

### 1.1 Blueprint Overview
The `architect-skill` is an enterprise-grade, local-first, zero-egress software architecture generator and specification framework designed to operate across seven major AI agent ecosystems (Claude, Cursor, Continue, Windsurf, Cline, Codex, Antigravity).

It functions on a three-tier operational model:
- **Tier 1 (Triage & Intent Detection)**: Instant recognition of architecture requests and fast-path heuristics.
- **Tier 2 (Interactive Wizard & Presets)**: Structured conversational inquiry covering project type, requirements standard, architectural paradigm, system design patterns, UI framework and visual design aesthetics, generating comprehensive artifacts into `./docs/`.
- **Tier 3 (Authoritative Knowledge Base & Tooling)**: Exhaustive references, raw Mermaid UML templates, zero-dependency Node.js validation utilities, runtime firewalls, and sandboxed execution environments.

### 1.2 Current Filesystem State
Direct empirical inspection of `/home/fiky/Documents/Latihan Agent/SKILL/architect-skill/` reveals:
- **Total Existing Subdirectories**: 32 leaf directories present.
- **Total Existing Files**: 0 files present.
- **Finding**: The directory skeleton has been scaffolded, but all 106 specification files remain to be implemented.

```
architect-skill/ (Current State: 32 directories, 0 files)
├── .github/workflows/ [EMPTY]
├── adapters/
│   ├── antigravity/ [EMPTY]
│   ├── claude/ [EMPTY]
│   ├── cline/ [EMPTY]
│   ├── codex/ [EMPTY]
│   ├── continue/ [EMPTY]
│   ├── cursor/ [EMPTY]
│   └── windsurf/ [EMPTY]
├── assets/
│   ├── output/
│   │   ├── adr/ [EMPTY]
│   │   ├── architecture/ [EMPTY]
│   │   ├── diagrams/ [EMPTY]
│   │   ├── requirements/ [EMPTY]
│   │   ├── system-design/ [EMPTY]
│   │   └── ui/ [EMPTY]
│   ├── ui/ [EMPTY]
│   └── uml/ [EMPTY]
├── broker/ [EMPTY]
├── docs/ [EMPTY]
├── policies/ [EMPTY]
├── references/
│   ├── architecture/ [EMPTY]
│   ├── requirements/ [EMPTY]
│   ├── security/ [EMPTY]
│   └── system-design/ [EMPTY]
├── runtime-firewall/ [EMPTY]
├── sandbox/ [EMPTY]
├── scripts/ [EMPTY]
├── templates/skill-template/
│   ├── assets/ [EMPTY]
│   ├── references/ [EMPTY]
│   └── scripts/ [EMPTY]
└── tests/fixtures/
    ├── mermaid/ [EMPTY]
    ├── secrets/ [EMPTY]
    └── wizard/ [EMPTY]
```

---

## 2. Complete File Inventory Categorized by Subsystem

The blueprint defines **13 distinct subsystems** comprising **106 unique files**.

### Summary Matrix

| # | Subsystem | Directory Path | File Count | Purpose |
|---|-----------|----------------|------------|---------|
| 1 | Core Root & Metadata | `architect-skill/` | 11 | Orchestrator, manifest, licensing, docs, git/editor config |
| 2 | Agent Adapters | `architect-skill/adapters/` | 8 | Target agent custom instruction files and compatibility matrix |
| 3 | Industry References | `architect-skill/references/` | 20 | Authoritative standards (Requirements, Architecture, System Design, Security) |
| 4 | Asset Templates | `architect-skill/assets/` | 23 | Mermaid UML, UI framework guides, and output `./docs/` templates |
| 5 | Validation & Utility Scripts | `architect-skill/scripts/` | 11 | Zero-dependency Node.js verification and lifecycle scripts |
| 6 | Execution Sandbox | `architect-skill/sandbox/` | 4 | Landlock, Docker, and microVM containment scripts |
| 7 | Credential Broker | `architect-skill/broker/` | 4 | Zero-knowledge lease-based proxy and intake form |
| 8 | Runtime Firewall | `architect-skill/runtime-firewall/` | 4 | MCP tool SHA-256 integrity verification and deny-by-default rules |
| 9 | Security Policies | `architect-skill/policies/` | 3 | Allowlist, redaction rules, and filesystem scoping policies |
| 10 | Skill Templates | `architect-skill/templates/` | 5 | Blueprint for scaffolding new skills |
| 11 | Automated Test Suite | `architect-skill/tests/` | 7 | Offline, secret-scan, install, output tests, and test fixtures |
| 12 | CI/CD Workflows | `architect-skill/.github/workflows/` | 3 | Automated lint, offline execution test, and security workflows |
| 13 | Repository Documentation | `architect-skill/docs/` | 6 | Operational guides, troubleshooting, and comparison manuals |
| **Total** | | | **106** | Complete enterprise skill specification |

---

## 3. Subsystem Breakdown: Roles, Responsibilities, and Content Structures

### Subsystem 1: Core Root & Metadata (11 Files)

#### 1. `architect-skill/SKILL.md`
- **Role**: Primary orchestrator and brain of the skill.
- **Responsibilities**:
  - Implements Tier 1 rapid prompt classification (identifies architecture, system design, PRD, or UI queries).
  - Implements Tier 2 interactive wizard protocol: asks targeted questions, offers presets (Full-Stack Web, Mobile Offline-First, Event-Driven Microservices, Modular Monolith, CLI Tool), and manages user dialogue state.
  - Coordinates artifact generation into `./docs/` following `struktur-output-pengguna.txt`.
  - Enforces mandatory validation runs (`validate-structure.js`, `validate-mermaid.js`, `secret-scan.js`) before completing turn.
- **Expected Structure**:
  - Frontmatter metadata (`name: architect-skill`, `description: ...`, `version: 1.0.0`).
  - System Prompt framing and persona definition.
  - Phase 1: Context Detection and Triage rules.
  - Phase 2: Interactive Wizard Protocol (Questions Q1-Q8, Presets A-E).
  - Phase 3: Artifact Generation Pipeline (Requirements -> Architecture -> System Design -> UML -> UI -> ADRs).
  - Phase 4: Verification and Quality Gate checklist.

#### 2. `architect-skill/skill.yaml`
- **Role**: Machine-readable skill manifest and compatibility declaration.
- **Responsibilities**:
  - Declares schema version, skill name, semantic version, author, description, tags.
  - Defines supported agent platforms and minimum version constraints.
  - Declares permissions (local filesystem `./docs/` read/write, zero network access).
  - Lists internal script entrypoints and policy definitions.
- **Expected Structure**:
  - `schema_version: "1.0"`
  - `metadata`: `name`, `version`, `author`, `license`, `repository`
  - `compatibility`: `claude`, `cursor`, `continue`, `windsurf`, `cline`, `codex`, `antigravity`
  - `permissions`: `network: none`, `filesystem: [ "./docs/**", "~/.architect-skill-backup/**" ]`
  - `entrypoints`: path mappings to validation and lifecycle scripts

#### 3. `architect-skill/README.md`
- **Role**: Main landing documentation for human engineers and agent maintainers.
- **Responsibilities**:
  - High-level overview, architecture diagrams, quickstart commands, installation instructions, agent support table, directory tree explanation, output preview.
- **Expected Structure**:
  - Hero header and badges (Zero-Egress, Node.js >= 18, Multi-Agent).
  - Overview & Core Philosophies (Zero-Assumption, Local-First, Formally Verified).
  - Installation (Global vs Local Project via `install.js` / `install.sh`).
  - Wizard Walkthrough and Presets.
  - Generated Output Structure (`./docs/`).
  - Security and Privacy Highlights.

#### 4. `architect-skill/CHANGELOG.md`
- **Role**: Formal version evolution history.
- **Responsibilities**:
  - Follows Keep a Changelog standard and SemVer 2.0.0 rules.
  - Tracks Added, Changed, Deprecated, Removed, Fixed, Security notes across releases.

#### 5. `architect-skill/CONTRIBUTING.md`
- **Role**: Developer and contributor guidelines.
- **Responsibilities**:
  - Defines contribution process: adding references, updating templates, authoring validation scripts.
  - Mandates reference authenticity: all references must cite authoritative sources (e.g. ISO/IEC/IEEE, BABOK, Martin Fowler, Robert C. Martin).
  - Code style standards (pure Node.js ESM/CJS zero-dependency, LF line endings, 2 spaces).

#### 6. `architect-skill/SECURITY.md`
- **Role**: Security policy and vulnerability disclosure protocol.
- **Responsibilities**:
  - Defines reporting channels and response timelines.
  - Summarizes the threat model, zero-egress guarantee, credential scanning rules, and sandboxing tiers.

#### 7. `architect-skill/PRIVACY.md`
- **Role**: Privacy and data protection statement.
- **Responsibilities**:
  - Affirms zero telemetry, zero analytics, zero outbound network requests.
  - Affirms local data processing: all user project architecture generation occurs entirely on the local machine.

#### 8. `architect-skill/LICENSE`
- **Role**: Legal terms of use.
- **Responsibilities**: Standard permissive open-source license (MIT License text).

#### 9. `architect-skill/.gitignore`
- **Role**: Version control exclusion rules.
- **Responsibilities**:
  - Excludes environment files (`.env`, `.env.*`, `*.env`).
  - Excludes private keys and certificates (`*.pem`, `*.key`, `*.keystore`, `*.crt`).
  - Excludes secret folders (`secrets/`, `credentials/`).
  - Excludes runtime caches, audit logs (`.architect-audit.log`), wizard state (`.wizard-state.json`), backups, node modules, OS artifacts.

#### 10. `architect-skill/.editorconfig`
- **Role**: IDE and editor consistency configuration.
- **Responsibilities**:
  - Enforces `charset = utf-8`, `end_of_line = lf`, `insert_final_newline = true`, `trim_trailing_whitespace = true`.
  - Configures indentation (`indent_style = space`, `indent_size = 2` for js, json, yaml, md).

#### 11. `architect-skill/.gitattributes`
- **Role**: Git repository attribute enforcement.
- **Responsibilities**:
  - Normalizes line endings: `* text=auto eol=lf`.
  - Configures text handling for markdown, json, yaml, and binary formats for images/diagrams.

---

### Subsystem 2: Agent Adapters Subsystem (`adapters/` - 8 Files)

#### 1. `adapters/claude/SKILL.md`
- **Role**: Anthropic Claude Desktop and Claude Code adapter.
- **Responsibilities**: Tailored for Claude syntax using structured XML tags (`<role>`, `<instructions>`, `<guidelines>`, `<context>`).

#### 2. `adapters/cursor/architect-skill.mdc`
- **Role**: Cursor IDE rule adapter.
- **Responsibilities**: Cursor MDC rule format with frontmatter (`description: Software architecture and system design generator`, `globs: **/*`), triggering on architecture-related prompts.

#### 3. `adapters/continue/architect-skill.prompt`
- **Role**: Continue.dev prompt adapter.
- **Responsibilities**: Formatted for Continue prompt system, defining slash command `/architect` and context injection tags.

#### 4. `adapters/windsurf/.windsurfrules`
- **Role**: Codeium Windsurf Cascade rules file.
- **Responsibilities**: Directs Cascade to observe architect-skill constraints, follow wizard steps, and write output strictly to `./docs/`.

#### 5. `adapters/cline/.clinerules`
- **Role**: Cline / Roo-Code rules configuration.
- **Responsibilities**: Configures tool usage guidelines, file editing boundaries, read-only constraints, and validation script execution steps.

#### 6. `adapters/codex/SKILL.md`
- **Role**: OpenAI Codex / generic CLI agent adapter.
- **Responsibilities**: Standalone system prompt instructing the agent on conversational wizard phases and template rendering.

#### 7. `adapters/antigravity/SKILL.md`
- **Role**: Google Antigravity agent adapter.
- **Responsibilities**: Antigravity skill structure with YAML frontmatter, execution workflows, and context loading commands.

#### 8. `adapters/README.md`
- **Role**: Agent compatibility and installation matrix.
- **Responsibilities**:
  - Cross-references `struktur-instalasi-pengguna.txt`.
  - Tables mapping each agent to its global configuration directory and project-local configuration directory.
  - Documents symlink vs copy mechanisms and known agent-specific nuances.

---

### Subsystem 3: References Subsystem (`references/` - 20 Files)

#### Category 1: Requirements Standards (`references/requirements/` - 3 Files)
1. `references/requirements/prd.md`:
   - Standard: Atlassian Product Management PRD framework.
   - Core sections: Executive Summary, Problem Statement, User Personas, Goals vs Non-Goals, User Stories with Gherkin acceptance criteria, Functional Requirements, Non-Functional Requirements, Release Phases, Open Questions.
2. `references/requirements/brd.md`:
   - Standard: BABOK Guide v3 (IIBA).
   - Core sections: Business Need, Enterprise Architecture Alignment, Stakeholder Analysis, Current vs Future State Business Process, Financial/Cost Constraints, Regulatory & Compliance Requirements, Risk Analysis.
3. `references/requirements/srd.md`:
   - Standard: ISO/IEC/IEEE 29148:2018 (Systems and software engineering - Life cycle processes - Requirements engineering, superseding IEEE 830).
   - Core sections: System Operational Context, System Capability Requirements, System External Interface Requirements (API, Hardware, Network), Verification & Validation Criteria, Traceability Matrix.

#### Category 2: Architecture Patterns (`references/architecture/` - 5 Files)
4. `references/architecture/clean-architecture.md`:
   - Standard: Robert C. Martin (Uncle Bob).
   - Core sections: Four concentric rings (Entities, Use Cases, Interface Adapters, Frameworks & Drivers), Dependency Inversion Principle, Boundary crossing via Data Transfer Objects (DTOs), Independent testability without frameworks.
5. `references/architecture/modular-monolith.md`:
   - Standard: Martin Fowler / Kamil Grzybek.
   - Core sections: Bounded contexts within a single deployment unit, strict module boundaries, public API interfaces vs internal implementation, shared kernel rules, database per module (schemas/tables), asynchronous intra-process events.
6. `references/architecture/event-driven.md`:
   - Standard: Enterprise Integration Patterns / Martin Fowler.
   - Core sections: Event Notification vs Event-Carried State Transfer vs Event Sourcing, CQRS segregation, Idempotent consumers with deduplication tables, Outbox Pattern for atomic database-and-event writes, Distributed Saga orchestration vs choreography.
7. `references/architecture/hexagonal.md`:
   - Standard: Alistair Cockburn (Ports & Adapters).
   - Core sections: Application Core, Inbound (Driving) Ports and Adapters, Outbound (Driven) Ports and Adapters, Mocking infrastructure for unit testing.
8. `references/architecture/fsd.md`:
   - Standard: Feature-Sliced Design specification (FSD 2.1).
   - Core sections: Hierarchical layers (app, processes, pages, widgets, features, entities, shared), slice and segment structure, strict unidirectional downward dependency rules, public API re-exports (`index.ts`).

#### Category 3: System Design Patterns (`references/system-design/` - 5 Files)
9. `references/system-design/caching-redis.md`:
   - Standard: High-scale distributed caching best practices.
   - Core sections: Caching topologies (Cache-Aside, Read-Through, Write-Through, Write-Behind), TTL jitter and expiration strategies, Eviction algorithms (volatile-lru, allkeys-lru, allkeys-lfu), Cache stampede prevention (mutex locking, probabilistic early expiration XFetch), Cache penetration protection with Bloom filters.
10. `references/system-design/distributed-locking.md`:
    - Standard: Martin Kleppmann vs Salvatore Sanfilippo distributed lock analysis.
    - Core sections: Mutual exclusion safety invariants, Redlock algorithm limitations under clock drift and GC pauses, Mandatory Fencing Tokens (monotonically increasing integer tokens checked at storage layer), PostgreSQL advisory locks alternative.
11. `references/system-design/rdbms-scaling.md`:
    - Standard: High-throughput relational database scaling patterns.
    - Core sections: Read/Write splitting with read replicas, Replication lag mitigation (sticky sessions for write-after-read consistency), Connection pooling optimization (PgBouncer, HikariCP sizing), Indexing strategies (B-Tree, Partial, Covering, GIN/GiST), Horizontal sharding and range/hash partitioning.
12. `references/system-design/async-message-queue.md`:
    - Standard: Distributed asynchronous messaging patterns (AMQP / Kafka / AWS SQS).
    - Core sections: Message brokers vs Distributed commit logs, Delivery guarantees (at-most-once, at-least-once, exactly-once), Dead Letter Queues (DLQ) and retry policies with exponential backoff, Poison pill quarantine, Consumer backpressure.
13. `references/system-design/rate-limiting.md`:
    - Standard: API gateway and application rate limiting.
    - Core sections: Algorithms comparison (Token Bucket, Leaky Bucket, Fixed Window, Sliding Window Log, Sliding Window Counter), Distributed rate limiting via Redis Lua scripts, Response headers (`X-RateLimit-*`, `Retry-After`), Multi-tier limiting (per IP, per user, per API token).

#### Category 4: Security & Isolation Patterns (`references/security/` - 7 Files)
14. `references/security/threat-model.md`:
    - Standard: Microsoft STRIDE threat modeling methodology.
    - Core sections: Data flow diagrams (DFD), Trust boundaries, Asset identification, Threat categorization (Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege), Countermeasure mapping.
15. `references/security/secret-handling.md`:
    - Standard: NIST SP 800-57 / Zero-Credential Architecture.
    - Core sections: Secret lifecycle, Detection regex patterns, Safe masking via placeholder notation (`{{SECRET_SERVICE_TYPE}}`), Prevention of credential persistence in docs/code, Secure environment injection.
16. `references/security/local-first.md`:
    - Standard: Local-First Software Manifesto (Ink & Switch).
    - Core sections: Seven ideals of local-first software, Zero external network dependencies, Local file sovereignty, Offline capability, Safe local caching without egress.
17. `references/security/trust-model.md`:
    - Standard: Zero-Trust Architecture (NIST SP 800-207).
    - Core sections: "Agent as Untrusted Caller" philosophy, Defensive parameter validation, Least privilege filesystem access, Deterministic output gating.
18. `references/security/sandbox-isolation.md`:
    - Standard: OS kernel and container virtualization security.
    - Core sections: Linux Landlock LSM unprivileged sandboxing, Docker/Podman container confinement (`--network=none`, `--read-only`, non-root UID 10001), microVM isolation (AWS Firecracker, gVisor), Trade-off matrix (startup latency vs security boundary).
19. `references/security/prompt-injection.md`:
    - Standard: OWASP Top 10 for LLMs (LLM01: Prompt Injection).
    - Core sections: Direct vs Indirect prompt injection vectors, Defensive boundary tagging (`<user_input>`, `<system_context>`), Delimiter collision prevention, Output sanitization before rendering templates.
20. `references/security/tool-pinning.md`:
    - Standard: Software Supply Chain Security (SLSA Level 3).
    - Core sections: Cryptographic hash pinning (SHA-256) of executable scripts and tool schemas, Defense against rug-pull attacks and silent upstream tool drift, Immutable execution manifests.

---

### Subsystem 4: Assets Subsystem (`assets/` - 23 Files)

#### Category 1: Raw Mermaid UML Templates (`assets/uml/` - 5 Files)
1. `assets/uml/sequence.mmd`: Sequence diagram template displaying client, API gateway, authentication service, domain service, database, message broker, with synchronous calls, async events, and alt/opt blocks.
2. `assets/uml/erd.mmd`: ERD template with entities, primary keys, foreign keys, relationships (`||--o{`, `||--||`), and data types.
3. `assets/uml/state.mmd`: State diagram template with initial state, compound states, transitions, guard conditions, choice nodes, and terminal state.
4. `assets/uml/c4-container.mmd`: C4 Container diagram template using Mermaid C4 syntax (`Person`, `Container`, `ContainerDb`, `Rel`, `System_Boundary`).
5. `assets/uml/activity.mmd`: Activity flowchart template with branch decisions, error fallbacks, and success termination.

#### Category 2: UI Framework & Senior Frontend Aesthetics Guides (`assets/ui/` - 4 Files)
6. `assets/ui/tailwind-shadcn.md`: Complete Tailwind CSS + shadcn/ui integration guide with Radix UI, CSS custom properties theming, and accessibility primitives.
7. `assets/ui/daisyui.md`: DaisyUI component library integration guide with semantic utility classes and pre-packaged color themes.
8. `assets/ui/mantine.md`: Mantine UI framework integration guide for enterprise React applications with Mantine hooks and theme overrides.
9. `assets/ui/chakra.md`: Chakra UI / Ark UI integration guide for composable, accessible component architectures.
*(Note: Per Requirement R3, UI assets include token dictionaries and Tailwind recipes for 8 curated senior frontend design aesthetics: Neubrutalism, Bento Grid / Linear-style, Glassmorphism & Aurora Gradient, Swiss / International Typographic Style, Modern SaaS Clean Enterprise, Material Design 3, Neumorphism, Retro / Cyberpunk / Terminal).*

#### Category 3: Output Templates for `./docs/` (`assets/output/` - 14 Files)
10. `assets/output/requirements/PRD.template.md`: Template for generating `./docs/requirements/PRD.md`.
11. `assets/output/requirements/BRD.template.md`: Template for generating `./docs/requirements/BRD.md`.
12. `assets/output/requirements/SRD.template.md`: Template for generating `./docs/requirements/SRD.md`.
13. `assets/output/architecture/layer-rules.template.md`: Template for `./docs/architecture/[arch-name]/layer-rules.md`.
14. `assets/output/architecture/directory-tree.template.md`: Template for `./docs/architecture/[arch-name]/directory-tree.md`.
15. `assets/output/architecture/dependency-injection.template.md`: Template for `./docs/architecture/[arch-name]/dependency-injection.md`.
16. `assets/output/system-design/caching-lifecycle.template.md`: Template for `./docs/system-design/[design-name]/caching-lifecycle.md`.
17. `assets/output/system-design/concurrency-locking.template.md`: Template for `./docs/system-design/[design-name]/concurrency-locking.md`.
18. `assets/output/diagrams/README.template.md`: Template for `./docs/diagrams/README.md`.
19. `assets/output/ui/setup-guide.template.md`: Template for `./docs/ui/[ui-name]/setup-guide.md`.
20. `assets/output/ui/theme-tokens.template.md`: Template for `./docs/ui/[ui-name]/theme-tokens.md`.
21. `assets/output/ui/component-registry.template.md`: Template for `./docs/ui/[ui-name]/component-registry.md`.
22. `assets/output/adr/ADR-000.template.md`: Template for `./docs/architecture/decisions/ADR-000-architecture-decision-record.md`.
23. `assets/output/docs-index.template.md`: Template for `./docs/README.md` (root index of generated documentation).
24. `assets/output/manifest.template.json`: Template for `./docs/.architect-manifest.json` (metadata, timestamps, selected wizard options).

---

### Subsystem 5: Scripts Subsystem (`scripts/` - 11 Files)

All scripts are written in standard Node.js without external npm dependencies (`zero-dependency`).

1. `scripts/install.js`:
   - Role: Cross-platform installer.
   - CLI flags: `--global`, `--local`, `--uninstall`, `--dry-run`, `--help`.
   - Responsibilities: Resolves target agent paths per `struktur-instalasi-pengguna.txt`, creates symlinks or copies files, backs up existing configurations to `~/.architect-skill-backup/<timestamp>/`, performs self-check.
2. `scripts/install.sh`:
   - Role: Shell wrapper for Unix systems (Linux/macOS).
   - Responsibilities: Verifies Node.js runtime presence (v18+), checks permissions, forwards arguments to `install.js`.
3. `scripts/validate-mermaid.js`:
   - Role: Mermaid diagram syntax validator.
   - Responsibilities: Parses `.mmd` files for valid keywords (`sequenceDiagram`, `erDiagram`, `stateDiagram-v2`, `C4Context`, `flowchart`), checks unclosed brackets/parentheses/quotes, validates node syntax; falls back to `mmdc` if installed.
4. `scripts/validate-structure.js`:
   - Role: Structural and link validator.
   - Responsibilities: Traverses `./docs/`, verifies markdown frontmatter integrity, checks internal cross-document links, verifies required headings against templates.
5. `scripts/validate-output.js`:
   - Role: Semantic cross-document consistency validator.
   - Responsibilities: Cross-validates entities in PRD against ERD diagram; validates API endpoints in SRD against Sequence diagrams; ensures ADR decisions match architectural choices.
6. `scripts/secret-scan.js`:
   - Role: Credential detection, reporting, and redaction engine.
   - Responsibilities: Loads `policies/redaction-rules.json`, scans specified directories/files, identifies potential API keys, JWTs, AWS credentials, passwords, private keys; supports `--mask` (replaces with placeholder and creates backup) and `--check` (returns exit code 1 if secrets found).
7. `scripts/egress-guard.js`:
   - Role: Zero-egress network enforcement module.
   - Responsibilities: Intercepts Node.js `http`, `https`, `net`, `tls`, `dgram`, `dns`, and global `fetch`; throws hard error on any network connection attempt unless explicitly listed in `policies/network-allowlist.json` (which is empty by default).
8. `scripts/audit-log.js`:
   - Role: Audit logger.
   - Responsibilities: Appends structured JSON lines to `./docs/.architect-audit.log` detailing actions, timestamps, and parameters, ensuring all sensitive parameters are scrubbed prior to writing.
9. `scripts/sanitize-input.js`:
   - Role: Path and parameter sanitizer.
   - Responsibilities: Strips path traversal sequences (`../`, `..\\`), null bytes (`%00`), shell metacharacters, and illegal file characters from wizard user inputs.
10. `scripts/wizard-state.js`:
    - Role: State persistence for multi-turn wizard.
    - Responsibilities: Saves interactive state to temporary local cache, loads prior answers, provides state resumption if conversation is interrupted.
11. `scripts/doctor.js`:
    - Role: Diagnostic and environment health check.
    - Responsibilities: Checks Node.js version, inspects write permissions to `./docs/`, checks agent symlink validity, verifies SHA-256 checksums of all skill scripts, confirms zero-egress compliance.

---

### Subsystem 6: Sandbox Subsystem (`sandbox/` - 4 Files)

1. `sandbox/run.sh`: Linux/macOS container execution script running Docker or Podman with flags: `--network=none`, `--read-only`, `--user=10001:10001`, `--cap-drop=ALL`, mounting `./docs/` as the only writable volume.
2. `sandbox/run.ps1`: Windows PowerShell container execution script providing equivalent flags and volume bindings.
3. `sandbox/Dockerfile`: Ultra-minimal containerfile based on `node:18-alpine` or `distroless`, non-root user, no network utilities (`curl`, `wget`, `nc` removed), read-only root filesystem.
4. `sandbox/README.md`: Architectural specification and comparison document: Landlock LSM vs Docker vs MicroVM (Firecracker/gVisor), detailing security boundary guarantees and operational performance.

---

### Subsystem 7: Credential Broker Subsystem (`broker/` - 4 Files)

1. `broker/broker.js`: Zero-knowledge lease-based proxy; dispenses temporary, scoped mock tokens to agents while maintaining real tokens outside the agent context; sanitizes all inbound/outbound payloads.
2. `broker/intake.js`: Interactive CLI tool allowing developers to register credentials securely into local OS keychain or isolated memory storage, outputting only reference handles (e.g. `ref://db-credentials`) for the skill.
3. `broker/policies.json`: Scoped access policy definitions: `agent -> system -> action -> ttl`.
4. `broker/README.md`: Architectural documentation on zero-knowledge credential handling, memory isolation, and defense against model prompt extraction.

---

### Subsystem 8: Runtime Firewall Subsystem (`runtime-firewall/` - 4 Files)

1. `runtime-firewall/tool-pins.json`: Cryptographic registry containing SHA-256 hashes of all approved tool definitions, script files, and executable commands.
2. `runtime-firewall/policy.yaml`: Default-deny firewall rules regulating tool calls, parameter ranges, and permitted execution contexts.
3. `runtime-firewall/verify.js`: Verification script executed prior to any tool call; computes current SHA-256 hash of tool and script, compares with `tool-pins.json`, and halts execution if tampering or drift is detected.
4. `runtime-firewall/README.md`: Technical documentation explaining supply chain attack vectors (rug-pull attacks, upstream script replacement, parameter injection) and runtime integrity verification.

---

### Subsystem 9: Policies Subsystem (`policies/` - 3 Files)

1. `policies/network-allowlist.json`: Egress allowlist configuration. Default state is strictly empty `[]`, enforcing total offline zero-egress operation.
2. `policies/redaction-rules.json`: Regular expression patterns matching sensitive credential structures (AWS keys, GitHub tokens, Slack webhooks, Generic Private Keys, Database connection strings with passwords, Bearer tokens) mapped to standard placeholders.
3. `policies/filesystem-scope.json`: Filesystem access boundaries restricting write access strictly to `./docs/` and `~/.architect-skill-backup/`, denying read/write access to system directories, parent directories, or credential paths.

---

### Subsystem 10: Skill Templates Subsystem (`templates/` - 5 Files)

1. `templates/skill-template/SKILL.md`: Standard skeleton template for creating a new agent skill.
2. `templates/skill-template/skill.yaml`: Standard manifest skeleton for a new agent skill.
3. `templates/skill-template/references/.gitkeep`: Directory keeper placeholder.
4. `templates/skill-template/assets/.gitkeep`: Directory keeper placeholder.
5. `templates/skill-template/scripts/.gitkeep`: Directory keeper placeholder.

---

### Subsystem 11: Automated Test Suite Subsystem (`tests/` - 7 Items)

1. `tests/fixtures/secrets/`: Directory containing test files with dummy API keys, simulated `.env` files, and dummy private keys for testing `secret-scan.js`.
2. `tests/fixtures/mermaid/`: Directory containing valid `.mmd` diagrams (sequence, ERD, state, C4) and intentionally malformed `.mmd` diagrams for testing `validate-mermaid.js`.
3. `tests/fixtures/wizard/`: Directory containing serialized snapshots of wizard questionnaire responses across different architectural presets.
4. `tests/egress-offline.test.js`: Test suite asserting that any attempt to initiate network connections (`fetch`, `http.get`, `net.connect`) throws immediate security exceptions when running under `egress-guard.js`.
5. `tests/secret-scan.test.js`: Test suite verifying regex detection accuracy, zero false negatives on known credential formats, proper masking behavior, and automated backup generation.
6. `tests/install.test.js`: Test suite validating `--dry-run`, symlink creation, backup folder creation, and uninstallation across platform mocks.
7. `tests/output-integrity.test.js`: Test suite running `validate-structure.js`, `validate-mermaid.js`, and `validate-output.js` against generated output samples to confirm 100% schema compliance.

---

### Subsystem 12: CI/CD Workflows Subsystem (`.github/workflows/` - 3 Files)

1. `.github/workflows/ci.yml`: GitHub Actions workflow executing code style checks, Node.js syntax verification (`node -c`), unit test execution (`node tests/...`), and repository integrity validation.
2. `.github/workflows/offline.yml`: Dedicated workflow executing tests within a network-isolated runner or container (`--network=none`), validating that the entire skill and test suite succeed without internet access.
3. `.github/workflows/security.yml`: GitHub Actions workflow running CodeQL static code analysis, secret audits, and dependency-free integrity checks.

---

### Subsystem 13: Repository Documentation Subsystem (`docs/` - 6 Files)

1. `docs/quickstart.md`: Developer guide for installing, configuring, and invoking `architect-skill` on their IDE of choice.
2. `docs/advanced-usage.md`: Comprehensive manual on customizing wizard presets, authoring custom output templates, integrating external microservices, and invoking advanced validation flags.
3. `docs/skill-vs-plugin-vs-mcp.md`: Authoritative architectural whitepaper clarifying the conceptual boundaries, security isolation, latency characteristics, and lifecycle differences between Agent Skills, IDE Plugins, and Model Context Protocol (MCP) servers.
4. `docs/compatibility.md`: Detailed compatibility matrix listing supported agent platforms, configuration file locations, operating system considerations (Linux, macOS, Windows/WSL), and symlink permissions.
5. `docs/troubleshooting.md`: Exhaustive guide to common installation errors, invalid diagram syntax, secret scan false positives, permission denied errors, and recovery procedures.
6. `docs/migration.md`: Guidelines and procedures for migrating generated `./docs/` structures across major versions of `architect-skill`.

---

## 4. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Orchestration | Tier 1 Fast Triage | Automatically detects architectural queries in agent chat and offers immediate preset activation. | User prompt string | Triage classification & quick-start prompt | Falls back to full Tier 2 wizard on ambiguity | `SKILL.md`, `ORIGINAL_REQUEST.md` |
| 2 | Orchestration | Tier 2 Interactive Wizard | Conversational 8-stage questionnaire tailoring project requirements, architecture, system design, and UI. | User responses (text/numbers) | Structured `./docs/` artifact bundle | Prompts for re-entry on invalid choices | `SKILL.md`, `wizard-state.js` |
| 3 | Requirements | ISO/IEC/IEEE 29148 Standard | Formats Software Requirements Specifications to modern ISO/IEC/IEEE 29148:2018 standard (superseding IEEE 830). | User project scope | `./docs/requirements/SRD.md` | Emits warning if functional traceability missing | `references/requirements/srd.md` |
| 4 | Requirements | Atlassian PRD Standard | Standardizes Product Requirements Documents according to Atlassian product management framework. | User business goals | `./docs/requirements/PRD.md` | Prompts for target user persona if omitted | `references/requirements/prd.md` |
| 5 | Requirements | BABOK BRD Standard | Generates Business Requirements Documents aligned with IIBA BABOK Guide v3. | Enterprise objectives | `./docs/requirements/BRD.md` | Requires business value metric | `references/requirements/brd.md` |
| 6 | Architecture | Clean Architecture Engine | Designs software structure adhering to Uncle Bob's 4-layer dependency rule and boundary DTOs. | Domain entities, use cases | Layer rules, directory tree, DI specs | Errors if outer layer referenced by inner | `references/architecture/clean-architecture.md` |
| 7 | Architecture | Feature-Sliced Design (FSD) | Generates frontend/full-stack project architectures strictly following FSD 2.1 slice hierarchy. | Application features | Sliced directory structure & layer rules | Enforces unidirectional downward imports | `references/architecture/fsd.md` |
| 8 | Architecture | Modular Monolith Pattern | Structures application into isolated bounded contexts within a single deployment artifact. | Domain modules | Bounded context contracts & event bus specs | Warns on direct cross-module database joins | `references/architecture/modular-monolith.md` |
| 9 | Architecture | Event-Driven Architecture | Implements domain events, Outbox pattern, and Saga choreography/orchestration specifications. | Event catalog & flows | Event schemas, message flows, idempotency keys | Rejects unhandled failure compensations | `references/architecture/event-driven.md` |
| 10 | System Design | Distributed Lock with Fencing | Implements distributed locking with Martin Kleppmann monotonic fencing tokens to prevent split-brain writes. | Resource key, lock TTL | Locking specification & storage validation code | Rejects locks lacking token validation | `references/system-design/distributed-locking.md` |
| 11 | System Design | Redis Caching Lifecycle | Configures Cache-Aside, Write-Behind, TTL jitter, and dogpiling prevention (XFetch/mutex). | Read/write access patterns | Caching lifecycle & invalidation document | Flags missing cache invalidation events | `references/system-design/caching-redis.md` |
| 12 | System Design | Distributed Rate Limiter | Designs distributed rate limiting via Sliding Window or Token Bucket using Redis Lua scripts. | RPS limits, burst factor | Rate limiting policy document & Lua scripts | Requires HTTP 429 Retry-After handling | `references/system-design/rate-limiting.md` |
| 13 | System Design | RDBMS Scaling & Sharding | Formulates read-replica splitting, replication lag mitigation, connection pooling, and partitioning. | Database schema & TPS goals | Database scaling specification | Flags cross-shard transactions without 2PC | `references/system-design/rdbms-scaling.md` |
| 14 | UI / Styling | FE Aesthetics Curation | Generates design tokens (colors, borders, shadows, typography) for 8 senior developer visual design styles. | Aesthetic selection | `./docs/ui/[name]/theme-tokens.md` | Falls back to Clean SaaS Enterprise | `assets/ui/`, `ORIGINAL_REQUEST.md` |
| 15 | UI / Styling | UI Library Setup Guides | Concrete integration guides for Tailwind+shadcn, DaisyUI, Mantine, and Chakra UI. | Framework selection | `./docs/ui/[name]/setup-guide.md` | Rejects non-standard UI libraries | `assets/ui/` |
| 16 | Diagramming | Raw Mermaid Generation | Generates valid Mermaid diagrams (Sequence, ERD, State, C4 Container, Activity) without binary tooling. | System models | `./docs/diagrams/*.mmd` | Validated by `validate-mermaid.js` | `assets/uml/` |
| 17 | Security | Zero-Credential Secret Scan | Detects 20+ credential patterns across input contexts and output documents, masking with placeholders. | File paths or directory | Masked files, backup files, scan report | Exit code 1 on unmasked secrets in check mode | `scripts/secret-scan.js` |
| 18 | Security | Zero-Egress Network Guard | Blocks all outbound socket, DNS, and HTTP calls at the Node.js runtime level. | Runtime execution | Throws SecurityException on network call | Halts execution immediately | `scripts/egress-guard.js`, `policies/network-allowlist.json` |
| 19 | Security | Filesystem Path Traversal Guard | Sanitizes paths, preventing directory traversal (`../`) and writes outside `./docs/`. | Path strings | Sanitized normalized path | Rejects and logs invalid paths | `scripts/sanitize-input.js`, `policies/filesystem-scope.json` |
| 20 | Security | Tool Pin Integrity Verifier | Verifies cryptographic SHA-256 hashes of MCP tools and scripts before execution. | Tool name & file | Boolean verification result | Refuses execution on hash mismatch | `runtime-firewall/verify.js` |
| 21 | Packaging | Multi-Agent Installer | Installs skill across 7 agents via symlink or copy, creating backups in `~/.architect-skill-backup/`. | CLI flags (`--global`, `--local`) | Created symlinks/copies & backup folder | Aborts if target agent directory missing | `scripts/install.js`, `struktur-instalasi-pengguna.txt` |
| 22 | Validation | Cross-Doc Consistency Audit | Formally audits semantic alignment: PRD user stories ↔ SRD specs ↔ ERD entities ↔ Sequence diagrams. | Generated `./docs/` tree | Audit report with consistency score | Flags orphaned requirements or entities | `scripts/validate-output.js` |

---

## 5. Edge Cases & Boundary Conditions

| # | Feature | Input Condition | Observed / Documented Specification Behavior |
|---|---------|-----------------|-----------------------------------------------|
| 1 | Secret Scanner | Input file containing `.env` file with AWS key and password | Scanner flags secret, creates timestamped backup in `~/.architect-skill-backup/`, replaces with `{{SECRET_AWS_KEY}}` and `{{SECRET_DATABASE_PASSWORD}}`. |
| 2 | Path Sanitizer | Filename input `../../etc/passwd` or `docs/../../malicious.md` | `sanitize-input.js` strips traversal characters, normalizes to safe leaf filename `malicious.md` or throws invalid path exception. |
| 3 | Network Guard | Script or external tool invokes `fetch('https://api.example.com')` or `http.get()` | `egress-guard.js` traps call, logs attempt to audit log, and throws `SecurityError: Network call blocked by Zero-Egress policy`. |
| 4 | Mermaid Validator | Mermaid sequence diagram missing closing `end` in `alt` block | `validate-mermaid.js` parses bracket and block stacks, reports line number and block syntax mismatch, halts wizard turn. |
| 5 | Installer | Running `install.js` on an environment where `~/.claude/skills` does not exist | Installer detects missing directory, attempts safe creation if permissions allow, or skips agent and logs warning in install summary. |
| 6 | Installer | Running `install.js --dry-run` | Validates all target paths and symlink targets without writing to disk or creating backups; outputs full simulated plan. |
| 7 | Wizard State | Wizard interrupted during Question 5 (system design choice) | `wizard-state.js` stores partial responses in `.wizard-state.json`; on next turn, resumes exactly at Question 5. |
| 8 | Runtime Firewall | Tool script modified by unauthorized process (SHA-256 drift) | `runtime-firewall/verify.js` calculates hash mismatch against `tool-pins.json`, terminates call, and emits security alert. |
| 9 | Output Generator | User selects "No UI / Headless Microservice" preset | Skill omits `./docs/ui/` generation entirely, updating `.architect-manifest.json` and `docs/README.md` navigation to reflect headless mode. |
| 10 | Output Validator | PRD references entity `PaymentTransaction`, but ERD diagram only defines `Invoice` | `validate-output.js` semantic audit flags inconsistency as a warning/error in the output verification report. |

---

## 6. Cross-Module Dependency Matrix & Call Graph

```
                                  +-------------------+
                                  |   User Request    |
                                  +---------+---------+
                                            |
                                            v
                                  +-------------------+
                                  |   adapters/*      |
                                  |  (7 AI Agents)    |
                                  +---------+---------+
                                            |
                                            v
                       +---------------------------------------------+
                       |           architect-skill/SKILL.md          |
                       |       (Orchestrator Tier 1 & Tier 2)        |
                       +--------------------+------------------------+
                                            |
                      +---------------------+---------------------+
                      |                                           |
                      v                                           v
       +------------------------------+             +-------------------------------+
       |   scripts/wizard-state.js    |             |   policies/                   |
       |   scripts/sanitize-input.js  |             |   - filesystem-scope.json     |
       +--------------+---------------+             |   - network-allowlist.json    |
                      |                             |   - redaction-rules.json      |
                      v                             +---------------+---------------+
       +------------------------------+                             |
       |   references/                |                             v
       |   - requirements/*.md        |             +-------------------------------+
       |   - architecture/*.md        |             |   scripts/egress-guard.js     |
       |   - system-design/*.md       |             |   scripts/secret-scan.js      |
       |   - security/*.md            |             |   runtime-firewall/verify.js  |
       +--------------+---------------+             +---------------+---------------+
                      |                                             |
                      v                                             v
       +------------------------------+             +-------------------------------+
       |   assets/                    |             |   sandbox/ (Optional isolation|
       |   - uml/*.mmd                |             |   - run.sh (Docker / Landlock)|
       |   - ui/*.md                  |             |   broker/ (Optional proxy)    |
       |   - output/**/*.template.md  |             +---------------+---------------+
       +--------------+---------------+                             |
                      |                                             |
                      +---------------------+-----------------------+
                                            |
                                            v
                              +---------------------------+
                              | Output Generation Pipeline|
                              | -> writes to ./docs/      |
                              +-------------+-------------+
                                            |
                                            v
                              +---------------------------+
                              | Verification Gate:        |
                              | - validate-structure.js   |
                              | - validate-mermaid.js     |
                              | - validate-output.js      |
                              | - secret-scan.js          |
                              | - audit-log.js            |
                              +---------------------------+
```

### Detailed Dependency Invariants
1. **Zero External Dependency Rule**: No script in `scripts/`, `broker/`, `runtime-firewall/`, or `tests/` may require packages outside Node.js core modules (`fs`, `path`, `crypto`, `child_process`, `os`, `readline`, `events`).
2. **Strict File Scoping**: All generated output must land strictly in `./docs/` as defined in `policies/filesystem-scope.json`. Any attempt to write outside `./docs/` or `~/.architect-skill-backup/` must be aborted.
3. **Redaction Priority**: `secret-scan.js` must be executed before writing any generated content to disk or presenting it to the agent conversation context.
4. **Offline Isolation**: `egress-guard.js` must be initialized on entry in any standalone tool invocation, guaranteeing zero network telemetry.

---

## 7. Concrete Next Steps for Implementation Agents

1. **Phase 1: Foundation & Security Scaffolding**
   - Implement `skill.yaml`, `LICENSE`, `.gitignore`, `.editorconfig`, `.gitattributes`.
   - Implement `policies/network-allowlist.json`, `policies/redaction-rules.json`, `policies/filesystem-scope.json`.
   - Implement `scripts/sanitize-input.js`, `scripts/egress-guard.js`, `scripts/secret-scan.js`, `scripts/audit-log.js`.

2. **Phase 2: Adapters & Documentation**
   - Implement `adapters/` for Claude, Cursor, Continue, Windsurf, Cline, Codex, Antigravity, and `adapters/README.md`.
   - Implement root documentation (`README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `PRIVACY.md`) and `docs/` repository guides.

3. **Phase 3: References & Asset Templates**
   - Implement all 20 reference guides in `references/` (Requirements, Architecture, System Design, Security).
   - Implement all Mermaid templates in `assets/uml/` and UI guides in `assets/ui/` (incorporating all 8 senior developer aesthetic token sets).
   - Implement all 14 output templates in `assets/output/`.

4. **Phase 4: Core Orchestrator & Tooling**
   - Author `architect-skill/SKILL.md` wiring together Tier 1 triage, Tier 2 wizard dialogue, template compilation, and output generation.
   - Implement remaining scripts: `install.js`, `install.sh`, `validate-mermaid.js`, `validate-structure.js`, `validate-output.js`, `wizard-state.js`, `doctor.js`.
   - Implement `sandbox/`, `broker/`, `runtime-firewall/`, and `templates/skill-template/`.

5. **Phase 5: Automated Testing & CI**
   - Implement test fixtures (`tests/fixtures/`) and test suites (`tests/*.test.js`).
   - Implement `.github/workflows/` (`ci.yml`, `offline.yml`, `security.yml`).
   - Execute verification test suite to confirm complete compliance.

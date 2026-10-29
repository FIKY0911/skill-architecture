# architect-skill

> Enterprise-grade, local-first, zero-egress software architecture generator and specification framework for AI agents.

[![Zero-Egress Guaranteed](https://img.shields.io/badge/Security-Zero--Egress-success?style=flat-square)](SECURITY.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Runtime: Node.js 18+](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green?style=flat-square)](https://nodejs.org)
[![Agents: 7 Platforms](https://img.shields.io/badge/Agents-Claude%20%7C%20Cursor%20%7C%20Continue%20%7C%20Windsurf%20%7C%20Cline%20%7C%20Codex%20%7C%20Antigravity-orange?style=flat-square)](adapters/README.md)

---

## 1. Overview & Core Philosophies

`architect-skill` is an authoritative software architecture toolkit designed to operate across seven major AI coding environments: Claude Code & Desktop, Cursor IDE, Continue.dev, Codeium Windsurf, Cline Autonomous Agent, OpenAI Codex CLI, and Google Antigravity.

Unlike typical AI prompts that produce superficial code suggestions or make ungrounded assumptions, `architect-skill` operates as a deterministic architectural inference engine. It synthesizes enterprise-grade specifications, data schemas, distributed system safeguards, and visual UI tokens into an organized `./docs/` hierarchy within your project.

### Foundational Principles:
1. **Primacy of Logic over Heuristics**: All architectural paradigms, system design trade-offs, and requirement clauses are rooted in formal standards (ISO/IEC/IEEE 29148:2018, BABOK Guide v3, Atlassian Agile PRD, Robert C. Martin, Martin Fowler, Martin Kleppmann).
2. **Absolute Zero-Egress & Local-First**: 100% offline execution. No outbound network requests, no remote telemetry, no external API dependence.
3. **Absolute Credential Protection**: The skill is structurally prohibited from reading `.env` files, certificates, private keys, or agent authentication tokens. Built-in secret scanning and automatic masking neutralize stray credentials before write operations.
4. **Constructive Minimalism**: Pure Node.js implementation without external npm dependencies (`zero-dependency`), eliminating software supply chain risks.

---

## 2. Two-Tier Execution Framework

`architect-skill` provides two calibrated operational tiers:

| Attribute | Tier 1: Rapid / Lightweight Architecture | Tier 2: Enterprise / Comprehensive Architecture |
|---|---|---|
| **Target Scope** | MVPs, early prototypes, standalone microservices, internal CLI utilities | Mission-critical systems, distributed clusters, regulated enterprise platforms |
| **Interaction Time** | 3 to 5 rapid steps (< 5 minutes) | 6 deep validation stages (15 to 30 minutes) |
| **Requirements Scope** | Consolidated `PRD.md` with problem framing and acceptance criteria | Complete `BRD.md` (BABOK RACI/ROI), `PRD.md` (Atlassian), and `SRD.md` (ISO 29148 EARS clauses) |
| **Architecture Scope** | `layer-rules.md`, `directory-tree.md`, 1x core ADR | Layer rules, directory tree, `dependency-injection.md`, 3+ comprehensive ADRs |
| **System Design** | Primary database schema selection and baseline caching | Redis caching lifecycle, distributed locking with fencing tokens, RDBMS scaling, message queues |
| **Diagrams (Mermaid + text twin)** | 2 diagrams: C4 Container and Relational ERD | 5 diagrams: C4 Container, Sequence, ERD, State Machine, Activity flow. Each ships as Mermaid `.mmd` plus an ASCII `.md` twin that renders in VSCode preview |
| **Frontend & UI** | UI framework setup guide and theme tokens | Setup guide, theme tokens, full component registry with ARIA/WCAG accessibility |
| **Verification Gate** | Basic syntax validation and manifest compilation | Cross-document semantic traceability verification (`validate-output.js`) |

---

## 3. Supported AI Agent Ecosystems

`architect-skill` provides tailored adapters for 7 agent platforms:

| Platform | Adapter File | Global Location | Project Location | Trigger Mechanism |
|---|---|---|---|---|
| **Claude Code & Desktop** | `adapters/claude/SKILL.md` | `~/.claude/skills/architect-skill/` | `<project>/.claude/skills/architect-skill/` | `/architect` |
| **Cursor IDE** | `adapters/cursor/architect-skill.mdc` | `~/.cursor/rules/architect-skill.mdc` | `<project>/.cursor/rules/architect-skill.mdc` | Context / Globs |
| **Continue.dev** | `adapters/continue/architect-skill.prompt` | `~/.continue/prompts/architect-skill.prompt` | `<project>/.continue/prompts/architect-skill.prompt` | `/architect` |
| **Codeium Windsurf** | `adapters/windsurf/.windsurfrules` | `~/.codeium/windsurf/memories/global_rules.md` | `<project>/.windsurfrules` | Cascade Trigger |
| **Cline Autonomous** | `adapters/cline/.clinerules` | Extension configuration | `<project>/.clinerules` | Autonomous Rules |
| **OpenAI Codex CLI** | `adapters/codex/SKILL.md` | `~/.codex/skills/architect-skill/` | `<project>/.codex/skills/architect-skill/` | CLI Command |
| **Google Antigravity** | `adapters/antigravity/SKILL.md` | `~/.agy/skills/architect-skill/` | `<project>/.agy/skills/architect-skill/` | Skill Loader |

Detailed installation mapping is documented in [`adapters/README.md`](adapters/README.md).

---

## 4. Installation & Lifecycle Management

The toolkit includes a zero-dependency installer compatible with Linux, macOS, and Windows.

### Automated Shell Installation (Linux / macOS):
```bash
# Global installation for all agents (creates symlinks)
./scripts/install.sh --global

# Local installation in the current project repository
./scripts/install.sh --local

# Dry-run inspection
./scripts/install.sh --global --dry-run
```

### Direct Node.js Installation (Cross-Platform):
```bash
# Preview installation plan without modifying disk (--dry-run)
node scripts/install.js --global --dry-run

# Install globally for all 7 AI agents in user home (~/)
node scripts/install.js --global

# Install globally or locally for a single specific AI agent (claude | antigravity | codex | cursor | continue | windsurf | cline)
node scripts/install.js --global --target antigravity
node scripts/install.js --local --target cursor

# Uninstall and remove installed links cleanly
node scripts/install.js --global --uninstall
node scripts/install.js --local --uninstall
```

For full configuration details (per-agent setup, custom security policies, and GitHub publishing checklist), see [`docs/quickstart.md`](docs/quickstart.md).

### Automated Backup Protection:
Prior to modifying or overwriting any agent configuration, the installer creates a timestamped backup in:
`~/.architect-skill-backup/<timestamp>/<agent_name>/`

---

## 5. Architectural Knowledge Base & Standards

### 5.1 Formal Requirements Engineering
- **PRD (Product Requirements Document)**: Follows Atlassian agile framework with problem framing, user personas, Gherkin acceptance criteria, and MoSCoW prioritization.
- **BRD (Business Requirements Document)**: Follows BABOK Guide v3 with strategic alignment, stakeholder RACI matrices, TCO/ROI financial calculations, and compliance constraints.
- **SRD (System Requirements Document)**: Follows ISO/IEC/IEEE 29148:2018 (superseding IEEE 830) enforcing EARS syntax (Ubiquitous, Event-driven, State-driven, Unwanted, Optional) and IV&V verification matrices.

### 5.2 Architectural Paradigms
- **Clean Architecture**: 4 concentric onion layers with the strict Dependency Inversion Rule and boundary DTOs.
- **Modular Monolith**: Bounded contexts within a single deployment unit, public interface facades, and logical schema isolation.
- **Event-Driven Architecture (EDA)**: Domain events, Event-Carried State Transfer (ECST), Transactional Outbox pattern, and Saga orchestration.
- **Hexagonal Architecture**: Ports and Adapters decoupling application core from driving and driven infrastructure.
- **Feature-Sliced Design (FSD v2.1)**: Strict hierarchical layer model (`app`, `pages`, `widgets`, `features`, `entities`, `shared`) for large-scale frontend and full-stack systems.

### 5.3 Distributed System Design Rigor
- **Redis Caching**: Cache-Aside, Write-Through, Write-Behind, TTL jitter, and XFetch probabilistic early expiration algorithm to prevent cache stampedes.
- **Distributed Locking**: Kleppmann monotonically increasing fencing tokens checked at the database layer to prevent split-brain writes under GC pauses.
- **RDBMS Scaling**: Read/Write splitting with replica lag mitigation, PgBouncer/HikariCP connection pool sizing, and horizontal sharding.
- **Async Message Queues**: Kafka, RabbitMQ, and AWS SQS patterns with Dead Letter Queues (DLQ) and exponential backoff jitter.
- **Distributed Rate Limiting**: Sliding Window Counter and Token Bucket algorithms implemented via Redis Lua scripts.

### 5.4 Senior Frontend Aesthetics & UI Frameworks
Integrates 6 official UI component libraries (Tailwind + shadcn/ui, DaisyUI, Mantine, Chakra UI, Ant Design, MUI) and 8 curated senior design aesthetic themes:
1. **Neubrutalism / Neo-Brutalism**: Hard 3px black borders, unblurred solid drop-shadows (`box-shadow: 4px 4px 0px #000`), vibrant saturated accents.
2. **Bento Grid / Linear-style**: Modular dark canvas (`#09090B`), subtle translucent borders, glowing ambient spotlight gradients.
3. **Glassmorphism & Aurora Gradient**: Multi-layer frosted glass backdrop blurs (`backdrop-blur-xl`), vibrant celestial violet/cyan lighting.
4. **Swiss / International Typographic Style**: Stark architectural grid, bold grotesque typography, zero ornamentation, red/black accents.
5. **Modern SaaS Clean Enterprise**: Balanced slate neutrals, crisp 1px borders, subtle elevation, accessible status badges.
6. **Material Design 3**: Dynamic tonal palettes, surface tint elevations, pill-shaped action triggers.
7. **Neumorphism / Soft UI**: Opposing directional soft shadows on continuous neutral surfaces (with mandatory high-contrast text reinforcements).
8. **Retro / Cyberpunk / Terminal**: Monospaced typography, CRT scanlines, neon phosphor green/amber accents on pitch-black surfaces.

---

## 6. Generated Output Hierarchy (`./docs/`)

When executed, `architect-skill` compiles your technical documentation into `./docs/`:

```
./docs/
├── README.md                          # Main navigation portal and documentation index
├── .architect-manifest.json           # Machine-readable metadata, option choices, and SHA-256 hashes
├── .architect-audit.log               # Local append-only event log (zero credential leakage)
├── .gitignore                         # Output-level exclusion of secrets, keys, and temporary state
│
├── requirements/
│   ├── PRD.md                         # Product Requirements Document (Atlassian)
│   ├── BRD.md                         # Business Requirements Document (BABOK - Tier 2)
│   ├── SRD.md                         # System Requirements Document (ISO/IEC/IEEE 29148 - Tier 2)
│   └── [custom].md                    # Sanitized custom requirements or RFCs
│
├── architecture/
│   ├── decisions/
│   │   ├── ADR-001-*.md               # Architecture Decision Records
│   │   └── ADR-002-*.md
│   └── [selected-architecture]/
│       ├── layer-rules.md             # Boundary rules and import constraints
│       ├── directory-tree.md          # Concrete project codebase tree
│       └── dependency-injection.md    # Service lifetimes and DI registration (Tier 2)
│
├── system-design/
│   └── [selected-design]/
│       ├── caching-lifecycle.md       # Redis caching patterns and TTL policies
│       ├── concurrency-locking.md     # Distributed locking with fencing tokens
│       └── rdbms-scaling.md           # Read replicas, partitioning, and connection pools
│
├── diagrams/
│   ├── architecture/
│   │   └── c4-container.mmd           # C4 model container diagram
│   ├── data/
│   │   └── erd.mmd                    # Relational Entity Relationship Diagram
│   ├── sequence/
│   │   └── sequence-auth-flow.mmd     # Protocol and transaction sequence diagrams
│   └── state/
│       └── state-lifecycle.mmd        # Finite state machine model
│
└── ui/
    └── [selected-ui-framework]/
        ├── setup-guide.md             # Build configuration and dependencies
        ├── theme-tokens.md            # CSS custom properties and design tokens
        └── component-registry.md      # UI component specifications and ARIA accessibility
```

---

## 7. Verification Utilities & Diagnostics

The toolkit provides automated zero-dependency verification scripts:

```bash
# Verify environment health, permissions, and script integrity
node scripts/doctor.js

# Validate Mermaid UML diagram syntax across assets and generated output
node scripts/validate-mermaid.js

# Validate preview-safe text diagrams (ASCII .md twins that render in VSCode preview without Mermaid)
node scripts/validate-diagrams.js

# Validate repository structure against the blueprint
node scripts/validate-structure.js

# Validate cross-document semantic consistency (PRD <-> SRD <-> ERD <-> ADR)
node scripts/validate-output.js

# Execute secret scanner to detect and mask credential patterns
node scripts/secret-scan.js --check
```

---

## 8. Security & Governance

- **Zero-Egress Enforcement**: Monitored by `scripts/egress-guard.js`. Any unauthorized outbound network socket throws an immediate fatal error.
- **Credential Protection**: Monitored by `scripts/secret-scan.js` and `policies/redaction-rules.json`.
- **Filesystem Isolation**: Monitored by `policies/filesystem-scope.json`.
- **Integrity Pinning**: Monitored by `runtime-firewall/tool-firewall.js`.

For security vulnerability disclosure, review [`SECURITY.md`](SECURITY.md).  
For local data sovereignty details, review [`PRIVACY.md`](PRIVACY.md).

---

## 9. License

This project is licensed under the [MIT License](LICENSE).

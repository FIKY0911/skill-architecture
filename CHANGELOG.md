# Changelog

All notable changes to `architect-skill` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Preview-safe text diagrams**: `assets/diagrams/*.md` (sequence, ERD, state, C4, activity) as ASCII `text` blocks plus tables, since VSCode markdown preview cannot render Mermaid. Mermaid remains as an optional extra.
- `scripts/validate-diagrams.js` (pinned in runtime-firewall), `.mmd`/`.md` twin parity check, warning in `validate-output.js` for missing twins, `tests/diagrams.test.js`, SKILL.md dual-format rule and quality gate.
- Anti-slop UI contract (`assets/ui/anti-slop.md`, `scripts/validate-ui-slop.js`).

### Fixed
- `redaction-rules.json`: URI-password and Android keystore rules are now idempotent, so masked output re-scans clean.
- `validate-mermaid.js` and the e2e assertion helper no longer count ER cardinality tokens (`||--o{`) or quoted labels as curly braces.
- `assets/uml/sequence.mmd` no longer contains a literal bearer-token phrase; Windsurf adapter now states zero-egress explicitly.

## [1.0.0] - 2026-10-28

### Added
- **Core Orchestrator (`SKILL.md`)**:
  - Two-tier execution framework: Tier 1 (rapid MVP / microservice architecture) and Tier 2 (comprehensive enterprise compliance).
  - Multi-stage interactive wizard covering project scope, requirements elicitation, architectural paradigms, distributed system resilience, frontend UI design, and formal verification.
  - Zero-egress enforcement and local filesystem gating.
- **Skill Manifest (`skill.yaml`)**:
  - Declarative machine-readable metadata specifying multi-agent compatibility, permissions, filesystem scopes, and script entrypoints.
- **Agent Integration Layer (`adapters/`)**:
  - Support for 7 major AI agent environments: Claude Code / Desktop, Cursor IDE (`.mdc`), Continue.dev (`.prompt`), Windsurf Cascade (`.windsurfrules`), Cline Autonomous Agent (`.clinerules`), OpenAI Codex CLI, and Google Antigravity.
  - Comprehensive adapter matrix guide (`adapters/README.md`) mapping global and project-local paths.
- **Authoritative Reference Library (`references/`)**:
  - Requirements engineering: Atlassian PRD framework, BABOK Guide v3 BRD standard, and ISO/IEC/IEEE 29148:2018 SRD specification with EARS syntax.
  - Architectural patterns: Clean Architecture (Robert C. Martin), Modular Monolith with bounded contexts, Event-Driven Architecture with Outbox and Saga patterns, Hexagonal Architecture (Ports and Adapters), and Feature-Sliced Design (FSD v2.1).
  - Distributed system design: Redis caching lifecycle with XFetch stampede mitigation, Distributed locking with Kleppmann monotonically increasing fencing tokens, RDBMS horizontal scaling and connection pooling optimization, Asynchronous message queues (Kafka, RabbitMQ, SQS) with DLQ and exponential backoff jitter, and Distributed rate limiting via Redis Lua scripts.
  - Security and isolation: STRIDE threat modeling, NIST SP 800-57 zero-credential handling, Local-First Manifesto principles, Zero-Trust caller validation, Linux Landlock and container sandbox isolation, OWASP prompt injection mitigation, and SLSA Level 3 cryptographic tool pinning.
- **Visual Assets and Frontend Catalogs (`assets/`)**:
  - Raw Mermaid UML templates: Sequence diagram, Relational ERD, State Machine, C4 Container model, and Activity workflow.
  - Senior Frontend Aesthetics catalog covering 8 distinct design systems with exact CSS and Tailwind design tokens: Neubrutalism, Bento Grid / Linear-style, Glassmorphism & Aurora Gradient, Swiss / International Typographic Style, Modern SaaS Clean Enterprise, Material Design 3, Neumorphism, and Retro / Cyberpunk / Terminal.
  - UI Library integration specifications: Tailwind CSS + shadcn/ui, DaisyUI, Mantine, Chakra UI, Ant Design, and Material UI.
  - Standardized `./docs/` output templates for requirements, architecture, system design, UML diagrams, UI design systems, and Architecture Decision Records (ADR).
- **Zero-Dependency Node.js Utilities (`scripts/`)**:
  - Cross-platform multi-agent installer (`install.js` and `install.sh`) supporting global and local scopes, symlink and copy modes, dry-run simulation, and automated timestamped backups in `~/.architect-skill-backup/`.
  - Offline syntax validation for Mermaid UML diagrams (`validate-mermaid.js`).
  - Structural and internal link consistency verification (`validate-structure.js`).
  - Cross-document semantic traceability verification (`validate-output.js`).
  - High-precision regular expression secret scanner (`secret-scan.js`) with automated masking.
  - Zero-egress network runtime blocker (`egress-guard.js`) intercepting sockets, HTTP/HTTPS, DNS, and fetch calls.
  - Local append-only audit logger (`audit-log.js`).
  - Path traversal and input injection sanitization (`sanitize-input.js`).
  - Persistent multi-turn wizard state tracker (`wizard-state.js`).
  - Environment diagnostic and integrity checker (`doctor.js`).
- **Security Sandboxing & Runtime Firewalls**:
  - Linux Landlock LSM profiles, unprivileged Docker execution scripts (`--network=none`, `--read-only`, non-root UID 10001), and Firecracker microVM configurations (`sandbox/`).
  - Zero-knowledge credential broker with temporary lease management (`broker/`).
  - SHA-256 tool pinning and runtime tool firewall with default-deny policies (`runtime-firewall/`).
  - Strict filesystem access scoping and credential redaction policies (`policies/`).
- **Automated Verification Suites (`tests/`)**:
  - Offline network block tests (`offline.test.js`).
  - Secret scanner detection and masking tests (`secret-scan.test.js`).
  - Multi-agent installer and backup tests (`install.test.js`).
  - Generated output schema and traceability tests (`output.test.js`).
  - Test fixtures for Mermaid diagrams, synthetic credentials, and wizard state snapshots.
- **Continuous Integration (`.github/workflows/`)**:
  - Syntax and code style verification workflow (`lint.yml`).
  - Fully air-gapped network-isolated verification workflow (`offline-check.yml`).
  - CodeQL and secret audit workflow (`security.yml`).
- **Operational Documentation (`docs/`)**:
  - Getting started quickstart manual, interactive wizard guide, security architecture whitepaper, adapters guide, troubleshooting manual, and architectural comparison analysis (Skill vs IDE Plugin vs MCP Server).

### Security
- Absolute Zero-Egress guarantee: All network sockets and outbound protocols blocked at runtime.
- Absolute Zero-Credential access: Skill strictly forbids reading `.env` files, private keys, certificates, or agent API tokens.

# Project: architect-skill

## Architecture
Architect-skill is an enterprise-grade, local-first, zero-egress architecture engineering toolkit designed for 7 AI agent ecosystems (Claude, Cursor, Continue, Windsurf, Cline, Codex, Antigravity).

### Architectural Layers
1. **Agent Integration Layer (`adapters/`)**: Native instructions and configuration rules per AI agent.
2. **Orchestration Layer (`SKILL.md`, `skill.yaml`, `scripts/wizard-state.js`)**:
   - Tier 1: Fast-path triage and instant architecture queries.
   - Tier 2: Interactive multi-step wizard generating comprehensive `./docs/` artifacts.
3. **Domain Knowledge Layer (`references/`)**:
   - Requirements: PRD (Atlassian), BRD (BABOK IIBA), SRD (ISO/IEC/IEEE 29148:2018).
   - Architecture: Clean Architecture, Modular Monolith, Event-Driven, Hexagonal, Feature-Sliced Design (FSD).
   - System Design: Redis Caching, Distributed Locking (fencing tokens), RDBMS Scaling, Async Message Queue, Rate Limiting.
   - Security: Threat Model (STRIDE), Secret Handling, Local-first, Trust Model, Sandbox Isolation, Prompt Injection, Tool Pinning.
4. **Visual & UI Assets Layer (`assets/`)**:
   - Mermaid UML templates: Sequence, ERD, State, C4 Container, Activity.
   - UI Libraries: Tailwind + shadcn/ui, DaisyUI, Mantine, Chakra, AntD, MUI.
   - Senior Frontend Aesthetics (8 visual styles): Neubrutalism, Bento Grid/Linear, Glassmorphism & Aurora, Swiss/Editorial, Clean SaaS, Material 3, Neumorphism, Retro/Terminal.
   - Document templates for `./docs/` output.
5. **Security & Containment Layer (`sandbox/`, `broker/`, `runtime-firewall/`, `policies/`)**:
   - Zero-egress network guard (`egress-guard.js`).
   - Secret scanning and masking (`secret-scan.js`, `redaction-rules.json`).
   - Landlock Linux sandboxing and container isolation profiles.
   - Zero-knowledge credential broker.
   - Runtime tool firewall with SHA-256 integrity verification.
6. **Validation & Lifecycle Utilities (`scripts/`, `tests/`)**:
   - Cross-agent installer (`install.js`, `install.sh`).
   - Mermaid validator, structure validator, output validator, doctor utility.
   - Automated offline test suites and CI workflows.

---

## Feature Inventory
Every feature from the Survey phase is mapped to a milestone.

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Core Root Metadata | `SKILL.md`, `skill.yaml`, `README.md`, `LICENSE`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `PRIVACY.md` | M1 | spec_miner_repo |
| 2 | Editor & Git Config | `.gitignore`, `.editorconfig`, `.gitattributes` enforcing zero-egress & secret exclusion | M1 | spec_miner_repo |
| 3 | Claude Adapter | `adapters/claude/SKILL.md` Claude Code & Desktop integration | M1 | spec_miner_wizard |
| 4 | Cursor Adapter | `adapters/cursor/architect-skill.mdc` Cursor IDE rule file | M1 | spec_miner_wizard |
| 5 | Continue Adapter | `adapters/continue/architect-skill.prompt` Continue.dev prompt file | M1 | spec_miner_wizard |
| 6 | Windsurf Adapter | `adapters/windsurf/.windsurfrules` Windsurf IDE rules | M1 | spec_miner_wizard |
| 7 | Cline Adapter | `adapters/cline/.clinerules` Cline extension system prompt | M1 | spec_miner_wizard |
| 8 | Codex Adapter | `adapters/codex/SKILL.md` OpenAI Codex CLI instructions | M1 | spec_miner_wizard |
| 9 | Antigravity Adapter | `adapters/antigravity/SKILL.md` Google Antigravity custom skill rule | M1 | spec_miner_wizard |
| 10 | Adapter Matrix Guide | `adapters/README.md` compatibility and mapping table | M1 | spec_miner_wizard |
| 11 | PRD Standard Ref | `references/requirements/prd.md` Atlassian standard specification | M2 | explorer_standards |
| 12 | BRD Standard Ref | `references/requirements/brd.md` BABOK Guide IIBA enterprise standard | M2 | explorer_standards |
| 13 | SRD Standard Ref | `references/requirements/srd.md` ISO/IEC/IEEE 29148:2018 EARS & IV&V matrix | M2 | explorer_standards |
| 14 | Clean Architecture Ref | `references/architecture/clean-architecture.md` onion layers & dependency inversion | M2 | explorer_standards |
| 15 | Modular Monolith Ref | `references/architecture/modular-monolith.md` bounded contexts & internal APIs | M2 | explorer_standards |
| 16 | Event-Driven Ref | `references/architecture/event-driven.md` broker topologies & outbox pattern | M2 | explorer_standards |
| 17 | Hexagonal Ref | `references/architecture/hexagonal.md` ports & adapters architecture | M2 | explorer_standards |
| 18 | FSD Ref | `references/architecture/fsd.md` Feature-Sliced Design v2.1 for modern apps | M2 | explorer_standards |
| 19 | Redis Caching Ref | `references/system-design/caching-redis.md` lifecycle, eviction, XFetch stampede | M2 | explorer_standards |
| 20 | Distributed Locking Ref | `references/system-design/distributed-locking.md` Redlock & Kleppmann fencing tokens | M2 | explorer_standards |
| 21 | RDBMS Scaling Ref | `references/system-design/rdbms-scaling.md` read replicas, sharding, pooling | M2 | explorer_standards |
| 22 | Async Message Queue Ref | `references/system-design/async-message-queue.md` Kafka, RabbitMQ, SQS, DLQ | M2 | explorer_standards |
| 23 | Rate Limiting Ref | `references/system-design/rate-limiting.md` Sliding window counter & token bucket | M2 | explorer_standards |
| 24 | Threat Model Ref | `references/security/threat-model.md` STRIDE & zero-trust modeling | M2 | explorer_standards |
| 25 | Secret Handling Ref | `references/security/secret-handling.md` masking, no-store, zero credential access | M2 | explorer_standards |
| 26 | Local-First Ref | `references/security/local-first.md` zero-egress, offline operation, CRDTs | M2 | explorer_standards |
| 27 | Trust Model Ref | `references/security/trust-model.md` zero-trust caller assumption & validation | M2 | explorer_standards |
| 28 | Sandbox Isolation Ref | `references/security/sandbox-isolation.md` Landlock, cgroups v2, microVMs | M2 | explorer_standards |
| 29 | Prompt Injection Ref | `references/security/prompt-injection.md` delimiters, taint tracking, defense | M2 | explorer_standards |
| 30 | Tool Pinning Ref | `references/security/tool-pinning.md` SHA-256 tool digest verification | M2 | explorer_standards |
| 31 | Mermaid UML Sequence | `assets/uml/sequence.mmd` clean sequence diagram template | M3 | spec_miner_repo |
| 32 | Mermaid UML ERD | `assets/uml/erd.mmd` relational entity diagram template | M3 | spec_miner_repo |
| 33 | Mermaid UML State | `assets/uml/state.mmd` finite state machine diagram template | M3 | spec_miner_repo |
| 34 | Mermaid UML C4 Container | `assets/uml/c4-container.mmd` C4 architecture container model | M3 | spec_miner_repo |
| 35 | Mermaid UML Activity | `assets/uml/activity.mmd` workflow and logic flow diagram | M3 | spec_miner_repo |
| 36 | UI Framework Catalog | `assets/ui/ui-libraries.md` Tailwind+shadcn, DaisyUI, Mantine, Chakra, AntD, MUI | M3 | explorer_standards |
| 37 | Frontend Aesthetics Catalog | `assets/ui/fe-aesthetics.md` 8 visual themes with tokens and Tailwind classes | M3 | explorer_standards |
| 38 | Output Requirements Templates | `assets/output/requirements/` prd, brd, srd output templates | M3 | spec_miner_wizard |
| 39 | Output Architecture Templates | `assets/output/architecture/` overview & decisions templates | M3 | spec_miner_wizard |
| 40 | Output System Design Templates | `assets/output/system-design/` caching, locking, queue templates | M3 | spec_miner_wizard |
| 41 | Output Diagram Templates | `assets/output/diagrams/` c4, erd, sequence templates | M3 | spec_miner_wizard |
| 42 | Output UI Templates | `assets/output/ui/` layout, tokens, components templates | M3 | spec_miner_wizard |
| 43 | Output ADR & README Templates | `assets/output/adr/` adr template and root output `README.md` | M3 | spec_miner_wizard |
| 44 | Installer Scripts | `scripts/install.js` and `scripts/install.sh` multi-agent installer with backups | M4 | spec_miner_wizard |
| 45 | Mermaid Validator Script | `scripts/validate-mermaid.js` offline syntax checker for .mmd files | M4 | spec_miner_repo |
| 46 | Structure Validator Script | `scripts/validate-structure.js` blueprint compliance checker | M4 | spec_miner_repo |
| 47 | Output Validator Script | `scripts/validate-output.js` checks `./docs/` generated files | M4 | spec_miner_wizard |
| 48 | Secret Scan Script | `scripts/secret-scan.js` regex detection and masking of sensitive credentials | M4 | explorer_standards |
| 49 | Egress Guard Script | `scripts/egress-guard.js` socket monkey-patch blocking external network calls | M4 | explorer_standards |
| 50 | Audit Log Script | `scripts/audit-log.js` append-only zero-leak event logger | M4 | explorer_standards |
| 51 | Sanitize Input Script | `scripts/sanitize-input.js` path traversal and injection prevention | M4 | explorer_standards |
| 52 | Wizard State Script | `scripts/wizard-state.js` session persistence and rollback tracker | M4 | spec_miner_wizard |
| 53 | Doctor Script | `scripts/doctor.js` environment and skill health check | M4 | spec_miner_repo |
| 54 | Sandbox Execution Profiles | `sandbox/landlock-profile.json`, `container-sandbox.sh`, `microvm-config.json`, `README.md` | M4 | spec_miner_repo |
| 55 | Credential Broker | `broker/zero-knowledge-proxy.js`, `lease-manager.js`, `credential-intake.json`, `README.md` | M4 | spec_miner_repo |
| 56 | Runtime Tool Firewall | `runtime-firewall/tool-firewall.js`, `mcp-interceptor.js`, `deny-rules.json`, `README.md` | M4 | spec_miner_repo |
| 57 | Security Policies | `policies/tool-allowlist.json`, `policies/redaction-rules.json`, `policies/filesystem-scope.json` | M4 | explorer_standards |
| 58 | Skill Scaffolding Templates | `templates/skill-template/` complete template for creating new skills | M4 | spec_miner_repo |
| 59 | Automated Test Suite | `tests/offline.test.js`, `secret-scan.test.js`, `install.test.js`, `output.test.js` | M5 | spec_miner_repo |
| 60 | Test Fixtures | `tests/fixtures/secrets/dummy.env`, `mermaid/sample.mmd`, `wizard/mock-input.json` | M5 | spec_miner_repo |
| 61 | CI/CD Workflows | `.github/workflows/lint.yml`, `offline-check.yml`, `security.yml` | M5 | spec_miner_repo |
| 62 | Operational Documentation | `docs/getting-started.md`, `wizard-guide.md`, `security-architecture.md`, `adapters-guide.md`, `troubleshooting.md`, `comparison.md` | M5 | spec_miner_repo |
| 63 | E2E Test Suite Validation | 100% pass of Tiers 1-4 tests published in `TEST_READY.md` | M6 | E2E Testing Track |
| 64 | Adversarial Hardening | Tier 5 adversarial stress testing and edge-case resolution | M6 | Final Milestone Phase 2 |
| 65 | Forensic Integrity Audit | Binary veto audit verifying authentic implementation and zero credential leakage | M6 | teamwork_auditor |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Core Metadata & Agent Adapters | Subsystems 1 & 2 (19 files) | none | IN_PROGRESS |
| M2 | References & Authoritative Standards | Subsystems 3 (20 files) | M1 contracts | PLANNED |
| M3 | Asset Templates, UI Libraries & Frontend Aesthetics | Subsystem 4 (23 files) | M1, M2 | PLANNED |
| M4 | Scripts, Security Guardrails, Policies & Sandboxes | Subsystems 5, 6, 7, 8, 9, 10 (31 files) | M1, M2, M3 | PLANNED |
| M5 | Automated Test Suites, CI Workflows & Operational Docs | Subsystems 11, 12, 13 (16 files) | M1, M2, M3, M4 | PLANNED |
| M6 | Final Verification, E2E Acceptance & Forensic Audit | 100% E2E tests, Tier 5 hardening, Auditor Clean Verdict | M1-M5, TEST_READY.md | PLANNED |

---

## Interface Contracts

### M1 (Core & Adapters) ↔ M4 (Scripts & Wizard)
- `skill.yaml` exposes metadata schema: `name`, `version`, `entrypoint`, `adapters`, `permissions`.
- `adapters/*` trigger `SKILL.md` wizard via agent-specific rules, executing `node scripts/wizard-state.js` and reading `policies/filesystem-scope.json`.
- All adapters specify non-interactive and interactive wizard invocations.

### M2 (References) ↔ M3 (Asset Output Templates)
- Output templates in `assets/output/` strictly conform to reference guidelines:
  - `requirements/prd-template.md` matches `references/requirements/prd.md`.
  - `requirements/brd-template.md` matches `references/requirements/brd.md`.
  - `requirements/srd-template.md` matches `references/requirements/srd.md`.
  - System design templates match respective reference files in `references/system-design/`.

### M3 (UI & Aesthetics) ↔ M4 (Wizard State & Output Generator)
- `assets/ui/fe-aesthetics.md` exposes 8 named style identifiers:
  `neubrutalism`, `bento-grid`, `glassmorphism`, `swiss-editorial`, `clean-saas`, `material-3`, `neumorphism`, `retro-terminal`.
- Wizard state prompts for `ui_library` (tailwind-shadcn, daisyui, mantine, chakra, antd, mui) and `fe_aesthetic` (from the 8 identifiers), generating `docs/ui/design-system.md` using the exact design tokens.

### M4 (Scripts & Security) ↔ M5 (Tests)
- All scripts in `scripts/` export functions for unit testing and CLI execution (`if (require.main === module)`).
- `scripts/secret-scan.js` accepts files or stdin, returns `{ clean: boolean, findings: [] }` and masks values with `[REDACTED:<TYPE>]`.
- `scripts/egress-guard.js` monkey-patches `net.Socket.prototype.connect` and `tls.connect` to throw `EgressBlockedError` on non-local addresses.
- `scripts/install.js` supports `--dry-run`, `--target <agent>`, and automated backup in `~/.architect-skill-backup/<timestamp>/`.

---

## Code Layout
All files live under `/home/fiky/Documents/Latihan Agent/SKILL/architect-skill/`:

```
architect-skill/
├── .editorconfig
├── .gitattributes
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── PRIVACY.md
├── README.md
├── SECURITY.md
├── SKILL.md
├── skill.yaml
├── .github/
│   └── workflows/
│       ├── lint.yml
│       ├── offline-check.yml
│       └── security.yml
├── adapters/
│   ├── README.md
│   ├── antigravity/
│   │   └── SKILL.md
│   ├── claude/
│   │   └── SKILL.md
│   ├── cline/
│   │   └── .clinerules
│   ├── codex/
│   │   └── SKILL.md
│   ├── continue/
│   │   └── architect-skill.prompt
│   ├── cursor/
│   │   └── architect-skill.mdc
│   └── windsurf/
│       └── .windsurfrules
├── assets/
│   ├── output/
│   │   ├── README.md
│   │   ├── adr/
│   │   │   └── adr-template.md
│   │   ├── architecture/
│   │   │   ├── decisions-template.md
│   │   │   └── overview-template.md
│   │   ├── diagrams/
│   │   │   ├── c4-template.md
│   │   │   ├── erd-template.md
│   │   │   └── sequence-template.md
│   │   ├── requirements/
│   │   │   ├── brd-template.md
│   │   │   ├── prd-template.md
│   │   │   └── srd-template.md
│   │   ├── system-design/
│   │   │   ├── caching-template.md
│   │   │   ├── locking-template.md
│   │   │   └── queue-template.md
│   │   └── ui/
│   │       ├── components-template.md
│   │       ├── layout-template.md
│   │       └── tokens-template.md
│   ├── ui/
│   │   ├── fe-aesthetics.md
│   │   └── ui-libraries.md
│   └── uml/
│       ├── activity.mmd
│       ├── c4-container.mmd
│       ├── erd.mmd
│       ├── sequence.mmd
│       └── state.mmd
├── broker/
│   ├── README.md
│   ├── credential-intake.json
│   ├── lease-manager.js
│   └── zero-knowledge-proxy.js
├── docs/
│   ├── adapters-guide.md
│   ├── comparison.md
│   ├── getting-started.md
│   ├── security-architecture.md
│   ├── troubleshooting.md
│   └── wizard-guide.md
├── policies/
│   ├── filesystem-scope.json
│   ├── redaction-rules.json
│   └── tool-allowlist.json
├── references/
│   ├── architecture/
│   │   ├── clean-architecture.md
│   │   ├── event-driven.md
│   │   ├── fsd.md
│   │   ├── hexagonal.md
│   │   └── modular-monolith.md
│   ├── requirements/
│   │   ├── brd.md
│   │   ├── prd.md
│   │   └── srd.md
│   ├── security/
│   │   ├── local-first.md
│   │   ├── prompt-injection.md
│   │   ├── sandbox-isolation.md
│   │   ├── secret-handling.md
│   │   ├── threat-model.md
│   │   ├── tool-pinning.md
│   │   └── trust-model.md
│   └── system-design/
│       ├── async-message-queue.md
│       ├── caching-redis.md
│       ├── distributed-locking.md
│       ├── rate-limiting.md
│       └── rdbms-scaling.md
├── runtime-firewall/
│   ├── README.md
│   ├── deny-rules.json
│   ├── mcp-interceptor.js
│   └── tool-firewall.js
├── sandbox/
│   ├── README.md
│   ├── container-sandbox.sh
│   ├── landlock-profile.json
│   └── microvm-config.json
├── scripts/
│   ├── audit-log.js
│   ├── doctor.js
│   ├── egress-guard.js
│   ├── install.js
│   ├── install.sh
│   ├── sanitize-input.js
│   ├── secret-scan.js
│   ├── validate-mermaid.js
│   ├── validate-output.js
│   ├── validate-structure.js
│   └── wizard-state.js
├── templates/
│   └── skill-template/
│       ├── SKILL.md
│       ├── skill.yaml
│       ├── assets/
│       │   └── blank.mmd
│       ├── references/
│       │   └── quickstart.md
│       └── scripts/
│           └── scaffold.js
└── tests/
    ├── install.test.js
    ├── offline.test.js
    ├── output.test.js
    ├── secret-scan.test.js
    └── fixtures/
        ├── mermaid/
        │   └── sample.mmd
        ├── secrets/
        │   └── dummy.env
        └── wizard/
            └── mock-input.json
```

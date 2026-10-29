# Contributing to architect-skill

Thank you for your interest in contributing to `architect-skill`. This toolkit provides local-first, zero-egress software architecture orchestration across multiple AI agent ecosystems. To preserve the deterministic reliability and formal integrity of the repository, all contributors must adhere to the engineering standards detailed below.

---

## 1. Foundational Engineering Principles

1. **Primacy of Logic over Heuristics**: Every architectural pattern, requirements structure, and system design guide must be rooted in established computer science literature and official industry standards (ISO/IEC/IEEE, BABOK, Martin Fowler, Robert C. Martin, Martin Kleppmann). Guesswork or generic LLM hallucinations will be rejected.
2. **Zero-Egress and Local-First**: Under no circumstances may any code, utility, or adapter initiate outbound network requests. All generation, validation, and testing must execute entirely on the local developer workstation.
3. **Absolute Credential Protection**: Code must never read, parse, or request access to secret files (`.env`, `*.pem`, `*.key`, `secrets/`, API tokens, private certificates).
4. **Constructive Minimalism**: Solutions must be concise, well-structured, and free of unnecessary dependencies. All scripts in `scripts/` must remain pure Node.js without external npm dependencies (`zero-dependency`).

---

## 2. Code Style and Engineering Standards

- **Runtime**: Node.js (v18.0.0 or higher).
- **Module Format**: CommonJS (`'use strict'; const fs = require('fs');`) or dual CJS/ESM compatibility.
- **Dependencies**: Zero external npm packages in production scripts. Utilize Node.js built-in standard modules only (`fs`, `path`, `crypto`, `os`, `child_process`, `readline`).
- **Formatting**:
  - Indentation: 2 spaces. No tabs (except in Makefiles).
  - Line Endings: Unix LF (`\n`).
  - Character Encoding: UTF-8 without BOM.
  - Semicolons: Always use explicit semicolons.
- **Punctuation**: Avoid em-dash characters in documentation and commit messages. Use colons, commas, periods, or standard hyphens.

---

## 3. Contribution Workflow

### Step 1: Fork and Clone
```bash
git clone https://github.com/example/architect-skill.git
cd architect-skill
```

### Step 2: Create a Scoped Topic Branch
Branch names must reflect the subsystem and scope:
- `feat/adapter-zed` (New agent adapter)
- `feat/ref-saga-pattern` (New architecture reference)
- `fix/secret-scan-regex` (Security scanner refinement)
- `docs/troubleshooting-guide` (Documentation update)

```bash
git checkout -b feat/your-feature-name
```

### Step 3: Implement Changes
Ensure that any new files conform to the repository directory blueprint:
- Core manifests and rules live in the root directory.
- Agent-specific adapters live in `adapters/<agent>/`.
- Standard references live in `references/<category>/`.
- Raw Mermaid UML templates live in `assets/uml/`.
- Utility and verification scripts live in `scripts/`.
- Automated test suites live in `tests/`.

### Step 4: Run Mandatory Local Verification
Before opening a pull request, run all automated verification scripts locally:

```bash
# 1. Verify Node.js script syntax across all scripts
node -c scripts/*.js

# 2. Verify Mermaid UML template syntax
node scripts/validate-mermaid.js

# 3. Verify repository structure compliance
node scripts/validate-structure.js

# 4. Verify secret scanning and pattern masking
node scripts/secret-scan.js --check

# 5. Run automated test suite
node tests/offline.test.js
node tests/secret-scan.test.js
node tests/install.test.js
node tests/output.test.js
```

### Step 5: Commit and Pull Request
Commit messages must follow the Conventional Commits specification:
- `feat(adapters): add native support for Zed editor rules`
- `fix(scanner): correct false positive on UUID formatted identifiers`
- `docs(references): cite ISO 29148 clause 5.2 in SRD standard`

Pull requests will undergo automated CI testing including offline container checks (`--network=none`) and an independent forensic integrity audit.

---

## 4. Subsystem Guidelines

### Adding or Modifying References (`references/`)
Every reference file must include:
1. Formal citation of authoritative source (standard number, author, publication).
2. Theoretical model and foundational invariants.
3. Concrete implementation guidance (data structures, pseudocode, or SQL schemas).
4. Explicit trade-off analysis (when to use vs when to avoid).
5. Mathematical or algorithmic proofs where applicable (e.g. rate limiter time complexity, caching stampede probability formulas).

### Adding New Adapters (`adapters/`)
1. Create a dedicated subdirectory: `adapters/<agent-name>/`.
2. Provide the native instruction format required by the agent platform (`.mdc` for Cursor, `.prompt` for Continue, XML tags for Claude, etc.).
3. Update `adapters/README.md` with installation paths, trigger mechanisms, and verification methods.
4. Ensure the adapter adheres strictly to zero-egress and filesystem boundary policies.

---

## 5. Security & Ethical Mandate

Contributors must never introduce backdoors, obfuscated logic, telemetric data beacons, or dummy test facade functions. Any intentional bypass of the zero-egress policy or secret scanning engine will result in an immediate and permanent ban from the project.

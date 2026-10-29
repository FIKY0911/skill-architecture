# Quickstart Guide: `architect-skill`

## 1. Installation Across 7 AI Agents

```bash
# Dry-run preview (no disk changes)
node architect-skill/scripts/install.js --dry-run

# Install locally into current project (.claude, .agy, .codex, .cursor, .continue, .windsurfrules, .clinerules)
node architect-skill/scripts/install.js --local

# Install globally into user home (~/.claude, ~/.agy, ~/.codex, ~/.cursor, ~/.continue, ~/.codeium/windsurf)
node architect-skill/scripts/install.js --global
```

## 2. Invoking the Wizard
Ask your AI agent:
- *"Use architect-skill to design a Modular Monolith fintech system with PRD, BRD, SRD, and Neubrutalism UI."*
- Or run `/architect` in supported IDEs.

## 3. Verifying Output
```bash
node architect-skill/scripts/doctor.js
node architect-skill/scripts/validate-output.js ./docs
```

# Multi-Agent Adapter Integration Guide

`architect-skill` is engineered to integrate natively across seven leading AI agent platforms. Each adapter translates the core capabilities of `SKILL.md` into the native instruction syntax, rule format, and execution semantics required by the target environment.

---

## 1. Agent Compatibility & Path Matrix

The following table details the configuration format, installation locations, invocation commands, and runtime capabilities across all supported agents:

| AI Agent Platform | Config Format | Global Installation Path | Project-Local Installation Path | Trigger / Invocations | Tool Execution | Zero-Egress Status |
|---|---|---|---|---|---|---|
| **Claude Code & Desktop** | Markdown + XML Tags | `~/.claude/skills/architect-skill/` | `<project>/.claude/skills/architect-skill/` | Slash `/architect` | Yes (Bash / Tools) | 100% Verified |
| **Cursor IDE** | MDC Rule (`.mdc`) | `~/.cursor/rules/architect-skill.mdc` | `<project>/.cursor/rules/architect-skill.mdc` | Context / Globs (`docs/**`) | Yes (Terminal) | 100% Verified |
| **Continue.dev** | Prompt Template (`.prompt`) | `~/.continue/prompts/architect-skill.prompt` | `<project>/.continue/prompts/architect-skill.prompt` | Slash `/architect` | AI Guided | 100% Verified |
| **Codeium Windsurf** | Cascade Rules (`.windsurfrules`) | `~/.codeium/windsurf/.windsurfrules` | `<project>/.windsurfrules` | Cascade Context | Yes (Terminal) | 100% Verified |
| **Cline Autonomous** | Autonomous Rules (`.clinerules`) | Extension Storage | `<project>/.clinerules` | Autonomous Loop | Yes (Autonomous CLI) | 100% Verified |
| **OpenAI Codex CLI** | Markdown System Prompt | `~/.codex/skills/architect-skill/` | `<project>/.codex/skills/architect-skill/` | CLI Command | Yes (Subprocess) | 100% Verified |
| **Google Antigravity** | YAML Frontmatter Skill | `~/.agy/skills/architect-skill/` | `<project>/.agy/skills/architect-skill/` | Skill Loader | Yes (Subagent / Tool) | 100% Verified |

---

## 2. Installation Strategies: Global vs Local

The repository includes a dedicated installer (`scripts/install.js` and `scripts/install.sh`) supporting two primary installation modes:

### 2.1 Global Installation Mode
- **Purpose**: Makes `architect-skill` available across every project opened by the developer on the workstation.
- **Mechanism**: On Linux and macOS, the installer establishes symbolic links from the user home directory (`~/.claude/skills/`, `~/.cursor/rules/`, etc.) pointing back to the repository. On Windows, file copies are used if symlink permissions are unprivileged.
- **Command**:
  ```bash
  node scripts/install.js --global --agent all
  # or using the shell wrapper:
  ./scripts/install.sh --global
  ```

### 2.2 Project-Local Installation Mode
- **Purpose**: Commits the skill or agent adapter directly into an individual repository so that all collaborating team members inherit the same architecture standards automatically.
- **Mechanism**: The installer creates project-relative paths (e.g., `<project>/.cursor/rules/architect-skill.mdc`, `<project>/.clinerules`, `<project>/.windsurfrules`).
- **Command**:
  ```bash
  node scripts/install.js --local --mode copy --agent cursor,windsurf,cline
  # or using the shell wrapper:
  ./scripts/install.sh --local
  ```

---

## 3. Automated Backup Safeguard

Before any installation, modification, or symlink creation, `scripts/install.js` checks whether an existing file or directory is present at the target path.

If an existing configuration is detected:
1. A timestamped backup directory is created:
   `~/.architect-skill-backup/[YYYYMMDD-HHMMSS]/[agent_name]/`
2. The preexisting configuration is safely copied or moved into the backup folder.
3. The installer logs the exact backup location to stdout.
4. To revert to a prior state, copy the contents of the backup directory back to the respective target path.

---

## 4. Adapter File Specifications

### 4.1 Claude Code & Desktop (`adapters/claude/SKILL.md`)
- **Syntax**: Anthropic Claude structured XML blocks: `<role>`, `<instructions>`, `<guidelines>`, `<capabilities>`, `<command_routing>`.
- **Key Directive**: Informs Claude of the available reference libraries and explicitly directs it to execute the Node.js validation scripts before concluding turns.

### 4.2 Cursor IDE (`adapters/cursor/architect-skill.mdc`)
- **Syntax**: Cursor Markdown Rule format with YAML frontmatter specifying file globs (`docs/**, src/**, package.json`).
- **Key Directive**: Instructs Cursor Composer/Agent to monitor architecture discussions, restrict writes strictly to `./docs/`, and reject attempts to parse `.env` files.

### 4.3 Continue.dev (`adapters/continue/architect-skill.prompt`)
- **Syntax**: Continue prompt template with variable substitution `{{{ input }}}`.
- **Key Directive**: Registers the slash command `/architect` in the Continue sidebar chat.

### 4.4 Codeium Windsurf (`adapters/windsurf/.windsurfrules`)
- **Syntax**: Cascade system instructions.
- **Key Directive**: Provides Windsurf Cascade with operational boundaries for `./docs/` generation and ensures local-first privacy.

### 4.5 Cline Autonomous Agent (`adapters/cline/.clinerules`)
- **Syntax**: Comprehensive autonomous agent system guidelines.
- **Key Directive**: Commands Cline to execute `node scripts/wizard-state.js` during multi-turn sessions and run `node scripts/validate-mermaid.js` whenever `.mmd` diagrams are authored.

### 4.6 OpenAI Codex CLI (`adapters/codex/SKILL.md`)
- **Syntax**: Standard system prompt for Codex CLI agents.
- **Key Directive**: Explains command line argument routing, non-interactive execution, and offline document rendering.

### 4.7 Google Antigravity (`adapters/antigravity/SKILL.md`)
- **Syntax**: Antigravity Skill format with YAML frontmatter.
- **Key Directive**: Enforces parent-worker orchestration boundaries, scratch directory isolation, and verification gates.

---

## 5. Troubleshooting Agent Integrations

1. **Target Directory Missing**:
   - If an agent is not installed on your system (e.g., `~/.claude/` does not exist), the installer will report a warning and skip that agent while continuing with the others.
2. **Symlink Permission Denied on Windows**:
   - Windows requires Administrator privileges or Developer Mode to create symlinks. Use `--mode copy` on Windows environments:
     ```bash
     node scripts/install.js --global --mode copy
     ```
3. **Agent Not Triggering**:
   - Verify that the adapter is placed in the expected path by running:
     ```bash
     node scripts/doctor.js
     ```

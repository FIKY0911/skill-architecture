# Installation, Configuration & GitHub Open-Source Guide (`architect-skill`)

This guide covers end-to-end installation, per-agent configuration across 7 AI coding ecosystems, custom security policy tuning, and how to publish/consume `architect-skill` as an MIT open-source repository on GitHub.

---

## 1. Prerequisites

- **Node.js**: `>= 18.0.0` (uses zero external NPM dependencies; relies strictly on built-in `fs`, `path`, `crypto`, `os`, `assert` modules).
- **Operating System**: Linux, macOS, or Windows (WSL2 or native PowerShell).
- **Network**: **None required** (`architect-skill` is 100% local-first and enforces zero-egress offline execution).

---

## 2. Quick Installation (From GitHub or Local Clone)

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/architect-skill.git
cd architect-skill

# 2. Verify environment health and SHA-256 tool integrity
node scripts/doctor.js
node runtime-firewall/verify.js

# 3. Preview installation paths without modifying disk (--dry-run)
node scripts/install.js --dry-run

# 4a. Install GLOBALLY for all 7 AI agents in your user home (~/)
node scripts/install.js --global

# 4b. Or install LOCALLY inside a specific target project
cd /path/to/your-project
node /path/to/architect-skill/scripts/install.js --local
```

### Installing for a Single Specific AI Agent
Use `--target <agent>` to install only for the AI assistant you use:
```bash
# Supported targets: claude | antigravity | codex | cursor | continue | windsurf | cline
node scripts/install.js --global --target antigravity
node scripts/install.js --local --target cursor
```

### Automatic Backup & Uninstallation
- Every time `install.js` detects an existing rule or skill file, it automatically creates a timestamped backup in:
  `~/.architect-skill-backup/<timestamp>/<agent>/`
- To cleanly remove all installed symlinks/files:
  ```bash
  node scripts/install.js --global --uninstall
  node scripts/install.js --local --uninstall
  ```

---

## 3. Per-Agent Configuration & Usage

Once installed, `architect-skill` maps automatically to the native configuration format of each AI platform:

| AI Agent Platform | Global Config Path | Project Local Path | How to Invoke in Chat |
| :--- | :--- | :--- | :--- |
| **Google Antigravity (AGY)** | `~/.agy/skills/architect-skill/` | `<project>/.agy/skills/architect-skill/` | Automatic skill detection or mention `@architect-skill` |
| **Claude Code / Desktop** | `~/.claude/skills/architect-skill/` | `<project>/.claude/skills/architect-skill/` | Type `/architect` or ask *"Run architect-skill wizard"* |
| **Cursor IDE** | `~/.cursor/rules/architect-skill.mdc` | `<project>/.cursor/rules/architect-skill.mdc` | Automatically attached via `.mdc` rule or `@architect-skill.mdc` |
| **Continue.dev** | `~/.continue/prompts/architect-skill.prompt` | `<project>/.continue/prompts/architect-skill.prompt` | Type `/architect` in Continue sidebar |
| **Codeium Windsurf** | `~/.codeium/windsurf/.windsurfrules` | `<project>/.windsurfrules` | Automatically loaded by Cascade rules engine |
| **Cline / Roo-Code** | N/A (Workspace-scoped) | `<project>/.clinerules` | Automatically loaded as workspace `.clinerules` |
| **OpenAI Codex CLI** | `~/.codex/skills/architect-skill/` | `<project>/.codex/skills/architect-skill/` | Loaded via Codex skill instructions |

---

## 4. Configuring Wizard Presets, UI Libraries & Frontend Aesthetics

### 4.1 Initializing or Customizing Wizard State (`scripts/wizard-state.js`)
You can pre-seed or resume the interactive wizard via CLI or let the AI agent run it conversationally:

```bash
# Initialize a new session in ./docs/.architect-wizard-state.json
node scripts/wizard-state.js init my-saas-platform

# Inspect active session state
node scripts/wizard-state.js status

# Finalize session after all ./docs/ artifacts pass validation
node scripts/wizard-state.js finalize
```

### 4.2 Supported UI Component Libraries (`ui_library`)
Configured in `assets/ui/ui-libraries.md`:
- `tailwind-shadcn` (Tailwind CSS + shadcn/ui + Radix UI primitives — Zero runtime)
- `daisyui` (Semantic Tailwind CSS classes — Zero runtime)
- `mantine` (Mantine v7+ CSS Modules)
- `chakra` (Chakra UI v3 + Zag.js state machines)
- `antd` (Ant Design v5 Enterprise)
- `mui` (Material UI v5/v6)

### 4.3 Supported Senior Frontend Visual Aesthetics (`fe_aesthetic`)
Configured in `assets/ui/fe-aesthetics.md`:
1. `neubrutalism` — High-contrast 3px solid black borders, hard offset shadows (`5px 5px 0px #000`), vibrant pop colors (Saweria.co, Gumroad, Figma style).
2. `bento-grid` — Linear / Raycast / Apple style modular dark zinc grid (`#09090B`) with radial spotlight borders.
3. `glassmorphism` — Multi-layered frosted glass (`backdrop-blur-2xl`) over Aurora mesh gradients.
4. `swiss-editorial` — International Typographic Style mathematical grid, 0px border radius, stark typography.
5. `clean-saas` — Stripe / Vercel enterprise slate neutrals, crisp 1px borders, semantic status badges.
6. `material-3` — Google Material You tonal surface containers and pill triggers.
7. `neumorphism` — Soft dual-shadow extruded controls with WCAG contrast reinforcements.
8. `retro-terminal` — Cyberpunk phosphor green monochrome with CRT scanlines.

---

## 5. Security & Zero-Credential Configuration (`policies/`)

`architect-skill` is engineered so it **can never read host AI credentials or target application/APK secrets**:

1. **Filesystem Scope (`policies/filesystem-scope.json`)**:
   - Explicitly blocks reading `.env`, `.env.*`, `*.pem`, `*.key`, `*.keystore`, `*.jks`, `*.p12`, `*.pfx`, `id_rsa*`, `secrets/`, `~/.ssh/`, `~/.aws/`, `~/.claude/auth*`, `~/.cursor/`, and `~/.codex/`.
   - Restricts write operations strictly to `./docs/` and `~/.architect-skill-backup/`.
2. **Secret Redaction Rules (`policies/redaction-rules.json`)**:
   - Defines 11 regex rules automatically masking AWS keys, GitHub PATs, Anthropic/OpenAI/Gemini keys, JWTs, PEM Private Keys, DB URI passwords, and Android APK keystore passwords (`storePassword` / `keyPassword`) into `[REDACTED:<TYPE>]`.
3. **Zero-Egress Network Policy (`policies/network-allowlist.json`)**:
   - Locked to `"mode": "strict-zero-egress"` with empty `allowed_hosts: []`. Enforced at runtime by `scripts/egress-guard.js`.
4. **Tool Integrity Pinning (`runtime-firewall/tool-pins.json`)**:
   - If you customize any script in `scripts/`, update the SHA-256 hash registry by running:
     ```bash
     node runtime-firewall/verify.js --update
     ```

---

## 6. Publishing to GitHub as an MIT Open-Source Repository

Before pushing to GitHub, run the built-in quality and security gates to guarantee the repository is 100% clean:

```bash
cd architect-skill

# 1. Run structural, Mermaid, doctor, and SHA-256 pin verification
node scripts/validate-structure.js
node scripts/validate-mermaid.js
node scripts/doctor.js
node runtime-firewall/verify.js

# 2. Scan the entire repository to ensure zero stray secrets exist
node scripts/secret-scan.js . --check

# 3. Run unit, integration, and 4-tier E2E test suites
node tests/egress-offline.test.js
node tests/secret-scan.test.js
node tests/install.test.js
node tests/output-integrity.test.js
node tests/e2e/runner.js

# 4. Initialize Git and push to GitHub (MIT Licensed)
git init
git add .
git commit -m "feat: initial release of architect-skill (MIT)"
git branch -M main
git remote add origin https://github.com/<your-username>/architect-skill.git
git push -u origin main
```

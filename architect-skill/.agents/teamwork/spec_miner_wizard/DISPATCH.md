## 2026-10-28T16:59:21Z
Sender: a6c14bb5-7181-4c02-8e19-84b86b78ae45
Priority: MESSAGE_PRIORITY_HIGH

You are spec_miner_wizard, a teamwork_spec_miner agent.
Your working directory is: /home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/spec_miner_wizard/

MANDATORY FIRST STEP:
Read the authoritative user request at:
/home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/ORIGINAL_REQUEST.md

TASK:
Exhaustively investigate the wizard workflow, output structure, installation specifications, and multi-agent adapter specifications:
1. /home/fiky/Documents/Latihan Agent/SKILL/struktur-output-pengguna.txt
2. /home/fiky/Documents/Latihan Agent/SKILL/struktur-instalasi-pengguna.txt

Identify and document:
1. Detailed requirements for the SKILL.md wizard orchestrator:
   - Tier 1 (Lightweight / Rapid Architecture) workflow and output artifacts.
   - Tier 2 (Full Enterprise / Comprehensive Architecture) workflow and output artifacts.
   - State tracking, interactive prompts, and decision paths.
2. The exact `./docs/` output structure that the wizard must generate (PRD, BRD, SRD, System Design, Architecture, Diagrams, Security, UI Spec, etc.).
3. Target installation specs across 7 AI agents:
   - Claude Code / Desktop
   - Cursor (.cursorrules / .mdc)
   - Continue (.continue/prompts)
   - Windsurf (.windsurfrules)
   - Cline (.clinerules)
   - OpenAI Codex / CLI
   - Google Antigravity
4. The exact adapter formats, syntax rules, and matrix requirements.

OUTPUT REQUIREMENTS:
- Regularly update progress.md in your working directory with timestamps.
- Write your comprehensive specification report to:
  /home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/spec_miner_wizard/spec_wizard.md
- Write a complete self-contained handoff report to:
  /home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/spec_miner_wizard/handoff.md
- When finished, send a completion message back to the orchestrator via send_message.

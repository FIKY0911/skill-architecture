# Architectural Comparison: Agent Skill vs IDE Plugin vs MCP Server

| Dimension | Agent Skill (`SKILL.md` + Local Scripts) | IDE Extension / Plugin | MCP Server (Model Context Protocol) |
| :--- | :--- | :--- | :--- |
| **Execution Footprint** | 0 background daemons; loaded on-demand | Resident in IDE extension host process | Persistent child process / HTTP SSE server |
| **Network Surface** | **Zero-Egress** (`egress-guard.js`) | Unrestricted IDE network stack | Often bridges external APIs |
| **Cross-Agent Portability** | **Universal** (Claude, Cursor, Continue, Windsurf, Cline, Codex, Antigravity) | Locked to single IDE (e.g., VS Code only) | Requires MCP host client support |
| **Auditability** | 100% plain-text Markdown + zero-dependency Node.js | Compiled/bundled VSIX binary | Requires schema & tool-pin verification |
| **Credential Safety** | Enforced via `filesystem-scope.json` & `secret-scan.js` | Full host user privileges | Depends on server env configuration |

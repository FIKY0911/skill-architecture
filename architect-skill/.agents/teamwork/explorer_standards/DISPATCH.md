## 2026-10-28T16:59:38Z
You are explorer_standards, a teamwork_explorer agent.
Your working directory is: /home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/explorer_standards/

MANDATORY FIRST STEP:
Read the authoritative user request at:
/home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/ORIGINAL_REQUEST.md

TASK:
Investigate and synthesize technical specifications for standards, frontend aesthetics, and zero-egress security:
1. Formal Requirements Standards:
   - PRD: Atlassian product management methodology (problem framing, personas, user journeys, functional specs, non-functional specs, success metrics).
   - BRD: BABOK Guide IIBA (Business Analysis Body of Knowledge) standard (business need, enterprise impact, stakeholder analysis, financial feasibility, governance).
   - SRD: ISO/IEC/IEEE 29148:2018 Systems and software engineering — Life cycle processes — Requirements engineering.
2. Architectural Patterns & System Design:
   - Clean Architecture, Modular Monolith, Event-Driven Architecture, Hexagonal (Ports & Adapters), Feature-Sliced Design (FSD).
   - Redis caching strategies (Cache-Aside, Read/Write-Through, Write-Behind, cache stampede mitigation).
   - Distributed locking with Redlock and monotonic Fencing Tokens (Kleppmann fencing tokens).
   - RDBMS scaling: read replicas, connection pooling, sharding, partitioning strategies.
   - Async message queues (Kafka, RabbitMQ, SQS, dead-letter queues, idempotent processing).
   - Rate limiting algorithms (Token Bucket, Leaky Bucket, Sliding Window Counter).
3. Frontend Aesthetic Themes & Official UI Libraries (FE Aesthetics):
   - Official UI libraries: Tailwind CSS + shadcn/ui, DaisyUI, Mantine, Chakra UI, Ant Design, MUI.
   - Comprehensive curation of senior frontend aesthetic styles:
     * Neubrutalism / Neo-Brutalism (high contrast, bold black borders, hard offset shadows, vibrant accents, saweria/gumroad/figma aesthetic).
     * Bento Grid / Linear-style Minimalist Dark/Light (subtle borders, glowing accents, grid modularity).
     * Glassmorphism & Aurora / Mesh Gradient UI (frosted glass, backdrop-blur, diffused radial gradients).
     * Swiss / International Typographic Style (strict grid, asymmetric layouts, bold sans-serif typography, editorial clean).
     * Modern SaaS Clean Enterprise (Stripe / Tailwind / Vercel style, refined neutral palettes, micro-interactions).
     * Material Design 3 (dynamic color, rounded elevation, tonal palettes).
     * Neumorphism / Soft UI (soft dual shadows, extruded/inset surfaces).
     * Retro / Cyberpunk / Terminal Aesthetics (monospace, CRT scanlines, neon accents, dark backgrounds).
     Document design tokens (color palettes, border-radius, shadows, typography) and concrete CSS/Tailwind implementation classes for each style.
4. Absolute Credential Protection & Zero-Egress Security:
   - Rules preventing any script or agent from accessing AI agent credentials or project secrets (.env, *.pem, *.key, secrets/, credentials).
   - Regex patterns for secret detection (AWS keys, GitHub tokens, JWT, private keys, connection strings) for policies/redaction-rules.json and scripts/secret-scan.js.
   - Local-first zero-egress policy design: blocking network calls, offline verification, egress guard.

OUTPUT REQUIREMENTS:
- Regularly update progress.md in your working directory with timestamps.
- Write your comprehensive report to:
  /home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/explorer_standards/standards_report.md
- Write a complete self-contained handoff report to:
  /home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/explorer_standards/handoff.md
- When finished, send a completion message back to the orchestrator via send_message.

## 2026-10-28T17:08:18Z
You are worker_m2, a teamwork_worker agent.
Your working directory is: /home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/worker_m2/

MANDATORY FIRST STEP:
Read the authoritative user request at:
/home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/ORIGINAL_REQUEST.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

CONTEXT & INPUTS:
- Architecture & Scope: /home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/orchestrator/PROJECT.md
- Specification Mines:
  - /home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/spec_miner_repo/spec_repo.md (Subsystem 3 details)
  - /home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/explorer_standards/standards_report.md (Authoritative standards, BABOK, Atlassian, ISO/IEC/IEEE 29148, system design, security patterns)

EXCLUSIVE WRITE OWNERSHIP (20 files ONLY):
You exclusively own and write ONLY these 20 files under `architect-skill/references/`:
1. Requirements (`references/requirements/` - 3 files):
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/requirements/prd.md (Atlassian PM methodology, problem framing, personas, user journeys, functional/non-functional specs, acceptance criteria, success metrics)
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/requirements/brd.md (BABOK Guide IIBA standard, business need, enterprise analysis, stakeholder requirements, ROI/cost-benefit, governance)
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/requirements/srd.md (ISO/IEC/IEEE 29148:2018, EARS syntax, functional/non-functional requirements, IV&V matrix, traceability)
2. Architecture (`references/architecture/` - 5 files):
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/architecture/clean-architecture.md (Uncle Bob clean architecture, concentric onion layers, dependency inversion rule, entities, use cases, interface adapters)
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/architecture/modular-monolith.md (Bounded contexts, strict package boundaries, internal module contracts, outbox communication, anti-corruption layers)
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/architecture/event-driven.md (EDA topologies, pub/sub, event sourcing, transactional outbox pattern, idempotent consumers, schema evolution)
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/architecture/hexagonal.md (Alistair Cockburn Ports & Adapters, driving vs driven ports, dependency direction, domain isolation)
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/architecture/fsd.md (Feature-Sliced Design v2.1: app, processes, pages, widgets, features, entities, shared layers and import direction rules)
3. System Design (`references/system-design/` - 5 files):
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/system-design/caching-redis.md (Cache-Aside, Read/Write-Through, Write-Behind, eviction policies, TTL strategies, probabilistic early expiration XFetch algorithm for cache stampede)
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/system-design/distributed-locking.md (Redlock algorithm, Martin Kleppmann critique, strictly monotonic fencing tokens, lease renewal, clock skew handling)
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/system-design/rdbms-scaling.md (Read replicas, CQRS, connection pooling with PgBouncer, range/hash sharding, declarative table partitioning, zero-downtime migrations)
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/system-design/async-message-queue.md (Kafka partition ordering, RabbitMQ exchange/queues, AWS SQS, dead-letter queues, exactly-once semantics via idempotency keys)
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/system-design/rate-limiting.md (Token bucket, leaky bucket, sliding window counter algorithm with Redis ZSET and Lua scripts, distributed rate limiting)
4. Security (`references/security/` - 7 files):
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/security/threat-model.md (STRIDE threat modeling, attack trees, DREAD scoring, zero-trust boundary mapping)
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/security/secret-handling.md (Zero credential access, redaction masks, ephemeral memory handling, rejection of .env/pem/key files)
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/security/local-first.md (Zero-egress design, offline verification, localhost-only binding, CRDT considerations)
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/security/trust-model.md (Untrusted caller assumption, deterministic schema validation, principle of least privilege)
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/security/sandbox-isolation.md (Landlock LSM, cgroups v2 resource limits, container namespace isolation, Firecracker microVMs)
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/security/prompt-injection.md (Structured delimiter encapsulation, indirect prompt injection defense, taint analysis, output sanitization)
   - /home/fiky/Documents/Latihan Agent/SKILL/architect-skill/references/security/tool-pinning.md (Cryptographic SHA-256 verification of tool binaries and MCP schemas, prevention of tool hijacking)

DO NOT touch any other directory or file.

TASK:
Write all 20 reference files in thorough, comprehensive, authoritative detail using senior software engineering rigor.

OUTPUT REQUIREMENTS:
- Regularly update progress.md in your working directory with timestamps.
- Write your completion handoff report to:
  /home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/worker_m2/handoff.md
- When finished, send a completion message back to the orchestrator via send_message.

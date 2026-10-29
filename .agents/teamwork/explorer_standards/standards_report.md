# Comprehensive Technical Specifications: Standards, Frontend Aesthetics, and Zero-Egress Security

- Author: Teamwork Explorer (`explorer_standards`)
- Archetype: Formal Logician / Systems Architect
- Target System: `architect-skill`
- Date: 2026-10-28
- Integrity Mode: Local-First / Zero-Egress / Development

---

## Executive Summary

This report establishes the technical foundation for `architect-skill`. The objective is to provide a multi-agent architectural skill operating across seven major AI coding environments (Claude, Cursor, Continue, Windsurf, Cline, Codex, Antigravity) without relying on generic heuristics, unauthorized network access, or loose AI hallucinations.

The specifications are divided into four authoritative domains:
1. Formal Requirements Engineering Standards (PRD under Atlassian methodology, BRD under BABOK Guide IIBA, SRD under ISO/IEC/IEEE 29148:2018).
2. Architectural Patterns and System Design Rigor (Clean Architecture, Modular Monolith, EDA, Hexagonal, FSD, Redis caching lifecycle, Kleppmann fencing tokens for distributed locks, RDBMS scaling, Async Message Queues with Transactional Outbox, Rate Limiting mathematics).
3. Senior Frontend Aesthetics and UI Frameworks (6 major official UI libraries evaluated, 8 distinct senior frontend visual styles with explicit design tokens and CSS/Tailwind classes).
4. Absolute Credential Protection and Zero-Egress Security (Untrusted caller model, exhaustive regex secret detection suite, runtime Node.js monkey-patch egress guard, sandbox confinement, and strict filesystem scoping).

---

## 1. Formal Requirements Standards

Software systems fail predominantly from ambiguous, untraceable, or conflicting requirements rather than programming syntax errors. `architect-skill` enforces three formal requirements documentation tiers:

```
+-----------------------------------------------------------------------+
| BRD (Business Requirements Document) - BABOK Guide IIBA               |
| Why: Enterprise value, financial ROI, stakeholder impact, governance  |
+---------------------------------------------------+-------------------+
                                                    |
                                                    v
+---------------------------------------------------+-------------------+
| PRD (Product Requirements Document) - Atlassian Methodology           |
| What & Who: Problem framing, personas, journeys, functional/NFR, MoSCoW|
+---------------------------------------------------+-------------------+
                                                    |
                                                    v
+---------------------------------------------------+-------------------+
| SRD (Software/System Requirements Document) - ISO/IEC/IEEE 29148:2018 |
| How it behaves formally: EARS syntax, verification matrix, traceability|
+-----------------------------------------------------------------------+
```

### 1.1 PRD: Atlassian Product Management Methodology

The Product Requirements Document (PRD) bridges customer problems and technical realization. Based on Atlassian's agile product management framework, every generated PRD must adhere to the following structure:

#### Mandatory Sections
1. **Problem Framing & Context**:
   - Problem Statement: Explicit formulation of the pain point using the formula: `[Target User] experiences [Problem] when [Trigger/Context], resulting in [Business/User Impact]`.
   - Market / Strategic Context: Why solve this problem now? Opportunity size and strategic fit.
   - Goals & Non-Goals: Explicit negative scoping. What the product will explicitly *not* do in this release.
2. **Personas & User Journeys**:
   - Persona Archetypes: Demographic, role, primary objective, technical proficiency, key frustrations.
   - End-to-End User Journey: Linear steps taken by the user from discovery to value achievement, highlighting friction points and emotional states.
3. **Functional Specifications**:
   - Epics and Feature Decompositions.
   - User Stories formatted with Gherkin acceptance criteria:
     ```gherkin
     Scenario: User triggers payment with expired card
       Given the user has an active session
       And the stored credit card expired on 2026-09-30
       When the user submits the checkout request
       Then the system rejects the transaction with code CARD_EXPIRED
       And prompts the user to input a valid payment instrument
       And no charge is posted to the payment gateway
     ```
   - Feature Prioritization using the MoSCoW framework (Must have, Should have, Could have, Won't have) or RICE score (`(Reach * Impact * Confidence) / Effort`).
4. **Non-Functional Specifications (NFR)**:
   - Latency: p50 < 50ms, p95 < 120ms, p99 < 250ms for synchronous API endpoints.
   - Availability: 99.9% uptime (maximum 8.76 hours unscheduled downtime per year).
   - Scalability: System must handle minimum 1,500 RPS sustained throughput with auto-scaling trigger at 70% CPU/Memory utilization.
   - Accessibility: Strict WCAG 2.1 Level AA compliance.
5. **Success Metrics & Telemetry Plan**:
   - North Star Metric: The single metric best capturing customer value delivered (e.g. Daily Active Workflows Completed).
   - Input Metrics (L1/L2): Conversion rate, funnel drop-off, time-to-first-value.
   - Guardrail Metrics: Error rate (< 0.05%), customer support tickets, p99 latency.
   - Event Tracking Schema: `event_name`, `entity_id`, `user_id`, `timestamp_utc`, `properties_map`.
6. **Release Planning & Phased Rollout**:
   - Phase 0: Internal dogfooding.
   - Phase 1: Private Beta (canary release 5% of traffic).
   - Phase 2: Public Beta (feature-flagged 25% -> 50% -> 100%).
   - Rollback Triggers: Automated rollback if error rate exceeds 1% over 5-minute rolling window.

---

### 1.2 BRD: BABOK Guide IIBA Standard

The Business Requirements Document (BRD) defines the operational, organizational, and financial justification from the enterprise perspective, following the IIBA Business Analysis Body of Knowledge (BABOK Guide v3).

#### Mandatory Knowledge Areas & Sections
1. **Business Need & Strategic Alignment**:
   - Current State Analysis: Current operational bottlenecks, technical debt, and revenue leakages.
   - Desired Future State: Quantitative business capabilities unlocked.
   - Enterprise Strategic Alignment: Direct link to corporate OKRs (Objectives and Key Results) and multi-year roadmap.
2. **Enterprise Impact Analysis**:
   - Cross-functional impact matrix: Operations, Customer Success, Legal/Compliance, Finance, Security.
   - Organizational Change Management (OCM): Training requirements, workflow transitions, user adoption risk.
3. **Stakeholder Analysis (RACI Framework)**:
   - Responsible: Engineers and product designers executing deliverables.
   - Accountable: Product Owner / Sponsor owning final sign-off.
   - Consulted: Security team, compliance officers, database administrators.
   - Informed: Executive leadership, customer support leads.
4. **Financial Feasibility & Cost-Benefit Analysis**:
   - CapEx (Capital Expenditure) vs OpEx (Operational Expenditure).
   - Total Cost of Ownership (TCO) calculated across a 3-year horizon:
     $$\text{TCO} = \text{Initial Dev Cost} + \sum_{t=1}^{3} \frac{\text{Infrastructure}_t + \text{Maintenance}_t + \text{Licensing}_t}{(1 + r)^t}$$
   - Return on Investment (ROI) and Net Present Value (NPV):
     $$\text{NPV} = \sum_{t=0}^{N} \frac{R_t}{(1 + r)^t} - \text{Initial Outlay}$$
   - Payback Period: Explicit months to break-even.
5. **Governance, Risk, and Compliance (GRC)**:
   - Regulatory constraints: GDPR Article 17 (Right to Erasure), HIPAA, PCI-DSS Level 1, SOC 2 Type II controls.
   - Business Continuity & Disaster Recovery (BCDR): Recovery Point Objective (RPO <= 1 minute), Recovery Time Objective (RTO <= 15 minutes).
   - Sign-off Approval Matrix: Formal cryptographic or documented approval signatures required prior to engineering kickoff.

---

### 1.3 SRD: ISO/IEC/IEEE 29148:2018 Standard

ISO/IEC/IEEE 29148:2018 is the international standard governing life cycle processes and requirements engineering. It supersedes older, fragmented standards including IEEE 830-1998 (Software Requirements Specifications), IEEE 1233 (System Requirements), and IEEE 1362 (Concept of Operations).

#### Distinction from IEEE 830
IEEE 830 was limited strictly to software artifacts without establishing bidirectional traceability across stakeholder needs, system capabilities, and verification protocols. ISO/IEC/IEEE 29148 establishes a unified requirements hierarchy:
1. Stakeholder Requirements (StR)
2. System Requirements (SyR)
3. Software Requirements (SoR / SRD)

#### ISO 29148 Clause 5.2: Requirement Quality Attributes
Every requirement statement generated by `architect-skill` must satisfy nine formal attributes:
- **Necessary**: The capability is indispensable to fulfill parent stakeholder goals.
- **Implementation-Independent**: Specifies *what* the system shall do, never dictating implementation technologies in the requirement text.
- **Unambiguous**: Exactly one interpretation exists; avoids ambiguous quantifiers ("fast", "user-friendly", "robust").
- **Complete**: Expresses all necessary conditions, inputs, triggers, and expected outputs.
- **Singular**: Contains exactly one testable assertion; never combines multiple assertions with conjunctions ("and", "as well as").
- **Feasible**: Technically achievable within known physical, time, and budget constraints.
- **Verifiable**: Can be proven true or false using an objective verification method.
- **Traceable**: Tagged with a globally unique identifier (e.g. `REQ-SRD-AUTH-001`) and linked to parent business needs and downstream test cases.
- **Consistent**: Contains no contradictions with other requirement statements.

#### Formal Requirement Syntax: EARS (Easy Approach to Requirements Syntax)
Requirements must follow one of five EARS patterns:
1. **Ubiquitous**: `The [system] shall [action].`
2. **Event-driven**: `When [trigger/event], the [system] shall [action].`
3. **State-driven**: `While [in state], the [system] shall [action].`
4. **Unwanted event / Error**: `If [error/fault condition], then the [system] shall [action].`
5. **Optional feature**: `Where [feature flag/option enabled], the [system] shall [action].`

#### Verification Matrix Standards
Every requirement must map to one of four recognized verification methods:
- **[I] Inspection**: Visual examination of artifacts, schemas, or source code.
- **[A] Analysis**: Mathematical proof, algorithmic modeling, or simulation.
- **[D] Demonstration**: Observable operational exercise without quantitative telemetry measurement.
- **[T] Test**: Execution under controlled inputs with quantitative measurement against pass/fail thresholds.

#### Traceability Matrix Schema
| Requirement ID | EARS Pattern | Requirement Statement | Parent BRD / PRD | Verification Method | Test Case ID |
|---|---|---|---|---|---|
| `REQ-SRD-SEC-001` | Unwanted | If an authentication token is malformed, then the auth-service shall return HTTP 401 Unauthorized within 15 milliseconds. | `BRD-SEC-02` | Test (T) | `TC-SEC-001-A` |
| `REQ-SRD-ORD-014` | Event-driven | When an order transitions to PAID, the order-service shall publish an OrderPlaced integration event to the broker within 50 milliseconds. | `PRD-CHECKOUT-04`| Test (T) | `TC-ORD-014-B` |

---

## 2. Architectural Patterns & System Design

### 2.1 Architectural Patterns

#### Clean Architecture (Robert C. Martin)
- **The Dependency Rule**: Source code dependencies must point solely inward toward higher-level policies. Inner circles have zero knowledge of outer circles.
  1. *Entities (Enterprise Business Rules)*: Domain models, value objects, business invariants. No external framework annotations or ORM couplings.
  2. *Use Cases (Application Business Rules)*: Input/Output boundary ports, interactor implementations orchestrating business flows.
  3. *Interface Adapters (Controllers, Presenters, Gateways)*: Translates data between use case formats and external driver formats. Repository implementations reside here.
  4. *Frameworks & Drivers (Web, DB, UI, External Devices)*: Ephemeral infrastructure details (Express, Fastify, TypeORM, Prisma, Redis client).
- **Boundary Crossing**: Achieved strictly via Inversion of Control (IoC). Use cases define output ports (interfaces). Presenters or gateways implement those ports.

#### Modular Monolith
- **Architecture**: A single deployable binary or runtime process containing strictly encapsulated logical modules.
- **Module Encapsulation**: Each module exposes a single public API contract / facade. Internal classes, services, and repositories are package-private or non-exported.
- **Inter-Module Communication**:
  - Synchronous: Direct invocation of exported public interfaces only. Cross-module database table joins are strictly forbidden.
  - Asynchronous: In-memory domain event bus / mediator pattern. Module A publishes an event; Module B consumes it asynchronously.
- **Database Strategy**: Single physical database engine with logical schema isolation per module (`module_billing.invoices`, `module_auth.users`). Prevents data layer coupling and enables zero-rewrite microservices extraction if scale demands it.

#### Event-Driven Architecture (EDA)
- **Topologies**: Mediator topology (centralized orchestrator for complex workflows) vs Broker topology (lightweight choreography across message chains).
- **Event Types**:
  - *Domain Events*: Emitted within a single bounded context (e.g. `OrderCreated`).
  - *Integration Events*: Emitted across system boundaries over durable message channels (e.g. `Billing.InvoiceSettled`).
  - *Event Notification* vs *Event-Carried State Transfer (ECST)*: ECST includes the full snapshot of mutated attributes, eliminating downstream back-queries to the producer.
- **Consistency**: Guaranteed Eventual Consistency. Long-running transactions managed via the Saga Pattern (Orchestrated Saga with compensating transactions).

#### Hexagonal Architecture (Ports and Adapters - Alistair Cockburn)
- **Concept**: Core domain inside an asymmetric hexagon; all input/output infrastructure outside.
- **Driving / Primary Ports & Adapters**: Inbound actors (HTTP REST, gRPC, CLI, Message Queue Consumer). The adapter converts driver requests into core port invocations.
- **Driven / Secondary Ports & Adapters**: Outbound actors (PostgreSQL, Redis, SendGrid, Stripe). The core defines the SPI (Service Provider Interface) port; the infrastructure adapter implements it.

#### Feature-Sliced Design (FSD v2.1)
Modern architectural standard for scalable frontend engineering:
- **Hierarchical Layers** (Strict unidirectional top-to-bottom imports; lower layers cannot import from higher layers):
  1. `app`: Application initialization, global providers, routing entry point, global styles.
  2. `pages`: Composed views matching application routes.
  3. `widgets`: Standalone composite UI blocks combining features and entities (e.g. `Header`, `ProductGrid`).
  4. `features`: User interaction logic providing direct business value (e.g. `AuthByEmail`, `AddToCart`, `FilterCatalog`).
  5. `entities`: Domain models and business entities (e.g. `User`, `Product`, `Order`).
  6. `shared`: Reusable, domain-agnostic UI kit, utility libraries, network clients, environment configs.
- **Slices**: Business domains dividing layers into subdirectories (e.g. `entities/user`, `entities/order`).
- **Segments**: Technical roles inside slices: `ui`, `model`, `api`, `lib`, `config`.
- **Public API**: Slices must expose an `index.ts` declaring public exports. Importing internal slice files directly is an architectural violation.

---

### 2.2 System Design Rigor

#### Redis Caching Strategies & Stampede Mitigation
- **Cache-Aside (Lazy Loading)**: Application queries Redis. On miss, queries DB, populates Redis with TTL, returns data. Best for read-heavy workloads with unpredictable key access.
- **Read-Through / Write-Through**: Application treats cache as the primary store. Cache provider automatically reads from or synchronously writes to DB before acknowledging write.
- **Write-Behind (Write-Back)**: Writes are acknowledged immediately to Redis and queued in memory; an asynchronous worker batches writes to DB. Maximizes write throughput; introduces risk of data loss during node crash.
- **Cache Stampede (Thundering Herd) Mitigation**:
  1. *Probabilistic Early Expiration (XFetch Algorithm - Vattani, Chierichetti, Lowenstein)*:
     Read operation computes whether to recalculate value before official expiry:
     $$\Delta \cdot \beta \cdot \ln(\text{random}()) > \text{TTL}_{\text{remaining}}$$
     Where $\Delta$ is computation time delta, $\beta > 0$ is aggressiveness factor. If true, worker refreshes cache asynchronously in background while serving existing value.
  2. *Singleflight / Mutex Locking*: On cache miss, thread acquires distributed lock or local mutex (`sync.Singleflight`). Exactly one worker queries database; other parallel requests await cache publication.
  3. *TTL Jitter*: Randomize expiration time: $\text{TTL} = \text{BaseTTL} + \text{rand}(0, \text{JitterDelta})$. Eliminates synchronized simultaneous key invalidation.

#### Distributed Locking with Kleppmann Fencing Tokens
- **The Redlock Controversy**: Salvatore Sanfilippo proposed Redlock (multi-master majority quorum). Martin Kleppmann identified a critical flaw under asynchronous network and OS conditions (GC pauses, clock skew, process freezes).
- **Failure Scenario**:
  ```
  Client 1 acquires lock on 5 Redis nodes.
  Client 1 suffers 15-second Stop-The-World Garbage Collection pause.
  Lock TTL (10s) expires in Redis.
  Client 2 acquires lock, updates shared storage safely.
  Client 1 GC finishes, resumes execution unaware its lock expired, writes corrupting storage!
  ```
- **Kleppmann Fencing Token Solution**:
  1. Lock service (ZooKeeper, etcd, or Redis via Lua script) generates a strictly monotonically increasing sequence number (fencing token: 101, 102, 103...) upon lock acquisition.
  2. The storage engine (RDBMS, S3, filesystem) enforces conditional writes:
     ```sql
     UPDATE account_balance 
     SET balance = 500, last_fencing_token = 102 
     WHERE account_id = 'ACC-01' AND last_fencing_token < 102;
     ```
  3. If Client 1 attempts to write with token 101 after Client 2 wrote with token 102, the storage layer rejects Client 1's transaction.
  4. *Rule*: A distributed lock without storage-layer fencing token verification provides mutual exclusion only under ideal conditions, failing to guarantee safety under network or runtime delays.

#### RDBMS Scaling Strategies
- **Read Replicas & Replication Lag**:
  - Asynchronous streaming replication offloads read queries from primary master.
  - Problem: Eventual consistency lag creates "read-your-own-writes" inconsistency (user creates comment, page refreshes from lagging replica, comment is missing).
  - Solution: Read routing middleware. Route user to Master if user performed a write within the last $N$ seconds (session stickiness), or check Replica LSN against write LSN before executing read.
- **Connection Pooling Optimization**:
  - The Myth of Unlimited Connections: Database performance degrades under excessive concurrent connections due to OS thread context switching and disk spindle/IOPS contention.
  - Sizing Formula (PostgreSQL / HikariCP benchmark standard):
    $$\text{Pool Size} = (2 \times \text{CPU Cores}) + \text{Effective Spindle Count}$$
  - PgBouncer Pooling Modes:
    * *Session pooling*: Connection dedicated to client until disconnect.
    * *Transaction pooling*: Connection returned to pool immediately upon `COMMIT` or `ROLLBACK`. Optimal for web API microservices.
    * *Statement pooling*: Multi-statement transactions unsupported; reserved for simple analytics.
- **Partitioning vs Sharding**:
  - *Partitioning (Single Node)*: PostgreSQL Declarative Partitioning (Range by timestamp, List by status/country, Hash by UUID). Eliminates sequential table scans via partition pruning.
  - *Sharding (Distributed Nodes)*: Horizontal splitting across independent database clusters. Hash-based (consistent hashing ring), Directory-based (lookup service), or Range-based. Cross-shard joins require two-phase commit (2PC) or application-level scatter-gather, incurring significant latency penalties.

#### Async Message Queues & Reliable Processing
- **Engine Comparison**:
  - *Apache Kafka*: Distributed commit log. High throughput, persistent append-only storage, partition-based ordered delivery, consumer group offset tracking.
  - *RabbitMQ*: AMQP message broker. Complex routing via exchanges (direct, topic, fanout, headers), push delivery, broker manages message state and acknowledgment.
  - *AWS SQS*: Fully managed queue. Standard (at-least-once, out-of-order) vs FIFO (exactly-once processing semantics, strict ordering per message group).
- **Dead-Letter Queue (DLQ) & Exponential Backoff with Jitter**:
  - Retries without jitter cause thundering retry storms. Full jitter formula:
    $$T_{\text{sleep}} = \text{random}\left(0, \min(M_{\text{max}}, B \times 2^{\text{attempt}})\right)$$
  - When retry count exceeds threshold (e.g. 5 attempts), message is routed to DLQ with diagnostic headers (`x-exception-message`, `x-original-topic`, `x-failure-timestamp`).
- **Transactional Outbox Pattern**:
  - Prevents dual-write race conditions between database commit and message broker publish.
  - Application writes business state AND event record into an `outbox` table within a single ACID transaction:
    ```sql
    BEGIN;
    INSERT INTO orders (id, user_id, total) VALUES ('ord-123', 'usr-456', 99.00);
    INSERT INTO outbox (id, aggregate_type, aggregate_id, payload, created_at) 
    VALUES ('evt-789', 'Order', 'ord-123', '{"total": 99.00}', NOW());
    COMMIT;
    ```
  - An independent Transaction Log Miner (Debezium CDC via PostgreSQL WAL) or poller reads the outbox table and streams events to Kafka/RabbitMQ with guaranteed At-Least-Once delivery.

#### Rate Limiting Algorithms
1. **Token Bucket**:
   - Bucket capacity $C$, refill rate $r$ tokens/second. Each request consumes 1 token.
   - Allows bursts up to $C$. Standard in AWS API Gateway and Stripe API.
2. **Leaky Bucket**:
   - Requests enter a FIFO queue of capacity $C$, leaking at a constant rate $r$.
   - Bursts are smoothed into a uniform output stream. Overflowing requests are rejected.
3. **Fixed Window Counter**:
   - Window of duration $T$ counts requests.
   - Flaw: Double burst at window boundary (e.g. limit 100 req/min; 100 requests arrive at 00:59, 100 requests at 01:01, yielding 200 requests within 2 seconds).
4. **Sliding Window Log**:
   - Logs request timestamps in a Redis sorted set (`ZSET`). Queries `ZCOUNT` over window $[t - T, t]$.
   - Mathematically exact, but high memory overhead: $O(N)$ where $N$ is request volume.
5. **Sliding Window Counter (Approximation)**:
   - Combines previous window counter and current window counter:
     $$\text{Rate} = \text{Count}_{\text{current}} + \text{Count}_{\text{prev}} \times \frac{T - \text{elapsed}}{T}$$
   - Memory overhead is $O(1)$; eliminates boundary burst anomalies.
   - Implemented atomically in Redis via Lua scripts:
     ```lua
     local key = KEYS[1]
     local limit = tonumber(ARGV[1])
     local current = redis.call('INCR', key)
     if current == 1 then
         redis.call('EXPIRE', key, ARGV[2])
     end
     if current > limit then
         return 0
     else
         return 1
     end
     ```

---

## 3. Frontend Aesthetic Themes & Official UI Libraries

### 3.1 Official UI Libraries Comparison

| Library | Primary Styling Strategy | Runtime Overhead | Accessibility (a11y) | Customizability / Headless | Ideal Architecture Fit |
|---|---|---|---|---|---|
| **Tailwind CSS + shadcn/ui** | Utility-first CSS + Radix UI primitives | **0 ms (Zero runtime)** | Built-in WAI-ARIA via Radix | **Absolute** (code lives directly in project repository) | FSD, Next.js, Vite, Clean Enterprise, Bento Grid |
| **DaisyUI** | Semantic utility classes atop Tailwind | **0 ms (Pure CSS)** | Basic HTML semantic tags | Medium (opinionated component classes) | Rapid MVP, Dashboards, Prototypes |
| **Mantine** | CSS Modules (v7+) | Minimal (no CSS-in-JS runtime) | High (built-in a11y attributes) | High (Mantine theme object + CSS modules) | Complex enterprise web applications, rich forms |
| **Chakra UI (v3)** | Zag.js state machines + Ark UI | Low | Excellent (state-machine driven ARIA) | High (snippet-based headless integration) | React apps prioritizing accessible composability |
| **Ant Design (AntD)** | Ant-design CSS-in-JS (v5+) | Moderate | Moderate (optimized for desktop enterprise) | Low-Medium (highly opinionated design tokens) | Back-office management, internal portals, ERP systems |
| **MUI (Material UI)** | Emotion / Pigment CSS (zero-runtime) | Moderate to Low | High (Material Design accessibility) | High via theme overrides and `@mui/material/Unstyled` | Enterprise SaaS adhering to Google Material Design |

---

### 3.2 Curation of 8 Senior Frontend Aesthetic Styles

Every aesthetic theme is detailed with visual philosophy, explicit design tokens, concrete implementation code, and accessibility considerations.

---

#### 1. Neubrutalism / Neo-Brutalism

##### Visual Philosophy
Rebellion against generic minimalist corporate SaaS. Characterized by raw, unapologetic high-contrast black borders, hard offset drop-shadows with zero blur radius, vibrant saturated pop palettes, and functional, playful typography. Popularized by Saweria, Gumroad, and Figma's marketing pages.

##### Design Tokens
- **Color Palette**:
  - Surface Background: `#FFFDF5` (Warm Cream) or `#F4F0EA`
  - Deep Neutral / Border: `#000000` (Pure Black)
  - Neo Yellow: `#FFDE59`
  - Neo Pink: `#FF66C4`
  - Neo Cyan: `#00F0FF`
  - Neo Lime: `#A6FF00`
- **Borders**: Width `2px` to `3px` solid `#000000`.
- **Border Radius**: Sharp `0px` or restrained `4px` to `6px`.
- **Shadows**: Hard offset without blur: `box-shadow: 4px 4px 0px 0px #000000` (hover: `2px 2px 0px 0px #000000`, active: `0px 0px 0px 0px #000000`).
- **Typography**: Bold sans-serif or geometric grotesk (`Space Grotesk`, `Public Sans`, `Lexend Mega`). Font weights: `700` and `800`.

##### Concrete Tailwind CSS Implementation
```html
<!-- Neubrutalist Card -->
<div class="bg-[#FFFDF5] border-3 border-black p-6 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all">
  <span class="inline-block bg-[#A6FF00] border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-wider mb-4 rounded-sm">
    Production Ready
  </span>
  <h3 class="text-2xl font-black text-black tracking-tight mb-2">Architect Skill</h3>
  <p class="text-black font-medium leading-relaxed mb-6">
    Deterministic requirements and system design specifications without hallucination.
  </p>
  <!-- Neubrutalist Button -->
  <button class="bg-[#FFDE59] text-black font-extrabold px-6 py-3 border-2 border-black rounded-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all">
    Execute Blueprint
  </button>
</div>
```

##### Accessibility Caveat
High visual contrast easily surpasses WCAG 2.1 AAA standards. However, avoid flashing color pairings (e.g. saturated red on green) and ensure hover state movements do not trigger vestibular motion disorders (`motion-reduce:transform-none`).

---

#### 2. Bento Grid / Linear-style Minimalist Dark/Light

##### Visual Philosophy
Inspired by Japanese bento boxes and perfected by Linear, Raycast, and Apple product showcases. Emphasizes modular grid cells with distinct structural hierarchies, ultra-subtle translucent borders, deep neutral dark canvases, and localized radial sheen/spotlight accents.

##### Design Tokens
- **Color Palette**:
  - Dark Canvas: `#09090B` (Zinc 950)
  - Card Surface: `#121215` / `rgba(24, 24, 27, 0.65)`
  - Subdued Borders: `#27272A` (Zinc 800) / `rgba(255, 255, 255, 0.08)`
  - Accent Sheen: `radial-gradient(circle at top, rgba(255, 255, 255, 0.08) 0%, transparent 70%)`
  - Text Primary: `#FAFAFA` (Zinc 50), Secondary: `#A1A1AA` (Zinc 400)
- **Borders**: `1px solid rgba(255, 255, 255, 0.08)`
- **Border Radius**: `16px` to `24px` (`rounded-2xl` to `rounded-3xl`)
- **Shadows**: Subtle border luminescence: `box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 0 20px 40px -15px rgba(0, 0, 0, 0.5)`
- **Typography**: Clean modern sans-serif (`Inter`, `Geist`, `SF Pro Display`). Tracking: `-0.02em` (tight).

##### Concrete Tailwind CSS Implementation
```html
<!-- Bento Grid Layout -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-950 p-8 rounded-3xl">
  <!-- Bento Cell (Spans 2 columns) -->
  <div class="md:col-span-2 relative overflow-hidden bg-zinc-900/60 border border-white/10 p-8 rounded-2xl backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_40px_-15px_rgba(0,0,0,0.7)] group hover:border-white/20 transition-all duration-300">
    <div class="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all"></div>
    <div class="relative z-10">
      <div class="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white mb-6">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <h4 class="text-lg font-semibold text-zinc-100 tracking-tight mb-2">Zero-Latency In-Memory Pipeline</h4>
      <p class="text-sm text-zinc-400 leading-relaxed">
        High throughput streaming execution leveraging direct Redis pipelines with automatic reconnection backoff.
      </p>
    </div>
  </div>
  
  <!-- Bento Cell (Single column) -->
  <div class="relative overflow-hidden bg-zinc-900/60 border border-white/10 p-8 rounded-2xl backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.05)] group hover:border-white/20 transition-all duration-300">
    <h4 class="text-lg font-semibold text-zinc-100 tracking-tight mb-2">99.99% Uptime</h4>
    <p class="text-sm text-zinc-400">Strict SLA verification backed by cross-region replication.</p>
  </div>
</div>
```

##### Accessibility Considerations
Ensure contrast between secondary text (`#A1A1AA`) and card surface (`#121215`) maintains at least 4.5:1 ratio. Provide explicit visual keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-white/40`).

---

#### 3. Glassmorphism & Aurora / Mesh Gradient UI

##### Visual Philosophy
Evokes physical translucent frosted glass hovering over vivid, organic celestial lighting (aurora borealis). Utilizes multi-layered CSS background blurs (`backdrop-filter: blur()`), delicate specular highlights on top borders, and deeply diffused radial mesh gradients.

##### Design Tokens
- **Color Palette**:
  - Dark Glass Base: `rgba(15, 15, 20, 0.45)`
  - Aurora Glow 1: `#7928CA` (Electric Violet)
  - Aurora Glow 2: `#FF0080` (Neon Fuchsia)
  - Aurora Glow 3: `#0070F3` (Vibrant Cyan)
  - Glass Border Top: `rgba(255, 255, 255, 0.25)`
  - Glass Border Bottom: `rgba(255, 255, 255, 0.05)`
- **Backdrop Blur**: `backdrop-blur-xl` (`16px` to `24px`)
- **Borders**: Sub-pixel `1px` gradient border or `border border-white/15`
- **Shadows**: `box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37)`

##### Concrete Tailwind CSS Implementation
```html
<!-- Aurora Container with Ambient Glowing Orbs -->
<div class="relative min-h-[400px] w-full bg-[#0a0a0f] flex items-center justify-center overflow-hidden p-8">
  <div class="absolute w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] -top-10 -left-10 animate-pulse"></div>
  <div class="absolute w-96 h-96 bg-pink-600/25 rounded-full blur-[120px] -bottom-10 -right-10"></div>
  <div class="absolute w-80 h-80 bg-blue-600/20 rounded-full blur-[90px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

  <!-- Frosted Glass Card -->
  <div class="relative z-10 max-w-md w-full bg-white/10 dark:bg-black/30 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white mb-6">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
      Aurora Core v2.4
    </div>
    <h3 class="text-2xl font-bold text-white tracking-tight mb-2">Translucent Systems</h3>
    <p class="text-sm text-white/70 leading-relaxed mb-6">
      Backdrop-blur execution layer isolating untrusted script workers in ephemeral sandboxes.
    </p>
    <button class="w-full py-3 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium border border-white/30 backdrop-blur-sm transition-all shadow-lg">
      Deploy Boundary
    </button>
  </div>
</div>
```

##### Accessibility Considerations
Pure frosted glass often introduces legibility defects over dynamic backgrounds. Always maintain an underlying fallback solid dark alpha layer (`rgba(10, 10, 15, 0.85)`) when `backdrop-filter` is unsupported or when users enable `prefers-reduced-transparency`.

---

#### 4. Swiss / International Typographic Style (Editorial Clean)

##### Visual Philosophy
Emanating from the 1950s Swiss design movement (Max Bill, Josef Müller-Brockmann). Prioritizes objective mathematical grids, strict baseline rhythm, dominant typographic scale, asymmetric dynamic balance, stark negative space, and complete avoidance of superfluous ornamentation.

##### Design Tokens
- **Color Palette**:
  - Background: `#FFFFFF` (Stark Architectural White) or `#F8F8F8`
  - Body Text: `#111111` (Deep Carbon)
  - Editorial Accent: `#E60000` (Swiss Vermilion Red) or `#002FA7` (International Klein Blue)
  - Grid Rules: `#E5E5E5`
- **Borders**: Sharp `1px` or `2px` black dividers (`border-t-2 border-black`)
- **Border Radius**: Strictly `0px` (`rounded-none`)
- **Shadows**: None (`shadow-none`)
- **Typography**: Grotesque sans-serif (`Neue Haas Grotesk`, `Helvetica Neue`, `Inter`). Strict proportions: `text-6xl`, `text-xs uppercase tracking-widest font-semibold`.

##### Concrete Tailwind CSS Implementation
```html
<!-- Swiss Editorial Section -->
<section class="bg-white text-black p-12 border-t-4 border-black font-sans">
  <div class="grid grid-cols-12 gap-6 items-start">
    <div class="col-span-12 md:col-span-4 border-b border-black md:border-b-0 pb-6 md:pb-0">
      <span class="block text-xs font-bold uppercase tracking-[0.25em] text-[#E60000] mb-2">01 / ARCHITECTURE</span>
      <h2 class="text-5xl font-black tracking-tighter uppercase leading-[0.9]">
        SYSTEM<br/>DESIGN<br/>RIGOR.
      </h2>
    </div>
    <div class="col-span-12 md:col-span-5 text-base font-normal leading-relaxed text-neutral-800">
      <p class="mb-6">
        The international typographic style rejects decorative artifacts. Information hierarchy is governed solely by spatial placement, contrast ratios, and typographic weight.
      </p>
      <div class="pt-6 border-t border-neutral-300 grid grid-cols-2 gap-4 text-xs tracking-wider uppercase font-semibold">
        <div>LATENCY: &lt; 15MS</div>
        <div>CONCURRENCY: ISOLATED</div>
      </div>
    </div>
    <div class="col-span-12 md:col-span-3 flex justify-start md:justify-end">
      <a href="#explore" class="inline-block text-xs font-bold uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:text-[#E60000] hover:border-[#E60000] transition-colors">
        Read Specification &rarr;
      </a>
    </div>
  </div>
</section>
```

##### Accessibility Considerations
Outstanding typographic contrast exceeds WCAG AAA criteria. Monospaced or uppercase headers must maintain adequate letter-spacing (`tracking-widest`) to ensure readability for dyslexic users.

---

#### 5. Modern SaaS Clean Enterprise (Stripe / Tailwind / Vercel style)

##### Visual Philosophy
The industry standard for high-trust enterprise B2B products. Balances technical sophistication with approachable warmth. Characterized by balanced neutral slates, subtle 1px border cards, gentle elevation drops, crisp typography, and semantic badge indicators.

##### Design Tokens
- **Color Palette**:
  - Canvas: `#F8FAFC` (Slate 50) / Dark: `#0B0F19`
  - Surface: `#FFFFFF` (White) / Dark: `#111827`
  - Neutral Borders: `#E2E8F0` (Slate 200) / Dark: `#1F2937`
  - Primary Brand: `#2563EB` (Blue 600) / `#4F46E5` (Indigo 600)
  - Semantic Status:
    * Success: `#10B981` (Emerald 500)
    * Warning: `#F59E0B` (Amber 500)
    * Error: `#EF4444` (Rose 500)
- **Border Radius**: `8px` to `12px` (`rounded-lg` to `rounded-xl`)
- **Shadows**: `box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)` (card), hover: `0 10px 15px -3px rgba(0, 0, 0, 0.08)`
- **Typography**: Refined sans-serif (`Inter`, `Plus Jakarta Sans`). Body text size `14px` (`text-sm`), titles `font-semibold`.

##### Concrete Tailwind CSS Implementation
```html
<!-- Clean Enterprise Card -->
<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold text-sm">
        DB
      </div>
      <div>
        <h4 class="text-sm font-semibold text-slate-900 dark:text-white">Primary Cluster</h4>
        <p class="text-xs text-slate-500">PostgreSQL v16.4</p>
      </div>
    </div>
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
      Healthy
    </span>
  </div>
  <div class="space-y-3 pt-2">
    <div class="flex justify-between text-xs text-slate-600 dark:text-slate-400">
      <span>Connection Pool</span>
      <span class="font-medium text-slate-900 dark:text-slate-200">18 / 32 active</span>
    </div>
    <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
      <div class="bg-blue-600 h-full rounded-full" style="width: 56%"></div>
    </div>
  </div>
</div>
```

---

#### 6. Material Design 3 (Material You / M3)

##### Visual Philosophy
Google's current design language. Focuses on personal expression through dynamic algorithmic color extraction, tonal palettes, container-surface relationships, expressive rounded geometries (pill shapes, large rounded corners), and responsive state-layer overlays.

##### Design Tokens
- **Color Roles**:
  - `primary`: `#6750A4` / `on-primary`: `#FFFFFF`
  - `primary-container`: `#EADDFF` / `on-primary-container`: `#21005D`
  - `surface`: `#FEF7FF` / `surface-container`: `#F3EDF7`
  - `outline`: `#79747E` / `outline-variant`: `#CAC4D0`
- **Border Radius**: Pill shapes (`rounded-full` / `9999px`) for chips/buttons; `rounded-3xl` (`28px`) for cards and dialogs.
- **Elevation**: Tonal elevation using surface-tint color overlays rather than heavy black drop-shadows:
  - Level 1: `shadow-sm` + `bg-surface-container-low`
  - Level 2: `shadow` + `bg-surface-container`
- **Typography**: Roboto / Google Sans. Distinct M3 type scale (`Display`, `Headline`, `Title`, `Body`, `Label`).

##### Concrete Tailwind CSS Implementation
```html
<!-- Material Design 3 Expressive Card -->
<div class="bg-[#F3EDF7] text-[#1D1B20] p-6 rounded-[28px] shadow-sm max-w-sm">
  <div class="flex items-center justify-between mb-4">
    <span class="text-xs font-medium tracking-wide uppercase text-[#49454F]">Security Policy</span>
    <span class="p-2 rounded-full bg-[#EADDFF] text-[#21005D]">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
    </span>
  </div>
  <h3 class="text-xl font-medium tracking-normal mb-2 text-[#1D1B20]">Zero-Egress Guard</h3>
  <p class="text-sm text-[#49454F] leading-relaxed mb-6">
    Hardware-isolated cryptographic keys pinned to local security enclave.
  </p>
  <!-- M3 Filled Pill Button -->
  <button class="w-full bg-[#6750A4] hover:bg-[#6750A4]/90 text-white font-medium text-sm py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm">
    <span>Enable Enclave</span>
  </button>
</div>
```

---

#### 7. Neumorphism / Soft UI

##### Visual Philosophy
Originates from skeuomorphic minimalism. The user interface appears physically extruded from or pressed into a single continuous physical surface. Achieved entirely through dual opposing soft drop-shadows: one simulating a directional light source highlight (white/light) and the opposite simulating a cast shadow (soft dark).

##### Design Tokens
- **Color Palette**:
  - Surface Background: `#E0E5EC` (Neutral Gray-Blue)
  - Light Highlight: `#FFFFFF` (Pure White, Opacity 0.8)
  - Dark Shadow: `#A3B1C6` (Soft Slate, Opacity 0.6)
- **Extruded (Raised) Shadow**:
  `box-shadow: 8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.8)`
- **Inset (Pressed) Shadow**:
  `box-shadow: inset 6px 6px 12px rgba(163, 177, 198, 0.6), inset -6px -6px 12px rgba(255, 255, 255, 0.8)`
- **Border**: None or `border border-white/20`
- **Border Radius**: `16px` to `24px` (`rounded-2xl`)

##### Concrete Tailwind CSS Implementation
```html
<!-- Neumorphic Control Surface -->
<div class="bg-[#E0E5EC] p-8 rounded-3xl min-h-[300px] flex items-center justify-center space-x-6">
  <!-- Raised Extruded Card -->
  <div class="bg-[#E0E5EC] p-6 rounded-2xl shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.8)] text-slate-700 max-w-xs">
    <h4 class="font-bold text-base mb-2">Extruded Node</h4>
    <p class="text-xs text-slate-500 mb-4">Continuous surface extrusion simulation.</p>
    <!-- Neumorphic Interactive Button (Raised transitioning to Inset on Active) -->
    <button class="bg-[#E0E5EC] px-6 py-2.5 rounded-xl font-semibold text-xs text-slate-700 shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.8)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] transition-all">
      Toggle State
    </button>
  </div>
</div>
```

##### Severe Accessibility Warning & Mitigation
**CRITICAL**: Pure Neumorphism fails WCAG 2.1 AA non-text contrast requirements (minimum 3:1 ratio for user interface components) because the boundaries between buttons and background are delineated solely by soft light gradients. 
*Architectural Constraint*: Neumorphism must *never* be applied to critical production enterprise systems unless reinforced with high-contrast text (`#1E293B`), clear inner icons, and high-visibility keyboard focus boundaries.

---

#### 8. Retro / Cyberpunk / Terminal Aesthetics

##### Visual Philosophy
Evokes retro-futuristic hacker terminals, BBS interfaces, and cyberpunk displays (Matrix, Neuromancer). Features high-contrast neon accents (phosphor green, amber, cyan) cast against pitch black canvases, authentic monospaced typography, CRT scanlines, and terminal command prompts.

##### Design Tokens
- **Color Palette**:
  - Terminal Black: `#050505` / `#000000`
  - Phosphor Green: `#39FF14` / `#22C55E`
  - Neon Cyan: `#00F3FF`
  - Neon Amber: `#FFB000`
  - Grid / Scanline: `rgba(34, 197, 94, 0.08)`
- **Borders**: `1px solid #22C55E` with subtle outer luminescence: `box-shadow: 0 0 8px rgba(34, 197, 94, 0.4)`
- **Border Radius**: Sharp `0px` or terminal `2px`
- **Typography**: Authentic monospace (`JetBrains Mono`, `Fira Code`, `VT323`, `Courier New`).
- **Scanline Effect**: Repeating linear gradient simulating cathode-ray tube raster lines.

##### Concrete Tailwind CSS Implementation
```html
<!-- Cyberpunk Terminal Container -->
<div class="relative bg-black border border-green-500/60 p-6 rounded-none font-mono text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.25)] overflow-hidden">
  <!-- CRT Scanline Overlay -->
  <div class="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-70"></div>
  
  <div class="relative z-20">
    <div class="flex items-center justify-between border-b border-green-500/40 pb-3 mb-4 text-xs">
      <span class="tracking-widest uppercase text-green-300">SYS_CONSOLE // NODE: ARCH-09</span>
      <span class="animate-pulse text-green-400">[ONLINE]</span>
    </div>
    <div class="text-xs space-y-1.5 mb-6 text-green-500">
      <p>&gt; architect-skill --integrity=strict --zero-egress</p>
      <p class="text-green-300">&gt; [OK] Outbound network egress blocked: AF_INET / AF_INET6</p>
      <p class="text-green-300">&gt; [OK] Landlock sandbox profile activated</p>
      <p class="text-green-400">&gt; Ready for local compilation...</p>
    </div>
    <!-- Terminal Command Button -->
    <button class="bg-green-500 text-black font-mono font-bold text-xs uppercase px-4 py-2 hover:bg-green-400 hover:shadow-[0_0_10px_#22c55e] transition-all">
      [ EXECUTE_TASK ]
    </button>
  </div>
</div>
```

---

## 4. Absolute Credential Protection & Zero-Egress Security

### 4.1 Threat Model and Untrusted Caller Principle

#### Core Axiom
In an environment where AI agents (Claude, Cursor, Copilot, Windsurf, Cline) generate and execute code, **the AI agent must be treated as an untrusted actor**. Agents are susceptible to prompt injection, hallucinated dependencies, unintended credential extraction, and unauthorized network egress.

```
+-------------------------------------------------------------------------------+
| UNTRUSTED EXECUTION ZONE                                                      |
| AI Agent / LLM Prompts / External Tool Directives                             |
+-------------------------------------------------------------------------------+
                                |
                                v
+-------------------------------------------------------------------------------+
| ARCHITECT-SKILL SECURITY BOUNDARY                                             |
|                                                                               |
|  [Filesystem Scope Guard]      --> Rejects reads from .env, *.pem, ~/.ssh/   |
|  [Regex Secret Scanner]        --> Masks tokens, API keys, connection strings |
|  [Runtime Egress Guard]        --> Blocks http, https, net, fetch, sockets    |
|  [Container Sandbox]           --> Podman/Docker with --network=none          |
+-------------------------------------------------------------------------------+
                                |
                                v
+-------------------------------------------------------------------------------+
| TRUSTED SANITIZED ARTIFACTS                                                   |
| ./docs/ (Pure Architectural Blueprints, Diagrams, Templates)                 |
+-------------------------------------------------------------------------------+
```

#### Security Boundaries
1. **Zero Access to Agent Credentials**: The skill runtime must never inspect system environment variables belonging to the host AI environment (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `AWS_SECRET_ACCESS_KEY`, etc.).
2. **Zero Access to Application Project Secrets**: The skill runtime must never read target project configuration secrets (`.env`, `.env.production`, `secrets/`, certificates `*.pem`, `*.key`, keystores, private SSH keys `id_rsa`).
3. **Zero Network Egress**: The skill runtime must execute entirely offline without initiating HTTP/HTTPS, DNS, UDP, or raw TCP connections.

---

### 4.2 Production Regex Patterns for Secret Detection

The following regular expression patterns are formulated for `policies/redaction-rules.json` and `scripts/secret-scan.js`. They are engineered to minimize false negatives while asserting exact boundary anchors.

| Credential Type | Regex Pattern (ECMAScript / PCRE) | Redaction Replacement Target |
|---|---|---|
| **AWS Access Key ID** | `\b(AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}\b` | `[REDACTED:AWS_ACCESS_KEY_ID]` |
| **AWS Secret Access Key** | `(?i)(?:aws_secret_access_key|aws_sec_key|secret_key)\s*[:=]\s*["']?([A-Za-z0-9/+=]{40})["']?` | `[REDACTED:AWS_SECRET_ACCESS_KEY]` |
| **GitHub Personal Token (Classic)** | `\bghp_[0-9a-zA-Z]{36}\b` | `[REDACTED:GITHUB_TOKEN]` |
| **GitHub Fine-Grained Token** | `\bgithub_pat_[0-9a-zA-Z_]{82}\b` | `[REDACTED:GITHUB_PAT]` |
| **Anthropic API Key** | `\bsk-ant-api03-[A-Za-z0-9_-]{93}AA\b` | `[REDACTED:ANTHROPIC_API_KEY]` |
| **OpenAI API Key (Legacy & Project)** | `\bsk-[a-zA-Z0-9]{20,T3BlbkFJ[a-zA-Z0-9]{20,}\b|\bsk-proj-[a-zA-Z0-9_-]{80,}\b` | `[REDACTED:OPENAI_API_KEY]` |
| **Google Gemini / AIza Key** | `\bAIzaSy[0-9A-Za-z_-]{33}\b` | `[REDACTED:GEMINI_API_KEY]` |
| **JSON Web Token (JWT)** | `\beyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\b` | `[REDACTED:JWT_TOKEN]` |
| **Private Keys (RSA, EC, OpenSSH, DSA)** | `-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----[\s\S]+?-----END (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----` | `[REDACTED:PRIVATE_KEY_BLOCK]` |
| **Database Connection Strings** | `(?i)(?:postgres|postgresql|mysql|mongodb|redis|amqp|mssql):\/\/(?:[^:\s]+):([^@\s]+)@(?:[a-zA-Z0-9.-]+)(?::[0-9]+)?(?:\/[^\s"']*)?` | Password capture masked: `[REDACTED:DB_PASSWORD]` |
| **Generic Secret Assignments** | `(?i)\b(?:password|passwd|secret|api_key|apikey|auth_token|bearer)\s*[:=]\s*["']([^"'\s]{8,})["']` | Value masked: `[REDACTED:GENERIC_SECRET]` |

---

### 4.3 Redaction Rules Policy Specification (`policies/redaction-rules.json`)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ArchitectSkillRedactionPolicy",
  "version": "1.0.0",
  "rules": [
    {
      "id": "RULE-AWS-KEY",
      "description": "Matches AWS standard IAM access key identifiers",
      "pattern": "\\b(AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}\\b",
      "replacement": "[REDACTED:AWS_KEY]"
    },
    {
      "id": "RULE-AWS-SECRET",
      "description": "Matches AWS secret access keys in key-value format",
      "pattern": "(?i)(aws_secret_access_key|aws_sec_key)\\s*[:=]\\s*[\"']?([A-Za-z0-9/+=]{40})[\"']?",
      "matchGroupToRedact": 2,
      "replacement": "[REDACTED:AWS_SECRET]"
    },
    {
      "id": "RULE-GITHUB-TOKEN",
      "description": "Matches GitHub personal access tokens",
      "pattern": "\\bgh[pousr]_[A-Za-z0-9_]{36,255}\\b",
      "replacement": "[REDACTED:GITHUB_TOKEN]"
    },
    {
      "id": "RULE-ANTHROPIC-KEY",
      "description": "Matches Anthropic Claude API keys",
      "pattern": "\\bsk-ant-api03-[A-Za-z0-9_-]{93}AA\\b",
      "replacement": "[REDACTED:ANTHROPIC_KEY]"
    },
    {
      "id": "RULE-OPENAI-KEY",
      "description": "Matches OpenAI project and user secret tokens",
      "pattern": "\\bsk-proj-[a-zA-Z0-9_-]{80,}\\b",
      "replacement": "[REDACTED:OPENAI_KEY]"
    },
    {
      "id": "RULE-PRIVATE-KEY",
      "description": "Matches OpenSSL and OpenSSH private key blocks",
      "pattern": "-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----[\\s\\S]+?-----END (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----",
      "replacement": "[REDACTED:PRIVATE_KEY_BLOCK]"
    },
    {
      "id": "RULE-URI-PASSWORD",
      "description": "Matches database connection strings containing basic auth credentials",
      "pattern": "([a-zA-Z0-9+.-]+://[^:\\s]+:)([^@\\s]+)(@[a-zA-Z0-9.-]+)",
      "matchGroupToRedact": 2,
      "replacement": "[REDACTED:DB_PASSWORD]"
    }
  ]
}
```

---

### 4.4 Local-First Zero-Egress Architecture

#### 1. Runtime Monkey-Patching Egress Guard (`scripts/egress-guard.js`)
When running Node.js scripts within the skill workspace, network access must be intercepted at the core runtime level. `scripts/egress-guard.js` hooks the fundamental network modules (`http`, `https`, `net`, `dgram`, `tls`, and global `fetch`):

```javascript
/**
 * Zero-Egress Runtime Guard
 * Neutralizes all outbound network sockets and requests at the Node.js runtime boundary.
 */
'use strict';

const net = require('net');
const http = require('http');
const https = require('https');
const dgram = require('dgram');

function blockEgress(moduleName, methodName) {
  const err = new Error(
    `[SECURITY_VIOLATION] Outbound network egress blocked by architect-skill zero-egress policy: ${moduleName}.${methodName}()`
  );
  err.code = 'ERR_ZERO_EGRESS_BLOCKED';
  throw err;
}

// Intercept TCP sockets
net.connect = net.createConnection = function() {
  blockEgress('net', 'connect');
};

// Intercept HTTP & HTTPS requests
http.request = http.get = function() {
  blockEgress('http', 'request');
};
https.request = https.get = function() {
  blockEgress('https', 'request');
};

// Intercept UDP sockets
dgram.createSocket = function() {
  blockEgress('dgram', 'createSocket');
};

// Intercept global Fetch (Node.js 18+)
if (typeof globalThis.fetch === 'function') {
  globalThis.fetch = function() {
    return Promise.reject(new Error('[SECURITY_VIOLATION] globalThis.fetch() blocked by zero-egress policy'));
  };
}

module.exports = { isZeroEgressActive: true };
```

#### 2. Sandbox Isolation (`sandbox/run.sh` & `sandbox/Dockerfile`)
For deep isolation, script and template compilation runs inside a container sandbox:
- Network isolation flag: `--network=none` (strictly disables loopback routing to external interfaces).
- Filesystem mode: `--read-only` root filesystem; only `./docs/` is mounted with write permissions.
- Non-root user: Containers run under UID `10001` without `sudo` or capabilities (`--cap-drop=ALL`).
- Linux Landlock LSM / seccomp profile blocking `socket()` system calls for network domains (`AF_INET`, `AF_INET6`).

#### 3. Filesystem Scoping (`policies/filesystem-scope.json`)
Restricts file system read/write operations to explicit whitelisted boundaries:
```json
{
  "allowedRoots": {
    "read": [
      "./assets",
      "./references",
      "./policies",
      "./templates"
    ],
    "write": [
      "./docs",
      "~/.architect-skill-backup"
    ]
  },
  "blockedPaths": [
    "**/.env*",
    "**/*.pem",
    "**/*.key",
    "**/*.p12",
    "**/*.pfx",
    "**/id_rsa*",
    "**/id_ed25519*",
    "**/credentials*",
    "**/secrets/**",
    "~/.ssh/**",
    "~/.aws/**",
    "~/.config/**",
    "~/.claude/auth*",
    "~/.cursor/**"
  ],
  "pathTraversalValidation": {
    "rejectNullBytes": true,
    "enforceCanonicalResolution": true
  }
}
```

---

## 5. Synthesis & Cross-Component Integration

The four investigated domains operate in unison across the two-tier wizard of `architect-skill`:

1. **Requirements to Architecture Handshake**:
   - The user selects a requirements standard in Tier 1 (PRD, BRD, or SRD).
   - If PRD is selected, functional stories with Gherkin scenarios directly seed the test boundaries of Clean Architecture Use Cases.
   - If SRD (ISO 29148) is selected, EARS requirement IDs (e.g. `REQ-SRD-ORD-001`) are mapped to ADRs (Architecture Decision Records) and C4 container diagrams.
2. **System Design to UI Framework Alignment**:
   - System design choices dictate frontend UI rendering strategies.
   - For high-frequency streaming architectures (Kafka / WebSockets), the frontend specification mandates zero-runtime CSS (Tailwind + shadcn/ui or DaisyUI) to minimize browser main-thread frame drops.
   - The selected aesthetic theme (e.g. Bento Grid / Linear) populates `docs/ui/theme-tokens.md` and `docs/ui/component-registry.md` with pre-validated Tailwind utility classes.
3. **Security Pipeline Enforcement**:
   - Before any documentation or template is emitted to `./docs/`, the output is piped through `scripts/secret-scan.js`.
   - `scripts/secret-scan.js` evaluates the output against `policies/redaction-rules.json`. If a stray API key or database password is found, it is replaced with a masked placeholder.
   - `scripts/egress-guard.js` guarantees that during all verification runs, no outbound network packets escape the developer's local workstation.

This concludes the technical specifications report.

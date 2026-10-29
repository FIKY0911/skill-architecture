# Architectural Decision Matrix: {{PROJECT_NAME}}

> **Purpose**: Formal comparative evaluation of architectural trade-offs, technological alternatives, and structural decisions governing `{{PROJECT_NAME}}`.

---

## 1. Decision Evaluation Methodology & Scoring Rubric

Each candidate architectural alternative is quantitatively scored from 1 (Unacceptable / High Friction) to 5 (Optimal / Superior Fit) across six core engineering dimensions:
- **LTC (Latency & Performance)**: Execution overhead and resource utilization.
- **SCL (Scalability & Concurrency)**: Ability to handle 10x throughput increases.
- **OPX (Operational Complexity)**: Infrastructure maintenance burden and operational friction.
- **CGL (Cognitive Load)**: Mental overhead on developers navigating code and debugging.
- **TVL (Team Velocity & TTM)**: Speed of onboarding and shipping validated features.
- **CMP (Compliance & Isolation)**: Security perimeter, data privacy, and zero-egress fit.

$$\text{Weighted Score} = \sum_{i=1}^{6} (w_i \times s_i)$$

---

## 2. Decision Matrix: Architectural Paradigm Selection

### Evaluated Alternatives
1. **Option A: Distributed Microservices Architecture**
2. **Option B: Modular Monolith with Schema Isolation (Selected)**
3. **Option C: Traditional Layered Monolith (CRUD / Active Record)**
4. **Option D: Pure Event-Sourced & CQRS Architecture**

### Comparative Scoring Matrix

| Dimension | Weight | Option A: Microservices | Option B: Modular Monolith | Option C: Layered Monolith | Option D: Event Sourcing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Latency & Performance (LTC)** | $0.20$ | 3 (Network hops, serialization) | **5 (In-memory calls, zero IPC)** | 4 (Direct DB joins) | 3 (Aggregate reconstruction) |
| **Scalability (SCL)** | $0.20$ | 5 (Independent pod scaling) | **4 (Scale-out via read replicas)**| 2 (Monolithic DB contention)| 5 (Distributed event streams) |
| **Operational Complexity (OPX)** | $0.20$ | 2 (Service mesh, K8s, tracing)| **5 (Single deployable container)** | 5 (Single deployment) | 2 (Snapshotting, projection lag) |
| **Cognitive Load (CGL)** | $0.15$ | 2 (Distributed tracing fatigue) | **4 (Explicit domain boundaries)**| 3 (Tangled spaghetti risk) | 2 (Temporal event debugging) |
| **Team Velocity (TVL)** | $0.15$ | 3 (Contract coordination delay) | **5 (Instant refactoring in IDE)** | 4 (Rapid initial prototyping)| 3 (Event schema versioning) |
| **Compliance & Isolation (CMP)** | $0.10$ | 4 (Network security perimeters) | **4 (Process & schema boundaries)**| 2 (Shared DB access leakage) | 4 (Immutable audit log) |
| **Weighted Total** | **1.00** | **3.15** | **4.60 (WINNER)** | **3.40** | **3.15** |

### Selection Rationale
Option B (Modular Monolith) achieves the highest weighted score (4.60). It provides the strict logical domain isolation and clean boundaries of microservices without incurring distributed network failure modes, complex Kubernetes orchestration, or two-phase commit overhead.

---

## 3. Decision Matrix: Primary Persistence Engine

### Evaluated Alternatives
1. **PostgreSQL 16 (Relational with JSONB & Declarative Partitioning) - Selected**
2. **MongoDB 7.0 (Document Store)**
3. **MySQL 8.0 (Relational / InnoDB)**

| Evaluation Criteria | PostgreSQL 16 | MongoDB 7.0 | MySQL 8.0 |
| :--- | :--- | :--- | :--- |
| **ACID Strictness** | Full Serializable & Read Committed | Tunable replica set write concerns | Full ACID (InnoDB engine) |
| **Concurrency & Locking** | Advisory locks + Monotonic fencing | Document-level locks | Row-level locking (`SELECT FOR UPDATE`) |
| **Semi-Structured Support** | High-performance JSONB with GIN indexing| Native BSON document model | Basic JSON functions |
| **Operational Maturity** | Exceptional; battle-tested pooling (PgBouncer)| Requires replica set management | High operational familiarity |
| **Verdict** | **SELECTED (`ADR-002`)** | REJECTED (Lacks relational constraints)| REJECTED (Weaker JSONB & GIN indexing) |

---

## 4. Formal ADR Catalog Index

| ADR Identifier | Decision Title | Status | Primary Trade-Off Resolved |
| :--- | :--- | :--- | :--- |
| `ADR-001` | [Architectural Style Selection](./decisions/ADR-001-architecture-style.md) | ACCEPTED | Modularity vs Operational Deployment Simplicity |
| `ADR-002` | [Primary Persistence Engine Selection](./decisions/ADR-002-database-selection.md) | ACCEPTED | Relational Consistency vs Schema Flexibility |
| `ADR-003` | [Distributed Locking & Fencing Tokens](./decisions/ADR-003-state-and-concurrency.md)| ACCEPTED | Mutual Exclusion Safety under Clock Skew & GC Pauses |

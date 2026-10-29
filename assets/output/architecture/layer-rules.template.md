# System Architecture Overview: {{PROJECT_NAME}}

> **Architectural Paradigm**: `{{ARCHITECTURE_STYLE}}`  
> **Target Runtime**: `{{PRIMARY_LANGUAGE}}` on `{{RUNTIME}}`  
> **Formal Governance**: Governed by Architecture Decision Records (`docs/architecture/decisions/`)

---

## 1. High-Level Architecture Narrative

`{{PROJECT_NAME}}` is engineered following the **`{{ARCHITECTURE_STYLE}}`** architectural pattern. This pattern guarantees that core business domain rules, enterprise entities, and use cases remain decoupled from external delivery mechanisms, database engines, and third-party SaaS vendors.

```
+---------------------------------------------------------------+
|               Frameworks & Drivers (Web, DB, UI)              |
|   +-------------------------------------------------------+   |
|   |         Interface Adapters (Controllers, Repos)       |   |
|   |   +-----------------------------------------------+   |   |
|   |   |         Use Cases (Application Rules)         |   |   |
|   |   |   +---------------------------------------+   |   |   |
|   |   |   |     Entities (Domain Invariants)      |   |   |   |
|   |   |   +---------------------------------------+   |   |   |
|   |   +-----------------------------------------------+   |   |
|   +-------------------------------------------------------+   |
+---------------------------------------------------------------+
           Dependencies strictly point INWARD (Dependency Rule)
```

---

## 2. Structural Layer Boundaries & Import Rules

Dependencies follow the strict **Dependency Inversion Principle (DIP)**:
1. **Inner Layer (Entities & Value Objects)**:
   - Contains pure business logic and validation invariants.
   - Zero dependencies on outer frameworks (no ORM decorators, no HTTP framework types).
2. **Application Layer (Use Cases / Interactors)**:
   - Orchestrates domain entity workflows.
   - Defines abstract input/output ports (interfaces) for data persistence, notifications, and cryptography.
3. **Interface Adapters Layer (Controllers, Gateways, Presenters)**:
   - Implements ports defined by use cases (e.g. `PostgresOrderRepository` implements `IOrderRepository`).
   - Translates external HTTP/gRPC requests into domain command DTOs.
4. **Infrastructure Layer (Frameworks, Web Server, Message Broker)**:
   - External libraries, Redis clients, Express/Fastify routes, database migration scripts.

---

## 3. Inter-Module & Service Communication Contracts

| Interaction Type | Channel / Protocol | Consistency Guarantee | Failure Handling Strategy |
| :--- | :--- | :--- | :--- |
| **Client to Gateway** | HTTPS / JSON REST API | Strong / Read-Your-Writes | Rate limited (HTTP 429) + Standard Problem Details (RFC 7807) |
| **Gateway to Core API** | HTTP/2 Reverse Proxy | Strong | Exponential backoff circuit breaker |
| **Core to Database** | TCP / SQL Connection Pool | ACID Transactional | Retry on serialization failure (`40001`) with jitter |
| **Core to Message Broker** | Transactional Outbox (CDC) | At-Least-Once Delivery | Poller retries with exponential backoff; dead-letter queue |

---

## 4. Cross-Cutting Concerns

1. **Authentication & Authorization**:
   - Authentication terminates at the API Gateway via RS256 JWT validation.
   - Decoded security context (`userId`, `orgId`, `roles`, `permissions`) is injected into request context headers (`X-User-Context`).
2. **Structured Logging & Audit Trails**:
   - Zero-credential structured JSON logging.
   - Sensitive payload elements (credit card tokens, passwords, keys) are scrubbed prior to log serialization.
3. **Telemetry & Distributed Tracing**:
   - W3C Trace Context headers (`traceparent`, `tracestate`) propagated across all synchronous and asynchronous boundaries.
4. **Error Handling Architecture**:
   - Domain errors are mapped deterministically to RFC 7807 Problem Details:
     - `DOMAIN_VALIDATION_ERROR` $\to$ HTTP 422 Unprocessable Entity
     - `RESOURCE_NOT_FOUND` $\to$ HTTP 404 Not Found
     - `CONCURRENCY_CONFLICT` $\to$ HTTP 409 Conflict

---

## 5. Security Perimeter & Zero-Egress Governance

```
+---------------------------------------------------------------+
| Container Sandbox Boundary (Network: NONE / Localhost Only)    |
|                                                               |
|  +--------------------+             +----------------------+  |
|  | Core API Engine    |             | Local PostgreSQL     |  |
|  | (UID: 10001)       +------------>+ (Port 5432)          |  |
|  +---------+----------+             +----------------------+  |
|            |                                                  |
|            v                                                  |
|  +--------------------+                                       |
|  | Local Redis Cache  |                                       |
|  | (Port 6379)        |                                       |
|  +--------------------+                                       |
|                                                               |
+-------------------------------+-------------------------------+
                                x (Outbound Internet Traffic Hard-Blocked)
                                v
                           [EXT_INTERNET]
```

- **Runtime Firewall**: Zero outbound egress sockets allowed outside declared network boundaries.
- **Filesystem Isolation**: Write permissions are confined exclusively to the designated working tree and `./docs/`.

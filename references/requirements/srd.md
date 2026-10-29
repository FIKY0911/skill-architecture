# Software Requirements Document (SRD) Reference Specification

## Standard: ISO/IEC/IEEE 29148:2018
This document establishes the formal engineering standard for authoring Software Requirements Documents (SRDs) within `architect-skill`. The framework complies with ISO/IEC/IEEE 29148:2018 (Systems and software engineering: Life cycle processes: Requirements engineering), which supersedes IEEE 830-1998, IEEE 1233-1998, and IEEE 1362-1998.

---

## 1. Supersession of IEEE 830
IEEE 830-1998 focused narrowly on software specification documents without formal life cycle integration or multi-tier requirement hierarchies. ISO/IEC/IEEE 29148:2018 addresses these limitations by establishing:
1. Unified Requirements Engineering Process: Integrated life cycle alignment from stakeholder concept to system verification.
2. Distinct Requirements Levels:
   - Level 1: Stakeholder Requirements (StR).
   - Level 2: System Requirements (SyR).
   - Level 3: Software Requirements (SoR / SRD).
3. Strict Quality Invariants: Nine mandatory criteria governing requirement construct validity.
4. Formal Syntax Rules: Structured grammar frameworks including EARS syntax.

```
+-------------------------------------------------------------+
| Stakeholder Requirements (StR)                              |
| Defines operational intent from stakeholder perspective     |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| System Requirements (SyR)                                   |
| Defines complete system boundary, functions, and interfaces |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| Software Requirements (SoR / SRD)                           |
| Specifies formal software behavior, states, and data models  |
+-------------------------------------------------------------+
```

---

## 2. ISO 29148 Clause 5.2 Quality Invariants

Every requirement statement in an SRD must strictly satisfy nine attributes before approval:

| Invariant | Formal Definition | Anti-Pattern Example (Prohibited) | Compliant Construct (Mandatory) |
|---|---|---|---|
| **Necessary** | Capability is essential to satisfy parent stakeholder goals. | "The system shall look modern." | "The system shall render all primary views using WCAG 2.1 AA compliant color tokens." |
| **Implementation-Independent** | Specifies what the software shall do, never dictating implementation mechanics. | "The service shall use an Express.js middleware router." | "The service shall route inbound HTTP requests to designated domain handlers based on path prefixes." |
| **Unambiguous** | Exactly one interpretation exists; free of vague qualifiers. | "The system shall respond quickly." | "The system shall return HTTP 200 OK within 50 milliseconds for p95 requests." |
| **Complete** | Expresses all boundary conditions, triggers, inputs, and outputs. | "The system shall process uploaded CSV files." | "When a user uploads a valid CSV file under 10 MB, the system shall parse all records within 2 seconds." |
| **Singular** | Contains exactly one testable assertion; no conjunctions joining multiple behaviors. | "The system shall validate passwords and send confirmation emails." | Split into two distinct requirements: one for validation and one for notification. |
| **Feasible** | Technically achievable within physical and architectural constraints. | "The system shall achieve zero millisecond latency globally." | "The system shall replicate database state across two regions within 500 milliseconds." |
| **Verifiable** | Provable true or false via an objective, quantifiable verification method. | "The user interface shall be easy to navigate." | "A first-time user shall complete the onboarding flow within 180 seconds without support intervention." |
| **Traceable** | Tagged with a globally unique ID linked upstream to business needs and downstream to tests. | Untagged paragraphs in narrative text. | Tagged explicitly as `REQ-SRD-AUTH-001`. |
| **Consistent** | Contains no logical or temporal contradictions with other requirements. | Conflicting requirements stating both 30-day and 90-day retention for the same dataset. | Harmonized to a single retention policy statement across all sections. |

---

## 3. Formal Syntax: Easy Approach to Requirements Syntax (EARS)

All requirement assertions must be authored in one of five formal EARS syntactical patterns:

### 3.1 Ubiquitous Requirement
Applies continuously across the operational lifetime of the software.
- Syntax: `The [system] shall [action].`
- Example: `The runtime firewall shall enforce SHA-256 integrity verification on all executable tool scripts.`

### 3.2 Event-Driven Requirement
Initiated upon occurrence of an external trigger or event.
- Syntax: `When [trigger/event], the [system] shall [action].`
- Example: `When an order transitions to PAID status, the order service shall publish an OrderCompleted integration event to the message broker within 50 milliseconds.`

### 3.3 State-Driven Requirement
Active only while the system resides in a designated operational state.
- Syntax: `While [in state], the [system] shall [action].`
- Example: `While operating in OFFLINE mode, the synchronization engine shall buffer all outgoing database mutations in local encrypted storage.`

### 3.4 Unwanted Event / Error Requirement
Governs system behavior under exceptional, error, or malicious conditions.
- Syntax: `If [error/fault condition], then the [system] shall [action].`
- Example: `If an inbound payload contains an unescaped path traversal sequence, then the input sanitizer shall reject the request with HTTP 400 Bad Request and record the incident in the audit log.`

### 3.5 Optional Feature Requirement
Applies only when a specific capability or configuration flag is explicitly active.
- Syntax: `Where [feature flag/option enabled], the [system] shall [action].`
- Example: `Where multi-tenant data isolation is enabled, the query builder shall append tenant_id filters to all relational SELECT queries.`

---

## 4. Verification and Validation (IV&V) Methods

Every requirement statement must map to one of four internationally recognized verification methods:

1. **[I] Inspection**:
   - Visual or automated examination of code, configuration files, architectural schemas, or documentation.
   - Example: Verifying that `.gitignore` contains rules excluding `.env` files.

2. **[A] Analysis**:
   - Algorithmic modeling, mathematical proof, statistical extrapolation, or architectural static analysis.
   - Example: Calculating queue capacity requirements based on Erlang-C queuing equations.

3. **[D] Demonstration**:
   - Qualitative observation of system operation under nominal conditions without quantitative measurement instrumentation.
   - Example: Demonstrating that clicking the export button triggers a file download dialog in the browser.

4. **[T] Test**:
   - Execution of software under controlled test inputs with precise instrumentation and automated pass/fail assertion checks.
   - Example: Unit and integration testing using automated test runners to verify rate limiting under 1,500 RPS load.

---

## 5. Bidirectional Traceability Matrix Schema

Every SRD must feature a complete bidirectional traceability table linking upstream business justifications to downstream verification artifacts.

| Requirement ID | EARS Pattern | Formal Requirement Statement | Parent Upstream ID | IV&V Method | Test Case ID | Verification Status |
|---|---|---|---|---|---|---|
| `REQ-SRD-SEC-001` | Ubiquitous | The egress guard shall block all outbound network socket connections to non-loopback IP addresses. | `BRD-SEC-01` | Test (T) | `TC-SEC-001` | VERIFIED |
| `REQ-SRD-SEC-002` | Unwanted | If an input string matches an AWS secret key regex pattern, then the secret scanner shall mask the value with [REDACTED:AWS_KEY]. | `BRD-SEC-03` | Test (T) | `TC-SEC-002` | VERIFIED |
| `REQ-SRD-LOCK-001` | Event-driven | When a client acquires a distributed lock, the lock manager shall issue a strictly monotonic 64-bit fencing token. | `PRD-CONS-04` | Test (T) | `TC-LOCK-001` | VERIFIED |
| `REQ-SRD-PERF-001` | State-driven | While the system processes peak load, the rate limiter shall reject excess requests exceeding 2,000 RPS with HTTP 429. | `PRD-PERF-02` | Test (T) | `TC-PERF-001` | VERIFIED |
| `REQ-SRD-FS-001` | Optional | Where sandbox confinement is enabled, the process supervisor shall restrict file writes strictly to ./docs/. | `BRD-OPS-02` | Inspection (I) | `TC-FS-001` | VERIFIED |

---

## 6. Formal Verification Checklist
To declare an SRD compliant with ISO/IEC/IEEE 29148:2018:
- [ ] Every requirement is written using one of the five formal EARS syntactical patterns.
- [ ] No requirement combines multiple assertions with conjunctions.
- [ ] Every requirement is assigned an unambiguous verification method: Inspection, Analysis, Demonstration, or Test.
- [ ] All requirements possess unique identifiers following the `REQ-SRD-[MODULE]-[INDEX]` convention.
- [ ] The bidirectional traceability matrix contains zero unmapped or orphaned requirements.

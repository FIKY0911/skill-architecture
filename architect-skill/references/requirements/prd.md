# Product Requirements Document (PRD) Reference Specification

## Standard: Atlassian Product Management Methodology
This document establishes the formal engineering and product management standard for authoring Product Requirements Documents (PRDs) within `architect-skill`. The framework adapts Atlassian agile product management practices into a deterministic, verifiable specification format.

---

## 1. Purpose and Scope
A Product Requirements Document serves as the authoritative contract between product strategy, design, and engineering implementation. It articulates the user problem, defines behavioral expectations, outlines functional boundaries, and establishes quantitative success criteria.

### 1.1 Core Principles
- Problem First: Define user and business friction before discussing architectural solutions.
- Measurable Outcomes: Every objective must tie to a verifiable quantitative metric.
- Explicit Non-Goals: Document what the product will deliberately not address to prevent scope creep.
- Testable Acceptance Criteria: Functional stories must use deterministic behavioral syntax.

---

## 2. Document Structure and Sections

Every generated PRD must contain the following nine structured sections in strict sequence.

```
+-----------------------------------------------------------+
| 1. Document Control & Metadata                            |
+-----------------------------------------------------------+
| 2. Executive Summary & Problem Framing                    |
+-----------------------------------------------------------+
| 3. Target Personas & End-to-End User Journeys             |
+-----------------------------------------------------------+
| 4. Goals and Explicit Non-Goals                           |
+-----------------------------------------------------------+
| 5. Functional Requirements & User Stories (Gherkin)       |
+-----------------------------------------------------------+
| 6. Prioritization Framework (MoSCoW & RICE)               |
+-----------------------------------------------------------+
| 7. Non-Functional Requirements (SLAs & Performance)       |
+-----------------------------------------------------------+
| 8. Telemetry & Success Metrics                            |
+-----------------------------------------------------------+
| 9. Release Phasing & Rollback Triggers                    |
+-----------------------------------------------------------+
```

---

## 3. Detailed Section Requirements

### 3.1 Document Control & Metadata
Each document begins with formal metadata for auditability and ownership tracking:
- Document ID: Unique identifier formatted as `PRD-[PROJECT_CODE]-[VERSION]`.
- Author / Owner: Lead Product Manager or Technical Architect.
- Target Release: Semantic version target (e.g., `v1.2.0`).
- Status: `DRAFT`, `IN_REVIEW`, `APPROVED`, `SUPERSEDED`.
- Last Updated: ISO 8601 UTC timestamp.

### 3.2 Problem Framing and Context
The problem statement must follow the standardized Atlassian framing formula:
> `[Target User]` experiences `[Specific Problem / Friction]` when `[Context / Trigger]`, resulting in `[Measurable Business or User Impact]`.

Example:
> Enterprise compliance officers experience critical review delays when developers submit unstructured architecture artifacts, resulting in average audit lead times of 14 days and increased regulatory exposure.

#### Strategic Context
Articulate the business opportunity, competitive landscape, and why this problem must be resolved in the immediate planning horizon.

### 3.3 Target Personas and User Journeys

#### Persona Archetypes
Each persona definition must document:
1. Role and Demographics: Title, organizational unit, technical fluency.
2. Core Responsibilities: Primary daily deliverables and workflow tasks.
3. Critical Pain Points: High-friction obstacles encountered in current tooling.
4. Definition of Value: What constitutes successful problem resolution for this persona.

#### End-to-End User Journey Map
Construct a linear journey highlighting key milestones:
1. Awareness / Trigger: The initiating event requiring product engagement.
2. Ingestion / Configuration: Initial user input, parameter selection, or setup.
3. Execution / Value Delivery: Core computational or workflow operation.
4. Review & Verification: Inspection of generated artifacts or outcomes.
5. Exit / Handoff: Downstream consumption by external systems or human stakeholders.

### 3.4 Goals and Explicit Non-Goals

#### Goals
- Explicit, verifiable business and technical targets.
- Example: Reduce average PR review turnaround time from 48 hours to under 4 hours.

#### Non-Goals (Scope Exclusion)
- Mandatory negative boundary definitions.
- Example: This release will not provide real-time collaborative multi-user editing. All synchronization remains asynchronous via version control.

### 3.5 Functional Specifications & Gherkin User Stories
All user stories must follow the agile format:
`As a [Persona], I want to [Capability], so that [Business Benefit].`

Each story must be accompanied by executable acceptance criteria written in Gherkin syntax (Given / When / Then):

```gherkin
Scenario: Automated secret redaction on commit
  Given the repository contains an active security policy
  And the developer commits a file containing an AWS access key
  When the pre-commit validation hook runs
  Then the commit is rejected with exit code 1
  And the console prints the file path and line number of the violation
  And the secret value is replaced with [REDACTED:AWS_KEY] in the local audit log
```

### 3.6 Prioritization: MoSCoW and RICE Matrix

#### MoSCoW Categorization
- Must Have (M): Absolute critical path requirements. Without these, the release cannot proceed to production.
- Should Have (S): High-value capabilities with available manual workarounds in the short term.
- Could Have (C): Desirable enhancements implemented only if time and engineering capacity permit.
- Won't Have (W): Explicitly deferred to future release milestones.

#### RICE Scoring Model
For feature prioritization across conflicting backlogs, calculate the composite score:
$$\text{RICE Score} = \frac{\text{Reach} \times \text{Impact} \times \text{Confidence}}{\text{Effort}}$$
- Reach: Number of users impacted per time period (e.g., users per quarter).
- Impact: Value multiplier (3 = Massive, 2 = High, 1 = Medium, 0.5 = Low, 0.25 = Minimal).
- Confidence: Percentage certainty of estimates (100% = High, 80% = Medium, 50% = Low).
- Effort: Person-weeks or story points required.

| Feature ID | Feature Name | Reach | Impact | Confidence | Effort | RICE Score | Priority |
|---|---|---|---|---|---|---|---|
| FEAT-01 | Pre-commit Secret Scanner | 250 | 3.0 | 90% | 2 | 337.5 | Must Have |
| FEAT-02 | Mermaid Diagram Exporter | 120 | 1.0 | 80% | 1 | 96.0 | Should Have |
| FEAT-03 | Interactive Terminal UI | 80 | 0.5 | 60% | 4 | 6.0 | Could Have |

### 3.7 Non-Functional Requirements (NFR)
Define unambiguous, measurable engineering thresholds:
- Latency:
  - p50: Less than 50 ms for local validation checks.
  - p95: Less than 150 ms for complex multi-file parsing.
  - p99: Less than 300 ms across all synchronous CLI operations.
- Throughput: Minimum 2,000 requests per second sustained under load testing conditions.
- Availability: 99.95% uptime for hosted orchestration endpoints (maximum 4.38 hours downtime per year).
- Resource Limits: Peak memory footprint under 256 MB RAM; zero active network sockets.
- Accessibility: WCAG 2.1 Level AA conformance for all web interfaces.

### 3.8 Telemetry and Success Metrics
Define the telemetry tracking schema to quantify adoption and performance:
- North Star Metric: The single metric representing core value realization (e.g., Weekly Active Repositories with Zero Unhandled Violations).
- Supporting Metrics:
  - Time to First Architecture Artifact (TTFA).
  - Validation Pass Rate on initial run.
  - Percentage of manual overrides invoked.
- Guardrail Metrics:
  - False positive rate (must remain below 0.1%).
  - Client-side execution crash rate (must remain below 0.01%).

Event Tracking Payload Standard:
```json
{
  "event_name": "architecture_blueprint_generated",
  "project_id": "proj_a98f12c",
  "timestamp_utc": "2026-10-28T17:00:00Z",
  "properties": {
    "framework": "clean_architecture",
    "generator_version": "1.0.0",
    "generation_latency_ms": 142,
    "validation_status": "PASSED"
  }
}
```

### 3.9 Release Phasing and Rollback Protocols

```
+-------------------------------------------------------------+
| Phase 0: Alpha / Internal Dogfooding (Engineering Team)     |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| Phase 1: Private Beta (Canary Release: 5% Target Audience)  |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| Phase 2: Staged Rollout (25% -> 50% -> 100% General Avail)   |
+-------------------------------------------------------------+
```

#### Automated Rollback Triggers
Immediate rollback to the previous stable release occurs automatically if any of the following boundary violations occur within a 15-minute observation window:
1. Unhandled exception rate exceeds 0.5% of total invocations.
2. p99 response latency exceeds 500 ms for longer than 3 consecutive minutes.
3. Any high-severity security alert or credential exposure detection is reported.

---

## 4. Verification and Compliance Checklist
Before signing off on a PRD, confirm the following verification conditions:
- [ ] Problem statement strictly follows the target user, friction, context, and impact formula.
- [ ] All functional stories include at least one Gherkin acceptance criteria block.
- [ ] Explicit non-goals are documented and approved by project stakeholders.
- [ ] NFRs contain quantitative thresholds rather than qualitative adjectives.
- [ ] RICE scores or MoSCoW priorities are assigned to all feature units.

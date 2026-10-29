# Formal Architecture & Data Diagrams Index: {{PROJECT_NAME}}

## 1. Diagram Inventory

| Diagram File | Type | Standard | Description |
| :--- | :--- | :--- | :--- |
| `architecture/c4-container.mmd` | C4 Container | Simon Brown C4 | System boundary, containers, databases, and external actors |
| `data/erd.mmd` | Entity-Relationship | Chen / IE Notation | Relational entities, primary/foreign keys, and cardinalities |
| `sequence/sequence-core-flow.mmd` | UML Sequence | OMG UML 2.5 | Synchronous/asynchronous message flows and alt/opt blocks |
| `state/state-order-lifecycle.mmd` | Finite State Machine | Harel Statecharts | State transitions, guards, and terminal states |
| `activity/activity-business-workflow.mmd` | Activity Flowchart | OMG UML 2.5 | End-to-end operational flow with decision branches |

## 2. Security & Zero-Credential Policy
All `.mmd` files in this directory are validated by `scripts/validate-mermaid.js` and `scripts/secret-scan.js`. Connection strings with credentials or inline script callbacks are strictly prohibited.

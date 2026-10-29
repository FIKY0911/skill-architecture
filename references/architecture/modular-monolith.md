# Modular Monolith Architecture Reference Specification

## Standard: Bounded Contexts within Single Deployment Units (Martin Fowler, Kamil Grzybek)
This document establishes the authoritative engineering standard for implementing Modular Monoliths within `architect-skill`. It defines module boundary encapsulation, inter-module communication protocols, database schema isolation, and anti-corruption layers.

---

## 1. Architectural Philosophy and Problem Context

A Modular Monolith is an architectural approach where an application is deployed as a single unified binary or runtime process, but is structurally divided into autonomous, loosely coupled modules. Each module encapsulates a specific Domain-Driven Design (DDD) Bounded Context.

```
+-------------------------------------------------------------------------+
| SINGLE DEPLOYMENT UNIT (MONOLITHIC RUNTIME)                             |
|                                                                         |
|  +---------------------------+       +-------------------------------+  |
|  | Module: Identity & Access |       | Module: Billing & Invoicing   |  |
|  | - Public Contract / API   |       | - Public Contract / API       |  |
|  | - Domain & Use Cases      |       | - Domain & Use Cases          |  |
|  | - Internal Repositories   |       | - Internal Repositories       |  |
|  +-------------+-------------+       +---------------+---------------+  |
|                |                             ^                          |
|                | In-Memory Event Bus         | Synchronous API Call     |
|                +-----------------------------+                          |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  | SHARED KERNEL (Primitives, Base Types, Event Dispatcher Contract)  |  |
|  +-------------------------------------------------------------------+  |
+-------------------------------------------------------------------------+
                                 |
                                 v
+-------------------------------------------------------------------------+
| RELATIONAL DATABASE CLUSTER                                             |
|  [ Schema: identity ]                    [ Schema: billing ]            |
|  - identity.users                        - billing.invoices             |
|  - identity.roles                        - billing.payment_methods      |
|  (STRICTLY ZERO FOREIGN KEYS ACROSS MODULE SCHEMAS)                     |
+-------------------------------------------------------------------------+
```

### Core Invariants
1. Autonomous Bounded Contexts: Each module owns its domain model, business invariants, and persistence schema completely.
2. Explicit Public Facades: Modules expose only public contracts and DTOs. Internal implementations (entities, use cases, query handlers) remain private to the module.
3. Zero Cross-Module Data Coupling: Cross-schema SQL joins and direct relational foreign keys between modules are strictly prohibited.
4. Extensibility to Microservices: When boundaries are strictly maintained, any module can be extracted into an independent microservice with zero architectural rewrite.

---

## 2. Module Encapsulation and Package Boundaries

### Visibility and Public Contracts
A module must consist of two distinct structural layers:
1. `contracts/` (Public API): Exported interfaces, public DTOs, and integration event definitions. Any other module in the codebase is permitted to import from this directory.
2. `internal/` (Private Implementation): Domain entities, internal use cases, SQL queries, and infrastructure adapters. Code outside the module must never import from `internal/`.

```
src/modules/billing/
├── contracts/                          # PUBLIC INTERFACE (Importable by other modules)
│   ├── billing-module.facade.ts        # Primary programmatic facade
│   ├── dtos/                           # Public data contracts
│   │   ├── create-invoice-request.dto.ts
│   │   └── invoice-summary.dto.ts
│   └── events/                         # Public integration events
│       └── invoice-settled.event.ts
└── internal/                           # PRIVATE DOMAIN (Enforced non-exported)
    ├── domain/                         # Bounded context entities
    │   ├── invoice.entity.ts
    │   └── line-item.value-object.ts
    ├── use-cases/                      # Internal interactors
    │   └── create-invoice.use-case.ts
    └── infrastructure/                 # Internal database access
        ├── repositories/
        └── persistence/
            └── invoice.orm-entity.ts
```

### Automated Boundary Enforcement
Boundary enforcement must not rely solely on developer discipline. Enforce encapsulation using compiler restrictions or linter rules:

#### ESLint Module Boundary Rule (`.eslintrc.js`)
```javascript
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/modules/*/internal/**'],
            message: 'Direct imports from another module internal directory are forbidden. Depend strictly on contracts/.'
          }
        ]
      }
    ]
  }
};
```

---

## 3. Inter-Module Communication Patterns

Inter-module interactions must use one of two standardized mechanisms:

### 3.1 Synchronous Invocations via Module Facades
Used when an immediate query response or transactional validation is required. The calling module invokes the target module's exported facade interface.

```typescript
// src/modules/billing/contracts/billing-module.facade.ts
export interface BillingModuleFacade {
  getInvoiceSummary(customerId: string): Promise<InvoiceSummaryDTO[]>;
  createInvoice(request: CreateInvoiceRequestDTO): Promise<string>;
}
```

```typescript
// In src/modules/orders/internal/use-cases/checkout.use-case.ts
import { BillingModuleFacade } from '../../../billing/contracts/billing-module.facade';

export class CheckoutUseCase {
  constructor(private readonly billingModule: BillingModuleFacade) {}

  public async execute(orderId: string, customerId: string, amount: number): Promise<void> {
    // Calling billing module via its public contract facade
    const invoiceId = await this.billingModule.createInvoice({
      customerId,
      amount,
      referenceOrderId: orderId
    });
  }
}
```

### 3.2 Asynchronous Domain Events (In-Memory Mediator)
Used for state transitions and side effects to prevent temporal and transactional coupling. Modules publish integration events to an in-memory event bus.

```typescript
// src/modules/shared-kernel/event-bus/event-bus.interface.ts
export interface IntegrationEvent {
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventName: string;
}

export interface EventBus {
  publish<T extends IntegrationEvent>(event: T): Promise<void>;
  subscribe<T extends IntegrationEvent>(
    eventName: string,
    handler: (event: T) => Promise<void>
  ): void;
}
```

```typescript
// In src/modules/orders/contracts/events/order-placed.event.ts
import { IntegrationEvent } from '../../../shared-kernel/event-bus/event-bus.interface';

export class OrderPlacedEvent implements IntegrationEvent {
  public readonly eventName = 'OrderPlacedEvent';
  constructor(
    public readonly eventId: string,
    public readonly occurredOn: Date,
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly totalAmount: number
  ) {}
}
```

---

## 4. Database Schema Isolation

### Logical Schema Segregation
Within a shared relational database instance, each module must possess an isolated database schema:
- Identity Module: Schema `identity`
- Catalog Module: Schema `catalog`
- Billing Module: Schema `billing`

```sql
-- DDL Example: Module Schema Isolation
CREATE SCHEMA identity;
CREATE SCHEMA billing;

CREATE TABLE identity.users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE billing.invoices (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL, -- Logical reference only! NO FOREIGN KEY constraint.
    amount_cents BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Relational Constraints Policy
- Prohibited: `ALTER TABLE billing.invoices ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES identity.users(id);`
- Rationale: Cross-schema foreign keys create rigid database locks and eliminate independent table reorganization, preventing modular database evolution.
- Enforcement: Referential integrity across modules must be verified at the application use-case level, not the relational constraint engine level.

---

## 5. Anti-Corruption Layer (ACL)

When a module must consume data or services from an external legacy subsystem or third-party vendor API, an Anti-Corruption Layer must be introduced between the external interface and the module core domain.

```
+-----------------------------------------------------------+
| Module Core Domain                                        |
| (Clean Entities, Ubiquitous Language)                     |
+-----------------------------+-----------------------------+
                              ^
                              | Domain Port
+-----------------------------+-----------------------------+
| Anti-Corruption Layer (ACL)                               |
| - Adapter translates foreign data models into domain DTOs |
| - Isolates domain from vendor-specific payload churn      |
+-----------------------------+-----------------------------+
                              ^
                              | Vendor Protocol (e.g. SOAP/REST)
+-----------------------------+-----------------------------+
| External Legacy System / 3rd-Party Vendor                 |
+-----------------------------------------------------------+
```

### ACL Implementation Rules
1. Never allow third-party data structures to propagate into internal domain models.
2. The ACL translator function maps third-party payload fields directly into domain value objects.
3. Changes to third-party APIs require updating only the adapter, isolating the domain model completely.

---

## 6. Shared Kernel Boundaries

The `shared-kernel` module must remain strictly minimal:
- Permitted in Shared Kernel:
  - Primitive value types (UUID generators, Money, Currency types).
  - Common domain exceptions (EntityNotFoundException, DomainValidationException).
  - Abstract event bus and telemetry interfaces.
- Prohibited in Shared Kernel:
  - Business domain models (e.g., User, Order, Invoice).
  - Concrete database repository implementations.
  - Third-party vendor SDK wrappers.

---

## 7. Architectural Verification Checklist
To confirm Modular Monolith compliance:
- [ ] No module imports from the `internal/` folder of another module.
- [ ] Cross-module communications use exported facades or in-memory integration events.
- [ ] Relational database migrations define isolated schemas per module.
- [ ] Zero foreign key constraints span across distinct module schemas.
- [ ] The Shared Kernel contains zero domain entities or business logic.

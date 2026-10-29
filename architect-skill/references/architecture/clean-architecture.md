# Clean Architecture Reference Specification

## Standard: Robert C. Martin (Uncle Bob)
This document establishes the authoritative engineering standard for implementing Clean Architecture within `architect-skill`. It formalizes the onion-layered architectural paradigm, enforces the strict Dependency Inversion Rule, and defines boundary-crossing mechanics between domain logic and ephemeral infrastructure.

---

## 1. Core Architectural Axiom: The Dependency Rule

The governing rule of Clean Architecture states:
> Source code dependencies must point solely inward, toward higher-level policies. Nothing in an inner circle can know anything at all about something in an outer circle.

```
                      +-----------------------------------------+
                      | Frameworks & Drivers                    |
                      | (Web, DB, UI, Devices, External APIs)   |
                      |   +---------------------------------+   |
                      |   | Interface Adapters              |   |
                      |   | (Controllers, Gateways, Present)|   |
                      |   |   +-------------------------+   |   |
                      |   |   | Use Cases               |   |   |
                      |   |   | (Application Rules)     |   |   |
                      |   |   |   +-----------------+   |   |   |
                      |   |   |   | Entities        |   |   |   |
                      |   |   |   | (Enterprise)    |   |   |   |
                      |   |   |   +-----------------+   |   |   |
                      |   |   +-------------------------+   |   |
                      |   +---------------------------------+   |
                      +-----------------------------------------+
                                          |
                        Dependency Arrow  | Points Strictly Inward
                                          v
```

### Invariants of the Dependency Rule
1. Inner layers must never import or reference classes, interfaces, types, or packages declared in outer layers.
2. Data formats declared in outer layers (e.g., HTTP request bodies, SQL result sets, ORM models) must never cross into inner layers.
3. Business rules remain completely agnostic of database engines, web frameworks, communication protocols, and user interface libraries.

---

## 2. The Four Concentric Layers

### Layer 1: Entities (Enterprise Business Rules)
Entities encapsulate enterprise-wide critical business rules. An entity can be an object with methods or a set of data structures and functions.
- Invariant: Entities must not depend on any external library, framework, or persistence mechanism.
- Content: Domain models, Value Objects, Domain Events, and Core Business Invariants.
- Lifespan: Entities experience the lowest rate of change in an enterprise application. Changes to UI, databases, or frameworks must never require changes to entities.

```typescript
// src/core/domain/entities/order.entity.ts
export class Order {
  private constructor(
    public readonly id: string,
    public readonly customerId: string,
    private _totalAmount: number,
    private _status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  ) {}

  public static create(id: string, customerId: string, initialAmount: number): Order {
    if (initialAmount <= 0) {
      throw new Error('Order amount must be positive');
    }
    return new Order(id, customerId, initialAmount, 'PENDING');
  }

  public confirm(): void {
    if (this._status !== 'PENDING') {
      throw new Error('Only pending orders can be confirmed');
    }
    this._status = 'CONFIRMED';
  }

  public get status(): string {
    return this._status;
  }
}
```

### Layer 2: Use Cases (Application Business Rules)
Use cases encapsulate the specific use cases of the application. They orchestrate the flow of data to and from the entities, directing those entities to apply enterprise business rules.
- Invariant: Changes in this layer do not affect entities. Changes in frameworks or databases do not affect use cases.
- Content: Interactors, Input Port interfaces, Output Port interfaces, and Request/Response Data Transfer Objects (DTOs).

```typescript
// src/core/use-cases/ports/order-repository.port.ts
import { Order } from '../../domain/entities/order.entity';

export interface OrderRepositoryPort {
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<void>;
}

// src/core/use-cases/confirm-order/confirm-order.use-case.ts
export interface ConfirmOrderRequestDTO {
  orderId: string;
}

export interface ConfirmOrderResponseDTO {
  orderId: string;
  status: string;
}

export class ConfirmOrderUseCase {
  constructor(private readonly orderRepository: OrderRepositoryPort) {}

  public async execute(request: ConfirmOrderRequestDTO): Promise<ConfirmOrderResponseDTO> {
    const order = await this.orderRepository.findById(request.orderId);
    if (!order) {
      throw new Error(`Order with ID ${request.orderId} not found`);
    }

    order.confirm();
    await this.orderRepository.save(order);

    return {
      orderId: order.id,
      status: order.status
    };
  }
}
```

### Layer 3: Interface Adapters
Interface adapters convert data from the format most convenient for the use cases and entities into the format most convenient for external agencies (web controllers, presenters, database repositories).
- Invariant: Adapters implement interfaces declared by the use cases (Inversion of Control).
- Content: Web Controllers, API Presenters, Repository Implementations, CLI Handlers, Event Listeners.

```typescript
// src/adapters/gateways/postgres-order.repository.ts
import { OrderRepositoryPort } from '../../core/use-cases/ports/order-repository.port';
import { Order } from '../../core/domain/entities/order.entity';
import { DatabaseConnection } from '../../infrastructure/database/connection';

export class PostgresOrderRepository implements OrderRepositoryPort {
  constructor(private readonly db: DatabaseConnection) {}

  public async findById(id: string): Promise<Order | null> {
    const row = await this.db.query('SELECT id, customer_id, amount, status FROM orders WHERE id = $1', [id]);
    if (!row) return null;
    return Order.create(row.id, row.customer_id, row.amount);
  }

  public async save(order: Order): Promise<void> {
    await this.db.query(
      'INSERT INTO orders (id, customer_id, amount, status) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET status = $4',
      [order.id, order.customerId, 100, order.status]
    );
  }
}
```

### Layer 4: Frameworks and Drivers
The outermost layer composed of tools, frameworks, and drivers such as the database, web server, and third-party services.
- Invariant: Glue code only. Contains virtually zero domain logic.
- Content: Express/Fastify routes, database ORM configurations, message queue clients, cloud SDKs.

---

## 3. Boundary Crossing and Inversion of Control

Control flow originates in the outer layer (e.g., an HTTP request hitting an Express controller), travels through the use case layer, interacts with domain entities, and returns back out. 

However, source code dependencies must oppose control flow when interacting with outbound infrastructure (e.g., databases or third-party payment gateways).

```
Control Flow:
Controller  ======>  UseCase Interactor  ======>  Database Adapter
      |                      |                           |
      v                      v                           v
Source Code Dependencies:
Controller  ------>  Input Port (Interface)
                     UseCase Interactor  ------>  Output Port (Interface)
                                                         ^
                                                         | (implements)
                                                  Database Adapter
```

### Boundary Rules
1. Never pass raw database entities (e.g., ORM models like TypeORM `@Entity` or Prisma models) into use cases or domain entities.
2. Cross boundaries using simple, isolated Data Transfer Objects (plain objects, primitives, or read-only records).
3. The use case defines the interface for data persistence; the infrastructure layer implements it.

---

## 4. Standard Directory Layout

```
src/
├── core/
│   ├── domain/                         # Layer 1: Enterprise Business Rules
│   │   ├── entities/                   # Domain entities and aggregates
│   │   ├── value-objects/              # Immutable value objects
│   │   ├── events/                     # Domain event declarations
│   │   └── exceptions/                 # Domain-specific error types
│   └── use-cases/                      # Layer 2: Application Business Rules
│       ├── ports/                      # Secondary / Driven interface ports
│       │   ├── order-repository.port.ts
│       │   └── payment-gateway.port.ts
│       ├── dtos/                       # Request/Response data contracts
│       └── place-order/                # Interactor implementations
│           ├── place-order.use-case.ts
│           └── place-order.dto.ts
├── adapters/                           # Layer 3: Interface Adapters
│   ├── controllers/                    # Web / HTTP handlers
│   │   └── order.controller.ts
│   ├── presenters/                     # View model formatters
│   └── gateways/                       # Secondary adapter implementations
│       ├── postgres-order.repository.ts
│       └── stripe-payment.adapter.ts
└── infrastructure/                     # Layer 4: Frameworks & Drivers
    ├── http/                           # Express / Fastify server bootstrap
    ├── database/                       # Connection pools, migration runners
    └── config/                         # Environment configuration loaders
```

---

## 5. Independent Testability Invariant

Clean Architecture guarantees that core business logic is testable without initializing external infrastructure.

### Unit Testing Without Frameworks
Because use cases depend strictly on abstract ports rather than concrete databases or HTTP servers, unit tests can run entirely in memory using test doubles (mocks, fakes, or stubs).

```typescript
// tests/unit/confirm-order.use-case.test.ts
import { ConfirmOrderUseCase } from '../../src/core/use-cases/confirm-order/confirm-order.use-case';
import { Order } from '../../src/core/domain/entities/order.entity';
import { OrderRepositoryPort } from '../../src/core/use-cases/ports/order-repository.port';

class InMemoryOrderRepository implements OrderRepositoryPort {
  public orders: Map<string, Order> = new Map();

  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) || null;
  }

  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }
}

describe('ConfirmOrderUseCase', () => {
  it('confirms a pending order successfully in pure memory', async () => {
    const repo = new InMemoryOrderRepository();
    const order = Order.create('ord-1', 'cust-1', 100);
    await repo.save(order);

    const useCase = new ConfirmOrderUseCase(repo);
    const response = await useCase.execute({ orderId: 'ord-1' });

    expect(response.status).toBe('CONFIRMED');
    const savedOrder = await repo.findById('ord-1');
    expect(savedOrder?.status).toBe('CONFIRMED');
  });
});
```

---

## 6. Architectural Compliance Checklist
When verifying Clean Architecture implementations:
- [ ] No inner layer file imports from an outer layer.
- [ ] Domain entities contain zero external framework dependencies or annotations.
- [ ] Repository interfaces are defined inside the use-case layer (`ports/`), not the infrastructure layer.
- [ ] Use cases cross boundaries using plain DTOs rather than active domain entities or ORM records.
- [ ] 100% of domain and use-case unit tests execute without requiring database or network connections.

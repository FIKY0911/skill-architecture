# Hexagonal Architecture (Ports and Adapters) Reference Specification

## Standard: Alistair Cockburn (2005)
This document establishes the authoritative engineering standard for Hexagonal Architecture (also known as Ports and Adapters) within `architect-skill`. It formalizes the asymmetric boundary between the application domain core and external infrastructure, defines the strict separation between driving and driven ports, and establishes testing strategies.

---

## 1. Architectural Motivation and Core Axioms

Hexagonal Architecture was formulated by Alistair Cockburn to solve a critical architectural vulnerability: the leakage of technical details (HTTP protocols, database tables, user interfaces) into business logic.

```
                  DRIVING / PRIMARY SIDE                DRIVEN / SECONDARY SIDE
                  (Initiates Actions)                    (Reacts to Domain Calls)

   +----------------+                                                  +----------------+
   | REST Controller|----+                                       +---->| PostgreSQL Rep |
   +----------------+    |                                       |     +----------------+
                         v                                       |
   +----------------+  +---------------------------------------+ |     +----------------+
   | CLI Command    |->| [Driving Port]         [Driven Port]  |-+---->| Redis Cache Adp|
   +----------------+  |  (Input Port)           (Output Port) | |     +----------------+
                       |                                       | |
   +----------------+  |          APPLICATION CORE             | |     +----------------+
   | Queue Consumer |->|       (Domain Models & Logic)         |-+---->| Stripe Gateway |
   +----------------+  +---------------------------------------+       +----------------+
                                       ^
                                       |
                       Source Code Dependencies Point Strictly Inward
```

### Core Architectural Axioms
1. Symmetric Isolation: The application core treats all external interactions through abstract ports, regardless of whether the caller is a human user, a web browser, a automated test harness, or a batch script.
2. Inward Dependency Direction: All source code dependencies point directly inward toward the application core. The application core contains zero imports or knowledge of adapters.
3. Testability in Isolation: The application core can be completely exercised and validated using in-memory test doubles without starting a database, web server, or network socket.

---

## 2. Driving vs Driven Ports and Adapters

Hexagonal Architecture categorizes all interfaces into two distinct operational roles:

### 2.1 Driving (Primary / Inbound) Side
Driving components are the entities that initiate communication with the application core.

- **Driving Ports (Inbound Interfaces)**:
  - Reside inside the Application Core.
  - Expose what the application can execute (use cases or domain services).
  - Define input parameters and return contracts.
- **Driving Adapters (Inbound Adapters)**:
  - Reside in the Infrastructure Layer.
  - Translate external communication protocols (HTTP JSON payloads, CLI arguments, gRPC protocol buffers, RabbitMQ messages) into domain method invocations on the driving port.
  - Examples: `OrderExpressController`, `CreateOrderCliHandler`, `OrderEventConsumer`.

```typescript
// Application Core: Driving Port
// src/core/ports/driving/create-order.port.ts
export interface CreateOrderCommand {
  customerId: string;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
}

export interface CreateOrderPort {
  createOrder(command: CreateOrderCommand): Promise<string>;
}
```

```typescript
// Infrastructure Adapter: Driving Adapter
// src/adapters/driving/http/order.controller.ts
import { Request, Response } from 'express';
import { CreateOrderPort } from '../../../core/ports/driving/create-order.port';

export class OrderController {
  constructor(private readonly createOrderService: CreateOrderPort) {}

  public async handlePost(req: Request, res: Response): Promise<void> {
    try {
      const orderId = await this.createOrderService.createOrder({
        customerId: req.body.customer_id,
        items: req.body.items
      });
      res.status(201).json({ id: orderId });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

### 2.2 Driven (Secondary / Outbound) Side
Driven components are external services or data stores invoked by the application core to fulfill a business requirement.

- **Driven Ports (Outbound Interfaces)**:
  - Reside inside the Application Core.
  - Define what the core requires from external infrastructure (persistence, notification, external verification).
  - Follow the Service Provider Interface (SPI) pattern.
- **Driven Adapters (Outbound Adapters)**:
  - Reside in the Infrastructure Layer.
  - Implement driven ports to bridge domain requirements to specific technical implementations (PostgreSQL via SQL queries, Redis via key-value commands, SendGrid via HTTP API).
  - Examples: `PostgresOrderRepository`, `RedisSessionStore`, `StripePaymentAdapter`.

```typescript
// Application Core: Driven Port
// src/core/ports/driven/payment-gateway.port.ts
export interface ChargeRequest {
  customerId: string;
  amountCents: number;
  currency: string;
}

export interface PaymentGatewayPort {
  charge(request: ChargeRequest): Promise<{ transactionId: string; success: boolean }>;
}
```

```typescript
// Infrastructure Adapter: Driven Adapter
// src/adapters/driven/payment/stripe-payment.adapter.ts
import { PaymentGatewayPort, ChargeRequest } from '../../../core/ports/driven/payment-gateway.port';

export class StripePaymentAdapter implements PaymentGatewayPort {
  constructor(private readonly apiKey: string) {}

  public async charge(request: ChargeRequest): Promise<{ transactionId: string; success: boolean }> {
    // Converts domain charge request into vendor-specific Stripe API calls
    return {
      transactionId: 'ch_test_98124',
      success: true
    };
  }
}
```

---

## 3. Application Core Implementation

The Application Core consists of Domain Entities, Business Rules, and Use Case Service Implementations that bind driving ports to driven ports.

```typescript
// src/core/services/order.service.ts
import { CreateOrderPort, CreateOrderCommand } from '../ports/driving/create-order.port';
import { PaymentGatewayPort } from '../ports/driven/payment-gateway.port';
import { OrderRepositoryPort } from '../ports/driven/order-repository.port';

export class OrderService implements CreateOrderPort {
  constructor(
    private readonly orderRepository: OrderRepositoryPort,
    private readonly paymentGateway: PaymentGatewayPort
  ) {}

  public async createOrder(command: CreateOrderCommand): Promise<string> {
    const totalCents = command.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity * 100,
      0
    );

    const paymentResult = await this.paymentGateway.charge({
      customerId: command.customerId,
      amountCents: totalCents,
      currency: 'USD'
    });

    if (!paymentResult.success) {
      throw new Error('Payment transaction declined by payment gateway');
    }

    const orderId = `ord-${Date.now()}`;
    await this.orderRepository.save({
      id: orderId,
      customerId: command.customerId,
      totalCents,
      status: 'PAID'
    });

    return orderId;
  }
}
```

---

## 4. Directory Structure Standard

```
src/
├── core/                               # Application Core (Framework-Free Hexagon)
│   ├── domain/                         # Entities, Value Objects, Domain Errors
│   │   ├── order.entity.ts
│   │   └── money.vo.ts
│   ├── ports/
│   │   ├── driving/                    # Inbound Port Interfaces
│   │   │   └── create-order.port.ts
│   │   └── driven/                     # Outbound Port Interfaces
│   │       ├── order-repository.port.ts
│   │       └── payment-gateway.port.ts
│   └── services/                       # Core Use Case Implementations
│       └── order.service.ts
└── adapters/                           # Infrastructure Layer (External Adapters)
    ├── driving/                        # Inbound Adapters (Drive the Core)
    │   ├── http/                       # REST / GraphQL Controllers
    │   │   └── order.controller.ts
    │   ├── cli/                        # Terminal Command Handlers
    │   └── queue/                      # Message Queue Listeners
    └── driven/                         # Outbound Adapters (Driven by the Core)
        ├── persistence/                # Database Adapters
        │   └── postgres-order.adapter.ts
        ├── payment/                    # Third-party payment gateways
        │   └── stripe-payment.adapter.ts
        └── messaging/                  # Event publication adapters
            └── kafka-event.adapter.ts
```

---

## 5. Testing Discipline: Swapping Adapters with Test Doubles

Hexagonal Architecture decouples testing from infrastructure mechanics. Unit tests verify the application core by substituting driven ports with deterministic in-memory implementations.

```typescript
// tests/unit/order-service.test.ts
import { OrderService } from '../../src/core/services/order.service';
import { PaymentGatewayPort, ChargeRequest } from '../../src/core/ports/driven/payment-gateway.port';
import { OrderRepositoryPort } from '../../src/core/ports/driven/order-repository.port';

class MockPaymentGateway implements PaymentGatewayPort {
  public shouldSucceed = true;
  async charge(request: ChargeRequest) {
    return { transactionId: 'tx-123', success: this.shouldSucceed };
  }
}

class InMemoryOrderRepository implements OrderRepositoryPort {
  public storedOrders: any[] = [];
  async save(order: any) {
    this.storedOrders.push(order);
  }
}

describe('OrderService (Hexagonal Core)', () => {
  it('successfully creates an order when payment succeeds', async () => {
    const payment = new MockPaymentGateway();
    const repo = new InMemoryOrderRepository();
    const service = new OrderService(repo, payment);

    const orderId = await service.createOrder({
      customerId: 'cust-1',
      items: [{ productId: 'p-1', quantity: 2, unitPrice: 50 }]
    });

    expect(orderId).toBeDefined();
    expect(repo.storedOrders.length).toBe(1);
    expect(repo.storedOrders[0].status).toBe('PAID');
  });

  it('rejects order creation when payment fails', async () => {
    const payment = new MockPaymentGateway();
    payment.shouldSucceed = false;
    const repo = new InMemoryOrderRepository();
    const service = new OrderService(repo, payment);

    await expect(
      service.createOrder({
        customerId: 'cust-1',
        items: [{ productId: 'p-1', quantity: 1, unitPrice: 20 }]
      })
    ).rejects.toThrow('Payment transaction declined');

    expect(repo.storedOrders.length).toBe(0);
  });
});
```

---

## 6. Architectural Verification Checklist
To confirm Hexagonal compliance:
- [ ] Core directory contains zero framework, ORM, or HTTP library imports.
- [ ] Driving adapters depend strictly on driving ports (`ports/driving/`).
- [ ] Driven adapters implement driven ports (`ports/driven/`).
- [ ] Core business services depend solely on driven interfaces, not concrete adapter classes.
- [ ] Complete domain test suites execute in memory in under 5 seconds with zero external process dependencies.

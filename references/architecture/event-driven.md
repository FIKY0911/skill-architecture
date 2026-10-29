# Event-Driven Architecture (EDA) Reference Specification

## Standard: Enterprise Integration Patterns (Hohpe & Woolf), Martin Fowler
This document establishes the authoritative engineering standard for Event-Driven Architecture (EDA) within `architect-skill`. It formalizes broker and mediator topologies, event taxonomies, event sourcing, the Transactional Outbox pattern, idempotent consumption, distributed sagas, and schema evolution rules.

---

## 1. Topologies: Broker vs Mediator

Event-Driven Architecture organizes systems around the generation, detection, consumption, and response to state changes. Two fundamental structural topologies govern EDA designs:

```
+-------------------------------------------------------------------------------+
| BROKER TOPOLOGY (Choreography - High Decoupling, Event Chains)                |
|                                                                               |
|  [Order Service]                                                              |
|        | (publishes OrderPlaced)                                              |
|        v                                                                      |
|  [Message Broker Topic: orders.placed]                                        |
|        +-----------------------------------+-------------------------------+  |
|        |                                   |                               |  |
|        v                                   v                               v  |
|  [Inventory Service]              [Payment Service]              [Analytics]  |
|  (reserves stock)                 (charges customer)             (logs event) |
+-------------------------------------------------------------------------------+

+-------------------------------------------------------------------------------+
| MEDIATOR TOPOLOGY (Orchestration - Centralized Coordination, Explicit States) |
|                                                                               |
|                   +----------------------------------+                        |
|                   | Saga Orchestrator / Process Mgr  |                        |
|                   +-----------------+----------------+                        |
|                                     |                                         |
|        +----------------------------+----------------------------+            |
|        | Command 1                  | Command 2                  | Command 3  |
|        v                            v                            v            |
|  [Inventory Service]        [Payment Service]            [Shipping Service]   |
|        |                            |                            |            |
|        +----------------------------+----------------------------+            |
|        | Awaits Responses and Coordinates Compensations                       |
|        v                                                                      |
+-------------------------------------------------------------------------------+
```

### 1.1 Broker Topology (Choreography)
- Characteristics: Decentralized control. Processors react directly to events without a central coordinator.
- Advantages: High performance, extreme horizontal scalability, zero single point of coordination failure.
- Trade-offs: Difficult to trace distributed transaction states; risk of cyclic event cascades.
- Application: High-volume streaming, decoupled notifications, asynchronous data pipelines.

### 1.2 Mediator Topology (Orchestration)
- Characteristics: A central orchestrator (Process Manager or Saga Coordinator) receives an initiating event, directs commands to participating services, awaits results, and executes compensating actions on failure.
- Advantages: Explicit state visibility, deterministic error handling, centralized business workflow management.
- Trade-offs: Bottleneck risk at the orchestrator; higher initial design complexity.
- Application: Complex multi-step financial workflows, order fulfillment, regulated business processes.

---

## 2. Event Taxonomies: Notification vs ECST

Events are classified into three functional categories based on payload and boundary:

### 2.1 Domain Events
- Boundary: Confined strictly within a single bounded context or aggregate root.
- Purpose: Notifies in-process domain listeners of an internal state transition (e.g., `OrderItemAdded`).
- Transport: In-memory synchronous or asynchronous mediator bus.

### 2.2 Integration Events
- Boundary: Emitted across distinct system boundaries, microservices, or external partners.
- Purpose: Signals a significant business milestone (e.g., `Billing.SubscriptionCancelled`).
- Transport: Durable message brokers (Kafka, RabbitMQ, AWS SQS/SNS).

### 2.3 Event Notification vs Event-Carried State Transfer (ECST)

| Dimension | Event Notification | Event-Carried State Transfer (ECST) |
|---|---|---|
| **Payload Size** | Minimal: ID, Timestamp, Event Name | Comprehensive: Full entity state snapshot |
| **Payload Example** | `{"order_id": "ord-123", "status": "SHIPPED"}` | `{"order_id": "ord-123", "customer": {...}, "items": [...], "total": 99.00}` |
| **Consumer Behavior** | Consumer must query producer API for details | Consumer processes event autonomously |
| **Producer Load** | High: Incurred downstream API call load | Low: Producer handles zero follow-up read queries |
| **Data Coupling** | Low data coupling; high temporal API coupling | High schema coupling; zero temporal API coupling |
| **Use Case** | Lightweight signals, cache invalidations | Distributed projections, read models, audit pipelines |

---

## 3. Transactional Outbox Pattern

The Transactional Outbox pattern resolves the fundamental distributed system flaw known as the Dual-Write Problem.

### The Dual-Write Problem
When an application updates a database AND publishes an event to a message broker, a network partition or process crash between the operations inevitably produces inconsistency:
- Case A: Database commit succeeds, but broker publish fails. The event is lost forever.
- Case B: Broker publish succeeds, but database transaction aborts. Downstream systems process an event that never occurred.

### Outbox Solution Mechanics
The application commits the domain state mutation AND the event payload to the same relational database in a single ACID transaction.

```sql
BEGIN;

-- 1. Mutate business state
INSERT INTO orders (id, customer_id, total_amount, status)
VALUES ('ord-982', 'cust-441', 250.00, 'CONFIRMED');

-- 2. Insert event record into outbox table in the same transaction
INSERT INTO outbox_events (
    id,
    aggregate_type,
    aggregate_id,
    event_type,
    payload,
    created_at
) VALUES (
    'evt-001',
    'Order',
    'ord-982',
    'OrderConfirmedEvent',
    '{"orderId": "ord-982", "customerId": "cust-441", "totalAmount": 250.00}',
    NOW()
);

COMMIT;
```

### Event Relay Engine
An asynchronous background relay reads records from `outbox_events` and publishes them to the message broker:
1. Transaction Log Mining (Preferred): Tools such as Debezium inspect the PostgreSQL Write-Ahead Log (WAL) or MySQL binlog to stream outbox records into Apache Kafka with microsecond latency and zero query load on the database.
2. Polling Publisher (Alternative): A scheduled worker polls `SELECT * FROM outbox_events WHERE published = FALSE LIMIT 100 FOR UPDATE SKIP LOCKED`, publishes to the broker, and marks records as published.

---

## 4. Idempotent Consumer Implementation

Because message brokers guarantee At-Least-Once delivery in distributed environments, consumers will inevitably receive duplicate messages due to network retries. Consumers must guarantee idempotent processing.

### Idempotency Key Pattern with Deduplication Storage

```
[Inbound Message from Broker]
           |
           v
+------------------------------------------+
| Check Message ID in Deduplication Table  |
+--------------------+---------------------+
                     |
         +-----------+-----------+
         |                       |
[ID Already Exists]      [ID Not Found]
         |                       |
         v                       v
[Acknowledge and Skip]   [Execute Business Transaction]
                         [Insert Message ID into Deduplication Table]
                         [Commit Transaction]
```

#### SQL Implementation of Consumer Deduplication
```sql
BEGIN;

-- Attempt to register idempotency key
INSERT INTO processed_messages (message_id, processed_at)
VALUES ('msg-kafka-9812-partition-2', NOW())
ON CONFLICT (message_id) DO NOTHING;

-- If insert was skipped, message was already processed
-- Application aborts processing and immediately acknowledges broker
```

---

## 5. Distributed Saga Pattern: Choreography vs Orchestration

Distributed transactions spanning multiple databases cannot safely rely on Two-Phase Commit (2PC) at scale due to latency amplification and coordinator blocking. Sagas execute a sequence of local transactions coordinated via events.

### Compensating Transactions
For every forward transaction $T_i$, there must exist an equivalent compensating transaction $C_i$ that semantically reverses its side effects if a downstream step fails:
$$T_1 \rightarrow T_2 \rightarrow T_3 (\text{FAIL}) \implies C_2 \rightarrow C_1$$

### Saga Orchestrator State Machine (Example)
```typescript
export class OrderFulfillmentSaga {
  private state: 'STARTED' | 'STOCK_RESERVED' | 'PAYMENT_PROCESSED' | 'FAILED' = 'STARTED';

  async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {
    try {
      await this.inventoryService.reserveStock(event.orderId, event.items);
      this.state = 'STOCK_RESERVED';

      await this.paymentService.processPayment(event.orderId, event.amount);
      this.state = 'PAYMENT_PROCESSED';

      await this.shippingService.scheduleDispatch(event.orderId);
    } catch (error) {
      await this.rollback();
    }
  }

  private async rollback(): Promise<void> {
    if (this.state === 'STOCK_RESERVED') {
      await this.inventoryService.releaseStock();
    }
    this.state = 'FAILED';
  }
}
```

---

## 6. Schema Evolution and Compatibility Rules

Distributed asynchronous architectures depend upon stable data contracts. When event structures evolve, producers and consumers must adhere to strict compatibility rules managed via a Schema Registry (e.g., Confluent Schema Registry using Apache Avro or Protocol Buffers).

### 6.1 Full Compatibility Invariant
New schemas must be both Backward and Forward compatible:
- Backward Compatibility: A consumer reading a new event schema version can still process historical messages produced under older schemas.
- Forward Compatibility: An existing consumer running an older schema can successfully parse messages produced under new schema versions without crashing.

### 6.2 Schema Evolution Rules
1. Never delete or rename existing fields.
2. New fields added to an event must specify an explicit default value.
3. Field data types must not be modified across versions.
4. If a breaking semantic change is unavoidable, publish to a brand new topic namespace (e.g., `orders.v2`).

---

## 7. Architectural Verification Checklist
When verifying Event-Driven Architectures:
- [ ] Every cross-service mutation produces an Integration Event via the Transactional Outbox pattern.
- [ ] All message consumers implement idempotent processing backed by persistent message deduplication.
- [ ] Distributed multi-step mutations define explicit compensating transactions for rollback paths.
- [ ] Event schemas maintain full backward and forward compatibility with default field values.
- [ ] Unhandled processing errors route to a designated Dead-Letter Queue (DLQ) after configured retry backoff.

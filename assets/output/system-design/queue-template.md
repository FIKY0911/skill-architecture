# Asynchronous Message Queue & Outbox Specification: {{PROJECT_NAME}}

> **Target Broker**: Apache Kafka / RabbitMQ / BullMQ  
> **Reliability Pattern**: Transactional Outbox Pattern + Idempotent Consumer + Dead Letter Queue (DLQ)

---

## 1. Dual-Write Problem & Transactional Outbox Pattern

Attempting to update an application database and publish a message to an external broker in two separate network calls introduces race conditions and partial failure modes. If the database commits but the broker connection times out, data becomes permanently desynchronized.

```
[Client Request] ---> [BEGIN ACID TRANSACTION]
                                |
             +------------------+------------------+
             |                                     |
             v                                     v
   [INSERT INTO orders]                  [INSERT INTO outbox_events]
             |                                     |
             +------------------+------------------+
                                |
                      [COMMIT TRANSACTION]
                                |
                                v
               [Debezium CDC / Poller Process]
                                |
                                v
                   [Publish to Message Broker]
```

### 1.1 Outbox Table Schema
```sql
CREATE TABLE outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type VARCHAR(64) NOT NULL,
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(128) NOT NULL,
    payload JSONB NOT NULL,
    headers JSONB DEFAULT '{}'::jsonb,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_outbox_unprocessed ON outbox_events (created_at) WHERE published = FALSE;
```

---

## 2. Event Payload Schema (CloudEvents Specification)

All asynchronous integration messages conform to the CNCF CloudEvents v1.0 standard:

```json
{
  "specversion": "1.0",
  "id": "evt_01H8X9A2M4",
  "source": "/services/order-service",
  "type": "com.{{PROJECT_DOMAIN}}.order.paid",
  "datacontenttype": "application/json",
  "time": "2026-10-28T17:20:00Z",
  "data": {
    "order_id": "ord_01H8X",
    "user_id": "usr_9921",
    "amount": 149.50,
    "currency": "USD",
    "fencing_token": 1048
  }
}
```

---

## 3. Idempotent Consumer Implementation

Because networks guarantee **At-Least-Once Delivery**, consumers must defend against duplicate event delivery. Consumers implement the Deduplication Table Pattern:

```sql
CREATE TABLE processed_events (
    event_id VARCHAR(128) PRIMARY KEY,
    consumer_group VARCHAR(64) NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Consumer Execution Logic
```typescript
export async function handleIntegrationEvent(event: CloudEvent) {
  const queryRunner = db.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    // 1. Attempt to insert event record atomically
    const insertResult = await queryRunner.query(
      `INSERT INTO processed_events (event_id, consumer_group) 
       VALUES ($1, $2) 
       ON CONFLICT (event_id) DO NOTHING RETURNING event_id`,
      [event.id, "fulfillment-worker"]
    );

    // If no row was inserted, this event was already processed
    if (insertResult.length === 0) {
      console.warn(`[IDEMPOTENT] Duplicate event detected: ${event.id}. Acknowledging.`);
      await queryRunner.rollbackTransaction();
      return; // Safe ACK without duplicate execution
    }

    // 2. Execute business mutation
    await processOrderFulfillment(event.data, queryRunner);

    // 3. Commit transaction
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error; // Re-throw to trigger consumer backoff retry
  } finally {
    await queryRunner.release();
  }
}
```

---

## 4. Retry Policy with Exponential Backoff & Full Jitter

When a downstream consumer fails due to an intermittent database timeout or network disruption, retries must not execute in synchronized lock-step (thundering retry storm).

### Full Jitter Algorithm (AWS Architecture Formula)
$$T_{\text{sleep}} = \text{random}\left(0, \min(M_{\text{max}}, B \times 2^{\text{attempt}})\right)$$

Where:
- $B = 0.5\text{ seconds}$ (Base backoff duration).
- $M_{\text{max}} = 30\text{ seconds}$ (Maximum backoff ceiling).
- $\text{attempt} \in [1, 5]$.

---

## 5. Dead Letter Queue (DLQ) & Poison Pill Isolation

```
[Topic: orders.events]
          |
          v
   [Active Consumer] ----(Fails 5 Consecutive Attempts)----> [Topic: orders.events.DLQ]
          |                                                               |
    (Processes OK)                                                        v
          |                                                 [Alert Ops / Human Triage]
          v
       [ACK]
```

1. **Poison Pill Threshold**: After 5 unhandled failures, the message is removed from the active queue and routed to the Dead Letter Queue (`orders.events.DLQ`).
2. **DLQ Diagnostic Headers**:
   - `x-exception-message`: Detailed error stack trace.
   - `x-original-topic`: `orders.events`
   - `x-retry-count`: 5
   - `x-failed-timestamp`: UTC timestamp of final failure.
3. **Replay Mechanism**: A dedicated CLI tool (`scripts/replay-dlq.js`) allows operators to re-inject remediated messages into the primary topic.

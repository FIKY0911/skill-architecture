# Asynchronous Message Queues and Streaming Reference Specification

## Standard: Distributed Message Brokers, Partition Ordering, and Reliable Ingestion
This document establishes the authoritative system design standard for asynchronous message queuing within `architect-skill`. It compares Apache Kafka, RabbitMQ, and AWS SQS, formalizes partition ordering guarantees, defines delivery semantics, specifies Dead-Letter Queue (DLQ) retry topologies with full jitter, and details consumer backpressure controls.

---

## 1. Engine Comparison: Kafka vs RabbitMQ vs AWS SQS

Selecting the appropriate asynchronous messaging engine requires evaluating architectural guarantees across storage models, routing capabilities, and delivery semantics:

| Dimension | Apache Kafka | RabbitMQ | AWS SQS |
|---|---|---|---|
| **Architecture Model** | Distributed Append-Only Commit Log | Smart Broker / Dumb Consumer (AMQP) | Managed Cloud Distributed Queue |
| **Storage Paradigm** | Persistent disk segments; retained by time or size (e.g. 7 days) | In-memory with transient disk paging; deleted upon consumer ACK | Ephemeral storage; retention 1 minute to 14 days |
| **Message Ordering** | Strictly ordered per partition; unordered across partitions | Strictly FIFO per queue under single consumer; non-FIFO under multiple workers | Standard: Non-ordered<br>FIFO: Ordered per `MessageGroupId` |
| **Routing Flexibility** | Topic-based; filtering via consumer logic or Kafka Streams | High: Exchanges (Direct, Fanout, Topic, Headers) with binding keys | Basic: Topic fanout via AWS SNS; queue subscriptions |
| **Throughput Ceiling** | Ultra-high: 1,000,000+ msgs/sec via sequential disk IO and zero-copy | Moderate: 50,000 to 100,000 msgs/sec per node cluster | High: Virtually unlimited auto-scaled throughput |
| **Consumer Replay** | Native: Consumers rewind offset pointers to reprocess historical stream | Unsupported: Once acknowledged, messages vanish from broker | Unsupported: Messages deleted after explicit `DeleteMessage` |
| **Ideal Fit** | Event sourcing, metrics streaming, large-scale data pipelines | Complex transactional routing, low-latency microservice RPC | Cloud-native serverless apps, background worker tasks |

---

## 2. Partition Ordering Mechanics in Apache Kafka

Apache Kafka achieves horizontal scalability through topic partitioning. While total global ordering across an entire topic is physically impossible at scale without serializing execution, Kafka guarantees strict order within a single partition.

```
Producer Record: { Key: "cust-901", Value: {...} }
         |
         v
+-------------------------------------------------------------+
| MurmurHash2 Partition Calculation Engine                    |
| partition = MurmurHash2(Key) % TotalPartitions              |
+-------------------------------------------------------------+
         |
         +--------------------+--------------------+
         |                    |                    |
         v                    v                    v
  [ Partition 0 ]      [ Partition 1 ]      [ Partition 2 ]
  (cust-440, ...)      (cust-901, ...)      (cust-102, ...)
         |                    |                    |
         v                    v                    v
  [ Consumer Worker A] [ Consumer Worker B] [ Consumer Worker C]
```

### 2.1 The Partition Key Invariant
All messages requiring strict causal ordering must share the identical partition key (e.g., `account_id`, `order_id`). The producer hashes the key using `MurmurHash2` and assigns it to a deterministic partition:
$$\text{Partition ID} = \text{abs}(\text{MurmurHash2}(\text{Key})) \pmod{\text{NumPartitions}}$$

### 2.2 Consumer Group Rebalance Discipline
When consumer instances join or leave a consumer group, Kafka triggers a partition rebalance:
- Eager Rebalancing (Legacy): Consumers stop processing, revoke all partitions, and re-join, creating processing pauses.
- Cooperative Sticky Rebalancing (Modern): Consumers reassign only migrating partitions while continuing to consume unaffected partitions without stopping the world.

---

## 3. Delivery Semantics and Exactly-Once Processing

Distributed message channels operate under one of three delivery paradigms:

### 3.1 At-Most-Once Delivery
- Implementation: Consumer commits offset or acknowledges message before executing business logic.
- Risk: If consumer crashes during processing, the message is lost forever.
- Acceptable For: High-frequency telemetry metrics where occasional sample loss is negligible.

### 3.2 At-Least-Once Delivery (Industry Standard)
- Implementation: Consumer acknowledges message only after the local business transaction commits successfully.
- Risk: Network failures during acknowledgment cause the broker to redeliver the message, producing duplicates.
- Requirement: Consumer must implement idempotent execution backed by message deduplication tables.

### 3.3 Exactly-Once Semantics (EOS)
Kafka supports end-to-end transactional processing across `Read -> Process -> Write` pipelines using:
1. Transactional Producer: Assigns a unique `transactional.id` to track state across restarts.
2. Two-Phase Commit Coordinator: Commits output messages and consumer offsets atomically.
3. Isolation Level: Downstream consumers set `isolation.level = read_committed`, filtering out aborted transaction messages.

---

## 4. Dead-Letter Queue (DLQ) Topology and Exponential Backoff

Unchecked message failures cause poison pill locks that block consumer progress. A resilient ingestion pipeline requires an automated retry topology with Dead-Letter Queue quarantine:

```
[Main Ingestion Topic / Queue]
              |
              v
     [Consumer Execution]
              |
      +-------+-------+
      |               |
  [Success]       [Failure]
      |               |
    [ACK]             v
          [Attempt Count < Threshold?]
              |               |
          (Yes)              (No)
              |               |
              v               v
     [Retry Queue with]    [Dead-Letter Queue (DLQ)]
     [Exponential Jitter]  [Quarantined for Audit & Alert]
```

### 4.1 Exponential Backoff with Full Jitter Formula
Retrying at rigid intervals causes synchronized retry spikes that overwhelm downstream databases. Use exponential backoff with full jitter:
$$T_{\text{sleep}} = \text{random}\left(0, \min(M_{\text{max}}, B \times 2^{\text{attempt}})\right)$$
Where:
- $B$: Base backoff duration (e.g., 500 ms).
- $\text{attempt}$: Current retry count (1, 2, 3...).
- $M_{\text{max}}$: Upper ceiling cap (e.g., 30,000 ms).
- $\text{random}(0, X)$: Uniform random distribution between 0 and $X$.

### 4.2 DLQ Quarantine Metadata Standards
When maximum retries (e.g., 5 attempts) are exhausted, the message is routed to the DLQ with standardized diagnostic headers:
- `x-original-topic`: Name of the source message topic.
- `x-exception-message`: Exact error message emitted by consumer.
- `x-exception-stacktrace`: Truncated stack trace for developer inspection.
- `x-failure-timestamp`: ISO 8601 UTC timestamp of terminal failure.
- `x-retry-count`: Final retry attempt number before quarantine.

---

## 5. Consumer Backpressure and Resource Protection

When producers emit messages faster than consumers can process them, unmanaged consumers run out of memory or experience socket timeouts.

### Backpressure Control Mechanisms
1. Prefetch Sizing (RabbitMQ):
   - Set `basic.qos(prefetch_count = 50)` to restrict unacknowledged in-flight messages per worker.
   - Prevents a single worker from buffering thousands of messages into local memory while peer workers sit idle.
2. Polling Limits (Kafka):
   - Configure `max.poll.records = 100` to limit batch size per consumer poll.
   - Configure `max.poll.interval.ms = 300000` (5 minutes) to ensure workers process batches before Kafka assumes the consumer has crashed and initiates a group rebalance.
3. Reactive Streams & Bounded Buffers:
   - Node.js streams or RxJS operators enforce backpressure by pausing upstream reads when internal processing queues reach high-water marks.

---

## 6. Architectural Verification Checklist
When verifying asynchronous message queue implementations:
- [ ] Related messages requiring strict sequence order specify consistent partition keys.
- [ ] Consumers implement idempotent execution to safely tolerate At-Least-Once redeliveries.
- [ ] Transient error retries employ exponential backoff with full jitter.
- [ ] Unrecoverable poison pill messages route to a DLQ containing structured error headers.
- [ ] Consumer prefetch limits prevent unbounded memory buffering and ensure responsive health checks.

# Relational Database Scaling Reference Specification

## Standard: High-Throughput RDBMS Scaling, Partitioning, and Zero-Downtime Migrations
This document establishes the authoritative system design standard for scaling Relational Database Management Systems (specifically PostgreSQL) within `architect-skill`. It formalizes read-write splitting, replication lag mitigation, connection pooling mathematics, indexing optimization, table partitioning versus sharding, and zero-downtime schema evolution.

---

## 1. Read/Write Splitting and Replication Lag Mitigation

To scale read-heavy applications, write traffic is isolated to a Primary master node while read queries are load-balanced across multiple asynchronous Streaming Read Replicas.

```
                           +------------------------+
                           | Application API Layer  |
                           +-----------+------------+
                                       |
                   +-------------------+-------------------+
                   | (Write Mutations)                     | (Read Queries)
                   v                                       v
         +-------------------+                   +-------------------+
         | Primary (Master)  |                   | Read Routing Proxy|
         +---------+---------+                   +----+---------+----+
                   |                                  |         |
                   | Streaming Replication            v         v
                   | (WAL Stream)                +-------+   +-------+
                   +---------------------------->|Replica|   |Replica|
                                                 | Node 1|   | Node 2|
                                                 +-------+   +-------+
```

### The Replication Lag Inconsistency Problem
Asynchronous streaming replication introduces a temporal lag ($\Delta t$) between master commits and replica state updates. This causes immediate read-your-own-writes anomalies: a user posts a comment, the browser redirects and queries a lagging replica, and the user's comment appears missing.

### Mitigation Strategies

#### Strategy 1: Session Stickiness (Time-Based Window)
When an authenticated session executes a mutating write operation (`INSERT`, `UPDATE`, `DELETE`), the application sets a session cookie or local cache flag routing all subsequent reads for that user strictly to the Primary master node for $N$ seconds (typically 3 to 5 seconds):

```typescript
export async function getDbConnection(userId: string, isWrite: boolean): Promise<DbClient> {
  if (isWrite) {
    await markUserAsWriter(userId, 5); // 5-second stickiness
    return primaryPool.getConnection();
  }

  const hasRecentWrite = await checkRecentWriter(userId);
  if (hasRecentWrite) {
    return primaryPool.getConnection(); // Fallback to primary to avoid lag
  }

  return replicaPool.getRandomConnection();
}
```

#### Strategy 2: Log Sequence Number (LSN) Verification
PostgreSQL provides explicit transaction commit coordinates via the Log Sequence Number (LSN):
1. Upon write commit, primary returns current LSN: `SELECT pg_current_wal_lsn();` (e.g., `16/B374D848`).
2. Downstream read checks if replica has replayed that LSN: `SELECT pg_last_wal_replay_lsn();`
3. If replica LSN is behind the write LSN, route query to primary or wait briefly.

---

## 2. Connection Pooling Mechanics and Sizing Formula

Excessive concurrent database connections degrade query latency because of OS thread context switching, memory consumption (approx 10 MB per connection in PostgreSQL), and disk spindle/IOPS contention.

### 2.1 The PostgreSQL / HikariCP Pool Sizing Formula
Empirical performance benchmarking establishes the optimal pool size formula:
$$\text{Pool Size} = (2 \times \text{CPU Cores}) + \text{Effective Spindle Count}$$
- Example: A database server with 8 CPU cores and an enterprise NVMe SSD array (effective spindle count = 1) yields an optimal pool size of $(2 \times 8) + 1 = 17$ active connections.
- Increasing connections beyond this threshold degrades throughput due to CPU context switching overhead.

### 2.2 PgBouncer Connection Pooling Modes

| Mode | Connection Lifecycle | Multi-Statement Transactions | Memory Footprint | Recommended Use Case |
|---|---|---|---|---|
| **Session Pooling** | Dedicated physical connection allocated until client explicitly disconnects | Fully supported | High (1 connection per client) | Legacy applications, long-lived client tools |
| **Transaction Pooling** | Connection assigned to client only for duration of single transaction (`BEGIN` to `COMMIT`) | Fully supported | Minimal (shares 20 DB connections across 2,000 clients) | **Default choice for modern web and API microservices** |
| **Statement Pooling** | Connection returned immediately after each individual SQL statement executes | Forbidden (breaks multi-statement transactions) | Ultra-low | Simple analytics, read-only audit loggers |

---

## 3. High-Performance Indexing Strategies

### 3.1 Partial Indexes
Index only a relevant subset of rows to save disk storage and accelerate write speeds:
```sql
-- Indexes only active subscriptions, skipping millions of expired historical records
CREATE INDEX idx_active_subscriptions 
ON subscriptions (user_id) 
WHERE status = 'ACTIVE';
```

### 3.2 Covering Indexes (`INCLUDE` Clause)
Enables Index-Only Scans by storing payload columns in leaf nodes without adding them to search tree keys:
```sql
-- Eliminates table heap lookup when retrieving email by organization
CREATE INDEX idx_org_users 
ON users (org_id) 
INCLUDE (email, display_name);
```

### 3.3 Specialized Index Types
- B-Tree: Default. Optimal for equality (`=`) and range queries (`<`, `<=`, `>`, `>=`, `BETWEEN`).
- GIN (Generalized Inverted Index): Essential for querying inside `JSONB` documents and full-text search columns.
- GiST (Generalized Search Tree): Essential for geospatial coordinates (PostGIS) and range types (`daterange`, `tstzrange`).

---

## 4. Declarative Partitioning vs Horizontal Sharding

```
+-------------------------------------------------------------------------+
| DECLARATIVE PARTITIONING (Single Node / Shared Storage)                 |
|                                                                         |
|                     [ Parent Table: audit_logs ]                        |
|                                  |                                      |
|         +------------------------+------------------------+             |
|         |                        |                        |             |
|         v                        v                        v             |
|  [ Partition: 2026_Q1 ]   [ Partition: 2026_Q2 ]   [ Partition: 2026_Q3 ]|
|  (Range: Jan-Mar 2026)    (Range: Apr-Jun 2026)    (Range: Jul-Sep 2026) |
+-------------------------------------------------------------------------+

+-------------------------------------------------------------------------+
| HORIZONTAL SHARDING (Distributed Multi-Node Architecture)               |
|                                                                         |
|                          [ Client Application ]                         |
|                                    |                                    |
|                   +----------------+----------------+                   |
|                   | Consistent Hash Ring Routing    |                   |
|                   v                                 v                   |
|        [ Shard 1: Nodes A-F ]             [ Shard 2: Nodes G-Z ]        |
|        (Tenant ID: Hash 0-50%)            (Tenant ID: Hash 51-100%)     |
+-------------------------------------------------------------------------+
```

### 4.1 PostgreSQL Declarative Partitioning
- Range Partitioning: Partitions data by timestamp ranges or numeric sequences.
- Partition Pruning: The query planner skips scanning partitions whose constraints exclude target query predicates:
  ```sql
  CREATE TABLE audit_logs (
      id UUID NOT NULL,
      event_time TIMESTAMPTZ NOT NULL,
      payload JSONB
  ) PARTITION BY RANGE (event_time);

  CREATE TABLE audit_logs_2026_q1 PARTITION OF audit_logs
      FOR VALUES FROM ('2026-01-01 00:00:00Z') TO ('2026-04-01 00:00:00Z');
  ```

### 4.2 Horizontal Sharding Across Nodes
- Mechanism: Distributes data across physically separated database servers using a shard key (e.g., `tenant_id` or `user_id`).
- Challenges: Cross-shard joins require distributed scatter-gather queries; distributed ACID transactions require Two-Phase Commit (2PC) or Saga patterns, introducing latency penalties.

---

## 5. Zero-Downtime Database Migrations

Schema alterations on multi-gigabyte tables must never acquire exclusive table locks (`ACCESS EXCLUSIVE`) that block ongoing production transactions.

### 5.1 Safe DDL Operations in PostgreSQL
1. Non-Blocking Index Creation:
   - Prohibited: `CREATE INDEX idx_users_email ON users(email);` (locks entire table).
   - Mandatory: `CREATE INDEX CONCURRENTLY idx_users_email ON users(email);`
2. Adding Columns with Default Values:
   - PostgreSQL 11+ stores defaults in catalog metadata without rewriting the physical table heap:
     `ALTER TABLE orders ADD COLUMN loyalty_points INT NOT NULL DEFAULT 0;` (instant execution).
3. Enforcing Lock Timeouts:
   - Prevent migration scripts from queuing behind long-running queries:
     `SET lock_timeout = '3s';`

### 5.2 The Expand and Contract (Parallel Run) Pattern
Used for breaking schema transformations (e.g., renaming a column or changing a data type) without downtime:

```
Phase 1 (Expand):
- Add new column alongside old column in database.
- Deploy Application v1.1: Reads from old column; dual-writes to both old and new columns.

Phase 2 (Backfill):
- Execute background script to backfill historical data from old column to new column.

Phase 3 (Transition):
- Deploy Application v1.2: Reads from new column; writes to both columns.

Phase 4 (Contract):
- Deploy Application v1.3: Writes solely to new column.
- Drop old column from database schema safely.
```

---

## 6. Architectural Verification Checklist
When verifying RDBMS scaling designs:
- [ ] Read-heavy workloads implement primary/replica splitting with write-after-read consistency guards.
- [ ] Connection pool sizes conform to $(2 \times \text{Cores}) + \text{Spindles}$ rather than arbitrary large numbers.
- [ ] PgBouncer or equivalent connection pooler operates in Transaction Pooling mode for web APIs.
- [ ] All table indexes use partial or covering optimizations where appropriate.
- [ ] Schema migration scripts enforce `lock_timeout` and use `CONCURRENTLY` for index generation.

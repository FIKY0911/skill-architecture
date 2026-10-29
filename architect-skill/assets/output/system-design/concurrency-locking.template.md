# Distributed Locking & Concurrency Specification: {{PROJECT_NAME}}

> **Target Environment**: Distributed Workload over PostgreSQL 16 & Redis 7  
> **Theoretical Basis**: Martin Kleppmann's "How to do distributed locking" with Monotonically Increasing Fencing Tokens

---

## 1. Concurrency Risks & The Distributed Lock Dilemma

In an asynchronous distributed environment subject to network partitions, non-synchronized system clocks, and OS-level Stop-The-World Garbage Collection (GC) pauses, standard mutual exclusion locks (such as naive Redis `SETNX` or raw Redlock) cannot guarantee storage safety on their own.

### The Stale Client Write Anomaly
```
Client 1 acquires Lock (TTL = 10s).
Client 1 encounters a 15-second GC pause.
Lock TTL expires in Redis.
Client 2 acquires Lock, increments version, and writes to DB (Token: 102).
Client 1 wakes up, unaware its lock expired, and writes stale state to DB!
Result: Silent data corruption and phantom overwrite.
```

---

## 2. Kleppmann Monotonic Fencing Token Solution

To prevent stale clients from corrupting persistent state, every distributed lock acquisition must issue a **strictly monotonically increasing integer fencing token**. The underlying storage engine (PostgreSQL) is the ultimate arbiter of safety.

```
+----------+             +--------------+             +-----------------------+
| Client 1 |             | Lock Service |             | Storage Layer (RDBMS) |
+----+-----+             +------+-------+             +-----------+-----------+
     |                          |                                 |
     | Acquire Lock             |                                 |
     +------------------------->| Token 101 Issued                |
     |                          +-------------------------------->|
     | (Enters 15s GC Pause)    |                                 |
     |                          |                                 |
     |                +---------+----------+                      |
     |                | Client 2 Acquires  |                      |
     |                | Token 102 Issued   |                      |
     |                +---------+----------+                      |
     |                          |                                 |
     |                          | Client 2 Writes (Token 102)     |
     |                          +-------------------------------->|
     |                          |                                 | Accepted: 102 > 0
     |                          |                                 |
     | Client 1 Wakes Up        |                                 |
     | Client 1 Writes (Token 101)                                |
     +----------------------------------------------------------->|
                                                                  | REJECTED:
                                                                  | 101 <= 102!
```

---

## 3. Storage Layer Enforcement (PostgreSQL)

Every concurrent mutable entity table includes a `last_fencing_token` column. Mutations enforce conditional validation:

```sql
-- PostgreSQL Transaction with Fencing Token Verification
BEGIN;

UPDATE orders
SET 
    status = 'PROCESSING',
    total_amount = :newAmount,
    last_fencing_token = :incomingFencingToken,
    updated_at = NOW()
WHERE 
    id = :orderId 
    AND last_fencing_token < :incomingFencingToken;

-- Inspect row count returned
-- If rowCount == 0, the transaction must be ABORTED
COMMIT;
```

---

## 4. Redis Lua Script for Atomic Lock & Token Generation

```lua
-- acquire_lock_with_fencing.lua
-- KEYS[1]: Lock Key (e.g. "lock:order:ord_01H8X")
-- KEYS[2]: Token Sequence Generator Key (e.g. "seq:order:ord_01H8X")
-- ARGV[1]: Lock Owner Identifier (UUID)
-- ARGV[2]: Lock TTL in Milliseconds (e.g. 10000)

local lockKey = KEYS[1]
local seqKey = KEYS[2]
local owner = ARGV[1]
local ttl = tonumber(ARGV[2])

if redis.call('SET', lockKey, owner, 'NX', 'PX', ttl) then
    local token = redis.call('INCR', seqKey)
    return { 1, token } -- Lock acquired successfully with monotonic token
else
    return { 0, 0 } -- Failed to acquire lock (already held)
end
```

### Safe Release Lua Script
```lua
-- release_lock.lua
-- KEYS[1]: Lock Key
-- ARGV[1]: Lock Owner Identifier (UUID)

if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('DEL', KEYS[1])
else
    return 0 -- Prevent releasing a lock acquired by another client after expiry
end
```

---

## 5. Alternative: PostgreSQL Transactional Advisory Locks

When operations are confined strictly to a single PostgreSQL database instance, Transactional Advisory Locks eliminate the need for an external Redis lock service:

```sql
-- Advisory XAct Lock automatically releases upon COMMIT or ROLLBACK
BEGIN;

-- Hashes entity UUID into 64-bit integer
SELECT pg_advisory_xact_lock(hashtext('order:' || :orderId));

-- Execute critical section operations safely
UPDATE inventory 
SET stock = stock - :quantity 
WHERE product_id = :productId;

INSERT INTO orders (id, status) VALUES (:orderId, 'CONFIRMED');

COMMIT; -- Lock released immediately
```

---

## 6. Deadlock Prevention & Timeouts

1. **Deterministic Resource Ordering**: When acquiring locks on multiple resources simultaneously, services must sort resource IDs lexicographically to prevent circular wait deadlocks.
2. **Strict Lock Leases**: Maximum lock lease duration is capped at $10\text{ seconds}$. Background heartbeat renewals are permitted up to an absolute maximum of $60\text{ seconds}$.
3. **Acquisition Timeout**: Callers abort lock acquisition attempts after $2,000\text{ ms}$, returning HTTP 409 Conflict with an exponential backoff header (`Retry-After: 1`).

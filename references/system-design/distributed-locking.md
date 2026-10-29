# Distributed Locking and Fencing Tokens Reference Specification

## Standard: Martin Kleppmann Analysis vs Salvatore Sanfilippo Redlock
This document establishes the authoritative engineering standard for distributed locking mechanisms within `architect-skill`. It formalizes the safety invariants of distributed mutual exclusion, details the Redlock algorithm and its limitations under asynchronous physical environments, and mandates strictly monotonic fencing tokens for storage integrity.

---

## 1. Safety Invariants of Distributed Mutual Exclusion

A distributed lock must guarantee two fundamental properties across independent network nodes:
1. Safety (Mutual Exclusion): At any given instant $t$, at most one process can hold the lock for a specific resource identifier.
2. Liveness (Deadlock Freedom): If a process holding a lock crashes or becomes partitioned from the cluster, the lock must eventually be released or expire, allowing other processes to make forward progress.

---

## 2. The Redlock Algorithm

Proposed by Salvatore Sanfilippo, Redlock provides distributed locking across an odd number $N$ (typically 5) of independent Redis master nodes that share zero replication links.

### Acquisition Protocol
1. Client records its current local epoch timestamp $T_1$.
2. Client attempts to acquire the lock sequentially across all $N$ nodes using identical key and random value with an explicit TTL:
   `SET resource_name my_random_value NX PX 10000`
3. Client records completion timestamp $T_2$. The elapsed time is $\Delta = T_2 - T_1$.
4. Client considers the lock successfully acquired if and only if:
   - The lock was granted by a majority quorum of nodes (at least $\lfloor N/2 \rfloor + 1$, e.g., 3 out of 5).
   - The total elapsed time $\Delta$ is strictly less than the lock validity TTL.
5. The remaining validity duration is calculated as:
   $$\text{Validity Time} = \text{TTL} - (\Delta + \text{Clock Drift})$$
6. If the client fails to acquire the majority quorum or if validity time is non-positive, it must immediately send an unlock Lua script to all $N$ nodes to release partial locks.

```lua
-- Safe Atomic Release Lua Script
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
```

---

## 3. The Martin Kleppmann Critique: Asynchronous Realities

In his critique *How to do distributed locking*, distributed systems researcher Martin Kleppmann proved that Redlock cannot guarantee mutual exclusion for storage safety in asynchronous networks subject to:
- Stop-The-World (STW) Garbage Collection pauses or process freezes.
- Physical clock drift and NTP step jumps.
- Asynchronous network delays and socket buffer stalling.

### The Fatal GC Pause Failure Sequence

```
Client 1                        Redis Cluster                  Shared Storage
   |                                  |                               |
   |---(1. Acquires Lock TTL=10s)---->|                               |
   |<--(2. Lock Granted: OK)----------|                               |
   |                                  |                               |
   | [STW Garbage Collection Pause]   |                               |
   | [Client 1 frozen for 15 seconds] |                               |
   |                                  |                               |
   |                                  | (TTL expires in Redis)        |
   |                                  |                               |
   |                 Client 2         |                               |
   |                    |--(3. Acquires Lock TTL=10s)                 |
   |                    |<-(4. Lock Granted: OK)                      |
   |                    |                                             |
   |                    |---(5. Writes Data Safely)------------------>| (State: v2)
   |                                                                  |
   | [Client 1 unfreezes]                                             |
   | (Assumes lock is still valid!)                                   |
   |---(6. Corrupting Write!)---------------------------------------->| (OVERWRITES v2!)
```

### Why Timeouts Fail to Protect State
A process cannot know how long it was paused while frozen. By the time Client 1 unpauses and issues its write request to storage, its lock lease has long expired, but its thread execution context remains unaware.

---

## 4. Mandatory Fencing Tokens (Storage Validation Layer)

To guarantee mutual exclusion in the presence of pauses and clock drift, the distributed lock manager must issue a strictly monotonically increasing fencing token upon every successful acquisition.

```
Lock Service                      Client                     Storage Layer (DB / S3)
     |                              |                                  |
     |<--(1. Acquire Lock)----------|                                  |
     |---(2. Granted: Token = 101)->|                                  |
     |                              |                                  |
     |                   [Client Frozen by Pause]                      |
     |                                                                 |
     |<--(3. Client 2 Acquires)-----| (Client 2)                       |
     |---(4. Granted: Token = 102)->|                                  |
     |                              |---(5. Write with Token 102)----->| (Accepted: 102 > 0)
     |                              |                                  |
     |                   [Client 1 Unfreezes]                          |
     |                              |---(6. Write with Token 101)----->| [REJECTED: 101 < 102]
     |                              |<--(7. Error: Stale Fencing Token)|
```

### Storage-Layer Verification Invariant
The storage engine must enforce a conditional write check validating that the incoming transaction possesses a higher fencing token than the last recorded token:

```sql
-- PostgreSQL Storage Layer Conditional Check
UPDATE bank_accounts
SET 
    balance = balance - 100.00,
    last_fencing_token = $fencing_token,
    updated_at = NOW()
WHERE 
    account_id = $account_id
    AND last_fencing_token < $fencing_token; -- Rejects stale writes atomically
```

If zero rows are updated, the application detects that a concurrent process with a newer fencing token has superseded its lock, preventing split-brain data corruption.

---

## 5. Lease Renewal and Heartbeat Watchdogs

When long-running batch jobs or compute tasks exceed initial lock TTL estimates, the lock holder must employ an automated background heartbeat watchdog:

1. Initial Acquisition: Client acquires lock with moderate TTL (e.g., 10 seconds).
2. Background Heartbeat Thread: A dedicated timer fires every $\text{TTL}/3$ (e.g., every 3.3 seconds).
3. Renewal Command: The watchdog executes a Lua script extending the key expiration:
   `if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("pexpire", KEYS[1], ARGV[2]) else return 0 end`
4. Failure Handling: If the client process crashes, the watchdog stops executing, and Redis automatically evicts the expired lock after 10 seconds, restoring liveness.

---

## 6. Distributed Lock Architecture Alternatives

| Technology | Coordination Mechanism | Fencing Token Support | Operational Overhead | Best Use Case |
|---|---|---|---|---|
| **Redis (Single / Redlock)** | In-memory key with TTL + Lua | Supported via atomic `INCR` counter | Low | High-throughput web locks, ephemeral tasks |
| **PostgreSQL Advisory Locks** | Internal engine transaction locks (`pg_advisory_xact_lock`) | Built-in ACID transaction ordering | Zero (if PG is already primary DB) | Relational workflows, scheduled cron synchronization |
| **etcd / ZooKeeper** | Raft / Zab consensus with sequential ephemeral znodes | Native continuous 64-bit `zxid` / Raft revision | Moderate to High | Critical cluster leader election, service discovery |

---

## 7. Architectural Verification Checklist
When verifying distributed locking implementations:
- [ ] Lock acquisition and release are atomic operations utilizing randomized values and Lua scripts.
- [ ] Every acquired lock returns a strictly monotonically increasing fencing token.
- [ ] Downstream storage writes conditionally verify that the incoming fencing token exceeds the stored watermark.
- [ ] Long-running operations deploy automated watchdog heartbeats running at one-third of the lock TTL.
- [ ] Clock skew and STW garbage collection scenarios are documented in the system threat analysis.

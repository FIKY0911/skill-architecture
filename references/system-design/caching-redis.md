# Redis Distributed Caching Reference Specification

## Standard: High-Scale In-Memory Caching and Stampede Mitigation
This document establishes the authoritative system design standard for distributed caching using Redis within `architect-skill`. It covers caching topologies, eviction dynamics, TTL jitter mathematics, cache stampede mitigation (probabilistic early expiration via XFetch), cache penetration defenses with Bloom filters, and persistence trade-offs.

---

## 1. Caching Topologies and Write Patterns

Distributed caches decouple high-throughput read workloads from persistent relational and document storage. Four primary caching topologies govern data flow:

```
+-------------------------------------------------------------------------+
| CACHE-ASIDE (LAZY LOADING)                                              |
|                                                                         |
|  [Application] --(1. Read Key)-------------------------> [Redis Cache]  |
|         |                                                       |       |
|         | (Miss)                                                | (Hit) |
|         v                                                       v       |
|  [Database] <---(2. Query Row)                                [Return]  |
|         |                                                               |
|         +------(3. Populate Key with TTL)-------------> [Redis Cache]   |
+-------------------------------------------------------------------------+

+-------------------------------------------------------------------------+
| WRITE-THROUGH / WRITE-BEHIND                                            |
|                                                                         |
|  [Application] --(Write Data)--------------------------> [Cache Plugin] |
|                                                                 |       |
|  Write-Through: Synchronous write to DB before ACK             |       |
|  Write-Behind:  Batched asynchronous queue write to DB          v       |
|                                                            [Database]   |
+-------------------------------------------------------------------------+
```

### 1.1 Cache-Aside (Lazy Loading)
- Execution Flow: Application queries Redis first. If key exists (Hit), data is returned immediately. If absent (Miss), application queries the primary database, populates Redis with an explicit TTL, and returns the result.
- Advantages: Cache memory stores only requested data; node failure does not halt writes.
- Trade-offs: Cache miss incurs three network round-trips; data can become stale if updates bypass the cache.

### 1.2 Read-Through and Write-Through
- Read-Through: Application treats the cache as the main data store. The cache layer automatically loads missing data from the database transparently.
- Write-Through: When the application updates an entity, it writes to the cache. The cache synchronously writes the updated record to the database before returning an acknowledgment.
- Advantages: Eliminates stale reads; application code remains decoupled from data persistence logic.
- Trade-offs: Higher write latency due to synchronous two-tier writes.

### 1.3 Write-Behind (Write-Back)
- Execution Flow: Application writes directly to the cache, which acknowledges immediately. An asynchronous worker or queue flushes modified dirty keys to the persistent database in batches.
- Advantages: Extreme write throughput; absorbs write bursts.
- Trade-offs: Risk of permanent data loss if Redis crashes before dirty records are persisted to disk.

---

## 2. Eviction Policies and Memory Management

When Redis memory reaches `maxmemory`, keys are evicted according to configured eviction algorithms:

| Eviction Policy | Algorithmic Mechanism | Ideal Workload | Risk / Trade-off |
|---|---|---|---|
| `allkeys-lru` | Evicts least recently used keys across all keys | General-purpose read cache | Evicts permanent non-expiring configuration keys |
| `volatile-lru` | Evicts least recently used keys among keys with an expiration TTL | Mixed cache and ephemeral session stores | Returns OOM error if no keys have TTL set |
| `allkeys-lfu` | Evicts least frequently used keys (tracks access frequency via logarithmic counters) | Long-tail popularity distributions (Zipfian) | Newly created popular keys risk early eviction before counters increment |
| `volatile-lfu` | Evicts least frequently used keys with TTL | Ephemeral caching with frequency weighting | Requires deliberate TTL management on all cached entities |
| `volatile-ttl` | Evicts keys with the shortest remaining Time-To-Live | Time-sensitive expiring tokens | Suboptimal cache hit ratio compared to LRU |
| `noeviction` | Evicts zero keys; returns memory error on write commands (`SET`, `HSET`, `LPUSH`) | Redis used as an in-memory primary database | Halts application write operations under load |

---

## 3. TTL Jitter and Stampede Mitigation

### 3.1 The Synchronized Expiration Problem
When a batch of entities is populated into Redis simultaneously with identical TTLs (e.g., `TTL = 3600`), all keys expire at the exact same second. When this occurs, hundreds of concurrent requests experience cache misses simultaneously, slamming the primary database in a Thundering Herd event.

### 3.2 TTL Jitter Formula
Every cache write must inject uniform pseudorandom jitter:
$$\text{TTL}_{\text{actual}} = \text{TTL}_{\text{base}} + \text{rand}(0, \Delta_{\text{jitter}})$$
Where $\text{TTL}_{\text{base}}$ is the target duration and $\Delta_{\text{jitter}}$ is typically between $10\%$ and $25\%$ of the base TTL.

### 3.3 Probabilistic Early Expiration (The XFetch Algorithm)
Formulated by Vattani, Chierichetti, and Lowenstein, XFetch recalculates and refreshes cached values probabilistically before expiration, ensuring hot keys are always populated.

```
Condition to trigger background recomputation:
Delta * Beta * (-ln(rand())) > TTL_remaining

Where:
- Delta: Time taken to compute the value from the database (in seconds)
- Beta: Constant factor > 0 (standard: Beta = 1.0; higher values increase aggressiveness)
- rand(): Uniform random floating-point value in the interval (0, 1]
- TTL_remaining: Seconds remaining before Redis expires the key
```

```typescript
// Production XFetch Implementation
export interface CacheEntry<T> {
  value: T;
  delta: number;      // Duration of DB computation in milliseconds
  expiry: number;     // Absolute epoch timestamp in milliseconds
}

export async function xfetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number,
  beta: number = 1.0
): Promise<T> {
  const cached = await redis.get(key);
  const now = Date.now();

  if (cached) {
    const entry: CacheEntry<T> = JSON.parse(cached);
    const ttlRemaining = entry.expiry - now;

    // Probabilistic early expiration condition
    const shouldRefreshEarly = (entry.delta * beta * -Math.log(Math.random())) > ttlRemaining;

    if (!shouldRefreshEarly && ttlRemaining > 0) {
      return entry.value;
    }

    // Refresh asynchronously in background while serving current value
    refreshInBackground(key, fetchFn, ttlSeconds);
    return entry.value;
  }

  // Cold cache miss: compute synchronously
  const startTime = Date.now();
  const value = await fetchFn();
  const delta = Date.now() - startTime;
  const expiry = now + ttlSeconds * 1000;

  const entry: CacheEntry<T> = { value, delta, expiry };
  await redis.set(key, JSON.stringify(entry), 'EX', ttlSeconds);
  return value;
}
```

---

## 4. Cache Penetration Defense: Bloom Filters

Cache Penetration occurs when malicious or anomalous queries request non-existent keys (e.g., `id = -9999`). Because the key never exists in Redis or PostgreSQL, every request bypasses the cache and hits the database directly.

### 4.1 Solution Strategy A: Null Value Caching
When a database query returns empty, cache a sentinel value with a short TTL (e.g., 30 to 60 seconds):
`SET entity:user:-9999 "EMPTY_RECORD" EX 60`

### 4.2 Solution Strategy B: Redis Bloom Filter
A Bloom filter is a space-efficient probabilistic data structure that tests whether an element is definitely not in a set or possibly in a set.

```
Key Inbound Request
       |
       v
+-------------------------------+
| Check Redis Bloom Filter      |
+---------------+---------------+
                |
     +----------+----------+
     |                     |
[Not In Filter]      [May Be In Filter]
     |                     |
[Fast Return 404]    [Check Redis Cache]
(Bypasses DB)              |
                           v
                     [Fallback to DB]
```

#### False Positive Probability Formula
Given $m$ bits, $k$ hash functions, and $n$ inserted elements:
$$p \approx \left( 1 - e^{-kn/m} \right)^k$$
Optimal number of hash functions: $k = \frac{m}{n} \ln 2$.

---

## 5. Persistence and High Availability: RDB vs AOF

Redis provides two primary persistence mechanisms:

| Dimension | RDB (Redis Database Snapshot) | AOF (Append-Only File) |
|---|---|---|
| **Mechanism** | Point-in-time point snapshot written to disk at configured intervals (`save 60 10000`). | Continuous append log recording every write command received by the server. |
| **Performance** | Maximum throughput; parent process forks a child process to write disk. Zero disk IO on main thread. | Slight performance overhead due to continuous disk writes (`fsync everysec`). |
| **Recovery Speed** | Extremely fast restart times; data is loaded directly into memory structures. | Slower recovery; requires sequential replay of entire command log. |
| **Data Safety** | Potential loss of several minutes of data if server crashes between snapshots. | Minimal data loss; maximum 1 second data loss under `fsync everysec`. |
| **Recommended Setup** | Combine both: RDB for rapid disaster recovery snapshots; AOF (`everysec`) for minimum data loss durability. | |

---

## 6. Architectural Verification Checklist
When verifying Redis caching architectures:
- [ ] Every cached entity has an explicit TTL assigned; no unbounded cache keys.
- [ ] All TTL allocations apply uniform random jitter to eliminate expiration spikes.
- [ ] High-traffic read keys implement early recomputation (XFetch) or singleflight mutexes.
- [ ] Cache penetration defenses (Bloom filters or null sentinel caching) protect against non-existent key attacks.
- [ ] Memory eviction is explicitly configured to `allkeys-lru` or `allkeys-lfu`.

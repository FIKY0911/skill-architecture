# Caching Architecture & Lifecycle Specification: {{PROJECT_NAME}}

> **Target Cache Engine**: Redis 7.2 (Cluster / Primary-Replica Topology)  
> **Operational Purpose**: Sub-millisecond latency acceleration, database read offloading, and stampede mitigation.

---

## 1. Caching Topology & Infrastructure Sizing

- **Cluster Topology**: Redis Primary-Replica with 3 Shards and automated Sentinel failover.
- **Eviction Policy**: `volatile-lru` (Evicts least recently used keys among those with an explicit TTL set).
- **Max Memory Limit**: $4\text{ GB}$ per node, with warning alerts triggered at $80\%$ allocation.
- **Persistence Configuration**: RDB snapshots every 15 minutes + append-only file (AOF) with `appendfsync everysec`.

---

## 2. Key Namespace Architecture & Serialization

### 2.1 Uniform Key Schema
Keys are structured strictly using hierarchical colon-delimited syntax:
```
{{PROJECT_NAME}}:{tenant_id}:{bounded_context}:{entity_type}:{entity_id}
```
*Example*: `arch:ten_9912:catalog:product:sku_4812a`

### 2.2 Serialization Standard
- **Payload Format**: Compressed JSON or MessagePack binary format.
- **Compression Threshold**: Payloads $> 2\text{ KB}$ are compressed using `snappy` or `zstd` before cache insertion.

---

## 3. Caching Access Patterns & Lifecycles

| Data Entity Type | Caching Pattern | Base TTL | Jitter Window | Invalidation Trigger |
| :--- | :--- | :--- | :--- | :--- |
| **User Session / Auth Claims** | Cache-Aside | $3,600\text{ s}$ (1 hr) | $\pm 300\text{ s}$ | User logout, password change, permission revoke |
| **Product Catalog DTO** | Cache-Aside (XFetch) | $86,400\text{ s}$ (24 hr) | $\pm 3,600\text{ s}$| Admin price or title mutation event |
| **Organization Config** | Read-Through | $43,200\text{ s}$ (12 hr) | $\pm 1,800\text{ s}$| Settings update API invocation |
| **Real-Time Rate Limit Counter**| In-Memory Atomic INCR | $60\text{ s}$ | $0\text{ s}$ (Exact) | Automatic expiration at window boundary |

---

## 4. Stampede & Failure Mitigation Mechanisms

### 4.1 Probabilistic Early Expiration (XFetch Algorithm)
To eliminate the *thundering herd* / *cache stampede* effect where thousands of concurrent requests hit the database simultaneously when a key expires, read operations compute the XFetch decision condition:

$$\Delta \cdot \beta \cdot \ln(\text{random}()) > \text{TTL}_{\text{remaining}}$$

Where:
- $\Delta$: Delta time required to compute/fetch the value from PostgreSQL (in seconds, e.g. $0.05\text{ s}$).
- $\beta$: Aggressiveness constant ($> 0$, default $\beta = 1.0$).
- $\text{random}()$: Uniformly distributed random float in $(0, 1]$.
- $\text{TTL}_{\text{remaining}}$: Seconds remaining before official Redis key expiration.

If the condition evaluates to `true`, the worker kicks off an asynchronous background thread to refresh the cache value, while immediately returning the existing cache record to the caller.

```typescript
// XFetch Implementation Snippet
export async function getWithXFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number,
  beta = 1.0
): Promise<T> {
  const record = await redis.get(key);
  if (record) {
    const { value, delta, expiry } = JSON.parse(record);
    const ttlRemaining = (expiry - Date.now()) / 1000;
    
    // Evaluate XFetch condition for probabilistic early refresh
    if (-delta * beta * Math.log(Math.random()) > ttlRemaining) {
      // Background asynchronous cache refresh without blocking caller
      (async () => {
        const start = Date.now();
        const freshValue = await fetchFn();
        const freshDelta = (Date.now() - start) / 1000;
        await setWithMetadata(key, freshValue, ttlSeconds, freshDelta);
      })().catch(console.error);
    }
    return value;
  }

  // Hard cache miss fallback
  const start = Date.now();
  const freshValue = await fetchFn();
  const delta = (Date.now() - start) / 1000;
  await setWithMetadata(key, freshValue, ttlSeconds, delta);
  return freshValue;
}
```

### 4.2 Cache Penetration Defense (Bloom Filters & Null Caching)
- When a query for a non-existent entity reaches the database, the missing result is written to Redis with a short sentinel record:
  ```json
  { "__sentinel_empty__": true }
  ```
  with an aggressive TTL of $30\text{ seconds}$. This stops malicious bot crawlers from overwhelming the database with random IDs.

### 4.3 Cache Avalanche Defense (TTL Jitter)
- All fixed TTLs have a randomized jitter applied:
  $$\text{TTL}_{\text{effective}} = \text{TTL}_{\text{base}} + \text{rand}(0, \text{JitterDelta})$$
  This prevents large batches of keys initialized at system startup from expiring at the exact same instant.

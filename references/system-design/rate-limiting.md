# Rate Limiting and Traffic Shaping Reference Specification

## Standard: Distributed Rate Limiting, Sliding Window Counter, and RFC 6585
This document establishes the authoritative system design standard for API rate limiting and traffic shaping within `architect-skill`. It compares five core rate limiting algorithms, formalizes the sliding window counter mathematical model, provides production atomic Redis Lua script implementations, and specifies standard HTTP response headers.

---

## 1. Algorithmic Comparison: Mechanics and Trade-offs

Rate limiting protects downstream computational infrastructure from cascading saturation, denial-of-service attacks, and brute-force credential stuffing.

| Algorithm | Structural Mechanism | Burst Tolerance | Memory Overhead | Boundary Burst Vulnerability | Production Application |
|---|---|---|---|---|---|
| **Token Bucket** | Tokens refill at fixed rate $r$ up to capacity $C$; requests consume 1 token | High (allows bursts up to capacity $C$) | $O(1)$ per client | None | AWS API Gateway, Stripe API, general REST endpoints |
| **Leaky Bucket** | Requests enter FIFO queue; leak out to processor at constant uniform rate $r$ | Zero (bursts are smoothed into fixed rate) | $O(C)$ queue depth | None | Payment processing, egress webhook dispatchers |
| **Fixed Window** | Counter increments inside rigid time window $[t, t + T]$; resets at boundary | Low | $O(1)$ per client | **High (allows $2 \times$ limit at boundary)** | Simple internal rate limits with low accuracy needs |
| **Sliding Window Log** | Stores exact epoch timestamps in Redis sorted set (`ZSET`); counts timestamps in window | Moderate | $O(N)$ where $N$ is total request count | None | High-security financial transactions, login endpoints |
| **Sliding Window Counter** | Weighted approximation combining previous and current window counts | Controlled | $O(1)$ per client | Low (smooth boundary approximation) | **High-scale multi-tenant enterprise API gateways** |

---

## 2. Mathematical Analysis: Boundary Bursts vs Sliding Windows

### 2.1 The Fixed Window Boundary Flaw
Consider a rate limit of 100 requests per minute with a fixed window from 00:00 to 01:00:
1. A client sends 100 requests at 00:59. All 100 requests are accepted.
2. At 01:00, the window resets.
3. The client sends another 100 requests at 01:01. All 100 requests are accepted.
4. Result: The system processed 200 requests within a 2-second interval, completely undermining the 100 req/min safety threshold.

```
Fixed Window Boundary Flaw:
Time:     00:58 --------- 00:59 --------- 01:00 --------- 01:01 --------- 01:02
Requests:                 [100 reqs]   (Reset)    [100 reqs]
Traffic:                               | <--- 200 requests in 2 seconds! ---> |
```

### 2.2 The Sliding Window Counter Mathematical Approximation
To achieve smooth sliding window protection without the heavy $O(N)$ memory cost of timestamp logs, calculate the estimated request count by weighting the previous window:

$$\text{Estimated Count} = \text{Count}_{\text{current}} + \left( \text{Count}_{\text{prev}} \times \frac{T - \text{elapsed}}{T} \right)$$

Where:
- $T$: Window duration in seconds (e.g., 60 seconds).
- $\text{elapsed}$: Seconds elapsed since the start of the current window.
- $\text{Count}_{\text{current}}$: Number of requests recorded in the current active window.
- $\text{Count}_{\text{prev}}$: Number of requests recorded in the preceding window.

If $\text{Estimated Count} \le \text{Threshold}$, the request is admitted and $\text{Count}_{\text{current}}$ is incremented. Otherwise, the request is rejected with HTTP 429.

---

## 3. Production Atomic Redis Lua Scripts

Distributed rate limiting requires atomic check-and-increment operations across Redis instances to prevent race conditions between concurrent application workers.

### 3.1 Token Bucket Implementation (Lua Script)
Tracks token refill based on elapsed time and current capacity:

```lua
-- KEYS[1]: Rate limit key (e.g., "ratelimit:token:user_123")
-- ARGV[1]: Bucket capacity (e.g., 10)
-- ARGV[2]: Refill rate in tokens per millisecond (e.g., 0.005 for 5 tokens/sec)
-- ARGV[3]: Current epoch timestamp in milliseconds

local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local data = redis.call("HMGET", key, "tokens", "last_updated")
local tokens = tonumber(data[1])
local last_updated = tonumber(data[2])

if not tokens then
    tokens = capacity
    last_updated = now
else
    local elapsed = math.max(0, now - last_updated)
    local generated = elapsed * refill_rate
    tokens = math.min(capacity, tokens + generated)
    last_updated = now
end

if tokens >= 1 then
    tokens = tokens - 1
    redis.call("HMSET", key, "tokens", tokens, "last_updated", last_updated)
    redis.call("PEXPIRE", key, math.ceil(capacity / refill_rate))
    return {1, math.floor(tokens)} -- Allowed: [status, remaining_tokens]
else
    redis.call("HMSET", key, "tokens", tokens, "last_updated", last_updated)
    return {0, 0} -- Rejected: [status, remaining_tokens]
end
```

### 3.2 Sliding Window Log Implementation via Redis ZSET
Guarantees absolute mathematical precision for sensitive security endpoints:

```lua
-- KEYS[1]: Rate limit key (e.g., "ratelimit:zset:ip_192_168_1_1")
-- ARGV[1]: Current epoch timestamp in milliseconds
-- ARGV[2]: Window duration in milliseconds (e.g., 60000 for 1 minute)
-- ARGV[3]: Maximum permitted requests (e.g., 100)

local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local clear_before = now - window

-- 1. Remove expired request timestamps outside current sliding window
redis.call("ZREMRANGEBYSCORE", key, "-inf", clear_before)

-- 2. Count active requests within current sliding window
local current_requests = redis.call("ZCARD", key)

if current_requests < limit then
    -- 3. Record current request timestamp as score and member
    redis.call("ZADD", key, now, now .. ":" .. math.random(1000, 9999))
    redis.call("PEXPIRE", key, window)
    return {1, limit - current_requests - 1} -- Allowed
else
    return {0, 0} -- Blocked
end
```

---

## 4. HTTP Headers and Protocol Standardization

Rate limiting responses must comply with RFC 6585 (HTTP 429 Too Many Requests) and include standardized IETF rate limiting telemetry headers.

### Standardized Response Headers
- `RateLimit-Limit`: Maximum permitted request quota within the active window period (e.g., `100`).
- `RateLimit-Remaining`: Number of remaining requests allowed within the current period (e.g., `42`).
- `RateLimit-Reset`: Number of seconds remaining until the current quota window resets (e.g., `18`).
- `Retry-After`: Mandatory on HTTP 429 responses. Specifies seconds the client must wait before retrying (e.g., `30`).

### HTTP 429 Rejection Payload Example
```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json; charset=utf-8
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 23
Retry-After: 23

{
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Quota exceeded for the current time window.",
  "retry_after_seconds": 23
}
```

---

## 5. Multi-Tier Rate Limiting Architecture

Production architectures implement defensive rate limiting across three distinct infrastructural layers:

```
[Inbound Internet Traffic]
            |
            v
+-------------------------------------------------------------+
| Layer 1: Edge CDN / WAF (Cloudflare, AWS CloudFront)        |
| - Volumetric DDoS mitigation                                |
| - Global per-IP rate limiting (e.g., 10,000 req/min per IP) |
+-----------------------------+-------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| Layer 2: API Gateway Layer (Kong, Envoy, NGINX)             |
| - Tenant and API key quota enforcement                      |
| - Distributed Redis Token Bucket (e.g., 1,000 req/min)      |
+-----------------------------+-------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| Layer 3: Application Domain Layer (Use Cases)               |
| - Action-specific business rules                            |
| - Login attempts (5 per 15 min per account)                 |
| - Credit card checkout attempts (3 per 10 min)              |
+-------------------------------------------------------------+
```

---

## 6. Architectural Verification Checklist
When verifying rate limiting designs:
- [ ] Critical public endpoints employ sliding window or token bucket algorithms rather than fixed windows.
- [ ] Distributed rate checks execute atomically using Redis Lua scripts.
- [ ] HTTP 429 responses include `Retry-After` and `RateLimit-*` headers.
- [ ] Rate limits are tiered across network edge, API gateway, and application domain levels.
- [ ] Cache keys incorporate tenant identifiers, IP addresses, or token hashes without exposing raw credentials.

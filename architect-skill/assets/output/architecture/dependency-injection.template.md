# Dependency Injection & IoC Specification: {{PROJECT_NAME}}

## 1. Service Lifetime Policy

| Lifetime | Scope | Thread Safety Requirement | Permitted Dependencies |
| :--- | :--- | :--- | :--- |
| **Singleton** | Process-wide | Must be strictly stateless and thread-safe | Other Singletons only |
| **Scoped** | Per HTTP Request / Job | Isolated to single unit-of-work context | Scoped + Singletons |
| **Transient** | Per resolution | Independent instance per injection | Any |

## 2. Composition Root Wiring
All concrete infrastructure adapters (`PostgresOrderRepository`, `RedisLockManager`) are bound to application output ports exclusively inside the Composition Root (`src/infrastructure/di/container.ts`).

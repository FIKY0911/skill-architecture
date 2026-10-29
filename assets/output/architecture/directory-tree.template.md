# Directory Tree Specification: {{PROJECT_NAME}} ({{ARCHITECTURE_STYLE}})

## 1. Source Code Hierarchy

```
src/
├── domain/                       # Enterprise Entities & Value Objects (Zero External Imports)
│   ├── entities/
│   ├── value-objects/
│   └── events/
├── application/                  # Use Cases, Input/Output Ports, DTOs
│   ├── use-cases/
│   ├── ports/
│   └── dto/
├── adapters/                     # Controllers, Presenters, Gateways, Repository Implementations
│   ├── inbound/
│   └── outbound/
└── infrastructure/               # Frameworks, Drivers, Database Clients, DI Wiring
    ├── db/
    ├── cache/
    ├── http/
    └── di/
```

## 2. Module Boundary Invariants
- Inner layers (`domain/`, `application/`) must never import from outer layers (`adapters/`, `infrastructure/`).
- Cross-module communication occurs strictly via public port interfaces or domain event buses.

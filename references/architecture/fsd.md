# Feature-Sliced Design (FSD v2.1) Reference Specification

## Standard: Feature-Sliced Design v2.1 Specification
This document establishes the authoritative frontend architecture standard for Feature-Sliced Design (FSD v2.1) within `architect-skill`. It formalizes hierarchical layer structures, slice and segment partitioning, strict unidirectional import rules, and public API encapsulation barriers.

---

## 1. Architectural Philosophy and Purpose

Feature-Sliced Design is an architectural methodology for structuring complex frontend web and mobile applications. It replaces ad-hoc technical grouping (e.g., generic `components/`, `hooks/`, `services/` folders) with domain-driven business boundaries, guaranteeing long-term codebase navigability, low coupling, and predictable refactoring.

```
+-------------------------------------------------------------------------+
| HIERARCHICAL LAYERS (STRICT UNIDIRECTIONAL TOP-TO-BOTTOM DEPENDENCIES)  |
|                                                                         |
|  [ app ]       Global setup, routing entry point, store provider        |
|     |                                                                   |
|     v                                                                   |
|  [ pages ]     Full page views matching application routes              |
|     |                                                                   |
|     v                                                                   |
|  [ widgets ]   Autonomous composite UI blocks (Header, ProductGrid)     |
|     |                                                                   |
|     v                                                                   |
|  [ features ]  Interactive user scenarios with business value (Auth)    |
|     |                                                                   |
|     v                                                                   |
|  [ entities ]  Domain models, business entity logic, entity UI (User)   |
|     |                                                                   |
|     v                                                                   |
|  [ shared ]    Domain-agnostic UI kit, API clients, helpers, types      |
+-------------------------------------------------------------------------+
```

---

## 2. The Six Standardized Layers

FSD v2.1 defines six standard layers in descending order of abstraction. Note that the legacy `processes` layer has been formally deprecated in FSD v2.1; complex multi-page processes are now handled within `features` or orchestrated at the `app` level.

### Layer 1: `app`
- Responsibility: Application initialization, root layout providers, global CSS style sheets, state store bootstrap, and top-level route definitions.
- Allowed Imports: Can import from all layers below (`pages`, `widgets`, `features`, `entities`, `shared`).
- Slices: Does not contain slices; structured directly by segments (`providers`, `styles`, `routes`).

### Layer 2: `pages`
- Responsibility: Composed visual layouts representing complete application screens or routes (e.g., `HomePage`, `ProfilePage`, `CheckoutPage`).
- Allowed Imports: Can import from `widgets`, `features`, `entities`, and `shared`.
- Invariant: Pages contain minimal local logic; their primary duty is composing widgets and features into view layouts.

### Layer 3: `widgets`
- Responsibility: Standalone, self-contained visual blocks that combine multiple features and entities to provide complete, reusable UI sections (e.g., `SiteHeader`, `SidebarNavigation`, `ProductCatalogGrid`).
- Allowed Imports: Can import from `features`, `entities`, and `shared`.
- Slices: Each widget represents a slice (e.g., `widgets/header`, `widgets/order-summary`).

### Layer 4: `features`
- Responsibility: User interactions that carry direct business value or mutate application state (e.g., `AuthByEmail`, `AddToCart`, `ToggleFavorite`, `FilterProducts`).
- Allowed Imports: Can import from `entities` and `shared`.
- Invariant: A feature must focus on a discrete user scenario.

### Layer 5: `entities`
- Responsibility: Real-world business concepts and domain models (e.g., `User`, `Product`, `Order`, `Invoice`). Contains entity data structures, entity state slices, API queries, and specialized entity UI cards.
- Allowed Imports: Can import strictly from `shared`.
- Invariant: Entities contain no awareness of user interactions (features) or page layouts.

### Layer 6: `shared`
- Responsibility: Reusable, domain-agnostic foundation code. Contains the base design system UI components (Button, Input, Modal), network request wrappers, utility functions, and environment configurations.
- Allowed Imports: Can import from nothing within the application. Completely independent.
- Slices: Contains no slices; organized strictly by segment folders (e.g., `shared/ui`, `shared/api`, `shared/lib`).

---

## 3. Structural Decomposition: Slices and Segments

Except for `app` and `shared`, every layer is organized into Slices (business domains), which are further decomposed into Segments (technical roles).

```
Layer (e.g., features/)
└── Slice (e.g., add-to-cart/)
    ├── ui/                             # Visual components belonging to this slice
    │   ├── AddToCartButton.tsx
    │   └── QuantityPicker.tsx
    ├── model/                          # State management, actions, selectors
    │   ├── cart.slice.ts
    │   └── types.ts
    ├── api/                            # Network calls and mutation hooks
    │   └── cart.api.ts
    ├── lib/                            # Slice-specific calculations or helpers
    │   └── calculate-discount.ts
    └── index.ts                        # PUBLIC API BARRIER (Re-exports only)
```

### Standard Segment Classifications
1. `ui`: React/Vue/Svelte components, styles, and visual assets.
2. `model`: Business logic, state stores (Redux, Zustand, Pinia), validation schemas, and domain types.
3. `api`: Backend request functions, queries, mutations, and API response mappers.
4. `lib`: Utility functions, formatters, and algorithms specific to the slice.
5. `config`: Constants, configuration parameters, and feature flags.

---

## 4. The Two Fundamental Import Rules

### Rule 1: Strict Unidirectional Downward Imports
A module can only import from layers positioned strictly beneath its current layer in the hierarchy.
- Permitted: `features/add-to-cart` importing from `entities/product`.
- Permitted: `pages/checkout` importing from `widgets/order-summary`.
- Prohibited: `entities/user` importing from `features/edit-profile` (Upward dependency violation).
- Prohibited: `shared/ui/button` importing from `entities/user` (Upward dependency violation).

### Rule 2: Strict Cross-Slice Import Isolation
Modules within the same layer are strictly forbidden from importing directly from one another.
- Prohibited: `features/auth-by-email` importing from `features/reset-password`.
- Prohibited: `entities/order` importing from `entities/customer`.
- Solution for Shared Requirements: If two features share common functionality, extract that logic down into the `entities` or `shared` layer, or compose both features at the `widgets` or `pages` layer.

---

## 5. Public API Barrier and Re-Exports

Every slice and segment must maintain an explicit `index.ts` file acting as its public gatekeeper.
- External files must only import from the slice root (`@/features/add-to-cart`), never from internal nested paths (`@/features/add-to-cart/ui/AddToCartButton.tsx`).
- Internal implementation details remain encapsulated and refactorable without breaking consumers.

```typescript
// src/features/add-to-cart/index.ts (PUBLIC API)
export { AddToCartButton } from './ui/AddToCartButton';
export { useCartStore } from './model/cart.slice';
export type { CartItemDTO } from './model/types';
// Internal helpers in lib/ or private sub-components are intentionally NOT exported.
```

### Path Mapping in `tsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/app/*": ["src/app/*"],
      "@/pages/*": ["src/pages/*"],
      "@/widgets/*": ["src/widgets/*"],
      "@/features/*": ["src/features/*"],
      "@/entities/*": ["src/entities/*"],
      "@/shared/*": ["src/shared/*"]
    }
  }
}
```

---

## 6. Automated Linting and Verification

Enforce FSD architectural boundaries using ESLint with `eslint-plugin-boundaries`:

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['boundaries'],
  rules: {
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          { from: 'app', allow: ['pages', 'widgets', 'features', 'entities', 'shared'] },
          { from: 'pages', allow: ['widgets', 'features', 'entities', 'shared'] },
          { from: 'widgets', allow: ['features', 'entities', 'shared'] },
          { from: 'features', allow: ['entities', 'shared'] },
          { from: 'entities', allow: ['shared'] },
          { from: 'shared', allow: [] }
        ]
      }
    ]
  }
};
```

---

## 7. Architectural Verification Checklist
To confirm Feature-Sliced Design compliance:
- [ ] Codebase is organized into the standard 6 layers: `app`, `pages`, `widgets`, `features`, `entities`, `shared`.
- [ ] No file imports from a higher or equivalent layer.
- [ ] Zero cross-slice imports exist within the same layer.
- [ ] Every slice exposes a public API `index.ts` file.
- [ ] External modules never import deep private files inside another slice.

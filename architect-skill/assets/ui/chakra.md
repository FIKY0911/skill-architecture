# Chakra UI (v3) / Ark UI Integration & Aesthetic Guide

**Official Reference**: `chakra-ui.com`, `ark-ui.com`  
**Architecture Paradigm**: Zag.js Finite State Machines + Semantic Token Recipes

---

## 1. Architectural Strengths

- **Finite State Machine Accessibility (Zag.js)**: Every interactive component (Dialog, Popover, Combobox, Menu) is modeled as a deterministic state machine, eliminating UI race conditions.
- **Semantic Design Tokens (`createSystem`)**: Supports multi-theme token mapping (`colors`, `radii`, `shadows`, `fonts`) across all 8 Senior Frontend Aesthetics.

---

## 2. System Definition (`src/theme/chakraSystem.ts`)

```typescript
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const aestheticConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        neoYellow: { value: "#FFDE59" },
        neoPink: { value: "#FF66C4" },
        neoSurface: { value: "#FFFDF5" },
        bentoCanvas: { value: "#09090B" },
      },
      shadows: {
        neubrutal: { value: "5px 5px 0px 0px #000000" },
        bento: { value: "0 0 0 1px rgba(255,255,255,0.08), 0 20px 40px -15px rgba(0,0,0,0.7)" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, aestheticConfig);
```

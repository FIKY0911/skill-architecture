# Mantine UI (v7+) Integration & Aesthetic Guide

**Official Reference**: `mantine.dev`  
**Architecture Paradigm**: Native CSS Modules + CSS Custom Properties + Rich Enterprise Component Ecosystem

---

## 1. Architectural Strengths

- **Zero Runtime CSS-in-JS Overhead (v7+)**: Mantine v7+ migrated from Emotion to native CSS Modules and PostCSS, delivering instant Server-Side Rendering (SSR) and full Next.js App Router compatibility.
- **Enterprise-Ready Primitives**: Over 100 built-in components and 50+ hooks (`@mantine/hooks`, `@mantine/form`, `@mantine/dates`, `@mantine/spotlight`).
- **Centralized Theme Override (`createTheme`)**: Seamless adaptation to Clean SaaS, Neubrutalism, or Bento Grid tokens.

---

## 2. Theme Token Configuration (`src/theme/mantineTheme.ts`)

```typescript
import { createTheme, rem } from '@mantine/core';

export const neubrutalismMantineTheme = createTheme({
  fontFamily: 'Public Sans, system-ui, sans-serif',
  headings: {
    fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '800',
  },
  defaultRadius: 'xs',
  black: '#000000',
  white: '#FFFDF5',
  shadows: {
    xs: '2px 2px 0px 0px #000000',
    sm: '3px 3px 0px 0px #000000',
    md: '5px 5px 0px 0px #000000',
    lg: '8px 8px 0px 0px #000000',
  },
  components: {
    Paper: {
      defaultProps: {
        withBorder: true,
        shadow: 'md',
      },
      styles: {
        root: {
          borderWidth: rem(3),
          borderColor: '#000000',
        },
      },
    },
  },
});
```

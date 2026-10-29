# Official Integration Guide: Industry Standard UI Libraries

This document provides architectural integration specifications, comparative evaluations, and production setup guides for six industry-standard UI component libraries:
1. **Tailwind CSS + shadcn/ui**
2. **DaisyUI**
3. **Mantine**
4. **Chakra UI (v3)**
5. **Ant Design (AntD)**
6. **Material UI (MUI)**

---

## 1. Architectural Comparison Matrix

| Library | Primary Styling Strategy | Runtime Overhead | Accessibility (WAI-ARIA) | Headless / Customizability | Bundle Impact (Tree-shaken) | Recommended Architecture Fit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Tailwind CSS + shadcn/ui** | Utility-first CSS + Radix UI Primitives | **0 ms (Zero runtime)** | Built-in via Radix UI primitives | **Absolute** (Source code copied directly into repository) | Minimal (~5-15 KB per component) | Feature-Sliced Design (FSD), Next.js App Router, Vite, High-Scale SaaS |
| **DaisyUI** | Semantic utility classes compiled via Tailwind plugin | **0 ms (Pure CSS)** | Basic semantic HTML tags; manual ARIA attributes required | Medium (Pre-packaged CSS class abstractions) | Negligible (Tailwind purges unused CSS) | Rapid Prototypes, Internal Portals, MVPs |
| **Mantine** | CSS Modules (v7+) | Minimal (No CSS-in-JS runtime engine) | Comprehensive built-in ARIA attributes and focus traps | High (Mantine Theme Override + CSS modules) | Moderate (~20-40 KB core bundle) | Enterprise Admin Panels, Data-Dense Dashboards, Form-Heavy Apps |
| **Chakra UI (v3)** | Zag.js state machines + Ark UI headless primitives | Low | Strict state-machine driven ARIA compliance | High (Snippet-based component integration) | Moderate (~25-50 KB) | React applications requiring robust composability |
| **Ant Design (AntD v5)** | `@ant-design/cssinjs` (Dynamic theme tokens) | Moderate (Runtime token computation) | Moderate (Optimized for desktop cursor interaction) | Low-Medium (Opinionated enterprise component model) | Heavy (~60-120 KB core bundle) | Enterprise Back-Office, ERP, B2B Internal Platforms |
| **Material UI (MUI v5/v6)** | Emotion / Pigment CSS (Zero-runtime in v6) | Moderate to Zero (depending on engine) | High (Google Material Design specification compliance) | High via unstyled primitives (`@mui/base`) | Heavy (~50-100 KB) | Enterprise SaaS adhering strictly to Material Design |

---

## 2. Library 1: Tailwind CSS + shadcn/ui

### Architectural Overview
`shadcn/ui` is not a distributed NPM dependency; it is an open code-ownership architecture. Reusable components built on top of Radix UI primitives and Tailwind CSS are scaffolded directly into the project's source tree (`components/ui/`). This design pattern guarantees zero version lock-in, complete styling sovereignty, and zero JavaScript runtime styling overhead.

### Installation & Configuration

#### Step 1: Install Core Dependencies
```bash
npm install -D tailwindcss postcss autoprefixer tailwindcss-animate
npm install lucide-react class-variance-authority clsx tailwind-merge
npx tailwindcss init -p
```

#### Step 2: Configure `components.json`
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

#### Step 3: Class Merger Utility (`src/lib/utils.ts`)
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

#### Step 4: Component Implementation Example (`Button.tsx`)
```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
```

---

## 3. Library 2: DaisyUI

### Architectural Overview
DaisyUI operates as a Tailwind CSS plugin adding semantic component classes (`btn`, `card`, `modal`, `badge`) directly into pure CSS. It generates zero JavaScript runtime overhead and enables rapid prototype delivery.

### Installation & Configuration

#### Step 1: Install Package
```bash
npm install -D daisyui@latest
```

#### Step 2: Configure `tailwind.config.js`
```javascript
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "corporate", "business"],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
  },
};
```

#### Step 3: Component Implementation Example (`Card.tsx`)
```tsx
import React from "react";

interface CardProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  badgeText?: string;
}

export const DaisyCard: React.FC<CardProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  badgeText,
}) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl border border-base-200">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title text-base-content">{title}</h2>
          {badgeText && <div className="badge badge-secondary">{badgeText}</div>}
        </div>
        <p className="text-base-content/70 text-sm leading-relaxed">{description}</p>
        {actionLabel && (
          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary btn-sm" onClick={onAction}>
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## 4. Library 3: Mantine (v7+)

### Architectural Overview
Starting with version 7, Mantine abandoned Emotion CSS-in-JS in favor of native CSS Modules and CSS custom properties. This architectural shift provides zero runtime styling overhead, instant server-side rendering (SSR), and full compatibility with Next.js App Router and Vite.

### Installation & Configuration

#### Step 1: Install Packages
```bash
npm install @mantine/core @mantine/hooks @tabler/icons-react
npm install -D postcss-preset-mantine postcss-simple-vars
```

#### Step 2: Configure `postcss.config.cjs`
```javascript
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};
```

#### Step 3: Provider Setup & Theme Customization (`src/theme.ts`)
```typescript
import { createTheme, MantineColorsTuple } from '@mantine/core';

const enterpriseBlue: MantineColorsTuple = [
  '#ebf5ff',
  '#d1e6ff',
  '#a3ccff',
  '#70aeff',
  '#4791ff',
  '#2b7aff',
  '#1a68ff',
  '#0d56e6',
  '#004acc',
  '#003eb3'
];

export const theme = createTheme({
  colors: {
    enterpriseBlue,
  },
  primaryColor: 'enterpriseBlue',
  primaryShade: 6,
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  defaultRadius: 'md',
});
```

#### Step 4: Component Implementation Example
```tsx
import React from 'react';
import { Button, Group, Text, Paper } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

export const MantineActionCard: React.FC<{ title: string; subtitle: string; onConfirm: () => void }> = ({
  title,
  subtitle,
  onConfirm,
}) => {
  return (
    <Paper shadow="sm" radius="md" p="xl" withBorder>
      <Text fw={600} size="lg" c="dark.8">
        {title}
      </Text>
      <Text c="dimmed" size="sm" mt="xs" mb="lg">
        {subtitle}
      </Text>
      <Group justify="flex-end">
        <Button variant="default" size="sm">
          Cancel
        </Button>
        <Button
          leftSection={<IconCheck size={16} />}
          color="enterpriseBlue"
          size="sm"
          onClick={onConfirm}
        >
          Confirm Execution
        </Button>
      </Group>
    </Paper>
  );
};
```

---

## 5. Library 4: Chakra UI (v3)

### Architectural Overview
Chakra UI v3 rebuilds its internal architecture atop Zag.js finite state machines and Ark UI headless primitives. It decouples component state logic from rendering styles, providing high accessibility with snippet-based component customization.

### Installation & Configuration

#### Step 1: Install Packages
```bash
npm install @chakra-ui/react @emotion/react
npx @chakra-ui/cli snippet add
```

#### Step 2: System Definition (`src/theme.ts`)
```typescript
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e6f2ff" },
          500: { value: "#0066cc" },
          900: { value: "#002952" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
```

#### Step 3: Provider Wrapping
```tsx
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/theme";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
```

---

## 6. Library 5: Ant Design (AntD v5)

### Architectural Overview
Ant Design v5 features a modular CSS-in-JS engine (`@ant-design/cssinjs`) with full dynamic design token tree derivation. It is the premier choice for data-intensive enterprise back-office management, internal portals, and administrative dashboards.

### Installation & Configuration

#### Step 1: Install Packages
```bash
npm install antd @ant-design/icons
```

#### Step 2: ConfigProvider Configuration (`src/providers/AntdProvider.tsx`)
```tsx
import React from 'react';
import { ConfigProvider, theme } from 'antd';

export const AntdRootProvider: React.FC<{ children: React.ReactNode; isDarkMode?: boolean }> = ({
  children,
  isDarkMode = false,
}) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
          fontFamily: 'Inter, sans-serif',
          fontSize: 14,
          wireframe: false,
        },
        components: {
          Button: {
            controlHeight: 36,
            colorPrimaryHover: '#4096ff',
          },
          Table: {
            headerBg: '#fafafa',
            headerColor: '#1f1f1f',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
```

#### Step 3: Component Implementation Example
```tsx
import React from 'react';
import { Table, Tag, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface AuditRecord {
  key: string;
  action: string;
  operator: string;
  status: 'SUCCESS' | 'FAILED';
  timestamp: string;
}

const columns: ColumnsType<AuditRecord> = [
  { title: 'Action', dataIndex: 'action', key: 'action' },
  { title: 'Operator', dataIndex: 'operator', key: 'operator' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <Tag color={status === 'SUCCESS' ? 'green' : 'red'}>
        {status}
      </Tag>
    ),
  },
  { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
];

export const AuditTable: React.FC<{ data: AuditRecord[] }> = ({ data }) => (
  <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
);
```

---

## 7. Library 6: Material UI (MUI v5/v6)

### Architectural Overview
MUI implements Google's Material Design specification. Version 6 introduces Pigment CSS, offering zero-runtime CSS extraction ahead-of-time (AOT) to mitigate Emotion runtime bottlenecks.

### Installation & Configuration

#### Step 1: Install Packages
```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

#### Step 2: Theme Setup (`src/theme/muiTheme.ts`)
```typescript
import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
});
```

#### Step 3: Component Implementation Example
```tsx
import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Chip, Box } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';

export const SecurityPolicyCard: React.FC<{ policyName: string; status: string }> = ({
  policyName,
  status,
}) => (
  <Card variant="outlined" sx={{ maxWidth: 400, borderRadius: 2 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <SecurityIcon color="primary" />
        <Chip label={status} color="success" size="small" />
      </Box>
      <Typography variant="h6" component="div">
        {policyName}
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1}>
        Enforces local-first zero-egress sandbox isolation profiles.
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" variant="contained" disableElevation>
        Verify Compliance
      </Button>
    </CardActions>
  </Card>
);
```

---

## 8. Anti-Patterns & Engineering Standards

1. **Anti-Pattern: Mixing Multiple CSS-in-JS Runtimes**:
   - Concurrently installing Emotion, Styled-Components, and AntD CSS-in-JS causes multiple stylesheet injections into `<head>`, degrading First Contentful Paint (FCP) and Time to Interactive (TTI).
   - *Rule*: Select exactly one primary component engine per frontend repository.
2. **Anti-Pattern: Unstyled Focus Outlines**:
   - Stripping default browser focus outlines (`outline: none` or `focus:outline-none`) without providing an explicit replacement violates WCAG 2.1 Success Criterion 2.4.7 (Focus Visible).
   - *Rule*: Always provide high-contrast visible focus rings (`focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`).
3. **Anti-Pattern: Direct Source Mutation in `components/ui/` without Semantic Variables**:
   - Hardcoding hexadecimal colors inside scaffolded shadcn/ui components breaks automated dark/light mode toggling.
   - *Rule*: Bind component styles strictly to semantic CSS custom properties (`hsl(var(--primary))`, `hsl(var(--background))`).

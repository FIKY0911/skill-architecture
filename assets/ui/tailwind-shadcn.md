# Tailwind CSS + shadcn/ui Integration & Aesthetic Guide

**Official References**: `ui.shadcn.com`, `tailwindcss.com`, `radix-ui.com`  
**Architecture Paradigm**: Zero-Runtime Utility CSS + Headless Accessible Primitives (Radix UI) + Full Source Ownership

---

## 1. Why Senior Engineers Choose Tailwind CSS + shadcn/ui

1. **Zero JavaScript Styling Runtime (0 ms Overhead)**: Styles are compiled at build-time into static CSS. Ideal for React Server Components (RSC), Next.js App Router, and high-frequency streaming UIs.
2. **Code Ownership (`src/components/ui/`)**: Components are copied directly into the codebase rather than hidden inside `node_modules`, eliminating opaque version lock-in.
3. **WAI-ARIA Compliance via Radix Primitives**: Keyboard navigation, focus trapping, roving tabindex, and screen-reader announcements are mathematically enforced via finite state primitives.
4. **Seamless Theme Token Adaptability**: Supports all 8 Senior Frontend Aesthetics via CSS Custom Properties (`--background`, `--foreground`, `--primary`, `--radius`, `--shadow`).

---

## 2. Production Setup & Configuration

### `components.json`
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

### Multi-Aesthetic Token Switching (`globals.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Theme Option A: Modern SaaS Clean Enterprise (Default) */
  :root, [data-aesthetic="clean-saas"] {
    --background: 210 40% 98%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --primary: 221.2 83.2% 53.3%;
    --border: 214.3 31.8% 91.4%;
    --radius: 0.75rem;
    --shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  }

  /* Theme Option B: Neubrutalism (Saweria / Gumroad / Figma Style) */
  [data-aesthetic="neubrutalism"] {
    --background: 48 100% 98%;      /* #FFFDF5 Warm Cream */
    --foreground: 0 0% 0%;          /* #000000 Pure Black */
    --card: 48 100% 98%;
    --primary: 48 100% 67%;         /* #FFDE59 Neo Yellow */
    --accent: 323 100% 70%;         /* #FF66C4 Neo Pink */
    --border: 0 0% 0%;
    --radius: 0.25rem;
    --shadow-card: 5px 5px 0px 0px #000000;
  }

  /* Theme Option C: Bento Grid / Linear Minimalist Dark */
  [data-aesthetic="bento-grid"] {
    --background: 240 10% 3.9%;     /* #09090B Zinc 950 */
    --foreground: 0 0% 98%;
    --card: 240 6% 10%;
    --primary: 239 84% 67%;         /* #6366F1 Indigo */
    --border: 0 0% 100% / 0.08;
    --radius: 1.25rem;
    --shadow-card: 0 0 0 1px rgba(255,255,255,0.05), 0 20px 40px -15px rgba(0,0,0,0.7);
  }
}
```

See `assets/ui/fe-aesthetics.md` for all 8 senior frontend aesthetic specifications.

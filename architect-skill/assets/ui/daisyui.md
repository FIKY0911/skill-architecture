# DaisyUI Integration & Aesthetic Guide

**Official Reference**: `daisyui.com`  
**Architecture Paradigm**: Zero-Runtime Semantic Tailwind CSS Component Classes

---

## 1. Architectural Strengths & Trade-offs

- **Zero JS Runtime**: Pure CSS classes (`btn`, `card`, `modal`, `badge`, `drawer`) compiled via Tailwind CSS plugin.
- **Built-in Multi-Theme Engine**: Native `data-theme` attribute switching using CSS variables (`--p`, `--s`, `--a`, `--n`, `--b1`, `--rounded-box`, `--rounded-btn`).
- **Accessibility Note**: Because DaisyUI is pure CSS, interactive widgets (modals, dropdowns, tabs) require explicit WAI-ARIA attributes (`aria-expanded`, `role="dialog"`, keyboard Escape handlers) in production React/Vue/Svelte code.

---

## 2. Custom Senior Frontend Aesthetics in `tailwind.config.js`

```javascript
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,vue,svelte}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        neubrutalism: {
          "primary": "#FFDE59",
          "primary-content": "#000000",
          "secondary": "#FF66C4",
          "accent": "#A6FF00",
          "neutral": "#000000",
          "base-100": "#FFFDF5",
          "base-200": "#F4F0EA",
          "base-300": "#000000",
          "--rounded-box": "0.25rem",
          "--rounded-btn": "0.125rem",
          "--border-btn": "2px",
        },
        "bento-linear": {
          "primary": "#6366F1",
          "secondary": "#818CF8",
          "accent": "#10B981",
          "neutral": "#18181B",
          "base-100": "#09090B",
          "base-200": "#121215",
          "base-300": "#27272A",
          "base-content": "#FAFAFA",
          "--rounded-box": "1.25rem",
          "--rounded-btn": "0.5rem",
        },
        "clean-saas": {
          "primary": "#2563EB",
          "secondary": "#4F46E5",
          "accent": "#0EA5E9",
          "neutral": "#0F172A",
          "base-100": "#FFFFFF",
          "base-200": "#F8FAFC",
          "base-300": "#E2E8F0",
          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
        }
      }
    ]
  }
};
```

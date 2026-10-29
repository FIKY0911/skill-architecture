# Component Registry & WAI-ARIA Specification: {{PROJECT_NAME}}

## 1. Core Component Contracts

| Component | Base Primitive | Required ARIA Attributes | Aesthetic Styling Rule (`{{UI_AESTHETIC}}`) |
| :--- | :--- | :--- | :--- |
| `Button` | `<button>` / `@radix-ui/react-slot` | `aria-busy`, `aria-disabled` | Uses `--border-width`, `--shadow-elevation`, and visible `focus-visible:ring-2` |
| `Modal / Dialog` | `@radix-ui/react-dialog` | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` | Focus trap active; Escape key closes |
| `DataTable` | Semantic `<table>` | `scope="col"`, `aria-sort` | High-contrast header row and keyboard row navigation |
| `FormField` | `<input>` + `<label>` | `aria-invalid`, `aria-describedby` | Explicit error message linked via `id` |

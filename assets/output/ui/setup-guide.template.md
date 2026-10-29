# UI Framework Setup Guide: {{PROJECT_NAME}} ({{UI_FRAMEWORK}})

## 1. Selected UI Architecture
- **Component Framework**: `{{UI_FRAMEWORK}}`
- **Visual Design Aesthetic**: `{{UI_AESTHETIC}}`
- **Accessibility Target**: WCAG 2.1 Level AA

## 2. Installation & Build Configuration
```bash
npm install -D tailwindcss postcss autoprefixer
npm install clsx tailwind-merge class-variance-authority lucide-react
```

## 3. Directory Structure (`Feature-Sliced Design` / Component Ownership)
- `src/shared/ui/`: Primitive accessible components wired to `{{UI_AESTHETIC}}` tokens.
- `src/app/styles/tokens.css`: Semantic CSS custom properties (`--bg-surface`, `--border-primary`, `--shadow-elevation`).

# Design Tokens & Visual Theme Specification: {{PROJECT_NAME}} ({{UI_AESTHETIC}})

## 1. Selected Senior Frontend Aesthetic
- **Theme Identifier**: `{{UI_AESTHETIC}}`
- **Supported Modes**: Light / Dark / High-Contrast
- **Reference Specification**: `assets/ui/fe-aesthetics.md`

## 2. CSS Custom Properties (`tokens.css`)
```css
:root {
  --surface-canvas: #FFFDF5;
  --surface-card: #FFFFFF;
  --text-primary: #000000;
  --text-secondary: #334155;
  --accent-primary: #FFDE59;
  --border-width: 3px;
  --border-color: #000000;
  --radius-base: 4px;
  --shadow-elevation: 5px 5px 0px 0px #000000;
}
```

## 3. Supported Aesthetic Presets
1. `neubrutalism` (Saweria / Gumroad / Figma bold borders & hard offset shadows)
2. `bento-grid` (Linear / Raycast dark zinc modular grid)
3. `glassmorphism` (Translucent frosted glass & Aurora mesh gradients)
4. `swiss-editorial` (International Typographic mathematical grid)
5. `clean-saas` (Stripe / Vercel enterprise slate & crisp 1px borders)
6. `material-3` (Google Material You dynamic tonal surfaces)
7. `neumorphism` (Soft extruded dual-shadow UI with high-contrast text)
8. `retro-terminal` (Cyberpunk phosphor monochrome & CRT scanlines)

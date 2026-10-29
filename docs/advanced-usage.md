# Advanced Usage & Wizard Customization

## 1. Selecting Senior Frontend Aesthetics
During Stage 4 of the wizard, you can select from 8 curated Frontend Design Aesthetics:
1. `neubrutalism`: High-contrast 3px black borders, hard offset shadows (`5px 5px 0px #000`), vibrant pop colors (Saweria, Gumroad, Figma style).
2. `bento-grid`: Linear/Raycast dark zinc grid with subtle radial sheen glows.
3. `glassmorphism`: Frosted glass blur (`backdrop-blur-2xl`) over Aurora mesh gradients.
4. `swiss-editorial`: International Typographic mathematical grid and stark 0px radii.
5. `clean-saas`: Stripe/Vercel crisp slate enterprise aesthetic.
6. `material-3`: Google Material You tonal surface containers.
7. `neumorphism`: Soft dual-shadow extruded controls with WCAG contrast reinforcements.
8. `retro-terminal`: Cyberpunk phosphor green monochrome with CRT scanlines.

## 2. Resuming Wizard Sessions
```bash
node architect-skill/scripts/wizard-state.js init my-platform
node architect-skill/scripts/wizard-state.js status
node architect-skill/scripts/wizard-state.js finalize
```

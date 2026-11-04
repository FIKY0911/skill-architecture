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

## 2. Existing Requirements Fast-Track (PRD, BRD, SRD)
When the user already has a PRD, BRD, or SRD (or any combination/subset):
1. The agent reads the supplied document(s) directly using its file-reading tool.
2. Stage 1 (Requirements Elicitation) is automatically bypassed without prompting the user to choose whether to create PRD/BRD/SRD.
3. The wizard advances directly to Stage 2 (Architectural Paradigm & Structural Boundaries).

To initialize state directly with existing requirements bypassed:
```bash
node scripts/wizard-state.js init --project my-platform --skip-requirements
```

## 3. Dual-Track Context & Token Economy
To optimize context window usage and ensure developer safety:
- **Trivial / Non-Technical Queries**: Deliver concise high-level summaries and immediate conclusions without unnecessary preambles or deep technical breakdowns.
- **Heavy Technical Challenges**: Perform deep, rigorous first-principles analysis until finding the complete solution, but strictly require explicit developer approval before performing any file edits, command execution, or system changes.

## 4. Resuming Wizard Sessions
```bash
node scripts/wizard-state.js init my-platform
node scripts/wizard-state.js status
node scripts/wizard-state.js finalize
```

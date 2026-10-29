# UI Anti-Slop Contract (Mandatory, All UI Tools)

Applies to every UI tool: `neobrutalism`, `shadcn-ui`, `magicui`, `ui-registry`, `tailwindcss` MCP.

## 1. Reference-First (no writing UI from memory)
Before writing any UI code the agent MUST pull real references via MCP and record them in `docs/ui/[framework]/reference-log.md`:
- `neobrutalism`: `get_theme`, `get_component`, `get_component_demo`
- `shadcn-ui`: `get_component`, `get_component_demo`, `list_blocks`/`get_block`
- `magicui`: component source + usage example
- `ui-registry`: registry item source (Aceternity, Cult UI, SmoothUI, Kokonut, etc.)
- `tailwindcss`: validate every utility class and theme config

Each log row: `tool | call | component/theme | date`. A component without a row MUST NOT be used.

## 2. Single Source of Truth for Theme
- All color, radius, border width, shadow, spacing, font come from `theme-tokens.md` (CSS variables / Tailwind theme).
- ONE design language per product. Mixing registries is allowed only if each imported component is re-skinned to the tokens and listed in `component-registry.md`.

## 3. Forbidden Patterns (validator-enforced)
| ID | Rule |
|----|------|
| S1 | No hardcoded hex/rgb/hsl colors in components. Use tokens (`bg-primary`, `var(--primary)`). |
| S2 | No tinted translucent backgrounds on text/badges/labels (`bg-blue-500/10`, `bg-[rgba(...)]`, `bg-opacity-*`). Use a solid semantic token pair (`bg-muted text-muted-foreground`). |
| S3 | No arbitrary values for color/shadow/radius (`bg-[#...]`, `shadow-[...]`, `rounded-[...]`). |
| S4 | No Tailwind default palette colors (`bg-blue-500`, `text-gray-600`) when a token exists. |
| S5 | No inline `style=` carrying color/background/box-shadow/border-radius. |
| S6 | No one-off card: every Card uses the same component, same border/radius/shadow tokens. Variants only via declared `variant` props. |
| S7 | No gradient text, glow, or decorative blur unless the chosen theme (Glassmorphism, Aurora) defines it as a token. |

## 4. Consistency Checklist (review gate)
- Every card/panel in one view shares border, radius, shadow, padding.
- Badges and status chips use declared status tokens only.
- Text contrast meets WCAG 2.1 AA on its actual background.
- Spacing on the token scale; one heading/body font pair.
- Light and dark tokens both defined.

## 5. Exceptions
Document the exception in `theme-tokens.md` (id, reason, scope) and add `/* anti-slop-allow: Sx reason */` on the line. Undocumented allows are invalid.

## 6. Validation
`node scripts/validate-ui-slop.js <dir>` scans `.tsx .jsx .vue .svelte .html .css` (skipping `theme-tokens`/token CSS files containing `:root`) and exits 1 on violations.

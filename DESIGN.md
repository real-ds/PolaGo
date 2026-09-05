# DESIGN.md — Pola Go

> Single source of truth for design direction, tokens, and visual rules.
> Maintained alongside `AGENTS.md` and `design-system/pola-go/MASTER.md`.

---

## 1. Design Thesis

Pola Go is a **shared virtual photo booth for long-distance couples**. The product's emotional core is "we did this together" — two people in different locations, in the same moment, captured in a single polaroid.

The design must therefore feel:
- **Warm** — couples in love, not SaaS dashboards
- **Playful** — fun, photo-booth nostalgia, not corporate
- **Tactile** — every button feels pressable, every surface feels like a thing you'd pick up
- **Intimate** — privacy-by-default, soft edges, no aggressive colors

**Anchor feeling**: A polaroid camera from the late '90s, reimagined for two people in 2026. Friendly claymorphism, not flat iOS.

---

## 2. Design System Summary

**Style**: Claymorphism
- Soft 3D, chunky, toy-like, bubbly
- Thick borders (3–4px), double shadows (inner + outer)
- Rounded corners (16–24px) — never sharp
- Performance: low cost, no drivers
- Accessibility risk: conditional (requires contrast text ≥ 4.5:1, keyboard, visible focus, reduced-motion)

---

## 3. Color Tokens

### Primary Palette

| Token | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Primary | `#F97316` | `--color-primary` | Brand accent, primary CTAs |
| On Primary | `#0F172A` | `--color-on-primary` | Text on primary surfaces |
| Secondary | `#FB923C` | `--color-secondary` | Warm highlights, hover states |
| On Secondary | `#0F172A` | `--color-on-secondary` | Text on secondary |
| Accent/CTA | `#2563EB` | `--color-accent` | Trust blue for confirm actions |
| On Accent | `#FFFFFF` | `--color-on-accent` | Text on accent |

### Surface Palette

| Token | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Background | `#FFF7ED` | `--color-background` | Page background (warm off-white) |
| Foreground | `#9A3412` | `--color-foreground` | Primary text (deep orange) |
| Card | `#FFFFFF` | `--color-card` | Card surfaces |
| Card Foreground | `#9A3412` | `--color-card-foreground` | Text on cards |
| Muted | `#F1F0F0` | `--color-muted` | Muted backgrounds |
| Muted Foreground | `#475569` | `--color-muted-foreground` | Secondary text |
| Border | `#FED7AA` | `--color-border` | Subtle borders |
| Destructive | `#DC2626` | `--color-destructive` | Delete, leave room |
| On Destructive | `#FFFFFF` | `--color-on-destructive` | Text on destructive |
| Ring | `#000000` | `--color-ring` | Focus ring color |

**Color Note**: Playful orange + trust blue combo. Avoid introducing new hues without approval.

### Dark Mode (Future)

Currently light-mode only. When dark mode ships:
- Surface: `#1F1A17` (warm dark, not cold gray)
- Foreground: `#FED7AA` (peach on dark)
- Primary: `#FB923C` (slightly desaturated for dark)
- All foreground/background pairs must maintain ≥ 4.5:1 contrast

---

## 4. Typography

### Font Stack

- **Headings**: `Fredoka` — 400, 500, 600, 700
- **Body**: `Nunito` — 300, 400, 500, 600, 700

### Type Scale

| Token | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px | Helper text, badges |
| `text-sm` | 14px | Secondary labels |
| `text-base` | 16px | Body (min for mobile) |
| `text-lg` | 18px | Emphasized body |
| `text-xl` | 20px | Small headings |
| `text-2xl` | 24px | Card titles |
| `text-3xl` | 30px | Section headings |
| `text-4xl` | 36px | Page titles |
| `text-5xl` | 48px | Hero headings |

### Typography Rules

- Body text: line-height `1.5–1.75`, min 16px on mobile
- Headings: line-height `1.1–1.3`, use `text-wrap: balance`
- Use `font-variant-numeric: tabular-nums` for countdown timer digits
- Never use Inter / Roboto / Arial / system-ui as display fonts
- Curly quotes `"` `"`, not straight `"`
- Loading states end with `…`: `"Loading…"`, `"Saving…"`
- Non-breaking spaces: `10&nbsp;MB`, brand names

---

## 5. Spacing System

8pt/4pt incremental grid.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px / 0.25rem | Tight gaps |
| `--space-sm` | 8px / 0.5rem | Icon gaps, inline spacing |
| `--space-md` | 16px / 1rem | Standard padding |
| `--space-lg` | 24px / 1.5rem | Section padding |
| `--space-xl` | 32px / 2rem | Large gaps |
| `--space-2xl` | 48px / 3rem | Section margins |
| `--space-3xl` | 64px / 4rem | Hero padding |

---

## 6. Shadow & Elevation

Claymorphism requires **double shadows** (inner + outer) for the "soft 3D" feel.

| Level | Outer Shadow | Inner Highlight | Usage |
|-------|--------------|-----------------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | none | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | `inset 0 1px 0 rgba(255,255,255,0.6)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | `inset 0 2px 0 rgba(255,255,255,0.7)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | `inset 0 3px 0 rgba(255,255,255,0.8)` | Hero images, featured cards |

**Anti-pattern**: Never use Tailwind's default `shadow-md`/`shadow-lg`/`shadow-xl` directly — they don't have the inner highlight required for claymorphism.

---

## 7. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 8px | Small chips, badges |
| `rounded-md` | 12px | Inputs, secondary buttons |
| `rounded-lg` | 16px | Cards, primary buttons |
| `rounded-xl` | 20px | Modals, large surfaces |
| `rounded-2xl` | 24px | Hero cards, polaroid frames |
| `rounded-full` | 9999px | Avatars, pills, circular buttons |

**Anti-pattern**: Avoid `rounded-full` on large containers, cards, or primary buttons (looks like a pill, not clay).

---

## 8. Border Style

- **Default border**: `3px solid var(--color-border)` for primary surfaces
- **Thin divider**: `1px solid rgba(0,0,0,0.06)` for in-card separators
- **Focus border**: `2px solid var(--color-ring)` with `outline-offset: 2px`

---

## 9. Component Patterns

### Buttons

**Primary CTA** (e.g., "Join Room", "Start Photo Session"):
```css
background: #2563EB;
color: #FFFFFF;
padding: 14px 28px;
border-radius: 16px;
border: 3px solid #1D4ED8;
box-shadow: 0 4px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3);
font-family: 'Fredoka', sans-serif;
font-weight: 600;
font-size: 18px;
cursor: pointer;
transition: all 200ms ease-out;
```

**Hover state**: `transform: translateY(-2px)`, shadow deepens
**Active state**: `transform: translateY(0)`, shadow flattens
**Disabled state**: opacity 0.5, cursor not-allowed, no transform

**Secondary Button** (e.g., "Cancel", "Back"):
```css
background: #FFFFFF;
color: #F97316;
border: 3px solid #F97316;
/* same shadow structure */
```

### Cards (Polaroid Frames)

```css
background: #FFFFFF;
border: 3px solid #FED7AA;
border-radius: 20px;
padding: 24px;
box-shadow: 0 10px 15px rgba(0,0,0,0.1), inset 0 2px 0 rgba(255,255,255,0.7);
```

### Inputs

```css
padding: 12px 16px;
border: 3px solid #FED7AA;
border-radius: 12px;
font-size: 16px;
background: #FFFFFF;
```

**Focus state**: `border-color: #F97316`, `outline: 2px solid #F97316`, `outline-offset: 2px`

### Modals

```css
background: #FFFFFF;
border-radius: 24px;
padding: 32px;
border: 3px solid #FED7AA;
box-shadow: 0 20px 25px rgba(0,0,0,0.15), inset 0 3px 0 rgba(255,255,255,0.8);
```

**Overlay**: `rgba(0, 0, 0, 0.5)` with `backdrop-filter: blur(4px)`

---

## 10. Iconography

- **Source**: Heroicons or Lucide (SVG, stroke-based)
- **Style**: `stroke-width: 2`, rounded line caps
- **Sizing**: 16px (inline), 20px (button), 24px (default), 32px (hero)
- **Anti-pattern**: NEVER use emoji as icons (`📸`, `💕`, `🎉`)
- **Color**: `currentColor` by default, semantic colors when needed

---

## 11. Motion & Animation

### Motion Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `duration-fast` | 150ms | Hover, focus, micro-feedback |
| `duration-base` | 200ms | Button press, state changes |
| `duration-slow` | 300ms | Modal open/close, page transitions |
| `duration-cinematic` | 600ms | Hero sequences, shutter flash |

### Easing

- **Default**: `cubic-bezier(0.4, 0, 0.2, 1)` (smooth in/out)
- **Enter**: `cubic-bezier(0, 0, 0.2, 1)` (decelerate)
- **Exit**: `cubic-bezier(0.4, 0, 1, 1)` (accelerate)
- **Spring**: `cubic-bezier(0.34, 1.56, 0.64, 1)` (playful bounce for claymorphism)

### Required Behaviors

- Animate `transform` and `opacity` only (compositor-friendly)
- Never `transition: all` — list properties explicitly
- Set correct `transform-origin` (e.g., `center` for modals)
- Honor `prefers-reduced-motion: reduce` — shorten or disable animations
- Countdown overlay: use `font-variant-numeric: tabular-nums`
- Shutter flash: brief 200ms white overlay with `opacity` transition
- Stagger list items: 30–50ms per item
- Modal motion: scale from 0.95 + fade in 200ms

---

## 12. Layout & Responsive

### Breakpoints

| Name | Min Width | Target |
|------|-----------|--------|
| `sm` | 375px | Small phone (iPhone SE) |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1440px | Large desktop |

### Container Widths

- Mobile: full width with 16px padding
- Tablet: max-width 768px, centered
- Desktop: max-width 1200px, centered

### Grid (Booth Stage)

- Mobile: stacked (local video on top, remote below)
- Tablet: side-by-side
- Desktop: side-by-side with sidebar controls

### Critical Rules

- Never disable zoom (no `user-scalable=no`)
- Use `min-h-dvh` not `100vh` on mobile
- No horizontal scroll
- Safe-area insets: `env(safe-area-inset-*)` for notched devices

---

## 13. Accessibility (WCAG 2.2 AA minimum)

### Contrast

- **Body text**: ≥ 4.5:1 against background
- **Large text** (≥ 18pt or 14pt bold): ≥ 3:1
- **UI components / focus indicators**: ≥ 3:1
- **Icon contrast** (meaningful): ≥ 3:1

Verified pair:
- `#9A3412` (foreground) on `#FFF7ED` (background) = 7.4:1 ✓ AAA
- `#475569` (muted-foreground) on `#FFFFFF` (card) = 7.2:1 ✓ AAA

### Focus States

- All interactive elements: visible focus ring, 2px solid, 3:1 contrast
- Use `:focus-visible` not `:focus` (avoid ring on click)
- Group focus with `:focus-within` for compound controls
- Sticky headers/footers must not obscure focused element

### Keyboard Navigation

- Tab order matches visual order
- All interactive elements reachable via Tab
- Skip-to-main-content link as first focusable element
- Escape closes modals
- Enter/Space activates buttons
- Arrow keys navigate carousels/filters

### Semantic HTML

- `<button>` for actions
- `<a>` / `<Link>` for navigation
- `<label>` for form fields (with `htmlFor`)
- `<main>`, `<nav>`, `<header>`, `<footer>` for landmarks
- `<h1>` → `<h6>` in strict order
- `<img alt="...">` (or `alt=""` if decorative)

### ARIA

- `aria-label` on icon-only buttons
- `aria-live="polite"` on toasts and async status
- `aria-hidden="true"` on decorative icons beside text
- `role="alert"` for error toasts

### Motion

- Respect `prefers-reduced-motion: reduce`
- Provide reduced variants for all animations
- Pause autoplay motion > 5s with controls

### Forms

- Visible labels (no placeholder-only)
- `autocomplete` on auth fields
- Correct `inputmode` (email, tel, url, number)
- Errors inline next to fields
- Focus first error on submit
- Helper text below input for complex fields

---

## 14. Pre-Delivery Checklist

Before merging any UI change, verify:

### Visual
- [ ] No emojis used as icons (use SVG from Heroicons/Lucide)
- [ ] All icons from consistent family (same stroke width, size scale)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150–300ms)
- [ ] Light mode: text contrast ≥ 4.5:1
- [ ] Dark mode: text contrast ≥ 4.5:1 (when shipped)
- [ ] Focus states visible for keyboard nav
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile

### Interaction
- [ ] Touch targets ≥ 44×44px (preferably 48px)
- [ ] Pressed state visible (scale 0.95 or color shift)
- [ ] Loading state on async actions
- [ ] Disabled state visually distinct
- [ ] Destructive actions need confirmation

### Accessibility
- [ ] All buttons keyboard-reachable
- [ ] Form fields have labels
- [ ] Errors are accessible (aria-live, focus management)
- [ ] Color is not the only indicator

### Performance
- [ ] `next/image` for all images with explicit width/height
- [ ] Below-fold images: `loading="lazy"`
- [ ] Above-fold critical: `priority` or `fetchpriority="high"`
- [ ] Bundle analyzer run if size increased
- [ ] Heavy components dynamically imported
- [ ] No layout reads in render (`getBoundingClientRect` etc.)

### Code Quality
- [ ] TypeScript strict mode passes
- [ ] ESLint passes
- [ ] Tests cover new functionality
- [ ] No `const styles = {...}` (use namespaced or inline)

---

## 15. Anti-Patterns (DO NOT USE)

- ❌ Emojis as icons (`📸`, `💕`, `🎉`)
- ❌ Inter / Roboto / Arial / system-ui as display font
- ❌ Tailwind default `shadow-md`/`shadow-lg` (no inner highlight)
- ❌ `rounded-full` for cards or large buttons
- ❌ Bright primary-colored hero sections (no bright blue/green/red backgrounds)
- ❌ Gradients, neon, glassmorphism
- ❌ Generic "John Doe" / "Acme Corp" placeholders
- ❌ AI clichés: "Elevate", "Seamless", "Unleash", "Next-Gen"
- ❌ Purple → pink → blue gradients
- ❌ Left-border accent cards (Material leftover)
- ❌ Animated GIF when compressed video suitable
- ❌ `transition: all`
- ❌ `outline-none` without focus-visible replacement
- ❌ `<div onClick>` instead of `<button>`
- ❌ Images without dimensions
- ❌ Form inputs without labels
- ❌ Icon buttons without `aria-label`
- ❌ Hardcoded date/number formats (use `Intl.*`)
- ❌ `user-scalable=no` or `maximum-scale=1`

---

## 16. Resources

- **Master design tokens**: `design-system/pola-go/MASTER.md`
- **Agent instructions**: `AGENTS.md`
- **Project summary**: `PROJECT_SUMMARY.md`
- **SRS**: `files/Project_SRS.md`
- **Live deployment**: https://pola-go.vercel.app
- **Repository**: https://github.com/real-ds/PolaGo

---

**Version**: 1.0
**Last updated**: 2026-09-05
**Maintained by**: Pola Go team

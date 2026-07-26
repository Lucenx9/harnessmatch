# HarnessMatch design system

This file is the visual source of truth for HarnessMatch. Page files in `pages/` may override it only when an interaction requires a denser product surface.

## Design read

- Product: evidence-backed coding harness recommendation tool
- Audience: developers and technical buyers
- Direction: restrained developer-tool minimalism inspired by Vercel, Linear, and Cursor
- Redesign mode: targeted evolution with routes, information architecture, and scoring behavior preserved
- Dials: variance 6, motion 3, density 4

## Foundation

- Stack: Next.js App Router, React, Tailwind CSS v4, project-level CSS tokens
- Type: Geist for interface and display, Geist Mono for metadata and numeric values
- Theme: dark-first with a complete light theme and system-preference default
- Visual material: flat graphite surfaces, quiet borders, one muted violet accent, real editorial imagery

## Core tokens

| Role | Dark | Light |
| --- | --- | --- |
| Page | `#07070a` | `#fbfbfc` |
| Quiet section | `#0b0b10` | `#f4f4f7` |
| Strong surface | `#111118` | `#ffffff` |
| Primary text | `#f5f5f7` | `#111116` |
| Muted text | `#9898a6` | `#696976` |
| Accent | `#7c6ee6` | `#6556d9` |
| Accent text | `#afa6f8` | `#5142c7` |

Semantic success, warning, and danger colors are reserved for actual state. They are not decorative accents.

## Shape and spacing

- Buttons, controls, and small menus: 8px radius
- Cards and media: 14px radius
- Pills: reserved for categories, interfaces, and selected requirements
- Minimum touch target: 44 by 44px
- Spacing rhythm: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Page width: 1180px default, 1360px for evidence and comparison pages

## Typography

- Hero: 3.8rem to 5.2rem, maximum two lines on desktop
- Page title: 3.1rem to 5.8rem
- Section title: 2.1rem to 3.75rem
- Body: 16px minimum, 1.55 to 1.65 line height
- Metadata: Geist Mono at 10px to 12px with restrained tracking
- Headings use tight tracking but never sacrifice readability

## Layout rules

- Homepage hero uses an asymmetric text and editorial-image split
- Hero contains one eyebrow, one headline, one short description, and two distinct actions
- Facts sit in a dedicated strip below the hero
- Principle content uses editorial rows, not three equal feature cards
- Catalog previews use a two-column directory layout without implying a ranking
- Mobile layouts collapse explicitly below 768px and must never scroll horizontally

## Interaction and accessibility

- Visible focus ring on every interactive element
- Hover and press feedback lasts 150ms to 220ms and only animates transform, opacity, color, or border
- Press state uses a small downward translation and scale reduction
- Motion respects `prefers-reduced-motion`
- Buttons and muted text meet WCAG AA in both themes
- The recommender exposes progress semantics and selected requirements with `aria-pressed`

## Imagery

- Hero asset: `/public/harness-hero.webp`
- Style: editorial product photography, graphite materials, restrained violet detail
- No text, logos, screens, fake terminals, interface mockups, neon, or cyberpunk effects
- Social asset: `/public/og.png`

## Avoid

- Fake product screenshots assembled from decorative interface fragments
- Cyan as a second accent, outer glow, mesh gradients, and crosshair grids
- Decorative status dots and section numbering
- Repeated split headers and three-equal-card feature sections
- Progress bars as editorial comparison visuals
- Wrapped desktop calls to action
- Symbol-only controls, decorative arrows, emoji icons, and typographic dash flourishes

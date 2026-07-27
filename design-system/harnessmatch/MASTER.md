# HarnessMatch design system

This file is the visual source of truth for HarnessMatch. Page files in `pages/` may override it only when an interaction requires a denser product surface.

## Design read

- Product: evidence-backed coding harness recommendation tool
- Audience: developers and technical buyers
- Direction: restrained developer research tool with analysis-first density inspired by Vercel, Linear, Cursor, Artificial Analysis, and Vellum
- Redesign mode: targeted evolution with routes, information architecture, and scoring behavior preserved
- Dials: variance 4, motion 2, density 7

## Foundation

- Stack: Next.js App Router, React, Tailwind CSS v4, project-level CSS tokens
- Type: Geist for interface and display, Geist Mono for metadata and numeric values
- Theme: dark-first with a complete light theme and system-preference default
- Visual material: flat graphite surfaces, quiet borders, one muted violet accent, and first-party product marks

## Identity and product marks

- HarnessMatch mark: two solid geometric halves meet at a single square node to form an H, expressing selection and fit without literal cables or generic AI imagery
- Primary asset: `/public/brand/harnessmatch-mark.svg`; light and dark favicon variants plus compact PNG fallbacks live beside it
- The interface mark is monochrome with one restrained violet node; app icons use a neutral high-contrast tile and preserve a 12.5% safe margin
- Wordmark: Geist, 720 weight, with the mark always preceding the name
- Product logos: first-party assets from each vendor's official site or repository, with the asset source recorded in `src/data/harnesses.ts`
- Product marks keep their original colors and sit on the same neutral light tile in both themes, avoiding trademark recoloring and dark-mode contrast failures
- When a product name and logo appear together, the image is decorative and the adjacent text provides the accessible name

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

- Homepage analysis intro: 3.25rem to 4.7rem, maximum two lines on desktop
- Page title: 2.8rem to 4.5rem
- Section title: 1.9rem to 3.15rem
- Body: 16px minimum, 1.55 to 1.65 line height
- Metadata: Geist Mono at 10px to 12px with restrained tracking
- Headings use tight tracking but never sacrifice readability

## Layout rules

- Homepage opens with a compact analysis intro and live dataset status, not a promotional hero
- Every decision surface uses progressive disclosure: recommendation first, practical comparison second, taxonomy and scientific detail on demand
- A first reading layer should answer what to choose, why it fits, and what to check before choosing
- The first interactive surface is a workflow-fit chart with explicit assumptions, direct labels, and published weights
- A second analytical surface offers separate operational-readiness, public-code-auditability, and measured-system rankings
- Workflow-fit bars visualize deterministic recommendation points, never model intelligence or benchmark performance
- Required workflow capabilities are eligibility gates. A compatible capability does not add a hidden score bonus
- Catalog layer is separate from product role: coding harness, external harness orchestrator, framework/runtime, or adjacent tool
- Default recommendation requires four source-backed coding-harness membership criteria before workflow gates are evaluated
- Workflow fit × model portability is a categorical decision matrix; it reuses fit bands and never adds a portability score
- Operational fit is evaluated across context management, permission posture, verification, observability, and recovery; any unknown scored posture leaves that comparison unranked
- Evidence coverage is displayed beside fit and never blended into the fit score
- Operational readiness uses five visible 20% weights and supports single-axis ranking
- Code auditability is tied to a pinned public commit; support-only repositories remain unranked
- Benchmark bars represent exact model-harness configurations and always expose effort, attempts, cost, date, integrity adjustment, and source
- Missing public evidence is shown as unavailable, never converted into a zero
- Every chart has a complete readable ranking and downloadable CSV data
- Compatible products stay ranked; products that miss a hard requirement appear separately and remain unranked
- The homepage directory uses capability lenses, visible result counts, an eight-profile initial view, and methodology copy next to the data
- Catalog cards expose only role, interfaces, and model-access posture; the profile owns the complete technical record
- Scientific findings are translated into plain-language decision rules with direct links to the underlying papers
- AI-assisted research may accelerate discovery, extraction, and cross-checking, but model output never counts as evidence; every published product claim requires an admitted source and verification date
- Research-product patterns may increase information density, but must never imply a generic model or harness leaderboard
- Marketing proof, principle, and repeated CTA sections do not belong on the homepage
- Catalog previews use a two-column, filterable directory layout without implying a ranking
- Mobile layouts collapse explicitly below 768px and must never scroll horizontally

## Interaction and accessibility

- Visible focus ring on every interactive element
- Hover and press feedback lasts 150ms to 220ms and only animates transform, opacity, color, or border
- Press state uses a small downward translation and scale reduction
- Motion respects `prefers-reduced-motion`
- Buttons and muted text meet WCAG AA in both themes
- The recommender exposes progress semantics and selected requirements with `aria-pressed`
- Scenario tabs use tab semantics, arrow-key navigation, visible focus, and 44px minimum targets
- Chart values are printed directly and required capability gaps include text and pattern, not color alone

## Imagery

- The homepage hero is deliberately type-led and uses no media asset
- Product identity comes from the HarnessMatch mark and first-party product logos
- Social asset: `/public/og.png`

## Avoid

- Fake product screenshots assembled from decorative interface fragments
- Cyan as a second accent, outer glow, mesh gradients, and crosshair grids
- Decorative status dots and section numbering
- Repeated split headers and three-equal-card feature sections
- Generic progress tracks or unlabeled score bars
- Wrapped desktop calls to action
- Symbol-only controls, decorative arrows, emoji icons, and typographic dash flourishes

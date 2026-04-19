# Vibe Engineering — Pillar Page Design

**Date:** 2026-04-19
**Status:** Approved for implementation
**Owner:** Felix Böhm
**Canonical source:** `orga/concepts/vibe-engineering.md`

## Purpose

A dedicated pillar page at `/vibe-engineering` (DE) and `/en/vibe-engineering` (EN) that establishes Performance Dudes' articulation of Vibe Engineering as:

- **Positioning / Credibility Signal** — we have a clear point of view on how AI is used in engineering
- **Definition-of-Record** — a stable, referenceable URL for use in proposals, LinkedIn posts, email signatures, keynote slides

The page is intentionally not a sales funnel. A single call-to-action hands off to the VibeSkills product (a PD training product currently in build-up); a secondary email link remains available for engagement inquiries.

## Non-goals

- No customer references, case studies, or attribution of specific engagements
- No internal operational details (CLAUDE.md, AGENTS.md, check.sh patterns)
- No origin story beyond the concept itself (no "where it came from" section)
- No blog infrastructure — this is a single static pillar page, not the first of a series
- No navigation entry in the site header — the page is discovered via direct link and one contextual cross-link from the homepage body text

## Audience

Primary: technical decision-makers (CTO, VP Engineering, Head of AI) evaluating whether PD's approach to AI-assisted engineering is credible.
Secondary: engineers sharing the link to explain a concept they already believe in.

Copy is CEO-readable first, technical second, matching the existing site convention.

## Routes

| Locale | URL | Component |
|---|---|---|
| DE (default) | `/vibe-engineering` | `src/app/vibe-engineering/page.tsx` → `VibeEngineeringPage` |
| EN | `/en/vibe-engineering` | `src/app/en/vibe-engineering/page.tsx` → `VibeEngineeringPage` |

Both routes render the same `VibeEngineeringPage` component and pass content via props, mirroring the existing `HomePage` pattern.

## Page structure

Six sections in order, matching the existing site's section rhythm (alternating background, checkered dividers between major visual shifts).

### 1. Hero (asphalt-dark, no overlay image)

- Eyebrow: `AI-NATIVE SOFTWARE ENGINEERING · PRAXIS` (DE) / `AI-NATIVE SOFTWARE ENGINEERING · PRACTICE` (EN)
- H1: `Vibe Engineering`
- Tagline: `Not prompting. Orchestrating.`
  - Brand rule forbids em-dashes; canonical original used one. Two sentences with periods instead.
- Lead paragraph, 2–3 sentences, canonical definition in marketing-tempo prose
- No hero button (CTA is at page end)
- Hero is visually lighter than the homepage hero. No background image, no speed-lines graphic. Typography carries the lead.

### 2. The Four Moves (light background, 2x2 card grid)

- Section label: `DIE DISZIPLIN` / `THE DISCIPLINE`
- H2: `Vier Bewegungen` / `Four Moves`
- One-line intro
- Four numbered cards in a 2x2 grid (mobile: single column). Each card: orange number (1–4), English move title, 2–3 sentence explanation in the page locale.
  1. Precision of Intent
  2. Complete Context
  3. Decomposition
  4. Verification
- Move titles stay English in both locales because they are the names used externally (slides, blog posts).

### 3. The Loop (alternate background, centered diagram)

- Section label: `WIE DIE VIER INEINANDERGREIFEN` / `HOW THE FOUR INTERLOCK`
- H2 one-liner: `Ein Durchlauf, viele Runden` / `One pass, many loops`
- Inline static SVG: four labeled nodes in sequence, forward arrows between them, a return arrow from node 4 back to node 1 above the sequence. Brand colors only (asphalt, silver, orange). No animation. `role="img"` with `aria-labelledby` pointing to a visually hidden textual description for screen readers and no-SVG contexts.
- 2–3 sentences of body text beneath the diagram: verification of one phase becomes context for the next.

### 4. Skill Progression (light background, table)

- Section label: `SKILL-PROGRESSION` / `SKILL PROGRESSION`
- H2: `Sieben Dimensionen` / `Seven Dimensions`
- 1–2 sentence intro: three foundational (non-negotiable), four progressive
- Semantic `<table>` with three columns (Pillar, Dimension, What it measures). Visually grouped into "Foundational" and "Progressive (Intermediate+ / Advanced)" sections via sub-header rows.

### 5. Vibe Coding vs. Vibe Engineering (asphalt-dark, comparison table)

- Section label: `KLARSTELLUNG` / `CLARIFICATION`
- H2: `Vibe Coding ≠ Vibe Engineering`
- 2-sentence neutral intro: the term "vibe coding" exists; this section exists to prevent confusion, not to disparage it
- Two-column `<table>` with 4–5 rows comparing axes: intent, context, progression, output handling, when each fits
- Explicit closing line that vibe coding is fine for prototypes and learning — different tool, different expectation

### 6. CTA (asphalt-dark, centered)

- Section label: `WEITER` / `NEXT`
- H2: `Vibe Engineering ist eine Fähigkeit` / `Vibe Engineering is a skill`
- Lead (1–2 sentences): like playing violin, the first notes don't sound right, it can be practiced
- Primary button (orange, filled): `Vibe Engineering lernen → vibeskills.eu` / `Learn Vibe Engineering → vibeskills.eu` (`target="_blank"` + `rel="noopener"`)
- Secondary link (silver, text-only): `Mit uns anwenden → hello@performance-dudes.de` / `Apply with us → hello@performance-dudes.de`

### Footer

Reuse existing site footer unchanged. The language switcher on this page links across locales for this page (`/vibe-engineering` ↔ `/en/vibe-engineering`), not back to home.

## Components

**Reused from `HomePage.tsx`** (extracted as needed):
- `SectionLabel` — orange eyebrow with leading bar
- `EnvelopeIcon` — already in HomePage
- Nav bar, footer, checkered dividers (reused as-is by wrapping)

**New, local to `VibeEngineeringPage.tsx`**:
- `MoveCard` — numbered card, asphalt top-border (3px), orange number top-left, title + body
- `LoopDiagram` — inline static SVG, ~320px tall, with accessibility description
- `DimensionTable` — semantic table, two visual groups
- `ComparisonTable` — two-column semantic table, Vibe Engineering column with subtle orange top-border

All styles use existing Tailwind utilities and brand tokens. No new colors, no new font sizes, no new motion patterns.

## Content model

Both locale dicts (`src/content/de.ts`, `src/content/en.ts`) gain a new top-level key `vibeEngineering`:

```
vibeEngineering: {
  hero: { eyebrow, title, tagline, lead },
  moves: { sectionLabel, title, intro, items: [{ title, body }, ...] },
  loop: { sectionLabel, title, body, srDescription },
  dimensions: { sectionLabel, title, intro, foundationalLabel, progressiveLabel, columns, rows: [{ pillar, dimension, measures, tier? }, ...] },
  comparison: { sectionLabel, title, intro, columns, rows: [{ axis, vibeCoding, vibeEngineering }, ...], closing },
  cta: { sectionLabel, title, lead, primaryLabel, primaryHref, secondaryLabel, secondaryHref },
  footer: { switchLangHref }, // "/en/vibe-engineering" on DE, "/vibe-engineering" on EN
}
```

## Metadata and SEO

- Per-route `export const metadata` in each `page.tsx`
- `title`: `Vibe Engineering — Performance Dudes`
- `description`: lead sentence, ~155 characters
- `alternates.languages` for DE and EN, plus `x-default` pointing to DE
- `alternates.canonical` per route
- OpenGraph: reuse `/og-image-text.jpg`
- JSON-LD: extend site JSON-LD with a `WebPage` or `Article` node authored by "Performance Dudes" (organizational attribution, not personalized)
- `sitemap.ts`: both URLs, `priority 0.8`, `changeFrequency: "monthly"`, hreflang alternates

## Accessibility

- Single `<h1>` per page (`Vibe Engineering`)
- Every `<section>` has `aria-labelledby` pointing to its `<h2>` (or hero's `<h1>`)
- SVG has `role="img"` and `aria-labelledby` pointing to a visually hidden text description
- Tables use `<caption class="sr-only">`, `<thead>`/`<tbody>`, proper `<th scope>` attributes
- 4.5:1 text contrast minimum (WCAG 2.1 AA)
- Focus states: 3px solid orange outline, 3px offset (matches existing site pattern)
- `prefers-reduced-motion` respected (no motion on this page anyway; scroll-reveal remains opt-in via `.fade-in` class)

## Content rules

All copy must adhere to the existing `website/CLAUDE.md` and the `brand-uix` skill:

- No em-dashes (use periods, commas, restructure)
- No emojis
- No buzzwords or AI-marketing fluff ("unlock", "harness", "revolutionary", etc.)
- No competitor bashing (the vibe-coding comparison is clarification, not attack)
- Honest about what AI does (specific verbs, no "AI-powered X")
- Short sentences
- "We" / "euer Team" voice in DE; "we" / "your team" in EN

## Scope boundaries

**In scope for this spec**:
- Two route pages + shared component
- Content in both locale dicts
- Sitemap entry
- JSON-LD extension
- One cross-link from the homepage body text to the pillar page (exact location chosen during implementation — most natural anchor is wherever "Vibe Engineering" or "AI-native" phrasing occurs in body copy)

**Out of scope**:
- Blog infrastructure
- MDX support
- Header navigation changes
- Additional pages beyond this one
- Changes to the homepage beyond the single cross-link
- New imagery, new icons, or brand asset additions

## Acceptance criteria

1. `npm run build` passes with no type or lint errors
2. Both `/vibe-engineering` and `/en/vibe-engineering` render with all six sections and all copy
3. Language switcher on each page swaps to the correct counterpart
4. Sitemap includes both new URLs with correct hreflang alternates
5. Loop SVG has a screen-reader-accessible text alternative
6. Primary CTA button opens `vibeskills.eu` in a new tab with `rel="noopener"`
7. Secondary CTA opens a `mailto:hello@performance-dudes.de` link
8. Mobile layout (320px width) has no overflow, tables scroll horizontally if needed, cards stack to one column
9. No em-dashes anywhere in the new copy
10. Homepage adds exactly one contextual text link to `/vibe-engineering`

## Commit plan

1. `feat: add vibe-engineering pillar page design spec` (this file)
2. `feat: add vibe-engineering content to locale dictionaries`
3. `feat: add VibeEngineeringPage component and routes`
4. `feat: register vibe-engineering in sitemap`
5. `feat: link to vibe-engineering from homepage body copy`

One PR, commits grouped by concern for reviewability.

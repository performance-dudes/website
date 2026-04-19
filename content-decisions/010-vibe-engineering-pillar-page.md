# 010: Vibe Engineering pillar page

## Decision

Add a dedicated static pillar page at `/vibe-engineering` (DE) and `/en/vibe-engineering` (EN) that articulates Performance Dudes' concept of Vibe Engineering. The page acts as a positioning statement and a stable, referenceable URL. It is not a sales funnel, not a blog post, and not the first of a series.

## Why

Vibe Engineering is central to how PD works and how Benjamin Linnik positions the discipline externally (for example in the TeamBank PoC presentation and via VibeSkills). A fixed URL lets us link to one canonical explanation from LinkedIn posts, email signatures, proposals, and keynote slides, instead of re-explaining the concept every time. The page also gives Vibe Coding vs. Vibe Engineering a neutral clarification surface so visitors who arrive with the wrong mental model leave with the right one.

We chose a single static pillar over a blog because we do not yet have a publishing cadence. Building blog infrastructure before we have articles to publish is premature. The page stands alone; a blog can be added later without disturbing it.

## Audience

Same primary audience as the homepage: CTOs, VPs of Engineering, heads of AI evaluating whether PD's approach is credible. Copy remains CEO-readable first, technical second. Engineers sharing the link to explain a concept they already believe in are a secondary audience that benefits from the same copy without special adjustments.

## Scope

Six sections: hero, the four moves (Precision of Intent, Complete Context, Decomposition, Verification), the loop (static SVG), seven skill-progression dimensions, a Vibe Coding vs. Vibe Engineering comparison, and a CTA.

The move titles stay in English in both locales. They are names used externally and should stay stable across languages.

## What is deliberately not on the page

- No customer references, case studies, or engagement attribution. The page sells the concept, not specific work.
- No internal operational details such as CLAUDE.md, AGENTS.md, or check.sh patterns. Those belong in the engineering repos, not on a marketing surface.
- No origin story or "where it came from" section. The concept stands on its own merits.
- No header navigation entry. The page is discovered via direct link and one contextual cross-link from the homepage body copy.

## CTA

The CTA mirrors the homepage pattern: a single orange button that opens a `mailto:hello@performance-dudes.de` link. No external links, no secondary paths.

An earlier draft handed the primary CTA off to VibeSkills (`vibeskills.eu`), a PD training product in build-up. That was dropped because the product is not yet ready to carry public traffic from the main PD site. When VibeSkills is production-ready, this page is the natural funnel to update; until then, email remains the single path and the brand's CTA rule holds without exception.

## URL and language handling

- `/vibe-engineering` — German, served as default
- `/en/vibe-engineering` — English
- Language switcher on this page swaps between the two pillar URLs, not back to the home

This mirrors the existing pattern set by decision 009.

## Relation to the canonical source

The content is derived from `orga/concepts/vibe-engineering.md`, shortened and sharpened for marketing reading speed. The orga document remains the authoritative canonical version; the website page is the public-facing distillation. If the two drift, the orga version wins and the page gets updated, not the other way around.

# 009: German as default language, content-driven i18n

## Decision

German is the default language served at `/`. English lives under `/en`. Internationalization uses plain TypeScript dictionaries per locale, no external i18n library. One shared component per page type, zero content duplication.

## Why

The primary audience is the German market, and the domain is `.de`. Leading with German removes friction for the most likely visitor. TypeScript dicts are enough for a small static site with two languages and keep the stack simple. Shared components ensure content changes only need to happen in one place per language.

## URL structure

- `/` — German home
- `/en` — English home
- `/imprint` — German Impressum
- `/en/imprint` — English imprint
- `/de`, `/impressum` — redirect to new paths for backwards compatibility

## What changed

- Content extracted from page components into `src/content/de.ts` and `src/content/en.ts`
- `HomePage` and `ImprintPage` are shared components that receive content as props
- `src/app/layout.tsx` sets `lang="de"` as default

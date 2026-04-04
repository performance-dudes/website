# Performance Dudes Website

Next.js 15, TypeScript, Tailwind CSS 4. Static export.

## Setup

```
npm install
```

## Development

```
npm run dev
```

Opens at http://localhost:3000

## Deployment

Deployed to GitHub Pages at [performance-dudes.de](https://performance-dudes.de) on every push to main.

### Required setup

- GitHub Pages enabled on this repo (source: GitHub Actions)
- Custom domain `performance-dudes.de` configured in repo settings and DNS

## Structure

```
src/
  app/
    layout.tsx          Root layout, metadata, global styles
    HomePage.tsx        Shared home page component
    ImprintPage.tsx     Shared imprint page component
    page.tsx            Home (DE, default)
    imprint/page.tsx    Impressum (DE)
    en/
      page.tsx          Home (EN)
      imprint/page.tsx  Imprint (EN)
    de/page.tsx         Redirect → /
    impressum/page.tsx  Redirect → /imprint
  content/
    de.ts               German content dictionary
    en.ts               English content dictionary
    index.ts            Locale config and lookup
```

## Content

Content decisions are documented in `content-decisions/`. Each decision records what was decided, why, and what it aligns to.

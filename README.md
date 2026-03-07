# Performance Dudes Website

Next.js 15, TypeScript, Tailwind CSS 4.

## Setup

```
npm install
```

## Development

```
npm run dev
```

Opens at http://localhost:3000

## Build

```
npm run build
npm start
```

## Structure

```
src/app/
  layout.tsx        Root layout, metadata, global styles
  page.tsx          Home page (all main content)
  globals.css       Tailwind import
  imprint/
    page.tsx        Legal imprint page
```

## Content

Content decisions are documented in `CONTENT-DECISIONS.md`. All website copy aligns to brand and strategy docs in the [orga repo](https://github.com/performance-dudes/orga):

- `docs/mission.md`, `docs/vision.md`, `docs/principles.md` -> brand voice
- `strategy/offering-model.md` -> product descriptions
- `brand/racing-car-analogy.md` -> core metaphor

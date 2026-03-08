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
  page.tsx          Home page (EN)
  globals.css       Tailwind import
  de/
    page.tsx        Home page (DE)
  imprint/
    page.tsx        Legal imprint (EN)
  impressum/
    page.tsx        Legal imprint (DE)
```

## Content

Content decisions are documented in `content-decisions/`. Each decision records what was decided, why, and what it aligns to.

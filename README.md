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

Two environments, both served via GitHub Pages:

| Environment | URL | Repo | Trigger |
|---|---|---|---|
| Staging | `performance-dudes.github.io/website` | this repo | push to main |
| Production | `performance-dudes.de` | `performance-dudes.github.io` | git tag `v*` |

### How it works

1. **Push to main** runs lint + build with `basePath: "/website"` and deploys to staging automatically.
2. **Tagging a release** triggers a second build without basePath and pushes directly to the [prod repo](https://github.com/performance-dudes/performance-dudes.github.io) main branch.

The `basePath` is controlled via the `NEXT_PUBLIC_BASE_PATH` env var. It defaults to `/website` (staging). The prod build sets it to `""`.

### Releasing to production

```
git tag v1.0.0
git push origin v1.0.0
```

### Required setup

- `PROD_DEPLOY_KEY` secret in this repo: private key of an SSH deploy key with write access on the prod repo
- GitHub Pages enabled in both repos (this repo: workflow-based, prod repo: deploy from branch main)
- DNS A records for `performance-dudes.de` pointing to GitHub Pages IPs

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

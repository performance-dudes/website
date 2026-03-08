# Claude Code Instructions

## Project

Performance Dudes marketing website. Next.js 15 + TypeScript + Tailwind CSS 4.

## Key files

- `src/app/page.tsx` - Home page with all main content
- `src/app/imprint/page.tsx` - Legal imprint
- `src/app/layout.tsx` - Root layout and metadata
- `content-decisions/` - Documents all content choices and their rationale

## Content rules

- All copy must align to identity and strategy docs in the orga repo
- Speak about us, not against competitors
- CEO-readable first, technical second
- No em dashes. Use periods, commas, or restructure the sentence.
- No emojis unless explicitly requested
- Broader than software dev: we serve engineering, operations, security, and non-IT teams
- Honest tone: say what AI can and can't do

## Code rules

- Keep it simple. Content-first, minimal abstractions.
- No component library yet. Plain Tailwind on semantic HTML.
- Static pages only for now. No client-side state, no API routes.
- German legal requirements: imprint page must stay TMG-compliant.

## Workflow

- Use PRs, never push directly to main
- Commits follow semantic PR conventions
- Content changes should reference the relevant content decision or orga doc

# OG-Bild-Generator

Reproduzierbare Erzeugung des Social-/OpenGraph-Bilds
`public/og-image-text.{png,jpg}` (1200×630) für performance-dudes.de.

Kein Pixel-Editing, kein Gemini-Einmalbild: das Bild ist **Code**. Quelle ist ein
HTML-Template, gerendert von einem projekt-lokalen Chromium.

## Slogan/Tagline ändern

1. `og-template.html` öffnen und die Texte im markierten Block (`eyebrow`,
   `title`, `tagline`) anpassen. Der hervorgehobene Beat steht in `<u>…</u>`.
2. Neu rendern:
   ```bash
   npm run og
   ```
   Schreibt `public/og-image-text.png` (Master) **und** `public/og-image-text.jpg`
   (in den `<meta>`-Tags referenziert).

> Tagline-Quelle der Website selbst ist `src/content/{de,en}.ts` (`hero.tagline` +
> `hero.taglineHighlight`). Beim Slogan-Wechsel beide Orte angleichen — hier den
> Pixel, dort den gerenderten Hero.

## Einrichtung (einmalig)

Deps sind **projekt-lokal** (nichts landet global, System bleibt sauber — das
Node-Äquivalent zu einem `.venv`):

```bash
npm install                                         # node_modules/ (gitignored)
PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium   # Browser IN node_modules/
```

`PLAYWRIGHT_BROWSERS_PATH=0` legt den Chromium in `node_modules` statt in den
globalen `~/.cache` — voll projekt-lokal und mit `node_modules` gitignored. Der
Generator setzt dieselbe Variable beim Lauf selbst, findet den Browser also ohne
weiteres Zutun.

## Ohne den Generator (Fallback)

`og-template.html` ist self-contained — in Chrome öffnen, Viewport/Screenshot
exakt auf 1200×630, als `public/og-image-text.png` speichern, JPG daraus
exportieren.

## Design

Spiegelt die Hero-Section (`src/app/globals.css`, `src/app/HomePage.tsx`): Navy
`#1A1A2E`, Orange `#EA580C`, System-Font-Stack, Speed-Lines + Checkered-Flag-
Akzent. So bleibt das Social-Bild optisch deckungsgleich mit der Landingpage.

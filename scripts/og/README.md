# OG-Bild-Generator

Reproduzierbare Erzeugung des Social-/OpenGraph-Bilds
`public/og-image-text.{png,jpg}` (1200×630) für performance-dudes.de.

Kein Pixel-Editing, kein Gemini-Neugenerieren: das Bild ist **Code**. Der
Hintergrund ist das bestehende, textlose Marken-Bild `public/og-image.png`
(asphalt-navy, Checkered-Flag, orange Speed-Lines); ein HTML-Template legt nur den
**Text als Overlay** darüber und wird von einem projekt-lokalen Chromium gerendert.
Der Hintergrund bleibt unangetastet — bei einem Slogan-Wechsel ändert sich
ausschließlich der Text.

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

Hintergrund ist das Marken-Bild `public/og-image.png` (asphalt-navy,
Checkered-Flag, orange Speed-Lines). Darüber ein von links nach rechts
auslaufender Navy-Verlauf, damit der helle Text links lesbar bleibt und die Flag
rechts frei sichtbar ist. Typografie spiegelt die Hero-Section
(`src/app/HomePage.tsx`): Orange `#EA580C` nur als Akzent — der Slogan hell, nur
der betonte Beat orange + unterstrichen. So bleibt das Social-Bild optisch
deckungsgleich mit der Landingpage.

**Hintergrund wechseln** (selten): `public/og-image.png` austauschen — das
Template referenziert es relativ (`url(../../public/og-image.png)`).

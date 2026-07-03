#!/usr/bin/env node
// Reproduzierbarer OG-Bild-Generator für performance-dudes.de.
//
// Rendert scripts/og/og-template.html (1200x630) mit einem projekt-lokalen
// Chromium (Playwright) und schreibt beide ausgelieferten Assets in public/:
//   og-image-text.png  (Master, verlustfrei)
//   og-image-text.jpg  (in den <meta>-Tags referenziert)
//
// ISOLATION (".venv für Node"): Playwright ist eine devDependency in
// node_modules (gitignored). Der Browser liegt via PLAYWRIGHT_BROWSERS_PATH=0
// EBENFALLS in node_modules — nichts landet global, das System bleibt sauber.
//
// Slogan ändern:  scripts/og/og-template.html editieren, dann:  npm run og
//
// Erststart (einmalig, projekt-lokaler Browser):
//   npm install
//   PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium

// Browser projekt-lokal aus node_modules laden (nicht aus ~/.cache). Muss VOR dem
// playwright-Import gesetzt sein → dynamischer Import darunter.
process.env.PLAYWRIGHT_BROWSERS_PATH = process.env.PLAYWRIGHT_BROWSERS_PATH ?? "0";

import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const template = join(here, "og-template.html");
const publicDir = join(here, "..", "..", "public");

// Zwei Schriftgrößen-Varianten, beide in einem Lauf:
//   big     → og-image-text.png/.jpg          (Live-OG, im <meta> referenziert)
//   compact → og-image-text-compact.png/.jpg  (kleinere Schrift wie das Original)
const variants = [
  { size: "big", base: "og-image-text" },
  { size: "compact", base: "og-image-text-compact" },
];

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("✗ Playwright fehlt. Einmalig einrichten:\n    npm install\n    PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium");
  process.exit(1);
}

console.log(`→ rendere ${template} (1200x630, big + compact) …`);
const browser = await chromium.launch();
try {
  for (const { size, base } of variants) {
    const page = await browser.newPage({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 1, // deterministische Pixelmaße, unabhängig vom Host-Display
    });
    await page.goto(pathToFileURL(template).href, { waitUntil: "networkidle" });
    if (size === "compact") await page.evaluate(() => document.body.classList.add("compact"));
    // PNG (Master) + JPG (ausgeliefert) direkt aus Playwright — kein ImageMagick nötig.
    const png = join(publicDir, `${base}.png`);
    const jpg = join(publicDir, `${base}.jpg`);
    await page.screenshot({ path: png, type: "png" });
    await page.screenshot({ path: jpg, type: "jpeg", quality: 90 });
    await page.close();
    console.log(`✓ ${size.padEnd(7)} → ${png} + .jpg`);
  }
} finally {
  await browser.close();
}

console.log("Fertig. big → og-image-text.{png,jpg}, compact → og-image-text-compact.{png,jpg}");

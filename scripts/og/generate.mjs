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
const outPng = join(publicDir, "og-image-text.png");
const outJpg = join(publicDir, "og-image-text.jpg");

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("✗ Playwright fehlt. Einmalig einrichten:\n    npm install\n    PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium");
  process.exit(1);
}

console.log(`→ rendere ${template} (1200x630) …`);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1, // deterministische Pixelmaße, unabhängig vom Host-Display
  });
  await page.goto(pathToFileURL(template).href, { waitUntil: "networkidle" });
  // PNG (Master) + JPG (ausgeliefert) direkt aus Playwright — kein ImageMagick nötig.
  await page.screenshot({ path: outPng, type: "png" });
  await page.screenshot({ path: outJpg, type: "jpeg", quality: 90 });
} finally {
  await browser.close();
}

console.log(`✓ ${outPng}`);
console.log(`✓ ${outJpg}`);
console.log("Fertig. Beide Dateien in public/ aktualisiert.");

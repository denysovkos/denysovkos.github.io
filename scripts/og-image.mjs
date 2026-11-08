// Renders a 1200x630 Open Graph image for a post with Playwright, in the site's style.
// Playwright is optional: without it the post falls back to the site-wide /og.png.
// CI installs it with "npm i --no-save playwright && npx playwright install --with-deps chromium".

import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from './templates.mjs';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadPlaywright() {
  try { return require('playwright'); } catch { return null; }
}

function html(post) {
  const date = new Date(post.date + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:S;src:url(file://${ROOT}/fonts/instrument-serif-400.woff2)}
@font-face{font-family:I;font-weight:400;src:url(file://${ROOT}/fonts/inter-400.woff2)}
@font-face{font-family:I;font-weight:600;src:url(file://${ROOT}/fonts/inter-600.woff2)}
@font-face{font-family:M;src:url(file://${ROOT}/fonts/jetbrains-mono-400.woff2)}
*{box-sizing:border-box}html,body{margin:0}
body{width:1200px;height:630px;background:#FAF8F4;color:#14161A;font-family:I;position:relative;overflow:hidden;
background-image:radial-gradient(rgba(20,22,26,.09) 1.2px,transparent 1.2px);background-size:24px 24px}
.card{position:absolute;inset:48px;background:#fff;border:1px solid #E6E2DA;border-radius:24px;padding:56px 64px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:center;font-family:M;font-size:22px;color:#5B616B;letter-spacing:.06em;text-transform:uppercase}
.top b{color:#1D4ED8;font-weight:400}
h1{font-family:S;font-weight:400;font-size:84px;line-height:1.02;margin:auto 0 0;letter-spacing:-.01em;max-width:960px}
.k{display:inline-block;position:relative;z-index:0;font-family:S;font-size:52px;margin-top:18px;color:#14161A}
.k::after{content:"";position:absolute;left:-4px;right:-4px;bottom:6px;height:14px;background:#F2B705;border-radius:4px;z-index:-1}
.foot{display:flex;align-items:center;gap:18px;margin-top:40px;font-size:24px;color:#5B616B}
.foot b{color:#14161A;font-weight:600}
.tile{width:56px;height:56px;border-radius:14px;background:#14161A;position:relative}
.tile::before{content:"K";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#FAF8F4;font-family:I;font-weight:600;font-size:30px}
</style></head><body><div class="card">
<div class="top"><span><b>&gt;_</b> denysov.me/blog</span><span>${esc(date)} · ${post.minutes} min read</span></div>
<h1>${esc(post.ogTitle)}</h1>
${post.ogKicker ? `<div><span class="k">${esc(post.ogKicker)}</span></div>` : ''}
<div class="foot"><span class="tile"></span><span><b>Kostiantyn Denysov</b> · Technical Lead, Berlin</span></div>
</div></body></html>`;
}

export async function renderOgImage(post) {
  const pw = loadPlaywright();
  if (!pw) {
    console.warn(`! playwright not found, ${post.slug} uses the default og.png`);
    return null;
  }
  const opts = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
  const browser = await pw.chromium.launch(opts);
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    // Loaded from a temp file, not setContent, so the file:// font URLs are allowed.
    const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'og-')), 'og.html');
    fs.writeFileSync(tmp, html(post));
    await page.goto('file://' + tmp, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    return await page.screenshot({ type: 'png' });
  } finally {
    await browser.close();
  }
}

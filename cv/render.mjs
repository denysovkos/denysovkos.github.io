// Renders cv/cv.html to denysov_k_cv.pdf. Usage: node cv/render.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + path.join(dir, 'cv.html'), { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: path.join(dir, '..', 'denysov_k_cv.pdf'), format: 'A4', preferCSSPageSize: true, printBackground: true });
await browser.close();

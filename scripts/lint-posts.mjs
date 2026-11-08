// Checks posts against content/STYLE.md: the rules a script can check.
//   npm run lint:posts            all posts
//   npm run lint:posts -- <file>  one post
// Exit code 1 on errors. Warnings are printed but do not fail.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'content', 'posts');
const files = process.argv.slice(2).length ? process.argv.slice(2).map((f) => path.resolve(f)) : fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).map((f) => path.join(DIR, f));

// Phrases that make text read as generated, or that STE replaces with a simpler word.
const BANNED = [
  "in today's", 'fast-paced', 'ever-evolving', 'ever-changing', "let's dive", 'dive in', 'dive into', 'deep dive', 'delve', 'tapestry', 'landscape', 'realm',
  'navigate', 'navigating', 'leverage', 'leveraging', 'utilize', 'utilise', 'robust', 'seamless', 'seamlessly', 'cutting-edge', 'game-changer', 'game changer',
  'unlock', 'unleash', 'empower', 'elevate', 'harness', 'foster', 'paramount', 'pivotal', 'crucial', 'vital', 'myriad', 'plethora', 'embark', 'testament',
  'synergy', 'holistic', 'transformative', 'revolutionize', 'revolutionise', 'supercharge', 'in conclusion', 'to sum up', 'at the end of the day',
  'the bottom line', 'happy coding', "it's important to note", 'it is important to note', "it's worth noting", 'it is worth noting', 'worth mentioning',
  'moreover', 'furthermore', 'additionally', 'notably', 'ultimately', 'in this article', 'in this post, we', 'have you ever wondered', 'not only',
  "it's not just", 'it is not just', 'facilitate', 'commence', 'endeavor', 'endeavour', 'streamline', 'meticulous', 'intricate', 'nuanced', 'bustling',
  'whether you\'re', 'whether you are a', 'look no further', 'buckle up', 'stay tuned', 'a testament to', 'serves as a', 'plays a crucial role',
];
const EMPLOYER = /\bdeel\b/i;
const MAX_WORDS = 25;
const MAX_SENTENCES = 6;

let errors = 0;
let warnings = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const src = fs.readFileSync(file, 'utf8');
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!fm) { console.error(`${rel}: no front-matter`); errors++; continue; }
  const meta = Object.fromEntries(fm[1].split(/\r?\n/).filter((l) => l.includes(':')).map((l) => [l.slice(0, l.indexOf(':')).trim(), l.slice(l.indexOf(':') + 1).trim()]));
  const body = fm[2];
  const err = (msg) => { console.error(`  error  ${msg}`); errors++; };
  const warn = (msg) => { console.warn(`  warn   ${msg}`); warnings++; };
  console.log(rel);

  const d = (meta.description || '').length;
  if (d < 110 || d > 160) warn(`description is ${d} characters, aim for 120 to 155`);
  const t = (meta.seoTitle || meta.title || '').length;
  if (t > 62) warn(`title tag is ${t} characters, aim for under 60 (use seoTitle)`);

  // Prose only: drop code blocks, inline code, HTML comments, link targets.
  const prose = body.replace(/```[\s\S]*?```/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/`[^`]*`/g, 'CODE').replace(/\]\([^)]*\)/g, ']');
  const lines = prose.split(/\r?\n/);

  const words = prose.split(/\s+/).filter(Boolean).length;
  if (words < 600 || words > 1400) warn(`${words} words, aim for 700 to 1,200`);

  const lower = prose.toLowerCase();
  for (const b of BANNED) {
    const re = new RegExp(`(^|[^a-z])${b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z]|$)`, 'i');
    if (re.test(lower)) err(`banned phrase "${b}"`);
  }
  if (EMPLOYER.test(src)) err('mentions the employer by name');
  if (/—/.test(prose)) err('em dash (—), use a full stop or a comma');
  if (/\s–\s/.test(prose)) err('en dash used as a dash, use a full stop or a comma');
  lines.forEach((l, i) => { if (!/^\s*\|/.test(l) && /;/.test(l)) err(`line ${i + 1}: semicolon`); });
  const bold = (prose.match(/\*\*[^*]+\*\*/g) || []).length;
  if (bold > 2) warn(`${bold} bold phrases, use at most 2`);
  if (/\p{Extended_Pictographic}/u.test(prose)) warn('emoji in the body');
  const questions = (prose.match(/\?\s/g) || []).length;
  if (questions > 6) warn(`${questions} questions, avoid a rhetorical question in every section`);
  if (/<!--\s*AUTHOR:/.test(body)) warn('has AUTHOR placeholders, list them in the PR');

  // Paragraphs and sentences.
  const paras = prose.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !/^(#|[-*] |\d+\. |\||>)/.test(p));
  let longest = 0;
  for (const p of paras) {
    const text = p.replace(/\s+/g, ' ');
    const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z0-9"“(\[])/).filter((s) => s.trim());
    if (sentences.length > MAX_SENTENCES) err(`paragraph with ${sentences.length} sentences (max ${MAX_SENTENCES}): "${text.slice(0, 60)}..."`);
    for (const s of sentences) {
      const n = s.split(/\s+/).filter(Boolean).length;
      longest = Math.max(longest, n);
      if (n > MAX_WORDS) err(`sentence with ${n} words (max ${MAX_WORDS}): "${s.slice(0, 80)}..."`);
    }
    // Passive voice, rough check.
    const passive = text.match(/\b(is|are|was|were|be|been|being)\s+(\w+ly\s+)?\w+(ed|en)\b(?!\s+(up|out))/gi) || [];
    for (const m of passive) if (!/\b(is|are|was|were|be|been)\s+(used|tired|interested|done|ready|open|broken|written)\b/i.test(m)) warn(`possible passive voice: "${m}"`);
  }

  // Rhythm: generated text has very even sentence lengths.
  const all = paras.flatMap((p) => p.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/)).map((s) => s.split(/\s+/).length).filter((n) => n > 0);
  if (all.length > 10) {
    const mean = all.reduce((a, b) => a + b, 0) / all.length;
    const sd = Math.sqrt(all.reduce((a, b) => a + (b - mean) ** 2, 0) / all.length);
    if (sd < 3.5) warn(`sentence lengths are very even (sd ${sd.toFixed(1)}), mix short and long sentences`);
  }
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);

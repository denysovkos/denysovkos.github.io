// Creates a new post file with front-matter.
//   npm run new -- "My post title" [YYYY-MM-DD]
// Without a date, the post is scheduled for next Monday (Europe/Berlin).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [title, dateArg] = process.argv.slice(2);
if (!title) { console.error('Usage: npm run new -- "Post title" [YYYY-MM-DD]'); process.exit(1); }

function nextMonday() {
  const now = new Date(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(new Date()) + 'T12:00:00Z');
  const add = ((8 - now.getUTCDay()) % 7) || 7;
  now.setUTCDate(now.getUTCDate() + add);
  return now.toISOString().slice(0, 10);
}
const date = dateArg || nextMonday();
const slug = title.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const file = path.join(ROOT, 'content', 'posts', `${date}-${slug}.md`);
if (fs.existsSync(file)) { console.error(`Exists: ${file}`); process.exit(1); }
fs.writeFileSync(file, `---
title: ${title}
description: One or two sentences, at most 155 characters. This is the Google snippet and the social preview text.
date: ${date}
tags: Engineering
keywords:
draft: true
---

First paragraph. Say what the reader gets from this post.

## First section
`);
console.log(`Created ${path.relative(ROOT, file)} (draft, date ${date}). Remove "draft: true" when it is ready.`);

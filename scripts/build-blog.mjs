// Builds the blog from content/posts/*.md into static HTML.
//
//   node scripts/build-blog.mjs           build everything
//   node scripts/build-blog.mjs --check   fail if the committed output is out of date (CI)
//   node scripts/build-blog.mjs --drafts  also build drafts and future-dated posts (local preview only)
//
// Output: blog/index.html, blog/<slug>/index.html, blog/<slug>/og.png, blog/feed.xml,
// sitemap.xml, plus the generated regions of index.html and llms.txt.
// A post with a future date stays unpublished until a build runs on or after that date
// (Europe/Berlin), which the scheduled GitHub Action does every morning.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';
import { renderOgImage } from './og-image.mjs';
import * as T from './templates.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const args = new Set(process.argv.slice(2));
const CHECK = args.has('--check');
const DRAFTS = args.has('--drafts');

export const SITE = {
  url: 'https://denysov.me',
  name: 'Kostiantyn Denysov',
  blogTitle: 'Blog · Kostiantyn Denysov',
  blogHeading: 'Notes on shipping software',
  blogDescription: 'Short, practical posts on release engineering, developer experience, engineering leadership and building with AI. By Kostiantyn Denysov, Berlin.',
  author: 'Kostiantyn Denysov',
  locale: 'en_US',
  lang: 'en',
};

/* ---------- helpers ---------- */

function todayBerlin() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function slugify(s) {
  return s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Front-matter: a small "key: value" subset of YAML. Lists are comma-separated.
function parseFrontMatter(src, file) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing front-matter`);
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const i = line.indexOf(':');
    if (i < 0) throw new Error(`${file}: bad front-matter line "${line}"`);
    let v = line.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    data[line.slice(0, i).trim()] = v;
  }
  return { data, body: m[2] };
}

const list = (v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : []);

function loadPosts() {
  const today = todayBerlin();
  const files = fs.existsSync(POSTS_DIR) ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md')) : [];
  const posts = [];
  const seen = new Set();
  for (const f of files) {
    const { data, body } = parseFrontMatter(fs.readFileSync(path.join(POSTS_DIR, f), 'utf8'), f);
    for (const k of ['title', 'description', 'date']) if (!data[k]) throw new Error(`${f}: "${k}" is required`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error(`${f}: date must be YYYY-MM-DD`);
    if (data.description.length > 170) console.warn(`! ${f}: description is ${data.description.length} chars, Google shows about 155`);
    const draft = data.draft === 'true';
    const scheduled = data.date > today;
    if ((draft || scheduled) && !DRAFTS) {
      console.log(`- skip ${f} (${draft ? 'draft' : 'scheduled for ' + data.date})`);
      continue;
    }
    const slug = data.slug || slugify(f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''));
    if (seen.has(slug)) throw new Error(`duplicate slug "${slug}"`);
    seen.add(slug);
    const { html, toc, words } = renderMarkdown(body);
    const tags = list(data.tags);
    posts.push({
      file: f,
      slug,
      title: data.title,
      seoTitle: data.seoTitle || data.title,
      description: data.description,
      date: data.date,
      updated: data.updated || data.date,
      tags,
      keywords: list(data.keywords).length ? list(data.keywords) : tags,
      ogTitle: data.ogTitle || data.title,
      ogKicker: data.ogKicker || '',
      url: `${SITE.url}/blog/${slug}/`,
      path: `/blog/${slug}/`,
      html,
      toc,
      words,
      minutes: Math.max(1, Math.round(words / 220)),
    });
  }
  return posts.sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)));
}

/* ---------- markdown ---------- */

function renderMarkdown(md) {
  const toc = [];
  const ids = new Set();
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth, text }) {
        const inner = this.parser.parseInline(tokens);
        let id = slugify(text.replace(/<[^>]+>/g, '')) || 'section';
        while (ids.has(id)) id += '-x';
        ids.add(id);
        if (depth === 2) toc.push({ id, text: inner.replace(/<[^>]+>/g, '') });
        // Body headings start at h2: the post title is the only h1 on the page.
        const level = Math.max(2, depth);
        return `<h${level} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${inner}</h${level}>\n`;
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href) && !href.startsWith(SITE.url);
        const t = title ? ` title="${T.esc(title)}"` : '';
        return `<a href="${T.esc(href)}"${t}${external ? ' rel="noopener"' : ''}>${inner}</a>`;
      },
      image({ href, title, text }) {
        const t = title ? ` title="${T.esc(title)}"` : '';
        return `<img src="${T.esc(href)}" alt="${T.esc(text)}"${t} loading="lazy" decoding="async">`;
      },
    },
  });
  const html = marked.parse(md);
  const words = md.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`\[\]()!-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return { html, toc, words };
}

/* ---------- write with --check support ---------- */

const changed = [];
function write(rel, content) {
  const abs = path.join(ROOT, rel);
  const prev = fs.existsSync(abs) ? fs.readFileSync(abs) : null;
  const next = Buffer.isBuffer(content) ? content : Buffer.from(content);
  if (prev && prev.equals(next)) return;
  changed.push(rel);
  if (CHECK) return;
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, next);
}

function replaceRegion(rel, name, inner) {
  const abs = path.join(ROOT, rel);
  const src = fs.readFileSync(abs, 'utf8');
  const re = new RegExp(`([ \\t]*<!-- ${name}:start[^>]*-->)[\\s\\S]*?(<!-- ${name}:end -->)`);
  if (!re.test(src)) throw new Error(`${rel}: markers for "${name}" not found`);
  write(rel, src.replace(re, (_, a, b) => `${a}\n${inner}\n${b}`));
}
function replaceRegionTxt(rel, name, inner) {
  const abs = path.join(ROOT, rel);
  const src = fs.readFileSync(abs, 'utf8');
  const re = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(<!-- ${name}:end -->)`);
  if (!re.test(src)) throw new Error(`${rel}: markers for "${name}" not found`);
  write(rel, src.replace(re, (_, a, b) => `${a}\n${inner}\n${b}`));
}

/* ---------- build ---------- */

const posts = loadPosts();
console.log(`${posts.length} published post(s)`);

// Remove generated folders of posts that no longer exist (renamed slug, unpublished).
const blogDir = path.join(ROOT, 'blog');
if (fs.existsSync(blogDir)) {
  const keep = new Set(posts.map((p) => p.slug));
  for (const d of fs.readdirSync(blogDir, { withFileTypes: true })) {
    if (d.isDirectory() && !keep.has(d.name)) {
      changed.push(`blog/${d.name}/ (removed)`);
      if (!CHECK) fs.rmSync(path.join(blogDir, d.name), { recursive: true });
    }
  }
}

for (const [i, post] of posts.entries()) {
  const newer = posts[i - 1] || null;
  const older = posts[i + 1] || null;
  const related = posts.filter((p) => p !== post).map((p) => ({ p, score: p.tags.filter((t) => post.tags.includes(t)).length })).sort((a, b) => b.score - a.score || b.p.date.localeCompare(a.p.date)).slice(0, 3).map((x) => x.p);
  const ogRel = `blog/${post.slug}/og.png`;
  if (!fs.existsSync(path.join(ROOT, ogRel)) && !CHECK) {
    const png = await renderOgImage(post);
    if (png) write(ogRel, png);
  }
  post.image = fs.existsSync(path.join(ROOT, ogRel)) ? `${SITE.url}/${ogRel}` : `${SITE.url}/og.png`;
  write(`blog/${post.slug}/index.html`, T.postPage(SITE, post, { newer, older, related }));
}

write('blog/index.html', T.blogIndex(SITE, posts));
write('blog/feed.xml', T.atomFeed(SITE, posts));
write('sitemap.xml', T.sitemap(SITE, posts));
replaceRegion('index.html', 'blog:latest', T.homeLatest(posts));
replaceRegionTxt('llms.txt', 'blog', T.llmsBlog(SITE, posts));

// The homepage writing section stays hidden until there is at least one post.
{
  const abs = path.join(ROOT, 'index.html');
  const src = fs.readFileSync(abs, 'utf8');
  const re = /(<section class="sec no-print" id="writing"[^>]*?)( hidden)?>/;
  const next = src.replace(re, (_, a) => `${a}${posts.length ? '' : ' hidden'}>`);
  if (next !== src) write('index.html', next);
}

if (CHECK) {
  if (changed.length) {
    console.error('Generated files are out of date. Run "npm run build" and commit:\n  ' + changed.join('\n  '));
    process.exit(1);
  }
  console.log('Generated files are up to date.');
} else {
  console.log(changed.length ? 'Updated:\n  ' + changed.join('\n  ') : 'Nothing changed.');
}

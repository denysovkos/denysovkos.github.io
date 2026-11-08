// HTML and XML templates for the blog. Pure functions: data in, string out.

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const xml = esc;
const json = (o) => JSON.stringify(o, null, 1).replace(/</g, '\\u003c');

const CAL = 'https://cal.com/kostiantyn-denysov-soycqg/15min?user=kostiantyn-denysov-soycqg&amp;overlayCalendar=true';

export function humanDate(iso) {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
// Midday Berlin time, so the date is the same in every time zone that matters to readers.
const isoDateTime = (d) => `${d}T09:00:00+01:00`;

function personNode(site) {
  return {
    '@type': 'Person',
    '@id': `${site.url}/#person`,
    name: site.author,
    url: `${site.url}/`,
    image: `${site.url}/og.png`,
    jobTitle: 'Technical Lead',
    worksFor: { '@type': 'Organization', name: 'Deel', url: 'https://www.deel.com' },
    sameAs: ['https://www.linkedin.com/in/denysovkos/', 'https://github.com/denysovkos'],
  };
}

/* ---------- shared chrome ---------- */

function head(site, m) {
  const tags = (m.tags || []).map((t) => `<meta property="article:tag" content="${esc(t)}">`).join('\n');
  return `<!doctype html>
<html lang="${site.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(m.title)}</title>
<meta name="description" content="${esc(m.description)}">
<meta name="author" content="${esc(site.author)}">
${m.keywords?.length ? `<meta name="keywords" content="${esc(m.keywords.join(', '))}">\n` : ''}<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="${m.url}">
<link rel="alternate" type="application/atom+xml" title="${esc(site.blogTitle)}" href="${site.url}/blog/feed.xml">
<link rel="sitemap" type="application/xml" href="${site.url}/sitemap.xml">
<link rel="me" href="https://www.linkedin.com/in/denysovkos/">
<link rel="me" href="https://github.com/denysovkos">
<meta name="theme-color" content="#FAF8F4">
<meta name="color-scheme" content="light dark">
<meta name="format-detection" content="telephone=no">

<meta property="og:type" content="${m.ogType}">
<meta property="og:locale" content="${site.locale}">
<meta property="og:url" content="${m.url}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(m.ogTitle || m.title)}">
<meta property="og:description" content="${esc(m.description)}">
<meta property="og:image" content="${m.image}">
<meta property="og:image:secure_url" content="${m.image}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(m.imageAlt)}">
${m.ogType === 'article' ? `<meta property="article:published_time" content="${isoDateTime(m.date)}">
<meta property="article:modified_time" content="${isoDateTime(m.updated)}">
<meta property="article:author" content="${site.url}/">
<meta property="article:section" content="${esc(m.tags?.[0] || 'Engineering')}">
${tags}
` : ''}<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(m.ogTitle || m.title)}">
<meta name="twitter:description" content="${esc(m.description)}">
<meta name="twitter:image" content="${m.image}">
<meta name="twitter:image:alt" content="${esc(m.imageAlt)}">
${m.minutes ? `<meta name="twitter:label1" content="Reading time">
<meta name="twitter:data1" content="${m.minutes} min read">
<meta name="twitter:label2" content="Written by">
<meta name="twitter:data2" content="${esc(site.author)}">
` : ''}
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">

<script>
/* Applies a saved manual theme before first paint, flags JS for reveal styles. */
(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);}catch(e){}})();
</script>
<link rel="preload" href="/fonts/instrument-serif-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/style.css">
<link rel="stylesheet" href="/blog.css">
<script src="/script.js" defer></script>

<script type="application/ld+json">
${json({ '@context': 'https://schema.org', '@graph': m.graph })}
</script>
</head>`;
}

const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <symbol id="k-mark" viewBox="0 0 48 48">
    <mask id="k-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
      <rect width="48" height="48" fill="#fff"/>
      <rect x="12" y="10" width="6.5" height="28" fill="#000"/>
      <polygon points="21,24 31,10 38.5,10 28.5,24 38.5,38 31,38" fill="#000"/>
    </mask>
    <rect width="48" height="48" rx="12" fill="var(--logo-tile)" mask="url(#k-cut)"/>
    <rect x="36" y="8" width="4" height="4" fill="#7AA2FF"/>
    <rect x="36" y="36" width="4" height="4" fill="#F5C542"/>
  </symbol>
</svg>`;

function header(isIndex) {
  const cur = isIndex ? ' aria-current="page"' : ' aria-current="true"';
  return `${SPRITE}

<a class="skip" href="#main">Skip to content</a>

<header class="head">
  <div class="wrap head-in">
    <a class="brand" href="/">
      <svg class="logo" aria-hidden="true"><use href="#k-mark"/></svg>
      <span class="brand-name"><b>K. Denysov</b><span><i>&gt;_</i> technical lead</span></span>
    </a>
    <nav class="nav" aria-label="Primary">
      <a class="navlink" href="/#work">Work</a>
      <a class="navlink" href="/#experience">Experience</a>
      <a class="navlink" href="/#projects">Projects</a>
      <a class="navlink is-active" href="/blog/"${cur}>Blog</a>
      <a class="navlink" href="/#contact">Contact</a>
    </nav>
    <div class="head-actions">
      <button class="icon-btn theme-head" type="button" data-theme-toggle aria-label="Switch theme">
        <svg class="i-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>
        <svg class="i-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      </button>
      <a class="btn btn-primary btn-sm" href="${CAL}" target="_blank" rel="noopener">Book a call</a>
      <button class="icon-btn menu-btn" type="button" data-menu-btn aria-expanded="false" aria-controls="sheet">Menu</button>
    </div>
  </div>
  <div class="sheet" id="sheet" hidden>
    <a href="/#work"><span>Work</span><span class="mono muted" aria-hidden="true">01</span></a>
    <a href="/#experience"><span>Experience</span><span class="mono muted" aria-hidden="true">03</span></a>
    <a href="/#projects"><span>Projects</span><span class="mono muted" aria-hidden="true">04</span></a>
    <a href="/blog/"><span>Blog</span><span class="mono muted" aria-hidden="true">07</span></a>
    <a href="/#contact"><span>Contact</span><span class="mono muted" aria-hidden="true">08</span></a>
    <div class="sheet-row"><span class="mono">Theme</span><button class="icon-btn" type="button" data-theme-toggle aria-label="Switch theme" style="width:auto;padding:0 16px;font-family:var(--mono);font-size:13px"><span data-theme-name>Light</span></button></div>
  </div>
</header>`;
}

const FOOTER = `<footer class="foot">
  <div class="wrap"><div class="foot-grid">
    <div class="foot-a"><div><p class="mono">Berlin · <span data-clock>CET</span></p><p>Europe/Berlin</p></div></div>
    <div class="foot-b"><p><a href="/blog/feed.xml">Subscribe via RSS</a> · <a href="/">denysov.me</a></p><p class="edu">Posts are my own views, not those of my employer.</p></div>
    <div class="foot-c"><p>Made with 💛💙 by Mr. K.</p></div>
  </div></div>
</footer>
</body>
</html>
`;

function crumbs(items) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map((it, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(it.name)}</li>` : `<li><a href="${it.path}">${esc(it.name)}</a></li>`)).join('')}</ol></nav>`;
}
function crumbsLd(site, items) {
  return { '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: site.url + it.path })) };
}

function postCard(p, h = 'h3') {
  return `<article class="post-card">
  <p class="post-card-meta mono"><time datetime="${p.date}">${humanDate(p.date)}</time> · ${p.minutes} min read</p>
  <${h} class="post-card-title"><a href="${p.path}">${esc(p.title)}</a></${h}>
  <p class="p">${esc(p.description)}</p>
  <ul class="pills" aria-label="Tags">${p.tags.map((t) => `<li class="pill">${esc(t)}</li>`).join('')}</ul>
</article>`;
}

/* ---------- pages ---------- */

export function postPage(site, post, { newer, older, related }) {
  const items = [{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog/' }, { name: post.title, path: post.path }];
  const graph = [
    {
      '@type': 'BlogPosting',
      '@id': `${post.url}#article`,
      headline: post.title,
      alternativeHeadline: post.seoTitle !== post.title ? post.seoTitle : undefined,
      description: post.description,
      url: post.url,
      mainEntityOfPage: { '@type': 'WebPage', '@id': post.url },
      image: { '@type': 'ImageObject', url: post.image, width: 1200, height: 630 },
      datePublished: isoDateTime(post.date),
      dateModified: isoDateTime(post.updated),
      author: { '@id': `${site.url}/#person`, name: site.author, url: `${site.url}/` },
      publisher: { '@id': `${site.url}/#person` },
      isPartOf: { '@type': 'Blog', '@id': `${site.url}/blog/#blog`, name: site.blogTitle, url: `${site.url}/blog/` },
      inLanguage: site.lang,
      articleSection: post.tags[0],
      keywords: post.keywords.join(', '),
      wordCount: post.words,
      timeRequired: `PT${post.minutes}M`,
    },
    crumbsLd(site, items),
    personNode(site),
  ];
  const share = encodeURIComponent(post.url);
  const toc = post.toc.length > 2 ? `<aside class="toc" aria-labelledby="toc-h"><p class="toc-h mono" id="toc-h">On this page</p><ol>${post.toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></aside>` : '';
  const updated = post.updated !== post.date ? ` · Updated <time datetime="${post.updated}">${humanDate(post.updated)}</time>` : '';

  return `${head(site, {
    // Google shows about 60 characters: add the site name only when it fits.
    title: (post.seoTitle + ' · ' + site.name).length <= 62 ? `${post.seoTitle} · ${site.name}` : post.seoTitle,
    description: post.description,
    keywords: post.keywords,
    url: post.url,
    ogType: 'article',
    ogTitle: post.title,
    image: post.image,
    imageAlt: `${post.title}, a post by ${site.author}`,
    date: post.date,
    updated: post.updated,
    tags: post.tags,
    minutes: post.minutes,
    graph,
  })}
<body class="blog">
${header(false)}

<main id="main">
  <article class="post" aria-labelledby="post-h">
    <header class="wrap post-head">
      ${crumbs(items)}
      <p class="post-meta mono"><time datetime="${post.date}">${humanDate(post.date)}</time>${updated} · ${post.minutes} min read</p>
      <h1 class="post-title" id="post-h">${esc(post.title)}</h1>
      <p class="post-lede">${esc(post.description)}</p>
      <ul class="pills" aria-label="Tags">${post.tags.map((t) => `<li class="pill">${esc(t)}</li>`).join('')}</ul>
    </header>

    <div class="wrap post-body${toc ? '' : ' no-toc'}">
      ${toc}
      <div class="prose">
${post.html}
      </div>
    </div>

    <footer class="wrap post-end">
      <div class="author card">
        <svg class="logo author-logo" aria-hidden="true"><use href="#k-mark"/></svg>
        <div>
          <p class="author-name">Written by <a href="/">${esc(site.author)}</a></p>
          <p class="p">Technical Lead in Berlin. I write about release engineering, developer experience and building software with AI.</p>
          <div class="author-row">
            <a class="btn btn-primary btn-sm" href="${CAL}" target="_blank" rel="noopener">Book a 15-minute call</a>
            <a class="btn btn-secondary btn-sm" href="https://www.linkedin.com/in/denysovkos/" target="_blank" rel="noopener me">Follow on LinkedIn</a>
          </div>
        </div>
      </div>
      <div class="share">
        <span class="mono muted">Share</span>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${share}" target="_blank" rel="noopener">LinkedIn <span aria-hidden="true">↗</span></a>
        <a href="https://x.com/intent/post?url=${share}&amp;text=${encodeURIComponent(post.title)}" target="_blank" rel="noopener">X <span aria-hidden="true">↗</span></a>
        <a href="https://news.ycombinator.com/submitlink?u=${share}&amp;t=${encodeURIComponent(post.title)}" target="_blank" rel="noopener">Hacker News <span aria-hidden="true">↗</span></a>
        <button type="button" class="contact-btn" data-share data-share-url="${post.url}" data-share-title="${esc(post.title)}">Copy link</button>
        <span class="share-status mono" role="status" aria-live="polite"></span>
      </div>
    </footer>
  </article>
${newer || older ? `
  <nav class="wrap post-nav" aria-label="Older and newer posts">
    ${older ? `<a class="post-nav-a" href="${older.path}" rel="prev"><span class="mono muted">← Older</span><span>${esc(older.title)}</span></a>` : '<span></span>'}
    ${newer ? `<a class="post-nav-a post-nav-next" href="${newer.path}" rel="next"><span class="mono muted">Newer →</span><span>${esc(newer.title)}</span></a>` : '<span></span>'}
  </nav>` : ''}
${related.length ? `
  <section class="sec" aria-labelledby="more-h">
    <div class="wrap">
      <div class="sec-head"><p class="label">Keep reading</p><h2 class="h2" id="more-h">More posts</h2></div>
      <div class="posts">
${related.map((p) => postCard(p)).join('\n')}
      </div>
    </div>
  </section>` : ''}
</main>

${FOOTER}`;
}

export function blogIndex(site, posts) {
  const url = `${site.url}/blog/`;
  const items = [{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog/' }];
  const graph = [
    {
      '@type': 'Blog',
      '@id': `${url}#blog`,
      url,
      name: site.blogTitle,
      description: site.blogDescription,
      inLanguage: site.lang,
      author: { '@id': `${site.url}/#person` },
      publisher: { '@id': `${site.url}/#person` },
      blogPost: posts.map((p) => ({ '@type': 'BlogPosting', '@id': `${p.url}#article`, headline: p.title, url: p.url, datePublished: isoDateTime(p.date), image: p.image })),
    },
    { '@type': 'CollectionPage', '@id': url, url, name: site.blogTitle, isPartOf: { '@id': `${site.url}/#website` }, mainEntity: { '@id': `${url}#blog` }, inLanguage: site.lang },
    crumbsLd(site, items),
    personNode(site),
  ];
  return `${head(site, {
    title: site.blogTitle,
    description: site.blogDescription,
    url,
    ogType: 'website',
    ogTitle: `${site.blogHeading} · ${site.name}`,
    image: posts[0]?.image || `${site.url}/og.png`,
    imageAlt: `${site.blogHeading}, the blog of ${site.author}`,
    graph,
  })}
<body class="blog">
${header(true)}

<main id="main">
  <section class="wrap post-head blog-head" aria-labelledby="blog-h">
    ${crumbs(items)}
    <p class="post-meta mono">Blog · a new post every week</p>
    <h1 class="post-title" id="blog-h">${esc(site.blogHeading)}</h1>
    <p class="post-lede">Short, practical posts on release engineering, developer experience, engineering leadership and building side projects with AI. Plain language, no fluff.</p>
    <p class="blog-sub"><a class="btn btn-secondary btn-sm" href="/blog/feed.xml">Subscribe via RSS</a></p>
  </section>
  <section class="wrap blog-list" aria-label="All posts">
    <div class="posts posts-list">
${posts.length ? posts.map((p) => postCard(p, 'h2')).join('\n') : '<p class="p">The first post is on its way.</p>'}
    </div>
  </section>
</main>

${FOOTER}`;
}

/* ---------- feeds and indexes ---------- */

const absolutize = (site, html) => html.replace(/(href|src)="\/(?!\/)/g, `$1="${site.url}/`);

export function atomFeed(site, posts) {
  const updated = posts.length ? isoDateTime(posts.map((p) => p.updated).sort().at(-1)) : isoDateTime('2026-11-08');
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${site.lang}">
  <title>${xml(site.blogTitle)}</title>
  <subtitle>${xml(site.blogDescription)}</subtitle>
  <id>${site.url}/blog/</id>
  <link rel="self" type="application/atom+xml" href="${site.url}/blog/feed.xml"/>
  <link rel="alternate" type="text/html" href="${site.url}/blog/"/>
  <updated>${updated}</updated>
  <author><name>${xml(site.author)}</name><uri>${site.url}/</uri></author>
  <icon>${site.url}/icon-192.png</icon>
  <rights>© ${xml(site.author)}</rights>
${posts.slice(0, 20).map((p) => `  <entry>
    <title>${xml(p.title)}</title>
    <id>${p.url}</id>
    <link rel="alternate" type="text/html" href="${p.url}"/>
    <published>${isoDateTime(p.date)}</published>
    <updated>${isoDateTime(p.updated)}</updated>
    <summary>${xml(p.description)}</summary>
${p.tags.map((t) => `    <category term="${xml(t)}"/>`).join('\n')}
    <content type="html">${xml(absolutize(site, p.html))}</content>
  </entry>`).join('\n')}
</feed>
`;
}

export function sitemap(site, posts) {
  const latest = posts.map((p) => p.updated).sort().at(-1);
  const max = (...d) => d.filter(Boolean).sort().at(-1);
  // Bump HOME_UPDATED when the homepage content itself changes.
  const HOME_UPDATED = '2026-11-08';
  const CV_UPDATED = '2026-10-24';
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${site.url}/</loc>
    <lastmod>${max(HOME_UPDATED, latest)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${site.url}/og.png</image:loc>
    </image:image>
  </url>
  <url>
    <loc>${site.url}/blog/</loc>
    <lastmod>${max(HOME_UPDATED, latest)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
${posts.map((p) => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.updated}</lastmod>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${p.image}</image:loc>
    </image:image>
  </url>`).join('\n')}
  <url>
    <loc>${site.url}/denysov_k_cv.pdf</loc>
    <lastmod>${CV_UPDATED}</lastmod>
    <priority>0.6</priority>
  </url>
</urlset>
`;
}

export function homeLatest(posts) {
  if (!posts.length) return '';
  return `      <div class="posts">
${posts.slice(0, 3).map((p) => postCard(p)).join('\n')}
      </div>
      <p class="posts-more"><a class="btn btn-secondary" href="/blog/">All posts <span class="arr" aria-hidden="true">→</span></a> <a class="mono" href="/blog/feed.xml">RSS</a></p>`;
}

export function llmsBlog(site, posts) {
  if (!posts.length) return '';
  return `## Blog
- [All posts](${site.url}/blog/): ${site.blogDescription}
${posts.map((p) => `- [${p.title}](${p.url}) (${p.date}): ${p.description}`).join('\n')}`;
}

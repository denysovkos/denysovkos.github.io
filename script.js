/* denysov.me · script.js
   Theme toggle, mobile menu, active-section nav, fade-up reveal, count-up numerals, Berlin clock, email. */
(function () {
  'use strict';
  var d = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqDark = window.matchMedia('(prefers-color-scheme: dark)');

  /* Theme: system by default, manual override remembered per browser */
  function current() {
    var t = d.getAttribute('data-theme');
    return t === 'light' || t === 'dark' ? t : (mqDark.matches ? 'dark' : 'light');
  }
  function syncTheme() {
    var cur = current(), next = cur === 'dark' ? 'light' : 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-label', 'Switch to ' + next + ' theme');
      var n = b.querySelector('[data-theme-name]');
      if (n) n.textContent = cur === 'dark' ? 'Dark' : 'Light';
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', cur === 'dark' ? '#0E1116' : '#FAF8F4');
  }
  document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      d.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncTheme();
    });
  });
  if (mqDark.addEventListener) mqDark.addEventListener('change', syncTheme);
  syncTheme();

  /* Mobile menu sheet */
  var menuBtn = document.querySelector('[data-menu-btn]');
  var sheet = document.getElementById('sheet');
  function setMenu(open) {
    sheet.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.textContent = open ? 'Close' : 'Menu';
  }
  if (menuBtn && sheet) {
    menuBtn.addEventListener('click', function () { setMenu(sheet.hidden); });
    sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !sheet.hidden) { setMenu(false); menuBtn.focus(); }
    });
  }

  /* Berlin clock */
  var clocks = document.querySelectorAll('[data-clock]');
  if (clocks.length) {
    try {
      var f = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' });
      var tick = function () { var t = f.format(new Date()); clocks.forEach(function (el) { el.textContent = t; }); };
      tick(); setInterval(tick, 20000);
    } catch (e) {}
  }

  /* Email: assembled at runtime so the address never sits in the HTML.
     PLACEHOLDER: set data-u (local part) and data-d (domain) on the [data-email] link. */
  document.querySelectorAll('[data-email]').forEach(function (a) {
    var u = a.getAttribute('data-u'), dm = a.getAttribute('data-d');
    if (!u || !dm) return;
    a.href = 'mailto:' + u + '@' + dm;
    a.setAttribute('aria-label', 'Email');
    var tag = a.querySelector('.tag-ph');
    if (tag) tag.remove();
  });

  /* Share: native share sheet on phones, copy link elsewhere */
  var status = document.querySelector('.share-status');
  function say(t) { if (status) { status.textContent = t; setTimeout(function () { status.textContent = ''; }, 3000); } }
  var shareBtn = document.querySelector('[data-share]');
  if (shareBtn) shareBtn.addEventListener('click', function () {
    /* Blog posts pass their own URL and title through data attributes. */
    var url = shareBtn.getAttribute('data-share-url') || 'https://denysov.me/';
    var data = { title: shareBtn.getAttribute('data-share-title') || document.title, text: shareBtn.getAttribute('data-share-title') || 'Kostiantyn Denysov, Technical Lead, release engineering and developer experience', url: url };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { say('Link copied'); }, function () { say(url); });
    else say(url);
  });

  /* Save contact: vCard built on click, so the address is never a static file */
  var vBtn = document.querySelector('[data-vcard]');
  var em = document.querySelector('[data-email]');
  if (vBtn) vBtn.addEventListener('click', function () {
    var mail = em && em.getAttribute('data-u') ? em.getAttribute('data-u') + '@' + em.getAttribute('data-d') : '';
    var v = ['BEGIN:VCARD', 'VERSION:3.0', 'N:Denysov;Kostiantyn;;;', 'FN:Kostiantyn Denysov', 'TITLE:Technical Lead', 'ORG:Deel',
      'ADR;TYPE=WORK:;;;Berlin;;;Germany', mail ? 'EMAIL;TYPE=INTERNET:' + mail : '', 'URL:https://denysov.me/',
      'X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/denysovkos/', 'X-SOCIALPROFILE;TYPE=github:https://github.com/denysovkos', 'END:VCARD'].filter(Boolean).join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([v], { type: 'text/vcard' }));
    a.download = 'kostiantyn-denysov.vcf';
    document.body.appendChild(a); a.click(); a.remove();
    say('Contact card downloaded');
  });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
    return;
  }

  /* Active-section highlight in the nav */
  var links = {};
  document.querySelectorAll('.navlink').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var id = e.target.getAttribute('data-spy');
      Object.keys(links).forEach(function (k) {
        links[k].classList.toggle('is-active', k === id);
        if (k === id) links[k].setAttribute('aria-current', 'true'); else links[k].removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('[data-spy]').forEach(function (s) { spy.observe(s); });

  /* Fade-up once per section */
  if (reduce) {
    document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
  } else {
    var rv = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach(function (el) { rv.observe(el); });
  }

  /* Count-up once on first view. The final values are in the HTML, so no-JS and reduced motion show them as is. */
  if (!reduce) {
    var cu = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cu.unobserve(e.target);
        var el = e.target, to = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '', t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / 900), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(to * eased) + suf;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach(function (el) { cu.observe(el); });
  }
})();

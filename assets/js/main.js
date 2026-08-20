(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const storedTheme = localStorage.getItem('theme');

  function applyTheme(theme) {
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
  }

  applyTheme(storedTheme || 'dark');

  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  /* ---------- Mobile nav ---------- */
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  mobileNavToggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    mobileNavToggle.classList.toggle('open', open);
    mobileNavToggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.intro-nav .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      mobileNavToggle.classList.remove('open');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('progressBar');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  window.addEventListener('scroll', () => {
    updateProgress();
    updateBackToTop();
  }, { passive: true });
  updateProgress();
  updateBackToTop();

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach((el, i) => el.style.setProperty('--i', i % 8));

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- Scroll spy ---------- */
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Typewriter ---------- */
  const typewriterEl = document.getElementById('typewriter');
  const phrases = [
    'from PDF tools to full products.',
    'from backend APIs to polished UI.',
    'shipping Inkbind across four platforms.',
    'for startups, businesses and myself.'
  ];

  function startTypewriter() {
    if (prefersReducedMotion) {
      typewriterEl.textContent = phrases[0];
      return;
    }
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        typewriterEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
      } else {
        charIndex--;
        typewriterEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 30 : 55);
    }
    tick();
  }
  startTypewriter();

  /* ---------- Animated stat counters ---------- */
  const statNums = document.querySelectorAll('.stat-num');
  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    el.dataset.animated = 'true';
    if (prefersReducedMotion) { el.textContent = target; return; }
    const from = parseInt(el.textContent, 10) || 0;
    const duration = 900;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(from + (target - from) * progress);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  // Re-animates a stat once live data arrives, even if it already counted up
  // once using the static fallback value (About is visible on first paint,
  // often before the GitHub API response lands).
  function updateStatCount(el, value) {
    if (!el) return;
    el.setAttribute('data-count', value);
    if (el.dataset.animated === 'true') animateCount(el);
  }
  if ('IntersectionObserver' in window) {
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach((el) => statIo.observe(el));
  }

  /* ---------- Live GitHub data (repos, languages, projects) ---------- */
  const GITHUB_USER = 'sajjadshahpoor';

  // Hand-written blurbs for repos already known when this site was built.
  // Anything not listed here still renders automatically, using the repo's
  // own GitHub description (or a generic fallback) — that's what makes new
  // repos show up on the site without editing any code.
  const curatedProjects = {
    'taxioost.be': {
      displayName: 'taxioost.be',
      description: 'Business website for a taxi service in Oostende — built and deployed to a live client domain.',
      tags: ['PHP', 'Client Site']
    },
    'AKS-Factuur': {
      displayName: 'AKS-Factuur',
      description: 'Custom invoice template system built for a small business client.',
      tags: ['HTML', 'CSS']
    },
    'theafghanvillages-wp': {
      displayName: 'The Afghan Villages (WordPress)',
      description: 'Community-focused website, shipped as a custom WordPress theme.',
      tags: ['PHP', 'WordPress']
    },
    'theafghanvillages': {
      displayName: 'The Afghan Villages',
      description: 'Community-focused website — static HTML build.',
      tags: ['HTML']
    },
    'Secure_Banking_App': {
      displayName: 'Secure Banking App',
      description: 'A banking application concept focused on secure, sensible UX patterns for financial workflows.',
      tags: ['HTML', 'Security']
    },
    'Secure_Banking': {
      displayName: 'Secure Banking',
      description: 'Secure banking concept — companion repository.',
      tags: ['Security']
    },
    'gradient-free-optimization': {
      displayName: 'Gradient-Free Optimization',
      description: 'Reinforcement learning project comparing gradient-free optimization methods.',
      tags: ['Python', 'Reinforcement Learning']
    },
    'NYC_Taxi_info_vis': {
      displayName: 'NYC Taxi Info Vis',
      description: 'Interactive data visualization exploring New York City taxi trip data.',
      tags: ['Python', 'Data Viz']
    },
    'Wp-tranlator-plugin': {
      displayName: 'WP Translator Plugin',
      description: 'A WordPress plugin for translating site content.',
      tags: ['PHP', 'WordPress']
    },
    'yacc_and_lex_calculator': {
      displayName: 'Yacc & Lex Calculator',
      description: 'A calculator built with Yacc and Lex to explore compiler design fundamentals.',
      tags: ['C', 'Compilers']
    }
  };

  function formatRepoName(name) {
    return name
      .replace(/[-_]+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function timeAgo(dateStr) {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return days + 'd ago';
    const months = Math.floor(days / 30);
    if (months < 12) return months + 'mo ago';
    return Math.floor(months / 12) + 'y ago';
  }

  const FOLDER_ICON = '<svg class="folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';

  function buildProjectCard(repo) {
    const curated = curatedProjects[repo.name];
    const displayName = (curated && curated.displayName) || formatRepoName(repo.name);
    const description = (curated && curated.description) || repo.description ||
      `A ${repo.language || 'code'} project — explore the source on GitHub.`;
    const tags = (curated && curated.tags) || [repo.language, repo.fork ? 'Fork' : null].filter(Boolean);
    const tagHtml = tags.map((t) => `<li>${t}</li>`).join('');
    return `
      <a class="project-card glass-card reveal in-view" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
        <div class="project-card-top">
          ${FOLDER_ICON}
          <span class="external-icon">↗</span>
        </div>
        <h3>${displayName}</h3>
        <p>${description}</p>
        <ul class="chip-list small">${tagHtml}</ul>
      </a>`;
  }

  function buildFeaturedInkbind(inkbindRepos) {
    if (!inkbindRepos.length) return;
    const order = ['inkbind', 'inkbind-desktop', 'inkbind-ios-mob', 'inkbind-server'];
    const sorted = [...inkbindRepos].sort(
      (a, b) => order.indexOf(a.name.toLowerCase()) - order.indexOf(b.name.toLowerCase())
    );
    const main = sorted.find((r) => r.name.toLowerCase() === 'inkbind') || sorted[0];

    function pillLabel(name) {
      const n = name.toLowerCase();
      if (n === 'inkbind') return 'Web';
      if (n.includes('desktop')) return 'Desktop';
      if (n.includes('ios')) return 'iOS';
      if (n.includes('server')) return 'Server';
      return formatRepoName(name);
    }

    const featured = document.getElementById('featuredProject');
    if (!featured) return;
    const desc = featured.querySelector('.featured-desc');
    const chips = featured.querySelector('.chip-list');
    const links = featured.querySelector('.featured-links');
    if (desc) desc.textContent = main.description ||
      'A fast, all-in-one PDF toolkit to edit, merge, split and organize documents — built as a connected product across web, desktop, iOS and server.';
    if (chips) {
      const langs = [...new Set(sorted.map((r) => r.language).filter(Boolean))];
      if (langs.length) chips.innerHTML = langs.map((l) => `<li>${l}</li>`).join('');
    }
    if (links) {
      links.innerHTML = sorted
        .map((r) => `<a class="pill-link" href="${r.html_url}" target="_blank" rel="noopener noreferrer">${pillLabel(r.name)} ↗</a>`)
        .join('');
    }
    featured.href = main.html_url;

    updateStatCount(document.getElementById('aboutInkbindCount'), sorted.length);
  }

  function renderGitHubStats(repos) {
    const repoCountEl = document.getElementById('ghRepoCount');
    const starCountEl = document.getElementById('ghStarCount');
    const topLangEl = document.getElementById('ghTopLang');
    const lastPushEl = document.getElementById('ghLastPush');
    const aboutRepoCountEl = document.getElementById('aboutRepoCount');
    const aboutLangCountEl = document.getElementById('aboutLangCount');
    if (!repoCountEl) return;

    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const langCounts = {};
    repos.forEach((r) => { if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1; });
    const topLang = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0];
    const mostRecent = repos.reduce(
      (latest, r) => (!latest || new Date(r.pushed_at) > new Date(latest.pushed_at) ? r : latest),
      null
    );

    updateStatCount(repoCountEl, repos.length);
    updateStatCount(starCountEl, totalStars);
    updateStatCount(aboutRepoCountEl, repos.length);
    updateStatCount(aboutLangCountEl, Object.keys(langCounts).length);
    topLangEl.textContent = topLang ? topLang[0] : '—';
    lastPushEl.textContent = mostRecent ? timeAgo(mostRecent.pushed_at) : '—';
  }

  function renderLanguageBars(repos) {
    const container = document.getElementById('langBars');
    if (!container) return;
    const counts = {};
    repos.forEach((r) => { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1; });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    if (!sorted.length) {
      container.innerHTML = '<p class="lang-loading">No language data available yet.</p>';
      return;
    }
    container.innerHTML = sorted.map(([lang, count]) => {
      const pct = Math.round((count / total) * 100);
      return `
        <div class="lang-bar-row">
          <div class="lang-bar-label"><span>${lang}</span><span>${pct}%</span></div>
          <div class="lang-bar-track"><div class="lang-bar-fill" style="width:${pct}%"></div></div>
        </div>`;
    }).join('');
  }

  async function loadGitHubData() {
    try {
      const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (!res.ok) throw new Error('GitHub API error ' + res.status);
      const repos = await res.json();
      if (!Array.isArray(repos)) throw new Error('Unexpected GitHub API response');

      renderGitHubStats(repos);
      renderLanguageBars(repos);
      buildFeaturedInkbind(repos.filter((r) => /^inkbind/i.test(r.name)));

      const otherRepos = repos
        .filter((r) => !/^inkbind/i.test(r.name) && r.name.toLowerCase() !== 'developer')
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0, 9);
      const grid = document.getElementById('projectGrid');
      if (grid && otherRepos.length) {
        grid.innerHTML = otherRepos.map(buildProjectCard).join('');
      }
    } catch (err) {
      const langBars = document.getElementById('langBars');
      if (langBars) {
        langBars.innerHTML =
          `<p class="lang-loading">Live stats unavailable right now — <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener noreferrer">view on GitHub</a>.</p>`;
      }
    }
  }

  loadGitHubData();

  /* ---------- Particle background ---------- */
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;
  let animationId;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function initParticles() {
    const count = Math.min(70, Math.floor((width * height) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  function getAccentColor() {
    return getComputedStyle(root).getPropertyValue('--accent').trim() || '#64ffda';
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const accent = getAccentColor();

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.strokeStyle = hexToRgba(accent, (1 - dist / 130) * 0.15);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      ctx.fillStyle = hexToRgba(accent, 0.5);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    animationId = requestAnimationFrame(draw);
  }

  function hexToRgba(hex, alpha) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map((ch) => ch + ch).join('');
    const num = parseInt(c, 16);
    if (isNaN(num)) return `rgba(100,255,218,${alpha})`;
    const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function setupCanvas() {
    resize();
    initParticles();
    if (animationId) cancelAnimationFrame(animationId);
    if (!prefersReducedMotion) draw();
    else ctx.clearRect(0, 0, width, height);
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setupCanvas, 200);
  });

  setupCanvas();
})();

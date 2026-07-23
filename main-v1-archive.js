/* ═══════════════════════════════════════════════════════
   כזוהר הרקיע — Main Interactive Logic (Ivory Silk)
   ═══════════════════════════════════════════════════════ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ────── LOADER ────── */
window.addEventListener('load', () => {
  const loader = $('#loader');
  if (loader) setTimeout(() => loader.classList.add('is-hidden'), 800);
});

/* ────── CUSTOM CURSOR ────── */
(() => {
  const dot = $('#cursorDot');
  const ring = $('#cursorRing');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  }, { passive: true });

  const raf = () => {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(raf);
  };
  raf();

  $$('a, button, .feature-card, .tier-card, .stone, .c3d-legend-item').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });
})();

/* ────── HEADER SCROLL ────── */
(() => {
  const header = $('#header');
  const ribbon = $('#liveRibbon');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 60);
    if (ribbon) ribbon.classList.toggle('is-hidden', window.scrollY > 120);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ────── MOBILE NAV ────── */
(() => {
  const btn = $('#navToggle');
  const menu = $('#navMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
  });
  $$('.nav-link, .nav-donate', menu).forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', false);
    });
  });
})();

/* ────── REVEAL ON SCROLL ────── */
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  $$('.reveal, .hero-reveal, .reveal-flourish').forEach(el => io.observe(el));
})();

/* ────── LIVE STATS COUNT-UP ────── */
(() => {
  const stats = $$('.live-stat-value[data-target]');
  if (!stats.length) return;

  const formatValue = (val, el) => {
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const format = el.dataset.format;
    let str = format === 'comma' ? Math.round(val).toLocaleString('en-US') : Math.round(val);
    return `${prefix}${str}${suffix}`;
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      if (isNaN(target)) return;
      const dur = 2000;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = formatValue(target * eased, el);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  stats.forEach(s => io.observe(s));
})();

/* ────── TIER AMOUNTS COUNT-UP ────── */
(() => {
  const numbers = $$('[data-count]');
  if (!numbers.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
      const original = el.textContent.trim();
      const hasComma = original.includes(',');
      const dur = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(target * eased);
        el.textContent = hasComma ? val.toLocaleString('en-US') : val;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = original;
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  numbers.forEach(n => io.observe(n));
})();

/* ────── FUNDRAISING PROGRESS BAR ────── */
(() => {
  const fill = $('#fundFill');
  const percentEl = $('#fundPercent');
  if (!fill) return;
  const RAISED = 1842600;
  const TARGET = 18000000;
  const pct = (RAISED / TARGET) * 100;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fill.style.width = pct.toFixed(1) + '%';
        if (percentEl) percentEl.textContent = pct.toFixed(1) + '%';
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });
  io.observe(fill);
})();

/* ────── COUNTDOWN TIMER ────── */
(() => {
  const daysEl = $('#countdownDays');
  const dateEl = $('#countdownDate');
  if (!daysEl) return;

  // TODO: Replace with real dedication date
  const targetDate = new Date('2026-09-12T00:00:00'); // 1 Tishrei 5787 ≈ Sept 12, 2026

  const update = () => {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
      daysEl.textContent = '0';
      if (dateEl) dateEl.textContent = 'ב״ה — חנוכת הבית';
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    daysEl.textContent = days.toLocaleString('en-US');
  };
  update();
  setInterval(update, 60000);
})();

/* ────── PLAQUE FILTERS ────── */
(() => {
  const filters = $$('.plaque-filter');
  const tiers = $$('.plaque-tier');
  if (!filters.length || !tiers.length) return;
  filters.forEach(f => {
    f.addEventListener('click', () => {
      filters.forEach(x => { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
      f.classList.add('is-active');
      f.setAttribute('aria-selected', 'true');
      const val = f.dataset.filter;
      tiers.forEach(t => {
        const show = val === 'all' || t.dataset.tier === val;
        t.classList.toggle('is-hidden', !show);
      });
    });
  });
})();

/* ────── COPY BANK DETAILS ────── */
(() => {
  const btn = $('#copyBank');
  const toast = $('#toast');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const text = 'בנק מזרחי טפחות · סניף 428 · חשבון 294319 · ע״ש עמותת חסד יסובבנו';
    try {
      await navigator.clipboard.writeText(text);
      if (toast) {
        toast.textContent = '✦ פרטי החשבון הועתקו בהצלחה';
        toast.classList.add('is-visible');
        setTimeout(() => toast.classList.remove('is-visible'), 2400);
      }
    } catch (err) { console.warn('Copy failed', err); }
  });
})();

/* ────── SMOOTH-SCROLL WITH HEADER OFFSET ────── */
(() => {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const headerH = ($('#header')?.offsetHeight || 80) + ($('#liveRibbon')?.offsetHeight || 34);
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ────── TIMELINE PROGRESS FILL ────── */
(() => {
  const fill = $('#timelineFill');
  if (!fill) return;
  const complete = $$('.timeline-step.is-complete').length;
  const active = $$('.timeline-step.is-active').length;
  const total = $$('.timeline-step').length;
  const pct = ((complete + active * 0.5) / (total - 1)) * 100;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fill.style.width = pct + '%';
        io.disconnect();
      }
    });
  }, { threshold: 0.4 });
  io.observe(fill);
})();

/* ────── SUBTLE HERO PARALLAX ────── */
(() => {
  const hero = $('.hero-content');
  if (!hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > window.innerHeight) return;
    hero.style.transform = `translateY(${y * 0.08}px)`;
    hero.style.opacity = Math.max(0.85, 1 - (y / window.innerHeight) * 0.15);
  }, { passive: true });
})();

/* ────── STONE WALL — animated brick appearance ────── */
(() => {
  const wall = $('#stoneWall');
  if (!wall) return;

  const STONE_COUNT = 96;
  const goldIndexes = new Set([12, 27, 43, 58, 71, 84]); // Featured "sponsor" stones

  const frag = document.createDocumentFragment();
  for (let i = 0; i < STONE_COUNT; i++) {
    const s = document.createElement('div');
    s.className = 'stone' + (goldIndexes.has(i) ? ' is-gold' : '');
    s.style.animationDelay = (i * 0.02) + 's';
    frag.appendChild(s);
  }
  wall.appendChild(frag);

  // Trigger animation when in view
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-building');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  io.observe(wall);
})();

/* ────── AUDIO PLAYER ────── */
(() => {
  const btn = $('#audioPlayBtn');
  const orb = $('.audio-orb');
  const audio = $('#rabbiAudio');
  if (!btn || !audio) return;

  const iconEl = btn.querySelector('.audio-play-icon');
  const labelEl = btn.querySelector('.audio-play-label');

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        if (iconEl) iconEl.textContent = '❚❚';
        if (labelEl) labelEl.textContent = 'השהיית ההאזנה';
        if (orb) orb.classList.add('is-playing');
      }).catch(err => {
        console.warn('Audio playback failed — file may be missing:', err);
        const toast = $('#toast');
        if (toast) {
          toast.textContent = '✦ קובץ ההקלטה עדיין לא הועלה — יעודכן בקרוב';
          toast.classList.add('is-visible');
          setTimeout(() => toast.classList.remove('is-visible'), 3200);
        }
      });
    } else {
      audio.pause();
      if (iconEl) iconEl.textContent = '▶';
      if (labelEl) labelEl.textContent = 'האזינו לברכה';
      if (orb) orb.classList.remove('is-playing');
    }
  });

  audio.addEventListener('ended', () => {
    if (iconEl) iconEl.textContent = '▶';
    if (labelEl) labelEl.textContent = 'האזינו לברכה';
    if (orb) orb.classList.remove('is-playing');
  });
})();

/* ────── LIVE RIBBON — small periodic bump (simulated) ────── */
(() => {
  const countEl = $('#liveCount');
  const amountEl = $('#liveAmount');
  if (!countEl || !amountEl) return;
  let count = 247;
  let amount = 1842600;
  setInterval(() => {
    if (Math.random() > 0.7) {
      const bump = Math.floor(Math.random() * 3) + 1;
      const amountBump = bump * (Math.floor(Math.random() * 400) + 100);
      count += bump;
      amount += amountBump;
      countEl.textContent = count;
      amountEl.textContent = amount.toLocaleString('en-US');
      countEl.style.color = '#DDB578';
      setTimeout(() => countEl.style.color = '', 800);
    }
  }, 15000);
})();

/* ────── 3D MODEL — building focus from legend ────── */
(() => {
  $$('.c3d-legend-item').forEach(item => {
    item.addEventListener('click', () => {
      const building = item.dataset.targetBuilding;
      window.dispatchEvent(new CustomEvent('complex3d:focus', { detail: { building } }));
      // Scroll to 3D section
      const target = $('#complex-3d');
      if (target) {
        const headerH = ($('#header')?.offsetHeight || 80) + 34;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

/* ═══════════════════════════════════════════════════════
   כזוהר הרקיע — Main Interactive Logic
   ═══════════════════════════════════════════════════════ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ────── LOADER ────── */
window.addEventListener('load', () => {
  const loader = $('#loader');
  if (loader) {
    setTimeout(() => loader.classList.add('is-hidden'), 600);
  }
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


  $$('a, button, .feature-card, .tier-card, .map-zone').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });
})();

/* ────── HEADER SCROLL ────── */
(() => {
  const header = $('#header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 60);
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

/* ────── COUNT-UP NUMBERS ────── */
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

/* ────── INTERACTIVE COMPLEX MAP ────── */
(() => {
  const zones = $$('.map-zone');
  const info = $('#mapInfo');
  if (!zones.length || !info) return;

  const showZone = (zone) => {
    zones.forEach(z => z.classList.toggle('is-active', z === zone));
    const key = zone ? zone.dataset.zone : null;

    $$('.map-info-content', info).forEach(c => {
      const match = key
        ? c.dataset.zoneContent === key
        : c.hasAttribute('data-default');
      c.hidden = !match;
    });
  };

  zones.forEach(z => {
    z.addEventListener('mouseenter', () => showZone(z));
    z.addEventListener('focus', () => showZone(z));
    z.addEventListener('click', () => showZone(z));
  });

  const mapFrame = $('.complex-map-frame');
  if (mapFrame) {
    mapFrame.addEventListener('mouseleave', () => showZone(null));
  }
})();

/* ────── PLAQUE FILTERS ────── */
(() => {
  const filters = $$('.plaque-filter');
  const tiers = $$('.plaque-tier');
  if (!filters.length || !tiers.length) return;

  filters.forEach(f => {
    f.addEventListener('click', () => {
      filters.forEach(x => {
        x.classList.remove('is-active');
        x.setAttribute('aria-selected', 'false');
      });
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
    } catch (err) {
      console.warn('Copy failed', err);
    }
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
      const headerH = $('#header')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ────── TIMELINE PROGRESS FILL ANIMATION ────── */
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

/* ────── SUBTLE PARALLAX ON HERO CONTENT ────── */
(() => {
  const hero = $('.hero-content');
  if (!hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > window.innerHeight) return;
    hero.style.transform = `translateY(${y * 0.15}px)`;
    hero.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.9));
  }, { passive: true });
})();

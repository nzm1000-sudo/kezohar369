/* ════════════════════════════════════════════════════════════════════════════
   כזוהר הרקיע · main-v2.js
   Modular, clean, accessible interactions
   ════════════════════════════════════════════════════════════════════════════ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Run when DOM is ready
const ready = (fn) => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};

ready(() => {
  runMain();
});

function runMain() {

/* ─── LOADER ─── */
const loader = $('#campus3DLoader');
if (loader) {
  const hideLoader = () => {
    if (!loader || loader.classList.contains('is-hidden')) return;
    loader.classList.add('is-hidden');
  };
  // Hide loader once 3D scene signals ready
  window.addEventListener('campus:ready', () => {
    setTimeout(hideLoader, 300);
  });
  // FORCE hide after 4 seconds no matter what — prevents stuck loader
  setTimeout(hideLoader, 4000);
  // Also hide on any error
  window.addEventListener('error', hideLoader, true);
}

/* ─── SAFETY: ensure all .reveal elements above the fold show immediately ─── */
(() => {
  // Mark all .reveal inside the hero as visible immediately
  $$('.hero .reveal').forEach(el => el.classList.add('is-in'));
  // Also force any reveal that is already in viewport on load
  requestAnimationFrame(() => {
    $$('.reveal').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('is-in');
      }
    });
  });
})();

/* ─── HEADER SCROLL ─── */
(() => {
  const header = $('#header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─── MOBILE NAV ─── */
(() => {
  const btn = $('#navToggle');
  const menu = $('#navMenu');
  if (!btn || !menu) return;

  const close = () => {
    menu.classList.remove('is-open');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const open = () => {
    menu.classList.add('is-open');
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  btn.addEventListener('click', () => {
    menu.classList.contains('is-open') ? close() : open();
  });

  $$('.nav__link, .nav__donate', menu).forEach(link => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
  });
})();

/* ─── REVEAL ON SCROLL ─── */
(() => {
  if (!('IntersectionObserver' in window)) {
    $$('.reveal, .reveal-stagger').forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  $$('.reveal, .reveal-stagger').forEach(el => io.observe(el));
})();

/* ─── COPY BANK DETAILS ─── */
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
      if (toast) {
        toast.textContent = '✦ ניתן להעתיק ידנית';
        toast.classList.add('is-visible');
        setTimeout(() => toast.classList.remove('is-visible'), 2400);
      }
    }
  });
})();

/* ─── SMOOTH SCROLL with header offset ─── */
(() => {
  const headerH = () => ($('#header')?.offsetHeight || 80) + 20;

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerH();
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ─── PARTNERS WALL (search + filter) ─── */
(() => {
  const wall = $('#partnersWall');
  if (!wall) return;

  const searchInput = $('#partnersSearch');
  const filters = $$('.filter');
  let currentFilter = 'all';

  const applyFilters = () => {
    const q = (searchInput?.value || '').trim().toLowerCase();
    $$('.partner-stone', wall).forEach(stone => {
      const name = stone.dataset.name || '';
      const tier = stone.dataset.tier || '';
      const matchesText = !q || name.toLowerCase().includes(q);
      const matchesTier = currentFilter === 'all' || tier === currentFilter;
      stone.classList.toggle('is-hidden', !(matchesText && matchesTier));
    });

    // Empty state
    const visible = $$('.partner-stone', wall).filter(s => !s.classList.contains('is-hidden'));
    let empty = $('.partners__empty', wall);
    if (visible.length === 0) {
      if (!empty) {
        empty = document.createElement('p');
        empty.className = 'partners__empty';
        empty.textContent = 'לא נמצאו שמות בחיפוש זה.';
        wall.appendChild(empty);
      } else {
        empty.style.display = '';
      }
    } else if (empty) {
      empty.style.display = 'none';
    }
  };

  // Search
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // Filters
  filters.forEach(f => {
    f.addEventListener('click', () => {
      filters.forEach(x => {
        x.classList.remove('is-active');
        x.setAttribute('aria-selected', 'false');
      });
      f.classList.add('is-active');
      f.setAttribute('aria-selected', 'true');
      currentFilter = f.dataset.filter;
      applyFilters();
    });
  });
})();

/* ─── DONATE AMOUNT ANIMATION (count-up) ─── */
// (skipped — no fake numbers)

} // end runMain

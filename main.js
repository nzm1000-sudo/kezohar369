import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.1.18/+esm';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Lenis Smooth Scroll ── */
let lenis = null;

if (!prefersReducedMotion) {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

/* ── Loader ── */
const loader = document.getElementById('loader');

function hideLoader() {
  if (!loader) return;
  loader.classList.add('is-hidden');
  setTimeout(() => loader.remove(), 900);
}

window.addEventListener('load', () => {
  setTimeout(hideLoader, prefersReducedMotion ? 200 : 800);
});

/* ── GSAP Setup ── */
gsap.registerPlugin(ScrollTrigger);

/* ── Hero Entrance ── */
const heroItems = document.querySelectorAll('.hero-reveal');
if (heroItems.length) {
  gsap.to(heroItems, {
    opacity: 1,
    y: 0,
    duration: prefersReducedMotion ? 0.3 : 1,
    stagger: prefersReducedMotion ? 0 : 0.12,
    ease: 'power3.out',
    delay: prefersReducedMotion ? 0 : 0.4,
  });
}

/* ── Scroll Reveals ── */
const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach((el) => {
  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 82%',
      toggleActions: 'play none none none',
    },
    opacity: 1,
    y: 0,
    duration: prefersReducedMotion ? 0.2 : 0.9,
    ease: 'power2.out',
  });
});

/* ── Flourish Draw-In ── */
document.querySelectorAll('.reveal-flourish').forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    onEnter: () => el.classList.add('is-visible'),
  });
});

/* ── Staggered Card Grids ── */
['.cards-grid .feature-card', '.tiers-grid .tier-card', '.donate-grid .donate-card'].forEach((selector) => {
  const cards = document.querySelectorAll(selector);
  if (!cards.length) return;

  gsap.set(cards, { opacity: 0, y: 24 });

  gsap.to(cards, {
    scrollTrigger: {
      trigger: cards[0].parentElement,
      start: 'top 80%',
    },
    opacity: 1,
    y: 0,
    duration: prefersReducedMotion ? 0.2 : 0.8,
    stagger: prefersReducedMotion ? 0 : 0.1,
    ease: 'power2.out',
  });
});

/* ── Count-Up Animation ── */
document.querySelectorAll('.amount[data-count]').forEach((el) => {
  const target = parseInt(el.dataset.count, 10);
  const obj = { val: 0 };

  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      if (prefersReducedMotion) {
        el.textContent = target.toLocaleString('he-IL');
        return;
      }

      gsap.to(obj, {
        val: target,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(obj.val).toLocaleString('he-IL');
        },
      });
    },
  });
});

/* ── Header Scroll ── */
const header = document.getElementById('header');

function updateHeader() {
  if (!header) return;
  const scrollY = lenis ? lenis.scroll : window.scrollY;
  header.classList.toggle('is-scrolled', scrollY > 80);
}

if (lenis) {
  lenis.on('scroll', updateHeader);
} else {
  window.addEventListener('scroll', updateHeader, { passive: true });
}
updateHeader();

/* ── Mobile Navigation ── */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

function closeMenu() {
  navToggle?.classList.remove('is-active');
  navMenu?.classList.remove('is-open');
  navToggle?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

navToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open');
  navToggle.classList.toggle('is-active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

/* ── Smooth Anchor Links ── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (!id || id === '#') return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    closeMenu();

    if (lenis) {
      lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Copy Bank Details ── */
const copyBankBtn = document.getElementById('copyBank');
const bankDetails = document.getElementById('bankDetails');
const toast = document.getElementById('toast');

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

copyBankBtn?.addEventListener('click', async () => {
  if (!bankDetails) return;

  const rows = bankDetails.querySelectorAll('div');
  const text = Array.from(rows)
    .map((row) => {
      const dt = row.querySelector('dt')?.textContent?.trim();
      const dd = row.querySelector('dd')?.textContent?.trim();
      return `${dt}: ${dd}`;
    })
    .join('\n');

  try {
    await navigator.clipboard.writeText(text);
    showToast('הפרטים הועתקו בהצלחה');
  } catch {
    showToast('לא ניתן להעתיק — אנא העתיקו ידנית');
  }
});

/* ── Custom Cursor ── */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

if (cursorDot && cursorRing && !isTouchDevice) {
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const interactiveSelectors = 'a, button, .btn, .feature-card, .tier-card, .donate-card, .nav-link';
  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hover'));
  });
}
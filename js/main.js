/* ============================
   AMA DANCE — Main JS
   ============================ */

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}

// Fade-in on scroll (Intersection Observer)
const fadeEls = document.querySelectorAll('.fade-in');

if (fadeEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeEls.forEach(el => observer.observe(el));
}

// ============================
// SUBTLE PARALLAX
// ============================

function initParallax() {
  // Respect accessibility preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Skip on mobile — parallax is a desktop/tablet delight
  const isMobile = () => window.innerWidth <= 768;
  if (isMobile()) return;

  const items = [
    {
      el: document.querySelector('.about-image-wrap img'),
      factor: 0.20
    },
    {
      el: document.querySelector('.founder-image-wrap img'),
      factor: 0.20
    },
    {
      el: document.querySelector('.gallery-banner img'),
      factor: 0.12
    }
  ].filter(item => item.el !== null);

  if (!items.length) return;

  let ticking = false;

  function applyParallax() {
    if (isMobile()) {
      // If user resized down to mobile, clear any transforms
      items.forEach(({ el }) => { el.style.transform = ''; });
      ticking = false;
      return;
    }

    items.forEach(({ el, factor }) => {
      const parent = el.parentElement;
      const rect = parent.getBoundingClientRect();

      // How far the center of the section is from the center of the viewport
      const centerOffset = (rect.top + rect.height / 2) - window.innerHeight / 2;
      const shift = centerOffset * factor;

      el.style.transform = `translateY(${shift}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }, { passive: true });

  // Also run on resize in case viewport changes
  window.addEventListener('resize', () => {
    if (!ticking) {
      requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }, { passive: true });

  // Initial render
  applyParallax();
}

initParallax();

// ============================
// BG IMAGE PARALLAX
// Vertical shift + horizontal drift on scroll
// ============================

function initBgParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const isMobile = () => window.innerWidth <= 768;
  if (isMobile()) return;

  const sections = [
    { el: document.querySelector('.about'),   xVar: '--about-x',   yVar: '--about-y',   xDir:  1 },
    { el: document.querySelector('.founder'), xVar: '--founder-x', yVar: '--founder-y', xDir: -1 },
  ].filter(s => s.el);

  const footer = document.querySelector('.footer');

  function apply() {
    if (isMobile()) {
      sections.forEach(({ el, xVar, yVar }) => {
        el.style.removeProperty(xVar);
        el.style.removeProperty(yVar);
      });
      if (footer) footer.style.removeProperty('--footer-bg-x');
      return;
    }

    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const t = maxScroll > 0 ? scrollY / maxScroll : 0;

    sections.forEach(({ el, xVar, yVar, xDir }) => {
      const rect = el.getBoundingClientRect();
      const centerOffset = (rect.top + rect.height / 2) - window.innerHeight / 2;
      const vertY = centerOffset * 0.12;          // vertical depth
      const horizX = (t - 0.5) * 22 * xDir;      // ±11px horizontal drift
      el.style.setProperty(xVar, `${horizX}px`);
      el.style.setProperty(yVar, `${vertY}px`);
    });

    if (footer) {
      const horizX = (t - 0.5) * 18;             // ±9px drift on footer
      footer.style.setProperty('--footer-bg-x', `${horizX}px`);
    }
  }

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { apply(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!ticking) {
      requestAnimationFrame(() => { apply(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  apply();
}

initBgParallax();

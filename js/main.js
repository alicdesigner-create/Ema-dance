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
      factor: 0.10   // drifts at 10% of scroll delta — very subtle
    },
    {
      el: document.querySelector('.founder-image-wrap img'),
      factor: 0.10
    },
    {
      el: document.querySelector('.gallery-banner img'),
      factor: 0.06   // even lighter — already a full-bleed image
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

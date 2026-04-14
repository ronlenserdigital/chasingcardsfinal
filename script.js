/* ============================================
   CHASING CARDS SOLUTIONS — script.js
   Premium Sports Card Website
   ============================================ */

'use strict';

/* ============================
   CUSTOM CURSOR
   ============================ */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

if (cursor && cursorTrail && window.matchMedia('(pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;
  let animFrame;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    animFrame = requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; cursorTrail.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; cursorTrail.style.opacity = '0.6'; });
}

/* ============================
   NAV SCROLL STATE
   ============================ */
const nav = document.getElementById('nav');

const handleNavScroll = () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ============================
   HAMBURGER MENU
   ============================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu on link click
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (navLinks?.classList.contains('open') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ============================
   SCROLL REVEAL (IntersectionObserver)
   ============================ */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = Array.from(entry.target.parentElement?.querySelectorAll('.reveal') || []);
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 80, 400);

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ============================
   HERO CARD PARALLAX (mouse tilt)
   ============================ */
const heroSection  = document.querySelector('.hero');
const heroCards    = document.querySelectorAll('.card-item');

if (heroSection && heroCards.length && window.matchMedia('(pointer: fine)').matches) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (e.clientX - rect.left - cx) / cx;
    const dy = (e.clientY - rect.top  - cy) / cy;

    heroCards.forEach((card, i) => {
      const factor = (i + 1) * 4;
      card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease';
      if (!card.matches(':hover')) {
        const baseRotate = ['-8deg', '2deg', '9deg'][i] || '0deg';
        card.style.transform = `rotate(${baseRotate}) translate(${dx * factor}px, ${dy * factor}px)`;
      }
    });
  });

  heroSection.addEventListener('mouseleave', () => {
    heroCards[0].style.transform = 'rotate(-8deg) translate(-30px, 20px)';
    heroCards[1].style.transform = 'translateX(-50%) rotate(2deg)';
    heroCards[2].style.transform = 'rotate(9deg) translate(30px, 20px)';
  });
}

/* ============================
   SMOOTH SCROLL (internal links)
   ============================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================
   ACTIVE NAV LINK (scroll spy)
   ============================ */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      activeLink?.classList.add('active');
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(s => spyObserver.observe(s));

/* ============================
   SPORT CARD HOVER GLOW
   ============================ */
document.querySelectorAll('.sport-card').forEach(card => {
  const colors = {
    football:   'rgba(215, 43, 43, 0.12)',
    basketball: 'rgba(255, 140, 0, 0.12)',
    baseball:   'rgba(26, 58, 143, 0.14)',
    soccer:     'rgba(58, 143, 43, 0.12)',
    pokemon:    'rgba(255, 215, 0, 0.1)',
  };
  const sport = card.dataset.sport;
  const color = colors[sport] || 'rgba(255,255,255,0.05)';

  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = `0 20px 48px rgba(0,0,0,0.4), 0 0 40px ${color}`;
    card.style.background = `linear-gradient(145deg, ${color}, var(--navy-card))`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
    card.style.background = '';
  });
});

/* ============================
   CONTACT FORM
   ============================ */
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled    = true;
    btn.style.opacity = '0.7';

    // Simulate submit (replace with Netlify form or backend)
    setTimeout(() => {
      btn.textContent  = '✓ Message Sent!';
      btn.style.background = 'var(--green)';
      formSuccess?.classList.add('show');
      contactForm.reset();

      setTimeout(() => {
        btn.textContent  = originalText;
        btn.disabled     = false;
        btn.style.opacity = '1';
        btn.style.background = '';
        formSuccess?.classList.remove('show');
      }, 4000);
    }, 1200);
  });
}

/* ============================
   CARD STACK FLOAT ANIMATION
   ============================ */
function floatCards() {
  const cards = document.querySelectorAll('.card-item');
  if (!cards.length) return;

  let t = 0;
  function tick() {
    t += 0.02;
    cards.forEach((card, i) => {
      if (!card.matches(':hover')) {
        const baseRotations  = [-8, 2, 9];
        const baseTranslates = [[-30, 20], [-50, 0], [30, 20]];
        const floatY = Math.sin(t + i * 1.2) * 5;
        const floatR = Math.sin(t * 0.7 + i * 0.8) * 1.5;
        const rot    = baseRotations[i]  + floatR;

        if (i === 1) {
          card.style.transform = `translateX(-50%) rotate(${rot}deg) translateY(${floatY}px)`;
        } else {
          card.style.transform = `rotate(${rot}deg) translate(${baseTranslates[i][0]}px, ${baseTranslates[i][1] + floatY}px)`;
        }
      }
    });
    requestAnimationFrame(tick);
  }
  tick();
}

floatCards();

/* ============================
   COUNTER ANIMATION (Live Stats)
   ============================ */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1400;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}

/* Trigger counter if stat nums are numeric */
const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el  = entry.target;
      const val = parseInt(el.textContent);
      if (!isNaN(val)) animateCounter(el, val);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(n => counterObserver.observe(n));

/* ============================
   GRADIENT ANIMATION (hero)
   ============================ */
const heroGradient = document.querySelector('.hero-gradient');
if (heroGradient) {
  let gradAngle = 0;
  const animGradient = () => {
    gradAngle = (gradAngle + 0.1) % 360;
    heroGradient.style.background = `
      radial-gradient(ellipse 70% 60% at ${30 + Math.sin(gradAngle * 0.017) * 5}% 50%, rgba(26, 58, 143, 0.35) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at ${80 + Math.cos(gradAngle * 0.017) * 5}% 20%, rgba(215, 43, 43, 0.2) 0%, transparent 60%),
      radial-gradient(ellipse 40% 50% at 70% 80%, rgba(58, 143, 43, 0.1) 0%, transparent 60%),
      linear-gradient(165deg, var(--navy-mid) 0%, var(--navy) 100%)
    `;
    requestAnimationFrame(animGradient);
  };
  animGradient();
}

/* ============================
   NETLIFY FORM CONFIG
   
   To enable form on Netlify:
   1. Add to <form> tag: data-netlify="true" name="contact"
   2. Add hidden input: <input type="hidden" name="form-name" value="contact" />
   3. Remove the e.preventDefault() simulation above and let Netlify handle it
   ============================ */

console.log('%cChasing Cards Solutions', 'color:#D72B2B;font-size:20px;font-weight:900;font-family:sans-serif;');
console.log('%cBuilt by Ron Lenser Digital — ronlenserdigital.com', 'color:#4CAF35;font-size:12px;');

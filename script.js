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

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

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
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'var(--green)';
      formSuccess?.classList.add('show');
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.background = '';
        formSuccess?.classList.remove('show');
      }, 4000);
    } else {
      btn.textContent = 'Something went wrong';
      btn.style.background = 'var(--red)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.background = '';
      }, 3000);
    }
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
// hero gradient handled in CSS now

console.log('%cChasing Cards Solutions', 'color:#D72B2B;font-size:20px;font-weight:900;font-family:sans-serif;');
console.log('%cBuilt by Ron Lenser Digital — ronlenserdigital.com', 'color:#4CAF35;font-size:12px;');

/* ============================
   SHOP ENGINE — Google Sheet inventory
   
   SETUP (one time):
   1. Client makes Google Sheet with columns:
      name | sport | price | image_url | payment_link | status
   2. File > Share > Publish to web > CSV > copy link
   3. Paste that link below as SHEET_CSV_URL
   
   Client adds a row = card appears on site.
   Client sets status to SOLD = shows sold badge.
   Client deletes row = card gone.
   Buy button = their Stripe Payment Link (stripe.com > Payment Links)
   ============================ */
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSJJap1vbKNFGlIVzqpZwX581ZUCmdL6SrF7-OEUUPMsXBL3KpBNkrB0Gbt2yqNDUKKtpDYjsMbV_LJ/pub?output=csv';

(function initShop() {
  if (!SHEET_CSV_URL) return;

  fetch(SHEET_CSV_URL)
    .then(r => { if (!r.ok) throw new Error('sheet fetch failed'); return r.text(); })
    .then(csv => {
      const rows = parseCSV(csv);
      if (!rows.length) return;

      const grid = document.getElementById('shopGrid');
      const section = document.getElementById('shop');
      if (!grid || !section) return;

      let rendered = 0;
      rows.forEach(item => {
        const name  = (item.name || '').trim();
        const price = (item.price || '').trim();
        if (!name || !price) return;

        const sold  = (item.status || '').trim().toUpperCase() === 'SOLD';
        const sport = (item.sport || '').trim();
        const img   = (item.image_url || '').trim();
        const link  = (item.payment_link || '').trim();

        const card = document.createElement('div');
        card.className = 'shop-card' + (sold ? ' sold' : '');

        const imgEl = document.createElement('img');
        imgEl.className = 'shop-card-img';
        imgEl.loading = 'lazy';
        imgEl.alt = name;
        if (img) imgEl.src = img;

        const body = document.createElement('div');
        body.className = 'shop-card-body';

        const sportEl = document.createElement('div');
        sportEl.className = 'shop-card-sport';
        sportEl.textContent = sport;

        const nameEl = document.createElement('h3');
        nameEl.className = 'shop-card-name';
        nameEl.textContent = name;

        const priceEl = document.createElement('div');
        priceEl.className = 'shop-card-price';
        priceEl.textContent = price.startsWith('$') ? price : '$' + price;

        body.appendChild(sportEl);
        body.appendChild(nameEl);
        body.appendChild(priceEl);

        if (sold) {
          const badge = document.createElement('span');
          badge.className = 'shop-sold-badge';
          badge.textContent = 'Sold';
          body.appendChild(badge);
        } else if (link) {
          const btn = document.createElement('a');
          btn.className = 'shop-buy-btn';
          btn.href = link;
          btn.target = '_blank';
          btn.rel = 'noopener';
          btn.textContent = 'Buy Now';
          body.appendChild(btn);
        } else {
          const btn = document.createElement('a');
          btn.className = 'shop-buy-btn';
          btn.href = '#contact';
          btn.textContent = 'Contact to Buy';
          body.appendChild(btn);
        }

        card.appendChild(imgEl);
        card.appendChild(body);
        grid.appendChild(card);
        rendered++;
      });

      if (rendered > 0) {
        section.style.display = '';
        addShopNavLink();
      }
    })
    .catch(err => console.warn('Shop inventory unavailable:', err.message));

  function parseCSV(text) {
    // Auto-detect delimiter: Google sometimes serves TSV even with output=csv
    const firstLine = text.slice(0, text.indexOf('\n'));
    const DELIM = (firstLine.split('\t').length > firstLine.split(',').length) ? '\t' : ',';
    const lines = [];
    let row = [], field = '', inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"' && text[i+1] === '"') { field += '"'; i++; }
        else if (c === '"') inQuotes = false;
        else field += c;
      } else {
        if (c === '"') inQuotes = true;
        else if (c === DELIM) { row.push(field); field = ''; }
        else if (c === '\n' || c === '\r') {
          if (field !== '' || row.length) { row.push(field); lines.push(row); row = []; field = ''; }
          if (c === '\r' && text[i+1] === '\n') i++;
        }
        else field += c;
      }
    }
    if (field !== '' || row.length) { row.push(field); lines.push(row); }
    if (lines.length < 2) return [];
    // Header aliases: accepts our template AND Card Dealer Pro export column names
    const ALIAS = {
      name: 'name', title: 'name', card_name: 'name', card: 'name',
      sport: 'sport', category: 'sport', sport_league: 'sport',
      price: 'price', list_price: 'price', sale_price: 'price', asking_price: 'price',
      image_url: 'image_url', image: 'image_url', front_image: 'image_url', photo: 'image_url', image_1: 'image_url',
      payment_link: 'payment_link', stripe_link: 'payment_link', buy_link: 'payment_link',
      status: 'status', availability: 'status', sold: 'status'
    };
    const headers = lines[0].map(h => {
      const key = h.trim().toLowerCase().replace(/\s+/g, '_');
      return ALIAS[key] || key;
    });
    return lines.slice(1).map(vals => {
      const obj = {};
      headers.forEach((h, i) => { if (!(h in obj) || !obj[h]) obj[h] = vals[i] || ''; });
      return obj;
    });
  }

  function addShopNavLink() {
    const navList = document.getElementById('navLinks');
    if (!navList || navList.querySelector('a[href="#shop"]')) return;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#shop';
    a.className = 'nav-link';
    a.textContent = 'Shop';
    li.appendChild(a);
    const contactLi = navList.querySelector('a[href="#contact"]')?.closest('li');
    navList.insertBefore(li, contactLi || null);
  }
})();

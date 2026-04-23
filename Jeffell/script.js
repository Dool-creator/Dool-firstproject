/* ============================================
   AURUM GRAND — SCRIPTS
   ============================================ */

'use strict';

// ── Navbar Scroll Behaviour ─────────────────
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// ── Mobile Nav Toggle ───────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  // Animate hamburger → X
  const spans = navToggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.cssText = 'transform: rotate(45deg) translate(5px, 5px)';
    spans[1].style.cssText = 'opacity: 0; transform: scaleX(0)';
    spans[2].style.cssText = 'transform: rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => (s.style.cssText = ''));
  }
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => (s.style.cssText = ''));
  });
});

// ── Scroll Reveal ────────────────────────────
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger siblings inside same parent
        const siblings = Array.from(
          entry.target.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right')
        );
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.1}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ── Active Nav Link Highlighting ─────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle(
            'active',
            a.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: '-50% 0px -50% 0px' }
);
sections.forEach(s => sectionObserver.observe(s));

// ── Booking Form ─────────────────────────────
const bookingForm    = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');

// Set minimum date for check-in to today
const today = new Date().toISOString().split('T')[0];
const checkInInput  = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');
if (checkInInput)  checkInInput.setAttribute('min', today);
if (checkOutInput) checkOutInput.setAttribute('min', today);

checkInInput && checkInInput.addEventListener('change', () => {
  const minOut = new Date(checkInInput.value);
  minOut.setDate(minOut.getDate() + 1);
  checkOutInput.setAttribute('min', minOut.toISOString().split('T')[0]);
  if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
    checkOutInput.value = minOut.toISOString().split('T')[0];
  }
});

bookingForm && bookingForm.addEventListener('submit', e => {
  e.preventDefault();
  const btn = bookingForm.querySelector('button[type="submit"]');

  // Basic validation
  const required = bookingForm.querySelectorAll('[required]');
  let valid = true;
  required.forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim()) {
      field.style.borderColor = '#c0392b';
      valid = false;
    }
  });
  if (!valid) {
    shakeElement(bookingForm.querySelector('[required]:not([value])') || btn);
    return;
  }

  // Simulate loading
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'Processing…';

  setTimeout(() => {
    bookingForm.style.display = 'none';
    bookingSuccess.classList.add('show');
  }, 1200);
});

// ── Payment Form ─────────────────────────────
const cardNumber = document.getElementById('cardNumber');
const cardName   = document.getElementById('cardName');
const cardExpiry = document.getElementById('cardExpiry');
const cardCvc    = document.getElementById('cardCvc');

const cardNumDisplay    = document.getElementById('cardNumDisplay');
const cardHolderDisplay = document.getElementById('cardHolderDisplay');
const cardExpiryDisplay = document.getElementById('cardExpiryDisplay');

// Format card number with spaces
cardNumber && cardNumber.addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g, '').substring(0, 16);
  e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
  if (cardNumDisplay) {
    const display = v.padEnd(16, '•');
    cardNumDisplay.textContent =
      display.substring(0, 4) + ' ' +
      display.substring(4, 8) + ' ' +
      display.substring(8, 12) + ' ' +
      display.substring(12, 16);
  }
});

cardName && cardName.addEventListener('input', e => {
  if (cardHolderDisplay) {
    cardHolderDisplay.textContent = e.target.value.toUpperCase() || 'YOUR NAME';
  }
});

cardExpiry && cardExpiry.addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
  e.target.value = v;
  if (cardExpiryDisplay) {
    cardExpiryDisplay.textContent = v || 'MM/YY';
  }
});

cardCvc && cardCvc.addEventListener('input', e => {
  e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
});

// Card type detection
const cardTypes = document.querySelectorAll('.card-type');
cardNumber && cardNumber.addEventListener('input', e => {
  const v = e.target.value.replace(/\s/g, '');
  cardTypes.forEach(c => c.classList.remove('active'));
  if (/^4/.test(v)) cardTypes[0].classList.add('active');
  else if (/^5[1-5]/.test(v)) cardTypes[1].classList.add('active');
  else if (/^3[47]/.test(v)) cardTypes[2].classList.add('active');
});

// Payment form submit
const paymentForm = document.getElementById('paymentForm');
paymentForm && paymentForm.addEventListener('submit', e => {
  e.preventDefault();
  const btn = paymentForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'Processing Payment…';

  setTimeout(() => {
    btn.querySelector('.btn-text').textContent = '✓ Payment Confirmed!';
    btn.style.background = '#2e7d52';
  }, 2000);
});

// ── Card type select click ───────────────────
cardTypes.forEach((ct, i) => {
  ct.addEventListener('click', () => {
    cardTypes.forEach(c => c.classList.remove('active'));
    ct.classList.add('active');
  });
});

// ── Smooth scroll for all anchor links ───────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Gallery lightbox ─────────────────────────
const galleryItems = document.querySelectorAll('.gallery-item');

// Create lightbox DOM
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <div class="lb-backdrop"></div>
  <div class="lb-content">
    <button class="lb-close" aria-label="Close">✕</button>
    <button class="lb-prev" aria-label="Previous">‹</button>
    <button class="lb-next" aria-label="Next">›</button>
    <div class="lb-img-wrap"><img id="lbImg" src="" alt="" /></div>
    <div class="lb-caption" id="lbCaption"></div>
  </div>
`;
document.body.appendChild(lightbox);

const lbStyle = document.createElement('style');
lbStyle.textContent = `
  #lightbox {
    position: fixed; inset: 0; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none;
    transition: opacity 0.3s ease;
  }
  #lightbox.open { opacity: 1; pointer-events: all; }
  .lb-backdrop {
    position: absolute; inset: 0;
    background: rgba(14,12,10,0.95);
    backdrop-filter: blur(8px);
  }
  .lb-content {
    position: relative; z-index: 1;
    max-width: 90vw; max-height: 90vh;
    display: flex; flex-direction: column; align-items: center; gap: 1rem;
  }
  .lb-img-wrap {
    max-width: 80vw; max-height: 75vh;
    overflow: hidden;
  }
  #lbImg {
    max-width: 80vw; max-height: 75vh;
    object-fit: contain; display: block;
    border: 1px solid rgba(201,168,76,0.3);
  }
  .lb-caption {
    font-size: 0.7rem; letter-spacing: 0.25em;
    text-transform: uppercase; color: var(--gold-light);
  }
  .lb-close, .lb-prev, .lb-next {
    position: absolute; background: none; border: none;
    color: rgba(247,243,236,0.7); cursor: pointer;
    font-size: 1.5rem; transition: color 0.2s;
    z-index: 2;
  }
  .lb-close { top: -2.5rem; right: 0; font-size: 1.2rem; }
  .lb-prev  { left: -3.5rem; top: 50%; transform: translateY(-50%); font-size: 2.5rem; }
  .lb-next  { right: -3.5rem; top: 50%; transform: translateY(-50%); font-size: 2.5rem; }
  .lb-close:hover, .lb-prev:hover, .lb-next:hover { color: var(--gold-light); }
`;
document.head.appendChild(lbStyle);

let currentGalleryIdx = 0;
const galleryImages = Array.from(galleryItems).map(item => ({
  src: item.querySelector('img').src,
  caption: item.querySelector('.gallery-overlay span')?.textContent || ''
}));

function openLightbox(idx) {
  currentGalleryIdx = idx;
  const { src, caption } = galleryImages[idx];
  document.getElementById('lbImg').src = src;
  document.getElementById('lbCaption').textContent = caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function nextImage() {
  openLightbox((currentGalleryIdx + 1) % galleryImages.length);
}
function prevImage() {
  openLightbox((currentGalleryIdx - 1 + galleryImages.length) % galleryImages.length);
}

galleryItems.forEach((item, idx) => {
  item.addEventListener('click', () => openLightbox(idx));
});
lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
lightbox.querySelector('.lb-next').addEventListener('click', nextImage);
lightbox.querySelector('.lb-prev').addEventListener('click', prevImage);
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft')  prevImage();
});

// ── Parallax Hero ─────────────────────────────
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
}, { passive: true });

// ── Utility: shake animation ─────────────────
function shakeElement(el) {
  if (!el) return;
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => (el.style.animation = ''), { once: true });
}
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);

// ── Floating WhatsApp visibility ─────────────
const waFloat = document.getElementById('whatsappFloat');
let waVisible = false;

window.addEventListener('scroll', () => {
  if (window.scrollY > 300 && !waVisible) {
    waFloat.style.cssText = 'transform: scale(1); opacity: 1;';
    waVisible = true;
  } else if (window.scrollY <= 300 && waVisible) {
    waVisible = false;
  }
}, { passive: true });

// ── Number counter animation (hero stats) ───
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const update = now => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(num => {
        const val = parseInt(num.textContent, 10);
        if (!isNaN(val)) animateCounter(num, val);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── Init page ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Trigger hero animation classes
  document.querySelectorAll('.hero-content .reveal').forEach((el, i) => {
    el.style.animationDelay = `${0.3 + i * 0.2}s`;
  });
});

// ── Dynamic Reservation Summary ───────────────
const ROOM_PRICES = {
  deluxe:        { label: 'Deluxe Garden Room',    price: 320  },
  ocean:         { label: 'Ocean Grand Suite',     price: 580  },
  presidential:  { label: 'Presidential Penthouse',price: 1200 }
};

const summaryRoomLabel = document.getElementById('summaryRoomLabel');
const summaryRoomPrice = document.getElementById('summaryRoomPrice');
const summaryTotal     = document.getElementById('summaryTotal');
const payBtn           = document.querySelector('.btn-pay .btn-text');

function updateSummary() {
  const roomVal   = document.getElementById('roomType')?.value  || 'deluxe';
  const checkIn   = document.getElementById('checkIn')?.value;
  const checkOut  = document.getElementById('checkOut')?.value;

  const room   = ROOM_PRICES[roomVal] || ROOM_PRICES.deluxe;
  let   nights = 1;

  if (checkIn && checkOut) {
    const msPerDay = 1000 * 60 * 60 * 24;
    const diff = (new Date(checkOut) - new Date(checkIn)) / msPerDay;
    if (diff > 0) nights = diff;
  }

  const total      = room.price * nights;
  const nightWord  = nights === 1 ? 'nuit' : 'nuits';

  if (summaryRoomLabel) summaryRoomLabel.textContent = `${room.label} × ${nights} ${nightWord}`;
  if (summaryRoomPrice) summaryRoomPrice.textContent = `$${total.toLocaleString('en-US')}`;
  if (summaryTotal)     summaryTotal.textContent     = `$${total.toLocaleString('en-US')}`;
  if (payBtn)           payBtn.textContent           = `Payer $${total.toLocaleString('en-US')} en toute sécurité`;
}

// Listen to the 3 inputs that affect the summary
['roomType', 'checkIn', 'checkOut'].forEach(id => {
  document.getElementById(id)?.addEventListener('change', updateSummary);
});

// Run once on load so the summary is never blank
updateSummary();

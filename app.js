/* ═══════════════════════════════════════════════════════
   SURENDHIRAN PORTFOLIO — app.js v20.0
   Cyberpunk Neon Template
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── Matrix Rain Background ────────────────────────── */
(function initMatrix() {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, columns, drops;

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>[]{}();';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    columns = Math.floor(W / 14);
    drops   = Array(columns).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(7,7,16,0.05)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#00ff88';
    ctx.font = '12px Share Tech Mono, monospace';
    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * 14, y * 14);
      if (y * 14 > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  window.addEventListener('resize', resize);
  resize();
  setInterval(draw, 50);
})();

/* ── Navbar scroll ─────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ── Mobile hamburger ──────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.cyber-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── Active nav on scroll ──────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.cyber-link');

const secObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(n => n.classList.remove('active'));
      const active = document.querySelector(`.cyber-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.3, rootMargin: '-60px 0px -60px 0px' });

sections.forEach(s => secObserver.observe(s));

/* ── Typing role animator ──────────────────────────── */
const roles = [
  'FULL_STACK_DEVELOPER',
  'MOBILE_APP_ENGINEER',
  'CYBER_SEC_SPECIALIST',
  'REACT_NATIVE_DEV',
  'NODE.JS_BACKEND_ENG',
];

const roleEl = document.getElementById('typedRole');
if (roleEl) {
  let ri = 0, ci = 0, del = false;

  function type() {
    const cur = roles[ri];
    roleEl.textContent = del ? cur.slice(0, --ci) : cur.slice(0, ++ci);
    if (!del && ci === cur.length) { del = true; setTimeout(type, 1800); return; }
    if ( del && ci === 0)          { del = false; ri = (ri + 1) % roles.length; }
    setTimeout(type, del ? 40 : 70);
  }
  type();
}

/* ── Project filter ────────────────────────────────── */
document.querySelectorAll('.cf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-item').forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.style.transition    = 'all 0.35s ease';
      item.style.opacity       = show ? '1' : '0.15';
      item.style.transform     = show ? 'scale(1)' : 'scale(0.96)';
      item.style.pointerEvents = show ? 'all' : 'none';
    });
  });
});

/* ── Scroll reveal ─────────────────────────────────── */
const aosEls = document.querySelectorAll('[data-aos]');
const aosObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.dataset.aosDelay || 0);
      setTimeout(() => e.target.classList.add('aos-animate'), delay);
      aosObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

aosEls.forEach(el => aosObs.observe(el));

/* ── Contact form ──────────────────────────────────── */
const form      = document.getElementById('contactForm');
const note      = document.getElementById('formNote');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('fname').value.trim();
    const email = document.getElementById('femail').value.trim();
    const msg   = document.getElementById('fmessage').value.trim();

    if (!name || !email || !msg) {
      note.textContent = '⚠ MISSING_FIELDS — please complete all inputs.';
      note.style.color = '#ff2d78';
      return;
    }

    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> TRANSMITTING...';
    submitBtn.disabled = true;

    const text = encodeURIComponent(`Ping Surendhiran!\n\nNAME: ${name}\nEMAIL: ${email}\n\nMESSAGE:\n${msg}`);
    setTimeout(() => {
      window.open(`https://wa.me/917871488475?text=${text}`, '_blank');
      note.textContent = '✓ SIGNAL_TRANSMITTED — Message sent via WhatsApp!';
      note.style.color = '#00ff88';
      form.reset();
      submitBtn.innerHTML = '<i class="fa-solid fa-satellite-dish"></i> TRANSMIT_SIGNAL.exe';
      submitBtn.disabled  = false;
      setTimeout(() => { note.textContent = ''; }, 4000);
    }, 900);
  });
}

/* ── Random glitch effect on hero name ────────────── */
(function glitchEffect() {
  const el = document.querySelector('.hero-name');
  if (!el) return;

  setInterval(() => {
    if (Math.random() > 0.85) {
      el.style.textShadow = `${(Math.random()-0.5)*6}px 0 #ff2d78, ${(Math.random()-0.5)*6}px 0 #00e5ff`;
      setTimeout(() => { el.style.textShadow = ''; }, 80);
    }
  }, 1500);
})();

/* ── Back to top ───────────────────────────────────── */
document.querySelector('.back-top')?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ═══════════════════════════════════════════════════════
   SURENDHIRAN PORTFOLIO — app.js v22.0
   Cyberpunk Neon Template
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── Matrix Rain ───────────────────────────────────── */
(function matrix() {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, cols, drops;
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEF<>{}[]()=/\\|;:';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols  = Math.floor(W / 13);
    drops = Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(6,6,16,0.055)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#00ff88';
    ctx.font = '11px Share Tech Mono, monospace';
    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * 13, y * 13);
      if (y * 13 > H && Math.random() > 0.972) drops[i] = 0;
      drops[i]++;
    });
  }

  window.addEventListener('resize', resize);
  resize();
  setInterval(draw, 48);
})();

/* ── Navbar scroll ─────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

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

new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(n => n.classList.remove('active'));
      const a = document.querySelector(`.cyber-link[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { threshold: 0.3, rootMargin: '-60px 0px -60px 0px' }).observe !== undefined
  && sections.forEach(s =>
      new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            navItems.forEach(n => n.classList.remove('active'));
            const a = document.querySelector(`.cyber-link[href="#${e.target.id}"]`);
            if (a) a.classList.add('active');
          }
        });
      }, { threshold: 0.3, rootMargin: '-60px 0px -60px 0px' }).observe(s)
    );

/* ── Typing role ───────────────────────────────────── */
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
    setTimeout(type, del ? 38 : 68);
  }
  type();
}

/* ── Project filter ────────────────────────────────── */
document.querySelectorAll('.ff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.project-item').forEach(item => {
      const show = f === 'all' || item.dataset.category === f;
      item.style.transition    = 'all 0.35s ease';
      item.style.opacity       = show ? '1' : '0.12';
      item.style.transform     = show ? 'scale(1)' : 'scale(0.96)';
      item.style.pointerEvents = show ? 'all' : 'none';
    });
  });
});

/* ── Scroll reveal ─────────────────────────────────── */
const aosObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const d = parseInt(e.target.dataset.aosDelay || 0);
      setTimeout(() => e.target.classList.add('aos-animate'), d);
      aosObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -28px 0px' });

document.querySelectorAll('[data-aos]').forEach(el => aosObs.observe(el));

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
    submitBtn.disabled  = true;

    const text = encodeURIComponent(`Hi Surendhiran!\n\nNAME: ${name}\nEMAIL: ${email}\n\nMESSAGE:\n${msg}`);
    setTimeout(() => {
      window.open(`https://wa.me/917871488475?text=${text}`, '_blank');
      note.textContent = '✓ SIGNAL_TRANSMITTED via WhatsApp!';
      note.style.color = '#00ff88';
      form.reset();
      submitBtn.innerHTML = '<i class="fa-solid fa-satellite-dish"></i> TRANSMIT_SIGNAL.exe';
      submitBtn.disabled  = false;
      setTimeout(() => { note.textContent = ''; }, 4500);
    }, 900);
  });
}

/* ── Random hero name glitch ───────────────────────── */
const heroName = document.querySelector('.hero-name');
if (heroName) {
  setInterval(() => {
    if (Math.random() > 0.82) {
      heroName.style.textShadow = `${(Math.random()-0.5)*5}px 0 #ff2d78, ${(Math.random()-0.5)*5}px 0 #00e5ff`;
      setTimeout(() => { heroName.style.textShadow = ''; }, 70);
    }
  }, 1600);
}

/* ── Back to top ───────────────────────────────────── */
document.querySelector('.back-top')?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

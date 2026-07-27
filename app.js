/* ═══════════════════════════════════════════════════════
   SURENDHIRAN PORTFOLIO — app.js v23.0
   Professional Template
   ═══════════════════════════════════════════════════════ */

'use strict';

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

navLinks.querySelectorAll('.pro-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── Active nav link on scroll ─────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.pro-nav-link');

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(n => n.classList.remove('active'));
      const target = document.querySelector(`.pro-nav-link[href="#${entry.target.id}"]`);
      if (target) target.classList.add('active');
    }
  });
}, { threshold: 0.35, rootMargin: '-64px 0px -64px 0px' });

sections.forEach(s => activeObserver.observe(s));

/* ── Scroll reveal ─────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('[data-reveal], [data-reveal-right]').forEach(el => {
  revealObserver.observe(el);
});

/* ── Project filter tabs ────────────────────────────── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    document.querySelectorAll('.project-item').forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.style.transition    = 'opacity 0.35s ease, transform 0.35s ease';
      item.style.opacity       = show ? '1' : '0.15';
      item.style.transform     = show ? 'scale(1)' : 'scale(0.97)';
      item.style.pointerEvents = show ? 'all' : 'none';
    });
  });
});

/* ── Contact form ──────────────────────────────────── */
const form      = document.getElementById('contactForm');
const note      = document.getElementById('formNote');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('fname').value.trim();
    const email   = document.getElementById('femail').value.trim();
    const subject = document.getElementById('fsubject')?.value.trim() || 'Portfolio Enquiry';
    const msg     = document.getElementById('fmessage').value.trim();

    if (!name || !email || !msg) {
      note.textContent  = '⚠ Please fill in all required fields.';
      note.style.color  = '#ef4444';
      return;
    }

    submitBtn.innerHTML  = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled   = true;

    const text = encodeURIComponent(
      `Hi Surendhiran,\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${msg}`
    );

    setTimeout(() => {
      window.open(`https://wa.me/917871488475?text=${text}`, '_blank');
      note.textContent  = '✓ Message sent successfully via WhatsApp!';
      note.style.color  = '#059669';
      form.reset();
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      submitBtn.disabled  = false;
      setTimeout(() => { note.textContent = ''; }, 5000);
    }, 900);
  });
}

/* ── Smooth back-to-top ────────────────────────────── */
document.querySelector('.footer-top-btn')?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Staggered reveal for grid items ──────────────── */
document.querySelectorAll('.projects-grid > *, .edu-cards > *, .skills-container > *').forEach((el, i) => {
  el.style.transitionDelay = `${i * 80}ms`;
  if (!el.hasAttribute('data-reveal')) {
    el.setAttribute('data-reveal', '');
    revealObserver.observe(el);
  }
});

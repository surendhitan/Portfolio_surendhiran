/* ═══════════════════════════════════════════════════════
   SURENDHIRAN PORTFOLIO — app.js v24.0
   Dark Glassmorphism 2.0 Template
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── Navbar scroll effect ──────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Mobile hamburger menu ─────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── Active nav link on scroll ─────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-item');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(n => n.classList.remove('active'));
      const active = document.querySelector(`.nav-item[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35, rootMargin: '-64px 0px -64px 0px' });

sections.forEach(s => navObserver.observe(s));

/* ── Typing role animation ─────────────────────────── */
const roles = [
  'Full Stack Developer',
  'Mobile App Engineer',
  'Cyber Security Specialist',
  'React Native Developer',
  'Node.js Backend Dev'
];

const roleEl = document.getElementById('typedRole');
if (roleEl) {
  let roleIdx = 0, charIdx = 0, deleting = false;

  function typeRole() {
    const current = roles[roleIdx];
    if (!deleting) {
      roleEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typeRole, 2000);
        return;
      }
    } else {
      roleEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(typeRole, deleting ? 45 : 75);
  }
  typeRole();
}

/* ── Project filter ────────────────────────────────── */
const filterPills = document.querySelectorAll('.filter-pill');
const projectItems = document.querySelectorAll('.project-item');

filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const filter = pill.dataset.filter;
    projectItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.style.transition    = 'all 0.35s ease';
      item.style.opacity       = match ? '1' : '0.15';
      item.style.transform     = match ? 'scale(1)' : 'scale(0.96)';
      item.style.pointerEvents = match ? 'all' : 'none';
    });
  });
});

/* ── Scroll reveal observer ────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('[data-reveal], [data-reveal-left]').forEach(el => {
  revealObserver.observe(el);
});

/* ── Contact form submit ───────────────────────────── */
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
      note.textContent = '⚠ Please fill in all required fields.';
      note.style.color = '#ef4444';
      return;
    }

    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled  = true;

    const text = encodeURIComponent(`Hi Surendhiran!\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
    setTimeout(() => {
      window.open(`https://wa.me/917871488475?text=${text}`, '_blank');
      note.textContent  = '✓ Message sent via WhatsApp!';
      note.style.color  = '#34d399';
      form.reset();
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message via WhatsApp';
      submitBtn.disabled  = false;
      setTimeout(() => { note.textContent = ''; }, 4500);
    }, 900);
  });
}

/* ── Smooth back to top ────────────────────────────── */
document.querySelector('.back-to-top-btn')?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

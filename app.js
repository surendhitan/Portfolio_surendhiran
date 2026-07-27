/* ═══════════════════════════════════════════════════════
   SURENDHIRAN PORTFOLIO — app.js v19.0
   Dark Glassmorphism Template
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── Navbar scroll effect ──────────────────────────── */
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

// Close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── Active nav link on scroll ─────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(n => n.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.3, rootMargin: '-60px 0px -60px 0px' });

sections.forEach(s => observer.observe(s));

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
    setTimeout(typeRole, deleting ? 50 : 80);
  }
  typeRole();
}

/* ── Project filter ────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.style.transition = 'all 0.4s ease';
      item.style.opacity    = match ? '1' : '0.2';
      item.style.transform  = match ? 'scale(1)' : 'scale(0.95)';
      item.style.pointerEvents = match ? 'all' : 'none';
    });
  });
});

/* ── Scroll reveal (AOS-like) ──────────────────────── */
const aosEls = document.querySelectorAll('[data-aos]');

const aosObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.aosDelay || 0);
      setTimeout(() => {
        entry.target.classList.add('aos-animate');
      }, delay);
      aosObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

aosEls.forEach(el => aosObserver.observe(el));

/* ── Contact form ──────────────────────────────────── */
const form   = document.getElementById('contactForm');
const note   = document.getElementById('formNote');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('fname').value.trim();
    const email = document.getElementById('femail').value.trim();
    const msg   = document.getElementById('fmessage').value.trim();

    if (!name || !email || !msg) {
      note.textContent = '⚠ Please fill in all fields.';
      note.style.color = '#f87171';
      return;
    }

    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // WhatsApp send
    const text = encodeURIComponent(`Hi Surendhiran!\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
    setTimeout(() => {
      window.open(`https://wa.me/917871488475?text=${text}`, '_blank');
      note.textContent  = '✓ Message sent via WhatsApp!';
      note.style.color  = '#6ee7b7';
      form.reset();
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      submitBtn.disabled  = false;
      setTimeout(() => { note.textContent = ''; }, 4000);
    }, 800);
  });
}

/* ── Back to top smooth ────────────────────────────── */
document.querySelector('.back-to-top')?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Particle background ───────────────────────────── */
const canvas = document.createElement('canvas');
const ctx    = canvas.getContext('2d');
const particlesEl = document.getElementById('particles');
if (particlesEl) {
  particlesEl.appendChild(canvas);
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, randomParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
}

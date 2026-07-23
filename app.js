// ===== INTERACTIVE NETWORK PARTICLES CANVAS =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let maxParticles = 65;
let connectionDist = 110;

// Resize canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Reduce particles on smaller screens for performance
  if (canvas.width < 768) {
    maxParticles = 30;
    connectionDist = 80;
  } else {
    maxParticles = 65;
    connectionDist = 110;
  }
}

// Particle Class
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = (Math.random() - 0.5) * 0.45;
    this.radius = Math.random() * 1.5 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
    if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.45)'; // Muted Cyber Cyan
    ctx.fill();
  }
}

// Initialize Particle Pool
function initParticles() {
  particles = [];
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
}

// Animation Loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }

  // Draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < connectionDist) {
        // Line transparency based on distance
        const alpha = (1 - dist / connectionDist) * 0.12;
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

// Window Event Listeners
window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

// Setup
resizeCanvas();
initParticles();
animate();


// ===== STICKY NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


// ===== MOBILE HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});


// ===== ACTIVE NAVIGATION HIGHLIGHTS =====
const sections = document.querySelectorAll('section[id]');
const navLinksList = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let currentId = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      currentId = section.getAttribute('id');
    }
  });

  navLinksList.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
}, { passive: true });


// ===== PROFESSIONAL CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const service = document.getElementById('fsubject').value;
  const message = document.getElementById('fmessage').value.trim();

  if (!name || !email || !message) {
    formNote.textContent = 'ERROR: Please fill out all required fields.';
    formNote.className = 'form-note error';
    return;
  }

  // Visual Sending State
  submitBtn.textContent = 'INITIALIZING TRANSMISSION...';
  submitBtn.disabled = true;
  formNote.textContent = '';
  formNote.className = 'form-note';

  // Simulate contact endpoint transmission
  setTimeout(() => {
    submitBtn.textContent = 'TRANSMISSION COMPLETE ✅';
    submitBtn.style.border = '1px solid #10b981';
    submitBtn.style.color = '#10b981';
    submitBtn.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.4)';
    
    formNote.textContent = 'SUCCESS: Connection established. Expect response within 24h.';
    formNote.className = 'form-note success';

    setTimeout(() => {
      // Reset form states
      submitBtn.textContent = 'INITIALIZE CONTACT';
      submitBtn.style.border = '';
      submitBtn.style.color = '';
      submitBtn.style.boxShadow = '';
      submitBtn.disabled = false;
      formNote.textContent = '';
      formNote.className = 'form-note';
      contactForm.reset();
    }, 4500);
  }, 1600);
});

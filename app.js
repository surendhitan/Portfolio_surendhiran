/* ════════════════════════════════════════════════════════════
   PORTFOLIO INTERACTIVE CONTROLLER (NEO-BRUTALIST TEMPLATE)
   Developer: Surendhiran A — Full Stack Mobile & Web Developer
   ════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== 1. MOBILE HAMBURGER MENU TOGGLE =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }


  // ===== 2. ACTIVE NAVIGATION HIGHLIGHT ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let currentId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentId}`) {
        item.classList.add('active');
      }
    });
  }, { passive: true });


  // ===== 3. PROJECT CATEGORY FILTERING =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });


  // ===== 4. CONTACT FORM HANDLING =====
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formNote = document.getElementById('formNote');

  if (contactForm && submitBtn && formNote) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fname').value.trim();
      const email = document.getElementById('femail').value.trim();
      const message = document.getElementById('fmessage').value.trim();

      if (!name || !email || !message) {
        formNote.textContent = '❌ ERROR: Missing required parameters.';
        formNote.style.color = '#f43f5e';
        return;
      }

      // Visual sending state
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> TRANSMITTING PAYLOAD...';
      submitBtn.disabled = true;
      formNote.textContent = '';

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> PAYLOAD DELIVERED';
        submitBtn.style.background = '#10b981';
        submitBtn.style.color = '#000000';
        
        formNote.textContent = '✅ Transmission Status 200 OK: Message transmitted successfully!';
        formNote.style.color = '#10b981';

        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
          formNote.textContent = '';
          contactForm.reset();
        }, 4000);
      }, 1500);
    });
  }

});

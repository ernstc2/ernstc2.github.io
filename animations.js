/* animations.js — entrance animations, ripple effect, typewriter */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------
     Inject CSS for animation styles
     ------------------------------------------------------ */
  const style = document.createElement('style');
  style.textContent = `
    /* ===== Section / Footer reveal ===== */
    .reveal {
      opacity: 0;
      filter: blur(6px);
      transform: translateY(60px) scale(0.96);
      transition: opacity 1.2s cubic-bezier(0.22,0.61,0.36,1),
                  transform 1.2s cubic-bezier(0.22,0.61,0.36,1),
                  filter 1.2s cubic-bezier(0.22,0.61,0.36,1);
    }
    .reveal.show {
      opacity: 1;
      filter: blur(0);
      transform: translateY(0) scale(1);
    }

    /* ===== Header nav link reveal ===== */
    .nav-item {
      opacity: 0;
      transform: translateY(-20px);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    .nav-item.show {
      opacity: 1;
      transform: translateY(0);
    }

    /* ===== Button ripple ===== */
    .btn { position: relative; overflow: hidden; }
    .btn .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.4);
      transform: scale(0);
      animation: ripple 900ms ease-out;
      pointer-events: none;
    }
    @keyframes ripple {
      to { transform: scale(5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  /* ------------------------------------------------------
     Section / footer reveal (header excluded)
     ------------------------------------------------------ */
  const blocks = [
    ...document.querySelectorAll('section'),
    document.querySelector('footer')
  ].filter(Boolean);

  blocks.forEach((el, i) => {
    el.classList.add('reveal');
    const delay = 400 + i * 300;
    setTimeout(() => el.classList.add('show'), delay);
  });

  /* ------------------------------------------------------
     Header nav link animation — slide down individually
     ------------------------------------------------------ */
  const navItems = document.querySelectorAll('.main-nav li');
  navItems.forEach((li, i) => {
    li.classList.add('nav-item');
    const delay = 200 + i * 250;
    setTimeout(() => li.classList.add('show'), delay);
  });

  /* ------------------------------------------------------
     Ripple effect on all .btn elements
     ------------------------------------------------------ */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const span = document.createElement('span');
      span.classList.add('ripple');
      span.style.width = span.style.height = `${size}px`;
      span.style.left = `${x}px`;
      span.style.top = `${y}px`;

      btn.appendChild(span);
      span.addEventListener('animationend', () => span.remove());
    });
  });

  /* ------------------------------------------------------
     Typewriter effect — cycles through roles in hero h1 span
     ------------------------------------------------------ */
  const roles = [
    'Web Designer',
    'Solutions Engineer',
    'Software Engineer',
    'Problem Solver',
  ];

  const typeTarget = document.querySelector('.hero-text h1 span');
  if (typeTarget) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = roles[roleIndex];

      if (isDeleting) {
        typeTarget.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typeTarget.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 70 : 110;

      if (!isDeleting && charIndex === current.length) {
        delay = 2200; // pause at full word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400; // brief pause before typing next word
      }

      setTimeout(type, delay);
    }

    // Start after initial page animations settle
    setTimeout(type, 1800);
  }

  /* ------------------------------------------------------
     Active nav link on scroll (index.html only)
     Uses IntersectionObserver to highlight the current section
     ------------------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const active = document.querySelector(`.main-nav a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, {
      threshold: 0.35,
      rootMargin: '-60px 0px -40% 0px'
    });

    sections.forEach(s => sectionObserver.observe(s));
  }

  /* ------------------------------------------------------
     Scroll-to-top button
     ------------------------------------------------------ */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------
     Contact form — submit via Formspree without page redirect
     ------------------------------------------------------ */
  const contactForm = document.querySelector('.contact-form');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          contactForm.reset();
          contactForm.style.display = 'none';
          if (formSuccess) formSuccess.style.display = 'block';
        } else {
          const data = await response.json();
          const msg = data.errors
            ? data.errors.map(err => err.message).join(', ')
            : 'Something went wrong. Please try again.';
          alert(msg);
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      } catch {
        alert('Network error. Please check your connection and try again.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  /* ------------------------------------------------------
     Hamburger menu toggle
     ------------------------------------------------------ */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      mainNav.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a nav link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

});

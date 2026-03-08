/* animations.js — entrance animations, ripple effect, typewriter, counters */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------
     Header shadow on scroll
     ------------------------------------------------------ */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ------------------------------------------------------
     Section / footer reveal — IntersectionObserver
     ------------------------------------------------------ */
  const revealTargets = [
    ...document.querySelectorAll('section'),
    document.querySelector('footer')
  ].filter(Boolean);

  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ------------------------------------------------------
     Header nav link animation — slide down individually
     ------------------------------------------------------ */
  const navItems = document.querySelectorAll('.main-nav li');
  navItems.forEach((li, i) => {
    li.classList.add('nav-item');
    setTimeout(() => li.classList.add('show'), 150 + i * 120);
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

      let delay = isDeleting ? 65 : 100;

      if (!isDeleting && charIndex === current.length) {
        delay = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 350;
      }

      setTimeout(type, delay);
    }

    setTimeout(type, 1400);
  }

  /* ------------------------------------------------------
     Animated stat counters
     Looks for elements with data-target attribute
     ------------------------------------------------------ */
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  if (statNums.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        countObserver.unobserve(entry.target);

        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1400;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(updateCount);
        }

        requestAnimationFrame(updateCount);
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => countObserver.observe(el));
  }

  /* ------------------------------------------------------
     Active nav link on scroll (index.html only)
     Uses IntersectionObserver to highlight current section
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
    }, { passive: true });
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

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

});

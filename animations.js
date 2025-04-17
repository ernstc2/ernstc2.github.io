/* animations.js — fancy entrance animations
   * Sections & footer: slow blur+lift reveal
   * Header nav: separate slide‑down reveal per link (no blur)
*/

document.addEventListener('DOMContentLoaded', () => {
    /* ------------------------------------------------------
       Inject CSS for both animation styles
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
        background: rgba(255,255,255,0.5);
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
      const delay = 400 + i * 300; // start after 0.4s, then 0.3s increments
      setTimeout(() => el.classList.add('show'), delay);
    });
  
    /* ------------------------------------------------------
       Header nav link animation — slide down individually
       ------------------------------------------------------ */
    const navItems = document.querySelectorAll('.main-nav li');
    navItems.forEach((li, i) => {
      li.classList.add('nav-item');
      const delay = 200 + i * 250; // begin sooner but still staggered
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
  });
  
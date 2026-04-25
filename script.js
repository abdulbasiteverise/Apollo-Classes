(() => {
  'use strict';

  // --- Reveal on scroll ---
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('show'));
  }

  // --- Header shadow on scroll ---
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 8 ? '0 12px 28px rgba(2, 6, 23, .45)' : 'none';
  }, { passive: true });

  // --- Sticky CTA visibility control ---
  const stickyCta = document.getElementById('sticky-cta');
  const finalCta = document.getElementById('contact');
  if (stickyCta && finalCta && 'IntersectionObserver' in window) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        stickyCta.style.opacity = entry.isIntersecting ? '0' : '1';
        stickyCta.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
      });
    }, { threshold: 0.35 });

    ctaObserver.observe(finalCta);
  }

  // --- Counter animation ---
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number.parseFloat(el.dataset.count || '0');
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const isFloat = String(el.dataset.count).includes('.');
        const duration = 1100;
        let startTime;

        const step = (ts) => {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          el.textContent = `${prefix}${isFloat ? value.toFixed(1) : Math.floor(value)}${suffix}`;
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            el.textContent = `${prefix}${isFloat ? target.toFixed(1) : target}${suffix}`;
          }
        };

        window.requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  // --- Testimonials carousel ---
  const track = document.getElementById('testimonial-track');
  const dotsContainer = document.getElementById('dots');
  if (track && dotsContainer) {
    const slides = Array.from(track.children);
    let index = 0;
    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.className = `dot ${i === 0 ? 'active' : ''}`;
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => {
        index = i;
        update();
      });
      dotsContainer.appendChild(dot);
      return dot;
    });

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    };

    setInterval(() => {
      index = (index + 1) % slides.length;
      update();
    }, 4200);
  }

  // --- Subtle particles for hero ---
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const count = 34;
      const particles = [];
      const resize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };
      resize();
      window.addEventListener('resize', resize);

      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: 1 + Math.random() * 2,
          vx: -0.2 + Math.random() * 0.4,
          vy: -0.2 + Math.random() * 0.4,
        });
      }

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(250,204,21,0.7)';
          ctx.fill();
        });
        requestAnimationFrame(draw);
      };

      draw();
    }
  }
})();

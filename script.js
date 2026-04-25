/**
 * Apollo Classes — script.js
 * All browser-side logic. No frameworks, no backend.
 * Works by opening index.html directly.
 */

(function () {
  'use strict';

  /* ─── SCROLL-REVEAL (IntersectionObserver) ─── */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: just show all elements immediately
      document.querySelectorAll('.fade-up').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-up').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ─── NAVBAR SHADOW ON SCROLL ─── */
  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  /* ─── STICKY CTA: hide when final-cta section is visible ─── */
  function initStickyCta() {
    var stickyCta  = document.getElementById('sticky-cta');
    var finalCta   = document.getElementById('contact');
    if (!stickyCta || !finalCta) return;

    if (!('IntersectionObserver' in window)) return;

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          // When the final CTA is visible, hide the floating bar
          stickyCta.style.opacity    = entry.isIntersecting ? '0' : '1';
          stickyCta.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
        });
      },
      { threshold: 0.2 }
    );

    obs.observe(finalCta);
  }

  /* ─── SMOOTH SCROLL for anchor links ─── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        var offset = 70; // navbar height
        var top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ─── STATS COUNTER ANIMATION ─── */
  function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el     = entry.target;
          var target = parseFloat(el.dataset.count);
          var suffix = el.dataset.suffix || '';
          var prefix = el.dataset.prefix || '';
          var isFloat = (el.dataset.count.indexOf('.') !== -1);
          var duration = 1200;
          var start    = null;

          function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            var val      = target * eased;
            el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = prefix + (isFloat ? target.toFixed(1) : target) + suffix;
          }

          requestAnimationFrame(step);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ─── INIT ─── */
  function init() {
    initScrollReveal();
    initNavbarScroll();
    initStickyCta();
    initSmoothScroll();
    animateCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

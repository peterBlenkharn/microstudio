// ===== Scroll Reveal =====
// Adds .visible class to panels and sections when they enter the viewport.
// Works with CSS opacity/transform transitions in about.css and sections.css.

document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.about-panels .panel, .reveal-section');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
});

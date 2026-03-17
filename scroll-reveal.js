// ===== Scroll Reveal =====
// Adds .visible class to panels when they enter the viewport.
// Works with CSS opacity/transform transitions in about.css.

document.addEventListener('DOMContentLoaded', () => {
  const panels = document.querySelectorAll('.about-panels .panel');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    panels.forEach(panel => panel.classList.add('visible'));
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

  panels.forEach(panel => observer.observe(panel));
});

// ===== Scroll Reveal =====
// Adds .visible class to panels and sections when they enter the viewport.
// Works with CSS opacity/transform transitions in about.css and sections.css.
//
// Progressive enhancement: .reveal-section elements are visible by default.
// JS adds .reveal-ready to enable the animation, so content is never hidden
// if JavaScript fails to load or execute.

document.addEventListener('DOMContentLoaded', () => {
  const panels = document.querySelectorAll('.about-panels .panel');
  const sections = document.querySelectorAll('.reveal-section');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    panels.forEach(el => el.classList.add('visible'));
    sections.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // About panels — already hidden via CSS in about.css
  panels.forEach(el => observer.observe(el));

  // New sections — mark as ready for animation, then observe.
  // This ensures content is visible if JS doesn't run.
  sections.forEach(el => {
    el.classList.add('reveal-ready');
    observer.observe(el);
  });
});

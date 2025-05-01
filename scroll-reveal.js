// scroll-reveal.js
document.addEventListener('DOMContentLoaded', () => {
  const panels = document.querySelectorAll('.about-panels .panel');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  panels.forEach(panel => observer.observe(panel));
});

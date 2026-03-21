// ===== Confetti Background =====
// Decorative confetti shapes with mouse/scroll parallax.
// Reduced from 500 to 60 pieces for performance.

const NUM_CONFETTI = window.innerWidth < 768 ? 30 : 60;
const COLORS = ['#FFD700', '#FF2E63', '#08D9D6'];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function generateGridPoints(cols, rows, width, height, count) {
  const pts = [];
  const cellW = width / cols;
  const cellH = height / rows;
  const jitterW = cellW * 0.3;
  const jitterH = cellH * 0.3;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * cellW + cellW / 2;
      const cy = row * cellH + cellH / 2;
      pts.push([
        cx + random(-jitterW, jitterW),
        cy + random(-jitterH, jitterH)
      ]);
    }
  }

  shuffleArray(pts);
  return pts.slice(0, count);
}

// ===== Shape Generators =====
const SHAPE_GENERATORS = {
  circle: () => {
    const el = document.createElement('div');
    el.style.borderRadius = '50%';
    return el;
  },
  square: () => {
    const el = document.createElement('div');
    el.style.borderRadius = '4px';
    return el;
  },
  triangle: () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    const tri = document.createElementNS(svgNS, 'polygon');
    tri.setAttribute('points', '10,0 20,20 0,20');
    tri.setAttribute('fill', 'currentColor');
    svg.appendChild(tri);
    svg.style.display = 'block';
    return svg;
  },
  star: () => {
    const el = document.createElement('div');
    el.innerHTML = '&#9733;';
    el.style.fontSize = '16px';
    el.style.lineHeight = '1';
    return el;
  },
  cross: () => {
    const el = document.createElement('div');
    el.style.width = '12px';
    el.style.height = '12px';
    el.style.position = 'relative';

    const createBar = (rotate) => {
      const bar = document.createElement('div');
      bar.style.cssText = `
        background: currentColor;
        width: 100%;
        height: 4px;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%)${rotate ? ' rotate(90deg)' : ''};
        border-radius: 2px;
      `;
      return bar;
    };

    el.append(createBar(false), createBar(true));
    return el;
  }
};

// ===== Confetti Piece =====
function createConfettiPiece(container, x, y) {
  const types = Object.keys(SHAPE_GENERATORS);
  const type = types[Math.floor(Math.random() * types.length)];
  const el = SHAPE_GENERATORS[type]();

  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const size = random(10, 18);
  const rot = random(0, 360);
  const depth = random(0.4, 1.8);

  el.classList.add('confetti');
  el.style.position = 'absolute';
  el.style.opacity = String(0.15 + depth * 0.15);

  if (type !== 'triangle') {
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
  }

  if (type === 'circle' || type === 'square') {
    el.style.backgroundColor = color;
  } else {
    el.style.color = color;
  }

  el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${depth})`;
  el.style.willChange = 'transform';

  el.dataset.baseX = x;
  el.dataset.baseY = y;
  el.dataset.rotation = rot;
  el.dataset.depth = depth;

  container.append(el);
}

// ===== Parallax (throttled via rAF) =====
let rafId = null;

function updateParallax(mouseX, mouseY, scrollY, pieces) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (const el of pieces) {
    const bx = parseFloat(el.dataset.baseX);
    const by = parseFloat(el.dataset.baseY);
    const rot = parseFloat(el.dataset.rotation);
    const d = parseFloat(el.dataset.depth);

    const offX = (mouseX - centerX) * 0.008 * d;
    const offY = (mouseY - centerY + scrollY) * 0.008 * d;

    el.style.transform = `translate(${bx + offX}px, ${by + offY}px) rotate(${rot}deg) scale(${d})`;
  }
}

// ===== Init =====
function initConfetti() {
  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const container = document.getElementById('confetti-bg');
  if (!container) return;

  const W = window.innerWidth;
  const H = window.innerHeight;

  const cols = Math.ceil(Math.sqrt(NUM_CONFETTI * (W / H)));
  const rows = Math.ceil(NUM_CONFETTI / cols);
  const points = generateGridPoints(cols, rows, W, H, NUM_CONFETTI);

  for (let i = 0; i < NUM_CONFETTI; i++) {
    const [x, y] = points[i];
    createConfettiPiece(container, x, y);
  }

  // Cache NodeList for performance
  const pieces = container.querySelectorAll('.confetti');
  let mx = W / 2, my = H / 2;

  function scheduleUpdate() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      updateParallax(mx, my, window.scrollY, pieces);
      rafId = null;
    });
  }

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    scheduleUpdate();
  }, { passive: true });

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
}

initConfetti();

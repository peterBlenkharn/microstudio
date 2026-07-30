// ===== Confetti Background =====
// Decorative confetti shapes with mouse/scroll parallax.
// Reduced from 500 to 60 pieces for performance.

const COMPACT_BREAKPOINT = 480;
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;
const COMPACT_CONFETTI = 12;
const MOBILE_CONFETTI = 18;
const TABLET_CONFETTI = 30;
const DESKTOP_CONFETTI = 60;
const COLORS = ['#FFD700', '#FF2E63', '#08D9D6'];

function getConfettiCount(width) {
  if (width < COMPACT_BREAKPOINT) return COMPACT_CONFETTI;
  if (width <= MOBILE_BREAKPOINT) return MOBILE_CONFETTI;
  if (width < TABLET_BREAKPOINT) return TABLET_CONFETTI;
  return DESKTOP_CONFETTI;
}

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
  el.dataset.baseX = x;
  el.dataset.baseY = y;
  el.dataset.rotation = rot;
  el.dataset.depth = depth;

  container.append(el);
  return el;
}

// ===== Parallax (throttled via rAF) =====
let rafId = null;

function updateParallax(mouseX, mouseY, scrollY, pieces, parallaxEnabled) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (const el of pieces) {
    const bx = parseFloat(el.dataset.baseX);
    const by = parseFloat(el.dataset.baseY);
    const rot = parseFloat(el.dataset.rotation);
    const d = parseFloat(el.dataset.depth);

    const offX = parallaxEnabled ? (mouseX - centerX) * 0.008 * d : 0;
    const offY = parallaxEnabled ? (mouseY - centerY + scrollY) * 0.008 * d : 0;

    el.style.transform = `translate(${bx + offX}px, ${by + offY}px) rotate(${rot}deg) scale(${d})`;
  }
}

// ===== Init =====
function initConfetti() {
  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const container = document.getElementById('confetti-bg');
  if (!container) return;

  const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
  const pieces = [];
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  function layoutPieces() {
    const width = Math.max(window.innerWidth, 1);
    const height = Math.max(window.innerHeight, 1);
    const count = getConfettiCount(width);
    const parallaxEnabled = shouldUseParallax();

    while (pieces.length < count) {
      pieces.push(createConfettiPiece(container, 0, 0));
    }

    while (pieces.length > count) {
      pieces.pop().remove();
    }

    const cols = Math.ceil(Math.sqrt(count * (width / height)));
    const rows = Math.ceil(count / cols);
    const points = generateGridPoints(cols, rows, width, height, count);

    pieces.forEach((piece, index) => {
      const [x, y] = points[index];
      piece.dataset.baseX = x;
      piece.dataset.baseY = y;
      piece.style.willChange = parallaxEnabled ? 'transform' : 'auto';
    });

    scheduleUpdate();
  }

  function shouldUseParallax() {
    return window.innerWidth > MOBILE_BREAKPOINT && !coarsePointerQuery.matches;
  }

  function scheduleUpdate() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      updateParallax(mx, my, window.scrollY, pieces, shouldUseParallax());
      rafId = null;
    });
  }

  layoutPieces();

  document.addEventListener('mousemove', e => {
    if (!shouldUseParallax()) return;
    mx = e.clientX;
    my = e.clientY;
    scheduleUpdate();
  }, { passive: true });

  window.addEventListener('scroll', () => {
    if (shouldUseParallax()) scheduleUpdate();
  }, { passive: true });

  let resizeRafId = null;
  window.addEventListener('resize', () => {
    if (resizeRafId) return;

    resizeRafId = requestAnimationFrame(() => {
      resizeRafId = null;
      mx = window.innerWidth / 2;
      my = window.innerHeight / 2;
      layoutPieces();
    });
  }, { passive: true });
}

initConfetti();

// ===== Configuration =====
const NUM_CONFETTI = 500;
const COLORS = ['#FFD700','#FF2E63','#08D9D6','#EAEAEA'];

// ===== Utility Functions =====
function random(min, max) {
  return Math.random() * (max - min) + min;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Generate evenly spaced but jittered grid points
function generateGridPoints(cols, rows, width, height, count) {
  const pts = [];
  const cellW   = width  / cols;
  const cellH   = height / rows;
  const jitterW = cellW   * 0.3;  // up to ±30% of cell width
  const jitterH = cellH   * 0.3;  // up to ±30% of cell height

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // cell centre
      const cx = col * cellW + cellW / 2;
      const cy = row * cellH + cellH / 2;
      // jitter around centre
      const px = cx + random(-jitterW, jitterW);
      const py = cy + random(-jitterH, jitterH);
      pts.push([px, py]);
    }
  }

  shuffleArray(pts);
  // just take as many as we need
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
    el.style.borderRadius = '6px';
    return el;
  },
  triangle: () => {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");

    const tri = document.createElementNS(svgNS, "polygon");
    tri.setAttribute("points", "10,0 20,20 0,20");
    tri.setAttribute("fill", "currentColor");
    svg.appendChild(tri);

    svg.style.display = "block";
    return svg;
  },
  star: () => {
    const el = document.createElement('div');
    el.innerHTML = '&#9733;';       // ★
    el.style.fontSize = '16px';
    el.style.lineHeight = '1';
    return el;
  },
  cross: () => {
    const el = document.createElement('div');
    el.style.width = '12px';
    el.style.height = '12px';
    el.style.position = 'relative';

    const createBar = () => {
      const bar = document.createElement('div');
      bar.style.background = 'currentColor';
      bar.style.width = '100%';
      bar.style.height = '4px';
      bar.style.position = 'absolute';
      bar.style.top = '50%';
      bar.style.left = '0';
      bar.style.transform = 'translateY(-50%)';
      bar.style.borderRadius = '2px';
      return bar;
    };

    const bar1 = createBar();
    const bar2 = createBar();
    bar2.style.transform += ' rotate(90deg)';

    el.append(bar1, bar2);
    return el;
  }
};

// ===== Confetti Creation =====
function createConfettiPiece(container, x, y) {
  // pick random shape
  const types = Object.keys(SHAPE_GENERATORS);
  const type = types[Math.floor(Math.random() * types.length)];
  const el = SHAPE_GENERATORS[type]();

  // style it
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const size  = random(8, 24);
  const rot   = random(0, 360);
  const depth = random(0.5, 1.5);

  el.classList.add('confetti');
  el.style.width        = type==='triangle' ? '' : `${size}px`;
  el.style.height       = type==='triangle' ? '' : `${size}px`;
  el.style.color        = color;
  el.style.transform    = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${depth})`;

  // store base for parallax
  el.dataset.baseX      = x;
  el.dataset.baseY      = y;
  el.dataset.rotation   = rot;
  el.dataset.depth      = depth;

  container.append(el);
}

// ===== Parallax Update =====
function updateParallax(mouseX, mouseY, scrollY) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  document.querySelectorAll('.confetti').forEach(el => {
    const bx = parseFloat(el.dataset.baseX);
    const by = parseFloat(el.dataset.baseY);
    const rot = parseFloat(el.dataset.rotation);
    const d  = parseFloat(el.dataset.depth);

    const offX = (mouseX - centerX) * 0.01 * d;
    const offY = (mouseY - centerY + scrollY) * 0.01 * d;

    el.style.transform = 
      `translate(${bx + offX}px, ${by + offY}px) rotate(${rot}deg) scale(${d})`;
  });
}

// ===== Initialization =====
function initConfetti() {
  const container = document.getElementById('confetti-bg');
  const W = window.innerWidth;
  const H = window.innerHeight;

  // build an even grid of points
  const cols = Math.ceil(Math.sqrt(NUM_CONFETTI * (W / H)));
  const rows = Math.ceil(NUM_CONFETTI / cols);
  const points = generateGridPoints(cols, rows, W, H, NUM_CONFETTI);


  // create each piece
  for (let i = 0; i < NUM_CONFETTI; i++) {
    const [x, y] = points[i];
    createConfettiPiece(container, x, y);
  }

  // track mouse & scroll
  let mx = W/2, my = H/2;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    updateParallax(mx, my, window.scrollY);
  });
  document.addEventListener('scroll', () => {
    updateParallax(mx, my, window.scrollY);
  });
    // after the for-loop that does createConfettiPiece(...)
  console.log(`🌟 Appended ${container.children.length} confetti pieces (asked for ${NUM_CONFETTI})`);
}

initConfetti();



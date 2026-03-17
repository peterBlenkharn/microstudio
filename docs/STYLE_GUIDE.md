# Visual Style Guide — Micro Studio

## Design Philosophy

The Micro Studio site should feel **energetic, youthful, and professional** — like a game studio that takes its craft seriously but doesn't take itself too seriously. Think indie game marketing meets university recruitment: bold colours, confident typography, and a sense of creative momentum.

---

## Colour Palette

### Primary Colours

| Swatch | Token | Hex | Usage |
|--------|-------|-----|-------|
| ⬛ | `--bg` | `#0a0d16` | Page background, dark text on light surfaces |
| ⬜ | `--cream` | `#f5f1e8` | Primary body text, card backgrounds, light surfaces |
| 🟡 | `--yellow` | `#ffd700` | Primary CTA buttons, "BIG" title accent, energy/optimism |
| 🔴 | `--pink` | `#ff2e63` | Secondary CTA, Panel 1 (What It Is), passion/urgency |
| 🔵 | `--cyan` | `#08d9d6` | Tertiary CTA, "micro" title accent, Panel 3, creativity/tech |

### Colour Variants

Each primary colour has four tonal variants for gradients, hover states, and emphasis:

| Variant | Suffix | Purpose |
|---------|--------|---------|
| Light | `-light` | Hover states, lighter gradient ends |
| Dark | `-dark` | Active/pressed states, darker gradient ends |
| Very Light | `-very-light` | Subtle backgrounds, disabled states |
| Very Dark | `-very-dark` | Deep gradient ends, strong contrast |

### Colour Usage Rules

1. **Dark backgrounds** (`--bg`) — use `--cream` for text
2. **Light surfaces** (`--cream` cards) — use `--bg` for text
3. **Coloured panels** — use `--bg` for text (dark on bright ensures readability)
4. **Never** place light text on yellow or cyan — contrast is insufficient
5. **Gradients** go from `-light` to `-very-dark` variants at 135deg
6. **Noise texture** overlays panels at 28% opacity for tactile depth

---

## Typography

### Font Stack

```css
font-family: 'Inter', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji';
```

**Inter** is loaded from Google Fonts (weights 400, 600, 700, 800). The emoji fallbacks support flag rendering for team member nationalities.

### Type Scale

| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| Hero "micro" | 0.3em of hero-title | 700 | Cyan, small, inline-block |
| Hero "BIG" | 2.5em of hero-title | 700 | Yellow, large, inline-block |
| Hero title base | 2rem / 3rem (768px+) | 700 | Cream |
| Section title | 2rem | 700 | Cream on dark, dark on light |
| Panel heading (h3) | 1.75rem | 700 | Dark text on coloured panel |
| Card project title | 1.5rem | 800 | Uppercase, letter-spaced |
| Body text | 1rem | 400 | line-height: 1.5 |
| Small text / taglines | 0.9rem | 400 | Lighter colour |

### Typography Rules

1. **Headings** always have `margin-bottom: 0.5em`
2. **Body text** uses `line-height: 1.5` for readability
3. **Project titles** are `text-transform: uppercase` with `letter-spacing: 0.05em`
4. **Never** use more than two font weights in a single component
5. **Emphasis** use colour (cyan, yellow, pink) rather than italic

---

## Spacing

### Layout Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--gap` | `1.5rem` | Grid gaps, component spacing |
| `--max-width` | `1200px` | Content max-width container |

### Section Padding

| Context | Padding |
|---------|---------|
| Section (mobile) | `4rem 1rem` |
| Section (768px+) | `6rem 1rem` |
| Panel strip | `3rem 0` (content padded via `__inner`) |
| Card body | `1.5rem` |

---

## Components

### Buttons

Three tiers with consistent sizing:

| Class | Background | Text | Usage |
|-------|-----------|------|-------|
| `.btn-primary` | Yellow | Dark | Main CTA (Apply, Learn More) |
| `.btn-secondary` | Pink | Dark | Secondary CTA (Newsletter) |
| `.btn-tertiary` | Cyan | Dark | Tertiary CTA (Contact) |
| `.btn-steam` | `#171a21` | Cream | Steam-specific actions |

**Button states:**
- **Hover**: `translateY(-2px)` lift + subtle shadow
- **Active**: `translateY(0)` press
- **Focus**: `2px` outline offset in button's own colour
- **Disabled**: 50% opacity, `cursor: not-allowed`

### Cards

- Background: `--cream`
- Border radius: `12px`
- Flexbox column layout with `align-items: stretch`
- Buttons pushed to bottom via `margin-top: auto`
- Subtle `box-shadow: 0 2px 8px rgba(0,0,0,0.1)`

### Panels (About Section)

- Full-width diagonal strips using `clip-path: polygon()`
- Alternating clip direction (odd/even)
- Gradient background with noise texture overlay
- Content grid: text + media side by side (stacks on mobile)
- Scroll-reveal animation: fade up from `translateY(2rem)`

---

## Animation & Interaction

### Transitions

All interactive elements use `transition: all 0.2s ease` as baseline.

### Scroll Reveal

Panels start with `opacity: 0; transform: translateY(2rem)` and transition to visible when 20% in viewport (via IntersectionObserver). Duration: `0.6s ease`.

### Confetti Background

- Fixed-position layer behind all content (`z-index: -1`)
- Shapes: circles, squares, triangles, stars, crosses
- Colours: yellow, pink, cyan (matching brand palette)
- Subtle mouse + scroll parallax based on depth value
- Reduced to 60 pieces for performance

### Reduced Motion

When `prefers-reduced-motion: reduce` is active:
- Confetti parallax is disabled
- Scroll reveal transitions are instant
- Button hover lifts are removed

---

## Responsive Breakpoints

| Breakpoint | Behaviour |
|------------|-----------|
| < 600px | Panels lose clip-path, cards stack, team details stack vertically |
| 600–768px | Intermediate layout |
| 768px+ | Full desktop layout, larger type, more padding |

---

## Image Guidelines

### Profile Photos
- **Format**: JPG (canonical), some legacy PNG
- **Naming**: camelCase (e.g., `gabrielePoma.jpg`)
- **Size**: Should be square-ish, displayed at 60px thumb / 160px detail
- **Quality**: Compress to <100KB per image

### Game Art
- **Header banners**: Landscape, displayed at `max-height: 140px`, full card width
- **Favourite game thumbnails**: Cover art, displayed as background-image in small tiles
- **Naming**: camelCase matching the Image Name field in JSON

### Icons
- **Social icons**: SVG format in `/icons/`
- **Steam icon**: PNG (`steamicon.png`)
- **Favicon**: 32x32 PNG (TODO: add more sizes)

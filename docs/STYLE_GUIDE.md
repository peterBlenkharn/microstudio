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

### Spacing Scale (Planned Addition)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `0.25rem` | Micro spacing (4px) |
| `--space-sm` | `0.5rem` | Tight spacing (8px) |
| `--space-md` | `1rem` | Standard (16px) |
| `--space-lg` | `1.5rem` | Component gap (24px) — same as `--gap` |
| `--space-xl` | `2rem` | Section spacing (32px) |
| `--space-2xl` | `3rem` | Large section (48px) |
| `--space-4xl` | `4rem` | Hero padding (64px) |

### Border Radius (Planned Addition)

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `6px` | Buttons, small elements |
| `--radius-md` | `8px` | Inputs, media containers |
| `--radius-lg` | `12px` | Cards, panels |
| `--radius-full` | `50%` | Circular elements (photos, icons) |

### Box Shadows (Planned Addition)

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.1)` | Cards, subtle elevation |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.15)` | Hover states, forms |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.2)` | Modals, dropdowns |

### Grey Text Colours (Planned Addition)

| Token | Value | Usage |
|-------|-------|-------|
| `--text-muted` | `#555` | Secondary text on light backgrounds |
| `--text-subtle` | `#999` | Placeholder text, metadata |

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
| < 480px | Small phones — minimal layout, stacked content |
| 480–768px | Large phones / small tablets — intermediate layout |
| 768–1024px | Tablets — panels gain clip-path, grid layouts |
| 1024px+ | Desktop — full layout, larger type, more padding |

### Planned Standardisation
Current breakpoints are inconsistent (480, 600, 768, 800). These will be consolidated to:
- **480px** — small phone threshold
- **768px** — tablet threshold
- **1024px** — desktop threshold (new)
- Ad-hoc breakpoints at 600px and 800px will be migrated where possible.

## New Components (Planned)

### Role Badge
Small pill showing a team member's role:
- Background: colour-coded by category (student=cream, creative=pink-light, management=cyan-light)
- Text: dark, small (0.8rem), uppercase
- Class: `.role-badge`, `.role-badge--student`, `.role-badge--creative`, `.role-badge--management`

### Subteam Tabs
Tab navigation for filtering team members by subteam:
- Active tab: underlined with brand colour
- Inactive: subtle text
- Keyboard-accessible (arrow keys to switch)
- Class: `.subteam-tabs`, `.subteam-tab`, `.subteam-tab--active`

### FAQ Accordion
Expandable Q&A items:
- Question: bold, clickable, with +/− indicator
- Answer: hidden by default, revealed with smooth height transition
- Keyboard: Enter/Space to toggle, aria-expanded attribute
- Class: `.faq-item`, `.faq-question`, `.faq-answer`

### Archive Card
Smaller card for past projects:
- Similar to game card but reduced visual weight
- Greyscale or muted colour treatment
- Class: `.archive-card`

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

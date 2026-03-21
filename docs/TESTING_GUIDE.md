# Testing Guide — Micro Studio

This guide describes how to test the Micro Studio marketing site locally before pushing changes.

---

## Setting Up a Local Server

The site uses `fetch()` to load `teamdata.json`, which requires HTTP (not `file://`).

### Option 1: Python (recommended — built-in)
```bash
cd microstudio/
python -m http.server 8000
# Open http://localhost:8000
```

### Option 2: Node.js
```bash
npx serve .
# Open the URL shown in terminal
```

### Option 3: VS Code Live Server
Install the "Live Server" extension and click "Go Live" in the bottom bar.

---

## Visual Regression Checks

Test at these viewport widths (use browser DevTools responsive mode):

### Mobile (480px)
- [ ] Hero text is readable and not overflowing
- [ ] Nav links wrap or are accessible
- [ ] About panels have no clip-path (clean edges)
- [ ] Game cards stack vertically
- [ ] Card CTA buttons stack vertically
- [ ] Team details panel: thumbnails display as horizontal row
- [ ] All text is legible (not truncated or overlapping)

### Tablet (768px)
- [ ] Hero title scales up appropriately
- [ ] About panels show clip-path diagonals
- [ ] Game cards display in grid (2-3 columns)
- [ ] Team details panel: sidebar + detail card side by side
- [ ] Section padding increases

### Desktop (1200px)
- [ ] Content constrained to max-width (1200px)
- [ ] Three game cards in a row
- [ ] About panel content: 2-column grid (text + image)
- [ ] Confetti background visible and parallax-responsive
- [ ] Hover effects work on cards and buttons

---

## Functionality Checks

### Confetti Background
- [ ] Confetti pieces render on page load
- [ ] Mouse movement causes parallax shift
- [ ] Scrolling causes parallax shift
- [ ] Shapes include circles, squares, triangles, stars, crosses
- [ ] Colours are yellow, pink, cyan (brand palette)

### Scroll Reveal
- [ ] About panels start invisible (opacity: 0)
- [ ] Scrolling into view triggers fade-in animation
- [ ] Each panel reveals independently
- [ ] Animation is smooth (not janky)

### Team Details Panel
- [ ] Clicking "Learn More" expands the team details below the game cards
- [ ] Member thumbnails appear in sidebar (or horizontal on mobile)
- [ ] First member is auto-selected
- [ ] Clicking a thumbnail loads that member's details
- [ ] Member details show: photo, name with flags, social links, blurb, favourite games
- [ ] Clicking "Learn More" again collapses the panel
- [ ] Social link icons display correctly (GitHub, LinkedIn, etc.)
- [ ] Flag emoji render for all nationalities

### External Links
- [ ] "Study Games" → opens gre.ac.uk games development page
- [ ] Social media links open in new tab
- [ ] Steam wishlist buttons are functional or show "Coming Soon" gracefully

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Press Tab repeatedly — focus moves through all interactive elements in logical order
- [ ] Skip link appears on first Tab press (if implemented)
- [ ] All buttons and links are reachable via keyboard
- [ ] Focus indicators are visible on dark and light backgrounds
- [ ] Enter/Space activates focused buttons

### Screen Reader
Test with a screen reader (VoiceOver on Mac, NVDA on Windows):
- [ ] Page title is announced
- [ ] Heading hierarchy makes sense (h1 → h2 → h3)
- [ ] Images have meaningful alt text
- [ ] Decorative elements (confetti, noise) are hidden from screen readers
- [ ] Social links announce their purpose

### Colour Contrast
Use browser DevTools or a contrast checker:
- [ ] Body text on dark background: ≥4.5:1 (cream on navy ≈ 15:1 ✓)
- [ ] Dark text on cream cards: ≥4.5:1 (navy on cream ≈ 15:1 ✓)
- [ ] Dark text on coloured panels: check across the gradient (both ends)
- [ ] Yellow panel: verify dark text contrast (historically marginal)
- [ ] Button text: dark on yellow/pink/cyan all pass

### Reduced Motion
1. In DevTools: Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce"
2. Verify:
   - [ ] Confetti parallax is disabled or static
   - [ ] Scroll reveal is instant (no transition)
   - [ ] Button hover lifts are removed
   - [ ] Page is still fully usable

---

## Console & Network Checks

### Console (DevTools → Console)
- [ ] Zero errors on page load
- [ ] Zero errors after clicking "Learn More" on each game card
- [ ] Zero errors after clicking through member thumbnails
- [ ] Warnings are reviewed (some polyfill warnings may be acceptable)

### Network (DevTools → Network)
- [ ] No 404 errors for images, CSS, JS, or JSON
- [ ] `teamdata.json` loads successfully (Status 200)
- [ ] All profile images load
- [ ] All game art images load
- [ ] Social icon SVGs load
- [ ] Google Fonts loads (Inter)

---

## Performance Quick Check

- [ ] Page load feels fast (<3 seconds on a reasonable connection)
- [ ] Scrolling is smooth (no jank from confetti or animations)
- [ ] Images are not excessively large (check Network tab for >500KB images)
- [ ] No obvious layout shifts during load (CLS)

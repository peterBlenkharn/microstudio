# CLAUDE.md — Micro Studio Marketing Site

## Project Overview

**Micro Studio** is an extracurricular programme at the **University of Greenwich** where selected BSc Games Development undergraduates form small teams and build complete games in **12 weeks**, with the objective of launching on **Steam**. Students receive a brief, constraints, and support from lecturers (acting as game directors), university staff, and external artists.

This repository is a **single-page GitHub Pages site** serving as the promotional marketing landing page for the programme. It targets prospective students, industry partners, university stakeholders, and the general public.

**Live URL:** `https://peterBlenkharn.github.io/microstudio/`

---

## Architecture

### Tech Stack
- **Pure HTML/CSS/JS** — no build tools, no frameworks, no bundlers
- **GitHub Pages** — static hosting from the `main` branch
- **Assets** — all images/icons stored locally in the repo (no CDN except country-flag-emoji polyfill)

### File Structure
```
microstudio/
├── index.html              # Single-page site (all sections)
├── teamdata.json           # Team member data (profiles, links, favourites)
├── confetti.js             # Background confetti animation with parallax
├── scroll-reveal.js        # IntersectionObserver-based scroll reveal for panels
├── team-details.js         # Dynamic team member detail panel (reads teamdata.json)
├── styles/
│   ├── variables.css       # CSS custom properties (colours, spacing, layout)
│   ├── base.css            # Reset, typography, section defaults
│   ├── layout.css          # Confetti canvas, footer layout
│   ├── components.css      # Buttons, card grid, icon utility
│   ├── teams.css           # Team detail panel (thumbnails, member cards, games row)
│   └── modules/
│       ├── hero.css        # Hero section, nav, title typography
│       ├── about.css       # About panels (clip-path strips, gradients, noise)
│       └── teams.css       # Game cards (art, body, CTA, Steam button)
├── icons/                  # SVG social icons, Steam icon, favicon
├── images/
│   ├── profilepics/        # Team member headshots (.jpg primary, some .png legacy)
│   ├── gamepics/           # Favourite game cover art thumbnails
│   ├── drinkpics/          # TODO: Favourite drink images (empty)
│   ├── snackpics/          # TODO: Favourite snack images (empty)
│   ├── team-*.jpg          # Team group photos
│   ├── *_header.jpg        # Game header/banner art for cards
│   └── what_is_it.jpg etc. # About panel imagery
├── textures/
│   └── noise.png           # Noise overlay for panel gradients
├── docs/
│   ├── STYLE_GUIDE.md      # Visual design system documentation
│   ├── CONTENT_GUIDE.md    # Writing voice, tone, and content standards
│   └── STRUCTURE.md        # Site architecture and section breakdown
└── style.css               # LEGACY — kept for reference, not loaded
```

### CSS Architecture
CSS is loaded as **modular files** in this order (specificity matters):
1. `variables.css` — custom properties only
2. `base.css` — reset + typography
3. `layout.css` — structural layout (confetti, footer)
4. `teams.css` (root styles/) — team detail panel
5. `components.css` — reusable components (buttons, cards, icons)
6. `modules/hero.css` — hero-specific styles
7. `modules/about.css` — about panel-specific styles
8. `modules/teams.css` — game card-specific styles

**IMPORTANT:** `style.css` in the root is a **legacy monolith** that is no longer loaded. All styles live in the `styles/` directory. Do not add styles to `style.css`.

### JavaScript
- **confetti.js** — Creates decorative confetti background with mouse/scroll parallax. Runs on load (no DOMContentLoaded needed as it's at the bottom of body).
- **scroll-reveal.js** — Uses IntersectionObserver to add `.visible` class to `.panel` elements for fade-in animation.
- **team-details.js** — Fetches `teamdata.json`, handles "Learn More" click on game cards, builds member thumbnail sidebar and detail panels dynamically.

### Data Model (teamdata.json)
```json
{
  "Team Name": {
    "Member Name": {
      "Profile Image Name": "camelCaseFilename",  // without extension
      "Nationalities": ["GB", "IT"],               // ISO 3166-1 alpha-2
      "Links": { "Github": "url", "LinkedIn": "url", ... },
      "Blurb": "Bio text",
      "Favourite Games": { "Game 1": { "Game Name": "", "Steam Link": "", "Image Name": "" } },
      "Favourite Drink": { "Drink Name": "", "Image Name": "" },
      "Favourite Snack": { "Snack Name": "", "Image Name": "" }
    }
  }
}
```

---

## Development Guidelines

### Colour Palette
| Token       | Hex       | Usage                          |
|-------------|-----------|--------------------------------|
| `--bg`      | `#0a0d16` | Page background (deep navy)    |
| `--cream`   | `#f5f1e8` | Primary text, card backgrounds |
| `--yellow`  | `#ffd700` | Primary CTA, "BIG" accent      |
| `--pink`    | `#ff2e63` | Secondary CTA, Panel 1         |
| `--cyan`    | `#08d9d6` | Tertiary CTA, "micro" accent   |

Each colour has `-light`, `-dark`, `-very-light`, `-very-dark` variants.

### Conventions
- **No build step** — all changes are live as soon as pushed to `main`
- **camelCase** for image filenames (e.g., `assassinsCreedOdyssey.jpg`)
- **kebab-case** for CSS class names (e.g., `.game-card`, `.btn-primary`)
- **BEM-lite** for component sub-elements (e.g., `.panel__inner`, `.panel__content`)
- Profile images: `.jpg` is canonical, `.png` is legacy (JS loads `.jpg` for detail view)
- All asset paths in JS use `/microstudio/` prefix (GitHub Pages base path)

### Adding a New Team Member
1. Add their data to `teamdata.json` under the appropriate team key
2. Add their profile photo as `images/profilepics/camelCaseName.jpg`
3. Add their favourite game cover images to `images/gamepics/`
4. Optionally add drink/snack images to respective directories

### Adding a New Team/Game
1. Add team data to `teamdata.json`
2. Add a new `.card.game-card` block in `index.html` under the `#teams` section
3. Add header art as `images/gameName_header.jpg`
4. Add team group photo as `images/team-X.jpg`

### Known TODOs / Placeholders
- [ ] Drink/snack images directories are empty — need actual photos
- [ ] Steam store pages not yet live — wishlist buttons show "Coming Soon"
- [ ] Newsletter signup needs a real form backend (e.g., Mailchimp, Google Form)
- [ ] Contact/support section needs real email or form destination
- [ ] Several Parapet team members have empty profiles in teamdata.json
- [ ] Peter Blenkharn (Management) has no blurb yet
- [ ] OG image for social sharing needs to be created (1200x630)
- [ ] Favicon needs additional sizes (16x16, 180x180 apple-touch-icon)

### Performance Notes
- Confetti system creates DOM elements (currently 60 pieces). Keep this number reasonable.
- Images are not optimised — consider running through a compressor before final launch
- No lazy loading on images yet — all load eagerly
- Font (Inter) loaded from Google Fonts CDN

### Accessibility Checklist
- [ ] All images have meaningful alt text
- [ ] Buttons have visible focus states
- [ ] Colour contrast meets WCAG AA on all text
- [ ] Skip-to-content link present
- [ ] Reduced motion media query respects user preferences

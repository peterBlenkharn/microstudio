# CLAUDE.md — Micro Studio Marketing Site

## Project Overview

**Micro Studio** is an extracurricular programme at the **University of Greenwich** where selected BSc Games Development undergraduates form small teams and build complete games, with the objective of launching on **Steam**. Students receive a brief, constraints, and support from lecturers (acting as game directors), university staff, and external creative professionals.

**2026 is Cohort 3** — the programme's third year. This cohort has shifted to a **single-project model**: one unified game developed by three subteams, rather than three separate games.

This repository is a **single-page GitHub Pages site** serving as the promotional marketing landing page for the programme. It targets prospective students, industry partners, university stakeholders, potential employers, and the general public.

**Live URL:** `https://peterBlenkharn.github.io/microstudio/`

---

## Current Cohort (2026 — Cohort 3)

### The Game: Whoever Left the Light On

A first-person surrealist exploration game set entirely within a single room — the inside of someone's mind, infected by digital noise. The room transforms around the player using dream logic. Built in Unity 6 (URP) for Windows PC (Steam). Target playtime: 60–90 minutes.

**Core Pillars:** Surreal over Real | Aggressive Scope Control | Diegetic Immersion | Strangeness and Simplicity

**Art Direction:** "Digital Dadaism" — surrealist black & white collage with glitch/static motifs.

### Team Structure

| Role | Name | Category |
|------|------|----------|
| Lecturer / Game Director | Peter Blenkharn | Management |
| University Technician | Andrei Copaceanu | Management |
| Music Director | Sam Hall | Creative |
| Voice Artist / Actor / Dancer | Amy-May Trudgeon | Creative |
| Voice Actor | Amy Dickinson | Creative |
| Voice Actor / Improvisor | Tim Meredith | Creative |

Three student subteams, each with a team leader:
- **Game Design** — game mechanics, level design, puzzles
- **Programming** — systems, interaction, state management
- **Creative Production** — art, audio, VFX, assets

### Previous Cohorts (Archive)

- **Cohort 2 (2025):** Three games — The Lost Museum, Ghrystlyst, Parapet
- **Cohort 1 (2024):** [Details TBD]

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
│   ├── STRUCTURE.md        # Site architecture and section breakdown
│   ├── DECISIONS.md        # Architecture Decision Records (ADR log)
│   ├── CHANGELOG.md        # Version history and changes
│   ├── TESTING_GUIDE.md    # How to test and verify changes locally
│   ├── QA_CHECKLIST.md     # Pre-commit quality checklist
│   ├── GOTCHAS.md          # Known pitfalls and lessons learned
│   └── AGENT_INSTRUCTIONS.md # AI agent-specific rules and danger zones
├── CONTRIBUTING.md         # Git workflow and contribution guide
├── README.md               # Project overview and quick start
└── style.css               # LEGACY — not loaded, scheduled for deletion
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

**IMPORTANT:** `style.css` in the root is a **legacy monolith** that is no longer loaded. All styles live in the `styles/` directory. Do not add styles to `style.css`. It is scheduled for deletion.

### JavaScript
- **confetti.js** — Creates decorative confetti background with mouse/scroll parallax. Respects `prefers-reduced-motion`.
- **scroll-reveal.js** — Uses IntersectionObserver to add `.visible` class to `.panel` elements for fade-in animation.
- **team-details.js** — Fetches `teamdata.json`, handles "Learn More" click on game cards, builds member thumbnail sidebar and detail panels dynamically.

### Data Model (teamdata.json)

The data model is being restructured for Cohort 3's single-project model. See `docs/DECISIONS.md` ADR-004 for rationale.

Current schema (Cohort 2 / legacy):
```json
{
  "Team Name": {
    "Member Name": {
      "Profile Image Name": "camelCaseFilename",
      "Nationalities": ["GB", "IT"],
      "Links": { "Github": "url", "LinkedIn": "url" },
      "Blurb": "Bio text",
      "Favourite Games": { "Game 1": { "Game Name": "", "Steam Link": "", "Image Name": "" } },
      "Favourite Drink": { "Drink Name": "", "Image Name": "" },
      "Favourite Snack": { "Snack Name": "", "Image Name": "" }
    }
  }
}
```

---

## Danger Zones — Read Before Changing

These areas are tightly coupled and will break things if modified carelessly:

1. **CSS load order in `<head>`** — changing the order of stylesheet `<link>` tags breaks specificity. The order in index.html must match the order listed above.
2. **`/microstudio/` path prefix** — ALL asset paths in JavaScript must include this prefix (GitHub Pages base path). CSS paths are relative and do NOT need it. HTML paths are relative and do NOT need it.
3. **teamdata.json ↔ team-details.js** — the JS reads specific keys from the JSON. Changing key names in one file requires updating the other.
4. **Flag emoji polyfill** — must load before team-details.js in the HTML.
5. **Profile image naming** — JS constructs paths from the `Profile Image Name` field + `.jpg` extension. The filename must match exactly (camelCase).

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

Each colour has `-light`, `-dark`, `-very-light`, `-very-dark` variants defined in `variables.css`.

### Conventions
- **No build step** — all changes are live as soon as pushed to `main`
- **camelCase** for image filenames (e.g., `assassinsCreedOdyssey.jpg`)
- **kebab-case** for CSS class names (e.g., `.game-card`, `.btn-primary`)
- **BEM-lite** for component sub-elements (e.g., `.panel__inner`, `.panel__content`)
- Profile images: `.jpg` is canonical, `.png` is legacy (JS loads `.jpg` for detail view)
- All asset paths in JS use `/microstudio/` prefix (GitHub Pages base path)
- **British English** throughout (colour, programme, specialise)

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

### Validation Before Committing
- [ ] Test on a local HTTP server (not `file://`)
- [ ] Check mobile (480px), tablet (768px), desktop (1200px)
- [ ] Team details panel loads without console errors
- [ ] All images load (DevTools Network tab)
- [ ] Keyboard navigation works (Tab through interactive elements)
- [ ] Colour contrast meets WCAG AA (4.5:1 for body text)
- [ ] Confetti renders on load
- [ ] `prefers-reduced-motion` respected

See `docs/QA_CHECKLIST.md` for the full checklist.

---

## Scope Boundaries — When to Ask a Human

**Change freely:**
- Fix typos, update content, add team member data
- Fix CSS bugs, improve responsive behaviour
- Add images following naming conventions
- Update documentation

**Ask first:**
- Adding new page sections or changing section order
- Modifying the teamdata.json schema (key names, structure)
- Adding third-party dependencies or CDN links
- Design changes (colours, typography, layout philosophy)
- Changes to the GitHub Pages deployment setup

---

## Documentation Index

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Quick start and project overview |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Git workflow and contribution guide |
| [docs/STYLE_GUIDE.md](./docs/STYLE_GUIDE.md) | Visual design system |
| [docs/CONTENT_GUIDE.md](./docs/CONTENT_GUIDE.md) | Writing voice, tone, and standards |
| [docs/STRUCTURE.md](./docs/STRUCTURE.md) | Site architecture and data flow |
| [docs/DECISIONS.md](./docs/DECISIONS.md) | Architecture Decision Records |
| [docs/CHANGELOG.md](./docs/CHANGELOG.md) | Version history |
| [docs/TESTING_GUIDE.md](./docs/TESTING_GUIDE.md) | Local testing procedures |
| [docs/QA_CHECKLIST.md](./docs/QA_CHECKLIST.md) | Pre-commit quality checklist |
| [docs/GOTCHAS.md](./docs/GOTCHAS.md) | Known pitfalls and lessons learned |
| [docs/AGENT_INSTRUCTIONS.md](./docs/AGENT_INSTRUCTIONS.md) | AI agent-specific rules |

---

## Known TODOs / Placeholders
- [ ] 2026 team member profiles and photos
- [ ] Steam store page links (games not yet live)
- [ ] OG image for social sharing (1200x630)
- [ ] Additional favicon sizes (16x16, 180x180 apple-touch-icon)
- [ ] Delete legacy style.css after confirming no dependencies
- [ ] Drink/snack images (directories currently empty)

### Performance Notes
- Confetti system creates 60 DOM elements. Keep this number reasonable on desktop; consider reducing on mobile.
- Images are not optimised — compress before final launch.
- No lazy loading on images yet — add `loading="lazy"` to below-fold images.
- Font (Inter) loaded from Google Fonts CDN.

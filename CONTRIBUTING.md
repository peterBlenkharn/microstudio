# Contributing to Micro Studio

This guide covers how to contribute to the Micro Studio marketing site — whether you're a team member adding your profile, a lecturer updating content, or an AI agent making improvements.

---

## Quick Start

1. Clone the repo
2. Create a branch: `git checkout -b feature/your-change`
3. Make your changes
4. Test locally with an HTTP server (see below)
5. Commit with a clear message
6. Push and open a PR against `main`

### Local Testing

Team detail panels use `fetch()`, which requires an HTTP server:

```bash
# Python (built-in)
python -m http.server 8000

# Node.js
npx serve .
```

Then open `http://localhost:8000` in your browser.

**Do NOT** open `index.html` directly via `file://` — the team details panel will fail silently.

---

## Git Workflow

### Branch Naming
- `feature/description` — new features or content additions
- `fix/description` — bug fixes
- `docs/description` — documentation updates
- `refactor/description` — code restructuring without behaviour change

### Commit Messages
Write clear, concise commit messages:
- **Good:** "Add Jana Frost profile to teamdata.json"
- **Good:** "Fix yellow panel contrast for WCAG AA compliance"
- **Bad:** "Update stuff"
- **Bad:** "Changes"

Format: `[verb] [what changed]` — start with a verb (Add, Fix, Update, Remove, Refactor).

### Pull Requests
- Keep PRs focused — one logical change per PR
- Include a brief description of what changed and why
- Reference any relevant ADR entries (see `docs/DECISIONS.md`)
- Run through the QA checklist before requesting review (see `docs/QA_CHECKLIST.md`)

### Merging
- PRs merge to `main` (which auto-deploys to GitHub Pages)
- Peter Blenkharn approves and merges
- Squash merging is preferred for clean history

---

## Adding Your Profile (Team Members)

### 1. Prepare Your Photo
- Save as `.jpg` format
- Filename: camelCase of your full name (e.g., `janaFrost.jpg`)
- Roughly square, well-lit, clear face
- Compress to under 100KB
- Place in `images/profilepics/`

### 2. Add Your Data to teamdata.json
Find your team section and add your entry:

```json
"Your Name": {
  "Profile Image Name": "yourName",
  "Nationalities": ["GB"],
  "Links": {
    "Github": "https://github.com/yourname",
    "LinkedIn": "https://linkedin.com/in/yourname",
    "Portfolio": "",
    "itchio": ""
  },
  "Blurb": "A short bio in third person. 2-3 sentences about what you do and what drives you.",
  "Favourite Games": {
    "Game 1": { "Game Name": "Game Title", "Steam Link": "https://store.steampowered.com/...", "Image Name": "camelCaseGameName" },
    "Game 2": { "Game Name": "", "Steam Link": "", "Image Name": "" },
    "Game 3": { "Game Name": "", "Steam Link": "", "Image Name": "" }
  },
  "Favourite Drink": { "Drink Name": "Coffee", "Image Name": "" },
  "Favourite Snack": { "Snack Name": "Biscuits", "Image Name": "" }
}
```

### 3. Add Your Favourite Game Cover Art
- Save game cover images as `.jpg` in `images/gamepics/`
- Filename: camelCase of the game name (e.g., `eldenRing.jpg`)
- Keep images under 100KB

### 4. Writing Your Bio
- Write in **third person** ("Alex specialises in..." not "I specialise in...")
- 2–3 sentences: what you do, what drives you, one personal detail
- British English (colour, specialise, programme)
- See `docs/CONTENT_GUIDE.md` for full writing standards

---

## Code Style

### HTML
- Semantic elements where possible (`<section>`, `<nav>`, `<header>`)
- Meaningful `alt` text on all images
- `id` attributes for anchor targets (e.g., `id="teams"`)

### CSS
- Use CSS custom properties from `styles/variables.css` — never hardcode colours
- Class names: `kebab-case` (e.g., `.game-card`, `.btn-primary`)
- BEM-lite for sub-elements: `.component__element` (e.g., `.panel__inner`)
- Add styles to the appropriate modular file (see CSS Architecture in CLAUDE.md)
- Include hover, focus, and active states for interactive elements

### JavaScript
- Vanilla JS only — no frameworks or libraries (except the flag emoji polyfill)
- Use `const` and `let`, never `var`
- Template literals for HTML string building
- Event delegation where practical

### Images
- `.jpg` for photos (canonical format)
- `.svg` for icons
- `.png` for icons that need transparency
- camelCase filenames (e.g., `gabrielePoma.jpg`, `eldenRing.jpg`)

---

## Documentation

When making significant changes, update the relevant documentation:

| What Changed | Update These Docs |
|-------------|-------------------|
| Site sections or layout | `docs/STRUCTURE.md`, `CLAUDE.md` |
| CSS variables or components | `docs/STYLE_GUIDE.md` |
| Content or copy | `docs/CONTENT_GUIDE.md` |
| Major decisions | `docs/DECISIONS.md` (add new ADR entry) |
| Any notable change | `docs/CHANGELOG.md` |
| Discovered a pitfall | `docs/GOTCHAS.md` |

---

## Need Help?

- Check `CLAUDE.md` for project overview and architecture
- Check `docs/GOTCHAS.md` for common pitfalls
- Check `docs/TESTING_GUIDE.md` for how to verify your changes
- Ask Peter Blenkharn if you're unsure about anything

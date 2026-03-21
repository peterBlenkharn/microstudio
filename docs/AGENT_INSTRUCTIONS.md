# AI Agent Instructions — Micro Studio

This document provides specific guidance for AI agents working on the Micro Studio marketing site. Read this alongside `CLAUDE.md` (project-level context) before making changes.

---

## Scope & Boundaries

### DO (Change Freely)
- Add or update team member data in `teamdata.json`
- Fix CSS bugs or improve responsive behaviour
- Add profile photos, game art, or other images (following naming conventions)
- Update documentation files
- Fix typos and content errors
- Improve accessibility (alt text, ARIA attributes, focus states)
- Optimise performance (image compression, lazy loading)

### DON'T (Ask a Human First)
- Add new page sections or change section order in `index.html`
- Modify the `teamdata.json` schema (key names, nesting structure)
- Add third-party dependencies or CDN links
- Change the colour palette, typography, or layout philosophy
- Modify the GitHub Pages deployment configuration
- Change the CSS load order in `<head>`
- Delete files without confirming they're unused

### NEVER
- Push directly to `main` without explicit permission
- Modify `.git/` configuration
- Add files containing credentials, API keys, or secrets
- Remove the `/microstudio/` path prefix from JS asset paths
- Load `style.css` (root) — it is legacy and must not be referenced

---

## Danger Zones (Will Break Things)

### 1. CSS Load Order
The `<link>` tags in `index.html` `<head>` must remain in this exact order:
```
variables.css → base.css → layout.css → teams.css → components.css → hero.css → about.css → modules/teams.css
```
Changing this order breaks CSS specificity and causes visual regressions.

### 2. GitHub Pages Base Path
All asset paths in **JavaScript** must include the `/microstudio/` prefix:
```javascript
// CORRECT
fetch('/microstudio/teamdata.json')
src="/microstudio/icons/github.svg"

// WRONG — will 404 on GitHub Pages
fetch('/teamdata.json')
src="/icons/github.svg"
```

**CSS** and **HTML** use relative paths (no prefix needed):
```css
/* CORRECT */
background: url('textures/noise.png');
```
```html
<!-- CORRECT -->
<img src="images/team-a.jpg">
```

### 3. teamdata.json ↔ team-details.js Coupling
The JavaScript reads these exact key names from the JSON:
- `"Profile Image Name"` → constructs image path
- `"Nationalities"` → generates flag emoji
- `"Links"` → builds social icon links
- `"Blurb"` → member biography
- `"Favourite Games"` → game thumbnails
- `"Favourite Drink"` / `"Favourite Snack"` → optional extras
- `"Title"` → role/position (Management Team only)

Renaming any of these keys in the JSON requires updating `team-details.js` to match.

### 4. Profile Image Naming
JS constructs image paths from the `"Profile Image Name"` field:
```javascript
// In team-details.js, this creates:
`images/profilepics/${m['Profile Image Name']}.jpg`
```
- Filename must be **camelCase** and match exactly
- Extension is hardcoded as `.jpg` for detail views, `.png` for thumbnails
- Both `.jpg` and `.png` versions may exist; `.jpg` is canonical

### 5. Flag Emoji Polyfill
The `country-flag-emoji-polyfill` script in `<head>` must load before `team-details.js` (at bottom of `<body>`). Moving the polyfill or the team script can break flag rendering.

---

## File Coupling Map

```
index.html
  ├── <head> → styles/*.css (load order matters)
  ├── <head> → country-flag-emoji polyfill (must load first)
  ├── <body> → confetti.js (reads #confetti-bg)
  ├── <body> → scroll-reveal.js (reads .about-panels .panel)
  └── <body> → team-details.js
                  ├── fetches teamdata.json (schema-dependent)
                  ├── reads .game-card[data-team] attributes
                  ├── writes to #team-details container
                  └── references image paths in /images/profilepics/
```

---

## Validation Before Committing

Run through this checklist before every commit:

- [ ] Serve locally via HTTP (`python -m http.server 8000`), NOT `file://`
- [ ] Test at 480px, 768px, and 1200px viewport widths
- [ ] Click "Learn More" on each game card — detail panel renders without console errors
- [ ] Verify all images load (open DevTools Network tab, filter by `img`, check for 404s)
- [ ] Tab through all interactive elements — every button/link should be keyboard-reachable
- [ ] Check colour contrast on coloured panels (WCAG AA minimum: 4.5:1)
- [ ] Verify confetti renders on page load
- [ ] Enable `prefers-reduced-motion: reduce` in DevTools and verify animations stop
- [ ] Check that no console errors or warnings appear

See `docs/QA_CHECKLIST.md` for the complete checklist.

---

## Image Requirements

| Type | Directory | Format | Naming | Max Size | Dimensions |
|------|-----------|--------|--------|----------|------------|
| Profile photos | `images/profilepics/` | `.jpg` (canonical) | camelCase (e.g., `gabrielePoma.jpg`) | 100KB | Square-ish, displayed at 60px/160px |
| Game headers | `images/` | `.jpg` | `gameName_header.jpg` | 200KB | Landscape, max-height 140px rendered |
| Game cover art | `images/gamepics/` | `.jpg` | camelCase (e.g., `eldenRing.jpg`) | 100KB | Cover art ratio, small thumbnails |
| Team photos | `images/` | `.jpg` | `team-X.jpg` | 200KB | Landscape, candid group photos |
| About images | `images/` | `.jpg` | descriptive (e.g., `what_is_it.jpg`) | 200KB | Landscape |
| Icons | `icons/` | `.svg` (social), `.png` (Steam, favicon) | lowercase | 10KB | Various |

---

## Rollback Procedure

If a change breaks the live site:

1. Identify the breaking commit: `git log --oneline -10`
2. Revert it: `git revert <commit-hash>`
3. Push the revert: `git push`
4. The site will auto-deploy from `main` within minutes
5. Investigate the issue on a branch before re-applying

---

## Common Tasks

### Adding a team member
1. Add their entry to `teamdata.json` under the correct team key
2. Add `images/profilepics/camelCaseName.jpg` (square-ish, <100KB)
3. Add favourite game images to `images/gamepics/camelCaseGameName.jpg`
4. Test the detail panel locally

### Updating content
1. Edit the relevant section in `index.html`
2. If changing team data, edit `teamdata.json`
3. Verify the change renders correctly at all breakpoints

### Adding a CSS component
1. Add styles to the appropriate file in `styles/` (check the architecture section)
2. Use CSS custom properties from `variables.css` — never hardcode colours or spacing
3. Follow BEM-lite naming (`.component`, `.component__element`, `.component--modifier`)
4. Add hover, focus, and active states for interactive elements

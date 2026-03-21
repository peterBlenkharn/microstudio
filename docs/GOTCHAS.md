# Gotchas & Lessons Learned — Micro Studio

A running log of pitfalls, hard-learned lessons, and non-obvious behaviours. If you hit something surprising, add it here so future contributors (human or AI) don't repeat the mistake.

---

## GitHub Pages

### Asset paths differ between JS and HTML/CSS
- **JavaScript:** Must use the `/microstudio/` prefix for all asset paths (because `fetch()` and `src` attributes resolve from the domain root on GitHub Pages)
- **CSS:** Uses relative paths (no prefix needed — CSS resolves relative to the stylesheet location)
- **HTML:** Uses relative paths (no prefix needed — resolves relative to `index.html`)

```javascript
// JS — MUST include prefix
fetch('/microstudio/teamdata.json')
icon.src = '/microstudio/icons/github.svg';

// CSS — relative is fine
background: url('textures/noise.png');

// HTML — relative is fine
<img src="images/team-a.jpg">
```

**Why:** GitHub Pages serves the site at `https://username.github.io/microstudio/`, not at the root. JS `fetch()` resolves from the domain root, so `/teamdata.json` would look at `https://username.github.io/teamdata.json` (wrong).

### Changes to `main` deploy immediately
There is no staging environment. Pushing to `main` makes changes live within minutes. Always test locally first.

---

## CSS

### Load order in `<head>` is critical
The CSS files must be loaded in a specific order because later files override earlier ones for specificity. Changing the order will cause visual regressions. The correct order is documented in CLAUDE.md.

### `style.css` (root) is legacy — do NOT load it
The root `style.css` is an old monolith that was replaced by the modular `styles/` directory. It contains duplicate and outdated rules. It is NOT loaded in `index.html`. Loading it would cause specificity conflicts. It is scheduled for deletion.

### Hardcoded colours exist (known debt)
Several CSS files contain hardcoded hex colours instead of CSS variables:
- `#444` and `#555` for muted text (should use `var(--text-muted)`)
- `#999` for placeholder text (should use `var(--text-subtle)`)
- `#f0ede5` for blurb backgrounds
- `#171a21` for Steam button (external brand colour — acceptable)

These are being migrated to CSS custom properties.

### Yellow panel text contrast is marginal
Dark text on the yellow panel's lighter gradient end (`#fff5b8`) barely meets WCAG AA (≈4:1). This is a known accessibility issue flagged for fixing. When working with yellow backgrounds, always verify contrast.

---

## JavaScript

### `teamdata.json` requires HTTP server
The `fetch()` call in `team-details.js` does not work when opening `index.html` via `file://`. You must use a local HTTP server (`python -m http.server 8000` or `npx serve .`).

### Flag emoji polyfill must load first
The `country-flag-emoji-polyfill` script in `<head>` must execute before `team-details.js` (at the bottom of `<body>`). If the polyfill is moved after the team script, or removed, flag emoji will not render on Windows/some Android devices.

### Profile image extension mismatch
`team-details.js` uses `.png` for thumbnail images but `.jpg` for detail view images:
```javascript
// Thumbnails use .png
`images/profilepics/${m['Profile Image Name']}.png`

// Detail view uses .jpg
`images/profilepics/${m['Profile Image Name']}.jpg`
```
Both file versions should exist for each team member. `.jpg` is the canonical format; `.png` is legacy. This inconsistency should be resolved in a future update.

### innerHTML is used for rendering
`team-details.js` builds member detail cards using `innerHTML`. If `teamdata.json` ever contains user-supplied HTML, this could be an XSS vector. Currently safe because the JSON is controlled, but sanitise any future user input.

---

## Data (teamdata.json)

### Key names have inconsistent casing
Some JSON keys use different naming conventions:
- `"Profile Image Name"` (Title Case with spaces)
- `"Nationalities"` (Title Case)
- `"Github"` (not "GitHub")
- `"itchio"` (lowercase, no dot)

These must match exactly in `team-details.js`. Do not "fix" the casing without updating the JS.

### Link field names vary
Different team members use slightly different key names for links:
- `"Personal Website"` vs `"Website"`
- Some have trailing slashes, some don't

The JS handles this by iterating over all `Links` keys, but the icon mapping only recognises: `Github`, `LinkedIn`, `itchio`. Others get a generic link icon.

### Empty profiles exist
Three Parapet team members (Roberto Scialpi, Serhii Koslov, Harry Hall) have completely empty profiles — no blurb, no games, no links. The detail panel renders but shows blank content. This is a known content gap.

---

## Images

### camelCase naming is required
Image filenames must be camelCase to match the `"Profile Image Name"` and `"Image Name"` fields in `teamdata.json`. Examples:
- ✅ `gabrielePoma.jpg`
- ✅ `assassinsCreedOdyssey.jpg`
- ❌ `Gabriele_Poma.jpg`
- ❌ `assassins-creed-odyssey.jpg`

### Drink and snack image directories are empty
`images/drinkpics/` and `images/snackpics/` exist but contain only `.gitkeep` files. The JS renders drink/snack names as text but the image thumbnails will 404.

---

## Adding This Section

When you discover a new gotcha, add it under the appropriate category heading. Include:
1. **What happened** — the symptom or error
2. **Why it happened** — the root cause
3. **How to avoid it** — the fix or workaround

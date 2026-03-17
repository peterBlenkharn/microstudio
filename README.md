# Micro Studio — University of Greenwich

> A micro studio for **BIG** ideas.

Micro Studio is an extracurricular programme at the University of Greenwich where selected BSc Games Development students form small teams and ship complete games to Steam in just 12 weeks.

This repository is the **promotional one-pager** — a marketing landing page for the programme.

---

## Live Site

**[peterBlenkharn.github.io/microstudio](https://peterBlenkharn.github.io/microstudio/)**

---

## What's on the Site

| Section | Description |
|---------|-------------|
| **Hero** | Headline, tagline, and primary CTAs (Study Games, Stay Updated, Support Us) |
| **About Panels** | Three full-width angled strips: What It Is, What It's For, Who It's For |
| **Meet the Teams** | Game cards for each team project with header art, tagline, and team photo |
| **Team Details** | Expandable member profiles with bios, social links, and favourite games |
| **Staff** | The people behind the programme — lecturers, technicians, and supporters |
| **Get Involved** | CTAs for prospective students, followers, and industry/academic partners |
| **Newsletter** | Email signup placeholder |
| **Contact** | Support/partnership enquiry placeholder |
| **Footer** | Copyright and university branding |

---

## Tech Stack

- Pure **HTML**, **CSS**, **JavaScript** — no frameworks, no build tools
- Hosted on **GitHub Pages** (deploys automatically from `main`)
- Team data driven by **teamdata.json**
- Background confetti animation with mouse parallax
- Scroll-triggered reveal animations via IntersectionObserver

---

## Local Development

1. Clone the repo
2. Open `index.html` in a browser, or use a local server:
   ```bash
   # Python
   python -m http.server 8000

   # Node (if you have npx)
   npx serve .
   ```
3. Edit files directly — no build step required

> **Note:** Team detail panels fetch `teamdata.json` via `fetch()`, which requires serving over HTTP (not `file://`). Use a local server.

---

## Project Structure

See **[CLAUDE.md](./CLAUDE.md)** for full architecture documentation, or browse the docs:

- **[docs/STYLE_GUIDE.md](./docs/STYLE_GUIDE.md)** — Colour palette, typography, spacing, component styles
- **[docs/CONTENT_GUIDE.md](./docs/CONTENT_GUIDE.md)** — Writing voice, tone, and content standards
- **[docs/STRUCTURE.md](./docs/STRUCTURE.md)** — Site sections, data model, and page flow

---

## Content TODOs

The following items need real content before the site goes fully live:

- [ ] **Steam store pages** — Wishlist buttons currently show "Coming Soon"
- [ ] **Newsletter backend** — Connect the signup form to Mailchimp, Buttondown, or similar
- [ ] **Contact form** — Add a real email address or Google Form link
- [ ] **Parapet team profiles** — Roberto, Serhii, and Harry need bios and favourite data
- [ ] **Peter's blurb** — Management team bio is empty
- [ ] **Drink & snack images** — `images/drinkpics/` and `images/snackpics/` are empty
- [ ] **OG share image** — Create a 1200x630 image for social media previews
- [ ] **Additional favicon sizes** — 16x16, 180x180 (apple-touch-icon)

---

## Contributing

This is maintained by Peter Blenkharn and the Micro Studio team. If you're a team member:

1. Create a branch for your changes
2. Test locally with a server
3. Open a PR against `main`

---

## Licence

Content and branding are property of the University of Greenwich Micro Studio programme. Game assets belong to their respective teams.

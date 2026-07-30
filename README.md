# Micro Studio — University of Greenwich

> A micro studio for **BIG** ideas.

Micro Studio is an extracurricular programme at the University of Greenwich where selected BSc Games Development students form small teams and ship complete games to Steam in just 12 weeks. **2026 is our third year.**

This repository is the **promotional one-pager** — a marketing landing page for the programme and its current project.

---

## Live Site

**[peterBlenkharn.github.io/microstudio](https://peterBlenkharn.github.io/microstudio/)**

---

## Current Project — Whoever Left the Light On

A first-person surrealist exploration game set inside a single transforming room — the inside of someone's mind, infected by digital noise. Built by three student subteams (Game Design, Programming, Creative Production) with support from management and creative professionals.

**Engine:** Unity 6 (URP) | **Platform:** Windows PC (Steam) | **Playtime:** 60–90 minutes

---

## What's on the Site

| Section | Description |
|---------|-------------|
| **Hero** | Headline, tagline, and primary CTAs |
| **About Panels** | Three full-width angled strips: What It Is, What It's For, Who It's For |
| **The Project** | Whoever Left the Light On spotlight with artwork, pillars, description, and Steam CTA |
| **Meet the Team** | Subteam-filtered member profiles with bios, social links, and favourites |
| **Our History** | Archive of past cohorts (Lost Museum, Ghrystlyst, Parapet) |
| **Get Involved** | CTAs for students and industry partners |
| **For Partners** | Sponsorship and partnership information |
| **FAQ** | Common questions for students, employers, and academics |
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
2. Serve locally (required for `fetch()` to work):
   ```bash
   # Python
   python -m http.server 8000

   # Node (if you have npx)
   npx serve .
   ```
3. Open `http://localhost:8000`
4. Edit files directly — no build step required

> **Note:** Team detail panels fetch `teamdata.json` via `fetch()`, which requires serving over HTTP (not `file://`).

---

## Documentation

| Document | Purpose |
|----------|---------|
| [CLAUDE.md](./CLAUDE.md) | Full architecture, conventions, and AI agent instructions |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute (git workflow, adding profiles, code style) |
| [docs/STYLE_GUIDE.md](./docs/STYLE_GUIDE.md) | Colour palette, typography, spacing, component styles |
| [docs/CONTENT_GUIDE.md](./docs/CONTENT_GUIDE.md) | Writing voice, tone, and content standards |
| [docs/STRUCTURE.md](./docs/STRUCTURE.md) | Site sections, data model, and page flow |
| [docs/DECISIONS.md](./docs/DECISIONS.md) | Architecture Decision Records (why things are the way they are) |
| [docs/CHANGELOG.md](./docs/CHANGELOG.md) | Version history |
| [docs/TESTING_GUIDE.md](./docs/TESTING_GUIDE.md) | How to test changes locally |
| [docs/QA_CHECKLIST.md](./docs/QA_CHECKLIST.md) | Pre-commit quality checklist |
| [docs/GOTCHAS.md](./docs/GOTCHAS.md) | Known pitfalls and lessons learned |
| [docs/AGENT_INSTRUCTIONS.md](./docs/AGENT_INSTRUCTIONS.md) | AI agent-specific rules and danger zones |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide. Quick version:

1. Create a branch for your changes
2. Test locally with an HTTP server
3. Run through the [QA checklist](./docs/QA_CHECKLIST.md)
4. Open a PR against `main`

---

## Licence

Content and branding are property of the University of Greenwich Micro Studio programme. Game assets belong to their respective teams.

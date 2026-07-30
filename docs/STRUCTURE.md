# Site Structure & Architecture — Micro Studio

## Page Flow (Planned — Cohort 3 Restructure)

The site is transitioning from a three-game model to a single-project spotlight. This is the planned section order:

```
┌─────────────────────────────────────┐
│  NAV (anchors: The Game, Team,      │
│       History, Get Involved)        │
├─────────────────────────────────────┤
│  HERO                               │
│  "A micro studio for BIG ideas."    │
│  Cohort 3 • 2026                    │
│  Subtitle + 3 CTA buttons           │
├─────────────────────────────────────┤
│  ABOUT PANELS (3 diagonal strips)   │
│  ┌───────────────────────────┐      │
│  │ Panel 1 (Pink): What It Is│      │
│  └───────────────────────────┘      │
│  ┌───────────────────────────┐      │
│  │ Panel 2 (Yellow): What    │      │
│  │ It's For                  │      │
│  └───────────────────────────┘      │
│  ┌───────────────────────────┐      │
│  │ Panel 3 (Cyan): Who It's  │      │
│  │ For                       │      │
│  └───────────────────────────┘      │
├─────────────────────────────────────┤
│  THE PROJECT — WHOEVER LEFT THE     │
│  LIGHT ON                           │
│  Single large spotlight:            │
│  - Header art / concept imagery     │
│  - Title + tagline + description    │
│  - Core pillars (4 feature blocks)  │
│  - Technical badges (Unity/Steam)   │
│  - Screenshots / concept gallery    │
│  - Steam Wishlist CTA               │
├─────────────────────────────────────┤
│  MEET THE TEAM                      │
│  Subteam tabs:                      │
│  [Game Design] [Programming]        │
│  [Creative Production]              │
│  [Management & Creatives]           │
│                                     │
│  Member cards with role badges      │
│  ┌─ TEAM DETAILS (expandable) ────┐ │
│  │ Thumb sidebar │ Member detail  │ │
│  │               │ - Photo        │ │
│  │               │ - Name + flags │ │
│  │               │ - Role badge   │ │
│  │               │ - Social links │ │
│  │               │ - Blurb        │ │
│  │               │ - Fav games    │ │
│  └────────────────────────────────┘ │
├─────────────────────────────────────┤
│  OUR HISTORY                        │
│  Timeline / year-based layout:      │
│  Cohort 2 (2025): Lost Museum,      │
│    Ghrystlyst, Parapet              │
│  Cohort 1 (2024): [TBD]            │
├─────────────────────────────────────┤
│  GET INVOLVED (2 CTA cards)         │
│  [Apply] [Contact]                  │
├─────────────────────────────────────┤
│  FOR PARTNERS                       │
│  Sponsorship / partnership info     │
│  Value proposition + contact CTA    │
├─────────────────────────────────────┤
│  FAQ                                │
│  Accordion Q&A for students,        │
│  employers, academics               │
├─────────────────────────────────────┤
│  FOOTER                             │
│  © + university branding            │
└─────────────────────────────────────┘
```

---

## Current Structure (Cohort 2 — Being Replaced)

```
NAV → HERO → ABOUT PANELS → MEET THE TEAMS (3 game cards) →
TEAM DETAILS → STAFF → GET INVOLVED → CONTACT → FOOTER
```

This structure will be preserved for reference in the archive section.

---

## Section Details (Planned)

### Navigation
- Sticky after scrolling past hero (new)
- Links: anchor-scroll to `#project`, `#team`, `#history`, `#involved`
- Active section highlighting as user scrolls (new)
- Mobile: hamburger menu for smaller screens (new — currently links wrap)

### Hero (`<header class="hero">`)
- Confetti background layer behind (`#confetti-bg`, `z-index: -1`)
- Title: "A micro studio for BIG ideas." (micro=cyan, BIG=yellow)
- Cohort indicator: "Year Three • 2026" (new)
- Three CTA buttons: Study Games, Stay Updated, Support Us

### About Panels (`<section id="about" class="about-panels">`)
- Unchanged from current design (three diagonal strips)
- Content updated for single-project model

### Project Spotlight (`<section id="project">`) — NEW
- Replaces the three game cards
- Single large section for Whoever Left the Light On
- Header image / concept art
- Title, tagline, genre, description
- Core pillars as 4 feature cards
- Technical badges: Unity 6 | Steam | Windows PC | 60–90 min
- Screenshot gallery (when available)
- Steam Wishlist CTA

### Team Section (`<section id="team">`) — RESTRUCTURED
- Subteam tab filter: Game Design | Programming | Creative Production | Management & Creatives
- Member cards with: photo, name, role badge, nationality flags
- Click to expand detail panel (same as current but role-aware)
- Team leads marked visually
- Management & Creatives: Peter, Andrei, Jana, Sam, Amy

### Our History (`<section id="history">`) — NEW
- Timeline or year-based cards
- Cohort 2 (2025): three smaller game cards with archived data
- Cohort 1 (2024): placeholder
- "This is our third year" credibility messaging

### For Partners (`<section id="partners">`) — NEW
- Value proposition for sponsors
- What partners get (visibility, hiring pipeline, brand association)
- Contact CTA

### FAQ (`<section id="faq">`) — NEW
- Accordion-style toggle Q&A
- Grouped by audience: Students | Employers | Academics

### Footer — unchanged

---

## Data Flow (Planned)

```
teamdata.json (restructured for cohorts)
     │
     ▼
team-details.js (updated for new schema)
     │
     ├──▶ Project spotlight (reads cohort.project data)
     │
     ├──▶ Subteam tabs → filter members by subteam
     │         │
     │         └──▶ Member cards with role badges
     │                    │
     │                    └──▶ Detail panel (photo, links, blurb, games)
     │
     └──▶ Archive section (reads past cohort data)
```

---

## Asset Dependencies

| Asset | Location | Used By |
|-------|----------|---------|
| Inter font | Google Fonts CDN | All text |
| country-flag-emoji polyfill | jsDelivr CDN | Flag emoji in member names |
| noise.png | `textures/` | Panel gradient overlays |
| Social SVGs | `icons/` | Member detail cards |
| Steam icon | `icons/steamicon.png` | Game cards, favourite games |
| Profile photos | `images/profilepics/` | Team details panel |
| Game art | `images/gamepics/` | Favourite games row |
| Header banners | `images/*_header.jpg` | Game card / project spotlight |
| Team photos | `images/team-*.jpg` | Game card bodies / archive |
| About images | `images/what_*.jpg`, `who_*.jpg` | About panels |

---

## GitHub Pages Configuration

- **Source**: deploys from `main` branch, root (`/`)
- **Base path**: `/microstudio/` (repo name becomes path prefix)
- **CNAME**: none (using default github.io domain)
- **All internal asset paths** in JS must include `/microstudio/` prefix
- **CSS paths** are relative (no prefix needed)
- **HTML asset paths** are relative (no prefix needed)

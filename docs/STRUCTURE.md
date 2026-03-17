# Site Structure & Architecture — Micro Studio

## Page Flow

The site is a single-page scroller with this section order:

```
┌─────────────────────────────────────┐
│  NAV (anchors: Our Games, Get       │
│       Involved)                     │
├─────────────────────────────────────┤
│  HERO                               │
│  "A micro studio for BIG ideas."    │
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
│  MEET THE TEAMS                     │
│  3 game cards in a grid:            │
│  [Lost Museum] [Ghrystlyst] [Parapet│
│  Each has: header art, title,       │
│  tagline, team photo, Learn More +  │
│  Wishlist buttons                   │
│                                     │
│  ┌─ TEAM DETAILS (expandable) ────┐ │
│  │ Thumb sidebar │ Member detail  │ │
│  │               │ - Photo        │ │
│  │               │ - Name + flags │ │
│  │               │ - Social links │ │
│  │               │ - Blurb        │ │
│  │               │ - Fav games    │ │
│  │               │ - Fav drink    │ │
│  │               │ - Fav snack    │ │
│  └────────────────────────────────┘ │
├─────────────────────────────────────┤
│  STAFF SECTION                      │
│  "The People Behind It"             │
│  Cards for management/support staff │
├─────────────────────────────────────┤
│  GET INVOLVED (3 CTA cards)         │
│  [Apply] [Newsletter] [Contact]     │
├─────────────────────────────────────┤
│  NEWSLETTER SIGNUP                  │
│  Email capture form (placeholder)   │
├─────────────────────────────────────┤
│  CONTACT / SUPPORT                  │
│  Partnership enquiry (placeholder)  │
├─────────────────────────────────────┤
│  FOOTER                             │
│  © + university branding            │
└─────────────────────────────────────┘
```

---

## Section Details

### Navigation
- Sticky/fixed: No (could be added)
- Links: anchor-scroll to `#teams`, `#involved`
- Mobile: currently no hamburger menu — links wrap naturally
- Future: consider adding `#about` anchor and programme logo

### Hero (`<header class="hero">`)
- Full viewport-ish height (padding-based, not vh)
- Confetti background layer behind (`#confetti-bg`, `z-index: -1`)
- Title uses mixed-size typography for "micro" (small, cyan) and "BIG" (large, yellow)
- Three CTA buttons: primary (Study Games), secondary (Stay Updated), tertiary (Support Us)

### About Panels (`<section id="about" class="about-panels">`)
- Three `.panel` divs with diagonal clip-paths
- Each contains `.panel__inner` > `.panel__content` (2-col grid: text + image)
- Scroll-reveal animation via IntersectionObserver
- Noise texture overlay (`textures/noise.png`) at 28% opacity
- Gradient backgrounds using CSS custom properties

### Teams Section (`<section id="teams" class="section teams">`)
- Grid of `.game-card` components
- Each card: game art banner → card body (title, tagline, team photo) → CTA buttons
- "Learn More" toggles the `#team-details` container
- Team details: sidebar of member thumbnails + detail card panel
- Detail card: photo, name with flag emoji, social links, blurb, favourite games row

### Staff Section (`<section id="staff">`)
- Displays management/support team from `teamdata.json` → "Management Team"
- Simpler card layout (no game-specific content)
- Each card: photo, name, title/role, blurb, social links

### Get Involved (`<section id="involved" class="section ctas">`)
- Three cards targeting different audiences
- Each card: icon, heading, description, CTA button
- Cards use flexbox column with button pushed to bottom

### Newsletter (`<section id="newsletter">`)
- Placeholder email input + submit button
- TODO: connect to real backend (Mailchimp, Buttondown, etc.)

### Contact/Support (`<section id="support">`)
- Placeholder for partnership/support enquiries
- TODO: add real form or email address

### Footer (`<footer class="footer">`)
- Minimal: copyright line + university branding
- Dark background (`#07090f`)

---

## Data Flow

```
teamdata.json
     │
     ▼
team-details.js (fetch on DOMContentLoaded)
     │
     ├──▶ "Learn More" click → buildPanel(teamKey, members)
     │         │
     │         ├──▶ Renders thumbnail sidebar (.member-thumbs-vertical)
     │         └──▶ Auto-selects first member → selectMember(name)
     │                    │
     │                    ├──▶ Highlights active thumbnail
     │                    ├──▶ Renders detail card (photo, links, blurb, games)
     │                    └──▶ Positions arrow indicator
     │
     └──▶ Staff section built from "Management Team" key
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
| Header banners | `images/*_header.jpg` | Game card headers |
| Team photos | `images/team-*.jpg` | Game card bodies |
| About images | `images/what_*.jpg`, `who_*.jpg` | About panels |

---

## GitHub Pages Configuration

- **Source**: deploys from `main` branch, root (`/`)
- **Base path**: `/microstudio/` (repo name becomes path prefix)
- **CNAME**: none (using default github.io domain)
- **All internal asset paths** in JS must include `/microstudio/` prefix
- **CSS paths** are relative (no prefix needed)
- **HTML asset paths** are relative (no prefix needed)

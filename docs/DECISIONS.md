# Architecture Decision Records — Micro Studio

This document tracks significant architectural and design decisions for the Micro Studio marketing site. Each entry explains **what** was decided, **why**, and **what it means** going forward.

Format: ADR-NNN entries in reverse chronological order (newest first).

---

### ADR-008: Site Aesthetic Alignment with Dream Box's Digital Dadaism
- **Date:** 2026-03-21
- **Status:** Accepted
- **Context:** Dream Box uses a "Digital Dadaism" art direction — surrealist B&W collage with glitch/static motifs. The marketing site should feel thematically connected to the game without being a carbon copy.
- **Decision:** The site's existing design elements (noise textures, dark backgrounds, vibrant accent colours on dark) already complement the game's aesthetic. Future design updates should lean into this — the noise overlay, the high-contrast colour pops, and the surrealist energy. The site should feel like it belongs to the same creative universe as the game.
- **Consequences:** Design changes should maintain the dark/vibrant contrast. B&W imagery with selective colour is encouraged. Glitch or static visual effects could be added to reinforce the connection. Avoid bright, clean, corporate aesthetics.

---

### ADR-007: Dream Box as Cohort 3 Project
- **Date:** 2026-03-21
- **Status:** Accepted
- **Context:** Cohort 3 (2026) needed a game project. The brief was developed by Peter Blenkharn based on the programme's constraints (12 weeks, student team, Steam target).
- **Decision:** "Dream Box" (working title) — a first-person surrealist exploration game set in a single transforming room. Built in Unity 6 (URP) for Windows PC (Steam). 60–90 minute playtime. Core pillars: Surreal over Real, Aggressive Scope Control, Diegetic Immersion, Strangeness and Simplicity.
- **Consequences:** The marketing site must present a single game prominently (not three). The game's surrealist aesthetic influences site design direction. Game assets (screenshots, concept art, header images) will need to be created and added as development progresses.

---

### ADR-006: Archive Section for Past Cohorts
- **Date:** 2026-03-21
- **Status:** Accepted
- **Context:** Cohort 2 (2025) produced three games: The Lost Museum, Ghrystlyst, and Parapet. With the site restructuring for Cohort 3's single-project model, a decision was needed on whether to keep, archive, or remove the previous games.
- **Decision:** Keep past cohort games in a dedicated "Our History" archive section. This provides credibility (the programme has a track record), honours past students' work, and demonstrates growth across cohorts.
- **Consequences:** The data model must support multiple cohorts. Past game cards will use a smaller/simpler layout than the current project spotlight. Team member data from past cohorts is preserved but not prominently featured.

---

### ADR-005: Three Subteams — Game Design, Programming, Creative Production
- **Date:** 2026-03-21
- **Status:** Accepted
- **Context:** Cohort 3 uses a single-project model with all students working on one game. The team needed to be organised into manageable groups with clear ownership areas.
- **Decision:** Three subteams, each with a student team leader:
  - **Game Design** — mechanics, level design, puzzles, player experience
  - **Programming** — systems, interaction, state management, technical implementation
  - **Creative Production** — art, audio, VFX, asset creation and pipeline
- **Consequences:** The site's team section needs subteam filtering/tabs. The data model needs a `subteam` field. Team leads need visual distinction. This also maps to the Dream Box GDD's three-month development pipeline (each subteam has month-by-month deliverables).

---

### ADR-004: Single-Project Model for Cohort 3
- **Date:** 2026-03-21
- **Status:** Accepted
- **Context:** Cohorts 1 and 2 ran three independent game projects in parallel. For Cohort 3, the programme director decided to consolidate into a single project with three subteams. This allows deeper collaboration, higher production values, and a more focused marketing effort.
- **Decision:** The site will transition from showcasing three games to spotlighting one game with three subteams working on it. The index.html structure changes from a three-card grid to a single large project section.
- **Consequences:** The `teamdata.json` schema needs restructuring (cohort-based with subteams instead of independent team keys). The team-details.js rendering logic needs subteam tabs/filters. Game cards section becomes a project spotlight. Management and creative staff (Art Director, Music Director, Voice Artist) are new role types that need representation.

---

### ADR-003: JSON Data Model for Team Members
- **Date:** 2025-05-14 (estimated)
- **Status:** Accepted (will be superseded by Cohort 3 schema update)
- **Context:** Team member information (bios, photos, links, favourites) needed to be stored in a structured format that could be dynamically rendered without a backend.
- **Decision:** Use a flat JSON file (`teamdata.json`) keyed by team name, with nested member objects containing profile data, social links, and favourite games/drinks/snacks.
- **Consequences:** All team data is client-side (no API needed). The file is fetched via `fetch()` requiring an HTTP server (not `file://`). Schema changes require updating both the JSON and the JavaScript rendering logic. The flat structure doesn't support cross-cohort or role-based queries well — to be addressed in the Cohort 3 restructuring.

---

### ADR-002: Modular CSS Architecture
- **Date:** 2025-05-16 (estimated)
- **Status:** Accepted
- **Context:** The original site used a single `style.css` monolith (~300 lines) that was becoming difficult to maintain. Specificity conflicts and unclear organisation made updates error-prone.
- **Decision:** Split CSS into modular files under `styles/`:
  - `variables.css` — custom properties
  - `base.css` — reset and typography
  - `layout.css` — page-level layout
  - `components.css` — reusable components
  - `teams.css` — team detail panel styles
  - `modules/hero.css`, `modules/about.css`, `modules/teams.css` — section-specific styles
- **Consequences:** CSS must be loaded in a specific order (specificity-dependent). The old `style.css` remains in the repo but is NOT loaded — it's kept for reference only and is scheduled for deletion. All new styles must go in the appropriate modular file.

---

### ADR-001: Pure HTML/CSS/JS — No Build Tools
- **Date:** 2025-05-14 (estimated)
- **Status:** Accepted
- **Context:** The site is a single marketing page maintained by a small team (primarily one lecturer and contributing students). A build toolchain (Webpack, Vite, etc.) would add complexity without proportional benefit for a single-page static site.
- **Decision:** Use vanilla HTML, CSS, and JavaScript with no build step. Deploy directly to GitHub Pages from the `main` branch. All assets served statically from the repository.
- **Consequences:** No minification, bundling, or tree-shaking. No CSS preprocessor (Sass/Less) — use CSS custom properties instead. No TypeScript — use plain JS. No package.json or node_modules. Changes are live immediately on push to `main`. This keeps the barrier to contribution very low for students.

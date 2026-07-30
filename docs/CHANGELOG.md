# Changelog — Micro Studio Marketing Site

All notable changes to the Micro Studio marketing site are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- Comprehensive documentation infrastructure: AGENT_INSTRUCTIONS.md, DECISIONS.md, CHANGELOG.md, CONTRIBUTING.md, TESTING_GUIDE.md, QA_CHECKLIST.md, GOTCHAS.md
- Architecture Decision Records (ADR-001 through ADR-008) documenting all major design decisions
- Danger zones and file coupling documentation in CLAUDE.md
- Scope boundaries (what agents can change freely vs what needs human approval)
- Validation checklist for pre-commit quality assurance

### Changed
- CLAUDE.md overhauled for Cohort 3 (2026) — single-project model, current game, and new team structure
- Updated project overview to reflect third cohort with subteams (Game Design, Programming, Creative Production)
- Added current-game details and core pillars
- Updated the creative staff roster with Amy-May Trudgeon, Amy Dickinson, and Tim Meredith as voice artists
- Added profile links and biographies for the creative staff where supplied
- Removed the mailing-list call to action and updated contact links to Peter Blenkharn's University email address
- Simplified the browser and social-sharing page title to "Micro Studio"
- Made the confetti background redistribute and adjust its density when the viewport is resized
- Reduced confetti density and disabled parallax work on mobile and coarse-pointer devices for smoother scrolling
- Added locally hosted Steam artwork for current-cohort favourite games and corrected legacy image filename mismatches
- Renamed the current project to Whoever Left the Light On and added its Steam header and hero artwork
- Labelled favourite games, drinks, and snacks in team details and added small drink and snack icons
- Added the Team Leader chip to leader profiles in the expanded team details panel
- Updated Peter Blenkharn's title and staff biography
- Updated documentation index with links to all new docs

---

## [1.0.0] — 2025-06-03

### Added
- Initial site launch with three game projects (Cohort 2)
- Game cards: The Lost Museum, Ghrystlyst, Parapet
- Team member profiles with social links, bios, and favourite games
- Confetti background animation with parallax
- Scroll-reveal animation for about panels
- Dynamic team detail panel (team-details.js)
- Modular CSS architecture (styles/ directory)
- Documentation: STYLE_GUIDE.md, CONTENT_GUIDE.md, STRUCTURE.md, README.md, CLAUDE.md

### Teams
- **Lost Museum Team:** Gabriele, Daniela, Patryk, Molly, Naomi
- **Ghrystlyst Team:** Andreea, Justin, Elie, Ivan, Josh
- **Parapet Team:** Roberto, Serhii, Harry, Antonio, Ishan
- **Management:** Peter Blenkharn, Andrei Copaceanu

# QA Checklist — Micro Studio

Run through this checklist before every commit. Items marked with ★ are critical — do not skip them.

---

## Pre-Commit Checklist

### Build & Serve
- [ ] ★ Tested on local HTTP server (not `file://`)
- [ ] No build errors (N/A — no build step, but check for syntax errors)

### Visual
- [ ] ★ Renders correctly at 480px (mobile)
- [ ] ★ Renders correctly at 768px (tablet)
- [ ] ★ Renders correctly at 1200px (desktop)
- [ ] No text overflow, truncation, or overlapping elements
- [ ] Images display at correct aspect ratios
- [ ] Colours match the design system (no hardcoded hex values)

### Functionality
- [ ] ★ Team details panel loads without console errors
- [ ] ★ All images load (no 404s in Network tab)
- [ ] Confetti renders on page load
- [ ] Scroll reveal animates about panels
- [ ] External links open correctly (in new tabs where appropriate)
- [ ] All CTA buttons are clickable and styled

### Accessibility
- [ ] ★ Keyboard navigation reaches all interactive elements
- [ ] ★ Colour contrast meets WCAG AA (4.5:1 for body text)
- [ ] Focus indicators visible on all interactive elements
- [ ] `prefers-reduced-motion` respected
- [ ] Images have meaningful alt text
- [ ] No new ARIA errors introduced

### Code Quality
- [ ] CSS uses variables from `variables.css` (no hardcoded colours/spacing)
- [ ] JavaScript has no `var` declarations (use `const`/`let`)
- [ ] No inline styles added to HTML (use CSS classes)
- [ ] No console.log statements left in production code (except existing confetti debug)
- [ ] File naming follows conventions (camelCase images, kebab-case classes)

### Documentation
- [ ] `docs/CHANGELOG.md` updated if this is a notable change
- [ ] `docs/DECISIONS.md` updated if an architectural decision was made
- [ ] `CLAUDE.md` updated if file structure or conventions changed
- [ ] `docs/GOTCHAS.md` updated if a new pitfall was discovered

---

## Pre-Deploy Checklist (Before Merging to Main)

- [ ] All pre-commit checks pass
- [ ] PR has been reviewed
- [ ] Changes tested on at least two browsers (Chrome + one other)
- [ ] No sensitive data committed (credentials, API keys, personal emails)
- [ ] Git history is clean (no WIP commits in the PR)

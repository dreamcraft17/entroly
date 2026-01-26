# UI/UX Designer Assessment — LinkHub (Design System Focus)

## Context
We’re building **LinkHub**: a “link in bio” aggregator (Linktree-style) with two primary user experiences:
1. **Public Profile (mobile-first):** avatar + bio + vertical list of link cards.
2. **Landing/Directory:** a searchable list of public profiles.

This assessment evaluates your ability to create a **cohesive, scalable design system** and apply it to product screens with strong UX reasoning.

---

## Primary Goal
Design and document a **LinkHub Design System** that can be implemented consistently by engineering.

Your work should cover:
- Design tokens (color, type, spacing, radius, shadow, motion)
- Core components with variants and states
- Patterns (layout, navigation, empty states, errors)
- Accessibility and usability guidelines
- A small set of high-fidelity screens built using the system

---

## Design Direction (Vibe)
Use this as the starting point (you can refine, but keep the spirit):
- **Visual style:** “Glassmorphism Lite” (soft gradients, translucent cards, subtle blur, rounded corners)
- **Mobile-first always** (thumb-friendly controls; min target height ~48px)
- **Dark mode-first** is preferred (optional light mode is a bonus)

Helpful reference already in repo:
- `DESIGN_SYSTEM.md` (existing palette/tokens notes)

---

## Task A — Build the Design System (Main Task)
Create a design system that can scale beyond a single screen.

### A1. Foundations (Tokens)
Define and document tokens for:
- **Color:** background layers, text, borders, brand/accents, semantic (success/warning/error/info)
- **Typography:** type scale, font families, weights, line heights, responsive rules
- **Spacing:** spacing scale + layout grid rules (mobile / tablet / desktop)
- **Radius & elevation:** radius scale, shadow scale, glass blur rules
- **Motion:** transition timing + easing guidelines (keep subtle)

Deliverable: a “Foundations” page that clearly lists tokens and usage rules.

### A2. Components (Library)
Design components with variants and states (at minimum):
- Buttons (primary/secondary/ghost/destructive + disabled/loading)
- Inputs (text, textarea) + validation states
- Link Card (core content block for public profile)
- Avatar
- Badge/Tag
- Modal/Sheet (mobile-friendly)
- Toast/Alert
- Tabs or Segmented control
- Search field pattern

For each component include:
- Variants + sizes
- Interaction states (hover/pressed/focus/disabled)
- Accessibility notes (contrast targets, focus rings, keyboard expectations)
- Responsive behavior

Deliverable: component pages with specs + examples.

### A3. Patterns & Guidelines
Provide guidance for:
- Page layout structure and spacing rules
- Empty states (no links, no profiles)
- Error handling and form validation messaging
- Content style guidance (tone, microcopy examples)
- Icon usage rules

---

## Task B — Apply the System (Screens)
Design high-fidelity screens using ONLY your system components.

### Required Screens
1. **Public Profile (mobile)**
   - Link list (at least 5 items)
   - Long text edge cases (long name, long link title)
2. **Directory/Landing (desktop)**
   - Search + results grid/list
   - Empty state for no results
3. **Create/Edit Link (mobile)**
   - Form with validation states
   - Success feedback after saving

### Optional Bonus Screens
- Admin “Reorder Links” interaction (drag-and-drop concept)
- Light mode variant
- Settings / Profile edit

---

## Task C — UX Reasoning (Short)
Write a short rationale (1–2 pages) covering:
- Key design decisions and tradeoffs
- How the system supports scalability and consistency
- Accessibility considerations (contrast, focus, touch targets)
- How your layout supports mobile-first usability

---

## What We Evaluate
- **Design system quality:** token structure, consistency, extensibility
- **Component thinking:** variants, states, edge cases, reusability
- **UX clarity:** hierarchy, readability, mobile ergonomics
- **Accessibility:** contrast, focus visibility, semantics guidance
- **Communication:** specs, documentation, handoff readiness

---

## Timebox
Recommended: **6–10 hours**.

If you go beyond that, keep it focused—quality over quantity.

---

## Submission (Updated)
Submit a single folder or single zip named:

`UIUX_Assessment_<YourName>_LinkHub/`

Include:
1. **Figma link** (view access enabled)
   - Pages should be clearly named: `Foundations`, `Components`, `Patterns`, `Screens`, `Specs`
2. **Exports** folder:
   - Key screens exported as PNG (1x or 2x) and a single PDF overview
3. **Handoff notes** (Markdown or PDF):
   - `README.md` with:
     - Figma link
     - What’s included (tokens, components, screens)
     - Any assumptions
     - Short “how to implement” notes for engineers (token naming, component API suggestions)
4. **UX rationale**:
   - `UX_Rationale.pdf` (or `UX_Rationale.md`)

### Submission Checklist
- Tokens are named systematically (not one-off colors)
- Components include states (hover/pressed/focus/disabled)
- Touch targets meet mobile usability guidance
- Color contrast is considered; focus ring is visible
- Screens are composed from your components (no “special” one-off UI)

---

## Notes
- You do **not** need to write production code for this assessment.
- You may align with existing LinkHub brand colors, but feel free to refine token naming/structure for maintainability.

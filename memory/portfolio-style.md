---
name: portfolio-style
description: Zain's portfolio website design direction and structure preferences
metadata:
  type: project
---

Zain's personal portfolio (this repo) was redesigned 2026-06-11 to a **minimal, classy,
monochrome-dark** aesthetic inspired by ishaand.com — explicitly **not** the previous
cyan/"bluish" engineering-dashboard look. Colour should appear only on interaction
(project cards go grayscale→colour + accent glow on hover).

Key structural decisions the user asked for (honor these on future edits):
- Single page, stripped to essentials: hero · selected work · about · contact. No skills/
  education/experience as separate heavy sections — keep it airy, "classy rather than filling".
- Socials stacked top-right in the header; name (Instrument Serif) at top-left.
- Exactly 8 projects, 2 per row.
- Each project card links to an **on-site** detail page `project.html?p=<slug>` which
  renders `projects/<slug>.md` via marked.js — so he can paste Notion content into Markdown.
  Per-project metadata (title, tags, accent, github/notion links) lives in [[js/project.js]].
- Keep the easter egg: click hero name 5× → Circuit Runner mini-game (recolored monochrome).

Fonts: Instrument Serif (display), Inter (body), JetBrains Mono (labels).
Deploys to GitHub Pages (no build step). Markdown needs an HTTP server, not file://.

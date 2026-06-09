# Zain Naqvi — Portfolio

Single-page portfolio built with pure HTML / CSS / JavaScript.
No build step, no dependencies — fully compatible with GitHub Pages.

## Folder structure

```
Website/
├── index.html          ← all content lives here
├── css/
│   └── style.css       ← theme, layout, animations
├── js/
│   ├── main.js         ← nav, typed text, reveals, PCB canvas, cursor, easter egg
│   └── game.js         ← hidden "Circuit Runner" mini-game
├── assets/
│   ├── profile.jpg     ← REPLACE: your professional photo (portrait, ~4:5)
│   └── projects/       ← ADD: project-1.jpg … project-7.jpg (16:9 works best)
├── legacy/             ← backup of the previous site (safe to delete)
└── README.md
```

## Things to replace (all marked with `PLACEHOLDER` comments in index.html)

| What | Where |
|---|---|
| Profile photo | `assets/profile.jpg` (just overwrite the file) |
| Notion URL | Hero + Contact sections — search `Notion URL` |
| LinkedIn / GitHub URLs | Pre-filled with your current ones; update if needed |
| Project images | Drop `project-1.jpg` … `project-7.jpg` into `assets/projects/` — they appear automatically (a styled placeholder shows until then) |
| Project Notion + GitHub links | Each project card — search `PLACEHOLDER: Notion URL` |
| Coursework chips | Education section |
| Awards | Education section |
| About paragraphs | About section |

Tip: search `index.html` for `PLACEHOLDER` — every editable spot is marked.

## Easter egg

Click the big name in the hero **5 times** → a hidden terminal window opens with
**Circuit Runner**, a playable mini-game (Space / ↑ / tap to jump). High score is
saved in localStorage. Close with ✕, Esc, or clicking outside.

## Deploying to GitHub Pages

1. Push this folder to a repo (e.g. `zain-naqvi-tech.github.io` for a root URL,
   or any repo for `/<repo-name>/`).
2. Repo → Settings → Pages → Source: `main` branch, `/ (root)`.
3. Done — everything is relative paths, so it works at any base URL.

# Zain Naqvi — Portfolio

A minimal, classy, single-page portfolio in pure HTML / CSS / JavaScript.
Dark monochrome theme; colour appears on project hover. No build step — deploys to
GitHub Pages by just pushing the folder.

## Folder structure

```
Website/
├── index.html          ← the one-page site (hero · work · about · contact)
├── project.html        ← project detail page (renders a Markdown file)
├── css/
│   ├── style.css       ← theme + layout
│   └── project.css     ← Markdown article typography
├── js/
│   ├── main.js         ← nav, scrollspy, reveals, easter egg
│   ├── project.js      ← project metadata + Markdown loader
│   └── game.js         ← hidden "Circuit Runner" mini-game
├── projects/           ← one Markdown file per project (your write-ups)
│   ├── dancing-robot.md
│   ├── smart-luggage.md
│   ├── macrosnap.md
│   ├── smart-plant.md
│   ├── stock-predictor.md
│   ├── rag-chatbot.md
│   ├── hand-proximity.md
│   └── movie-recommender.md
├── assets/
│   ├── profile.jpg     ← REPLACE with your photo (portrait, ~4:5)
│   └── projects/       ← ADD project-1.jpg … project-8.jpg (16:10 works best)
├── legacy/             ← backup of the old site (safe to delete)
└── README.md
```

## How the project pages work

Each card on the home page links to `project.html?p=<slug>`. That page:

1. reads the slug from the URL,
2. pulls the title / tags / links / accent colour from the `PROJECTS` map in
   [`js/project.js`](js/project.js), and
3. fetches `projects/<slug>.md` and renders it as the page body.

**To write a project page, just edit its `.md` file** — paste straight from Notion.
Markdown, images, code blocks, and tables all render. This works on GitHub Pages because
the `.md` files are fetched from the same site.

> Note: Markdown loading uses `fetch`, which needs an HTTP server. It works on GitHub
> Pages and any local server, but **not** by double-clicking the file (`file://`). To
> preview locally, run `python -m http.server` in this folder and open `localhost:8000`.

## What to replace (search for `PLACEHOLDER`)

| What | Where |
|---|---|
| Profile photo | overwrite `assets/profile.jpg` |
| Project images | add `assets/projects/project-1.jpg` … `project-8.jpg` (a "no image yet" placeholder shows until then) |
| Project write-ups | edit the files in `projects/` |
| Per-project GitHub / Notion links | the `PROJECTS` map in `js/project.js` (change `'#'` to real URLs — buttons appear automatically) |
| Header & contact social links | `index.html` — LinkedIn / GitHub / Notion |
| Email | `index.html` contact section |

## Easter egg

Click the big name in the hero **5 times** → a hidden window opens with **Circuit Runner**,
a playable mini-game (Space / ↑ / tap to jump). Close with ✕, Esc, or click outside.

## Deploy to GitHub Pages

1. Push this folder to a repo.
2. Settings → Pages → Source: `main` branch, `/ (root)`.
3. Done — all paths are relative, so it works at any base URL.

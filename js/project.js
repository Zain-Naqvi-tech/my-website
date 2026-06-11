/* ============================================================
   Project detail page — loads a Markdown file and renders it.
   URL form:  project.html?p=<slug>
   Body content lives in:  projects/<slug>.md
   Header metadata lives in the PROJECTS map below.
   ============================================================ */
(() => {
    'use strict';

    /* -----------------------------------------------------------
       Per-project metadata. Edit links / accent here.
       (The body of each page is the matching projects/<slug>.md)
       PLACEHOLDER: replace github / notion URLs ("#") below.
       ----------------------------------------------------------- */
    const PROJECTS = {
        'dancing-robot': {
            title: 'Dancing Robot',
            tagline: 'A two-legged Arduino robot that senses, reacts, and dances.',
            year: '2023', kind: 'Personal', accent: '#8b7cff',
            tags: ['Arduino', 'C++', 'Robotics', 'Soldering'],
            github: '#', notion: '#',
        },
        'smart-luggage': {
            title: 'Smart Luggage Transport',
            tagline: 'Automated luggage handling with a QArm, 3D-printed parts, and laser-cut gears.',
            year: '2024', kind: 'Team', accent: '#38bdf8',
            tags: ['QArm', 'Python', 'Automation', '3D Printing'],
            github: '#', notion: '#',
        },
        'macrosnap': {
            title: 'MacroSnap',
            tagline: 'Snap a meal, get full nutrition data and AI diet coaching. Built at DeltaHacks 2025.',
            year: '2025', kind: 'Hackathon', accent: '#4ade80',
            tags: ['Computer Vision', 'Cohere', 'Web', 'Python'],
            github: '#', notion: '#',
        },
        'smart-plant': {
            title: 'Smart Plant Watering System',
            tagline: 'Closed-loop plant care driven by soil moisture, climate, and air quality.',
            year: '2023', kind: 'Personal', accent: '#34d399',
            tags: ['Embedded C', 'Sensors', 'ADC', 'Servo'],
            github: '#', notion: '#',
        },
        'stock-predictor': {
            title: 'Stock Movement Predictor',
            tagline: 'Predicting direction from live news sentiment and price trends.',
            year: '2024', kind: 'Personal', accent: '#fbbf24',
            tags: ['Python', 'NLP', 'Streamlit', 'APIs'],
            github: '#', notion: '#',
        },
        'rag-chatbot': {
            title: 'RAG Chatbot with Local Knowledge',
            tagline: 'A document-grounded chatbot running entirely on local models.',
            year: '2024', kind: 'Personal', accent: '#f472b6',
            tags: ['LLMs', 'FAISS', 'Ollama', 'Python'],
            github: '#', notion: '#',
        },
        'hand-proximity': {
            title: 'Hand Proximity Detection + TTS',
            tagline: 'Real-time computer vision that sees which hand is closest — and says it out loud.',
            year: '2024', kind: 'Personal', accent: '#fb7185',
            tags: ['OpenCV', 'Python', 'Real-time CV', 'TTS'],
            github: '#', notion: '#',
        },
        'movie-recommender': {
            title: 'Movie Recommendation System',
            tagline: 'Content-based film recommendations with TF-IDF and cosine similarity.',
            year: '2024', kind: 'Personal', accent: '#a78bfa',
            tags: ['TF-IDF', 'ML', 'Streamlit', 'NLP'],
            github: '#', notion: '#',
        },
    };

    const params = new URLSearchParams(location.search);
    const slug = params.get('p');
    const data = slug && PROJECTS[slug];

    const $ = (id) => document.getElementById(id);
    document.getElementById('year').textContent = new Date().getFullYear();

    /* unknown / missing slug → friendly bounce back */
    if (!data) {
        $('p-title').textContent = 'Project not found';
        $('p-content').innerHTML =
            '<p>That project doesn’t exist. <a href="index.html#work" data-accent>Back to all work →</a></p>';
        return;
    }

    /* paint accent + header */
    document.documentElement.style.setProperty('--accent', data.accent);
    document.title = `${data.title} — Zain Naqvi`;

    $('p-eyebrow').textContent = `${data.kind} · ${data.year}`;
    $('p-title').textContent = data.title;
    $('p-tagline').textContent = data.tagline;

    $('p-tags').innerHTML = data.tags.map((t) => `<li>${t}</li>`).join('');

    /* action buttons (only render real links) */
    const links = [];
    if (data.github && data.github !== '#')
        links.push(`<a class="btn btn-line" href="${data.github}" target="_blank" rel="noopener">GitHub ↗</a>`);
    if (data.notion && data.notion !== '#')
        links.push(`<a class="btn btn-solid" href="${data.notion}" target="_blank" rel="noopener">Read on Notion ↗</a>`);
    $('p-links').innerHTML = links.join('');

    /* -----------------------------------------------------------
       Load and render the Markdown body
       ----------------------------------------------------------- */
    const render = (md) => {
        marked.setOptions({ breaks: true, gfm: true });
        const dirty = marked.parse(md);
        $('p-content').innerHTML = window.DOMPurify ? DOMPurify.sanitize(dirty) : dirty;
    };

    fetch(`projects/${slug}.md`, { cache: 'no-cache' })
        .then((res) => {
            if (!res.ok) throw new Error(res.status);
            return res.text();
        })
        .then(render)
        .catch(() => {
            const notion = data.notion && data.notion !== '#'
                ? `<p><a class="btn btn-solid" href="${data.notion}" target="_blank" rel="noopener">Read the full write-up on Notion ↗</a></p>`
                : '';
            $('p-content').innerHTML = `
                <p>The write-up for this project hasn’t been added yet.</p>
                <p class="mono" style="color:var(--faint);font-size:13px">
                    Add your content to <code>projects/${slug}.md</code> — paste straight from Notion.
                </p>
                ${notion}`;
        });
})();

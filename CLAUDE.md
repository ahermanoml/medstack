# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

MedStack is a static portfolio site showcasing medical tools and experimental projects built by a physician in Brazil. There is no build step, no bundler, no framework — just plain HTML, CSS, and vanilla JS. Deployed on Vercel.

## Development

No build or install commands. To develop locally, serve the root directory with any static server:

```
python3 -m http.server 8000
```

There are no tests or linters configured.

## Architecture

- **Root level**: `index.html` is the homepage (nav, hero, shipped projects, lab grid, about). `style.css` is the single shared stylesheet used by every page. `script.js` handles nav highlighting and scroll fade-in (IntersectionObserver-based).
- **`lab/`**: Each lab project has two parts:
  1. A landing page (`lab/<project-name>.html`) that lists versioned iterations.
  2. A subdirectory (`lab/<project-name>/`) containing self-contained single-file HTML pages for each version (`v1.html` through `v10.html`).
- **Versioning pattern**: Projects evolve through 10 numbered iterations. "Round 2" refinements add `.2` variants (e.g. `v2.2.html`, `v3.2.html`). A `round1.html` page groups the Round 1 versions. The landing page links to the best/latest versions.
- **`assets/`**: Screenshot images for shipped project cards on the homepage.
- **`vercel.json`**: Enables clean URLs and sets security/caching headers.

## Conventions

- Lab version pages are fully self-contained — all HTML, CSS, and JS live in a single file. They only reference `../style.css` for the shared nav/layout, not for their project-specific UI.
- The shared `style.css` defines CSS custom properties (design tokens) in `:root` — use these for colors, spacing, and typography in any shared layout.
- Lab landing pages follow a strict template: nav with "Back to Lab" link, `.lab-page` main wrapper, project title, and a `.version-list` of links. Copy an existing one when adding a new lab project.
- All content is in English (UI text and descriptions), even though the project names are in Portuguese.

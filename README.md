# Developer Portfolio — Sajjad SHAHPOOR

My personal portfolio site. Software Developer based in Brussels, currently building **Inkbind**.

Live at: **https://sajjadshahpoor.github.io/developer/**

Built as a dependency-free static site (plain HTML / CSS / JS — no build step, no framework), deployed via GitHub Pages.

## Features

- Split-screen layout: sticky intro panel + scrolling content sections (About, Skills, Projects, Journey, GitHub activity, Contact)
- Animated constellation background (canvas particles), respects `prefers-reduced-motion`
- Dark by default, with a light mode toggle (saved across visits)
- Scroll-spy navigation, scroll progress bar, reveal-on-scroll animations
- Typewriter hero tagline, animated stat counters
- Live GitHub stats/streak/top-languages cards (auto-updating, no maintenance needed)
- Contact routes straight to LinkedIn
- Fully responsive, keyboard/focus-accessible

## Local preview

No build tools required. Just serve the folder statically, e.g.:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Structure

```
index.html
assets/
  css/style.css
  js/main.js
```

## Deployment

Hosted on GitHub Pages, serving from the `main` branch root. Any push to `main` updates the live site within a minute or two.

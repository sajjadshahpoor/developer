# sajjadshahpoor.dev — Developer Portfolio

Personal portfolio site for **Sajjad Shahpoor**, Software Developer based in Brussels.

Built as a dependency-free static site (plain HTML / CSS / JS — no build step, no framework) so it can be deployed anywhere instantly, including GitHub Pages.

## Features

- Split-screen layout: sticky intro panel + scrolling content sections (About, Skills, Projects, Journey, GitHub activity, Contact)
- Animated constellation background (canvas particles), respects `prefers-reduced-motion`
- Dark / light theme toggle with saved preference
- Scroll-spy navigation, scroll progress bar, reveal-on-scroll animations
- Typewriter hero tagline, animated stat counters
- Live GitHub stats/streak/top-languages cards (auto-updating, no maintenance needed)
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

## Deploying to GitHub Pages

1. Push this repo to GitHub (see below).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select branch `main`, folder `/ (root)`, then **Save**.
5. Your site will be live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## Before you publish

- Update the placeholder contact email in `index.html` (`mailto:contact@sajjadshahpoor.dev`) to your real address.
- Double-check the Journey section (BeCode / VUB details) and adjust wording/dates to match your actual timeline.
- Optionally add a resume/CV link, custom domain (`CNAME` file), or analytics.

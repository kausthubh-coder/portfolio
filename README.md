# portfolio

A fast, static [Astro](https://astro.build) site for Kausthubh N: a home page that lists the projects, one page per project, and a stack + AI workflow page.

Live at <https://kausthubh.dev>.

## Routes

| Route | What it is |
| --- | --- |
| `/` | identity, the project list, links to the workflow page and email |
| `/projects/<slug>/` | one page per file in `src/content/projects/` |
| `/workflow/` | tools I use every day and build products with, with a last-updated date |
| `/404` | not-found page |
| `/sitemap.xml`, `/robots.txt` | generated at build time |

## Commands

```sh
bun run setup    # deps, this checkout's own port, the skills link, then the doctor
bun run dev      # local dev server on that port
bun run check    # astro check (types, templates, content schema)
bun run build    # check, then build to dist/
bun run shots    # build, then screenshot every route at 1280 and 390, light and dark
```

`bun run shots` fails on console errors, 404s and sideways scrolling. See `.agents/skills/verify-portfolio/SKILL.md`.

```sh
bun run peeks    # re-render the product clips in public/peeks/ (needs ffmpeg on PATH)
bun run peeks -- kriyan --stills   # a contact sheet of one clip, every 400 ms, without encoding
bun run og       # re-render public/og.png, the link preview image
```

## Where things live

```
src/
  content/projects/<slug>.yaml   one project: copy, links, features, stack
  content/projects/<slug>/       its logo and screenshots (optimised at build time)
  content.config.ts              the project schema; a bad field fails the build
  lib/projects.ts                loads projects in order, resolves logos and peeks
  data/site.ts                   site URL, description, email, workflow date
  layouts/BaseLayout.astro       <head>, theme boot, share tags, page transitions
  components/IntroSequence.astro first-visit logo intro on the home page
  components/ThemeToggle.astro   light/dark switch
  pages/                         index, projects/[slug], workflow, 404, sitemap, robots
  styles/global.css              tokens and every shared style
public/                          font, site logo, share image, tool icons
scripts/setup.mjs                setup and doctor; port.mjs runs dev on the checkout's port; remove.mjs removes a worktree
scripts/shots.mjs                the screenshot check
scripts/peeks/                   storyboards and renderer for the product clips
scripts/peeks/shots/<slug>/      real UI states captured for a clip, crossfaded in order
public/peeks/<slug>.mp4          the clip that plays in the home peek and leads the project page
```

## Common edits

- **Add a project:** add `src/content/projects/<slug>.yaml` and a `<slug>/` folder with `logo.png` and screenshots. Copy an existing file for the shape. The home row, its page, the next/previous links, the 404 and the sitemap all pick it up. For a clip, capture a few real states of one interaction at the same size into `scripts/peeks/shots/<slug>/`, add a storyboard to `scripts/peeks/stories.js` and run `bun run peeks -- <slug>`; without one the page falls back to the first screenshot.
- **Update the workflow page:** edit the tool lists in `src/pages/workflow.astro`, then bump `workflowUpdated` in `src/data/site.ts`.
- **Change the domain, description or email:** `src/data/site.ts`.

## How the moving parts work

- **Intro:** plays once per tab on a first visit to `/` (and on reload). It's skipped for reduced motion and when arriving from another page on the site. A CSS failsafe shows the page if the script never finishes.
- **Page transitions:** native cross-document view transitions. Every project logo has `view-transition-class: project-logo`, so the logo morphs between its home row and its page for any number of projects. Browsers without support just navigate.
- **Theme:** follows the system until you press the toggle, then remembers your choice in `localStorage`. The switch wipes in from the button.
- **JavaScript:** all inline and small. The only emitted bundle is Astro's link prefetch.

## Deploy

Vercel builds with `bun run build` and serves `dist/` (see `vercel.json`).

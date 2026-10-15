---
name: verify-portfolio
description: Prove a change to the portfolio site (Astro, static) by building it, serving dist/ on a free port, and screenshotting or driving every route in Chrome at desktop and mobile widths, light and dark. Use after any edit to src/, public/ or the styles, and before saying a change is done.
---

# Verify the portfolio

The site is static Astro. Nothing talks to a backend, so verification is: build, serve `dist/`, look at every route the way a visitor would, and drive any interaction you changed.

## Launch

```sh
bun run shots                         # astro check + build, then shoot every route
bun run shots -- --no-build           # reuse dist/
bun run shots -- --only / --only /projects/kriyan/
bun run shots -- --keep               # leave the preview up to drive it by hand
```

In Git Bash, prefix with `MSYS_NO_PATHCONV=1` when passing `--only /route/`, or Bash rewrites the route into a Windows path.

`scripts/shots.mjs` picks a free port, runs `astro preview` on it, and waits until `/` answers 200. It shoots each route at 1280x800 and 390x844 in light and dark, full page. It skips the one-time intro and roll call by seeding their sessionStorage keys, so shots show the settled page.

Exit code 1 means a page logged a console error, threw, requested a same-origin URL that 404'd, or scrolls sideways. Each failure prints under its route.

## Doctor

- `bun run check` passes (types and Astro diagnostics).
- `ls dist/index.html` exists after a build.
- A browser exists (the doctor's `browser` line). `scripts/browser.mjs` launches Google Chrome through `playwright-core` when it's installed, so nothing downloads locally; on a cloud VM it uses Playwright's Chromium.
- Run the script with Node, not Bun. Under Bun, Playwright's pipe to Chrome hangs on Windows. `bun run shots` already calls `node`.

## Drive

Static shots don't prove interactions. For anything you changed that moves, start the preview with `--keep` and drive it in the T3 preview tools (`preview_open`, `preview_click`, `preview_hover`, `preview_press`, `preview_resize`, `preview_set_appearance`), or with Playwright against the printed URL.

- **Intro:** it plays once per tab. Clear `sessionStorage["kausthubh:intro:v5"]` and reload to see it again. Wait for `document.documentElement.dataset.introState === "done"` before shooting the home page.
- **Project morph:** open a project from home, then press back. In Chrome the project logo morphs between the list and the hero (`view-transition-class: project-logo`). Back must read as going back.
- **Reduced motion:** emulate `prefers-reduced-motion: reduce`. Nothing should slide or fly; everything should still be reachable.
- **Keyboard:** Tab through the page. Every interactive element shows a focus ring, and no element without an action is a tab stop.

Feature recipes live in [`features/`](features/README.md).

## Evidence

Shots and `report.json` go to `.artifacts/shots/<run>/` (gitignored). When reporting a change, name the run folder and the shots that show it, and look at them before saying done. `report.json` holds each page's full height, which the project-page budget below uses.

Budgets this site holds itself to:

- No console errors, no 404s, no sideways scroll at 390.
- Project page height at 1280 at or under 2,800 px (it leads with a full-width screenshot).
- Home is readable without hovering: every project's name and one-liner are visible text.

## Cleanup

The script kills the preview it started on exit, error or Ctrl+C. With `--keep`, stop it with the line it prints (`taskkill` on Windows, `kill` on Linux). Never kill Node or Bun by name, since other worktrees run their own servers. Leave `.artifacts/shots/` in place as evidence.

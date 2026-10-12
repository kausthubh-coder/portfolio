# Project page

Each `src/content/projects/<slug>.yaml` becomes `/projects/<slug>/`, in the order a visitor asks: name, status and platforms, the one-liner, a summary, one solid action button, a lead screenshot, up to three real numbers, what it does, more screens, why it was built, what it is built with, an optional "how it works", and a row of the other projects.

## Sub-features

- `page-morph` the logo morphs between the home row and the hero, both ways.
- `page-strip` screenshots share one height and scroll sideways; with a mouse they can be dragged.
- `page-lightbox` clicking a screenshot opens it large in a dialog; a click or Escape closes it.
- `page-how` "how it works" opens and closes (animated where `interpolate-size` is supported).
- `page-more` a row of the other projects, starting with the next one, grey until pointed at.

## How to get to it (user POV)

- Click a row on home, or a logo on the 404, or a next/previous link on another project page.

## Driving it with the T3 preview tools

Preconditions: preview running; start from `/`.

- **Morph.** Click `a.work-row[data-slug="kriyan"]`. On the project page, the elements with a `view-transition-name` are exactly `root` and `project-logo-kriyan`. A second element with the same name would cancel the transition.
- **Strip.** Run `document.querySelector("[data-shots]").scrollWidth > document.querySelector("[data-shots]").clientWidth`; it's true when there's more than one shot.
- **Lightbox.** Click the first `.shot` (the lead screenshot, or the first in the strip). `document.querySelector("[data-lightbox]").open` is true, and its image `src` is a `/_astro/*.webp`. Press Escape and it's false.
- **Budget.** In `report.json` from `bun run shots`, every `/projects/*` desktop height is at or under 2,800.

- **Clip.** `document.querySelector("[data-clip]")` is playing (`paused === false`). With reduced motion it's paused and shows controls.

## Gotchas

- The clips are rendered, not recorded: `scripts/peeks/stories.js` places overlays in each screenshot's natural pixels. Swap a screenshot and its storyboard positions go stale, so re-render with `bun run peeks -- <slug>` and look at the frames in `.artifacts/peeks/<slug>/`.

- A `#` inside an unquoted YAML string starts a comment and silently cuts the text. Quote any line with ` #`.
- The schema checks `icon` against `simple-icons` exports, so a typo fails the build. Leave `icon` out for tools without one.
- Phone-shaped shots need `mobile: true` so they get the narrow image sizes.

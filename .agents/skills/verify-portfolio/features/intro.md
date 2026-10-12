# First-visit intro

On a first visit to `/` in a tab (and on reload), the logo appears in the centre, the name slides out of it, and the pair flies to its place in the header, then the rest of home follows it in. Keep it: Kausthubh asked for it to stay.

## Sub-features

- `intro-play` it plays on first visit and on reload.
- `intro-skip` it's skipped when arriving from another page on the site, for reduced motion, and on later visits in the same tab.
- `intro-failsafe` if the script never finishes, CSS shows the page after 4.5 s.

## How to get to it (user POV)

- Open `/` in a fresh tab.

## Driving it with the T3 preview tools

Preconditions: `sessionStorage.removeItem("kausthubh:intro:v5")`.

- **Play.** Reload `/`. Right away `document.documentElement.dataset.introState === "running"`; after about 2.6 s it's `"done"`, and `.intro-shell` is gone from the DOM.
- **Landing spot.** Take a snapshot at 2.6 s. The logo and name sit exactly where `.identity-mark` and `.identity-name` are; the intro measures those two elements.
- **Skip.** Open a project, click back home. `introState` is `"done"` immediately.

## Gotchas

- The intro measures `.identity-mark` and `.identity-name`. Renaming or resizing them changes where it lands, and the `--intro-logo-size` and `--intro-name-size` variables must match their sizes.
